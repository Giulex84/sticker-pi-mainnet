# Sticker.pi — Mainnet Review Checklist

## Verified configuration

- [x] Separate Mainnet GitHub repository
- [x] Separate Mainnet Vercel project and production URL
- [x] Paired Mainnet Pi app and Mainnet API key
- [ ] Confirm Developer Mainnet App Wallet approval in the Portal (latest user screenshot: pending review)
- [x] Mainnet Redis namespace and server-authoritative storage
- [x] Pi SDK configured with `sandbox: false`
- [x] Payment restricted to `user_to_app`, `Pi Network`, 0.01 Pi and the Mainnet product identifier
- [x] Domain ownership validated
- [x] PiNet subdomain created
- [x] Pi SDK authentication completed in Pi Browser
- [x] Real 0.01 Pi U2A purchase completed
- [x] Purchased pack granted exactly once
- [x] Privacy and Terms routes available
- [x] Release version aligned to `v1.1.1`

## Repository safeguards

- [x] No API keys, wallet passphrases, private keys or seed phrases committed
- [x] Server verifies Pi identity before state or payment actions
- [x] Payment approval, completion and incomplete-payment recovery implemented
- [x] Payment and reward fulfillment are idempotent
- [x] Gameplay uses server-issued run identifiers and plausibility checks
- [x] Daily challenge uses a server-issued environment-specific deterministic seed
- [x] Top 10 stores only each Pioneer’s best verified UTC-day result
- [x] Player mutations use locks and rate limits
- [x] Duplicates supports free missing-sticker conversion; peer-to-peer trading is unavailable
- [x] Mainnet contains no Testnet payment constants

## Final manual checks immediately before submission

- [ ] Open the latest Vercel production deployment in Pi Browser
- [ ] Confirm footer displays `Sticker.pi Mainnet · v1.1.1`
- [ ] Confirm login, one full run, pack opening, Album and Profile
- [ ] Confirm Top 10 and personal daily rank update after a verified run
- [ ] Confirm Duplicates quotes the exact copies consumed and preserves one copy of each sticker
- [ ] Confirm Privacy and Terms links open
- [ ] Confirm listing subtitle and description describe only active features
- [ ] Confirm listing screenshots match the current build
- [ ] Freeze the reviewed commit/deployment

## Duplicate conversion (1.1.0)

- Common/rare/epic/legendary missing stickers cost 4/8/16/24 extra copies.
- Server quotes exact sources, using lower rarities first and preserving one copy per owned sticker.
- Collection and durable per-user conversion receipt commit atomically with a snapshot comparison.
- A lost response can be recovered with the same conversion identifier; confirmation is required before consuming copies.
- Completing the album through conversion uses the existing one-time Master Collector reward.
- Run `npm test` for mocked state/API and UI checks. Live authenticated Pi Browser conversion still requires manual verification.

## Album 2 and custom confirmation

- [x] Automated compatibility tests preserve Album 1 data and old payment delivery
- [x] Automated tests isolate album packs and duplicates
- [x] Starter and completion rewards tested once per album
- [x] Custom conversion dialog supports cancel, Escape and keyboard focus containment
- [ ] Verify mobile modal appearance in Pi Browser
- [ ] Complete Album 1 and select Ocean Wonders in Pi Browser
- [ ] Verify a real Album 2 purchase and persistence after reload

## Gameplay XP packs (v1.1.1)

Verified run XP advances a separate 500-XP pack meter. Up to three XP packs can be earned per UTC day, in addition to the existing daily score pack. Partial progress carries to the next day; after the cap, further run XP increases the level only and does not advance the pack meter. Packs belong to the album selected at run start. Opening packs and completing albums do not advance this meter. Existing level XP is preserved and is not backfilled into the new meter.

The admin dashboard reports XP packs and player-days with one versus two or more completed runs. New telemetry begins at release; it does not measure multi-day retention.
