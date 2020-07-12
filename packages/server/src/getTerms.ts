import { Term, GetTermsResult } from '@glexicon/objects';

export interface GetTermsRequest {
  terms: readonly Term[];
  lowerSearchText?: string;
  pageSize?: number;
  page?: number;
}

export default function ({
  terms,
  lowerSearchText,
  pageSize,
  page,
}: GetTermsRequest): GetTermsResult {
  let array = lowerSearchText
    ? terms.filter(({ name, aliases }) => {
        return (
          name.toLowerCase().includes(lowerSearchText) ||
          aliases.some(alias => alias.toLowerCase().includes(lowerSearchText))
        );
      })
    : [...terms];
  const { length: total } = array;
  let offset: number | undefined;
  if (pageSize) {
    const pageCount = Math.ceil(total / pageSize);
    if ((page = page || 1) < 1 || page > pageCount) {
      page = 1;
    }
    array = array.slice((offset = (page - 1) * pageSize), offset + pageSize);
  }
  // Sort by name.
  array.sort(({ name: x }, { name: y }) => {
    return x.localeCompare(y, undefined, { sensitivity: 'accent' });
  });
  return { total, terms: array, page, offset };
}
