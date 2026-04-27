# AGENTS.md

## Project Overview

`listening-room-app` is a single-user ambient display for currently playing music.

It consumes the `spotify-bridge-api` and renders a clean, fullscreen now-playing experience.

This project prioritizes simplicity, visual clarity, and incremental development.

---

## Core Principles

- Keep implementations small and focused.
- Favor simple, readable code over clever abstractions.
- Build only what is needed right now (YAGNI).
- The UI should feel calm, minimal, and intentional.
- Every change should be easy to review and revert.

---

## Workflow Expectations

- Always plan before making changes.
- Show proposed file structure and dependencies before implementation.
- Keep diffs small and scoped to a single concern.
- Do not refactor unrelated code.
- Do not introduce broad architectural changes without explanation.

---

## Scope Rules

### Allowed

- Basic UI components
- Styling and layout improvements
- Integration with existing API endpoints
- Small UX enhancements

### Not Allowed (unless explicitly requested)

- New backend features
- WebSocket implementation
- State management libraries (Redux, Zustand, etc.)
- Routing beyond what is required
- Authentication UI
- Theme systems or plugin architectures
- Over-engineering for future use cases

---

## API Usage

- Use only the existing `GET /api/now-playing` endpoint.
- Do not modify or extend the API from this project.
- Do not assume additional API fields exist.
- Handle missing or null data gracefully.

---

## UI Behavior

- The app is fullscreen-first.
- Display album art, title, artist, and album.
- Show paused state clearly when `isPlaying` is false.
- Handle "no track" state cleanly.
- Controls (when added) should fade out when inactive.

---

## Development Constraints

- Use React + Vite + TypeScript.
- Avoid unnecessary dependencies.
- Keep styling simple and maintainable.
- Prefer CSS or lightweight solutions over heavy UI frameworks.

---

## Validation

Before considering work complete:

- The app runs locally.
- The build and typecheck pass.
- No console errors or warnings.
- The UI renders correctly for:
  - playing track
  - paused track
  - no track

---

## Documentation

- Update README.md only when setup or usage changes.
- Do not add excessive documentation.

---

## Roadmap Awareness

- Review `docs/roadmap.md` before implementing new features.
- Do not implement future features early.
- Follow the current focus only.

---

## AI Behavior Guidelines

- Do not overbuild.
- Do not add features “for completeness.”
- Do not invent requirements.
- If something is unclear, ask before implementing.

The goal is to produce small, clean, and intentional increments that are easy to review and merge.