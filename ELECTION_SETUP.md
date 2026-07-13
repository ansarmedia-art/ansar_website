# School Election 2026 setup

The website UI is connected to the existing Google Apps Script Web App in
`googleSheetsConfig.js`. Complete these steps before accepting real votes.

## 1. Update and initialize Apps Script

1. Open the Apps Script project currently deployed at the configured Web App URL.
2. Replace its code with `GOOGLE_SHEETS_APPS_SCRIPT.gs` from this repository.
3. In **Project Settings**, set the time zone to **(GMT+05:30) India Standard Time**.
4. Select `setupElectionSheets` in the function selector and click **Run**.
5. Approve the spreadsheet permissions if Google asks.
6. Open **Execution log** and securely copy the returned `shareKey`. Do not put this key in source control or a public Sheet.

The setup function creates:

- `electionSettings` — dates, open/closed status and audience options.
- `electionCandidates` — positions, candidates, photos, symbols and manifesto text.
- `electionVotes` — append-only daily votes. Do not delete or rename this tab during the campaign.

## 2. Deploy a new Web App version

1. Click **Deploy → Manage deployments**.
2. Edit the existing Web App deployment.
3. Choose **New version**.
4. Execute as **Me** and keep access as **Anyone**.
5. Deploy and confirm that the `/exec` URL has not changed. If it changed, update `writeEndpoint` in `googleSheetsConfig.js` and redeploy the website.

## 3. Add candidates later

Add one row per student to `electionCandidates`.

| Column | Example |
| --- | --- |
| `id` | `middle-chairperson-aisha` (unique and never changed after voting starts) |
| `section` | `Middle Section` |
| `position` | `Chairperson` |
| `name` | `Aisha K` |
| `className` | `VIII A` |
| `photoUrl` | Public HTTPS image URL |
| `symbolName` | `Book` |
| `symbolUrl` | Public HTTPS image URL |
| `manifesto` | Short campaign message |
| `audience` | `All` |
| `order` | `1` |
| `active` | `TRUE` |

The three accepted section names are exactly:

- `Middle Section`
- `Secondary Section`
- `Senior Secondary Section`

## 4. Confirm dates and close time

The default `pollClosesAt` is `2026-07-23T00:00:00+05:30`, which closes the online campaign poll at midnight before the official election day. Change this value in `electionSettings` if the school wants another closing time. Set `pollOpen` to `FALSE` at any time for an emergency stop.

## 5. Admin and principal analytics

1. Sign in to `/admin/election` with an authorized admin account.
2. Paste the private `shareKey` from the Apps Script execution log.
3. Click **Load analytics**.
4. Use **Copy principal link** and send that URL privately to the principal.

The report refreshes every 10 seconds. Totals are read from the complete `electionVotes` tab, so they do not reset each day.

After website testing, an authorized admin can use **Reset test votes** in the election admin panel. The action permanently clears all rows in `electionVotes`, resets browser vote eligibility so previous testers can vote again, and preserves the header, candidates, election settings, and current polling status.

## Important limitation

This is an informal campaign popularity poll. The daily limit is enforced using an anonymous browser/device identifier stored locally and hashed before it is saved. A person can bypass it by clearing browser data or using another device. Do not use these totals as the official election result; the official ballot on 23 July remains authoritative.
