"use strict";

// ============================================================
// JSON FORMATTER
// ============================================================

const jsonInput =
    document.getElementById("jsonInput");

const jsonOutput =
    document.getElementById("jsonOutput");


const formatButton =
    document.getElementById("formatButton");

const minifyButton =
    document.getElementById("minifyButton");

const copyButton =
    document.getElementById("copyButton");

const downloadButton =
    document.getElementById("downloadButton");

const clearButton =
    document.getElementById("clearButton");


const inputStatus =
    document.getElementById("inputStatus");

const outputStatus =
    document.getElementById("outputStatus");


const diagnosticStatus =
    document.getElementById("diagnosticStatus");

const keyCount =
    document.getElementById("keyCount");

const arrayCount =
    document.getElementById("arrayCount");

const jsonSize =
    document.getElementById("jsonSize");


const errorPanel =
    document.getElementById("errorPanel");

const errorMessage =
    document.getElementById("errorMessage");


const successPanel =
    document.getElementById("successPanel");


// ============================================================
// CSV
// ============================================================

const csvJsonInput =
    document.getElementById("csvJsonInput");

const csvOutput =
    document.getElementById("csvOutput");


const convertCsvButton =
    document.getElementById("convertCsvButton");

const copyCsvButton =
    document.getElementById("copyCsvButton");

const downloadCsvButton =
    document.getElementById("downloadCsvButton");

const clearCsvButton =
    document.getElementById("clearCsvButton");


const csvInputStatus =
    document.getElementById("csvInputStatus");

const csvOutputStatus =
    document.getElementById("csvOutputStatus");


const csvSuccessPanel =
    document.getElementById("csvSuccessPanel");


// ============================================================
// NAVIGATION
// ============================================================

const formatterTab =
    document.getElementById("formatterTab");

const csvTab =
    document.getElementById("csvTab");

const formatterTool =
    document.getElementById("formatterTool");

const csvTool =
    document.getElementById("csvTool");


// ============================================================
// ERROR
// ============================================================

function showError(message) {

    if (!errorPanel || !errorMessage) {
        return;
    }

    errorMessage.textContent =
        message;

    errorPanel.style.display =
        "block";
}


function hideError() {

    if (!errorPanel) {
        return;
    }

    errorPanel.style.display =
        "none";
}


// ============================================================
// SUCCESS NOTIFICATIONS
// ============================================================

function showJsonSuccess() {

    if (!successPanel) {
        return;
    }

    successPanel.style.display =
        "block";

    clearTimeout(
        window.jsonSuccessTimer
    );

    window.jsonSuccessTimer =
        setTimeout(() => {

            successPanel.style.display =
                "none";

        }, 5000);
}


function hideJsonSuccess() {

    if (!successPanel) {
        return;
    }

    successPanel.style.display =
        "none";
}


function showCsvSuccess() {

    if (!csvSuccessPanel) {
        return;
    }

    csvSuccessPanel.style.display =
        "block";

    clearTimeout(
        window.csvSuccessTimer
    );

    window.csvSuccessTimer =
        setTimeout(() => {

            csvSuccessPanel.style.display =
                "none";

        }, 5000);
}


function hideCsvSuccess() {

    if (!csvSuccessPanel) {
        return;
    }

    csvSuccessPanel.style.display =
        "none";
}


// ============================================================
// DIAGNOSTICS
// ============================================================

function updateDiagnostics(jsonText) {

    try {

        const parsedJSON =
            JSON.parse(jsonText);

        let keys = 0;
        let arrays = 0;


        function analyze(value) {

            if (Array.isArray(value)) {

                arrays++;


                value.forEach(item => {

                    analyze(item);

                });


                return;
            }


            if (
                value !== null &&
                typeof value === "object"
            ) {

                keys +=
                    Object.keys(value).length;


                Object.values(value).forEach(item => {

                    analyze(item);

                });

            }

        }


        analyze(parsedJSON);


        const bytes =
            new Blob([jsonText]).size;


        diagnosticStatus.textContent =
            "Valid JSON";

        diagnosticStatus.className =
            "diagnostic-value diagnostic-valid";


        keyCount.textContent =
            keys;

        arrayCount.textContent =
            arrays;

        jsonSize.textContent =
            formatBytes(bytes);

    }

    catch {

        diagnosticStatus.textContent =
            "Invalid JSON";

        diagnosticStatus.className =
            "diagnostic-value diagnostic-invalid";


        keyCount.textContent =
            "—";

        arrayCount.textContent =
            "—";

        jsonSize.textContent =
            "—";

    }

}


