# EDJAY Grade 7 Computer — Types of Algorithms

**Teacher Ed • EDJAY — Teach. Lead. Inspire.**

This interactive static website was created from the uploaded Grade 7 Computer lesson photos and the provided **MASTER PROMPT for Grade 7**.

## Lesson coverage
- Brute Force
- Recursive Algorithm
- Divide and Conquer
- Dynamic Programming
- Greedy Algorithm
- Randomized Algorithm
- Backtracking Algorithm
- Best / Worst / Average case
- A priori / Posterior analysis
- Advantages and limitations discussed in the source material

## Master lesson flow
ENGAGE → CONNECT → EXPLORE → LEARN → SEE IT → GUIDED PRACTICE → PRACTICE → THINK → APPLY → REVIEW → CHECK → MASTER → REFLECT → CELEBRATE

## Files
- `index.html` — complete interactive lesson
- `lesson.html` — same lesson entry page
- `style.css` — responsive EDJAY design
- `script.js` — navigation, progress, activities, feedback, quiz, mastery, localStorage
- `data/lesson.json` — editable lesson data for future Grade 7 lessons
- `assets/logo.png` — uploaded Teacher Ed logo
- `assets/favicon.png` — uploaded logo used as favicon
- `assets/images/` — uploaded source photos preserved as lesson references

## Run locally
Because the site loads `data/lesson.json` with `fetch()`, open it through a static server.

### VS Code Live Server
1. Open the project folder in VS Code.
2. Install/use **Live Server**.
3. Right-click `index.html` → **Open with Live Server**.

You can also host the folder on GitHub Pages, Cloudflare Pages, Netlify, or another static host.

## Adding another lesson
Edit `data/lesson.json` while keeping the same data structure. The JavaScript renders the lesson content, activities, quiz, and mastery challenge from JSON.

## Student progress
Progress is stored locally in the browser with `localStorage`. It does not require a backend or database.

## Source accuracy
The lesson wording is simplified for Grade 7 learners, but the main concepts and terminology are based on the uploaded lesson materials. No external textbook citation was invented.
