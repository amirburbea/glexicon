import { BaseSyntheticEvent } from 'react';

export function preventDefault(e: BaseSyntheticEvent) {
  e.preventDefault();
}
