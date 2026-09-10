JAN GRACEMED INTERVENTION LEARNING HUB
Grade 6 English — Context Clues

FILES
- index.html: main interactive game hub
- style.css: responsive design and animations
- script.js: game logic, scoring, progress, feedback, unlocks
- lessons.json: lesson catalog
- lessons/context-clue.html: lesson landing page
- JanGraceMed.png: branding logo used in header, footer, and favicon

OPENING
Open index.html in a browser.

GAME FLOW
Learn -> Easy -> Average -> Difficult -> Final Challenge

PROGRESS
Basic progress is saved with browser localStorage.

ADDING FUTURE LESSONS
Add a new object to lessons.json and create the corresponding HTML file
inside the lessons folder. Example:
{
  "id": "english-003",
  "subject": "English",
  "grade": "Grade 6",
  "title": "Main Idea",
  "description": "Find the main idea and supporting details.",
  "lessonType": "html",
  "url": "lessons/main-idea.html"
}
