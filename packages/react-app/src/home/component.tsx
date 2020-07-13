import { GetTermsResult } from '@glexicon/objects';
import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
  Fragment,
} from 'react';
import { Link } from 'react-router-dom';
import { preventDefault } from '../preventDefault';
import './styles.scss';

const Home: FunctionComponent = () => {
  const [text, setText] = useState('');
  const [results, setResults] = useState<GetTermsResult>();

  function onTextChanged({ currentTarget }: ChangeEvent<HTMLInputElement>) {
    setText(currentTarget.value);
  }

  const search = useCallback(() => {
    getSearchResults(1, text.trim()).then(setResults);
  }, [text]);

  useEffect(search, []);

  const goToPage = useCallback(
    (page: number) => {
      getSearchResults(page, text.trim()).then(setResults);
    },
    [text]
  );

  return (
    <div className="home-container">
      <form onSubmit={preventDefault}>
        <input type="text" onChange={onTextChanged} autoFocus />
        <button type="submit" onClick={search}>
          Search
        </button>
        <span>&nbsp;</span>
        <Link to="edit">Create New Item...</Link>
      </form>
      {results ? (
        <div className="results">
          {results.terms.length ? (
            results.terms.map(({ id, name, description }, index) => (
              <div className={index % 2 ? 'odd' : 'even'} key={id}>
                <Link to={`edit/${id}`}>
                  <h4>{name}</h4>
                </Link>
                <span>
                  {description.length < 300
                    ? description
                    : `${description.substr(0, 300)}...`}
                </span>
              </div>
            ))
          ) : (
            <span>No Items Found!</span>
          )}
        </div>
      ) : null}
      {results ? (
        <div className="pages">
          {getRange(Math.ceil(results.total / PAGE_SIZE)).map(pageNumber => (
            <Fragment key={pageNumber}>
              &nbsp;
              {results && results.page === pageNumber ? (
                <span>{pageNumber}</span>
              ) : (
                <a href="/#" onClick={goToPage.bind(undefined, pageNumber)}>
                  {pageNumber}
                </a>
              )}
            </Fragment>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Home;

const PAGE_SIZE = 2;

function getRange(pages: number) {
  const array = [];
  for (let page = 1; page <= pages; page++) {
    array.push(page);
  }
  return array;
}

async function getSearchResults(page: number, searchText?: string) {
  let uri = `http://localhost:8080/api/terms?pageSize=${PAGE_SIZE}`;
  if (searchText) {
    uri += `&search=${encodeURIComponent(searchText)}`;
  }
  if (page) {
    uri += `&page=${page}`;
  }
  const response = await window.fetch(uri, { method: 'GET' });
  return (await response.json()) as GetTermsResult;
}
