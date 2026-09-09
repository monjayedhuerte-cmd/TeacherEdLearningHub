/* =========================================================
   TEACHER ED LEARNING HUB
   COMMUNITY FEEDBACK
   Firebase Firestore
========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIGURATION
========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyBGIGoKRKc6D57ja2hEiCLsUuaKr25yt6k",
    authDomain: "teacher-ed-learning-hub.firebaseapp.com",
    projectId: "teacher-ed-learning-hub",
    storageBucket: "teacher-ed-learning-hub.firebasestorage.app",
    messagingSenderId: "240808406762",
    appId: "1:240808406762:web:a6171580ba5ee55bec7193"
};


/* =========================================================
   INITIALIZE FIREBASE
========================================================= */

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);


/* =========================================================
   GET HTML ELEMENTS
========================================================= */

const feedbackForm =
    document.getElementById("feedbackForm");

const feedbackName =
    document.getElementById("feedbackName");

const feedbackRole =
    document.getElementById("feedbackRole");

const feedbackType =
    document.getElementById("feedbackType");

const feedbackMessage =
    document.getElementById("feedbackMessage");

const feedbackSubmit =
    document.getElementById("feedbackSubmit");

const feedbackStatus =
    document.getElementById("feedbackStatus");

const feedbackList =
    document.getElementById("feedbackList");

const feedbackCount =
    document.getElementById("feedbackCount");

const characterCount =
    document.getElementById("characterCount");


/* =========================================================
   CHECK REQUIRED ELEMENTS
========================================================= */

if (!feedbackForm) {
    console.warn(
        "Community Feedback: #feedbackForm was not found."
    );
}


/* =========================================================
   CHARACTER COUNTER
========================================================= */

if (feedbackMessage && characterCount) {

    feedbackMessage.addEventListener("input", () => {

        characterCount.textContent =
            feedbackMessage.value.length;

    });

}


/* =========================================================
   SUBMIT FEEDBACK
========================================================= */

if (feedbackForm) {

    feedbackForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* ---------------------------------------------
               GET VALUES
            --------------------------------------------- */

            const name =
                feedbackName.value.trim();

            const role =
                feedbackRole.value.trim();

            const type =
                feedbackType.value.trim();

            const message =
                feedbackMessage.value.trim();


            /* ---------------------------------------------
               VALIDATION
            --------------------------------------------- */

            if (!name) {

                showStatus(
                    "Please enter your name.",
                    "error"
                );

                feedbackName.focus();

                return;
            }


            if (!role) {

                showStatus(
                    "Please select your role.",
                    "error"
                );

                feedbackRole.focus();

                return;
            }


            if (!type) {

                showStatus(
                    "Please select a feedback type.",
                    "error"
                );

                feedbackType.focus();

                return;
            }


            if (!message) {

                showStatus(
                    "Please write your comment or suggestion.",
                    "error"
                );

                feedbackMessage.focus();

                return;
            }


            if (message.length < 5) {

                showStatus(
                    "Please write at least 5 characters.",
                    "error"
                );

                feedbackMessage.focus();

                return;
            }


            if (name.length > 50) {

                showStatus(
                    "Your name must be 50 characters or less.",
                    "error"
                );

                return;
            }


            if (message.length > 500) {

                showStatus(
                    "Your message must be 500 characters or less.",
                    "error"
                );

                return;
            }


            /* ---------------------------------------------
               DISABLE SUBMIT BUTTON
            --------------------------------------------- */

            setSubmitLoading(true);


            try {

                /* -----------------------------------------
                   SAVE TO FIRESTORE
                   
                   IMPORTANT:
                   approved is ALWAYS false.
                   The teacher/admin must approve it.
                ----------------------------------------- */

                await addDoc(
                    collection(db, "feedback"),
                    {
                        name: name,
                        role: role,
                        type: type,
                        message: message,

                        approved: false,

                        createdAt: serverTimestamp()
                    }
                );


                /* -----------------------------------------
                   RESET FORM
                ----------------------------------------- */

                feedbackForm.reset();


                if (characterCount) {
                    characterCount.textContent = "0";
                }


                /* -----------------------------------------
                   SUCCESS MESSAGE
                ----------------------------------------- */

                showStatus(
                    "Thank you! Your feedback has been submitted and is waiting for approval.",
                    "success"
                );


            } catch (error) {

                console.error(
                    "Community Feedback Error:",
                    error
                );


                showStatus(
                    "We could not submit your feedback. Please try again.",
                    "error"
                );

            } finally {

                setSubmitLoading(false);

            }

        }
    );

}


/* =========================================================
   LOAD APPROVED FEEDBACK
========================================================= */

