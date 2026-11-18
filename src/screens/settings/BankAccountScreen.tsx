import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/shared/ScreenHeader';
import InputField from '../../components/shared/InputField';
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
  sanitizeName,
} from '../../utils/validation';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';

const t = strings.bankAccount;

type Errors = Partial<Record<keyof BankAccount, string>>;

const validate = (account: BankAccount): Errors => {
  const errors: Errors = {};
  if (isBlank(account.holderName)) {
    errors.holderName = t.nameRequired;
  } else if (!isValidName(account.holderName.trim())) {
    errors.holderName = strings.registerPersonal.enterAValidName;
  }
  if (!account.accountNumber) {
    errors.accountNumber = t.accountRequired;
  } else if (!isValidAccountNumber(account.accountNumber)) {
    errors.accountNumber = t.accountInvalid;
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

  const [account, setAccount] = useState<BankAccount>(
    saved ?? { holderName: '', accountNumber: '', ifsc: '' },
  );
  const [errors, setErrors] = useState<Errors>({});

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

  const onSave = () => {
    const trimmed: BankAccount = {
      holderName: account.holderName.trim(),
      accountNumber: account.accountNumber,
      ifsc: account.ifsc.trim().toUpperCase(),
    };
    const found = validate(trimmed);
    setErrors(found);
    if (Object.keys(found).length === 0) {
      dispatch(saveBankAccount({ owner, account: trimmed }));
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader
        title={saved ? t.editTitle : t.addTitle}
        onBackPress={() => navigation.goBack()}
        rightElement={
          <Pressable onPress={onSave} accessibilityRole="button" hitSlop={10}>
            <Text style={styles.save}>{t.save}</Text>
          </Pressable>
        }
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
            maxLength={60}
            error={errors.holderName}
          />

          {/* Shown in groups of 4; stored as plain digits. */}
          <InputField
            label={t.accountNumber}
            required
            placeholder={t.accountPlaceholder}
            value={groupDigits(account.accountNumber)}
            onChangeText={value =>
              update({ accountNumber: value.replace(/\D/g, '').slice(0, 18) })
            }
            keyboardType="number-pad"
            maxLength={22}
            error={errors.accountNumber}
          />

          <InputField
            label={t.ifsc}
            required
            placeholder={t.ifscPlaceholder}
            value={account.ifsc}
            onChangeText={value =>
              update({
                ifsc: value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, '')
                  .slice(0, 11),
              })
            }
            autoCapitalize="characters"
            maxLength={11}
            error={errors.ifsc}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
    // Figma: blue "Save" text action on the right of the header.
    save: {
      fontSize: normalizeFont(14),
      fontFamily: fonts.bold,
      color: colors.buttonPrimary,
    },
  }),
);

export default BankAccountScreen;
