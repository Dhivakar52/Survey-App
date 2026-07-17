# Pulse Survey — Multi-Language Survey Module

React + Vite + Bootstrap 5 + React Router. Dynamic questions, 3 languages (English, Tamil, Hindi), duplicate-submission prevention, full validation.

## Run it

```bash
npm install
npm run dev
```

Open the printed localhost URL. `npm run build` produces a production bundle in `dist/`.

## How it's wired

- **`src/services/surveyApi.js`** — mock REST layer (`fetchSurvey`, `fetchQuestions`, `fetchSubmissionStatus`, `submitSurvey`). Function signatures already match a typical REST contract (`GET /surveys/:id`, `GET /surveys/:id/questions?lang=`, `POST /surveys/:id/submit`) — swap the internals for real `fetch` calls when your backend is ready. Submission state persists in `localStorage` so refreshing shows "Already Submitted."
- **`src/context/SurveyContext.jsx`** — holds language, answers, current step, and toasts app-wide.
- **`src/hooks/useSurvey.js`** — loads survey + questions for the active language, exposes `loading | ready | error` status, refetches on language change without touching answers already entered.
- **`src/components/QuestionRenderer.jsx`** — one switch statement maps the API's `type` field to a control: `radio`, `checkbox`, `dropdown`, `rating` (1–5 stars), `emoji`, `yesno`, `text`, `textarea`, `number`, `date`, `file`. Add a new question type on the backend and it renders automatically — no page changes needed.
- **`src/pages/`** — one component per screen: Landing → Form → Review → Success, plus AlreadySubmitted as a hard stop when the API reports `submitted: true`.
- **`src/locales/{en,ta,hi}.json`** — UI chrome strings. Question text/options are localized directly in `surveyApi.js` (mirrors how a real backend would return `lang`-scoped content).

## Adding a language

1. Add a locale JSON in `src/locales/` (copy `en.json`, translate values).
2. Register it in `LANGUAGES` inside `src/context/SurveyContext.jsx`.
3. Add the matching key to each question/option object in `surveyApi.js`.

## Design notes

Ticket / boarding-pass visual language — a perforated card body with a stub footer for IDs and dates, and a "stamp trail" progress bar instead of a flat bar, since a survey is literally a short, sequential checkpoint. Palette: deep indigo (`--primary`) + warm amber (`--accent`) on a cool mist background — avoids the generic AI-cream/terracotta or dark-mode-neon defaults. Display type is Lexend, body is Inter, and IDs/codes use JetBrains Mono for a ticket-like feel.
