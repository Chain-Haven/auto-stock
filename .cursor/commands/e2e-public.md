# E2E public

Run Playwright E2E against the public deployment:

```powershell
$env:BASE_URL = "https://your-vercel-url.vercel.app"
pnpm e2e
```

Or use the smoke:public script if configured:

```powershell
pnpm smoke:public
```
