# Local dev loop

1. Start dev server: `pnpm dev`
2. After changes: run smallest relevant test (`pnpm test` or `pnpm e2e`)
3. At milestone end: `pnpm verify` until green
4. Use PowerShell; avoid bash-only syntax in npm scripts
