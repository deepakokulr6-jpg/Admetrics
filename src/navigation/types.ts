import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { PickedLocation } from '../services/locationService';

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  CreateAccount: undefined;
  VerifyOtp: { email: string };
  ForgotPassword: undefined;
  ConfirmPassword: {
    email: string;
    mode?: 'signup' | 'reset';
    resetToken?: string;
  };
  AccountCreated: undefined;
};

/** Bottom tabs. The keys are also the tab ids used by BottomNavigation. */
export type MainTabParamList = {
  Revenue: undefined;
  Clinics: undefined;
  Statement: undefined;
  Support: undefined;
};

/** Signed-in app: the tab bar plus every screen pushed on top of it. */
export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  RegisterClinic: { pickedLocation?: PickedLocation } | undefined;
  RegisterPersonal: undefined;
  RegisterTimings: undefined;
  RegisterPhotos: undefined;
  RegisterMou: undefined;
  MouESign: undefined;
  ClinicPreview: undefined;
  MouAgreement: undefined;
  /** Signed MOU PDF from DocuSeal. */
  SignedMou: { url: string };
  Settings: undefined;
  AddDevice: undefined;
  PrivacySecurity: undefined;
  ChangePassword: undefined;
  BankAccount: undefined;
  ScanQr: undefined;
  /** serial: TV serial number from the QR code or pairing code. */
  DeviceDetails: { serial: string };
  ClinicRegistered: undefined;
  EditDetails: { pickedLocation?: PickedLocation } | undefined;
  /** Full-screen map to pick the clinic's spot; returns to `returnTo`. */
  MapPicker: {
    returnTo: 'RegisterClinic' | 'EditDetails';
    latitude?: number;
    longitude?: number;
    /** Address text to centre on when there are no coordinates yet. */
    query?: string;
  };
  /** approved = false hides Displays (a pending clinic has none yet). */
  RegisteredDetails: { approved?: boolean } | undefined;
  PaymentDetails: { month: string; paid: boolean; paidOn?: string } | undefined;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type AppScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

/** Props for a screen inside the bottom tabs (can also open stack screens). */
export type TabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<AppStackParamList>
  >;
