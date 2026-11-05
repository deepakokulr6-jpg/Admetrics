# AdMetrics Mobile Application Architecture Documentation

## 1. Final Folder Structure

```
Admetrics/
├── App.tsx                     # Application root component with providers
├── index.js                    # React Native app entry registration
├── package.json                # Project dependencies and operational scripts
├── tsconfig.json               # TypeScript configuration with path mappings
├── ios/                        # iOS native project, Podfile, and Pods
│   ├── Podfile                 # CocoaPods configuration (with deployment target post-install enforcement)
│   └── Admetrics.xcodeproj     # Xcode project (configured for iOS 15.1+)
├── android/                    # Android native project and Gradle configuration
├── __tests__/                  # Unit and integration test suites
│   ├── App.test.tsx
│   ├── authService.test.ts
│   └── clinicService.test.ts
└── src/
    ├── assets/                 # Static assets (images, icons, vectors)
    ├── components/             # Reusable UI component library (domain & shared)
    │   ├── auth/               # Auth-specific UI elements (AuthHeader, OtpInput, etc.)
    │   ├── clinic/             # Clinic registration UI elements (ClinicCard, PhotoUploadItem, etc.)
    │   ├── home/               # Dashboard and home screen headers & widgets
    │   ├── revenue/            # Revenue charts, period dropdown, display summaries
    │   └── shared/             # Atomic design system (InputField, GradientButton, BottomNav, etc.)
    ├── contexts/               # React Context Providers for global & multi-step state
    │   ├── AuthContext.tsx     # Authentication state, login, token, session bootstrap
    │   └── ClinicRegistrationContext.tsx # Multi-step clinic onboarding draft & submission
    ├── navigation/             # Navigation stacks, route declarations, and types
    │   ├── RootNavigator.tsx   # Top-level splash gate and auth state router
    │   ├── AuthNavigator.tsx   # Stack navigator for unauthenticated flows
    │   ├── AppNavigator.tsx    # Stack navigator for authenticated clinic/doctor flows
    │   └── types.ts            # Type-safe navigation parameters and screen props
    ├── screens/                # Screen views organized by business domain
    │   ├── account/            # Account confirmation and completion screens
    │   ├── auth/               # Splash, Welcome, Signup, OTP Verification, Password screens
    │   ├── clinic/             # Clinic registration wizard (Details, Timings, Photos, Status)
    │   ├── home/               # Primary Doctor Dashboard and active displays view
    │   └── revenue/            # Revenue breakdown, logs, and payment receipts
    ├── services/               # API clients, persistence, and external service contracts
    │   ├── authService.ts      # Authentication API endpoints and session persistence
    │   └── clinicService.ts    # Clinic registration endpoints, validation, and submission
    ├── theme/                  # Design tokens, color palette, and typography system
    │   ├── colors.ts           # Hex color codes, brand gradients, state tokens
    │   └── typography.ts       # Font weights, line heights, font family configurations
    ├── types/                  # Shared TypeScript interfaces, models, and domain entities
    │   └── clinic.ts           # Clinic registration and schedule data types
    └── utils/                  # Pure utility functions, input formatters, and custom hooks
        ├── useKeyboardAutoScroll.ts # Auto-scrolling on input focus for forms
        └── validation.ts       # Email, phone, password, and GST validation helpers
```

---

## 2. Architecture Explanation

The application follows a **Domain-Grouped Modular Architecture with Centralized Design System**:

- **Separation of Concerns**:
  - **Screens (`src/screens/*`)**: Focused strictly on UI layout, user interaction, and dispatching actions. Business logic is delegated to Services and Contexts.
  - **Shared Components (`src/components/shared/*`)**: Stateless, pure UI components following the design system tokens.
  - **Domain Components (`src/components/<domain>/*`)**: Feature-specific UI components (e.g. `RevenueChart`, `ClinicCard`) decoupled from screen routing logic.
  - **Services (`src/services/*`)**: Handle asynchronous data fetching, local storage persistence, network error handling, and API transformations.
  - **Contexts (`src/contexts/*`)**: Provide scoped, reactive state management across multiple screens (e.g., auth session lifecycle, multi-step registration forms).
  - **Theme & Tokens (`src/theme/*`)**: Single source of truth for branding, colors, gradients, and typography.

---

