const formatterTab =
    document.getElementById("formatterTab");

const csvTab =
    document.getElementById("csvTab");

const diffTab =
    document.getElementById("diffTab");

const batchTab =
    document.getElementById("batchTab");

const schemaTab =
    document.getElementById("schemaTab");

const apiTab =
    document.getElementById("apiTab");


const formatterTool =
    document.getElementById("formatterTool");

const csvTool =
    document.getElementById("csvTool");

const diffTool =
    document.getElementById("diffTool");

const batchTool =
    document.getElementById("batchTool");

const schemaTool =
    document.getElementById("schemaTool");

const apiTool =
    document.getElementById("apiTool");


/* =====================================================
   JSON FORMATTER
   ===================================================== */

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

const errorPanel =
    document.getElementById("errorPanel");

const errorMessage =
    document.getElementById("errorMessage");

const successPanel =
    document.getElementById("successPanel");

const diagnosticStatus =
    document.getElementById("diagnosticStatus");

const keyCount =
    document.getElementById("keyCount");

const arrayCount =
    document.getElementById("arrayCount");

const jsonSize =
    document.getElementById("jsonSize");


/* ---------- FORMATTER TAB ---------- */

if (formatterTab) {

    formatterTab.addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(".tool-tab")
                .forEach(tab => {
                    tab.classList.remove("active");
                });

            formatterTab.classList.add("active");


            if (formatterTool) {
                formatterTool.style.display = "block";
            }

            if (csvTool) {
                csvTool.style.display = "none";
            }

            if (diffTool) {
                diffTool.style.display = "none";
            }

            if (batchTool) {
                batchTool.style.display = "none";
            }

            if (schemaTool) {
                schemaTool.style.display =
                    "none";
            }
            if (apiTool) {
                apiTool.style.display =
                    "none";
            }
        }
    );

}


/* ---------- UPDATE DIAGNOSTICS ---------- */

function updateDiagnostics(json) {

    let keys = 0;
    let arrays = 0;


    function walk(value) {

        if (Array.isArray(value)) {

            arrays++;

            value.forEach(item => {
                walk(item);
            });

            return;
        }


        if (
            value !== null &&
            typeof value === "object"
        ) {

            keys +=
                Object.keys(value).length;


            Object.values(value)
                .forEach(item => {
                    walk(item);
                });

        }

    }


    walk(json);


    if (keyCount) {
        keyCount.textContent =
            keys;
    }

    if (arrayCount) {
        arrayCount.textContent =
            arrays;
    }

}


/* ---------- FORMAT JSON ---------- */

if (formatButton) {

    formatButton.addEventListener(
        "click",
        () => {

            const raw =
                jsonInput.value.trim();


            if (!raw) {

                inputStatus.textContent =
                    "Empty";

                outputStatus.textContent =
                    "Waiting";

                return;

            }


            try {

                const json =
                    JSON.parse(raw);


                jsonOutput.value =
                    JSON.stringify(
                        json,
                        null,
                        2
                    );


                inputStatus.textContent =
                    "Valid";

                outputStatus.textContent =
                    "Formatted";


                if (diagnosticStatus) {
                    diagnosticStatus.textContent =
                        "Valid JSON";
                }


                updateDiagnostics(json);


                if (jsonSize) {

                    jsonSize.textContent =
                        `${new Blob([raw]).size} bytes`;

                }


                if (errorPanel) {
                    errorPanel.style.display =
                        "none";
                }

            } catch (error) {

                inputStatus.textContent =
                    "Invalid";

                outputStatus.textContent =
                    "Error";


                if (diagnosticStatus) {
                    diagnosticStatus.textContent =
                        "Invalid JSON";
                }


                if (errorPanel) {

                    errorPanel.style.display =
                        "block";

                }


                if (errorMessage) {

                    errorMessage.textContent =
                        error.message;

                }

            }

        }
    );

}


/* ---------- MINIFY ---------- */

