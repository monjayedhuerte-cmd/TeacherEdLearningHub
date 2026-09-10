Jangracemed INTERVENTION LEARNING HUB
===================================

IMPORTANT:
This version is designed so you can add future lessons mainly by editing ONE FILE:
    lessons.json

You do NOT need to edit index.html, style.css, or script.js to add a new lesson link.

FOLDER STRUCTURE
----------------
Ms_Grace_Intervention_Learning_Hub/
│
├── index.html
├── style.css
├── script.js
├── lessons.json          <-- EDIT THIS FILE TO ADD LESSONS
└── lessons/
    └── custom-math.html  <-- example local lesson

LESSON TYPES
------------

1) LOCAL HTML FILE
Add your HTML file inside the lessons folder, then add:

{
  "id": "math-004",
  "subject": "Math",
  "grade": "Grade 4",
  "title": "Fractions",
  "description": "My custom fractions lesson.",
  "lessonType": "html",
  "url": "lessons/fractions.html"
}

The user clicks "Open Lesson" and the custom HTML page opens.

2) EXTERNAL WEBSITE
You can link to another website:

{
  "id": "english-004",
  "subject": "English",
  "grade": "Grade 4",
  "title": "Reading Practice",
  "description": "External reading activity.",
  "lessonType": "external",
  "url": "https://your-site.com/lesson"
}

3) BUILT-IN GAME
For the built-in game, use:

"lessonType": "game"

and provide:
"modes": {
  "easy": [ ... ],
  "average": [ ... ],
  "hard": [ ... ]
}

Each question uses:
{
  "question": "2 + 2 = ?",
  "choices": ["3","4","5","6"],
  "answer": 1,
  "hint": "Think of two groups of two.",
  "explanation": "2 + 2 = 4."
}

ANSWER INDEX:
0 = first choice
1 = second choice
2 = third choice
3 = fourth choice

HOW TO ADD A NEW HTML LESSON
----------------------------
1. Create your lesson in VS Code, for example:
   fractions.html

2. Put it here:
   lessons/fractions.html

3. Open lessons.json.

4. Add an object inside the "lessons" array:

{
  "id": "math-004",
  "subject": "Math",
  "grade": "Grade 4",
  "title": "Fractions",
  "description": "Fractions intervention lesson.",
  "lessonType": "html",
  "url": "lessons/fractions.html"
}

5. Save lessons.json.

6. Refresh the website.

That's it.

IMPORTANT PATH RULES
--------------------
If your HTML file is in the lessons folder:
    "url": "lessons/mylesson.html"

If your HTML file is in a different folder:
    "url": "myfolder/mylesson.html"

For an online website:
    "url": "https://example.com/lesson"

RUNNING THE WEBSITE
-------------------
Because the website loads lessons.json using fetch(), do not normally open
index.html directly with file://.

In VS Code:
1. Install "Live Server" if needed.
2. Right-click index.html.
3. Choose "Open with Live Server".

You can also use any local web server.

BACK TO THE HUB
---------------
For local HTML lessons, you may add:
<a href="../index.html">← Back to Jangracemed Hub</a>

You are free to design every HTML lesson differently.
The main website does not need to know the design of the lesson.

OWNER
-----
Jangracemed
Intervention Learning Hub

MAIN FOCUS
----------
Math and English intervention.
