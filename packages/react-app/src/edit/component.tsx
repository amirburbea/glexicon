import { Term, TermData } from '@glexicon/objects';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useHistory } from 'react-router';
import { preventDefault } from '../preventDefault';
import './styles.scss';

const Edit: FunctionComponent = () => {
  const history = useHistory();
  const [term, setTerm] = useState<Term>();
  const [notFound, setNotFound] = useState(false);

  const [id, setId] = useState<number>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [aliases, setAliases] = useState('');

  useEffect(() => {
    const match = /\/(\d+)/.exec(history.location.pathname);
    if (match) {
      const [, id] = match;
      setId(Number.parseInt(id));
    }
  }, [history.location.search]);

  const reset = useCallback(() => {
    if (term) {
      setName(term.name);
      setDescription(term.description);
      setAliases(term.aliases.join('; '));
    } else {
      setName('');
      setDescription('');
      setAliases('');
    }
  }, [term]);

  useEffect(() => {
    if (id) {
      fetchTerm(id)
        .then(setTerm)
        .catch(_ => setNotFound(true));
    }
  }, [id]);

  useEffect(reset, [term]);

  const submitTerm = useCallback(() => {
    submit(name, description, aliases, id, history, setTerm);
  }, [id, name, description, aliases, history, setTerm]);

  const deleteTerm = useCallback(() => {
    window
      .fetch(`http://localhost:8080/api/term/${id}`, { method: 'DELETE' })
      .then(() => history.push('/'));
  }, [id, history]);

  return (
    <form className="edit-container" onSubmit={preventDefault}>
      <h4>
        {!notFound ? (id ? `Edit Item #${id}` : 'New Item') : `${id} Not Found`}
      </h4>
      {!notFound && (
        <>
          <table>
            <tbody>
              <tr>
                <td>
                  <span>Title:</span>
                </td>
                <td>
                  <input
                    value={name}
                    type="text"
                    onChange={e => setName(e.currentTarget.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <span>Description:</span>
                </td>
                <td>
                  <textarea
                    rows={6}
                    value={description}
                    onChange={e => setDescription(e.currentTarget.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <span>Aliases (separated by semicolons):</span>
                </td>
                <td>
                  <input
                    value={aliases}
                    type="text"
                    onChange={e => setAliases(e.currentTarget.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="buttons">
            <button
              type="submit"
              onClick={submitTerm}
              disabled={isEmpty(name) || isEmpty(description)}
            >
              Submit
            </button>
            <button type="reset" onClick={reset}>
              Reset
            </button>
            {id && (
              <button type="button" onClick={deleteTerm}>
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </form>
  );
};

export default Edit;

function isEmpty(text: string) {
  return !text.trim().length;
}

async function fetchTerm(id: number) {
  const response = await window.fetch(`http://localhost:8080/api/term/${id}`, {
    method: 'GET',
  });
  if (response.status !== 200) {
    return Promise.reject('Not Found');
  }
  return (await response.json()) as Term;
}

async function submit(
  name: string,
  description: string,
  aliases: string,
  id: number | undefined,
  history: ReturnType<typeof useHistory>,
  setTerm: (term: Term) => void
) {
  const data: TermData = {
    name: name.trim(),
    description: description.trim(),
    aliases: aliases
      .split(';')
      .map(item => item.trim())
      .filter(item => item),
  };
  const response = await window.fetch(
    `http://localhost:8080/api/term${id ? `/${id}` : ''}`,
    {
      method: id ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  );
  if (id) {
    setTerm(await response.json());
  } else {
    history.push(`/edit/${await response.text()}`);
  }
}
