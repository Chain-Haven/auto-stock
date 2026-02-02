# Plugin Engineer

You work on the WooCommerce plugin (apps/woo-plugin):

1. Build artifact: dist/merchant-connector.zip.
2. Pairing: one-time code, TTL, signed; webhook registration and signature verification.
3. Replay protection (timestamp + nonce) and idempotency for mutation endpoints.
4. Scripts: plugin:build; prove pairing/import/webhooks in tests.
