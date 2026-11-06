# Part 1 — Build the features

Goal: a clickable app that shows every feature. Data can be sample data. Nothing calls OpenRouter, fetches other job sites, or sends email in this part.

Check a box only when that step's "Done when" is true.

## Step 1 — Protect secrets and create the app

- [ ] Add a `.gitignore` that ignores `.env`, `.env.local`, `node_modules`, and `.next`.
- [ ] Create a Next.js App Router app with TypeScript in this folder.
- [ ] Add a server-only env helper that reads:
  - `SUPABASE_PROJECT_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `OPENROUTER_API_KEY`
- [ ] Copy the project URL and the anon key into `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for the browser client. Leave the service role and OpenRouter key without a `NEXT_PUBLIC_` prefix.
- [ ] Add Supabase browser and server clients. The browser client uses only the anon key.

Done when: `npm run dev` opens a home page, and a search of the client bundle does not contain the service role or the OpenRouter key.

## Step 2 — App shell

Build a mobile-first shell used by every later screen.

- [ ] Top bar with the Vireon name.
- [ ] Navigation: Today, Jobs, Certificates, Resume, Applications, Profile.
- [ ] A signed-out state and a signed-in state. Use a fake session toggle until Part 2 wires real auth.
- [ ] Page title and a simple empty area on each route so every nav item lands somewhere.

Routes to create now, even if the page is only a heading:

| Route | Screen |
|---|---|
| `/` | Redirects to `/today` when signed in, otherwise `/login` |
| `/login` | Sign in / create account |
| `/today` | Daily jobs |
| `/jobs` | All matching jobs |
| `/jobs/[id]` | One job |
| `/certificates` | Certificate list |
| `/certificates/new` | Upload a result |
| `/certificates/[id]` | Review extracted subjects |
| `/resumes` | Resume and CV list |
| `/resumes/new` | Pick a template |
| `/resumes/[id]` | Editor |
| `/applications` | Tracker |
| `/applications/[id]` | One application |
| `/profile` | Personal details, skills, experience |
| `/employer` | Employer home |
| `/employer/jobs/new` | Post a job |
| `/privacy` | Privacy notice |

Done when: you can open every route from the nav or a button on a related page, at a narrow phone width and a wide window.

## Step 3 — Login and account screens

- [ ] `/login` with email, password, create-account, and sign-in actions. Actions can show a success message without creating a real user yet.
- [ ] Account menu with Profile, Privacy, and Sign out.
- [ ] Placeholder copy that says the account will hold certificates, resumes, and applications.

Done when: the login form validates empty fields and the shell switches into the signed-in nav after a pretend sign-in.

## Step 4 — Database tables

Create the tables in Supabase. They can sit empty. Turn on row level security for every table in this step, with policies added properly in Part 2. Until then, do not query these tables from the browser with the service role.

Create:

- [ ] `profiles` — user id, full name, phone, state, LGA, city, headline, career interests, NYSC status
- [ ] `skills` — user id, name, level
- [ ] `experiences` — user id, title, company, city, start date, end date, current job flag, description
- [ ] `ng_states` and `ng_lgas` — state and local government names
- [ ] `certificates` — user id, kind (`olevel`, `ond`, `hnd`, `bsc`, `professional`), exam body, school, year, exam number, file path, status (`pending_review`, `confirmed`)
- [ ] `certificate_subjects` — certificate id, subject, grade
- [ ] `employers` — owner user id, company name, contact email
- [ ] `jobs` — source, source URL, dedupe hash, title, company, description, state, city, work mode, salary range, employment type, apply email, apply URL, qualification minimum, English credit required, Maths credit required, minimum credits, required subjects, required skills, category (`olevel` or `profile`), deadline, expiry, active flag
- [ ] `job_sources` — name, URL, enabled, last run
- [ ] `daily_picks` — user id, job id, date, lane (`profile` or `olevel`), rank, match reason, missing skills
- [ ] `resumes` — user id, kind (`resume` or `cv`), template id, title, sections JSON, PDF path
- [ ] `applications` — user id, job id, resume id, channel (`email` or `external`), status, subject, body, sent time
- [ ] `gmail_connections` — user id, Gmail address, refresh token. No client policy. Server only.

Storage buckets, private:

- [ ] `certificate-slips`
- [ ] `resumes`

Seed only location names in this step if you want the state dropdown to be real. Leave jobs empty.

Done when: the tables and both buckets exist in the Supabase project, and row level security is enabled on every new table.

## Step 5 — Profile feature

- [ ] Profile form: name, phone, state, LGA, city, headline, interests, NYSC status.
- [ ] Skills list: add and remove rows.
- [ ] Experience list: add, edit, and remove a job.
- [ ] State dropdown populated from `ng_states`. LGA dropdown filters by the chosen state.
- [ ] Save can keep the values in component state for now. Show them again when you leave the page and come back during the same session.

Done when: you can fill a sample profile, add two skills and one experience, and see them after navigating to Today and back to Profile.

## Step 6 — Certificates feature

