TEACHER ED LEARNING HUB — COMMUNITY FEEDBACK MODERATION

1. Extract this package.
2. Copy the feedback-moderation folder into your teacher-tools folder.
3. Enable Firebase Authentication → Email/Password.
4. Make sure your teacher/admin account exists.
5. In Firebase → Firestore → Rules, use FIRESTORE_RULES.txt.
6. Replace YOUR_ADMIN_UID with your teacher/admin Firebase Authentication UID.
7. Publish the rules.
8. Open teacher-tools/feedback-moderation/index.html.
9. Sign in with the teacher/admin Firebase account.

The page provides:
- Admin login
- Pending / Approved / All filters
- Pending, Approved, and Total counters
- Approve button
- Delete button
- Date/time
- Learner/Parent/Teacher role
- Feedback type
- Mobile responsive Teacher Ed styling

IMPORTANT:
The included logo is a simple placeholder. Replace
feedback-moderation/assets/teacher-ed-logo.png with your actual
Teacher Ed Learning Hub logo if desired.

Also add this tool to your teacher-tools.json:
{
  "id": "community-feedback",
  "name": "Community Feedback",
  "description": "Review, approve, and manage comments and suggestions from learners and parents.",
  "category": "COMMUNITY",
  "icon": "message-square-heart",
  "file": "feedback-moderation/index.html"
}
