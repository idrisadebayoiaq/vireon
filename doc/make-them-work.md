# Part 2 — Make the features work

Start this only after every box in [Build the features](build-features.md) is checked.

Replace session sample data with Supabase. Then connect OpenRouter, job intake, the daily shortlist, PDF download, and Gmail. Keep `SUPABASE_SERVICE_ROLE_KEY` and `OPENROUTER_API_KEY` on the server.

Models:

| Task | Model id |
|---|---|
| Read a result-slip photo or PDF | `inclusionai/ling-3.0-flash-vl` |
| Structure a collected job, set its O'level rule, write the match line | `deepseek/deepseek-flash-latest` |
| Draft resume sentences and the application email | `anthropic/claude-haiku-5.5` |

Re-check those ids and prices on OpenRouter before coding them in. Prices move.

## Step 1 — Real accounts

- [x] Turn on email and password auth in the Supabase project.
- [x] Replace the pretend session with Supabase Auth on `/login`, the auth callback, and sign out.
- [x] On first sign-in, create a `profiles` row for that user.
- [x] Send the signed-in user to `/today`.

Done when: a new email can sign up, sign out, sign in again, and still has one profile row.

## Step 2 — Row policies

Add policies so the anon key is safe in the browser.

- [x] A user can read and write only their own `profiles`, `skills`, `experiences`, `certificates`, `certificate_subjects`, `resumes`, `applications`, and `daily_picks`.
- [x] A user can read `ng_states` and `ng_lgas`.
- [x] A seeker can read jobs where `is_active` is true.
- [x] An employer can insert and update only jobs tied to their `employers` row.
- [x] `gmail_connections` has no policy for the browser. Only the server, with the service role, reads it.
- [ ] Storage: a user can upload and read only files under their own folder in `certificate-slips` and `resumes`.

Done when: a second test user cannot read the first user's certificates or slips.

## Step 3 — Save the profile

- [x] Load and save profile, skills, and experience from Supabase.
- [x] Keep the state and LGA dropdowns on `ng_states` and `ng_lgas`. Seed those tables if Step 4 of Part 1 left them empty.
- [x] Validate phone and required name before save.

Done when: edits survive a refresh and a new browser session.

## Step 4 — Save certificates and read the slip

- [ ] Upload the slip to `certificate-slips/{user id}/{certificate id}`.
- [ ] Store the certificate as `pending_review`.
- [ ] Server route sends the file to `inclusionai/ling-3.0-flash-vl` and asks for JSON: exam body, year, subjects, grades.
- [ ] The review screen shows that JSON in the editable table. Confirm writes `certificate_subjects` and sets status to `confirmed`.
- [ ] "Scan again" runs the model a second time and does not delete confirmed rows until the user confirms the new table.
- [ ] A credit helper treats A1, B2, B3, C4, C5, and C6 as credit. Use it later for matching. Do not ask for a result-checker PIN.

Done when: a real slip photo lands on the review screen, a wrong subject can be fixed, Confirm keeps the correction, and a second certificate saves beside it.

## Step 5 — Save employer jobs

- [ ] Create the employer row on first visit to `/employer`.
- [ ] Saving the post form inserts a `jobs` row with source `employer`, the contact Gmail, and the qualification rule.
- [ ] Set category to `olevel` when the minimum is none or O'level. Set it to `profile` for ND, HND, and degree.
- [ ] The public job list and detail page read from `jobs`.

Done when: an employer account posts a cashier role that requires five credits including English and Mathematics, and a seeker account sees it on `/jobs`.

## Step 6 — Bring jobs in from allowed sources

Add jobs without logging into another site or bypassing a captcha. One blocked source must not empty Vireon.

- [ ] Seed a curated set of active O'level roles across several states (cashier, shop attendant, front desk, warehouse, customer service, dispatch, factory). Source `curated`. Give each a qualification rule.
- [ ] Add `job_sources` rows only for feeds or career pages that allow automated reading (a publisher API, an RSS feed, or a page that publishes `JobPosting` data).
- [ ] Before a page fetch, read that host's `robots.txt`. Skip the source when the path is disallowed.
- [ ] A scheduled function fetches enabled sources, sends each new posting to `deepseek/deepseek-flash-latest`, and stores the structured fields.
- [ ] Dedupe with a hash of company + title + city. Refresh the existing row instead of inserting a twin.
- [ ] Set `expires_at` from the deadline, or 30 days after the fetch.
- [ ] Leave LinkedIn, Indeed, and Jobberman out of `job_sources`.

