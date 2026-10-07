# Sticker.pi — Mainnet Review Checklist

## Verified configuration

- [x] Separate Mainnet GitHub repository
- [x] Separate Mainnet Vercel project and production URL
- [x] Paired Mainnet Pi app and Mainnet API key
- [x] Connected Mainnet app wallet
- [x] Mainnet Redis namespace and server-authoritative storage
- [x] Pi SDK configured with `sandbox: false`
- [x] Payment restricted to `user_to_app`, `Pi Network`, 0.01 Pi and the Mainnet product identifier
- [x] Domain ownership validated
- [x] PiNet subdomain created
- [x] Pi SDK authentication completed in Pi Browser
- [x] Real 0.01 Pi U2A purchase completed
- [x] Purchased pack granted exactly once
- [x] Privacy and Terms routes available
- [x] Release version aligned to `v1.0.3`

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
- [ ] Confirm footer displays `Sticker.pi Mainnet · v1.0.3`
- [ ] Confirm login, one full run, pack opening, Album and Profile
- [ ] Confirm Top 10 and personal daily rank update after a verified run
- [ ] Confirm Duplicates quotes the exact copies consumed and preserves one copy of each sticker
- [ ] Confirm Privacy and Terms links open
- [ ] Confirm listing subtitle and description describe only active features
- [ ] Confirm listing screenshots match the current build
- [ ] Freeze the reviewed commit/deployment

## Duplicate conversion (1.0.3)

- Common/rare/epic/legendary missing stickers cost 4/8/16/24 extra copies.
- Server quotes exact sources, using lower rarities first and preserving one copy per owned sticker.
- Collection and durable per-user conversion receipt commit atomically with a snapshot comparison.
- A lost response can be recovered with the same conversion identifier; confirmation is required before consuming copies.
- Completing the album through conversion uses the existing one-time Master Collector reward.
- Run `npm test` for mocked state/API and UI checks. Live authenticated Pi Browser conversion still requires manual verification.
