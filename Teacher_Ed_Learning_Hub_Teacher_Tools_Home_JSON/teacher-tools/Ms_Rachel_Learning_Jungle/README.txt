MS. RACHEL'S LEARNING JUNGLE

ADD A NEW LESSON:
1. Put the lesson HTML inside the lessons/ folder.
2. Open lessons.json.
3. Copy an existing lesson object.
4. Change title, grade, subject, description, url, status, featured, and dateAdded.
5. Save and refresh the homepage.

Example:
{
  "id": "lesson-003",
  "title": "My New Lesson",
  "grade": "Grade 3",
  "grades": [3],
  "subject": "Science",
  "type": "Interactive Lesson",
  "description": "Short description.",
  "url": "lessons/my-new-lesson.html",
  "status": "published",
  "featured": false,
  "dateAdded": "2026-09-04"
}

IMPORTANT:
The homepage loads lessons.json with fetch(). For local testing, use VS Code Live Server rather than double-clicking index.html.

To add existing websites, replace the href="#" values in the Interactive Websites section of index.html with your website path or URL.
