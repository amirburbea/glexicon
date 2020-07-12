import { binarySearchByValue, Term, TermData } from '@glexicon/objects';
import bodyParser from 'body-parser';
import express from 'express';
import { promises as file } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import getTerms, { GetTermsRequest } from './getTerms';

export default async function createApiRouter() {
  const fileName = join(homedir(), 'gLexicon.json');
  const terms = await readTerms();
  let maxId = terms.length ? terms[terms.length - 1].id : 0;
  const router = express.Router();
  const jsonBodyParser = bodyParser.json();

  router
    .get('/terms', ({ query: { search, pageSize, page } }, res) => {
      const request: GetTermsRequest = { terms };
      if (search) {
        request.lowerSearchText = String(search).toLowerCase();
      }
      if (pageSize) {
        Object.assign(request, {
          pageSize: Math.max(Number(pageSize), 1),
          page: page ? Number(page) : 1,
        });
      }
      res.send(getTerms(request));
    })
    .get('/term/:id', ({ params }, res) => {
      const id = Number(params.id);
      const index = findIndex(id);
      if (index < 0) {
        return res.status(404).end();
      }
      res.send(terms[index]);
    })
    .post('/term/:id', jsonBodyParser, async ({ params, body }, res) => {
      const id = Number(params.id);
      const index = findIndex(id);
      if (index < 0) {
        return res.status(404).end();
      }
      terms[index] = { id, ...(body as TermData) };
      await writeTerms();
    })
    .delete('/term/:id', async ({ params }, res) => {
      const id = Number(params.id);
      const index = findIndex(id);
      if (index < 0) {
        return res.status(404).end();
      }
      terms.splice(index, 1);
      await writeTerms();
    })
    .put('/term', async ({ body }, res) => {
      const id = ++maxId;
      terms.push({ id, ...(body as TermData) });
      await writeTerms();
      res.send(String(id));
    });
  return router;

  function findIndex(id: number) {
    return binarySearchByValue(terms, id, ({ id }) => id);
  }

  async function readTerms(): Promise<Term[]> {
    try {
      return JSON.parse(await file.readFile(fileName, { encoding: 'utf-8' }));
    } catch {
      // File may not exist
      return [];
    }
  }

  function writeTerms() {
    return file.writeFile(fileName, JSON.stringify(terms), {
      encoding: 'utf-8',
    });
  }
}
