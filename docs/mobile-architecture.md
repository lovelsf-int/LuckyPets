# LuckyPets Mobile Architecture

## Direction

LuckyPets is moving from a static prototype to a production mobile app built with Expo and React Native. Expo gives the project one shared codebase for iOS and Android, plus a practical path to EAS Build, EAS Submit, and OTA updates later.

The current app shell keeps the first product loop small:

- Match tab: browse pets, filter by intent and species, like/pass.
- Messages tab: open structured conversations after matching.
- Profile tab: edit the current pet profile and owner boundaries.

## Current Structure

```text
App.tsx
src/
  api/
    contracts.ts
    index.ts
    mockClient.ts
  app/
    LuckyPetsApp.tsx
    useLuckyPetsState.ts
  components/
    AppButton.tsx
    EmptyState.tsx
    FilterRow.tsx
    ScreenHeading.tsx
    SectionCard.tsx
    TagList.tsx
    screenStyles.ts
  data/pets.ts
  features/
    matching/MatchScreen.tsx
    messages/MessagesScreen.tsx
    profile/ProfileScreen.tsx
  theme.ts
  types.ts
app.json
eas.json
package.json
tsconfig.json
```

## Recommended Next Architecture

```text
src/
  api/              Remote API client and typed DTOs
  app/              Navigation, app providers, auth gate
  components/       Shared buttons, cards, chips, forms
  data/             Temporary seed data, removed after backend
  features/
    auth/           Login, signup, account deletion
    matching/       Swipe queue, filters, likes, mutual matches
    messages/       Chat list, chat room, safety prompts
    pets/           Pet profile CRUD, photos, health records
    moderation/     Report, block, review status
  theme/            Colors, spacing, typography
  types/            Shared domain types
```

## Product Rules To Encode Early

- A user cannot start breeding chat until the pet has passed eligibility checks.
- Breeding intent must require health records, age eligibility, genetic screening where relevant, and owner identity verification.
- Social matching and playdates can stay lightweight, but still need reporting, blocking, and unmatching.
- Location matching should use coarse areas by default, not precise home location.
- Medical documents should be private by default and shared only after explicit owner action.

## API Boundary In Code

The mobile app now talks to `src/api/index.ts` instead of reading seed data directly from feature screens. The current `mockApiClient` is intentionally shaped like the future backend client.

当前移动端通过 `src/api/index.ts` 访问数据，而不是让业务页面直接读取 seed 数据。现在的 `mockApiClient` 会保持和未来后端客户端一致的形状。

Current client boundary:

- session and profile: `getSession`, `getOwnerProfile`, `updateOwnerProfile`
- matching: `listSwipeQueue`, `likePet`, `passPet`, `listMatches`
- messages: `listConversations`, `listMessages`
- safety: `report`, `blockOwner`, `unmatch`
- breeding review: `getBreedingEligibility`

## Release Path

1. Finish native MVP screens.
2. Add real navigation and local persistence.
3. Add backend API and authentication.
4. Add image upload and moderation.
5. Run internal TestFlight and Google Play internal testing.
6. Prepare store metadata, screenshots, privacy labels, and review notes.
7. Submit production builds.

## References

- Expo SDK reference: https://docs.expo.dev/versions/latest/
- EAS overview: https://docs.expo.dev/eas/
- Submit to app stores: https://docs.expo.dev/deploy/submit-to-app-stores/
