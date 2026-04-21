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
npm install
```

Run locally:

```bash
npm run ios
npm run android
```

The app entry is `App.tsx`. Store build configuration starts in `app.json` and `eas.json`.

## Next Build Steps

1. Replace mock pet data with an API.
2. Add owner accounts and pet verification.
3. Add chat, reporting, and block flows.
4. Add location-aware matching with privacy controls.
5. Add admin review tools for breeding eligibility and abuse reports.
