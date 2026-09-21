# Sticker.pi Mainnet — Reviewer Notes

## Review build

Version: **v1.0.0**

URL: https://sticker-pi-mainnet.vercel.app

Sticker.pi is a short-session skill game and collectible album. Players authenticate through Pi SDK, complete a 30-second challenge, earn server-verified progression, open sticker packs and complete a 24-sticker album.

## Recommended review path

1. Open the app in Pi Browser and continue with Pi.
2. Complete one 30-second Sticker Catch run generated from the server-issued daily seed.
3. Review score, accuracy, combo, XP, daily quest progress, Top 10 and personal rank.
4. Open an available pack and review rarity, NEW/DUPLICATE state and Album progress.
5. Open Trade and confirm it is clearly marked “Coming soon”; no peer-to-peer transfer is available.
6. Optionally purchase the 0.01 Pi Bonus Pack.
7. Close and reopen the app to confirm server-side persistence.
8. Review Profile, Privacy and Terms.

## Payment safeguards

The Bonus Pack uses a User-to-App payment. The backend verifies the authenticated user, direction, Mainnet network, exact amount, memo, product metadata, cancellation state, transaction ID and final Pi verification before granting exactly one pack. Approval, completion and recovery are idempotent.

## Daily ranking safeguards

Each UTC day has an environment-specific deterministic challenge seed issued by the backend. Runs require a short-lived server record and pass duration, score, hit, miss and combo plausibility checks. Only a Pioneer’s best verified daily result is ranked. Score ranks first, then accuracy and best combo. The Top 10 displays the authorized Pi username and contains no Pi prize, wager or entry fee.

## Intentional limitations

- Peer-to-peer exchange is not active.
- A2U rewards are not active on Mainnet.
- Seasonal community drops are a future feature.
- The app never requests a wallet passphrase, private key or seed phrase.
- Authentication uses Pi SDK in Pi Browser; the separate OAuth-based Pi Sign-In portal option is not used.