if (minifyButton) {

    minifyButton.addEventListener(
        "click",
        () => {

            const raw =
                jsonInput.value.trim();


            if (!raw) {
                return;
            }


            try {

                const json =
                    JSON.parse(raw);


                jsonOutput.value =
                    JSON.stringify(json);


                inputStatus.textContent =
                    "Valid";

                outputStatus.textContent =
                    "Minified";


                if (errorPanel) {
                    errorPanel.style.display =
                        "none";
                }

            } catch (error) {

                inputStatus.textContent =
                    "Invalid";

                outputStatus.textContent =
                    "Error";


                if (errorPanel) {
                    errorPanel.style.display =
                        "block";
                }


                if (errorMessage) {
                    errorMessage.textContent =
                        error.message;
                }

            }

        }
    );

}


/* ---------- COPY ---------- */

if (copyButton) {

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


                if (successPanel) {
                    successPanel.style.display =
                        "block";
                }


                outputStatus.textContent =
                    "Copied";


            } catch (error) {

                outputStatus.textContent =
                    "Copy failed";

            }

        }
    );

}


/* ---------- DOWNLOAD ---------- */

if (downloadButton) {

    downloadButton.addEventListener(
        "click",
        () => {

            const output =
                jsonOutput.value;


            if (!output) {
                return;
            }


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
                "formatted.json";


            document.body.appendChild(link);

            link.click();

            link.remove();

            URL.revokeObjectURL(url);

        }
    );

}


/* ---------- CLEAR FORMATTER ---------- */

if (clearButton) {

    clearButton.addEventListener(
        "click",
        () => {

            jsonInput.value = "";

            jsonOutput.value = "";


            inputStatus.textContent =
                "Ready";

            outputStatus.textContent =
                "Waiting";


            if (errorPanel) {
                errorPanel.style.display =
                    "none";
            }

            if (successPanel) {
                successPanel.style.display =
                    "none";
            }


            if (diagnosticStatus) {
                diagnosticStatus.textContent =
                    "Waiting";
            }

            if (keyCount) {
                keyCount.textContent =
                    "—";
            }

            if (arrayCount) {
                arrayCount.textContent =
                    "—";
            }

            if (jsonSize) {
                jsonSize.textContent =
                    "—";
            }

        }
    );

}


/* =====================================================
   JSON → CSV
   ===================================================== */

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


/* ---------- CSV TAB ---------- */

if (csvTab) {

    csvTab.addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(".tool-tab")
                .forEach(tab => {
                    tab.classList.remove("active");
                });

            csvTab.classList.add("active");


            if (formatterTool) {
                formatterTool.style.display =
                    "none";
            }

            if (csvTool) {
                csvTool.style.display =
                    "block";
            }

            if (diffTool) {
                diffTool.style.display =
                    "none";
            }

            if (batchTool) {
                batchTool.style.display =
                    "none";
            }

            if (schemaTool) {
                schemaTool.style.display =
                    "none";
            }

            if (apiTool) {
    apiTool.style.display = "none";
            }

        }
    );

}


/* ---------- CONVERT CSV ---------- */

if (convertCsvButton) {

    convertCsvButton.addEventListener(
        "click",
        () => {

            const raw =
                csvJsonInput.value.trim();


            if (!raw) {

                csvInputStatus.textContent =
                    "Empty";

                return;

            }


            try {

                const json =
                    JSON.parse(raw);


                if (
                    !Array.isArray(json) ||
                    json.length === 0
                ) {

                    throw new Error(
                        "JSON must be an array of objects."
                    );

                }


                const headers =
                    Array.from(
                        new Set(
                            json.flatMap(
                                item =>
                                    Object.keys(item)
                            )
                        )
                    );


                const rows =
                    json.map(item => {

                        return headers.map(
                            header => {

                                const value =
                                    item[header];

                                if (
                                    value === null ||
                                    value === undefined
                                ) {
                                    return "";
                                }

                                if (
                                    typeof value ===
                                    "object"
                                ) {

                                    return JSON.stringify(
                                        value
                                    );

                                }

                                return String(value);

                            }
                        );

                    });


                const csvRows = [];


                csvRows.push(
                    headers.join(",")
                );


                rows.forEach(row => {

                    csvRows.push(
                        row.map(value => {

                            const escaped =
                                value.replace(
                                    /"/g,
                                    '""'
                                );

                            return `"${escaped}"`;

                        }).join(",")
                    );

                });


                csvOutput.value =
                    csvRows.join("\n");


                csvInputStatus.textContent =
                    "Valid";

                csvOutputStatus.textContent =
                    "Converted";


            } catch (error) {

                csvInputStatus.textContent =
                    "Invalid";

                csvOutputStatus.textContent =
                    "Error";

                csvOutput.value =
                    "";

            }

        }
    );

}


