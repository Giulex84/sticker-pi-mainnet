# Sticker.pi Mainnet

Sticker.pi is a Pi Network collectible game built around short skill challenges, sticker packs, collection goals and future duplicate trading.

## Mainnet boundary

This repository is exclusively for the Mainnet app and deployment. It must never share its Vercel project, Pi API key, connected wallet or Upstash database with the Testnet build.

- Pi SDK initializes with `sandbox: false`.
- U2A payments must report `network: "Pi Network"`.
- The paid product identifier is `sticker_bonus_pack_mainnet_v1`.
- Redis keys use the `sticker:mainnet:` namespace as an additional isolation layer.
- Testnet player progress and payment records are not migrated.

## Features

- Pi SDK authentication with backend `/me` verification
- Server-authoritative XP, levels, streaks, quests and inventory
- 30-second Sticker Catch challenge with server-issued run tickets
- 24-sticker collection, rarity and duplicate tracking
- One-time Master Collector Season 1 reward
- Idempotent pack and payment fulfillment
- Per-player mutation locks and API rate limits
- English and Simplified Chinese interface
- Privacy Policy and Terms of Service

## Required Vercel environment variables

- `PI_API_KEY` — Mainnet app API key only
- `UPSTASH_REDIS_REST_URL` — dedicated Mainnet database
- `UPSTASH_REDIS_REST_TOKEN` — token for that dedicated database

Never commit credentials. Do not reuse Testnet values.

## Release status

`v1.0.0-rc.1` is a Mainnet preparation build. It must not be submitted or opened to users until authentication, storage isolation and one real low-value U2A transaction have been verified through the Mainnet app.

Daily state resets at `00:00 UTC`; it is not a rolling 24-hour timer.
