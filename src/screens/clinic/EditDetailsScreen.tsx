import React, { useState } from 'react';
import {
  Image,
  type ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import FormScreenLayout, {
  formStyles,
} from '../../components/shared/FormScreenLayout';
import GradientButton from '../../components/shared/GradientButton';
import InputField from '../../components/shared/InputField';
import StatusSheet, {
  type SheetStatus,
} from '../../components/shared/StatusSheet';
import ClinicInfoForm, {
  CLINIC_BOTTOM_FIELDS,
} from '../../components/clinic/ClinicInfoForm';
import WorkingHoursSection from '../../components/clinic/WorkingHoursSection';
import {
  type ClinicInfo,
  createDefaultWorkingHours,
  type PersonalInfo,
  type WorkingHour,
} from '../../types/clinic';
import {
  type ClinicErrors,
  hasErrors,
  type PersonalErrors,
  validateClinic,
  validatePersonal,
  withoutError,
} from '../../utils/clinicValidation';
import { validateWorkingHours } from '../../utils/workingHours';
import { sanitizeName } from '../../utils/validation';
import { useKeyboardAutoScroll } from '../../utils/useKeyboardAutoScroll';
import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { useFieldChain } from '../../utils/useFieldChain';
import strings from '../../constants/strings';
import { LIMITS } from '../../constants/fieldLimits';
import {
  sampleClinic,
  sampleClinicList,
  sampleContact,
  sampleDisplays,
} from '../../constants/mockData';
import { themedStyles } from '../../theme/themedStyles';
import { appAlert } from '../../components/shared/AppAlert';

const t = strings.editDetails;
const MIN_LOADING_MS = 900;
const SUCCESS_MS = 1600;
const PHOTO_LABELS = [
  strings.registerPhoto.n1Entrance,
  strings.registerPhoto.n2Reception,
];

const wait = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(() => resolve(), ms);
  });

/** Demo week from the design: Monday split into two slots. */
const demoHours = (): WorkingHour[] => {
  const hours = createDefaultWorkingHours();
  hours[0] = {
    ...hours[0],
    endTime: '12:30PM',
    extraSlots: [{ startTime: '05:30PM', endTime: '09:30PM' }],
  };
  return hours;
};

/**
 * Edit an existing clinic on one page (Figma): clinic information, working
 * hours, contact, photos (tap "Edit" to replace) and display names, then
 * Save. Starts from the clinic's saved details (demo data until the API).
 */