/* ---------- COPY CSV ---------- */

if (copyCsvButton) {

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


                csvOutputStatus.textContent =
                    "Copied";


                if (csvSuccessPanel) {
                    csvSuccessPanel.style.display =
                        "block";
                }

            } catch (error) {

                csvOutputStatus.textContent =
                    "Copy failed";

            }

        }
    );

}


/* ---------- DOWNLOAD CSV ---------- */

if (downloadCsvButton) {

    downloadCsvButton.addEventListener(
        "click",
        () => {

            const output =
                csvOutput.value;


            if (!output) {
                return;
            }


            const blob =
                new Blob(
                    [output],
                    {
                        type:
                            "text/csv"
                    }
                );


            const url =
                URL.createObjectURL(blob);


            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                "converted.csv";


            document.body.appendChild(link);

            link.click();

            link.remove();

            URL.revokeObjectURL(url);

        }
    );

}


/* ---------- CLEAR CSV ---------- */

if (clearCsvButton) {

    clearCsvButton.addEventListener(
        "click",
        () => {

            csvJsonInput.value = "";

            csvOutput.value = "";


            csvInputStatus.textContent =
                "Ready";

            csvOutputStatus.textContent =
                "Waiting";


            if (csvSuccessPanel) {
                csvSuccessPanel.style.display =
                    "none";
            }

        }
    );

}


/* =====================================================
   JSON DIFF
   ===================================================== */

const diffInputA =
    document.getElementById("diffInputA");

const diffInputB =
    document.getElementById("diffInputB");

const compareButton =
    document.getElementById("compareButton");

const clearDiffButton =
    document.getElementById("clearDiffButton");

const diffOutput =
    document.getElementById("diffOutput");

const diffCount =
    document.getElementById("diffCount");

const diffAStatus =
    document.getElementById("diffAStatus");

const diffBStatus =
    document.getElementById("diffBStatus");


/* ---------- DIFF TAB ---------- */

if (diffTab) {

    diffTab.addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(".tool-tab")
                .forEach(tab => {
                    tab.classList.remove("active");
                });

            diffTab.classList.add("active");


            if (formatterTool) {
                formatterTool.style.display =
                    "none";
            }

            if (csvTool) {
                csvTool.style.display =
                    "none";
            }

            if (diffTool) {
                diffTool.style.display =
                    "block";
            }

            if (batchTool) {
                batchTool.style.display =
                    "none";
            }

            if (schemaTool) {
                schemaTool.style.display =
                    "none";
            }
            if (apiTool) {
    apiTool.style.display = "none";
            }

        }
    );

}


/* ---------- COMPARE JSON VALUES ---------- */

