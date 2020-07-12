import {
  applyMiddleware,
  combineReducers,
  createStore,
  DeepPartial,
  Middleware,
  PreloadedState
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import createSagaMiddleware from 'redux-saga';
import { all, call } from 'redux-saga/effects';
import * as reducers from './reducers';
import defaultSaga from './sagas';
import { StoreState } from './shapes';

/**
 * Type definition conflicts between redux and redux-actions
 * necessitate this type.
 */
export type Reducers<S> = {
  [P in keyof S]:
    | import('redux').Reducer<S[P]>
    | import('redux-actions').Reducer<S[P], any>
    | import('redux-actions').ReducerMeta<S[P], any, any>;
};

export default function <S extends StoreState = StoreState>(
  additionalReducers: Partial<Reducers<S>> = {},
  preloadedState: DeepPartial<S> = {},
  additionalSagas: readonly (() => Generator)[] = [],
  additionalMiddleware: readonly Middleware[] = []
) {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    combineReducers<S>(<any>{
      ...reducers,
      ...additionalReducers,
    }),
    (preloadedState as any) as PreloadedState<S>,
    composeWithDevTools(
      applyMiddleware(sagaMiddleware, ...additionalMiddleware)
    )
  );
  sagaMiddleware.run(
    additionalSagas.length
      ? function* () {
          yield all([...additionalSagas, defaultSaga].map(call));
        }
      : defaultSaga
  );
  return store;
}
