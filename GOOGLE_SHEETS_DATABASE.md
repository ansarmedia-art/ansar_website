# Google Sheets Content Database

The public website now reads content from this spreadsheet first:

`https://docs.google.com/spreadsheets/d/1sWpN19lKl3hAtXKRleqpyJUThM_q4rrlqWHqBsrsAlc/edit`

The website merges this Sheet with existing Firestore content, so older Firestore events/news can remain visible while new image-based content is added in Sheets.

## Required sharing

Set the spreadsheet sharing to **Anyone with the link can view**. The website only reads the sheet; it does not need edit access.

## Tabs

Use these tab names for content:

- `publicDisclosure`
- `updates`
- `achievements`

For mandatory disclosure only, the site also checks the first spreadsheet tab, then `MandatoryDisclosure`, then `PublicDisclosure`.

## Common columns

Column headers are flexible with spaces/case, but these names are recommended:

- `id`
- `title`
- `description`
- `date`
- `category`
- `published`
- `order`
- `imageUrl`
- `thumbnailUrl`
- `coverImageUrl`
- `imageUrls`
- `eventImages`
- `documentUrl`
- `section`
- `slug`

Use Sheets for image/document-based content and the text connected to those images or files from now onward. Keep main website settings, homepage text, leadership profiles, and custom page content in Firestore through the admin panel.

Use `published` values like `TRUE` or `FALSE`. For faster loading, put a small compressed image in `thumbnailUrl` or `coverImageUrl` for cards, and put full-size images on new lines in `imageUrls` or `eventImages` for the detail page.

## Mandatory disclosure example

| id | title | section | documentUrl | order | published |
| --- | --- | --- | --- | --- | --- |
| affiliation-certificate | Affiliation Certificate | General Information | https://example.com/file.pdf | 1 | TRUE |

## Updates example

| id | title | category | description | date | thumbnailUrl | coverImageUrl | imageUrls | published |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| annual-day-2026 | Annual Day 2026 | Events | Celebration details here | 2026-06-27 | https://example.com/thumb.jpg | https://example.com/cover.jpg | https://example.com/1.jpg | TRUE |

Use category `News` for news cards and `Events` for event cards.
