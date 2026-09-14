# Lab Intake

A lab sample intake app. Look up a sample by ID, confirm the patient, record
a collection date and notes, and browse submitted samples. Which extra fields
are required (priority, volume) depends on the sample's panel type.

- `backend/` — Flask API on `http://localhost:4000`
- `frontend/` — React (Vite) app on `http://localhost:5173`, proxying `/api`
  to the backend

## Database

The backend uses **mongomock**, an in-memory MongoDB-compatible store, so no
database process is needed. All data access goes through the `pymongo` API.
To point at a real MongoDB instance, change the client in `backend/db.py`:

```python
import pymongo
_client = pymongo.MongoClient("mongodb://localhost:27017")
```

The seed runs on every start, so data does not persist across restarts.

## Run the backend

Requires Python 3.12.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

The API is now on `http://localhost:4000`. Check it with:

```bash
curl http://localhost:4000/api/sample/BLD-001
```

## Run the frontend

Requires Node 20+ and [pnpm](https://pnpm.io/).

```bash
cd frontend
pnpm install
pnpm dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api` to the
backend, so start the backend first.

## Test sample IDs

Three panels are seeded, each with three samples. Lookup is case-insensitive.

| Panel | Required on submission | Sample IDs |
| --- | --- | --- |
| Blood | priority, volume | `BLD-001`, `BLD-002`, `BLD-003` |
| Urine | volume | `URN-001`, `URN-002`, `URN-003` |
| Saliva | priority | `SAL-001`, `SAL-002`, `SAL-003` |

Collection date is always required. Notes are always optional. Priority must
be `high`, `medium`, or `low`. Volume must be a whole number greater than
zero.

## API

| Endpoint | Purpose |
| --- | --- |
| `GET /api/sample/<sample_id>` | Look up one sample plus its panel's field requirements |
| `POST /api/sample/submit` | Record a collection submission |
| `GET /api/samples?sample_type=&search=` | List samples, filter by panel type, search by ID or name |
| `GET /api/panels` | Panel definitions (used to populate the list filter) |

Validation failures return `400` with `{"errors": {"field": "message"}}`.
An unknown sample returns `404`. Submitting a sample that already has a
collection on record returns `409`: a collection event happens once, so a
second submission is treated as a mistake rather than silently overwriting
the first.