## 3. Feature & Module Responsibilities

The AdMetrics platform encapsulates five core business roles. The mobile application currently implements the **Doctor / Clinic Owner** role and the shared **Authentication** foundation:

### A. Authentication & Onboarding
- **Scope**: App launch splash screen, login (`WelcomeBackScreen`), registration (`CreateAccountScreen`), OTP verification (`VerifyOtpScreen`), password setup/recovery (`ConfirmPasswordScreen`), and success confirmation (`AccountCreatedScreen`).
- **Location**: `src/screens/auth/`, `src/screens/account/`, `src/components/auth/`, `src/services/authService.ts`.

### B. AdMetrics Doctor & Clinic Management
- **Scope**:
  - Clinic Registration wizard (personal details, operating hours, photos, submission).
  - Main Doctor Dashboard (`HomeScreen`, `a15HomeScreen`).
  - Active TV display status monitoring (`TvDisplayCard`, `TVDisplaysSection`).
  - Revenue analytics and payment receipts (`RevenueScreen`, `RevenueChart`).
- **Location**: `src/screens/clinic/`, `src/screens/home/`, `src/screens/revenue/`, `src/components/clinic/`, `src/components/revenue/`, `src/services/clinicService.ts`.

### C. Future Modules Scaffolding
- **AdMetrics Admin**: Clinic verification, digital MoU signing, advertiser approval, zone management.
- **AdMetrics Advertiser**: Ad campaign creation (Bolo-India Creator), payment processing, impressions reporting.
- **AdMetrics Display Distributor**: Hardware commissioning, serial number provisioning, warranty tracking, dispatch logs.
- **AdMetrics Support**: Hardware downtime alerts, ticket tracking, resolution logs.

---

## 4. Navigation Architecture

- **Root Gateway (`RootNavigator.tsx`)**:
  - Mounts `SplashScreen` while initializing session state (`isBootstrapping`).
  - Upon session resolution, conditionally routes to either `AuthNavigator` or `AppNavigator`.
  - Prevents "login screen flash" when a valid user token is retrieved from storage.
- **Auth Stack (`AuthNavigator.tsx`)**:
  - Stack: `Login` -> `CreateAccount` -> `VerifyOtp` -> `ConfirmPassword` -> `AccountCreated`.
  - Supports both registration and forgot-password flows using route parameters (`mode: 'signup' | 'reset'`).
- **App Stack (`AppNavigator.tsx`)**:
  - Wrapped with `ClinicRegistrationProvider` to maintain in-memory wizard progress across screens.
  - Stack: `Home` (`HomeScreen`), `A15Home` (`a15HomeScreen`), `Revenue` (`RevenueScreen`), `RegisterClinic`, `EditDetails`, `RegisterPersonal`, `RegisterTimings`, `RegisterPhotos`, `ClinicRegistered`.
- **Type Safety (`types.ts`)**:
  - Fully typed parameter lists: `RootStackParamList`, `AuthStackParamList`, `AppStackParamList`.
  - Type-safe prop helpers: `AuthScreenProps<RouteName>`, `AppScreenProps<RouteName>`.

---

## 5. API Service Architecture

- **Service Layer Pattern**: All network requests and local persistence reside in `src/services/`.
- **Contracts**:
  - `authService.ts`: Exports `login()`, `signup()`, `verifyOtp()`, `resendOtp()`, `resetPassword()`, `getSavedUser()`, `saveUser()`, `logout()`.
  - `clinicService.ts`: Exports `submitClinicRegistration()`, `getClinicRegistrationDraft()`, `saveClinicRegistrationDraft()`.
- **Error Handling**: Standardized error responses with user-friendly error messages and clean exception propagation to UI layers.
- **Persistence**: Employs `@react-native-async-storage/async-storage` with validated fallbacks for reliable session persistence.

---

## 6. State Management Approach

- **Authentication State (`AuthContext.tsx`)**:
  - Manages `user`, `token`, `isAuthenticated`, and `isBootstrapping`.
  - Automatically loads persisted credentials on cold boot.
  - Exposes `useAuth()` hook for components to access user profile or trigger logout.
