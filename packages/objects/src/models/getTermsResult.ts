import { TermData } from './termData';

export interface GetTermsResult {
  total: number;
  page?: number;
  offset?: number;
  terms: readonly TermData[];
}
