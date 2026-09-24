# Testing

## Backend: pytest

```bash
cd backend
pip install -r requirements-dev.txt
pytest                                              # run everything
pytest --cov=portfolio --cov-report=term-missing    # with coverage
pytest portfolio/tests/test_contact.py -k honeypot  # one file / one test
```

Config is in `pytest.ini` (settings module, test discovery). Shared fixtures are in `portfolio/tests/conftest.py`:

| Fixture | Gives you |
|---|---|
| `api_client` | anonymous DRF `APIClient` |
| `staff_user`, `plain_user` | a staff and a non-staff account |
| `admin_client` | a client already carrying a staff token |
| *(autouse)* | clears the cache before each test so rate-limit counters don't leak |

What is covered: login rules (staff only, wrong password, rate limit, logout), public-vs-staff permissions on every resource, CRUD, tag parsing (list and comma string), image upload and rejection of non-images, the contact form (validation, honeypot, throttle, email on/off, SMTP failure keeps the message), the System endpoint (staff only, no password), API docs access, and the legacy importer.

Write new tests in the pytest style: plain `def test_...` functions, `pytestmark = pytest.mark.django_db`, fixtures instead of `setUp`. Use the `settings` fixture and `tmp_path` for anything touching `MEDIA_ROOT`.

## Frontend: Vitest + Testing Library

```bash
cd frontend
npm test              # run once
npm run test:watch    # re-run on change
npm run lint && npm run typecheck
```

Environment: jsdom. `src/test/setup.ts` provides an in-memory `localStorage` (newer Node versions ship a global that breaks it), stubs for `matchMedia` and `ResizeObserver` (needed by Ant Design), and resets language to English before every test.

Helpers:

- `renderWithProviders(ui, { portfolio, isAdmin, editor })` renders with fake auth + content contexts inside Ant Design's `<App>` and returns the mock functions (`reload`, `openEditor`, ...) so you can assert on them.
- `src/test/fixtures.ts`: sample settings and projects.

What is covered: pure functions (`localize`, `payload`, `projects`), the Axios layer (token header, stale-token retry, no retry on writes, error flattening), i18n (identical keys in both languages, `<html dir>` switching), `useTypewriter`, `SocialLinks`, `Projects` (filtering, placeholder image, admin controls), `ContactForm` (validation, success, failure), and the admin form, delete confirmation and System panel.

Tips learned the hard way:

- A `beforeEach(() => mock.mockReset())` **returns the mock**, and Vitest treats a returned function as a teardown. Use braces: `beforeEach(() => { mock.mockReset(); })`.
- Don't put `form.validateFields()` in an antd `Modal`'s `onOk`: a failed validation becomes an unhandled rejection. Call `form.submit()` and do the work in `Form onFinish`.

## CI

`.github/workflows/ci.yml` runs on every push: backend `pytest --cov`, frontend `lint`, `typecheck`, `test`, `build`, then `docker compose build`.
