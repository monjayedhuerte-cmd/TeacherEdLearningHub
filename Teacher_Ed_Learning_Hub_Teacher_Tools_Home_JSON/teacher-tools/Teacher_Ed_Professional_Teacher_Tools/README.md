# Teacher Ed Professional Teacher Tools

**TEACHER ED — Teach. Lead. Inspire.**

A production-style, browser-based Teacher Tools platform for primary classrooms. It contains 54 classroom tools, reusable question banks, customizable games, presentation mode, local persistence, import/export, responsive UI, accessibility controls, and Teacher Ed branding.

## Highlights

- 54 working teacher tools
- Reusable question-bank architecture
- Question-based games are content-independent and can be used for any subject/grade
- Edit, duplicate, delete, import, and export questions
- Local browser persistence with `localStorage`
- Fullscreen/presentation mode
- Sound and reduced-motion controls
- Responsive desktop/tablet/mobile UI
- Teacher Ed logo in header, footer, game screens, and web-tab favicon
- No student personal data is sent to a server

## Tool Categories

### Classroom Management
Student Participation, Random Student Picker, Group Maker, Random Group Picker, Volunteer Picker, Seat Number Picker, Classroom Status, Quiet Challenge, Eyes on Me, Class Points.

### Time & Transitions
Classroom Timer, Transition Timer, Think Time, Work Timer, Countdown Challenge, Daily Schedule, Activity Clock, Transition Bell.

### Attention & Focus
Attention Getter, Noise Meter, Focus Challenge, Clap Pattern, Call & Response, Listen & React.

### Brain Breaks
Brain Break, Movement Break, Freeze!, 5-Second Challenge, Quick Brain Challenge, Music Break.

### Quick Class Games
Target Toss, Rocket Race, Mystery Box, Spin the Wheel, Quiz Race, Mystery Question, Balloon Pop, Puzzle Reveal, Word Bee, What's Missing?.

### Assessment
Exit Ticket, Quick Class Poll, True or False, Multiple Choice, Lightning Round, Matching Game, Think-Pair-Share, Oral Question.

### Primary Engagement / Recognition
Emoji Check-In, Mood Meter, Star of the Day, Kindness Challenge, Achievement Board, Celebration Tool.

## How to Run

Serve the project through a local web server because the application loads JSON data files with `fetch()`.

Examples:

```bash
python -m http.server 8000
```

Then open:

`http://localhost:8000/`

You can also deploy the folder to GitHub Pages, Cloudflare Pages, Netlify, Vercel, or another static host.

## Question Workflow

1. Open **Question Bank**.
2. Create a question set.
3. Choose subject, grade, and topic.
4. Add/edit questions.
5. Save the set.
6. Open any compatible game.
7. Select the question set.
8. Customize game settings.
9. Present the activity.

The same question set can be reused in multiple games.

## Import / Export

Question sets use JSON. Use Settings or Question Bank controls to import/export content.

The importer validates the basic question-set structure and generates safe IDs for imported content.

## Branding

The supplied Teacher Ed logo is used for:

- Web-tab favicon
- Header
- Dashboard
- Game/presentation header
- Footer

Assets are in `assets/`.

## QA Checks Completed

- JavaScript syntax check with Node.js
- JSON parsing checks
- Tool registry coverage check
- Static asset/path review
- Local HTTP serving check

