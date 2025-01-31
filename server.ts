import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

import * as mongoose from 'mongoose';
import { createMessage, listMessages, deleteMessage } from 'server/services/messages';

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/mean-stack/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });

  server.use(express.json());
  server.use(express.urlencoded({extended: true}));

  server.get('/api/messages', async (req, res) => {
    res.json(await listMessages());
  });

  server.post('/api/messages', async (req, res) => {
    res.json(await createMessage(req.body.text));
  })

  server.delete('/api/messages/:id', async (req, res) => {
    res.json(await deleteMessage(req.params.id));
  })

  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('/', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  server.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
  });

  return server;
}

function run() {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();

  // Set up default mongoose connection
  const url = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mean-stack"
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Get the default connection
  const db = mongoose.connection;

  // Bind connection to error event (to get notification of connection errors)
  db.on("error", console.error.bind(console, "MongoDB connection error:"));

  db.once("open", () => {
    console.log(`Database connected: ${url}`);

    server.listen(port, () => {
      console.log(`Node Express server listening on http://localhost:${port}`);
    });
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
