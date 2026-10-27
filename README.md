# Journal Frontend

React + TypeScript + Vite + Tailwind client for the Journal backend.

## Run

```bash
npm install
cp .env.example .env     # set VITE_API_BASE_URL
npm run dev              # http://localhost:5173
```

## Scripts

- `npm run dev` – start dev server
- `npm run build` – type-check and build
- `npm run lint` – type-check only
- `npm run preview` – preview production build

## Backend endpoints used

| Purpose | Method | Path |
|---|---|---|
| Register | POST | `/public/create-user` |
| Login | POST | `/login` |
| Profile | GET / PUT / DELETE | `/user` |
| Journal | GET / POST | `/journal` |
| Journal by id | GET / PUT / DELETE | `/journal/id/{id}` |
| Admin: all users | GET | `/admin/all-users-get` |
| Admin: create admin | POST | `/admin/create-admin-user` |

The auth token is stored in `localStorage` under `journal_auth_token`.

## Connecting to the backend (http://localhost:8080)

Start your backend on port 8080, then `npm run dev`. The browser calls `/api/*` and Vite
proxies it to `http://localhost:8080/*`, so no CORS setup is needed. Change the target with
`VITE_PROXY_TARGET` in `.env`. All paths live in `src/config/endpoints.ts`.

For a production build, set `VITE_API_BASE_URL` to the full backend URL and enable CORS there.
