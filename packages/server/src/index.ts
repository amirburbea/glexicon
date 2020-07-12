import { GetTermsResult, Term, TermData } from '@glexicon/objects';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { promises as file } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

type Dictionary<T> = { [key: string]: T };

const jsonParser = bodyParser.json();

async function getApplication() {
  const fileName = join(homedir(), 'gLexicon.json');
  const data = {} as Dictionary<TermData>;

  function getTerms() {
    return Object.entries(data).map<Term>(([id, data]) => ({
      id: Number(id),
      ...data,
    }));
  }

  function updateFile() {
    return file.writeFile(fileName, JSON.stringify(getTerms()), {
      encoding: 'utf-8',
    });
  }

  function filterItems<T extends TermData>(items: T[], searchText: string) {
    const lower = searchText.toLowerCase();
    return items.filter(({ name, aliases }) => {
      return (
        name.toLowerCase().includes(lower) ||
        aliases.some(alias => alias.toLowerCase().includes(lower))
      );
    });
  }

  function sortByName<T extends TermData>(items: T[]) {
    items.sort(({ name: left }, { name: right }) => {
      return left.localeCompare(right, undefined, { sensitivity: 'accent' });
    });
  }

  let maxId = 0;
  try {
    const saved: Term[] = JSON.parse(
      await file.readFile(fileName, { encoding: 'utf-8' })
    );
    for (const { id, ...rest } of saved) {
      data[id] = rest;
      maxId = Math.max(maxId, id);
    }
  } catch {}

  return express()
    .use(cors())
    .get('/api/terms', ({ query: { search, pageSize, page } }, res) => {
      let items = getTerms();
      if (search) {
        items = filterItems(items, String(search));
      }
      sortByName(items);
      const { length: total } = items;
      let offset: number | undefined;
      if (pageSize) {
        const itemsPerPage = Math.max(Number(pageSize), 1);
        const pageCount = Math.ceil(items.length / itemsPerPage);
        let pageNumber = page ? Number(page) : 1;
        if (pageNumber <= 0 || pageNumber > pageCount) {
          pageNumber = 1;
        }
        items = items.slice(
          (offset = (pageNumber - 1) * itemsPerPage),
          offset + itemsPerPage
        );
      }
      const result: GetTermsResult = {
        terms: items,
        offset,
        total,
      };
      res.send(result);
    })
    .get('/api/term/:id', ({ params }, res) => {
      const id = Number(params['id']);
      const term = data[id];
      if (!term) {
        return res.status(404).end();
      }
      res.send({ id, ...term });
    })
    .put('/api/term', jsonParser, async ({ body }, res) => {
      const id = ++maxId;
      data[id] = body as TermData;
      await updateFile();
      res.send(String(id));
    })
    .post('/api/term/:id', jsonParser, async ({ body, params }, res) => {
      const id = Number(params['id']);
      if (!(id in data)) {
        return res.status(404).end();
      }
      data[id] = body as TermData;
      await updateFile();
      res.status(200).end();
    });
}

getApplication().then(app => {
  app.listen(8080, 'localhost', () => console.log('listening on 8080...'));
});
