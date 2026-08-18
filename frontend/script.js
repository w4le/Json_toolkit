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
/* =====================================================
   JSON DIFF
   ===================================================== */

const diffTab = document.getElementById("diffTab");
const diffTool = document.getElementById("diffTool");

const diffInputA = document.getElementById("diffInputA");
const diffInputB = document.getElementById("diffInputB");

const diffAStatus = document.getElementById("diffAStatus");
const diffBStatus = document.getElementById("diffBStatus");

const compareButton = document.getElementById("compareButton");
const clearDiffButton = document.getElementById("clearDiffButton");

const diffOutput = document.getElementById("diffOutput");
const diffCount = document.getElementById("diffCount");


/* ---------- SWITCH TO DIFF ---------- */

if (diffTab) {

    diffTab.addEventListener("click", () => {

        /*
         * Use the existing tool-switching system first.
         * This prevents the formatter and CSV tools
         * from remaining visible underneath Diff.
         */

        document
            .querySelectorAll(".tool-tab")
            .forEach(tab => {
                tab.classList.remove("active");
            });

        diffTab.classList.add("active");


        /*
         * Hide the existing tools.
         */

        const formatterTool =
            document.getElementById("formatterTool");

        const csvTool =
            document.getElementById("csvTool");


        if (formatterTool) {
            formatterTool.style.display = "none";
        }

        if (csvTool) {
            csvTool.style.display = "none";
        }


        /*
         * Show Diff.
         */

        if (diffTool) {
            diffTool.style.display = "block";
        }

    });

}


/* ---------- VALUE FORMATTER ---------- */

