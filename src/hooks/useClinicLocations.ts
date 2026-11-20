import { useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchClinics } from '../store/slices/clinicsSlice';
import { SHOW_DEMO_CLINICS, sampleClinic } from '../constants/mockData';
import strings from '../constants/strings';

/** A clinic a device can be installed at. */
export type ClinicLocation = {
  id: string;
  name: string;
  /** One line: building, street, city, state – pincode. */
  address: string;
};

const fullAddress = (parts: string[], pincode: string) => {
  const line = parts
    .map(part => part.trim())
    .filter(Boolean)
    .join(', ');
  return pincode.trim() ? `${line} – ${pincode.trim()}` : line;
};

/** The signed-in user's clinics with their full address (newest first). */
export const useClinicLocations = (): ClinicLocation[] => {
  const dispatch = useAppDispatch();
  const email = useAppSelector(state => state.auth.user?.email);
  const records = useAppSelector(state => state.clinics.items);

  // The list may not be loaded yet if the Clinics tab wasn't opened.
  useEffect(() => {
    if (email) {
      dispatch(fetchClinics(email));
    }
  }, [dispatch, email]);

  return useMemo(() => {
    const mine = [...records]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(record => ({
        id: record.id,
        name: record.clinic.clinicName || strings.a15Home.unnamedClinic,
        address: fullAddress(
          [
            record.clinic.address,
            record.clinic.street,
            record.clinic.city,
            record.clinic.state,
          ],
          record.clinic.pincode,
        ),
      }));
    // Demo clinic until the API provides real data.
    const demo: ClinicLocation[] = SHOW_DEMO_CLINICS
      ? [
          {
            id: 'demo-sai-shree',
            name: sampleClinic.clinicName,
            address: sampleClinic.fullAddress,
          },
        ]
      : [];
    return [...mine, ...demo];
  }, [records]);
};

export default useClinicLocations;