function compareJSONValues(
    a,
    b,
    path = ""
) {

    const differences = [];


    if (
        typeof a !==
        typeof b
    ) {

        differences.push({
            type: "changed",
            path: path || "root",
            oldValue: a,
            newValue: b
        });

        return differences;

    }


    if (
        a === null ||
        b === null
    ) {

        if (a !== b) {

            differences.push({
                type: "changed",
                path: path || "root",
                oldValue: a,
                newValue: b
            });

        }

        return differences;

    }


    if (
        typeof a !== "object"
    ) {

        if (a !== b) {

            differences.push({
                type: "changed",
                path: path || "root",
                oldValue: a,
                newValue: b
            });

        }

        return differences;

    }


    if (
        Array.isArray(a) !==
        Array.isArray(b)
    ) {

        differences.push({
            type: "changed",
            path: path || "root",
            oldValue: a,
            newValue: b
        });

        return differences;

    }


    if (Array.isArray(a)) {

        const maxLength =
            Math.max(
                a.length,
                b.length
            );


        for (
            let i = 0;
            i < maxLength;
            i++
        ) {

            const currentPath =
                `${path}[${i}]`;


            if (
                i >= a.length
            ) {

                differences.push({
                    type: "added",
                    path: currentPath,
                    newValue: b[i]
                });

                continue;

            }


            if (
                i >= b.length
            ) {

                differences.push({
                    type: "removed",
                    path: currentPath,
                    oldValue: a[i]
                });

                continue;

            }


            differences.push(
                ...compareJSONValues(
                    a[i],
                    b[i],
                    currentPath
                )
            );

        }


        return differences;

    }


    const keys =
        new Set([
            ...Object.keys(a),
            ...Object.keys(b)
        ]);


    keys.forEach(key => {

        const currentPath =
            path
                ? `${path}.${key}`
                : key;


        if (
            !Object.prototype.hasOwnProperty.call(
                a,
                key
            )
        ) {

            differences.push({
                type: "added",
                path: currentPath,
                newValue: b[key]
            });

            return;

        }


        if (
            !Object.prototype.hasOwnProperty.call(
                b,
                key
            )
        ) {

            differences.push({
                type: "removed",
                path: currentPath,
                oldValue: a[key]
            });

            return;

        }


        differences.push(
            ...compareJSONValues(
                a[key],
                b[key],
                currentPath
            )
        );

    });


    return differences;

}


/* ---------- FORMAT DIFF VALUE ---------- */

function formatDiffValue(value) {

    if (
        typeof value === "string"
    ) {

        return `"${value}"`;

    }


    if (
        value === null
    ) {

        return "null";

    }


    return JSON.stringify(value);

}


/* ---------- DISPLAY DIFFERENCES ---------- */

function displayDifferences(
    differences
) {

    diffOutput.innerHTML = "";


    if (differences.length === 0) {

        diffCount.textContent =
            "No differences";

        diffCount.className =
            "status diagnostic-valid";


        const message =
            document.createElement("div");

        message.className =
            "diff-no-change";

        message.textContent =
            "The JSON documents are identical.";

        diffOutput.appendChild(
            message
        );

        return;

    }


    diffCount.textContent =
        `${differences.length} change${
            differences.length === 1
                ? ""
                : "s"
        }`;


    diffCount.className =
        "status diff-change";


    differences.forEach(
        difference => {

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


            if (
                difference.type ===
                "changed"
            ) {

                const oldValue =
                    document.createElement("div");

                oldValue.className =
                    "diff-removed";

                oldValue.textContent =
                    `− Old: ${formatDiffValue(
                        difference.oldValue
                    )}`;


                item.appendChild(
                    oldValue
                );


                const newValue =
                    document.createElement("div");

                newValue.className =
                    "diff-added";

                newValue.textContent =
                    `+ New: ${formatDiffValue(
                        difference.newValue
                    )}`;


                item.appendChild(
                    newValue
                );

            }


            if (
                difference.type ===
                "added"
            ) {

                const added =
                    document.createElement("div");

                added.className =
                    "diff-added";

                added.textContent =
                    `+ Added: ${formatDiffValue(
                        difference.newValue
                    )}`;


                item.appendChild(
                    added
                );

            }


            if (
                difference.type ===
                "removed"
            ) {

                const removed =
                    document.createElement("div");

                removed.className =
                    "diff-removed";

                removed.textContent =
                    `− Removed: ${formatDiffValue(
                        difference.oldValue
                    )}`;


                item.appendChild(
                    removed
                );

            }


            diffOutput.appendChild(
                item
            );

        }
    );

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


                diffOutput.appendChild(
                    error
                );


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


                diffOutput.appendChild(
                    message
                );


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


                diffOutput.appendChild(
                    message
                );


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

const batchFileInput =
    document.getElementById(
        "batchFileInput"
    );

const batchFileList =
    document.getElementById(
        "batchFileList"
    );

const batchFormatButton =
    document.getElementById(
        "batchFormatButton"
    );

const batchMinifyButton =
    document.getElementById(
        "batchMinifyButton"
    );

const batchClearButton =
    document.getElementById(
        "batchClearButton"
    );

const batchResultList =
    document.getElementById(
        "batchResultList"
    );

const batchResultCount =
    document.getElementById(
        "batchResultCount"
    );


let batchFiles = [];


/* ---------- OPEN BATCH TOOL ---------- */

if (batchTab) {

    batchTab.addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(".tool-tab")
                .forEach(tab => {
                    tab.classList.remove(
                        "active"
                    );
                });


            batchTab.classList.add(
                "active"
            );


            if (formatterTool) {
                formatterTool.style.display =
                    "none";
            }

            if (csvTool) {
                csvTool.style.display =
                    "none";
            }

            if (diffTool) {
                diffTool.style.display =
                    "none";
            }

            if (schemaTool) {
                schemaTool.style.display =
                    "none";
            }

            if (apiTool) {
    apiTool.style.display = "none";
            }

            if (batchTool) {
                batchTool.style.display =
                    "block";
            }


        }
    );

}


