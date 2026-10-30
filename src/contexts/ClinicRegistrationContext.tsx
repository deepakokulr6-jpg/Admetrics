import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  ClinicInfo,
  ClinicPhotos,
  ClinicRegistrationDraft,
  createEmptyDraft,
  PersonalInfo,
  WorkingHour,
} from '../types/clinic';

type ClinicRegistrationContextValue = {
  draft: ClinicRegistrationDraft;
  updateClinicInfo: (patch: Partial<ClinicInfo>) => void;
  updatePersonalInfo: (patch: Partial<PersonalInfo>) => void;
  updateWorkingHour: (index: number, patch: Partial<WorkingHour>) => void;
  setPhoto: (slot: keyof ClinicPhotos, uri: string | null) => void;
  resetDraft: () => void;
};

const ClinicRegistrationContext = createContext<
  ClinicRegistrationContextValue | undefined
>(undefined);

export const ClinicRegistrationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [draft, setDraft] = useState<ClinicRegistrationDraft>(createEmptyDraft);

  const updateClinicInfo = useCallback((patch: Partial<ClinicInfo>) => {
    setDraft(previous => ({
      ...previous,
      clinic: { ...previous.clinic, ...patch },
    }));
  }, []);

  const updatePersonalInfo = useCallback((patch: Partial<PersonalInfo>) => {
    setDraft(previous => ({
      ...previous,
      personal: { ...previous.personal, ...patch },
    }));
  }, []);

  const updateWorkingHour = useCallback(
    (index: number, patch: Partial<WorkingHour>) => {
      setDraft(previous => ({
        ...previous,
        workingHours: previous.workingHours.map((item, itemIndex) =>
          itemIndex === index ? { ...item, ...patch } : item,
        ),
      }));
    },
    [],
  );

  const setPhoto = useCallback(
    (slot: keyof ClinicPhotos, uri: string | null) => {
      setDraft(previous => ({
        ...previous,
        photos: { ...previous.photos, [slot]: uri },
      }));
    },
    [],
  );

  const resetDraft = useCallback(() => setDraft(createEmptyDraft()), []);

  const value = useMemo(
    () => ({
      draft,
      updateClinicInfo,
      updatePersonalInfo,
      updateWorkingHour,
      setPhoto,
      resetDraft,
    }),
    [
      draft,
      updateClinicInfo,
      updatePersonalInfo,
      updateWorkingHour,
      setPhoto,
      resetDraft,
    ],
  );

  return (
    <ClinicRegistrationContext.Provider value={value}>
      {children}
    </ClinicRegistrationContext.Provider>
  );
};

export const useClinicRegistration =
  (): ClinicRegistrationContextValue => {
    const context = useContext(ClinicRegistrationContext);

    if (!context) {
      throw new Error(
        'useClinicRegistration must be used inside a ClinicRegistrationProvider',
      );
    }

    return context;
  };
