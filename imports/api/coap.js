import coap from 'coap';
import url from 'url';
import { Meteor } from 'meteor/meteor';

const server = coap.createServer();

server.on('request', function(req, res) {
  let urlParts = url.parse(req.url, true);

  console.log(req);

  let method = urlParts.pathname.replace(/\//g, '');

  // TODO...
  let auth = {};
  let event = {
    message: 'test event'
  };
  let config = {
    component: 'test-device'
  };

  switch (method) {
    case 'register':
      // if (req.headers['Observe'] !== 0) return res.end(new Date().toISOString() + '\n');

      Meteor.call('Thing.register', auth, config, function(error, documentId) {
        if (error) {
          return console.error("New Thing.event Error", error);
        }

        // res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify({ok: true}));
      });
      break;

    case 'emit':
      Meteor.call('Thing.emit', auth, event, function(error, documentId) {
        if (error) {
          return console.error("New Thing.event Error", error);
        }

        // res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify({ok: true}));
      });
      break;

    case 'setProperty':
      let key = urlParts.query.key;
      let value = urlParts.query.value;

      Meteor.call('Thing.setProperty', auth, key, value, function(error, documentId) {
        if (error) {
          return console.error("New Thing.event Error", error);
        }

        // res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify({ok: true}));
      });
      break;

    case 'call':
      Meteor.call('Thing.sendCommand', thingUuid, type, options, function(error, documentId) {
        console.log(documentId);

        if (error) {
          return console.error("New Thing.event Error", error);
        }

        // res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify({ok: true}));
      });
      break;

    default:
      res.end('Hello ' + req.url.split('/')[1] + '\n');
      break;
  }

  res.on('finish', function(err) {
    console.log('finished');
  });
});

server.listen(function() {
  console.log('CoAP server started')
})
