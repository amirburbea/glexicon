import { GetTermsResult } from '@glexicon/objects';
import React, {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
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
      <form onSubmit={preventSubmit} style={{ margin: '8px auto' }}>
        <input type="text" onChange={onTextChanged} />
        <button type="submit" onClick={search}>
          Search
        </button>
      </form>
      <div
        style={{ margin: '0 auto', width: '800px', border: 'black 1px solid' }}
      >
        {results
          ? results.terms.map(({ id, name, description }, index) => (
              <div
                style={{ background: index % 2 ? '#F0F0F0' : '#909090' }}
                key={id}
              >
                <Link to={`Edit?id=${id}`}>
                  <h4 style={{ margin: '5px 0 0 0' }}>{name}</h4>
                </Link>
                <span style={{ fontSize: 14 }}>
                  {description.length < 300
                    ? description
                    : `${description.substr(0, 300)}...`}
                </span>
              </div>
            ))
          : null}
      </div>
      {results ? (
        <div style={{ margin: '0 auto' }}>
          {getRange(Math.ceil(results.total / PAGE_SIZE)).map(pageNumber => (
            <span key={pageNumber}>
              &nbsp;
              {results && results.page === pageNumber ? (
                <span style={{ fontWeight: 'bold', fontSize: '14pt' }}>
                  {pageNumber}
                </span>
              ) : (
                <a href="#" onClick={goToPage.bind(undefined, pageNumber)}>
                  {pageNumber}
                </a>
              )}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Home;

const PAGE_SIZE = 10;

function getRange(pages: number) {
  const array = [];
  for (let page = 1; page <= pages; page++) {
    array.push(page);
  }
  return array;
}

function preventSubmit(e: FormEvent) {
  e.preventDefault();
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