/* ---------- FILE SELECTION ---------- */

if (batchFileInput) {

    batchFileInput.addEventListener(
        "change",
        () => {

            batchFiles =
                Array.from(
                    batchFileInput.files
                );


            displayBatchFiles();

        }
    );

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


        batchFileList.appendChild(
            empty
        );


        return;

    }


    batchFiles.forEach(
        file => {

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


            batchFileList.appendChild(
                item
            );

        }
    );

}


/* ---------- READ FILE ---------- */

function readBatchFile(file) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const reader =
                new FileReader();


            reader.onload = () => {

                resolve(
                    reader.result
                );

            };


            reader.onerror = () => {

                reject(
                    new Error(
                        "Unable to read file."
                    )
                );

            };


            reader.readAsText(file);

        }
    );

}


/* ---------- PROCESS FILES ---------- */

async function processBatchFiles(
    mode
) {

    if (batchFiles.length === 0) {

        batchResultList.textContent =
            "Please select at least one JSON file.";


        batchResultCount.textContent =
            "No files";


        return;

    }


    batchResultList.innerHTML =
        "";


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


        result.appendChild(
            fileName
        );


        try {

            const text =
                await readBatchFile(
                    file
                );


            const json =
                JSON.parse(text);


            let output;


            if (
                mode === "format"
            ) {

                output =
                    JSON.stringify(
                        json,
                        null,
                        2
                    );

            } else {

                output =
                    JSON.stringify(
                        json
                    );

            }


            const status =
                document.createElement("div");

            status.className =
                "batch-result-success";

            status.textContent =
                mode === "format"
                    ? "✓ Valid — formatted"
                    : "✓ Valid — minified";


            result.appendChild(
                status
            );


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
                        URL.createObjectURL(
                            blob
                        );


                    const link =
                        document.createElement(
                            "a"
                        );


                    link.href =
                        url;


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


                    document.body.appendChild(
                        link
                    );


                    link.click();


                    link.remove();


                    URL.revokeObjectURL(
                        url
                    );

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


            result.appendChild(
                status
            );


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

            processBatchFiles(
                "format"
            );

        }
    );

}


/* ---------- MINIFY ALL ---------- */

if (batchMinifyButton) {

    batchMinifyButton.addEventListener(
        "click",
        () => {

            processBatchFiles(
                "minify"
            );

        }
    );

}


/* ---------- CLEAR ---------- */

