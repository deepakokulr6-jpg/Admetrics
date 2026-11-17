import reducer, {
  clinicDraftActions,
} from '../src/store/slices/clinicDraftSlice';

const { updateClinicInfo, setPhoto, setSignature, resetDraft } =
  clinicDraftActions;

test('keeps one draft per account (email is case-insensitive)', () => {
  let state = reducer(undefined, { type: 'init' });

  state = reducer(
    state,
    updateClinicInfo({ owner: 'A@x.com', patch: { clinicName: 'Alpha' } }),
  );
  state = reducer(
    state,
    updateClinicInfo({ owner: 'b@x.com', patch: { clinicName: 'Beta' } }),
  );

  expect(state.byOwner['a@x.com'].clinic.clinicName).toBe('Alpha');
  expect(state.byOwner['b@x.com'].clinic.clinicName).toBe('Beta');
});

test('stores photos and signature, and reset clears only that account', () => {
  let state = reducer(undefined, { type: 'init' });

  state = reducer(
    state,
    setPhoto({ owner: 'a@x.com', slot: 'entrance', uri: 'file:///e.jpg' }),
  );
  state = reducer(state, setSignature({ owner: 'a@x.com', signature: 'M1 1' }));
  state = reducer(state, setSignature({ owner: 'b@x.com', signature: 'M2 2' }));

  expect(state.byOwner['a@x.com'].photos.entrance).toBe('file:///e.jpg');
  expect(state.byOwner['a@x.com'].signature).toBe('M1 1');

  state = reducer(state, resetDraft({ owner: 'A@x.com' }));

  expect(state.byOwner['a@x.com']).toBeUndefined();
  expect(state.byOwner['b@x.com'].signature).toBe('M2 2');
});
