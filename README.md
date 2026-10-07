# Sticker.pi Mainnet

Sticker.pi is a Pi SDK collectible skill game with daily challenges and permanent themed albums.

## Release and deployment

- Release: **v1.1.2**
- App: https://sticker-pi-mainnet.vercel.app
- Private metrics: https://sticker-pi-mainnet.vercel.app/admin.html
- Mainnet-only repository and Vercel project. Testnet credentials, wallets and storage must remain separate.

## Play and collect

- A 30-second daily Sticker Catch challenge uses a server-issued seed and run identifier.
- Score **25 points** to earn one free pack per UTC day. Additional runs improve XP and the daily ranking.
- The free run pack belongs to the album selected when the run started.
- Each pack contains three different sticker types; repeated copies across packs become duplicates.
- Album 1, **Pioneer Collection**, contains the original 24 stickers.
- Album 2, **Ocean Wonders**, contains 24 new ocean-themed stickers and unlocks after Album 1 reaches 24/24.
- Selecting Album 2 for the first time grants one free starter pack.
- Album collections and pack inventories are separate. Switching albums preserves both.
- Each album has a one-time collector badge, +250 XP and +3 celebration packs for that album.
- English and Simplified Chinese are available. Daily quests and streak days reset at 00:00 UTC.

## Duplicate conversion

Choose a missing sticker in the Duplicates screen of the active album. Costs are 4 extra copies for common, 8 for rare, 16 for epic and 24 for legendary stickers.

The server quotes the exact copies to consume, using lower rarities first and retaining one copy of every sticker. Only duplicates from the target album can be consumed. A custom accessible confirmation dialog shows the target, sources and cost before the irreversible conversion.

A durable conversion identifier lets the client recover a lost response. The collection and receipt are written atomically with a snapshot comparison. Recovery stays bound to the target album even if another tab changes selection.

Peer-to-peer exchange, Mainnet A2U rewards and community drops are not active.

## Pi payments and compatibility

- SDK: sandbox false; login through Pi SDK and server-side /v2/me verification.
- Only user_to_app, Pi Network, 0.01 Pi payments for sticker_bonus_pack_mainnet_v1 are accepted.
- New purchases include albumId and an album-specific memo in the official payment metadata.
- Verified payment metadata determines pack delivery, even if album selection changes.
- Legacy payments without albumId and the original Sticker.pi Bonus Pack memo still deliver to Album 1.
- The backend checks user, network, direction, amount, product, memo, cancellation state and final transaction verification.
- Purchase identifiers prevent repeat fulfillment.
- The app never requests wallet passphrases, private keys or seed phrases.

## Existing-player migration

Existing collection indices 0–23 remain Album 1; new indices 24–47 belong to Album 2. Legacy packs migrate into packsByAlbum[1]. XP, levels, streaks, badges, paid-purchase records and gameplay receipts are preserved. No reset or destructive database migration is required.

activeAlbum selects the displayed inventory; packs remains a compatibility alias. New pack-opening requests include albumId. Older requests default to Album 1 and cannot consume Album 2 packs.

## Storage and environment

Redis namespace: sticker:mainnet:

Required Vercel variables:
- PI_API_KEY: paired Mainnet app key
- UPSTASH_REDIS_REST_URL
- UPSTASH_REDIS_REST_TOKEN

Optional:
- STICKER_ADMIN_USERNAME: owner username, defaults to Giulex84
- STICKER_METRICS_SECRET: HMAC key for aggregate metrics, falls back to PI_API_KEY

Never commit or print credentials.

## Metrics and public documents

The owner-only dashboard reports daily activity, runs, delivered paid packs, gross purchase volume, duplicate conversions and album completions. Sum of daily users means active user-days, not distinct people over the period. Telemetry is best effort and is not a wallet balance or inventory audit.

Privacy: https://sticker-pi-mainnet.vercel.app/privacy.html
Terms: https://sticker-pi-mainnet.vercel.app/terms.html

## Validation

Run npm test for mocked UI, state and API tests, including migration, album isolation, starter and completion rewards, replay, lost responses, concurrency, conversion confirmation and legacy/new payment routing. Run node check-admin.cjs for dashboard aggregation tests.

A live authenticated Pi Browser check is still required for mobile appearance and actual album-2 purchase completion. Automated tests do not execute live payments.

## Gameplay XP packs (v1.1.2)

Verified run XP advances a separate 500-XP pack meter. Up to three XP packs can be earned per UTC day, in addition to the existing daily score pack. Partial progress carries to the next day; after the cap, further run XP increases the level only and does not advance the pack meter. Packs belong to the album selected at run start. Opening packs and completing albums do not advance this meter. Existing level XP is preserved and is not backfilled into the new meter.

The admin dashboard reports XP packs and player-days with one versus two or more completed runs. New telemetry begins at release; it does not measure multi-day retention.

Daily skill goals: complete three verified runs, reach 90% accuracy with at least 20 attempts in one run, and reach a 15-hit combo. These goals grant no additional packs. Existing daily and 500 XP pack rewards are unchanged. Accuracy uses the unrounded ratio, floored for display; counters reset at 00:00 UTC.