Done when: the curated roles are queryable, one allowed source adds new rows, and posting the same role twice does not create two cards.

## Step 7 — Daily 5–7 picks

- [ ] A scheduled function runs at 06:00 `Africa/Lagos`. The list is built on the first visit after 06:00 until a scheduler is connected.
- [x] For each user who has a confirmed certificate or a finished profile, build that day's picks.
- [x] Skip jobs already in `daily_picks` or `applications`, jobs past `expires_at`, and jobs outside the user's state unless `work_mode` is remote.
- [x] Profile lane: the job's qualification minimum is at or below the user's highest confirmed certificate, then sort by matching skills and same city.
- [x] O'level lane: category `olevel`, and the user's confirmed O'level meets the English, Mathematics, credit count, and subject rule. Keep this lane after they add an ND, HND, or degree.
- [x] Take up to 4 profile jobs. Fill until there are 7 using the O'level lane. Prefer different companies. If fewer than 5 jobs pass, store only those.
- [x] Call DeepSeek Flash only for the chosen cards, to fill `match_reason` and `missing_skills`.
- [x] `/today` reads `daily_picks` for today's date and still shows the two group headings.

Done when: two users in different states get different lists on the same morning, each list has at most 7 jobs, and an O'level role remains after a degree is confirmed.

## Step 8 — Resume generation and PDF

- [ ] Save resumes in `resumes`, with sections JSON.
- [ ] "Write from my profile" calls `anthropic/claude-haiku-5.5` with the saved profile, experience, skills, and confirmed certificates. Write the result into the sections. The user can edit afterward.
- [ ] Changing template re-renders the same sections.
- [ ] "Download PDF" renders the current sections with the chosen template and stores the file in the `resumes` bucket.
- [ ] A user can keep more than one document, including one resume and one longer CV.

Done when: a generated summary can be edited, the download matches the edit, and a refresh reloads the same document.

## Step 9 — Draft the application

- [ ] "Draft with my details" calls Haiku with the job, the profile, and the chosen resume. Store subject and body on an `applications` row with status `draft` and channel `email`.
- [ ] Jobs with only an apply URL create a draft with channel `external` and no email body required.
- [ ] Edits to the composer save on the draft.

Done when: two drafts for two different jobs persist after refresh, and the text is the edited version.

## Step 10 — Send mail from the user's Gmail

- [ ] Google OAuth with the send scope. Store the refresh token in `gmail_connections` via the service role.
- [ ] Connect-Gmail button on the composer when no connection exists.
- [ ] Send is a server route. It runs only after the user taps Send on that draft.
- [ ] Send as the user, attach the resume PDF, then set status to `sent` and store the sent time.
- [ ] Caps: one send per user per job, a per-user daily send limit, and a limit on how many Vireon users can email the same company address in one day.
- [ ] "Open original posting" sets status to `opened_external` and opens `apply_url` in a new tab. The user submits that form on the other site.

Done when: a test Gmail receives the edited message and the PDF, a second Send on the same job does nothing, and a link-only job records an external open without sending mail.

## Step 11 — Tracker updates and account delete

- [ ] `/applications` reads real rows and the status dropdown writes the new status.
- [ ] `/privacy` delete asks for confirmation, then removes the user's storage files, `gmail_connections` token, database rows, and the auth user.

Done when: a status change is still there after refresh, and a deleted test user can sign up again as a new empty account.

## Step 12 — End-to-end check

Use one new seeker account and one employer account.

- [ ] Seeker confirms an O'level slip
- [ ] Employer posts a simple role in the seeker's state with a Gmail you control
- [ ] Run the daily job, or trigger it once by hand
- [ ] The role shows under "You can apply with your O'level"
- [ ] Seeker generates a resume, edits one line, downloads the PDF
- [ ] Seeker sends the application
- [ ] The Gmail inbox receives that edited line and the PDF
- [ ] The tracker shows Sent

Done when: that list is true, and the seeker still sees an O'level group after adding a second, higher certificate.
