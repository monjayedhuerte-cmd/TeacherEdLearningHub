/* =========================================================
   TEACHER ED - TOS GENERATOR
   VERSION 1.0
========================================================= */


/* =========================================================
   DATA
========================================================= */

let competencies = [];

let competencyId = 0;


/* =========================================================
   GRADE LEVEL PRESETS
========================================================= */

const gradePresets = {

    K: {
        remembering: 40,
        understanding: 40,
        applying: 20,
        analyzing: 0,
        evaluating: 0,
        creating: 0
    },

    1: {
        remembering: 35,
        understanding: 40,
        applying: 25,
        analyzing: 0,
        evaluating: 0,
        creating: 0
    },

    2: {
        remembering: 30,
        understanding: 40,
        applying: 30,
        analyzing: 0,
        evaluating: 0,
        creating: 0
    },

    3: {
        remembering: 30,
        understanding: 35,
        applying: 30,
        analyzing: 5,
        evaluating: 0,
        creating: 0
    },

    4: {
        remembering: 20,
        understanding: 30,
        applying: 30,
        analyzing: 15,
        evaluating: 5,
        creating: 0
    },

    5: {
        remembering: 20,
        understanding: 30,
        applying: 30,
        analyzing: 15,
        evaluating: 5,
        creating: 0
    },

    6: {
        remembering: 20,
        understanding: 30,
        applying: 30,
        analyzing: 15,
        evaluating: 5,
        creating: 0
    },

    7: {
        remembering: 15,
        understanding: 25,
        applying: 30,
        analyzing: 20,
        evaluating: 10,
        creating: 0
    },

    8: {
        remembering: 15,
        understanding: 25,
        applying: 30,
        analyzing: 20,
        evaluating: 10,
        creating: 0
    },

    9: {
        remembering: 15,
        understanding: 25,
        applying: 30,
        analyzing: 20,
        evaluating: 10,
        creating: 0
    },

    10: {
        remembering: 15,
        understanding: 25,
        applying: 30,
        analyzing: 20,
        evaluating: 10,
        creating: 0
    },

    11: {
        remembering: 10,
        understanding: 20,
        applying: 30,
        analyzing: 20,
        evaluating: 15,
        creating: 5
    },

    12: {
        remembering: 10,
        understanding: 20,
        applying: 30,
        analyzing: 20,
        evaluating: 15,
        creating: 5
    }

};


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    addCompetency();
    addCompetency();
    addCompetency();

    applyGradePreset();

    calculateTOS();

});


/* =========================================================
   ADD COMPETENCY
========================================================= */

function addCompetency(name = "", days = 1) {

    competencyId++;

    competencies.push({
        id: competencyId,
        name: name,
        days: Number(days)
    });

    renderCompetencies();

    calculateTOS();

}


/* =========================================================
   RENDER COMPETENCIES
========================================================= */

