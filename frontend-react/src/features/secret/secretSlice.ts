import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { RootState } from '../../app/store';
import { createSecret, CreateSecretDto, fetchSecret } from './secretAPI';

export const fetchSecretAsync = createAsyncThunk(
  'secret/fetchSecret',
  async (hash: string) => {
    const secret = await fetchSecret(hash);
    return secret;
  }
);

export const createSecretAsync = createAsyncThunk(
  'secret/createSecret',
  async (createSecretDto: CreateSecretDto) => {
    const secret = await createSecret(createSecretDto);
    return secret;
  }
);

export interface Secret {
  hash: string;
  secretText: string;
  createdAt: string;
  expiresAt: string;
  remainingViews: number;
}

export interface SecretState {
  selectedHash: string;
  loadingStatus: 'idle' | 'loading';
  recentHashes: string[];
  currentlyFetchedSecret?: Secret;
}

const initialState: SecretState = {
  selectedHash: '',
  loadingStatus: 'idle',
  recentHashes: [],
  currentlyFetchedSecret: undefined,
};

export const secretSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    addHash: (state, { payload: hash }: PayloadAction<string>) => {
      state.recentHashes.push(hash);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSecretAsync.pending, (state) => {
        state.loadingStatus = 'loading';
      })
      .addCase(fetchSecretAsync.fulfilled, (state, action) => {
        const secret = action.payload;
        toast.info(secret.secretText);
        state.currentlyFetchedSecret = secret;
        state.loadingStatus = 'idle';
      })
      .addCase(fetchSecretAsync.rejected, (state, action) => {
        if (action.error.message?.includes('404')) {
          toast.error('Secret not found');
        }
        state.loadingStatus = 'idle';
      })
      .addCase(createSecretAsync.pending, (state) => {
        state.loadingStatus = 'loading';
      })
      .addCase(createSecretAsync.fulfilled, (state, action) => {
        const secret = action.payload;
        toast.success('Secret created successfully');
        state.recentHashes.push(secret.hash);
        state.currentlyFetchedSecret = secret;
        state.loadingStatus = 'idle';
      })
      .addCase(createSecretAsync.rejected, (state, action) => {
        if (action.error.message?.includes('409')) {
          toast.error('Secret already exists');
        }
        state.loadingStatus = 'idle';
      });
  },
});

export const { addHash } = secretSlice.actions;

export const selectedHashSelector = (state: RootState): string =>
  state.secret.selectedHash;

export default secretSlice.reducer;
