import { TermData } from "./termData";

export interface GetTermsResult{
  total: number;
  offset?: number;
  terms: readonly TermData[];
}