# Sticker.pi Mainnet

Sticker.pi is a Pi Network collectible skill game built around short daily challenges, sticker packs and album completion.

## Production status

Current release: **v1.0.0**

Production URL: https://sticker-pi-mainnet.vercel.app

This repository and deployment are Mainnet-only. They must never share a Vercel project, Pi API key, connected app wallet, payment records or Redis namespace with Testnet.

## Active features

- Pi SDK authentication in Pi Browser with server-side `/v2/me` identity verification
- 30-second Sticker Catch challenge with short-lived server-issued run identifiers
- Server-authoritative XP, levels, streaks, quests, packs and collection state
- 24-sticker Season 1 album with rarity and duplicate tracking
- One-time server-verified Master Collector reward
- Optional 0.01 Pi User-to-App Bonus Pack purchase
- Server-side payment approval, completion, recovery and validation
- Idempotent gameplay, pack-opening and payment rewards
- Per-player mutation locks and API rate limits
- English and Simplified Chinese interface
- Privacy Policy and Terms of Service
- Privacy-preserving aggregate backend telemetry with a Pi-owner-only dashboard at `/admin.html`

## Coming soon

Peer-to-peer duplicate exchange is **not active**. The Trade screen is informational and clearly marked “Coming soon”. Duplicates are tracked only for a future server-verified exchange feature.

A2U rewards, leaderboards and seasonal community drops are not active in this Mainnet release.

## Pi integration boundaries

- Pi SDK: `sandbox: false`
- Accepted payment direction: `user_to_app`
- Accepted network: `Pi Network`
- Product identifier: `sticker_bonus_pack_mainnet_v1`
- Payment amount: `0.01 Pi`
- Redis namespace: `sticker:mainnet:`
- A purchased pack is granted only after verified Pi completion
- Wallet passphrases, private keys and seed phrases are never requested

The app uses Pi SDK authentication inside Pi Browser. The separate OAuth-based Pi Sign-In portal option is not used.

## Required Vercel environment variables

- `PI_API_KEY` — API key belonging only to the paired Mainnet app
- `UPSTASH_REDIS_REST_URL` — Mainnet storage endpoint
- `UPSTASH_REDIS_REST_TOKEN` — Mainnet storage token
- `STICKER_ADMIN_USERNAME` — optional dashboard owner username (defaults to `Giulex84`)
- `STICKER_METRICS_SECRET` — optional dedicated HMAC secret (falls back to `PI_API_KEY`)

Never commit credentials or reuse Testnet values.

## Public documents

- Privacy: https://sticker-pi-mainnet.vercel.app/privacy.html
- Terms: https://sticker-pi-mainnet.vercel.app/terms.html

Daily state resets at `00:00 UTC`; it is not a rolling 24-hour timer.
