# Private new-player preview — local candidate

Runtime baseline: 63f510c18cc2c72ef481bb22b3f69b82c6134b02.

After separately approved publication, open /?ownerPreview=1 in Pi Browser and authenticate as Giulex84. Pi identity is verified server-side; other accounts receive 403. This is a private profile for the same identity, not a new Pioneer account.

The profile starts with the ordinary new-player defaults and persists separately under sticker:owner-preview:v1:<hashed UID>:. All Redis keys used by private gameplay, locks, rate limits, receipts and ranking are routed to that namespace. Browser storage is also separated. No reset or migration of the real player is performed. The private profile resumes on later visits; it is not reset on every login.

Private login requests username scope only. New payments and existing-payment recovery are disabled in both browser and API. Existing real payment references are not read. Public attendance writes are suppressed. Testnet is unchanged.

A visible banner and Return to my real account link identify the mode. Leaving the mode reloads the ordinary URL. The normal profile, purchases and leaderboard remain in the existing namespace. The link is not a secret or the access control: verified server-side identity is the gate.

Local validation: npm run check:build; npm run test:owner-preview; existing simulated gameplay/payment/recovery regressions pass. Full npm test stops at attendance integration because REDIS_TEST_SERVER is unavailable; real Redis and authenticated Pi Browser end-to-end checks were not performed. No production data, payment, push or deployment was changed during preparation.

Rollback is a code revert. Separate preview data can remain unused; do not delete shared storage. This mode cannot test first-ever Pi consent or explain missing Fireside conversions on its own.

Disable after verification: set the non-secret production variable STICKER_OWNER_PREVIEW_DISABLED=1 and redeploy, or revert the feature commit and redeploy. Disabling rejects private requests server-side and does not affect ordinary gameplay or delete either profile. Previously deployed versions must not be treated as disabled until replaced/retired; use the current production alias. No environment changes are needed to enable this initial owner-only release.
