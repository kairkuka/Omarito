# OMALINGO frontend handoff

## Implemented

- Onboarding, level check, language profiles, NOVA map and all mission outlines.
- Mission 01 as the complete interactive lesson template.
- Video micro-lessons, mentor conversation, boss mission and Daily Plan.
- Omarito AI modes, microphone/typed answers, dynamic preview feedback and credits.
- Hero builder, visible equipment layers, inventory, evolution and Omarito DEN.
- Achievements, weekly missions, claim states, chests, rarity drop and season claims.
- Friends activity, reactions, league, clan mission and invitations.
- Subscription purchase, processing, success, error, restore, plan change and cancellation states.
- Special courses, AI packs, Omarito Experience, family, gifts, schools/business flows.
- Email OTP, recovery, logout, destructive confirmation and auth error states.
- English, Russian and Kazakh interface support.
- Responsive light glass UI, safe areas, reduced motion and Dynamic Type-friendly system fonts.
- Capacitor projects for iOS and Android.

## Prototype values

- Email OTP: `123456`.
- Billing, AI evaluation, email delivery, push delivery and social data are local frontend simulations.
- Only Mission 01 is intentionally a full lesson. Other missions open the reusable lesson outline.

## Commands

```bash
pnpm run build
pnpm run ios:build
pnpm run android:sync
pnpm run android:open
```

Android Gradle build needs Java and the Android SDK. iOS simulator build uses Xcode.

## Backend contracts still required

- Supabase/Auth OTP delivery, sessions and account deletion.
- Progress/economy sync with server-side validation.
- Speech-to-text and AI evaluation.
- App Store / Play Billing receipts and entitlements.
- Push scheduling/delivery.
- Friends, leagues, clans and moderation.