const EditDetailsScreen: React.FC<AppScreenProps<'EditDetails'>> = ({
  navigation,
}) => {
  const keyboard = useKeyboardAutoScroll();

  const [values, setValues] = useState<ClinicInfo>(() => ({
    clinicName: sampleClinic.clinicName,
    medicalRegistrationNumber: sampleClinic.medicalRegistrationNumber,
    establishmentYear: sampleClinic.establishmentYear,
    licenceNumber: sampleClinic.licenceNumber,
    gstNumber: sampleClinic.gstNumber,
    panNumber: sampleClinic.panNumber,
    address: sampleClinic.address,
    street: sampleClinic.street,
    city: sampleClinic.city,
    state: sampleClinic.state,
    pincode: sampleClinic.pincode,
    // Demo clinic has no pin yet; set it from the map.
    latitude: '',
    longitude: '',
  }));
  const [hours, setHours] = useState<WorkingHour[]>(demoHours);
  const [personal, setPersonal] = useState<PersonalInfo>({ ...sampleContact });
  const [photos, setPhotos] = useState<ImageSourcePropType[]>(
    () => sampleClinicList[0].photos,
  );
  const [displayNames, setDisplayNames] = useState(() =>
    sampleDisplays.map(display => display.name),
  );

  const [errors, setErrors] = useState<ClinicErrors>({});
  const [personalErrors, setPersonalErrors] = useState<PersonalErrors>({});
  const [hoursErrorIndex, setHoursErrorIndex] = useState<number | null>(null);
  const [displayErrors, setDisplayErrors] = useState<boolean[]>([]);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetStatus, setSheetStatus] = useState<SheetStatus>('loading');

  const handleChange = (key: keyof ClinicInfo, value: string) => {
    setValues(previous => ({ ...previous, [key]: value }));
    setErrors(previous => withoutError<ClinicInfo>(previous, key));
  };

  const updatePersonal = (key: keyof PersonalInfo, value: string) => {
    setPersonal(previous => ({ ...previous, [key]: value }));
    setPersonalErrors(previous => withoutError<PersonalInfo>(previous, key));
  };

  const updateHour = (index: number, patch: Partial<WorkingHour>) => {
    setHours(previous =>
      previous.map((hour, i) => (i === index ? { ...hour, ...patch } : hour)),
    );
    if (index === hoursErrorIndex) {
      setHoursErrorIndex(null);
    }
  };

  const replacePhoto = async (index: number) => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });
      const uri = result.assets?.[0]?.uri;
      if (result.didCancel || !uri) {
        return;
      }
      setPhotos(previous =>
        previous.map((photo, i) => (i === index ? { uri } : photo)),
      );
    } catch {
      appAlert(
        strings.registerPhoto.unableToOpenGallery,
        strings.registerPhoto.pleaseTryChoosingAPhoto,
      );
    }
  };

  const handleSave = async () => {
    const clinicErrors = validateClinic(values);
    const contactErrors = validatePersonal(personal);
    const hoursProblem = validateWorkingHours(hours);
    const namesMissing = displayNames.map(name => !name.trim());

    setErrors(clinicErrors);
    setPersonalErrors(contactErrors);
    setHoursErrorIndex(hoursProblem?.index ?? null);
    setDisplayErrors(namesMissing);

    if (
      hasErrors(clinicErrors) ||
      hasErrors(contactErrors) ||
      namesMissing.some(Boolean)
    ) {
      appAlert(t.checkDetails, t.fixHighlighted);
      return;
    }
    if (hoursProblem) {
      appAlert(strings.workingHours.checkHours, hoursProblem.message);
      return;
    }

    // TODO: send to the clinic API; for now the changes stay on this screen.
    setSheetStatus('loading');
    setSheetVisible(true);
    await wait(MIN_LOADING_MS);
    setSheetStatus('success');
    await wait(SUCCESS_MS);
    setSheetVisible(false);
  };

  // Keyboard Next through the contact fields.
  const chain = useFieldChain([
    'contactPerson',
    'designation',
    'mobile',
    'email',
  ] as const);

  return (
    <FormScreenLayout
      title={t.editDetails}
      onBack={() => navigation.goBack()}
      keyboard={keyboard}
    >
      <ClinicInfoForm
        values={values}
        errors={errors}
        onChange={handleChange}
        onFieldFocus={key =>
          keyboard.setAutoScroll(CLINIC_BOTTOM_FIELDS.includes(key))
        }
      />

      <View style={styles.section}>
        <WorkingHoursSection
          hours={hours}
          errorIndex={hoursErrorIndex}
          onChange={updateHour}
        />
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={formStyles.heading}>
          {strings.common.contactInformation}
        </Text>
        <InputField
          label={strings.registerPersonal.contactPersonName}
          required
          placeholder={strings.registerPersonal.enterContactPersonName}
          value={personal.contactPerson}
          onChangeText={value =>
            updatePersonal('contactPerson', sanitizeName(value))
          }
          autoCapitalize="words"
          maxLength={LIMITS.contactPerson.max}
          textContentType="name"
          autoComplete="name"
          error={personalErrors.contactPerson}
          {...chain('contactPerson')}
        />
        <InputField
          label={strings.registerPersonal.designation}
          placeholder={strings.registerPersonal.enterDesignation}
          value={personal.designation}
          onChangeText={value => updatePersonal('designation', value)}
          autoCapitalize="words"
          textContentType="jobTitle"
          maxLength={LIMITS.designation.max}
          error={personalErrors.designation}
          {...chain('designation')}
        />
        <InputField
          label={strings.registerPersonal.mobileNumber}
          placeholder={strings.registerPersonal.enterMobileNumber}
          value={personal.mobile}
          onChangeText={value =>
            updatePersonal('mobile', value.replace(/[^\d+\s-]/g, ''))
          }
          keyboardType="phone-pad"
          maxLength={LIMITS.mobile.max}
          textContentType="telephoneNumber"
          autoComplete="tel"
          error={personalErrors.mobile}
          {...chain('mobile')}
        />
        <InputField
          label={strings.registerPersonal.emailId}
          required
          placeholder={strings.registerPersonal.enterEmailAddress}
          value={personal.email}
          onChangeText={value => updatePersonal('email', value.trim())}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          maxLength={LIMITS.email.max}
          error={personalErrors.email}
          {...chain('email')}
        />
      </View>

      {/* Photos with an "Edit" badge to replace each one. */}
      <View style={styles.section}>
        <Text style={formStyles.heading}>{t.photos}</Text>
        <View style={styles.photoRow}>
          {photos.map((source, index) => (
            <Pressable
              key={PHOTO_LABELS[index]}
              onPress={() => replacePhoto(index)}
              accessibilityRole="button"
              accessibilityLabel={t.editPhoto(PHOTO_LABELS[index])}
              style={styles.photoBox}
            >
              <Image source={source} style={styles.photo} resizeMode="cover" />
              <View style={styles.editBadge}>
                <Text style={styles.editText}>{t.edit}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Displays: rename each TV; its serial is shown above. */}
      <View style={styles.section}>
        <Text style={formStyles.heading}>{t.displays}</Text>
        {sampleDisplays.map((display, index) => (
          <InputField
            key={display.id}
            label={t.serial(display.serial)}
            placeholder={t.displayNamePlaceholder}
            value={displayNames[index]}
            onChangeText={value => {
              setDisplayNames(previous =>
                previous.map((name, i) => (i === index ? value : name)),
              );
              setDisplayErrors(previous =>
                previous.map((bad, i) => (i === index ? false : bad)),
              );
            }}
            autoCapitalize="words"
            maxLength={LIMITS.displayName.max}
            error={displayErrors[index] ? t.displayNameRequired : undefined}
          />
        ))}
      </View>

      <View style={styles.button}>
        <GradientButton title={t.save} onPress={handleSave} />
      </View>

      <StatusSheet
        visible={sheetVisible}
        status={sheetStatus}
        title={sheetStatus === 'success' ? t.saved : t.saving}
        message={sheetStatus === 'success' ? t.savedMessage : t.savingMessage}
        onHidden={() => {
          if (sheetStatus === 'success') {
            navigation.goBack();
          }
        }}
      />
    </FormScreenLayout>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    section: {
      marginTop: verticalScale(28),
    },
    photoRow: {
      flexDirection: 'row',
      gap: scale(8),
    },
    photoBox: {
      flex: 1,
      height: scale(178),
      borderRadius: scale(8),
      overflow: 'hidden',
    },
    photo: {
      width: '100%',
      height: '100%',
    },
    // Figma: dark "Edit" pill in the photo's top-right corner.
    editBadge: {
      position: 'absolute',
      top: verticalScale(10),
      right: scale(10),
      paddingHorizontal: scale(10),
      paddingVertical: verticalScale(3),
      borderRadius: scale(12),
      backgroundColor: colors.signatureOverlay,
    },
    editText: {
      fontSize: normalizeFont(11),
      fontFamily: fonts.semibold,
      color: colors.onAccent,
    },
    button: {
      marginTop: verticalScale(40),
    },
  }),
);

export default EditDetailsScreen;
