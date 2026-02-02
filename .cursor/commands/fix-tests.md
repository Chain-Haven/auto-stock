# Fix tests

Run the smallest relevant test first, then broaden:

```powershell
pnpm test
pnpm e2e
```

Use Playwright traces/screenshots to debug E2E failures. Fix until `pnpm verify` passes.
