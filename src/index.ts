import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import { Options } from 'graphql-yoga';
import { createConnection } from 'typeorm';
import app from './app';
import connectionOptions from './ormConfig';
import decodeJWT from './utils/decodeJWT';


const PORT:number | string = process.env.PORT || 4000;
const PLAYGROUND:string = '/playground';
const GRAPHQL_ENDPOINT:string = '/graphql';
const SUBSCRIPTION_ENDPOINT:string = '/subscription';

const appOptions:Options = {
  port: PORT,
  playground: PLAYGROUND,
  endpoint: GRAPHQL_ENDPOINT,
  ...process.env.NODE_ENV === 'development' && {
    https: {
      key: fs.readFileSync('../server.key'),
      cert: fs.readFileSync('../server.cert')
    },
  },
  subscriptions: {
    path: SUBSCRIPTION_ENDPOINT,
    onConnect: async (connectionParams) => {
      const token = connectionParams['X-JWT'];

      if (token ) {
        const user = await decodeJWT(token);
        if (user) {
          return { currentUser: user };
        }
      }

      throw new Error('No JWT. Can\'t Subscribe');
    }
  }
};

const handleAppStart = () => console.log(`Listening on port ${PORT}`);

createConnection(connectionOptions).then(() => {
  app.start(appOptions, handleAppStart);
}).catch((e) => {
  console.error(e);
});