function formatDiffValue(value) {

    if (typeof value === "string") {
        return `"${value}"`;
    }

    if (value === null) {
        return "null";
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
}


/* ---------- PATH FORMATTER ---------- */

function formatDiffPath(path) {

    if (!path.length) {
        return "Root";
    }

    return path
        .map(part => {

            if (typeof part === "number") {
                return `[${part}]`;
            }

            return part;

        })
        .join(".");
}


/* ---------- COMPARE VALUES ---------- */

function compareJSONValues(
    valueA,
    valueB,
    path = [],
    differences = []
) {

    /*
     * If both values are objects, compare their keys.
     */

    if (
        valueA !== null &&
        valueB !== null &&
        typeof valueA === "object" &&
        typeof valueB === "object"
    ) {

        /*
         * Arrays
         */

        if (
            Array.isArray(valueA) ||
            Array.isArray(valueB)
        ) {

            if (
                !Array.isArray(valueA) ||
                !Array.isArray(valueB)
            ) {

                differences.push({
                    type: "changed",
                    path: formatDiffPath(path),
                    oldValue: valueA,
                    newValue: valueB
                });

                return differences;
            }


            const maxLength = Math.max(
                valueA.length,
                valueB.length
            );


            for (let i = 0; i < maxLength; i++) {

                const currentPath = [
                    ...path,
                    i
                ];


                if (i >= valueA.length) {

                    differences.push({
                        type: "added",
                        path: formatDiffPath(currentPath),
                        newValue: valueB[i]
                    });

                    continue;
                }


                if (i >= valueB.length) {

                    differences.push({
                        type: "removed",
                        path: formatDiffPath(currentPath),
                        oldValue: valueA[i]
                    });

                    continue;
                }


                compareJSONValues(
                    valueA[i],
                    valueB[i],
                    currentPath,
                    differences
                );

            }

            return differences;
        }


        /*
         * Regular objects
         */

        const keysA = Object.keys(valueA);
        const keysB = Object.keys(valueB);

        const allKeys = new Set([
            ...keysA,
            ...keysB
        ]);


        for (const key of allKeys) {

            const currentPath = [
                ...path,
                key
            ];


            if (!Object.prototype.hasOwnProperty.call(valueA, key)) {

                differences.push({
                    type: "added",
                    path: formatDiffPath(currentPath),
                    newValue: valueB[key]
                });

                continue;
            }


            if (!Object.prototype.hasOwnProperty.call(valueB, key)) {

                differences.push({
                    type: "removed",
                    path: formatDiffPath(currentPath),
                    oldValue: valueA[key]
                });

                continue;
            }


            compareJSONValues(
                valueA[key],
                valueB[key],
                currentPath,
                differences
            );

        }

        return differences;
    }


    /*
     * Primitive values.
     */

    if (JSON.stringify(valueA) !== JSON.stringify(valueB)) {

        differences.push({
            type: "changed",
            path: formatDiffPath(path),
            oldValue: valueA,
            newValue: valueB
        });

    }


    return differences;
}


/* ---------- DISPLAY DIFFERENCES ---------- */

function displayDifferences(differences) {

    diffOutput.innerHTML = "";


    if (differences.length === 0) {

        diffCount.textContent = "No changes";

        diffCount.className =
            "status diagnostic-valid";

        const message =
            document.createElement("div");

        message.className =
            "diff-empty";

        message.textContent =
            "✓ The JSON documents are identical.";

        diffOutput.appendChild(message);

        return;
    }


    diffCount.textContent =
        `${differences.length} change${
            differences.length === 1 ? "" : "s"
        }`;


    diffCount.className =
        "status diff-change";


    differences.forEach(difference => {

        const item =
            document.createElement("div");

        item.className =
            "diff-item";


        const path =
            document.createElement("div");

        path.className =
            "diff-path";

        path.textContent =
            difference.path;


        item.appendChild(path);


        if (difference.type === "changed") {

            const oldValue =
                document.createElement("div");

            oldValue.className =
                "diff-old";

            oldValue.textContent =
                `− ${formatDiffValue(
                    difference.oldValue
                )}`;


            const newValue =
                document.createElement("div");

            newValue.className =
                "diff-new";

            newValue.textContent =
                `+ ${formatDiffValue(
                    difference.newValue
                )}`;


            item.appendChild(oldValue);
            item.appendChild(newValue);

        }


        if (difference.type === "added") {

            const added =
                document.createElement("div");

            added.className =
                "diff-added";

            added.textContent =
                `+ Added: ${formatDiffValue(
                    difference.newValue
                )}`;


            item.appendChild(added);

        }


        if (difference.type === "removed") {

            const removed =
                document.createElement("div");

            removed.className =
                "diff-removed";

            removed.textContent =
                `− Removed: ${formatDiffValue(
                    difference.oldValue
                )}`;


            item.appendChild(removed);

        }


        diffOutput.appendChild(item);

    });

}


/* ---------- COMPARE BUTTON ---------- */

if (compareButton) {

    compareButton.addEventListener(
        "click",
        () => {

            const rawA =
                diffInputA.value.trim();

            const rawB =
                diffInputB.value.trim();


            if (!rawA || !rawB) {

                diffOutput.innerHTML = "";

                const error =
                    document.createElement("div");

                error.className =
                    "diff-error";

                error.textContent =
                    "Please provide JSON in both fields.";

                diffOutput.appendChild(error);

                diffCount.textContent =
                    "Missing JSON";

                diffCount.className =
                    "status diff-change";

                return;
            }


            let jsonA;
            let jsonB;


            try {

                jsonA =
                    JSON.parse(rawA);

                diffAStatus.textContent =
                    "Valid";

                diffAStatus.className =
                    "status diagnostic-valid";

            } catch (error) {

                diffAStatus.textContent =
                    "Invalid";

                diffAStatus.className =
                    "status diagnostic-invalid";


                diffOutput.innerHTML = "";

                const message =
                    document.createElement("div");

                message.className =
                    "diff-error";

                message.textContent =
                    "JSON A is invalid. Please check its syntax.";

                diffOutput.appendChild(message);

                diffCount.textContent =
                    "Invalid JSON";

                diffCount.className =
                    "status diff-change";

                return;
            }


            try {

                jsonB =
                    JSON.parse(rawB);

                diffBStatus.textContent =
                    "Valid";

                diffBStatus.className =
                    "status diagnostic-valid";

            } catch (error) {

                diffBStatus.textContent =
                    "Invalid";

                diffBStatus.className =
                    "status diagnostic-invalid";


                diffOutput.innerHTML = "";

                const message =
                    document.createElement("div");

                message.className =
                    "diff-error";

                message.textContent =
                    "JSON B is invalid. Please check its syntax.";

                diffOutput.appendChild(message);

                diffCount.textContent =
                    "Invalid JSON";

                diffCount.className =
                    "status diff-change";

                return;
            }


            const differences =
                compareJSONValues(
                    jsonA,
                    jsonB
                );


            displayDifferences(
                differences
            );

        }
    );

}


/* ---------- CLEAR DIFF ---------- */

if (clearDiffButton) {

    clearDiffButton.addEventListener(
        "click",
        () => {

            diffInputA.value = "";
            diffInputB.value = "";

            diffAStatus.textContent =
                "Ready";

            diffBStatus.textContent =
                "Ready";

            diffAStatus.className =
                "status";

            diffBStatus.className =
                "status";


            diffOutput.innerHTML =
                "Compare two JSON documents to see their differences.";


            diffCount.textContent =
                "Waiting";

            diffCount.className =
                "status";

        }
    );

}
/* =====================================================
   BATCH JSON PROCESSOR
   ===================================================== */

const batchTab = document.getElementById("batchTab");
const batchTool = document.getElementById("batchTool");

const batchFileInput = document.getElementById("batchFileInput");
const batchFileList = document.getElementById("batchFileList");

const batchFormatButton =
    document.getElementById("batchFormatButton");

const batchMinifyButton =
    document.getElementById("batchMinifyButton");

const batchClearButton =
    document.getElementById("batchClearButton");

const batchResultList =
    document.getElementById("batchResultList");

const batchResultCount =
    document.getElementById("batchResultCount");


let batchFiles = [];


/* ---------- OPEN BATCH TOOL ---------- */

if (batchTab) {

    batchTab.addEventListener("click", () => {

        document
            .querySelectorAll(".tool-tab")
            .forEach(tab => {
                tab.classList.remove("active");
            });

        batchTab.classList.add("active");


        const formatterTool =
            document.getElementById("formatterTool");

        const csvTool =
            document.getElementById("csvTool");

        const diffTool =
            document.getElementById("diffTool");


        if (formatterTool) {
            formatterTool.style.display = "none";
        }

        if (csvTool) {
            csvTool.style.display = "none";
        }

        if (diffTool) {
            diffTool.style.display = "none";
        }

        if (batchTool) {
            batchTool.style.display = "block";
        }

    });

}


/* ---------- FILE SELECTION ---------- */

if (batchFileInput) {

    batchFileInput.addEventListener("change", () => {

        batchFiles =
            Array.from(batchFileInput.files);

        displayBatchFiles();

    });

}


/* ---------- DISPLAY SELECTED FILES ---------- */

function displayBatchFiles() {

    batchFileList.innerHTML = "";


    if (batchFiles.length === 0) {

        const empty =
            document.createElement("div");

        empty.className =
            "batch-empty";

        empty.textContent =
            "No files selected.";

        batchFileList.appendChild(empty);

        return;
    }


    batchFiles.forEach(file => {

        const item =
            document.createElement("div");

        item.className =
            "batch-file";


        const name =
            document.createElement("span");

        name.className =
            "batch-file-name";

        name.textContent =
            file.name;


        const status =
            document.createElement("span");

        status.className =
            "batch-file-status";

        status.textContent =
            "Ready";


        item.appendChild(name);
        item.appendChild(status);

        batchFileList.appendChild(item);

    });

}


/* ---------- READ FILE ---------- */

function readBatchFile(file) {

    return new Promise((resolve, reject) => {

        const reader =
            new FileReader();


        reader.onload = () => {

            resolve(reader.result);

        };


        reader.onerror = () => {

            reject(
                new Error("Unable to read file.")
            );

        };


        reader.readAsText(file);

    });

}


/* ---------- PROCESS FILES ---------- */

async function processBatchFiles(mode) {

    if (batchFiles.length === 0) {

        batchResultList.textContent =
            "Please select at least one JSON file.";

        batchResultCount.textContent =
            "No files";

        return;
    }


    batchResultList.innerHTML = "";

    batchResultCount.textContent =
        "Processing...";


    let successCount = 0;
    let errorCount = 0;


    for (const file of batchFiles) {

        const result =
            document.createElement("div");

        result.className =
            "batch-result";


        const fileName =
            document.createElement("div");

        fileName.className =
            "batch-result-name";

        fileName.textContent =
            file.name;


        result.appendChild(fileName);


        try {

            const text =
                await readBatchFile(file);

            const json =
                JSON.parse(text);


            let output;


            if (mode === "format") {

                output =
                    JSON.stringify(
                        json,
                        null,
                        2
                    );

            } else {

                output =
                    JSON.stringify(json);

            }


            const status =
                document.createElement("div");

            status.className =
                "batch-result-success";

            status.textContent =
                mode === "format"
                    ? "✓ Valid — formatted"
                    : "✓ Valid — minified";


            result.appendChild(status);


            /*
             * Create a download button for
             * the processed file.
             */

            const downloadButton =
                document.createElement("button");

            downloadButton.type =
                "button";

            downloadButton.textContent =
                "Download";


            downloadButton.addEventListener(
                "click",
                () => {

                    const blob =
                        new Blob(
                            [output],
                            {
                                type:
                                    "application/json"
                            }
                        );


                    const url =
                        URL.createObjectURL(blob);


                    const link =
                        document.createElement("a");

                    link.href = url;

                    link.download =
                        mode === "format"
                            ? file.name.replace(
                                /\.json$/i,
                                "-formatted.json"
                            )
                            : file.name.replace(
                                /\.json$/i,
                                "-minified.json"
                            );


                    document.body.appendChild(link);

                    link.click();

                    link.remove();

                    URL.revokeObjectURL(url);

                }
            );


            result.appendChild(
                downloadButton
            );


            successCount++;


        } catch (error) {

            const status =
                document.createElement("div");

            status.className =
                "batch-result-error";

            status.textContent =
                "✕ Invalid JSON";


            result.appendChild(status);

            errorCount++;

        }


        batchResultList.appendChild(
            result
        );

    }


    batchResultCount.textContent =
        `${successCount} successful, ${errorCount} failed`;

}


/* ---------- FORMAT ALL ---------- */

if (batchFormatButton) {

    batchFormatButton.addEventListener(
        "click",
        () => {

            processBatchFiles("format");

        }
    );

}


/* ---------- MINIFY ALL ---------- */

if (batchMinifyButton) {

    batchMinifyButton.addEventListener(
        "click",
        () => {

            processBatchFiles("minify");

        }
    );

}


/* ---------- CLEAR ---------- */

if (batchClearButton) {

    batchClearButton.addEventListener(
        "click",
        () => {

            batchFiles = [];

            batchFileInput.value = "";

            displayBatchFiles();

            batchResultList.textContent =
                "Process your selected files to see results.";

            batchResultCount.textContent =
                "Waiting";

        }
    );

}