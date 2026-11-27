# Context, requirements and architecture — Sticker.pi

Recorded 2026-11-27. Owner instruction: autonomous engineering with explicit approval before any production/Mainnet change. This supersedes older broad deployment authorizations.

## Goal
Professional, stable, accessible mobile Pi application; preserve achieved functionality. Evidence must be reproducible, not inferred from a prior completion claim. Avoid unrelated tuning during judging/review.

## Current architecture
Static HTML/JS frontend, Vercel functions, verified Pi identity, Upstash Redis inventory/progress/payment receipts and isolated owner preview namespace.
Host: Vercel. Public entry: https://sticker-pi-mainnet.vercel.app.
Audited main baseline: `a2e1343ff65c56bf2c7d1db1bfe7c13ade4e282e`. This is a dated reference, not a permanent current SHA.

## Functional requirements and preservation
- Three sequential 24-sticker albums, permanent collections, badges, packs and duplicate conversion.
- Server-authoritative balances and atomic inventory changes; same request ID recovers a lost reply without a second charge.
- Legacy albums and progress remain intact; owner preview isolated from public inventory and cannot initiate real payments.
- Login-only metrics; no synthetic history, no fabricated unique-user/KYC counts.

## Dependencies and boundaries
See root package.json/lockfile, API/lib modules and deployment configuration. Test tooling lives in tools/qa with its own pinned lockfile. Runtime and QA dependency audits are distinct. Database assertions use disposable local Redis, PGlite or SQLite fixtures only. Production variables/bindings are intentionally not recorded here.

## Historical evidence
Repository documentation contains prior Portal screenshots and user reports, not a live Portal check. Public demos exist for Arena, Sticker, IIOU, LaunchNest and Idle Realm; the revised IIOU demo is approved but its new YouTube URL has not been supplied. Never expose the second participant name. Do not change candidature links, pending logo/version requests or wallet associations implicitly.

## Pi compliance references
Reviewed 2026-11-27:
- https://developers.minepi.com/docs/build-first-app/MainnetListing
- https://developers.minepi.com/docs/build-first-app/PiNet
- https://developers.minepi.com/docs/api-reference/SdkReference
- https://developers.minepi.com/docs/api-reference/PlatformAPI
- https://minepi.com/pi-next/

Check current official text before implementing a policy-sensitive change. Required review topics: Pi-only authentication and transactions, server identity/payment validation, necessary data only, independent branding, professional working UI, developer KYC/Portal listing, accurate PiNet mapping and external-link necessity. Source-code compliance is not Pi approval. Do not confuse PiNet configuration with auction-domain ownership. Notifications require actual verified consent; DataLab is not evidence of access to app analytics.