if (batchClearButton) {

    batchClearButton.addEventListener(
        "click",
        () => {

            batchFiles = [];


            batchFileInput.value =
                "";


            displayBatchFiles();


            batchResultList.textContent =
                "Process your selected files to see results.";


            batchResultCount.textContent =
                "Waiting";

        }
    );

}


/* =====================================================
   JSON SCHEMA GENERATOR
   ===================================================== */

const schemaInput =
    document.getElementById(
        "schemaInput"
    );

const schemaOutput =
    document.getElementById(
        "schemaOutput"
    );

const generateSchemaButton =
    document.getElementById(
        "generateSchemaButton"
    );

const copySchemaButton =
    document.getElementById(
        "copySchemaButton"
    );

const downloadSchemaButton =
    document.getElementById(
        "downloadSchemaButton"
    );

const clearSchemaButton =
    document.getElementById(
        "clearSchemaButton"
    );

const schemaInputStatus =
    document.getElementById(
        "schemaInputStatus"
    );

const schemaOutputStatus =
    document.getElementById(
        "schemaOutputStatus"
    );


/* ---------- SWITCH TO SCHEMA ---------- */

if (schemaTab) {

    schemaTab.addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(".tool-tab")
                .forEach(tab => {
                    tab.classList.remove(
                        "active"
                    );
                });


            schemaTab.classList.add(
                "active"
            );


            const tools = [
                formatterTool,
                csvTool,
                diffTool,
                batchTool,
                schemaTool,
                apiTool
            ];


            tools.forEach(
                tool => {

                    if (tool) {
                        tool.style.display =
                            "none";
                    }

                }
            );


            if (schemaTool) {
                schemaTool.style.display =
                    "block";
            }

        }
    );

}


/* ---------- BUILD SCHEMA ---------- */

function buildJsonSchema(value) {

    if (value === null) {

        return {
            type: "null"
        };

    }


    if (Array.isArray(value)) {

        const schema = {
            type: "array"
        };


        if (value.length > 0) {

            schema.items =
                buildJsonSchema(
                    value[0]
                );

        }


        return schema;

    }


    if (
        typeof value ===
        "object"
    ) {

        const properties = {};

        const required = [];


        Object.keys(value)
            .forEach(
                key => {

                    properties[key] =
                        buildJsonSchema(
                            value[key]
                        );


                    required.push(
                        key
                    );

                }
            );


        const schema = {
            type: "object",
            properties: properties
        };


        if (
            required.length > 0
        ) {

            schema.required =
                required;

        }


        return schema;

    }


    if (
        typeof value ===
        "string"
    ) {

        return {
            type: "string"
        };

    }


    if (
        typeof value ===
        "number"
    ) {

        return {

            type:
                Number.isInteger(value)
                    ? "integer"
                    : "number"

        };

    }


    if (
        typeof value ===
        "boolean"
    ) {

        return {
            type: "boolean"
        };

    }


    return {};

}


/* ---------- GENERATE SCHEMA ---------- */

if (generateSchemaButton) {

    generateSchemaButton.addEventListener(
        "click",
        () => {

            const input =
                schemaInput
                    ? schemaInput.value.trim()
                    : "";


            if (!input) {

                if (schemaInputStatus) {

                    schemaInputStatus.textContent =
                        "Enter JSON";

                }


                if (schemaOutputStatus) {

                    schemaOutputStatus.textContent =
                        "Waiting";

                }


                return;

            }


            try {

                const json =
                    JSON.parse(input);


                const schema =
                    buildJsonSchema(
                        json
                    );


                if (schemaOutput) {

                    schemaOutput.value =
                        JSON.stringify(
                            schema,
                            null,
                            2
                        );

                }


                if (schemaInputStatus) {

                    schemaInputStatus.textContent =
                        "Valid JSON";

                }


                if (schemaOutputStatus) {

                    schemaOutputStatus.textContent =
                        "Generated";

                }


            } catch (error) {

                if (schemaOutput) {

                    schemaOutput.value =
                        "";

                }


                if (schemaInputStatus) {

                    schemaInputStatus.textContent =
                        "Invalid JSON";

                }


                if (schemaOutputStatus) {

                    schemaOutputStatus.textContent =
                        "No schema";

                }

            }

        }
    );

}


