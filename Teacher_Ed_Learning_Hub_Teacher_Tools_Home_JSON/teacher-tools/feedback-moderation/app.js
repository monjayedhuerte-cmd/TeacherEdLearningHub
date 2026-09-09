import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBGI9oKRKc6D57ja2hEiCLsUuaKr25yt6k",
  authDomain: "teacher-ed-learning-hub.firebaseapp.com",
  projectId: "teacher-ed-learning-hub",
  storageBucket: "teacher-ed-learning-hub.firebasestorage.app",
  messagingSenderId: "240808406762",
  appId: "1:240808406762:web:a6171580ba5ee55bec7193"
};

const app = initializeApp(firebaseConfig),
  auth = getAuth(app),
  db = getFirestore(app);
const loginSection = document.getElementById("loginSection"),
  dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm"),
  email = document.getElementById("email"),
  password = document.getElementById("password");
const loginButton = document.getElementById("loginButton"),
  loginMessage = document.getElementById("loginMessage");
const logoutButton = document.getElementById("logoutButton"),
  feedbackList = document.getElementById("feedbackList");
const statusFilter = document.getElementById("statusFilter"),
  pendingCount = document.getElementById("pendingCount");
const approvedCount = document.getElementById("approvedCount"),
  totalCount = document.getElementById("totalCount");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginButton.disabled = true;
  loginButton.textContent = "Signing in...";
  try {
    await signInWithEmailAndPassword(auth, email.value.trim(), password.value);
  } catch (err) {
    console.error("Firebase Login Error:", err);

    loginMessage.textContent = `Firebase error: ${err.code}`;
    loginMessage.className = "message error";

    loginButton.disabled = false;
    loginButton.textContent = "Sign In";
}
});
logoutButton.addEventListener("click", () => signOut(auth));
statusFilter.addEventListener("change", loadFeedback);

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginSection.classList.add("hidden");
    dashboard.classList.remove("hidden");
    loadFeedback();
  } else {
    loginSection.classList.remove("hidden");
    dashboard.classList.add("hidden");
    loginButton.disabled = false;
    loginButton.textContent = "Sign In";
  }
});

async function loadFeedback() {
  feedbackList.innerHTML = '<div class="loading">Loading feedback...</div>';
  try {
    const snap = await getDocs(query(collection(db, "feedback")));
    const all = [];
    snap.forEach((x) => all.push({ id: x.id, ...x.data() }));
    pendingCount.textContent = all.filter((x) => x.approved === false).length;
    approvedCount.textContent = all.filter((x) => x.approved === true).length;
    totalCount.textContent = all.length;
    let items = all;
    if (statusFilter.value === "pending")
      items = all.filter((x) => x.approved === false);
    if (statusFilter.value === "approved")
      items = all.filter((x) => x.approved === true);
    items.sort((a, b) => dateValue(b.createdAt) - dateValue(a.createdAt));
    if (!items.length) {
      feedbackList.innerHTML =
        '<div class="empty"><h3>No feedback found</h3><p>There are no submissions in this category.</p></div>';
      return;
    }
    feedbackList.innerHTML = items.map(card).join("");
    document.querySelectorAll("[data-action]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        if (btn.dataset.action === "approve") await approve(btn.dataset.id);
        else await remove(btn.dataset.id);
      }),
    );
  } catch (err) {
    console.error(err);
    feedbackList.innerHTML =
      '<div class="empty"><h3>Unable to load feedback</h3><p>' +
      escapeHTML(err.message) +
      "</p></div>";
  }
}

function card(x) {
  const name = x.name || "Community Member",
    role = x.role || "Community Member",
    type = x.type || "Feedback";
  const approved = x.approved === true,
    initial = name.charAt(0).toUpperCase();
  return `<article class="feedback-card">
 <div class="feedback-top"><div class="user"><div class="avatar">${escapeHTML(initial)}</div><div><strong>${escapeHTML(name)}</strong><span>${escapeHTML(role)}</span></div></div>
 <span class="badge ${approved ? "approved" : "pending"}">${approved ? "APPROVED" : "PENDING"}</span></div>
 <span class="feedback-type">${escapeHTML(type)}</span>
 <p class="feedback-message">${escapeHTML(x.message || "")}</p>
 <span class="feedback-date">${formatDate(x.createdAt)}</span>
 <div class="actions">
 ${approved ? "" : `<button class="action-button approve-button" data-action="approve" data-id="${escapeHTML(x.id)}">✓ Approve</button>`}
 <button class="action-button delete-button" data-action="delete" data-id="${escapeHTML(x.id)}">🗑 Delete</button>
 </div></article>`;
}

async function approve(id) {
  if (!confirm("Approve this feedback? It will become visible publicly."))
    return;
  try {
    await updateDoc(doc(db, "feedback", id), { approved: true });
    await loadFeedback();
  } catch (e) {
    console.error(e);
    alert("Unable to approve this feedback.");
  }
}
async function remove(id) {
  if (!confirm("Delete this feedback permanently?")) return;
  try {
    await deleteDoc(doc(db, "feedback", id));
    await loadFeedback();
  } catch (e) {
    console.error(e);
    alert("Unable to delete this feedback.");
  }
}
function dateValue(t) {
  return t && typeof t.toMillis === "function" ? t.toMillis() : 0;
}
function formatDate(t) {
  if (!t) return "Date unavailable";
  try {
    return t
      .toDate()
      .toLocaleString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
  } catch {
    return "Date unavailable";
  }
}
function authError(c) {
  if (c === "auth/invalid-credential" || c === "auth/wrong-password")
    return "Incorrect email or password.";
  if (c === "auth/user-not-found") return "No administrator account was found.";
  if (c === "auth/too-many-requests")
    return "Too many attempts. Please try again later.";
  return "Unable to sign in. Please check your account.";
}
function escapeHTML(v) {
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