function renderCompetencies() {

    const body = document.getElementById("competencyBody");

    body.innerHTML = "";

    competencies.forEach((competency, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>
                <strong>${index + 1}</strong>
            </td>

            <td>

                <input
                    type="text"
                    value="${escapeHTML(competency.name)}"
                    placeholder="Enter learning competency..."
                    oninput="updateCompetencyName(${competency.id}, this.value)"
                >

            </td>

            <td>

                <input
                    class="days-input"
                    type="number"
                    min="1"
                    value="${competency.days}"
                    onchange="updateCompetencyDays(${competency.id}, this.value)"
                >

            </td>

            <td class="weight" id="weight-${competency.id}">
                0%
            </td>

            <td class="items" id="items-${competency.id}">
                0
            </td>

            <td>

                <button
                    class="delete-btn"
                    onclick="deleteCompetency(${competency.id})"
                >
                    ×
                </button>

            </td>

        `;

        body.appendChild(row);

    });

}


/* =========================================================
   UPDATE NAME
========================================================= */

function updateCompetencyName(id, value) {

    const competency = competencies.find(item => item.id === id);

    if (competency) {

        competency.name = value;

        calculateTOS();

    }

}


/* =========================================================
   UPDATE DAYS
========================================================= */

function updateCompetencyDays(id, value) {

    const competency = competencies.find(item => item.id === id);

    if (competency) {

        competency.days = Math.max(1, Number(value) || 1);

        calculateTOS();

    }

}


/* =========================================================
   DELETE COMPETENCY
========================================================= */

function deleteCompetency(id) {

    if (competencies.length <= 1) {

        alert("You need at least one competency.");

        return;

    }

    competencies =
        competencies.filter(item => item.id !== id);

    renderCompetencies();

    calculateTOS();

}


/* =========================================================
   APPLY GRADE PRESET
========================================================= */

function applyGradePreset() {

    const grade =
        document.getElementById("gradeLevel").value;

    const preset =
        gradePresets[grade];

    if (!preset) return;


    document.getElementById("remembering").value =
        preset.remembering;

    document.getElementById("understanding").value =
        preset.understanding;

    document.getElementById("applying").value =
        preset.applying;

    document.getElementById("analyzing").value =
        preset.analyzing;

    document.getElementById("evaluating").value =
        preset.evaluating;

    document.getElementById("creating").value =
        preset.creating;


    calculateTOS();

}


/* =========================================================
   GET COGNITIVE DISTRIBUTION
========================================================= */

function getCognitiveDistribution() {

    return {

        remembering:
            Number(document.getElementById("remembering").value) || 0,

        understanding:
            Number(document.getElementById("understanding").value) || 0,

        applying:
            Number(document.getElementById("applying").value) || 0,

        analyzing:
            Number(document.getElementById("analyzing").value) || 0,

        evaluating:
            Number(document.getElementById("evaluating").value) || 0,

        creating:
            Number(document.getElementById("creating").value) || 0

    };

}


/* =========================================================
   CALCULATE COGNITIVE ITEMS
========================================================= */

function calculateCognitiveItems(totalItems) {

    const distribution =
        getCognitiveDistribution();

    const levels = Object.entries(distribution);

    let results = {};

    let rawValues = [];

    let used = 0;


    levels.forEach(([key, percent]) => {

        const exact =
            totalItems * percent / 100;

        const floor =
            Math.floor(exact);

        results[key] = floor;

        used += floor;

        rawValues.push({
            key,
            remainder: exact - floor
        });

    });


    let remaining =
        totalItems - used;


    rawValues
        .sort((a, b) => b.remainder - a.remainder)
        .forEach(item => {

            if (remaining > 0) {

                results[item.key]++;

                remaining--;

            }

        });


    return results;

}


/* =========================================================
   DISTRIBUTE ITEMS TO COMPETENCIES
========================================================= */

function distributeItems(totalItems) {

    const totalDays =
        competencies.reduce(
            (sum, item) => sum + Number(item.days),
            0
        );


    if (totalDays === 0) {

        return competencies.map(() => 0);

    }


    const allocations =
        competencies.map(item => {

            const exact =
                totalItems *
                Number(item.days) /
                totalDays;

            return {

                exact: exact,

                floor: Math.floor(exact),

                remainder:
                    exact - Math.floor(exact)

            };

        });


    let allocated =
        allocations.reduce(
            (sum, item) => sum + item.floor,
            0
        );


    let remaining =
        totalItems - allocated;


    allocations
        .map((item, index) => ({
            ...item,
            index
        }))
        .sort((a, b) =>
            b.remainder - a.remainder
        )
        .forEach(item => {

            if (remaining > 0) {

                allocations[item.index].floor++;

                remaining--;

            }

        });


    return allocations.map(item => item.floor);

}


/* =========================================================
   DISTRIBUTE COGNITIVE LEVELS INSIDE EACH COMPETENCY
========================================================= */

function distributeCognitiveForCompetency(
    competencyItems,
    globalCognitive
) {

    const levels = Object.keys(globalCognitive);

    const totalGlobal =
        Object.values(globalCognitive)
            .reduce((a, b) => a + b, 0);


    if (totalGlobal === 0) {

        return levels.reduce((obj, level) => {

            obj[level] = 0;

            return obj;

        }, {});

    }


    let result = {};

    let calculations = [];

    let allocated = 0;


    levels.forEach(level => {

        const exact =
            competencyItems *
            globalCognitive[level] /
            totalGlobal;

        const floor =
            Math.floor(exact);

        result[level] = floor;

        allocated += floor;

        calculations.push({

            level,
            remainder:
                exact - floor

        });

    });


    let remaining =
        competencyItems - allocated;


    calculations
        .sort((a, b) =>
            b.remainder - a.remainder
        )
        .forEach(item => {

            if (remaining > 0) {

                result[item.level]++;

                remaining--;

            }

        });


    return result;

}


/* =========================================================
   CALCULATE TOS
========================================================= */

function calculateTOS() {

    const totalItems =
        Number(
            document.getElementById("totalItems").value
        ) || 0;


    const totalDays =
        competencies.reduce(
            (sum, item) => sum + Number(item.days),
            0
        );


    const competencyItems =
        distributeItems(totalItems);


    const cognitive =
        getCognitiveDistribution();


    const cognitiveTotal =
        Object.values(cognitive)
            .reduce((a, b) => a + b, 0);


    document.getElementById("cognitiveTotal")
        .textContent =
        `${cognitiveTotal}%`;


    if (cognitiveTotal !== 100) {

        document.getElementById("cognitiveTotal")
            .style.color = "#c0392b";

    } else {

        document.getElementById("cognitiveTotal")
            .style.color = "#16805d";

    }


    /* Update competency table */

    competencies.forEach((competency, index) => {

        const weight =
            totalDays > 0
                ? Number(competency.days) /
                  totalDays *
                  100
                : 0;


        const itemCount =
            competencyItems[index] || 0;


        const weightElement =
            document.getElementById(
                `weight-${competency.id}`
            );


        const itemElement =
            document.getElementById(
                `items-${competency.id}`
            );


        if (weightElement) {

            weightElement.textContent =
                `${weight.toFixed(1)}%`;

        }


        if (itemElement) {

            itemElement.textContent =
                itemCount;

        }

    });


    /* Generate TOS */

    const body =
        document.getElementById("tosBody");

    const footer =
        document.getElementById("tosFooter");


    body.innerHTML = "";
    footer.innerHTML = "";


    let currentItem = 1;


    let grandTotals = {

        days: 0,
        weight: 0,
        remembering: 0,
        understanding: 0,
        applying: 0,
        analyzing: 0,
        evaluating: 0,
        creating: 0,
        total: 0

    };


    competencies.forEach((competency, index) => {

        const itemCount =
            competencyItems[index] || 0;


        const weight =
            totalDays > 0
                ? competency.days /
                  totalDays *
                  100
                : 0;


        const cognitiveItems =
            distributeCognitiveForCompetency(
                itemCount,
                cognitive
            );


        const startItem =
            currentItem;


        const endItem =
            currentItem + itemCount - 1;


        let itemNumbers = "";


        if (itemCount > 0) {

            itemNumbers =
                `${startItem}–${endItem}`;

        }


        currentItem += itemCount;


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(
                        competency.name ||
                        "Untitled Competency"
                    )}
                </strong>
            </td>

            <td>${competency.days}</td>

            <td>
                ${weight.toFixed(1)}%
            </td>

            <td>
                ${cognitiveItems.remembering}
            </td>

            <td>
                ${cognitiveItems.understanding}
            </td>

            <td>
                ${cognitiveItems.applying}
            </td>

            <td>
                ${cognitiveItems.analyzing}
            </td>

            <td>
                ${cognitiveItems.evaluating}
            </td>

            <td>
                ${cognitiveItems.creating}
            </td>

            <td>
                <strong>${itemCount}</strong>
            </td>

            <td class="item-numbers">
                ${itemNumbers}
            </td>

        `;


        body.appendChild(row);


        grandTotals.days +=
            Number(competency.days);

        grandTotals.weight += weight;

        grandTotals.remembering +=
            cognitiveItems.remembering;

        grandTotals.understanding +=
            cognitiveItems.understanding;

        grandTotals.applying +=
            cognitiveItems.applying;

        grandTotals.analyzing +=
            cognitiveItems.analyzing;

        grandTotals.evaluating +=
            cognitiveItems.evaluating;

        grandTotals.creating +=
            cognitiveItems.creating;

        grandTotals.total +=
            itemCount;

    });


    /* Footer */

    footer.innerHTML = `

        <tr>

            <td>TOTAL</td>

            <td>
                ${grandTotals.days}
            </td>

            <td>
                ${grandTotals.weight.toFixed(1)}%
            </td>

            <td>
                ${grandTotals.remembering}
            </td>

            <td>
                ${grandTotals.understanding}
            </td>

            <td>
                ${grandTotals.applying}
            </td>

            <td>
                ${grandTotals.analyzing}
            </td>

            <td>
                ${grandTotals.evaluating}
            </td>

            <td>
                ${grandTotals.creating}
            </td>

            <td>
                ${grandTotals.total}
            </td>

            <td>
                1–${grandTotals.total}
            </td>

        </tr>

    `;


    /* Header */

    const gradeText =
        getGradeText();


    const subject =
        document.getElementById("subject").value ||
        "Subject";


    const term =
        document.getElementById("term").value;


    document.getElementById("tosHeader")
        .innerHTML = `

            <h3>
                TABLE OF SPECIFICATIONS
            </h3>

            <p>
                ${gradeText} •
                ${escapeHTML(subject)} •
                ${term}
            </p>

            <p>
                Total Items: ${totalItems}
            </p>

        `;


    /* Statistics */

    document.getElementById("statItems")
        .textContent = totalItems;


    document.getElementById("statCompetencies")
        .textContent = competencies.length;


    document.getElementById("statDays")
        .textContent = totalDays;

}


