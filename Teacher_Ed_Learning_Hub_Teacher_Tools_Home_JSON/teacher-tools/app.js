document.addEventListener("DOMContentLoaded", () => {
    loadTeacherTools();
});


async function loadTeacherTools() {

    const toolsGrid = document.getElementById("toolsGrid");

    if (!toolsGrid) {
        console.error("toolsGrid was not found.");
        return;
    }

    try {

        const response = await fetch("teacher-tools.json");

        if (!response.ok) {
            throw new Error("teacher-tools.json could not be loaded.");
        }

        const data = await response.json();

        const tools = Array.isArray(data.tools)
            ? data.tools
            : [];

        // ONLY SHOW AVAILABLE TOOLS
        const availableTools = tools.filter(tool =>
            tool.status === "available" &&
            tool.file &&
            tool.file.trim() !== ""
        );


        if (availableTools.length === 0) {

            toolsGrid.innerHTML = `
                <div class="tools-empty">
                    <div class="empty-icon">
                        <i data-lucide="wrench"></i>
                    </div>

                    <h3>No Teacher Tools Available Yet</h3>

                    <p>
                        Teacher tools will appear here when they become available.
                    </p>
                </div>
            `;

            refreshIcons();
            return;
        }


        // CREATE TOOL CARDS
        toolsGrid.innerHTML = availableTools.map(tool => {

            const title =
                tool.name ||
                tool.title ||
                "Teacher Tool";

            const description =
                tool.description ||
                "A practical resource for teachers.";

            const category =
                tool.category ||
                "TEACHER TOOL";

            const icon =
                tool.icon ||
                "wrench";

            const file =
                tool.file;


            return `
                <article class="tool-card">

                    <div class="tool-card-top">

                        <div class="tool-icon">
                            <i data-lucide="${icon}"></i>
                        </div>

                        <span class="tool-status">
                            AVAILABLE
                        </span>

                    </div>


                    <div class="tool-content">

                        <span class="tool-category">
                            ${escapeHTML(category)}
                        </span>

                        <h3>
                            ${escapeHTML(title)}
                        </h3>

                        <p>
                            ${escapeHTML(description)}
                        </p>

                    </div>


                    <div class="tool-card-footer">

                        <a
                            href="${escapeHTML(file)}"
                            class="tool-button"
                        >
                            <span>Open Tool</span>

                            <i
                                data-lucide="arrow-right"
                            ></i>
                        </a>

                    </div>

                </article>
            `;

        }).join("");


        refreshIcons();


    } catch (error) {

        console.error("Teacher Tools Error:", error);

        toolsGrid.innerHTML = `
            <div class="tools-error">

                <div class="empty-icon">
                    <i data-lucide="alert-circle"></i>
                </div>

                <h3>
                    Unable to Load Teacher Tools
                </h3>

                <p>
                    Please make sure that
                    <strong>teacher-tools.json</strong>
                    is in the same folder as this page.
                </p>

            </div>
        `;

        refreshIcons();
    }
}


/* ========================= */
/* ICON REFRESH */
/* ========================= */

function refreshIcons() {

    if (
        window.lucide &&
        typeof window.lucide.createIcons === "function"
    ) {
        window.lucide.createIcons();
    }

}


/* ========================= */
/* HTML SECURITY */
/* ========================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}