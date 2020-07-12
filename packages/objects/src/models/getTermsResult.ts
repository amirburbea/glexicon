import { Term } from './term';

export interface GetTermsResult {
  total: number;
  page?: number;
  offset?: number;
  terms: readonly Term[];
}
