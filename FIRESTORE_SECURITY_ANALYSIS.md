# Firestore Security Analysis

Project: `ansar-english-school`
Database: `(default)`
Edition: Standard
Mode: Firestore Native
Location: `asia-south2`

## Collections and Access Patterns

- `navigation`: public website reads all documents and sorts by `order`; admins write menu items.
- `pages`: public website reads documents by slug and may list documents in admin; admins write page content.
- `news`: public website lists latest updates; admins write articles.
- `events`: public website lists latest events; admins write events.
- `gallery`: public website lists gallery items; admins write gallery entries.
- `carousel`: public website lists active hero slides; admins write slides.
- `notices`: public website lists active notices; admins write notices.
- `settings/general`: public website reads school contact/site metadata; admins write settings.

## Query Inventory

- Admin: `collection(name)` reads for pages, news, events, gallery, carousel, notices, settings.
- Admin: `orderBy('order')` for pages/gallery/carousel/navigation-style content.
- Admin: `orderBy('date')` for news and events.
- Public: `collection('navigation').get()`.
- Public: `collection('carousel').get()`.
- Public: `collection('news').get()`.
- Public: `collection('events').get()`.
- Public: `collection('notices').get()`.
- Public: `collection('settings').get()`.
- Public: `doc('pages', slug).get()`.

## Data Model Assumptions

- Public content is intentionally readable because this is a school website.
- Writes are restricted to Firebase Auth users whose email is in the bootstrapped admin allowlist.
- The admin does not store student/user private records in Firestore.
- Rich page content is stored as `bodyHtml`; because admins are trusted publishers, rules limit size but cannot sanitize HTML. Admin accounts must be protected.

## Devil's Advocate Checks

- Public list exploit: acceptable for public website collections; no student/user private collection is exposed.
- Unauthorized write: blocked unless signed in with an allowlisted admin email.
- Update bypass/schema pollution: rules use allowed fields and validator functions on create and update.
- Oversized strings: rules cap string field sizes by content type.
- Type juggling: validators require strings, bools, numbers, or timestamps/date strings as expected.
- Privilege escalation: no user/admin role collection is writable by users; admin is based on Auth token email allowlist.
- Query mismatch: rules allow public reads for content collections used by the public app.
