from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import json
import csv
import io

app = FastAPI()

# Serve the frontend files
app.mount("/static", StaticFiles(directory="frontend"), name="static")


class JSONRequest(BaseModel):
    data: str


@app.get("/")
def home():
    return FileResponse("frontend/index.html")

@app.get("/robots.txt")
def robots():
    return FileResponse("frontend/robots.txt", media_type="text/plain")


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