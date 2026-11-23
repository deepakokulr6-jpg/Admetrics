import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/shared/ScreenHeader';
import InputField from '../../components/shared/InputField';
import GradientButton from '../../components/shared/GradientButton';
import StatusSheet, {
  type SheetStatus,
} from '../../components/shared/StatusSheet';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { ownerKey } from '../../store/slices/clinicDraftSlice';
import {
  type BankAccount,
  saveBankAccount,
} from '../../store/slices/bankAccountSlice';
import type { AppScreenProps } from '../../navigation/types';
import {
  groupDigits,
  isBlank,
  isValidAccountNumber,
  isValidIfsc,
  isValidName,
  lengthError,
  sanitizeName,
} from '../../utils/validation';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import { useFieldChain } from '../../utils/useFieldChain';
import { applyMask, IFSC_MASK, keyboardForMask } from '../../utils/inputMask';
import strings from '../../constants/strings';
import { LIMITS } from '../../constants/fieldLimits';

const t = strings.bankAccount;

/** Indian account numbers: up to 18 digits, shown as "1234 5678 …". */
const ACCOUNT_INPUT_MAX = 18 + Math.floor((18 - 1) / 4);

type Errors = Partial<Record<keyof BankAccount | 'confirmAccount', string>>;

const MIN_LOADING_MS = 900;
const SUCCESS_MS = 1600;
const wait = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(() => resolve(), ms);
  });

const validate = (account: BankAccount, confirmAccount: string): Errors => {
  const errors: Errors = {};
  if (isBlank(account.holderName)) {
    errors.holderName = t.nameRequired;
  } else if (!isValidName(account.holderName.trim())) {
    errors.holderName = strings.registerPersonal.enterAValidName;
  } else if (lengthError(account.holderName, LIMITS.holderName)) {
    errors.holderName = lengthError(account.holderName, LIMITS.holderName);
  }
  if (!account.accountNumber) {
    errors.accountNumber = t.accountRequired;
  } else if (!isValidAccountNumber(account.accountNumber)) {
    errors.accountNumber = t.accountInvalid;
  }
  if (!confirmAccount) {
    errors.confirmAccount = t.confirmRequired;
  } else if (confirmAccount !== account.accountNumber) {
    errors.confirmAccount = t.confirmMismatch;
  }
  if (isBlank(account.ifsc)) {
    errors.ifsc = t.ifscRequired;
  } else if (!isValidIfsc(account.ifsc)) {
    errors.ifsc = t.ifscInvalid;
  }
  return errors;
};

/**
 * Settings › Bank Account: payout account (holder name, account number,
 * IFSC). Opens pre-filled when an account is already saved.
 */
