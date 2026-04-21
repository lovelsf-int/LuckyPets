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
    auth/AuthScreen.tsx
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

- account and profile: `getSession`, `signIn`, `createAccount`, `signOut`, `requestAccountDeletion`, `listOwnerPets`, `getOwnerProfile`, `updateOwnerProfile`, `createOwnerPet`, `updateOwnerPet`, `deleteOwnerPet`, `setActivePet`
- photos and health records: `listPetPhotos`, `addPetPhoto`, `listHealthRecords`, `addHealthRecord`
- matching: `listSwipeQueue`, `likePet`, `passPet`, `listSwipeEvents`, `listMatches`
- messages: `listConversations`, `listMessages`
- safety: `report`, `blockOwner`, `unmatch`
- breeding review: `getBreedingEligibility`

Matching queue contract:

- `listSwipeQueue` returns pets plus queue metadata: total candidates, skipped history count, and an empty reason.
- `likePet` and `passPet` record one swipe event per pet/action pair in the mock client.
- Queue filtering removes pets that are already matched, passed, blocked, or unmatched.
- The UI uses the empty reason to distinguish narrow filters, completed queues, and safety filtering.

匹配队列契约：

- `listSwipeQueue` 返回宠物列表和队列元信息：候选总数、历史跳过数量和空队列原因。
- `likePet` 与 `passPet` 在 mock 客户端中为每个宠物/动作组合只记录一次滑动事件。
- 队列会过滤已经配对、跳过、拉黑或解除匹配的宠物。
- 移动端会根据空队列原因区分筛选过窄、今日已看完和安全关系过滤。

Safety actions contract:

- `report` creates a moderation request for a pet, owner, message, or conversation.
- `blockOwner` prevents the target from returning to matches, conversations, or recommendations.
- `unmatch` removes the active conversation without treating it as a moderation report.
- The mobile UI keeps report as a lower-friction action and makes block/unmatch explicit destructive actions.

安全操作契约：

- `report` 会为宠物、家长、消息或会话创建审核请求。
- `blockOwner` 会阻止目标再次出现在配对、会话或推荐中。
- `unmatch` 会移除当前会话，但不会自动视为审核举报。
- 移动端把举报作为低门槛动作展示，同时将拉黑/解除匹配作为明确的破坏性动作处理。

Messages contract:

- `listConversations` returns the chat entry list with pet identity, last message, and safety state.
- `listMessages` returns ordered messages for the selected conversation.
- The message screen does not compose chat bubbles from match data directly; it renders `ConversationSummary` and `ChatMessage` DTOs.

消息契约：

- `listConversations` 返回会话入口列表，包含宠物身份、最后一条消息和安全状态。
- `listMessages` 返回所选会话的有序消息。
- 消息页不再直接从配对数据拼气泡，而是渲染 `ConversationSummary` 与 `ChatMessage` DTO。

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