/* ---------- COPY SCHEMA ---------- */

if (copySchemaButton) {

    copySchemaButton.addEventListener(
        "click",
        async () => {

            const output =
                schemaOutput
                    ? schemaOutput.value.trim()
                    : "";


            if (!output) {
                return;
            }


            try {

                await navigator.clipboard.writeText(
                    output
                );


                if (schemaOutputStatus) {

                    schemaOutputStatus.textContent =
                        "Copied";

                }


            } catch (error) {

                if (schemaOutputStatus) {

                    schemaOutputStatus.textContent =
                        "Copy failed";

                }

            }

        }
    );

}


/* ---------- DOWNLOAD SCHEMA ---------- */

if (downloadSchemaButton) {

    downloadSchemaButton.addEventListener(
        "click",
        () => {

            const output =
                schemaOutput
                    ? schemaOutput.value.trim()
                    : "";


            if (!output) {
                return;
            }


            const blob =
                new Blob(
                    [output],
                    {
                        type:
                            "application/json"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                "schema.json";


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            URL.revokeObjectURL(
                url
            );

        }
    );

}


/* ---------- CLEAR SCHEMA ---------- */

if (clearSchemaButton) {

    clearSchemaButton.addEventListener(
        "click",
        () => {

            if (schemaInput) {

                schemaInput.value =
                    "";

            }


            if (schemaOutput) {

                schemaOutput.value =
                    "";

            }


            if (schemaInputStatus) {

                schemaInputStatus.textContent =
                    "Ready";

            }


            if (schemaOutputStatus) {

                schemaOutputStatus.textContent =
                    "Waiting";

            }


            if (schemaInput) {

                schemaInput.focus();

            }

        }
    );

}
/* =====================================================
   API TESTER
   ===================================================== */

const apiMethod =
    document.getElementById("apiMethod");

const apiUrl =
    document.getElementById("apiUrl");

const apiHeaders =
    document.getElementById("apiHeaders");

const apiBody =
    document.getElementById("apiBody");

const sendApiButton =
    document.getElementById("sendApiButton");

const apiResponse =
    document.getElementById("apiResponse");

const apiResponseStatus =
    document.getElementById("apiResponseStatus");

const copyApiResponseButton =
    document.getElementById(
        "copyApiResponseButton"
    );

const clearApiButton =
    document.getElementById(
        "clearApiButton"
    );

const apiBodySection =
    document.getElementById(
        "apiBodySection"
    );


/* ---------- API TAB ---------- */

if (apiTab) {

    apiTab.addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(".tool-tab")
                .forEach(tab => {
                    tab.classList.remove("active");
                });

            apiTab.classList.add("active");


            const tools = [
                formatterTool,
                csvTool,
                diffTool,
                batchTool,
                schemaTool,
                apiTool
            ];


            tools.forEach(tool => {

                if (tool) {
                    tool.style.display = "none";
                }

            });


            if (apiTool) {
                apiTool.style.display = "block";
            }

        }
    );

}


/* ---------- METHOD BODY VISIBILITY ---------- */

if (apiMethod && apiBodySection) {

    apiMethod.addEventListener(
        "change",
        () => {

            const method =
                apiMethod.value;

            if (
                method === "GET" ||
                method === "DELETE"
            ) {

                apiBodySection.style.display =
                    "none";

            } else {

                apiBodySection.style.display =
                    "block";

            }

        }
    );

}


/* ---------- SEND REQUEST ---------- */