- [ ] Certificate list with an empty state and an "Add result" button.
- [ ] Upload screen: exam body (WAEC, NECO, NABTEB, NBTE, university, other), kind, year, exam number, and a file picker for a photo or PDF.
- [ ] Review screen: a table of subject and grade rows the user can edit, add, and delete. Include Confirm and "Scan again" buttons.
- [ ] Confirm moves the card to the list with status Confirmed. Use a fixed sample extraction (English C6, Mathematics C5, and three other subjects) instead of a model.
- [ ] The list can show more than one certificate, so a later ND or degree sits under the O'level result.
- [ ] A short note on the review screen: grades A1–C6 count as credit, D7–E8 as pass, F9 as fail.

Done when: you can add an O'level result from the sample grades, confirm it, then add a second certificate and see both on the list.

## Step 7 — Jobs and employer posting

- [ ] `/jobs` list with filters for state, work mode, and lane (O'level or profile).
- [ ] Job card: title, company, city, salary, qualification line, and which lane it belongs to.
- [ ] Job detail page with description, requirements, and two apply buttons: "Apply by email" and "Open original posting". Disable them with a "Available in the next stage" hint if you want, or let them open the screens from Step 9 with sample text.
- [ ] `/employer` explains that a company posts a role and puts the Gmail that should receive applications.
- [ ] Post form: title, company, Gmail, state, city, work mode, employment type, salary, description, apply link, qualification rule (none, O'level, ND, HND, degree), English credit, Maths credit, minimum number of credits, required subjects, required skills.
- [ ] Submitting the form adds the job to an in-memory list that `/jobs` can show in this session. Mark O'level and "no certificate" roles as lane `olevel`.

Done when: a posted sample role appears on `/jobs` and its detail page, and the O'level filter hides a degree-only sample role.

## Step 8 — Today, the daily 5–7

- [ ] `/today` with two groups: "Matches your profile" and "You can apply with your O'level".
- [ ] Show 5 to 7 sample cards split across the two groups. At least two cards must be simple O'level roles (cashier, shop attendant, front desk, warehouse, customer service, dispatch, or factory).
- [ ] Each card has a one-line reason and a missing-skill line.
- [ ] A date label: "Today".
- [ ] Empty copy for when a later step has fewer than five real matches: "Fewer roles today. Weak matches are left out."

Done when: Today shows both groups, and each card links to its job detail page.

## Step 9 — Resume and CV builder

- [ ] `/resumes` lists documents with kind (resume or CV), template name, and updated time.
- [ ] Template picker with three templates. Show a small preview of each: one classic, one compact, one clean.
- [ ] The user chooses Resume or CV, then a template.
- [ ] Editor sections: headline, summary, certificates, skills, experience, and an extra custom section.
- [ ] "Write from my profile" fills the sections from the profile and confirmed certificates in session state. Use straightforward sentences here. The model rewrite comes in Part 2.
- [ ] Every section stays editable.
- [ ] "Download PDF" can be a disabled button labeled "PDF download comes online in Part 2", or it can print the on-screen preview. Do not block the step on a perfect PDF.

Done when: you can create one resume and one CV, edit a bullet, switch templates, and still see the edited text.

## Step 10 — Apply inside the app

- [ ] From a job, "Apply by email" opens a composer: To (the job Gmail), subject, body, and attached resume picker.
- [ ] "Draft with my details" fills the subject and body from the profile and the selected resume. Sample prose is enough.
- [ ] The user can edit the draft.
- [ ] Send shows a confirmation panel: "This will send from your Gmail after mail is connected." Do not send anything.
- [ ] "Open original posting" shows the job link and the chosen resume, with a button that would open the link. If the sample job has no link, show that the employer only left an email.
- [ ] Saving the draft adds a row to the in-session application list.

Done when: you can draft an email for an O'level job and for a profile job, edit a sentence, and see both as drafts in Applications.

## Step 11 — Application tracker

- [ ] `/applications` groups items by status: Draft, Sent, Opened on company site, Replied, Interview, Offer, Rejected.
- [ ] Detail page shows the job, the resume used, the email text, and the status.
- [ ] A status dropdown updates the on-screen status. This is the manual tracker. Real reply detection is out of scope.

Done when: changing a draft to Interview moves it into the Interview group.

## Step 12 — Privacy screen

- [ ] `/privacy` states that Vireon stores the profile, result slips, resumes, and application text, and that an application email is sent only after the user taps Send.
- [ ] A "Delete my account" button opens a confirm dialog. The button can stop at the dialog in this part.

Done when: the privacy page is linked from the account menu and the confirm dialog opens and closes.

## Step 13 — Click-through check

Walk this path once on a phone-width window and once on a desktop window. Fix any broken link before Part 2.

- [ ] Pretend sign-in
- [ ] Save a profile with state and LGA
- [ ] Confirm an O'level result and add a second certificate
- [ ] Post one simple job and see it under the O'level group on Today
- [ ] Create a resume from the profile and edit it
- [ ] Draft an application email and find it in the tracker
- [ ] Open Privacy

Done when: that path works without calling OpenRouter, without fetching another job site, and without sending email.

Part 1 is complete. Continue with [Make them work](make-them-work.md).
