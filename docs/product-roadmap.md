# LuckyPets Product Roadmap

## Product Positioning

LuckyPets should feel like a pet-first matching app, not a classified ads board. Owners create verified pet profiles, browse nearby pets, match by mutual interest, and start structured conversations only after both sides agree.

## MVP

- Static matching experience with mock pets.
- Pet profile fields: photos, species, breed, age, sex, city, temperament, intent, health records.
- Like/pass loop.
- Basic filters for intent and species.
- Match list and first-message prompt.
- Breeding intent separated from casual social matching.

## Phase 1

- Expo mobile app shell for iOS and Android.
- Native tab flow for matching, messages, and pet profile.
- Owner account registration.
- Pet profile CRUD.
- Photo upload.
- Location preference with coarse city/district matching.
- Swipe queue API.
- Mutual match creation.
- Chat after mutual match.
- Report, block, and unmatch.

## Phase 2

- Vet record upload and manual review.
- Breeding eligibility workflow.
- Admin review dashboard.
- Anti-spam limits.
- Moderation queue for suspicious profiles.
- Push notifications.

## Phase 3

- Recommendation ranking.
- Pet compatibility scoring.
- Meetup scheduling.
- Community events.
- Shelter and adoption partner flows.

## Breeding Guardrails

- Require owner identity verification.
- Require age eligibility per species and breed.
- Require vaccination and parasite prevention records.
- Require genetic screening where breed risk is known.
- Require welfare agreement before any breeding chat.
- Block sale-like listings, bulk breeding patterns, and unsafe language.
- Let users report coercion, fraud, neglect, and illegal activity.

## Suggested Technical Direction

- Start with a static prototype for fast validation.
- Move to a mobile-first PWA or React Native app once the matching loop feels right.
- Use PostgreSQL with geospatial indexing for location-aware matching.
- Store uploaded medical documents in object storage.
- Keep moderation and verification events auditable.
