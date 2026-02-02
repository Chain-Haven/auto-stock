# Integration adapters

- Store credentials encrypted; master key in Vercel env.
- Use mock adapters in CI for ShipStation/Mercury.
- Webhooks: verify signature, replay protection, idempotency.
- "Test connection" flows (e.g. Test ShipStation, Test Mercury) without mutating external systems in CI.
