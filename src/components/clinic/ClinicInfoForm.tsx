import React, { useEffect, useRef, useState } from 'react';
import {
  type RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  type TextInputProps,
} from 'react-native';

import Svg, { Path } from 'react-native-svg';

import InputField from '../shared/InputField';
import {
  applyMask,
  GST_MASK,
  keyboardForMask,
  PAN_MASK,
} from '../../utils/inputMask';
import MapPreview from './MapPreview';
import StatePickerSheet from './StatePickerSheet';
import YearPickerSheet from './YearPickerSheet';
import { formStyles } from '../shared/FormScreenLayout';
import type { ClinicInfo } from '../../types/clinic';
import type { AppStackParamList } from '../../navigation/types';
import type { ClinicErrors } from '../../utils/clinicValidation';
import strings from '../../constants/strings';
import { LIMITS } from '../../constants/fieldLimits';
import {
  type CityOption,
  lookupPincode,
  searchCities,
  stateForCity,
} from '../../utils/pincode';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';

type Field = {
  key: keyof ClinicInfo;
  label: string;
  placeholder: string;
  required?: boolean;
  upperCase?: boolean;
  /** Fixed format (see utils/inputMask): filters input, picks the keyboard. */
  mask?: string;
} & Pick<
  TextInputProps,
  | 'autoCapitalize'
  | 'keyboardType'
  | 'maxLength'
  | 'textContentType'
  | 'autoComplete'
>;

const { clinicForm } = strings;

const FIELDS: Field[] = [
  {
    key: 'clinicName',
    label: clinicForm.clinicName,
    placeholder: clinicForm.enterClinicName,
    required: true,
    autoCapitalize: 'words',
    textContentType: 'organizationName',
    maxLength: LIMITS.clinicName.max,
  },
  {
    key: 'medicalRegistrationNumber',
    label: clinicForm.medicalRegistrationNumber,
    placeholder: clinicForm.enterMedicalRegistrationNumber,
    required: true,
    upperCase: true,
    autoCapitalize: 'characters',
    maxLength: LIMITS.medicalRegistrationNumber.max,
  },
  {
    key: 'establishmentYear',
    label: clinicForm.establishmentYear,
    placeholder: clinicForm.eG2023,
    keyboardType: 'number-pad',
    maxLength: 4,
  },
  {
    key: 'licenceNumber',
    label: clinicForm.registrationLicenceNumber,
    placeholder: clinicForm.enterRegistrationOrLicenceNumber,
    required: true,
    upperCase: true,
    autoCapitalize: 'characters',
    maxLength: LIMITS.licenceNumber.max,
  },
  {
    key: 'gstNumber',
    label: clinicForm.gstNumber,
    placeholder: clinicForm.enterGstNumber,
    required: true,
    mask: GST_MASK,
    autoCapitalize: 'characters',
    maxLength: GST_MASK.length,
  },
  {
    key: 'panNumber',
    label: clinicForm.panNumber,
    placeholder: clinicForm.enterPanNumber,
    mask: PAN_MASK,
    autoCapitalize: 'characters',
    maxLength: PAN_MASK.length,
  },
  {
    key: 'address',
    label: clinicForm.address,
    placeholder: clinicForm.enterClinicAddress,
    autoCapitalize: 'sentences',
    textContentType: 'streetAddressLine1',
    autoComplete: 'address-line1',
    maxLength: LIMITS.address.max,
  },
  {
    key: 'street',
    label: clinicForm.street,
    placeholder: clinicForm.enterStreet,
    required: true,
    autoCapitalize: 'sentences',
    textContentType: 'streetAddressLine2',
    autoComplete: 'address-line2',
    maxLength: LIMITS.street.max,
  },
  {
    key: 'pincode',
    label: clinicForm.pincode,
    placeholder: clinicForm.enterPincode,
    required: true,
    keyboardType: 'number-pad',
    maxLength: 6,
    textContentType: 'postalCode',
    autoComplete: 'postal-code',
  },
  {
    key: 'city',
    label: clinicForm.city,
    placeholder: clinicForm.enterCity,
    autoCapitalize: 'words',
    textContentType: 'addressCity',
    maxLength: LIMITS.city.max,
  },
  {
    key: 'state',
    label: clinicForm.state,
    placeholder: clinicForm.enterState,
    autoCapitalize: 'words',
  },
];

/** Picker fields open a sheet; "Next" skips them. */
const PICKER_FIELDS: (keyof ClinicInfo)[] = ['establishmentYear', 'state'];
const TYPED_KEYS = FIELDS.map(field => field.key).filter(
  key => !PICKER_FIELDS.includes(key),
);

// The map and working hours now sit below these fields, so no field jumps
// to the end of the form; the focused field is revealed instead.
export const CLINIC_BOTTOM_FIELDS: (keyof ClinicInfo)[] = [];

type Props = {
  values: ClinicInfo;
  errors: ClinicErrors;
  onChange: (key: keyof ClinicInfo, value: string) => void;
  onFieldFocus?: (key: keyof ClinicInfo) => void;
};