if (sendApiButton) {

    sendApiButton.addEventListener(
        "click",
        async () => {

            const method =
                apiMethod.value;

            const url =
                apiUrl.value.trim();

            const headersRaw =
                apiHeaders.value.trim();

            const body =
                apiBody.value.trim();


            if (!url) {

                apiResponseStatus.textContent =
                    "Missing URL";

                apiResponse.value =
                    "Please enter an API URL.";

                return;

            }


            let headers = {};


            if (headersRaw) {

                try {

                    headers =
                        JSON.parse(headersRaw);

                    if (
                        typeof headers !== "object" ||
                        Array.isArray(headers) ||
                        headers === null
                    ) {

                        throw new Error(
                            "Headers must be a JSON object."
                        );

                    }

                } catch (error) {

                    apiResponseStatus.textContent =
                        "Invalid Headers";

                    apiResponse.value =
                        error.message;

                    return;

                }

            }


            if (body) {

                if (
                    method === "POST" ||
                    method === "PUT" ||
                    method === "PATCH"
                ) {

                    try {

                        JSON.parse(body);

                    } catch (error) {

                        apiResponseStatus.textContent =
                            "Invalid JSON";

                        apiResponse.value =
                            "Request body contains invalid JSON.";

                        return;

                    }

                }

            }


            sendApiButton.disabled =
                true;

            sendApiButton.textContent =
                "Sending...";

            apiResponseStatus.textContent =
                "Sending...";

            apiResponse.value =
                "";


            try {

                const response =
                    await fetch(
                        "/api/request",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                method: method,
                                url: url,
                                headers: headers,
                                body: body
                            })
                        }
                    );


                const result =
                    await response.json();


                if (!result.success) {

                    apiResponseStatus.textContent =
                        "Request Failed";

                    apiResponse.value =
                        result.error ||
                        "Request failed.";

                    return;

                }


                apiResponseStatus.textContent =
                    `${result.status} ${result.statusText} • ${result.time} ms`;


                let output =
                    result.body || "";


                try {

                    const parsed =
                        JSON.parse(output);

                    output =
                        JSON.stringify(
                            parsed,
                            null,
                            2
                        );

                } catch (error) {

                    // Not JSON.
                    // Display response as plain text.

                }


                apiResponse.value =
                    output;

            } catch (error) {

                apiResponseStatus.textContent =
                    "Error";

                apiResponse.value =
                    `Unable to send request: ${error.message}`;

            } finally {

                sendApiButton.disabled =
                    false;

                sendApiButton.textContent =
                    "Send";

            }

        }
    );

}


/* ---------- COPY RESPONSE ---------- */

if (copyApiResponseButton) {

    copyApiResponseButton.addEventListener(
        "click",
        async () => {

            const output =
                apiResponse.value;


            if (!output) {
                return;
            }


            try {

                await navigator.clipboard.writeText(
                    output
                );

                apiResponseStatus.textContent =
                    "Copied";

            } catch (error) {

                apiResponseStatus.textContent =
                    "Copy failed";

            }

        }
    );

}


/* ---------- CLEAR API ---------- */

if (clearApiButton) {

    clearApiButton.addEventListener(
        "click",
        () => {

            apiUrl.value = "";

            apiHeaders.value = "";

            apiBody.value = "";

            apiResponse.value = "";

            apiMethod.value =
                "GET";

            apiResponseStatus.textContent =
                "Waiting";

            if (apiBodySection) {
                apiBodySection.style.display =
                    "none";
            }

        }
    );

}


/* ---------- INITIAL API STATE ---------- */

if (apiBodySection) {
    apiBodySection.style.display =
        "none";
}

/* =====================================================
   FINAL TOOL TAB VISIBILITY CONTROLLER
   ===================================================== */

const allToolTabs = {
    formatterTab: formatterTool,
    csvTab: csvTool,
    diffTab: diffTool,
    batchTab: batchTool,
    schemaTab: schemaTool,
    apiTab: apiTool
};

document
    .querySelectorAll(".tool-tab")
    .forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                Object.values(allToolTabs)
                    .forEach(tool => {

                        if (tool) {
                            tool.style.display =
                                "none";
                        }

                    });

                const selectedTool =
                    allToolTabs[tab.id];

                if (selectedTool) {
                    selectedTool.style.display =
                        "block";
                }

            }
        );

    });