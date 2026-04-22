# LuckyPets

LuckyPets is an owner-led pet matching app prototype for social introductions, playdates, and responsible breeding conversations.

## MVP Direction

The first version focuses on a Tinder-like matching loop:

- Pet profiles with photos, age, city, personality, health status, and intent.
- Like/pass actions with instant match feedback.
- Filters for social, playdate, and verified breeding intent.
- Safety gates for breeding: vaccination, age range, sterilization status, genetic screening, and vet records.
- Owner-first chat and meetup prompts after both sides match.

## Responsible Breeding Policy

Breeding matches should never be treated like casual swipes. The product should require proof of health records, age eligibility, owner identity, animal welfare agreement, and local-law compliance before breeding conversations can start.

## Static Prototype

Open `index.html` in a browser to try the static MVP prototype. No build step is required.

## Mobile App

The repository now includes the start of an Expo/React Native app for iOS and Android.

Install dependencies after cloning:

```bash
bun install
```

Run locally:

```bash
bun run ios
bun run android
```

Useful checks:

```bash
bun run assets:generate
bun run typecheck
bunx expo-doctor
eas --version
```

The app entry is `App.tsx`. Store build configuration starts in `app.json` and `eas.json`.

## Planning Docs

The product and engineering plan is recorded in bilingual planning documents:

- [Architecture / 架构设计](docs/architecture.md)
- [Product Plan / 产品计划](docs/product-plan.md)
- [8-Week Development Plan / 8 周开发计划](docs/development-plan.md)

Supporting references:

- [Product Roadmap](docs/product-roadmap.md)
- [Mobile Architecture Notes](docs/mobile-architecture.md)
- [Store Readiness Checklist](docs/store-readiness.md)
- [Internal Testing Runbook](docs/internal-testing.md)
- [Store Listing Draft](docs/store-listing-draft.md)

## Next Build Steps

1. Replace mock pet data with an API.
2. Add owner accounts and pet verification.
3. Add chat, reporting, and block flows.
4. Add location-aware matching with privacy controls.
5. Add admin review tools for breeding eligibility and abuse reports.
