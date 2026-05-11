import { AppCaseReducers } from '../common/app-case-reducer.type';

export type GlobalState = {
  loading: boolean;
};

export type GlobalCaseReducers = AppCaseReducers<
  GlobalState,
  {
    setLoading: boolean;
  }
>;
