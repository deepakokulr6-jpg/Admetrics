import type { NativeStackScreenProps } from '@react-navigation/native-stack';

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

export type AppStackParamList = {
  Home: undefined;
  A15Home: undefined;
  Revenue: undefined;
  RegisterClinic: undefined;
  RegisterPersonal: undefined;
  RegisterTimings: undefined;
  RegisterPhotos: undefined;
  ClinicRegistered: undefined;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type AppScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;
