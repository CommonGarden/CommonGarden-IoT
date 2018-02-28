import path from 'path';
import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import uuid from 'node-uuid';
import session from 'express-session';
import passport from 'passport';
import { createServer } from 'http';
import  cors  from 'cors';
import executableSchema from 'grow-graphql-schema';

import { subscriptionManager } from './subscriptions';

import config from './config';
const schema = executableSchema({ config });
// import {
  // APP_SECRET,
// } from './apiKeys';
// const app_secret = APP_SECRET || config.secret;

let PORT = 3010;
if (process.env.PORT) {
  PORT = parseInt(process.env.PORT, 10) + 100;
}

const WS_PORT = process.env.WS_PORT || 8080;

const app = express();

//FIXES CORS ERROR
const whitelist = [
    'http://localhost:3000',
];
const corsOptions = {
    origin(origin, callback){
        const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }) );
app.use(bodyParser.json());

// import './auth.js'; //see snippet below
// // passport's session piggy-backs on express-session
// app.use(
  // session({
    // genid: function(req) {
      // return uuid.v4();
    // },
    // secret: app_secret,
  // })
// );

// app.use(passport.initialize());
// app.use(passport.session());

app.use('/graphql', graphqlExpress((req) => {
  // Get the query, the same way express-graphql does it
  // https://github.com/graphql/express-graphql/blob/3fa6e68582d6d933d37fa9e841da5d2aa39261cd/src/index.js#L257
  const query = req.query.query || req.body.query;
  if (query && query.length > 2000) {
    // None of our app's queries are this long
    // Probably indicates someone trying to send an overly expensive query
    throw new Error('Query too large.');
  }

  return {
    schema,
    context: {
    },
  };
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  query: `{
# defaults: limit = 10, skip = 0
  allThings(limit: 5, skip: 2) {
    uuid
    token
    owner
    component
    name
    registeredAt
  }
# defaults: limit = 10, skip = 0
  allEvents(limit: 5, skip: 2) {
    thing {
      _id
    }
    event {
      type
      value
    }
    insertedAt
  }
#  getThing(uuid: "paste-thing-uuid") {
#    uuid
#    token
#    owner
#    component
#    name
#    registeredAt
#  }
#  getEvent(_id: "paste-event-id") {
#    thing {
#      _id
#    }
#    event {
#      type
#      value
#    }
#    insertedAt
#  }
}`},
));

app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });


// app.get('/login',
  // function(req, res){
    // res.render('login');
  // });

//login route for passport
// app.post('/login', passport.authenticate('local', {
  // successRedirect: '/',
  // failureRedirect: '/login',
  // failureFlash: true
// }) );


app.listen(PORT, () => console.log( // eslint-disable-line no-console
  `API Server is now running on http://localhost:${PORT}`
));

// WebSocket server for subscriptions
// const websocketServer = createServer((request, response) => {
  // response.writeHead(404);
  // response.end();
// });

// websocketServer.listen(WS_PORT, () => console.log( // eslint-disable-line no-console
  // `Websocket Server is now running on http://localhost:${WS_PORT}`
// ));

// // eslint-disable-next-line
// new SubscriptionServer(
  // {
    // subscriptionManager,

    // // onSubscribe: (msg, params) => {

    // // },
  // },
  // websocketServer
// );
