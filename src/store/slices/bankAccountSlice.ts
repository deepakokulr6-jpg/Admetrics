import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { ownerKey } from './clinicDraftSlice';

/** Payout bank account, one per signed-in account (keyed by email). */
export type BankAccount = {
  holderName: string;
  /** Digits only. */
  accountNumber: string;
  ifsc: string;
};

type BankAccountState = {
  byOwner: Record<string, BankAccount>;
};

const initialState: BankAccountState = { byOwner: {} };

const bankAccountSlice = createSlice({
  name: 'bankAccount',
  initialState,
  reducers: {
    // TODO: send to the payouts API (and keep only a masked copy locally).
    saveBankAccount(
      state,
      { payload }: PayloadAction<{ owner: string; account: BankAccount }>,
    ) {
      state.byOwner[ownerKey(payload.owner)] = payload.account;
    },
  },
});

export const { saveBankAccount } = bankAccountSlice.actions;
export default bankAccountSlice.reducer;
