/* eslint-disable prettier/prettier */
const corsOptions = {
  origin: [
    'http://localhost:8080',
    'http://localhost',
    'http://localhost:3001',
    'http://localhost:3000',
  ],
  Credential: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

const BADAMI_TOKEN = 'badami';
const BADMIN_TOKEN = 'admin';
export { corsOptions, BADAMI_TOKEN, BADMIN_TOKEN };
