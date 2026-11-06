# Vireon implementation plan

Follow these documents in order. Do not skip ahead.

The app is a Nigeria job platform. A person saves their profile and certificates, gets 5–7 matching jobs each day (including simple roles that fit their O'level result), builds a resume or CV from their details, and applies inside Vireon.

## Order of work

1. [Build the features](build-features.md) — screens, navigation, database tables, and forms. Buttons can show sample content. OpenRouter, job collection, and Gmail stay off.
2. [Make them work](make-them-work.md) — save real data, read result slips, fill the daily list, generate documents, and send applications.

Finish every step in the build document before starting the make-them-work document.

## What is already in place

- Supabase project `ialnuofgoytfyctmeuon`, URL `https://ialnuofgoytfyctmeuon.supabase.co`
- Env names already set: `SUPABASE_PROJECT_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENROUTER_API_KEY`
- The database has no tables yet
- The repo has no app code yet

Do not paste secret values into docs, commits, or client code. `SUPABASE_SERVICE_ROLE_KEY` and `OPENROUTER_API_KEY` stay on the server.

## Step rules

- Complete one step, check it off, then start the next.
- A build step is done when you can click through that screen on a phone-width and a desktop window.
- A make-it-work step is done when the "Done when" line in that step is true with a real account.
