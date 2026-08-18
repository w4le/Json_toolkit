from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import json
import csv
import io
import urllib.request
import urllib.error
import urllib.parse
import socket
import ipaddress
import time


app = FastAPI()

# Serve the frontendbackup files
app.mount("/static", StaticFiles(directory="frontend"), name="static")


class JSONRequest(BaseModel):
    data: str


@app.get("/")
def home():
    return FileResponse("frontend/index.html")

@app.get("/robots.txt")
def robots():
    return FileResponse("frontend/robots.txt", media_type="text/plain")

@app.get("/sitemap.xml")
def sitemap():
    return FileResponse("frontend/sitemap.xml", media_type="application/xml")


@app.post("/format")
def format_json(request: JSONRequest):
    try:
        parsed_json = json.loads(request.data)

        formatted_json = json.dumps(
            parsed_json,
            indent=2
        )

        return {
            "success": True,
            "formatted": formatted_json
        }

    except json.JSONDecodeError as error:
        return {
            "success": False,
            "error": f"Invalid JSON: {error}"
        }

@app.post("/json-to-csv")
def json_to_csv(request: JSONRequest):
        try:
            parsed_json = json.loads(request.data)

            # JSON must contain an array of objects
            if not isinstance(parsed_json, list):
                return {
                    "success": False,
                    "error": "JSON must contain an array of objects."
                }

            if not parsed_json:
                return {
                    "success": False,
                    "error": "JSON array is empty."
                }

            if not all(isinstance(item, dict) for item in parsed_json):
                return {
                    "success": False,
                    "error": "Every item in the JSON array must be an object."
                }

            # Collect all possible column names
            fieldnames = []

            for item in parsed_json:
                for key in item.keys():
                    if key not in fieldnames:
                        fieldnames.append(key)

            # Create CSV in memory
            output = io.StringIO()

            writer = csv.DictWriter(
                output,
                fieldnames=fieldnames,
                extrasaction="ignore"
            )

            writer.writeheader()

            writer.writerows(parsed_json)

            return {
                "success": True,
                "csv": output.getvalue()
            }

        except json.JSONDecodeError as error:
            return {
                "success": False,
                "error": f"Invalid JSON: {error}"
            }


class APIRequest(BaseModel):
            method: str
            url: str
            headers: dict[str, str] = {}
            body: str = ""

def is_safe_url(url: str) -> bool:
            try:
                parsed = urllib.parse.urlparse(url)

                if parsed.scheme not in ("http", "https"):
                    return False

                if not parsed.hostname:
                    return False

                hostname = parsed.hostname.lower()

                blocked_hosts = {
                    "localhost",
                    "localhost.localdomain",
                    "metadata.google.internal",
                }

                if hostname in blocked_hosts:
                    return False

                try:
                    ip = ipaddress.ip_address(hostname)

                    if (
                            ip.is_private
                            or ip.is_loopback
                            or ip.is_link_local
                            or ip.is_reserved
                            or ip.is_multicast
                            or ip.is_unspecified
                    ):
                        return False

                except ValueError:
                    # Hostname — resolve it and reject private/internal addresses.
                    try:
                        addresses = socket.getaddrinfo(
                            hostname,
                            None,
                            type=socket.SOCK_STREAM
                        )

                        for address in addresses:
                            resolved_ip = ipaddress.ip_address(
                                address[4][0]
                            )

                            if (
                                    resolved_ip.is_private
                                    or resolved_ip.is_loopback
                                    or resolved_ip.is_link_local
                                    or resolved_ip.is_reserved
                                    or resolved_ip.is_multicast
                                    or resolved_ip.is_unspecified
                            ):
                                return False

                    except socket.gaierror:
                        return False

                return True

            except Exception:
                return False

@app.post("/api/request")
def api_request(request: APIRequest):

            allowed_methods = {
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE"
            }

            method = request.method.upper()

            if method not in allowed_methods:
                return {
                    "success": False,
                    "error": "Unsupported HTTP method."
                }

            if not is_safe_url(request.url):
                return {
                    "success": False,
                    "error": "This URL is not allowed."
                }

            if len(request.body.encode("utf-8")) > 2_000_000:
                return {
                    "success": False,
                    "error": "Request body is too large. Maximum size is 2 MB."
                }

            # Prevent forwarding dangerous proxy/server headers.
            blocked_headers = {
                "host",
                "content-length",
                "connection",
                "transfer-encoding"
            }

            headers = {}

            for key, value in request.headers.items():

                if key.lower() not in blocked_headers:
                    headers[key] = value

            data = None

            if method in {"POST", "PUT", "PATCH"} and request.body:

                data = request.body.encode("utf-8")

                if not any(
                        key.lower() == "content-type"
                        for key in headers
                ):
                    headers["Content-Type"] = "application/json"

            try:

                http_request = urllib.request.Request(
                    request.url,
                    data=data,
                    headers=headers,
                    method=method
                )

                start_time = time.perf_counter()

                with urllib.request.urlopen(
                        http_request,
                        timeout=10
                ) as response:

                    elapsed = round(
                        (time.perf_counter() - start_time) * 1000,
                        2
                    )

                    body = response.read(2_000_001)

                    if len(body) > 2_000_000:
                        return {
                            "success": False,
                            "error": "Response is too large. Maximum size is 2 MB."
                        }

                    try:
                        response_text = body.decode("utf-8")
                    except UnicodeDecodeError:
                        response_text = body.decode(
                            "utf-8",
                            errors="replace"
                        )

                    response_headers = dict(response.headers)

                    return {
                        "success": True,
                        "status": response.status,
                        "statusText": response.reason,
                        "time": elapsed,
                        "headers": response_headers,
                        "body": response_text
                    }

            except urllib.error.HTTPError as error:

                elapsed = round(
                    (time.perf_counter() - start_time) * 1000,
                    2
                )

                try:
                    error_body = error.read(2_000_000).decode(
                        "utf-8",
                        errors="replace"
                    )
                except Exception:
                    error_body = ""

                return {
                    "success": True,
                    "status": error.code,
                    "statusText": error.reason,
                    "time": elapsed,
                    "headers": dict(error.headers),
                    "body": error_body
                }

            except urllib.error.URLError as error:

                return {
                    "success": False,
                    "error": f"Request failed: {error.reason}"
                }

            except Exception as error:

                return {
                    "success": False,
                    "error": f"Request failed: {str(error)}"
                }