const BankAccountScreen: React.FC<AppScreenProps<'BankAccount'>> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const owner = useAppSelector(state => state.auth.user?.email ?? '');
  const saved = useAppSelector(
    state => state.bankAccount.byOwner[ownerKey(owner)],
  );
  // Editing an existing account (decided on open, not after this save).
  const [isEditing] = useState(Boolean(saved));

  const [account, setAccount] = useState<BankAccount>(
    saved ?? { holderName: '', accountNumber: '', ifsc: '' },
  );
  // Typed twice (first one hidden) so a wrong digit can't slip through.
  const [confirmAccount, setConfirmAccount] = useState(
    saved?.accountNumber ?? '',
  );
  const [errors, setErrors] = useState<Errors>({});
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetStatus, setSheetStatus] = useState<SheetStatus>('loading');

  const update = (patch: Partial<BankAccount>) => {
    setAccount(previous => ({ ...previous, ...patch }));
    // Clear a field's error as soon as it is edited.
    setErrors(previous => {
      const next = { ...previous };
      (Object.keys(patch) as (keyof BankAccount)[]).forEach(
        key => delete next[key],
      );
      return next;
    });
  };

  const onSave = async () => {
    const trimmed: BankAccount = {
      holderName: account.holderName.trim(),
      accountNumber: account.accountNumber,
      ifsc: account.ifsc.trim().toUpperCase(),
    };
    const found = validate(trimmed, confirmAccount);
    setErrors(found);
    if (Object.keys(found).length) {
      return;
    }
    // Same "loading → success" sheet as the other flows.
    setSheetStatus('loading');
    setSheetVisible(true);
    await wait(MIN_LOADING_MS);
    dispatch(saveBankAccount({ owner, account: trimmed }));
    setSheetStatus('success');
    await wait(SUCCESS_MS);
    setSheetVisible(false);
  };

  // Keyboard Next: holder → account → re-enter → IFSC → Save.
  const chain = useFieldChain(
    ['holder', 'account', 'confirm', 'ifsc'] as const,
    onSave,
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader
        title={saved ? t.editTitle : t.addTitle}
        onBackPress={() => navigation.goBack()}
      />

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
          <Text style={styles.heading}>{t.section}</Text>

          <InputField
            label={t.holderName}
            required
            placeholder={t.holderPlaceholder}
            value={account.holderName}
            onChangeText={value => update({ holderName: sanitizeName(value) })}
            autoCapitalize="words"
            textContentType="name"
            autoComplete="name"
            maxLength={LIMITS.holderName.max}
            error={errors.holderName}
            {...chain('holder')}
          />

          {/* Hidden (Figma "**** ****"); grouped in 4s, stored as digits. */}
          <InputField
            label={t.accountNumber}
            required
            placeholder={t.accountPlaceholder}
            value={groupDigits(account.accountNumber)}
            onChangeText={value =>
              update({ accountNumber: value.replace(/\D/g, '').slice(0, 18) })
            }
            keyboardType="number-pad"
            secureTextEntry
            textContentType="none"
            autoComplete="off"
            // 18 digits + the spaces shown between groups of 4.
            maxLength={ACCOUNT_INPUT_MAX}
            error={errors.accountNumber}
            {...chain('account')}
          />

          <InputField
            label={t.confirmAccount}
            required
            placeholder={t.confirmPlaceholder}
            value={groupDigits(confirmAccount)}
            onChangeText={value => {
              setConfirmAccount(value.replace(/\D/g, '').slice(0, 18));
              setErrors(previous => ({
                ...previous,
                confirmAccount: undefined,
              }));
            }}
            keyboardType="number-pad"
            textContentType="none"
            autoComplete="off"
            // 18 digits + the spaces shown between groups of 4.
            maxLength={ACCOUNT_INPUT_MAX}
            error={errors.confirmAccount}
            {...chain('confirm')}
          />

          <InputField
            label={t.ifsc}
            required
            placeholder={t.ifscPlaceholder}
            value={account.ifsc}
            onChangeText={value =>
              update({
                ifsc: applyMask(value, IFSC_MASK),
              })
            }
            autoCapitalize="characters"
            // Letters for the bank code, numbers after the fixed 0.
            keyboardType={keyboardForMask(account.ifsc, IFSC_MASK)}
            maxLength={IFSC_MASK.length}
            error={errors.ifsc}
            {...chain('ifsc')}
          />

          <GradientButton
            title={t.save}
            onPress={onSave}
            style={styles.button}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <StatusSheet
        visible={sheetVisible}
        status={sheetStatus}
        title={
          sheetStatus === 'success'
            ? isEditing
              ? t.updated
              : t.saved
            : t.saving
        }
        message={sheetStatus === 'success' ? t.savedMessage : t.savingMessage}
        onHidden={() => {
          if (sheetStatus === 'success') {
            navigation.goBack();
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
      gap: verticalScale(16),
    },
    heading: {
      fontSize: normalizeFont(16),
      fontFamily: fonts.semibold,
      color: colors.textStrong,
    },
    // Figma: Save pill ~120px under the last field.
    button: {
      marginTop: verticalScale(80),
    },
  }),
);

export default BankAccountScreen;