/* =========================================================
   GRADE TEXT
========================================================= */

function getGradeText() {

    const grade =
        document.getElementById("gradeLevel").value;


    if (grade === "K") {

        return "Kindergarten";

    }


    return `Grade ${grade}`;

}


/* =========================================================
   RESET
========================================================= */

function resetAll() {

    const confirmReset =
        confirm(
            "Reset the entire TOS generator?"
        );


    if (!confirmReset) return;


    competencies = [];

    competencyId = 0;


    document.getElementById("subject")
        .value = "Mathematics";


    document.getElementById("totalItems")
        .value = 40;


    document.getElementById("gradeLevel")
        .value = "4";


    document.getElementById("term")
        .value = "First Term";


    addCompetency();
    addCompetency();
    addCompetency();


    applyGradePreset();

}


/* =========================================================
   PRINT
========================================================= */

function printTOS() {

    calculateTOS();

    window.print();

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}

/* =========================================================
   DOWNLOAD TOS AS EXCEL
========================================================= */

function downloadExcel() {

    /*
        Make sure the latest calculations
        are reflected in the generated file.
    */

    calculateTOS();


    /* Check if SheetJS is available */

    if (typeof XLSX === "undefined") {

        alert(
            "Excel export library could not be loaded. " +
            "Please check your internet connection and reload the page."
        );

        return;
    }


    /* -----------------------------------------
       BASIC INFORMATION
    ----------------------------------------- */

    const grade =
        getGradeText();

    const subject =
        document.getElementById("subject").value ||
        "Subject";

    const term =
        document.getElementById("term").value;

    const totalItems =
        Number(
            document.getElementById("totalItems").value
        ) || 0;


    /* -----------------------------------------
       COGNITIVE DISTRIBUTION
    ----------------------------------------- */

    const cognitive =
        getCognitiveDistribution();


    const totalCognitive =
        Object.values(cognitive)
            .reduce((a, b) => a + b, 0);


    /* -----------------------------------------
       COMPETENCY CALCULATIONS
    ----------------------------------------- */

    const totalDays =
        competencies.reduce(
            (sum, item) =>
                sum + Number(item.days),
            0
        );


    const competencyItems =
        distributeItems(totalItems);


    /* -----------------------------------------
       SHEET 1 — TOS
    ----------------------------------------- */

    const tosData = [];


    tosData.push([
        "TABLE OF SPECIFICATIONS"
    ]);

    tosData.push([
        `${grade} | ${subject} | ${term}`
    ]);

    tosData.push([
        `Total Number of Items: ${totalItems}`
    ]);

    tosData.push([]);


    tosData.push([

        "Learning Competency",

        "No. of Days",

        "Weight (%)",

        "Remembering",

        "Understanding",

        "Applying",

        "Analyzing",

        "Evaluating",

        "Creating",

        "Total Items",

        "Item Numbers"

    ]);


    let currentItem = 1;


    let grand = {

        days: 0,
        weight: 0,
        remembering: 0,
        understanding: 0,
        applying: 0,
        analyzing: 0,
        evaluating: 0,
        creating: 0,
        total: 0

    };


    competencies.forEach(
        (competency, index) => {

            const items =
                competencyItems[index] || 0;


            const weight =
                totalDays > 0
                    ? Number(competency.days) /
                      totalDays *
                      100
                    : 0;


            const cognitiveItems =
                distributeCognitiveForCompetency(
                    items,
                    cognitive
                );


            const start =
                currentItem;


            const end =
                currentItem + items - 1;


            const itemNumbers =
                items > 0
                    ? `${start}-${end}`
                    : "";


            currentItem += items;


            tosData.push([

                competency.name ||
                    "Untitled Competency",

                Number(competency.days),

                Number(weight.toFixed(2)),

                cognitiveItems.remembering,

                cognitiveItems.understanding,

                cognitiveItems.applying,

                cognitiveItems.analyzing,

                cognitiveItems.evaluating,

                cognitiveItems.creating,

                items,

                itemNumbers

            ]);


            grand.days +=
                Number(competency.days);

            grand.weight += weight;

            grand.remembering +=
                cognitiveItems.remembering;

            grand.understanding +=
                cognitiveItems.understanding;

            grand.applying +=
                cognitiveItems.applying;

            grand.analyzing +=
                cognitiveItems.analyzing;

            grand.evaluating +=
                cognitiveItems.evaluating;

            grand.creating +=
                cognitiveItems.creating;

            grand.total += items;

        }
    );


    tosData.push([

        "TOTAL",

        grand.days,

        Number(grand.weight.toFixed(2)),

        grand.remembering,

        grand.understanding,

        grand.applying,

        grand.analyzing,

        grand.evaluating,

        grand.creating,

        grand.total,

        `1-${grand.total}`

    ]);


    /* -----------------------------------------
       SHEET 2 — EXAM BLUEPRINT
    ----------------------------------------- */

    const blueprintData = [

        [
            "ITEM NUMBER",
            "LEARNING COMPETENCY",
            "COGNITIVE LEVEL"
        ]

    ];


    currentItem = 1;


    competencies.forEach(
        (competency, index) => {

            const items =
                competencyItems[index] || 0;


            const cognitiveItems =
                distributeCognitiveForCompetency(
                    items,
                    cognitive
                );


            const levelOrder = [

                ["Remembering", "remembering"],
                ["Understanding", "understanding"],
                ["Applying", "applying"],
                ["Analyzing", "analyzing"],
                ["Evaluating", "evaluating"],
                ["Creating", "creating"]

            ];


            let itemNumber =
                currentItem;


            levelOrder.forEach(
                ([levelName, levelKey]) => {

                    const count =
                        cognitiveItems[levelKey] || 0;


                    for (
                        let i = 0;
                        i < count;
                        i++
                    ) {

                        blueprintData.push([

                            itemNumber,

                            competency.name ||
                                "Untitled Competency",

                            levelName

                        ]);


                        itemNumber++;

                    }

                }
            );


            currentItem += items;

        }
    );


    /* -----------------------------------------
       SHEET 3 — COGNITIVE DISTRIBUTION
    ----------------------------------------- */

    const cognitiveData = [

        [
            "COGNITIVE LEVEL",
            "PERCENTAGE",
            "NUMBER OF ITEMS"
        ],

        [
            "Remembering",
            cognitive.remembering,
            Math.round(
                totalItems *
                cognitive.remembering /
                100
            )
        ],

        [
            "Understanding",
            cognitive.understanding,
            Math.round(
                totalItems *
                cognitive.understanding /
                100
            )
        ],

        [
            "Applying",
            cognitive.applying,
            Math.round(
                totalItems *
                cognitive.applying /
                100
            )
        ],

        [
            "Analyzing",
            cognitive.analyzing,
            Math.round(
                totalItems *
                cognitive.analyzing /
                100
            )
        ],

        [
            "Evaluating",
            cognitive.evaluating,
            Math.round(
                totalItems *
                cognitive.evaluating /
                100
            )
        ],

        [
            "Creating",
            cognitive.creating,
            Math.round(
                totalItems *
                cognitive.creating /
                100
            )
        ],

        [
            "TOTAL",
            totalCognitive,
            totalItems
        ]

    ];


    /* -----------------------------------------
       SHEET 4 — COMPETENCIES
    ----------------------------------------- */

    const competencyData = [

        [
            "LEARNING COMPETENCY",
            "TEACHING DAYS",
            "WEIGHT (%)",
            "NUMBER OF ITEMS"
        ]

    ];


    competencies.forEach(
        (competency, index) => {

            const weight =
                totalDays > 0
                    ? Number(competency.days) /
                      totalDays *
                      100
                    : 0;


            competencyData.push([

                competency.name ||
                    "Untitled Competency",

                Number(competency.days),

                Number(weight.toFixed(2)),

                competencyItems[index] || 0

            ]);

        }
    );


    competencyData.push([

        "TOTAL",

        totalDays,

        100,

        totalItems

    ]);


    /* -----------------------------------------
       CREATE WORKBOOK
    ----------------------------------------- */

    const workbook =
        XLSX.utils.book_new();


    const tosSheet =
        XLSX.utils.aoa_to_sheet(
            tosData
        );


    const blueprintSheet =
        XLSX.utils.aoa_to_sheet(
            blueprintData
        );


    const cognitiveSheet =
        XLSX.utils.aoa_to_sheet(
            cognitiveData
        );


    const competencySheet =
        XLSX.utils.aoa_to_sheet(
            competencyData
        );


    /* -----------------------------------------
       COLUMN WIDTHS
    ----------------------------------------- */

    tosSheet["!cols"] = [

        { wch: 38 },
        { wch: 12 },
        { wch: 12 },
        { wch: 14 },
        { wch: 15 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 13 },
        { wch: 15 }

    ];


    blueprintSheet["!cols"] = [

        { wch: 15 },
        { wch: 40 },
        { wch: 20 }

    ];


    cognitiveSheet["!cols"] = [

        { wch: 25 },
        { wch: 15 },
        { wch: 18 }

    ];


    competencySheet["!cols"] = [

        { wch: 45 },
        { wch: 18 },
        { wch: 15 },
        { wch: 18 }

    ];


    /* -----------------------------------------
       ADD SHEETS
    ----------------------------------------- */

    XLSX.utils.book_append_sheet(
        workbook,
        tosSheet,
        "TOS"
    );


    XLSX.utils.book_append_sheet(
        workbook,
        blueprintSheet,
        "Exam Blueprint"
    );


    XLSX.utils.book_append_sheet(
        workbook,
        cognitiveSheet,
        "Cognitive Levels"
    );


    XLSX.utils.book_append_sheet(
        workbook,
        competencySheet,
        "Competencies"
    );


    /* -----------------------------------------
       FILE NAME
    ----------------------------------------- */

    const cleanSubject =
        subject
            .replace(/[^a-z0-9]/gi, "_")
            .replace(/_+/g, "_");


    const cleanGrade =
        grade
            .replace(/[^a-z0-9]/gi, "_");


    const filename =
        `TOS_${cleanGrade}_${cleanSubject}.xlsx`;


    /* -----------------------------------------
       DOWNLOAD
    ----------------------------------------- */

    XLSX.writeFile(
        workbook,
        filename
    );

}