async function loadFeedback() {

    if (!feedbackList) {
        return;
    }


    /* ---------------------------------------------
       LOADING STATE
    --------------------------------------------- */

    feedbackList.innerHTML = `
        <div class="feedback-loading">

            <div class="loading-spinner"></div>

            <p>
                Loading community feedback...
            </p>

        </div>
    `;


    try {

        /* -----------------------------------------
           ONLY LOAD APPROVED FEEDBACK
        ----------------------------------------- */

        const feedbackQuery = query(
            collection(db, "feedback"),
            where("approved", "==", true)
        );


        const snapshot =
            await getDocs(feedbackQuery);


        const feedback = [];


        /* -----------------------------------------
           CONVERT FIRESTORE DOCUMENTS
        ----------------------------------------- */

        snapshot.forEach((document) => {

            feedback.push({
                id: document.id,
                ...document.data()
            });

        });


        /* -----------------------------------------
           SORT NEWEST FIRST
        ----------------------------------------- */

        feedback.sort((a, b) => {

            const dateA =
                getTimestampValue(a.createdAt);

            const dateB =
                getTimestampValue(b.createdAt);

            return dateB - dateA;

        });


        /* -----------------------------------------
           UPDATE COUNT
        ----------------------------------------- */

        if (feedbackCount) {

            feedbackCount.textContent =
                feedback.length;

        }


        /* -----------------------------------------
           EMPTY STATE
        ----------------------------------------- */

        if (feedback.length === 0) {

            feedbackList.innerHTML = `
                <div class="feedback-empty">

                    <div class="feedback-empty-icon">
                        <i data-lucide="message-circle"></i>
                    </div>

                    <h4>
                        No community feedback yet
                    </h4>

                    <p>
                        Be the first to share your thoughts!
                    </p>

                </div>
            `;

            refreshIcons();

            return;
        }


        /* -----------------------------------------
           DISPLAY FEEDBACK
        ----------------------------------------- */

        feedbackList.innerHTML =
            feedback
                .map(createFeedbackCard)
                .join("");


        refreshIcons();


    } catch (error) {

        console.error(
            "Unable to load community feedback:",
            error
        );


        if (feedbackCount) {
            feedbackCount.textContent = "0";
        }


        feedbackList.innerHTML = `
            <div class="feedback-empty">

                <div class="feedback-empty-icon">
                    <i data-lucide="alert-circle"></i>
                </div>

                <h4>
                    Unable to load feedback
                </h4>

                <p>
                    Please check your internet connection
                    and try again.
                </p>

            </div>
        `;


        refreshIcons();

    }

}


/* =========================================================
   CREATE FEEDBACK CARD
========================================================= */

function createFeedbackCard(feedback) {

    const name =
        feedback.name || "Community Member";

    const role =
        feedback.role || "Community Member";

    const type =
        feedback.type || "Feedback";

    const message =
        feedback.message || "";


    /* ---------------------------------------------
       SAFE HTML VALUES
    --------------------------------------------- */

    const safeName =
        escapeHTML(name);

    const safeRole =
        escapeHTML(role);

    const safeType =
        escapeHTML(type);

    const safeMessage =
        escapeHTML(message);


    /* ---------------------------------------------
       USER INITIAL
    --------------------------------------------- */

    const initial =
        escapeHTML(
            name
                .charAt(0)
                .toUpperCase()
        );


    /* ---------------------------------------------
       DATE
    --------------------------------------------- */

    const date =
        formatDate(feedback.createdAt);


    /* ---------------------------------------------
       RETURN CARD
    --------------------------------------------- */

    return `
        <article class="feedback-item">

            <div class="feedback-item-top">

                <div class="feedback-user">

                    <div
                        class="feedback-avatar"
                        aria-hidden="true"
                    >
                        ${initial}
                    </div>

                    <div class="feedback-user-info">

                        <strong>
                            ${safeName}
                        </strong>

                        <span>
                            ${safeRole}
                        </span>

                    </div>

                </div>


                <span class="feedback-type">
                    ${safeType}
                </span>

            </div>


            <p class="feedback-message">
                ${safeMessage}
            </p>


            <span class="feedback-date">
                ${date}
            </span>

        </article>
    `;
}


/* =========================================================
   FORMAT FIRESTORE DATE
========================================================= */

function formatDate(timestamp) {

    if (!timestamp) {

        return "Recently submitted";

    }


    try {

        const date =
            timestamp.toDate();


        return date.toLocaleDateString(
            "en-PH",
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );


    } catch (error) {

        return "Recently submitted";

    }

}


/* =========================================================
   GET TIMESTAMP VALUE
========================================================= */

function getTimestampValue(timestamp) {

    if (!timestamp) {
        return 0;
    }


    try {

        if (
            typeof timestamp.toMillis ===
            "function"
        ) {

            return timestamp.toMillis();

        }


        if (
            typeof timestamp.toDate ===
            "function"
        ) {

            return timestamp.toDate().getTime();

        }


        return 0;

    } catch {

        return 0;

    }

}


/* =========================================================
   SUBMIT BUTTON LOADING
========================================================= */

function setSubmitLoading(isLoading) {

    if (!feedbackSubmit) {
        return;
    }


    feedbackSubmit.disabled =
        isLoading;


    if (isLoading) {

        feedbackSubmit.innerHTML = `
            <div class="loading-spinner"
                 style="
                    width:14px;
                    height:14px;
                    margin:0;
                    border-width:2px;
                 ">
            </div>

            <span>
                Submitting...
            </span>
        `;

    } else {

        feedbackSubmit.innerHTML = `
            <i data-lucide="send"></i>
            <span>
                Submit Feedback
            </span>
        `;

        refreshIcons();

    }

}


/* =========================================================
   SHOW STATUS MESSAGE
========================================================= */

function showStatus(message, type) {

    if (!feedbackStatus) {
        return;
    }


    feedbackStatus.textContent =
        message;


    feedbackStatus.className =
        `feedback-status ${type}`;


    /* ---------------------------------------------
       Automatically hide success message
    --------------------------------------------- */

    if (type === "success") {

        setTimeout(() => {

            feedbackStatus.className =
                "feedback-status";

            feedbackStatus.textContent =
                "";

        }, 8000);

    }

}


/* =========================================================
   ESCAPE HTML
   Prevents users from injecting HTML/JavaScript
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
   REFRESH LUCIDE ICONS
========================================================= */

function refreshIcons() {

    if (
        window.lucide &&
        typeof window.lucide.createIcons ===
        "function"
    ) {

        window.lucide.createIcons();

    }

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadFeedback();

        refreshIcons();

    }
);