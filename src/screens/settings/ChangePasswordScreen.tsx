import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ScreenHeader from '../../components/shared/ScreenHeader';
import InputField from '../../components/shared/InputField';
import GradientButton from '../../components/shared/GradientButton';
import ForgotPasswordLink from '../../components/auth/ForgotPasswordLink';
import StatusSheet, {
  type SheetStatus,
} from '../../components/shared/StatusSheet';
import { useAuth } from '../../hooks/useAuth';
import { ApiError } from '../../api/client';
import { apiErrorMessage } from '../../utils/apiErrorMessage';
import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import { useFieldChain } from '../../utils/useFieldChain';
import strings from '../../constants/strings';
import { LIMITS } from '../../constants/fieldLimits';
import { appAlert } from '../../components/shared/AppAlert';

const t = strings.changePassword;
const MIN_LOADING_MS = 900;

type Field = 'current' | 'next' | 'confirm';
type Errors = Partial<Record<Field, string>>;

const wait = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(() => resolve(), ms);
  });

/** Eye toggle shown inside each password field. */
const EyeToggle = ({
  visible,
  onPress,
}: {
  visible: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    hitSlop={10}
    accessibilityRole="button"
    accessibilityLabel={visible ? t.hide : t.show}
  >
    <Ionicons
      name={visible ? 'eye-off-outline' : 'eye-outline'}
      size={scale(18)}
      color={colors.mutedText}
    />
  </Pressable>
);

/**
 * Privacy & Security › Change Password: current password, new password
 * (8+ characters, different from the current one) and confirmation.
 */
const ChangePasswordScreen: React.FC<AppScreenProps<'ChangePassword'>> = ({
  navigation,
}) => {
  const { user, changePassword, signOut } = useAuth();
  const [values, setValues] = useState<Record<Field, string>>({
    current: '',
    next: '',
    confirm: '',
  });
  const [shown, setShown] = useState<Record<Field, boolean>>({
    current: false,
    next: false,
    confirm: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetStatus, setSheetStatus] = useState<SheetStatus>('loading');
  const saved = useRef(false);
  // Error to show once the status sheet has fully closed: iOS can't open a
  // dialog while another modal is still animating away.
  const pendingAlert = useRef<string | null>(null);

  const update = (field: Field, value: string) => {
    setValues(previous => ({ ...previous, [field]: value }));
    setErrors(previous => ({ ...previous, [field]: undefined }));
  };

  const validate = (): Errors => {
    const found: Errors = {};
    if (!values.current) {
      found.current = t.currentRequired;
    }
    if (values.next.length < LIMITS.password.min) {
      found.next = t.tooShort;
    } else if (values.next === values.current) {
      found.next = t.sameAsCurrent;
    }
    if (values.confirm !== values.next) {
      found.confirm = t.mismatch;
    }
    return found;
  };

  const submit = async () => {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length || !user) {
      return;
    }

    saved.current = false;
    setSheetStatus('loading');
    setSheetVisible(true);
    try {
      await Promise.all([
        changePassword(user.email, values.current, values.next),
        wait(MIN_LOADING_MS),
      ]);
      saved.current = true;
      // Stays up until the user taps Done (Figma).
      setSheetStatus('success');
    } catch (error) {
      setSheetVisible(false);
      // 400/401 here = the current password is wrong; others are general.
      const status = error instanceof ApiError ? error.status : -1;
      if (status === 400 || status === 401 || status === 403) {
        setErrors({ current: t.currentIncorrect });
      } else {
        pendingAlert.current = apiErrorMessage(error, 'general');
      }
    }
  };

  // Reset needs the signed-out OTP flow, so sign out first (with consent).
  const forgot = () =>
    appAlert(t.forgotTitle, t.forgotMessage, [
      { text: t.cancel, style: 'cancel' },
      { text: t.signOutAndReset, onPress: () => signOut() },
    ]);

  // Keyboard: current → new → confirm, Done updates the password.
  const chain = useFieldChain(['current', 'next', 'confirm'] as const, () =>
    submit(),
  );

  const field = (
    key: Field,
    label: string,
    placeholder: string,
    textContentType: 'password' | 'newPassword',
  ) => (
    <InputField
      label={label}
      required
      placeholder={placeholder}
      value={values[key]}
      onChangeText={value => update(key, value)}
      secureTextEntry={!shown[key]}
      textContentType={textContentType}
      autoComplete={
        textContentType === 'password' ? 'current-password' : 'new-password'
      }
      maxLength={LIMITS.password.max}
      error={errors[key]}
      {...chain(key)}
      rightElement={
        <EyeToggle
          visible={shown[key]}
          onPress={() =>
            setShown(previous => ({ ...previous, [key]: !previous[key] }))
          }
        />
      }
    />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader title={t.title} onBackPress={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>{t.heading}</Text>
          <Text style={styles.intro}>{t.intro}</Text>

          <View style={styles.fields}>
            <View>
              {field('current', t.current, t.currentPlaceholder, 'password')}
              <ForgotPasswordLink onPress={forgot} />
            </View>
            {field('next', t.newPassword, t.newPlaceholder, 'newPassword')}
            {field('confirm', t.confirm, t.confirmPlaceholder, 'newPassword')}
          </View>

          <GradientButton
            title={t.update}
            onPress={submit}
            style={styles.button}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <StatusSheet
        visible={sheetVisible}
        status={sheetStatus}
        title={sheetStatus === 'success' ? t.updated : t.updating}
        message={
          sheetStatus === 'success' ? t.updatedMessage : t.updatingMessage
        }
        actionLabel={t.done}
        onAction={() => setSheetVisible(false)}
        onHidden={() => {
          if (saved.current) {
            navigation.goBack();
          } else if (pendingAlert.current) {
            appAlert(t.title, pendingAlert.current);
            pendingAlert.current = null;
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.white,
    },
    flex: {
      flex: 1,
    },
    content: {
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(24),
      paddingBottom: verticalScale(32),
    },
    heading: {
      fontSize: normalizeFont(18),
      lineHeight: normalizeFont(24),
      fontFamily: fonts.bold,
      color: colors.textStrong,
    },
    intro: {
      marginTop: verticalScale(8),
      fontSize: normalizeFont(12),
      lineHeight: normalizeFont(18),
      fontFamily: fonts.regular,
      color: colors.bodyText,
    },
    fields: {
      marginTop: verticalScale(24),
      gap: verticalScale(4),
    },
    // Figma: wide pill ~90px below the last field.
    button: {
      width: scale(184),
      marginTop: verticalScale(56),
    },
  }),
);

export default ChangePasswordScreen;