// ============================================================
// FORMAT BYTES
// ============================================================

function formatBytes(bytes) {

    if (bytes < 1024) {

        return `${bytes} B`;

    }


    if (bytes < 1024 * 1024) {

        return `${(
            bytes / 1024
        ).toFixed(1)} KB`;

    }


    return `${(
        bytes / (1024 * 1024)
    ).toFixed(1)} MB`;

}


// ============================================================
// FORMAT JSON
// ============================================================

formatButton.addEventListener(
    "click",
    async () => {

        const input =
            jsonInput.value.trim();


        hideError();
        hideJsonSuccess();


        if (!input) {

            jsonOutput.value =
                "";

            inputStatus.textContent =
                "Empty";

            outputStatus.textContent =
                "Waiting";


            diagnosticStatus.textContent =
                "Waiting";

            diagnosticStatus.className =
                "diagnostic-value";


            keyCount.textContent =
                "—";

            arrayCount.textContent =
                "—";

            jsonSize.textContent =
                "—";


            return;
        }


        inputStatus.textContent =
            "Processing...";

        outputStatus.textContent =
            "Formatting...";


        try {

            const response =
                await fetch(
                    "/format",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            data: input
                        })
                    }
                );


            const result =
                await response.json();


            if (result.success) {

                jsonOutput.value =
                    result.formatted;


                inputStatus.textContent =
                    "Valid JSON";

                outputStatus.textContent =
                    "Formatted";


                updateDiagnostics(input);

                hideError();

            }

            else {

                jsonOutput.value =
                    "";

                inputStatus.textContent =
                    "Invalid JSON";

                outputStatus.textContent =
                    "Error";


                updateDiagnostics(input);

                showError(
                    result.error
                );

            }

        }

        catch (error) {

            console.error(error);


            inputStatus.textContent =
                "Error";

            outputStatus.textContent =
                "Failed";


            showError(
                "Unable to connect to the JSON server."
            );

        }

    }
);


// ============================================================
// MINIFY
// ============================================================

minifyButton.addEventListener(
    "click",
    () => {

        const input =
            jsonInput.value.trim();


        hideError();
        hideJsonSuccess();


        if (!input) {
            return;
        }


        try {

            const parsedJSON =
                JSON.parse(input);


            const minifiedJSON =
                JSON.stringify(parsedJSON);


            jsonOutput.value =
                minifiedJSON;


            inputStatus.textContent =
                "Valid JSON";

            outputStatus.textContent =
                "Minified";


            updateDiagnostics(input);

        }

        catch {

            jsonOutput.value =
                "";

            inputStatus.textContent =
                "Invalid JSON";

            outputStatus.textContent =
                "Error";


            updateDiagnostics(input);


            showError(
                "Invalid JSON. Please check your syntax."
            );

        }

    }
);


// ============================================================
// COPY JSON
// ============================================================

copyButton.addEventListener(
    "click",
    async () => {

        const output =
            jsonOutput.value;


        if (!output) {
            return;
        }


        try {

            await navigator.clipboard.writeText(
                output
            );


            showJsonSuccess();


            const originalText =
                copyButton.textContent;


            copyButton.textContent =
                "Copied ✓";


            setTimeout(() => {

                copyButton.textContent =
                    originalText;

            }, 1500);

        }

        catch (error) {

            console.error(error);


            showError(
                "Unable to copy JSON."
            );

        }

    }
);


// ============================================================
// DOWNLOAD JSON
// ============================================================

downloadButton.addEventListener(
    "click",
    () => {

        const output =
            jsonOutput.value;


        if (!output) {
            return;
        }


        hideJsonSuccess();


        const file =
            new Blob(
                [output],
                {
                    type:
                        "application/json"
                }
            );


        const url =
            URL.createObjectURL(file);


        const link =
            document.createElement("a");


        link.href =
            url;

        link.download =
            "formatted.json";


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);


        URL.revokeObjectURL(url);

    }
);


// ============================================================
// CLEAR JSON
// ============================================================

