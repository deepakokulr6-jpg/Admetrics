import React from 'react';
import { Alert, Linking, Text, type TextInputProps } from 'react-native';

import InputField from '../shared/InputField';
import MapPreview from './MapPreview';
import { formStyles } from '../shared/FormScreenLayout';
import type { ClinicInfo } from '../../types/clinic';
import type { ClinicErrors } from '../../utils/clinicValidation';
import strings from '../../constants/strings';

type Field = {
  key: keyof ClinicInfo;
  label: string;
  placeholder: string;
  required?: boolean;
  upperCase?: boolean;
} & Pick<TextInputProps, 'autoCapitalize' | 'keyboardType' | 'maxLength'>;

const { clinicForm } = strings;

const FIELDS: Field[] = [
  {
    key: 'clinicName',
    label: clinicForm.clinicName,
    placeholder: clinicForm.enterClinicName,
    required: true,
    autoCapitalize: 'words',
  },
  {
    key: 'medicalRegistrationNumber',
    label: clinicForm.medicalRegistrationNumber,
    placeholder: clinicForm.enterMedicalRegistrationNumber,
    required: true,
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
    autoCapitalize: 'characters',
  },
  {
    key: 'gstNumber',
    label: clinicForm.gstNumber,
    placeholder: clinicForm.enterGstNumber,
    required: true,
    upperCase: true,
    autoCapitalize: 'characters',
    maxLength: 15,
  },
  {
    key: 'panNumber',
    label: clinicForm.panNumber,
    placeholder: clinicForm.enterPanNumber,
    upperCase: true,
    autoCapitalize: 'characters',
    maxLength: 10,
  },
  {
    key: 'address',
    label: clinicForm.address,
    placeholder: clinicForm.enterClinicAddress,
    autoCapitalize: 'sentences',
  },
  {
    key: 'street',
    label: clinicForm.street,
    placeholder: clinicForm.enterStreet,
    autoCapitalize: 'sentences',
  },
  {
    key: 'city',
    label: clinicForm.city,
    placeholder: clinicForm.enterCity,
    autoCapitalize: 'words',
  },
  {
    key: 'state',
    label: clinicForm.state,
    placeholder: clinicForm.enterState,
    autoCapitalize: 'words',
  },
  {
    key: 'pincode',
    label: clinicForm.pincode,
    placeholder: clinicForm.enterPincode,
    keyboardType: 'number-pad',
    maxLength: 6,
  },
];

/** Fields near the map / Next button: scroll the form to its end on focus. */
export const CLINIC_BOTTOM_FIELDS: (keyof ClinicInfo)[] = [
  'city',
  'state',
  'pincode',
];

const openInMaps = async (clinic: ClinicInfo) => {
  const query = [
    clinic.address,
    clinic.street,
    clinic.city,
    clinic.state,
    clinic.pincode,
  ]
    .map(part => part.trim())
    .filter(Boolean)
    .join(', ');

  if (!query) {
    Alert.alert(
      strings.registerClinic.addressRequired,
      strings.registerClinic.enterTheClinicAddressBefore,
    );
    return;
  }

  try {
    await Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        query,
      )}`,
    );
  } catch {
    Alert.alert(
      strings.registerClinic.mapUnavailable,
      strings.registerClinic.noMapApplicationCouldBe,
    );
  }
};

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
}) => (
  <>
    <Text style={formStyles.heading}>{strings.common.clinicInformation}</Text>

    {FIELDS.map(({ key, upperCase, ...field }) => (
      <InputField
        key={key}
        {...field}
        value={values[key]}
        onChangeText={value =>
          onChange(key, upperCase ? value.toUpperCase() : value)
        }
        onFocus={() => onFieldFocus?.(key)}
        error={errors[key]}
      />
    ))}

    <MapPreview onPress={() => openInMaps(values)} />
  </>
);

export default ClinicInfoForm;
