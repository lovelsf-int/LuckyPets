# Store Readiness Checklist

This checklist tracks what LuckyPets needs before App Store and Google Play submission.

## App Foundation

- Stable iOS bundle identifier: `com.lovelsf.luckypets`
- Stable Android package name: `com.lovelsf.luckypets`
- App icon and adaptive Android icon: configured in `app.json` and generated from `scripts/generate-app-assets.mjs`.
- Splash screen: configured in `app.json` and generated as `assets/splash.png`.
- Production app name and subtitle: drafted in [Store Listing Draft](./store-listing-draft.md).
- Privacy policy URL: TBD before submission.
- Terms of service URL: TBD before submission.
- Support contact: TBD before submission.
- Account deletion flow: mock request flow exists in the mobile app.

## Safety And Moderation

- Report pet profile.
- Report chat.
- Block owner.
- Unmatch.
- Moderation queue.
- Abuse categories: fraud, neglect, unsafe breeding, harassment, spam, illegal sale.
- Clear escalation path for animal welfare risk.

## Responsible Breeding

- Owner identity verification.
- Pet age eligibility rules per species.
- Vaccination and parasite prevention records.
- Genetic screening for breed-specific risks.
- Vet record upload and review.
- Welfare agreement before breeding chat.
- Hard block for bulk breeding or sale-like listings.

## Privacy

- Coarse location by default.
- Explicit permission before photo upload.
- Explicit permission before sharing medical documents.
- No precise home address in public profile.
- Data deletion/export process.
- Privacy nutrition labels for App Store.
- Google Play Data safety form.

## Store Operations

- Apple Developer account.
- Google Play Console account.
- Expo account and EAS project: run `eas init`, then replace `extra.eas.projectId` in `app.json`.
- EAS production build profile.
- App Store Connect app record.
- Google Play app record.
- TestFlight testing group.
- Google Play internal testing track.
- Screenshots for 6.7-inch iPhone, iPad if supported, and Android phone.
- Review notes explaining moderation and breeding safeguards: drafted in [Store Listing Draft](./store-listing-draft.md).
- Internal test runbook: [Internal Testing Runbook](./internal-testing.md).
