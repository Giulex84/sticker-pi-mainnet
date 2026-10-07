# Sticker.pi Mainnet — Review notes

Release: **v1.1.0**
URL: https://sticker-pi-mainnet.vercel.app

## Review path

1. Authenticate with Pi SDK in Pi Browser.
2. Complete a daily run and inspect XP, ranking and the 25-point free pack objective.
3. Open a pack and inspect the album, rarity and NEW/DUPLICATE feedback.
4. In Duplicates, select a missing sticker and inspect the custom confirmation before converting extra copies.
5. Optionally purchase a 0.01 Pi pack; confirm the album named in the official wallet prompt and delivery.
6. Reload to verify persistent state.
7. Complete Album 1 to unlock Ocean Wonders. The original album remains accessible.
8. Select Album 2, receive its one-time free starter pack and verify that its cards and duplicate inventory are separate.
9. Review Profile, Privacy and Terms.

## Safeguards

Pi SDK-only authentication and Pi-only payments. The backend validates authenticated identity and verified transaction metadata before delivering a purchased pack exactly once. Legacy purchases without album metadata remain routed to Album 1.

Duplicate conversions consume game items only and involve no Pi payment, wager or financial return. Exact source copies are shown before confirmation; one copy of each sticker is preserved. Durable receipts and atomic writes protect response-loss recovery.

Each album has a separate completion badge and one-time reward. Previous collections, purchases, packs and progression are preserved through a lazy compatibility migration.

Daily ranking uses the best verified UTC-day score, then accuracy and combo. It has no entry fee or monetary prize. Run duration and result plausibility are checked server-side.

## Validation limits

Mocked UI and backend regression tests cover migration, album isolation, reward idempotence, conversion recovery and payment routing. Live authenticated Pi Browser visual verification and an Album 2 payment require manual checks. Peer-to-peer exchange and Mainnet A2U rewards are not active.
