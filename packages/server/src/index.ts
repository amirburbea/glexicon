import cors from 'cors';
import express from 'express';
import createApiRouter from './apiRouter';

async function main() {
  express()
    .use(cors())
    .use('/api', await createApiRouter())
    .listen(8080, 'localhost', () => console.log('Listening on port 8080...'));
}

main();