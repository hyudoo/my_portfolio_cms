import { createSlice, SliceSelectors } from '@reduxjs/toolkit';
import { GlobalCaseReducers, GlobalState } from '../../types/redux/global-slice.type';

export const initialGlobalState: GlobalState = {
  loading: false,
};

export const { reducer: globalReducer, actions: globalActions } = createSlice<
  GlobalState,
  GlobalCaseReducers,
  'global',
  SliceSelectors<GlobalState>
>({
  name: 'global',
  initialState: initialGlobalState,
  reducers: {
    setLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
});
