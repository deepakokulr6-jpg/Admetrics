import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  WelcomeBack: undefined;
  CreateAccount: undefined;
  ForgotPassword: undefined;
  VerifyOtp: {
    email: string;
    mode?: 'signup' | 'reset';
  };
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
  Statement: undefined;
  Support: undefined;
  Receipt: undefined;
  RegisterClinic: undefined;
  RegisterPersonal: undefined;
  RegisterTimings: undefined;
  RegisterPhotos: undefined;
  ClinicRegistered: undefined;
  EditDetails: undefined;
  RegisteredDetails?: undefined;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type AppScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;
