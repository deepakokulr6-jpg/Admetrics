import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/shared/ScreenHeader';
import StepProgress from '../../components/shared/StepProgress';
import InputField from '../../components/shared/InputField';
import GradientButton from '../../components/shared/GradientButton';
import { useClinicRegistration } from '../../contexts/ClinicRegistrationContext';
import { useAuth } from '../../contexts/AuthContext';
import { PersonalInfo } from '../../types/clinic';
import { isBlank, isValidEmail, isValidMobile } from '../../utils/validation';
import { useKeyboardAutoScroll } from '../../utils/useKeyboardAutoScroll';
import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';

type PersonalErrors = Partial<Record<keyof PersonalInfo, string>>;

// The last fields sit right above the Next button, so the form scrolls to its
// end when one of them is focused to keep the button above the keyboard.
const BOTTOM_FIELDS: (keyof PersonalInfo)[] = ['mobile', 'email'];

const validatePersonal = (personal: PersonalInfo): PersonalErrors => {
  const errors: PersonalErrors = {};

  if (isBlank(personal.contactPerson)) {
    errors.contactPerson = strings.registerPersonal.contactPersonIsRequired;
  }

  if (!isBlank(personal.mobile) && !isValidMobile(personal.mobile)) {
    errors.mobile = strings.registerPersonal.enterAValid10Digit;
  }

  if (isBlank(personal.email)) {
    errors.email = strings.registerPersonal.emailIdIsRequired;
  } else if (!isValidEmail(personal.email)) {
    errors.email = strings.registerPersonal.enterAValidEmailAddress;
  }

  return errors;
};

const RegisterPersonalScreen: React.FC<AppScreenProps<'RegisterPersonal'>> = ({
  navigation,
}) => {
  const { draft, updatePersonalInfo } = useClinicRegistration();
  const { user } = useAuth();
  // Figma shows the Email ID pre-filled from the signed-in account and locked.
  const personal = {
    ...draft.personal,
    email: draft.personal.email || user?.email || '',
  };

  const { scrollRef, onScroll, onLayout, setAutoScroll } =
    useKeyboardAutoScroll();

  const [errors, setErrors] = useState<PersonalErrors>({});

  const focusProps = (field: keyof PersonalInfo) => ({
    onFocus: () => setAutoScroll(BOTTOM_FIELDS.includes(field)),
  });

  const update = (key: keyof PersonalInfo, value: string) => {
    updatePersonalInfo({ [key]: value });
    setErrors(previous => {
      if (!previous[key]) {
        return previous;
      }

      const next = { ...previous };
      delete next[key];
      return next;
    });
  };

  const handleNext = () => {
    const nextErrors = validatePersonal(personal);
    if (!draft.personal.email && personal.email) {
      updatePersonalInfo({ email: personal.email });
    }
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      Alert.alert(
        strings.registerPersonal.checkPersonalDetails,
        strings.registerPersonal.pleaseCompleteTheRequiredPersonal,
      );
      return;
    }

    // The required registration flow goes straight from personal details to
    // photos. The timings screen remains available as a standalone route.
    navigation.navigate('RegisterPhotos');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader
        title={strings.common.registerYourClinic}
        onBackPress={() => navigation.goBack()}
      />
      <StepProgress currentStep={2} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          onScroll={onScroll}
          onLayout={onLayout}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>
            {strings.common.contactInformation}
          </Text>

          <InputField
            label={strings.registerPersonal.contactPersonNumber}
            placeholder={strings.registerPersonal.enterContactPersonName}
            value={personal.contactPerson}
            onChangeText={value => update('contactPerson', value)}
            {...focusProps('contactPerson')}
            autoCapitalize="words"
            error={errors.contactPerson}
          />

          <InputField
            label={strings.registerPersonal.designation}
            placeholder={strings.registerPersonal.enterDesignation}
            value={personal.designation}
            onChangeText={value => update('designation', value)}
            {...focusProps('designation')}
            autoCapitalize="words"
            error={errors.designation}
          />

          <InputField
            label={strings.registerPersonal.mobileNumber}
            placeholder={strings.registerPersonal.enterMobileNumber}
            value={personal.mobile}
            onChangeText={value =>
              update('mobile', value.replace(/[^\d+\s-]/g, ''))
            }
            {...focusProps('mobile')}
            keyboardType="phone-pad"
            maxLength={15}
            error={errors.mobile}
          />

          <InputField
            label={strings.registerPersonal.emailId}
            placeholder={strings.registerPersonal.enterEmailAddress}
            value={personal.email}
            onChangeText={value => update('email', value.trim())}
            {...focusProps('email')}
            editable={!user?.email}
            keyboardType="email-address"
            textContentType="emailAddress"
            error={errors.email}
          />

          <View style={styles.button}>
            <GradientButton title={strings.common.next} onPress={handleNext} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },

  flex: {
    flex: 1,
  },

  content: {
    width: '100%',
    maxWidth: scale(420),
    alignSelf: 'center',
    flexGrow: 1,
    paddingHorizontal: scale(16),
    paddingTop: 0,
    paddingBottom: verticalScale(110),
  },

  heading: {
    fontSize: normalizeFont(16),
    lineHeight: normalizeFont(19),
    fontFamily: fonts.semibold,
    color: colors.text,
    marginBottom: verticalScale(16),
  },

  // Figma pins the Next button at y634 of 800 on short forms.
  button: {
    marginTop: 'auto',
    paddingTop: verticalScale(24),
  },
});

export default RegisterPersonalScreen;
