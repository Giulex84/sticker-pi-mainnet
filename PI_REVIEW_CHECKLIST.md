# Sticker.pi — Mainnet Readiness Checklist

## Isolation

- [x] Separate GitHub repository
- [ ] Separate Vercel project and production URL
- [ ] Separate Mainnet Pi app and API key
- [ ] Separate connected Mainnet wallet
- [ ] Separate Upstash database and token
- [x] Pi SDK configured with `sandbox: false`
- [x] Payment network restricted to `Pi Network`
- [x] Mainnet-only product identifier and Redis namespace

## Verification before submission

- [ ] Configure the Mainnet development/production URL
- [ ] Verify domain ownership
- [ ] Confirm Pi authentication in Pi Browser
- [ ] Confirm fresh Mainnet player state (no Testnet data)
- [ ] Complete one authorized 0.01 Pi U2A purchase
- [ ] Confirm exactly one pack is granted after server verification
- [ ] Confirm payment recovery and idempotency
- [ ] Recheck Privacy Policy and Terms URLs
- [ ] Run the complete gameplay, pack and album smoke test
- [ ] Freeze the accepted commit and promote version to `1.0.0`

Do not submit Mainnet for review until every item above is complete.
