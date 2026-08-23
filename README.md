# Teacher Ed Learning Hub

A single-repository student learning hub for Teacher Ed.

## Main files
- `index.html` — student homepage
- `style.css` — complete visual design
- `app.js` — hub engine
- `lessons.json` — **lesson catalog**; add/edit lessons here without touching `app.js`

## Add a new lesson

1. Create your interactive HTML lesson.
2. Put it in the appropriate folder under `lessons/`.
3. Open `lessons.json`.
4. Copy one lesson object and change its information.
5. Save and push to GitHub.

Example:

```json
{
  "title": "My New Lesson",
  "subject": "Science",
  "grade": "Grade 2",
  "description": "A short description of the lesson.",
  "file": "lessons/science/grade-2/my-new-lesson.html",
  "date": "2026-08-24",
  "featured": false,
  "icon": "flask-conical"
}
```

## You can also link to another GitHub Pages site

The `file` field can be a full URL:

```json
{
  "title": "My Existing Interactive Website",
  "subject": "Mathematics",
  "grade": "Grade 3",
  "description": "An existing lesson hosted on GitHub Pages.",
  "file": "https://yourname.github.io/my-existing-lesson/",
  "date": "2026-08-24",
  "featured": false,
  "icon": "external-link"
}
```

So you can use **both**:
- local HTML lessons inside this repository
- existing GitHub Pages lessons from other repositories

## Important for local testing

Because the hub loads `lessons.json` with `fetch()`, opening `index.html` directly with `file://` may be blocked by the browser.

For local testing, use VS Code Live Server, or deploy the folder to GitHub Pages.

## Icons

The hub uses Lucide icons from the CDN. Use any valid Lucide icon name in the `icon` field.

The architecture is intentionally simple: the hub design stays stable while the lesson catalog grows throughout the school year.
