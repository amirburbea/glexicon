import express from 'express';
import cors from 'cors';

async function main() {
  const app = express();
  app.use(cors());
}

main();
