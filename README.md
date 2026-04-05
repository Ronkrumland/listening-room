# listening-room

Small fullscreen React UI for an ambient now-playing display.

## App

- React + TypeScript with a lightweight Vite setup
- Polls the `track-context` display API for now-playing state
- Sends transport actions back through `track-context`
- Keeps the UI focused on rendering display data only

## Environment

Create a `.env.local` file with:

```bash
VITE_TRACK_CONTEXT_API_BASE_URL=https://your-track-context-host
VITE_TRACK_CONTEXT_API_BEARER_TOKEN=your-existing-bearer-token
```

## Run

```bash
npm install
npm run dev
```
