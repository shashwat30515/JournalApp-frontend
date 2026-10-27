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