clearButton.addEventListener(
    "click",
    () => {

        jsonInput.value =
            "";

        jsonOutput.value =
            "";


        inputStatus.textContent =
            "Ready";

        outputStatus.textContent =
            "Waiting";


        diagnosticStatus.textContent =
            "Waiting";

        diagnosticStatus.className =
            "diagnostic-value";


        keyCount.textContent =
            "—";

        arrayCount.textContent =
            "—";

        jsonSize.textContent =
            "—";


        hideError();
        hideJsonSuccess();


        jsonInput.focus();

    }
);


// ============================================================
// TOOL NAVIGATION
// ============================================================

formatterTab.addEventListener(
    "click",
    () => {

        formatterTool.style.display =
            "block";

        csvTool.style.display =
            "none";


        formatterTab.classList.add(
            "active"
        );

        csvTab.classList.remove(
            "active"
        );

    }
);


csvTab.addEventListener(
    "click",
    () => {

        formatterTool.style.display =
            "none";

        csvTool.style.display =
            "block";


        formatterTab.classList.remove(
            "active"
        );

        csvTab.classList.add(
            "active"
        );

    }
);


// ============================================================
// CONVERT JSON → CSV
// ============================================================

convertCsvButton.addEventListener(
    "click",
    async () => {

        const input =
            csvJsonInput.value.trim();


        hideCsvSuccess();


        if (!input) {

            csvInputStatus.textContent =
                "Empty";

            csvOutputStatus.textContent =
                "Waiting";


            return;
        }


        csvInputStatus.textContent =
            "Processing...";

        csvOutputStatus.textContent =
            "Converting...";


        try {

            const response =
                await fetch(
                    "/json-to-csv",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            data: input
                        })
                    }
                );


            const result =
                await response.json();


            if (result.success) {

                csvOutput.value =
                    result.csv;


                csvInputStatus.textContent =
                    "Valid JSON";

                csvOutputStatus.textContent =
                    "CSV Ready";

            }

            else {

                csvOutput.value =
                    "";

                csvInputStatus.textContent =
                    "Invalid JSON";

                csvOutputStatus.textContent =
                    "Error";


                showError(
                    result.error
                );

            }

        }

        catch (error) {

            console.error(error);


            csvInputStatus.textContent =
                "Error";

            csvOutputStatus.textContent =
                "Failed";


            showError(
                "Unable to connect to the JSON server."
            );

        }

    }
);


// ============================================================
// COPY CSV
// ============================================================

copyCsvButton.addEventListener(
    "click",
    async () => {

        const output =
            csvOutput.value;


        if (!output) {
            return;
        }


        try {

            await navigator.clipboard.writeText(
                output
            );


            // SHOW CSV SUCCESS PANEL

            showCsvSuccess();


            const originalText =
                copyCsvButton.textContent;


            copyCsvButton.textContent =
                "Copied ✓";


            setTimeout(() => {

                copyCsvButton.textContent =
                    originalText;

            }, 1500);

        }

        catch (error) {

            console.error(error);


            showError(
                "Unable to copy CSV."
            );

        }

    }
);


// ============================================================
// DOWNLOAD CSV
// ============================================================

downloadCsvButton.addEventListener(
    "click",
    () => {

        const output =
            csvOutput.value;


        if (!output) {
            return;
        }


        hideCsvSuccess();


        const file =
            new Blob(
                [output],
                {
                    type:
                        "text/csv"
                }
            );


        const url =
            URL.createObjectURL(file);


        const link =
            document.createElement("a");


        link.href =
            url;

        link.download =
            "converted.csv";


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);


        URL.revokeObjectURL(url);

    }
);


// ============================================================
// CLEAR CSV
// ============================================================

clearCsvButton.addEventListener(
    "click",
    () => {

        csvJsonInput.value =
            "";

        csvOutput.value =
            "";


        csvInputStatus.textContent =
            "Ready";

        csvOutputStatus.textContent =
            "Waiting";


        hideError();
        hideCsvSuccess();


        csvJsonInput.focus();

    }
);


// ============================================================
// HIDE NOTIFICATIONS WHEN USER TYPES
// ============================================================

jsonInput.addEventListener(
    "input",
    () => {

        hideJsonSuccess();

    }
);


csvJsonInput.addEventListener(
    "input",
    () => {

        hideCsvSuccess();

    }
);