/** "Clinic Information" fields + map, shared by Register Clinic and Edit Details. */
const ClinicInfoForm: React.FC<Props> = ({
  values,
  errors,
  onChange,
  onFieldFocus,
}) => {
  // City / State we filled from the pincode: replaced again when the pincode
  // changes, but anything the user typed themselves is never overwritten.
  const autoFilled = useRef<{ city?: string; state?: string }>({});
  const [cityFocused, setCityFocused] = useState(false);
  // Typed fields, so each "Next" key can focus the following one.
  const inputRefs = useRef<
    Partial<
      Record<keyof ClinicInfo, React.ComponentRef<typeof TextInput> | null>
    >
  >({});
  const [statePickerOpen, setStatePickerOpen] = useState(false);
  const [yearPickerOpen, setYearPickerOpen] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route =
    useRoute<RouteProp<AppStackParamList, 'RegisterClinic' | 'EditDetails'>>();
  const picked = route.params?.pickedLocation;

  // Back from the map: save the pin and fill the address from it. The map
  // is an explicit choice, so it sets pincode / city / state; Street only
  // if empty, and the building line is always left to the user.
  useEffect(() => {
    if (!picked) {
      return;
    }
    onChange('latitude', String(picked.latitude));
    onChange('longitude', String(picked.longitude));
    if (picked.street && !values.street.trim()) {
      onChange('street', picked.street);
    }
    if (picked.pincode) {
      onChange('pincode', picked.pincode);
    }
    const city = lookupPincode(picked.pincode)?.district ?? picked.city;
    if (city) {
      autoFilled.current.city = city;
      onChange('city', city);
    }
    const state = lookupPincode(picked.pincode)?.state ?? picked.state;
    if (state) {
      autoFilled.current.state = state;
      onChange('state', state);
    }
    navigation.setParams({ pickedLocation: undefined });
    // Only when a new pick arrives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked]);

  const openMap = () => {
    const lat = parseFloat(values.latitude);
    const lng = parseFloat(values.longitude);
    const hasPin = Number.isFinite(lat) && Number.isFinite(lng);
    navigation.navigate('MapPicker', {
      returnTo: route.name,
      ...(hasPin ? { latitude: lat, longitude: lng } : null),
      query: [values.pincode, values.city, values.state]
        .map(part => part.trim())
        .filter(Boolean)
        .join(', '),
    });
  };

  /** Fill State unless the user chose a different one themselves. */
  const autoFillState = (state: string) => {
    const current = values.state.trim();
    if (!current || current === autoFilled.current.state) {
      autoFilled.current.state = state;
      onChange('state', state);
    }
  };

  const pickCity = ({ district, state }: CityOption) => {
    autoFilled.current.city = district;
    onChange('city', district);
    // An explicit city choice decides the state.
    autoFilled.current.state = state;
    onChange('state', state);
    setCityFocused(false);
    Keyboard.dismiss();
  };

  const fillFromPincode = (pincode: string) => {
    const info = lookupPincode(pincode);
    if (!info) {
      return;
    }
    (
      [
        ['city', info.district],
        ['state', info.state],
      ] as const
    ).forEach(([key, value]) => {
      const current = values[key].trim();
      if (!current || current === autoFilled.current[key]) {
        autoFilled.current[key] = value;
        onChange(key, value);
      }
    });
  };

  const handleChange = (key: keyof ClinicInfo, value: string) => {
    if (key === 'pincode') {
      const digits = value.replace(/\D/g, '').slice(0, 6);
      onChange(key, digits);
      if (digits.length === 6) {
        fillFromPincode(digits);
      }
      return;
    }
    onChange(key, value);
    if (key === 'city') {
      const state = stateForCity(value);
      if (state) {
        autoFillState(state);
      }
    }
  };

  const citySuggestions = cityFocused
    ? searchCities(values.city).filter(
        c => c.district.toLowerCase() !== values.city.trim().toLowerCase(),
      )
    : [];

  // A well-formed pincode that isn't in the India Post list: warn, don't block
  // (the list may miss very new pincodes).
  const pincodeInfo =
    values.pincode.length === 6 ? lookupPincode(values.pincode) : null;
  const pincodeWarning =
    values.pincode.length === 6 && !pincodeInfo
      ? strings.clinicForm.unknownPincode
      : undefined;
  // Pincode and State disagree (e.g. 380xxx with Maharashtra).
  const stateWarning =
    pincodeInfo && values.state.trim() && values.state !== pincodeInfo.state
      ? strings.clinicForm.stateMismatch(pincodeInfo.state)
      : undefined;

  return (
    <>
      <Text style={formStyles.heading}>{strings.common.clinicInformation}</Text>

      {FIELDS.map(({ key, upperCase, mask, ...field }) => {
        const nextKey = TYPED_KEYS[TYPED_KEYS.indexOf(key) + 1];
        const typed = TYPED_KEYS.includes(key);
        return (
          <React.Fragment key={key}>
            <InputField
              {...field}
              inputRef={input => {
                inputRefs.current[key] = input;
              }}
              // Keyboard follows the format: numbers for a digit position.
              keyboardType={
                mask ? keyboardForMask(values[key], mask) : field.keyboardType
              }
              returnKeyType={typed ? (nextKey ? 'next' : 'done') : undefined}
              submitBehavior={nextKey ? 'submit' : 'blurAndSubmit'}
              onSubmitEditing={() => {
                if (nextKey) {
                  inputRefs.current[nextKey]?.focus();
                }
              }}
              value={values[key]}
              onChangeText={value =>
                handleChange(
                  key,
                  mask
                    ? applyMask(value, mask)
                    : upperCase
                    ? value.toUpperCase()
                    : value,
                )
              }
              onFocus={() => {
                onFieldFocus?.(key);
                if (key === 'city') {
                  setCityFocused(true);
                }
              }}
              // Let a tap on a suggestion land before the list hides.
              onBlur={
                key === 'city'
                  ? () => setTimeout(() => setCityFocused(false), 150)
                  : undefined
              }
              // Pickers: the whole field opens the sheet.
              onPress={
                key === 'state'
                  ? () => setStatePickerOpen(true)
                  : key === 'establishmentYear'
                  ? () => setYearPickerOpen(true)
                  : undefined
              }
              rightElement={
                key === 'state' ? (
                  <Chevron />
                ) : key === 'establishmentYear' ? (
                  // Figma: blue calendar icon; the field opens a year list.
                  <CalendarIcon />
                ) : undefined
              }
              error={
                errors[key] ??
                (key === 'pincode'
                  ? pincodeWarning
                  : key === 'state'
                  ? stateWarning
                  : undefined)
              }
            />

            {key === 'city' && citySuggestions.length ? (
              <View style={styles.suggestions}>
                {citySuggestions.map(option => (
                  <Pressable
                    key={option.district}
                    onPress={() => pickCity(option)}
                    accessibilityRole="button"
                    style={({ pressed }) => [
                      styles.suggestion,
                      pressed && styles.suggestionPressed,
                    ]}
                  >
                    <Text style={styles.suggestionCity}>{option.district}</Text>
                    <Text style={styles.suggestionState}>{option.state}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </React.Fragment>
        );
      })}

      <YearPickerSheet
        visible={yearPickerOpen}
        selected={values.establishmentYear}
        onSelect={year => onChange('establishmentYear', year)}
        onClose={() => setYearPickerOpen(false)}
      />

      <StatePickerSheet
        visible={statePickerOpen}
        selected={values.state}
        onSelect={state => {
          autoFilled.current.state = undefined;
          onChange('state', state);
        }}
        onClose={() => setStatePickerOpen(false)}
      />

      <MapPreview
        latitude={values.latitude ? parseFloat(values.latitude) : undefined}
        longitude={values.longitude ? parseFloat(values.longitude) : undefined}
        onPress={openMap}
      />
    </>
  );
};

/** Filled blue calendar on the Establishment Year field. */
const CalendarIcon = () => (
  <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24">
    <Path
      d="M7 2.5a1 1 0 011 1V4h8v-.5a1 1 0 112 0V4h1a2.5 2.5 0 012.5 2.5v12A2.5 2.5 0 0119 21H5a2.5 2.5 0 01-2.5-2.5v-12A2.5 2.5 0 015 4h1v-.5a1 1 0 011-1zM4.5 9.5v9a.5.5 0 00.5.5h14a.5.5 0 00.5-.5v-9h-15z"
      fill={colors.buttonPrimary}
    />
    <Path
      d="M7 11.5h2v2H7zM11 11.5h2v2h-2zM15 11.5h2v2h-2zM7 15h2v2H7zM11 15h2v2h-2z"
      fill={colors.buttonPrimary}
    />
  </Svg>
);

/** Down arrow on the State field (it opens a list). */
const Chevron = () => (
  <Svg width={scale(16)} height={scale(16)} viewBox="0 0 24 24">
    <Path
      d="M6 9l6 6 6-6"
      stroke={colors.mutedText}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const styles = themedStyles(() =>
  StyleSheet.create({
    // City suggestions: a card under the field, above the next one.
    suggestions: {
      marginTop: -verticalScale(8),
      marginBottom: verticalScale(12),
      borderWidth: 1,
      borderColor: colors.borderLight,
      borderRadius: scale(6),
      backgroundColor: colors.white,
      overflow: 'hidden',
    },
    suggestion: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: scale(14),
      paddingVertical: verticalScale(10),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
    },
    suggestionPressed: {
      backgroundColor: colors.background,
    },
    suggestionCity: {
      fontSize: normalizeFont(14),
      fontFamily: fonts.medium,
      color: colors.textStrong,
    },
    suggestionState: {
      fontSize: normalizeFont(12),
      fontFamily: fonts.regular,
      color: colors.mutedText,
    },
  }),
);

export default ClinicInfoForm;
