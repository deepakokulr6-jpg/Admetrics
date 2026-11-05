import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useAuth } from './AuthContext';
import {
  clearClinicDraft,
  getClinicDraft,
  saveClinicDraft,
} from '../services/clinicService';
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

const DRAFT_SAVE_DELAY_MS = 300;

const restoreDraft = (
  storedDraft: ClinicRegistrationDraft | null,
): ClinicRegistrationDraft => {
  if (!storedDraft) {
    return createEmptyDraft();
  }

  const empty = createEmptyDraft();

  return {
    clinic: { ...empty.clinic, ...storedDraft.clinic },
    personal: { ...empty.personal, ...storedDraft.personal },
    workingHours:
      Array.isArray(storedDraft.workingHours) &&
      storedDraft.workingHours.length > 0
        ? storedDraft.workingHours
        : empty.workingHours,
    photos: { ...empty.photos, ...storedDraft.photos },
  };
};

const ClinicRegistrationContext = createContext<
  ClinicRegistrationContextValue | undefined
>(undefined);

export const ClinicRegistrationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { user } = useAuth();
  const ownerEmail = user?.email ?? null;

  const [draft, setDraft] = useState<ClinicRegistrationDraft>(createEmptyDraft);
  const [isHydrated, setIsHydrated] = useState(false);

  // The first change after hydration is the draft that was just loaded, so it
  // must not be written back to storage.
  const skipNextPersistRef = useRef(true);

  useEffect(() => {
    let cancelled = false;

    setIsHydrated(false);
    skipNextPersistRef.current = true;

    const hydrate = async () => {
      try {
        const storedDraft = ownerEmail
          ? await getClinicDraft(ownerEmail)
          : null;

        if (!cancelled) {
          setDraft(restoreDraft(storedDraft));
        }
      } catch (error) {
        console.warn('[ClinicRegistration] Draft restore failed', error);

        if (!cancelled) {
          setDraft(createEmptyDraft());
        }
      } finally {
        if (!cancelled) {
          setIsHydrated(true);
        }
      }
    };

    hydrate();

    return () => {
      cancelled = true;
    };
  }, [ownerEmail]);

  useEffect(() => {
    if (!isHydrated || !ownerEmail) {
      return;
    }

    if (skipNextPersistRef.current) {
      skipNextPersistRef.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      saveClinicDraft(ownerEmail, draft).catch(error => {
        console.warn('[ClinicRegistration] Draft save failed', error);
      });
    }, DRAFT_SAVE_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [draft, isHydrated, ownerEmail]);

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

  const resetDraft = useCallback(() => {
    skipNextPersistRef.current = true;
    setDraft(createEmptyDraft());

    if (ownerEmail) {
      clearClinicDraft(ownerEmail).catch(error => {
        console.warn('[ClinicRegistration] Draft clear failed', error);
      });
    }
  }, [ownerEmail]);

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

export const useClinicRegistration = (): ClinicRegistrationContextValue => {
  const context = useContext(ClinicRegistrationContext);

  if (!context) {
    throw new Error(
      'useClinicRegistration must be used inside a ClinicRegistrationProvider',
    );
  }

  return context;
};
