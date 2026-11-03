# Login metrics diagnostics — candidate 2026-11-02

Baseline: ef9f2dd7d481da5ddf19e8c40392ab4365c98519. Mainnet only.

After Pi identity verification, the login API returns an additive loginMetric object with status recorded, failed or excluded. Existing success/user fields and payment behavior remain unchanged. Private owner preview returns excluded/owner_preview and emits no public metric diagnostic event.

Normal login outcomes emit structured Vercel application logs with exactly event=sticker_login_metric, status and a fixed reason code. Codes: write_confirmed, write_not_confirmed, storage_write_failed, configuration_missing, identity_missing. No UID, username, derived identity hash, token, payment data or raw exception is logged. These logs are operational diagnostics, not a second attendance database or a visitor counter.

Missing configuration, unconfirmed writes and caught exceptions do not reject a valid login. A failed write may have partially executed the Redis Lua script; do not automatically retry or backfill counts. No claim is made that past logins can be recovered.

Following approved deployment, inspect these outcome logs for ordinary /api/auth logins. Compare with the admin report for the same UTC day. Do not use private preview to validate public attendance. Real Redis integration and authenticated production validation remain outstanding; local tests simulate HTTP/network/Redis errors, missing configuration, normal success and owner exclusion, and check that logs contain only fixed fields.

No credentials, storage configuration, counters, retention or Testnet code are changed. Rollback is a code revert/deployment of the baseline; existing metric records remain untouched.