- **Multi-Step Form State (`ClinicRegistrationContext.tsx`)**:
  - Holds draft state for multi-screen registration flow:
    - Step 1: Personal & clinic basic details
    - Step 2: Clinic operating schedule and working hours
    - Step 3: Photos and verification documents
  - Prevents state loss if the user navigates backward or edits previous steps.
  - Provides `useClinicRegistration()` hook with typed dispatchers (`updateFormData`, `resetForm`, `submitRegistration`).

---

## 7. Shared Components Documentation

All reusable UI elements reside in `src/components/shared/`:

| Component | Responsibility | Props / Highlights |
| :--- | :--- | :--- |
| `InputField` | Standardized text and secure password inputs | Labels, error messages, icons, secure toggle, focus states |
| `GradientButton` | Primary call-to-action button | LinearGradient background, disabled state, loading indicator |
| `ScreenHeader` | Top app header across sub-screens | Title, back arrow button, optional right accessory |
| `StepProgress` | Multi-step wizard indicator | Active step index, total steps, smooth progress transitions |
| `SuccessScreenLayout`| Reusable layout for completion screens | Center illustration/icon, title, message, primary action |
| `WorkingHoursRow` | Daily timing selector for clinic schedules | Day toggle, start/end time pickers, active switch |
| `ProfileAvatar` | User profile avatar badge | Image URL or placeholder initials, size variations |
| `BottomNavigation` | Fixed bottom navigation bar | Home, Revenue, Displays, and Profile tab navigation |
| `AppLogo` | Brand logo rendering component | Dimension scaling, dark/light variants |

---

## 8. Naming Conventions

- **Directories**: Lowercase or camelCase (`components/auth`, `screens/clinic`).
- **React Components & Screens**: PascalCase matching file name (`HomeScreen.tsx`, `InputField.tsx`).
- **Hooks**: camelCase prefixed with `use` (`useAuth.ts`, `useKeyboardAutoScroll.ts`).
- **Services & Utils**: camelCase (`authService.ts`, `validation.ts`).
- **Type Definitions**: PascalCase (`ClinicData`, `AuthStackParamList`).
- **Constants & Enums**: UPPER_SNAKE_CASE or PascalCase for enum objects (`COLORS.PRIMARY`).

---

## 9. Instructions for Adding a New Screen

1. **Create the Screen Component**:
   Create `src/screens/<domain>/<ScreenName>Screen.tsx`:
   ```tsx
   import React from 'react';
   import { View, Text, StyleSheet } from 'react-native';
   import { AppScreenProps } from '../../navigation/types';

   export const NewFeatureScreen: React.FC<AppScreenProps<'NewFeature'>> = ({ navigation }) => {
     return (
       <View style={styles.container}>
         <Text style={styles.title}>New Feature</Text>
       </View>
     );
   };

   const styles = StyleSheet.create({
     container: { flex: 1, backgroundColor: '#FFFFFF' },
     title: { fontSize: 18, fontWeight: '600' },
   });
   ```

2. **Register in Navigation Types**:
   Open `src/navigation/types.ts` and add route params to `AppStackParamList` (or `AuthStackParamList`):
   ```ts
   export type AppStackParamList = {
     // ... existing routes
     NewFeature: { itemId?: string } | undefined;
   };
   ```

3. **Add to Navigator**:
   Open `src/navigation/AppNavigator.tsx`:
   ```tsx
   import NewFeatureScreen from '../screens/<domain>/NewFeatureScreen';

   // Inside <Stack.Navigator>:
   <Stack.Screen name="NewFeature" component={NewFeatureScreen} />
   ```

---

## 10. Instructions for Adding a New Feature / Module

1. **Define Types**:
   Add feature interfaces in `src/types/<feature>.ts` (e.g., `src/types/distributor.ts`).
2. **Create Service Layer**:
   Add `src/services/<feature>Service.ts` for network requests and storage operations.
3. **Build Reusable Domain Components**:
   Place domain-specific UI in `src/components/<feature>/`.
4. **Build Feature Screens**:
   Place screens in `src/screens/<feature>/`.
5. **Manage State**:
   If the feature requires multi-screen state, create a context provider in `src/contexts/<Feature>Context.tsx`.
6. **Integrate Routes**:
   Update `src/navigation/types.ts` and wire screens into `AppNavigator.tsx` or a dedicated nested navigator.
7. **Verify**:
   Run `npx tsc --noEmit` and `npm test` to ensure zero regressions.

