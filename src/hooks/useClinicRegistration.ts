import { useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clinicDraftActions, ownerKey } from '../store/slices/clinicDraftSlice';
import {
  type ClinicInfo,
  type ClinicPhotos,
  type ClinicRegistrationDraft,
  createEmptyDraft,
  type PersonalInfo,
  type WorkingHour,
} from '../types/clinic';

const EMPTY_DRAFT: ClinicRegistrationDraft = createEmptyDraft();

/**
 * The signed-in account's registration draft (Redux `clinicDraft` slice,
 * persisted) plus bound update actions. Same API the screens used before.
 */
export const useClinicRegistration = () => {
  const dispatch = useAppDispatch();
  const owner = useAppSelector(state => state.auth.user?.email ?? '');
  const draft = useAppSelector(
    state => state.clinicDraft.byOwner[ownerKey(owner)] ?? EMPTY_DRAFT,
  );

  const actions = useMemo(() => {
    const {
      updateClinicInfo,
      updatePersonalInfo,
      updateWorkingHour,
      setPhoto,
      setSignature,
      setSignedMou,
      resetDraft,
    } = clinicDraftActions;

    return {
      updateClinicInfo: (patch: Partial<ClinicInfo>) =>
        dispatch(updateClinicInfo({ owner, patch })),
      updatePersonalInfo: (patch: Partial<PersonalInfo>) =>
        dispatch(updatePersonalInfo({ owner, patch })),
      updateWorkingHour: (index: number, patch: Partial<WorkingHour>) =>
        dispatch(updateWorkingHour({ owner, index, patch })),
      setPhoto: (slot: keyof ClinicPhotos, uri: string | null) =>
        dispatch(setPhoto({ owner, slot, uri })),
      /** Drawn signature: SVG path (preview) + PNG (sent to the backend). */
      setSignature: (signature: string | null, png?: string | null) =>
        dispatch(setSignature({ owner, signature, png })),
      setSignedMou: (url: string | null) =>
        dispatch(setSignedMou({ owner, url })),
      resetDraft: () => dispatch(resetDraft({ owner })),
    };
  }, [dispatch, owner]);

  return { draft, ...actions };
};

export default useClinicRegistration;
