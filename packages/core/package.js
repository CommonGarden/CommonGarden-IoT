Package.describe({
  name: 'core',
  version: '0.1.0'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.0.2');

  // Core dependencies.
  api.use([
    'accounts-password',
    'ddp-client',
    'underscore',
    'ecmascript'
  ]);

  // 3rd party dependencies.
  api.use([
    'peerlibrary:peerdb@0.19.3',
    'peerlibrary:peerdb-migrations@0.1.1',
    'peerlibrary:meteor-file@0.2.1',
    'peerlibrary:reactive-field@0.1.0',
    'peerlibrary:assert@0.2.5',
    'fermuch:cheerio@0.19.0',
    'alanning:roles@1.2.14',
    'peerlibrary:classy-job@0.2.0',
    'peerlibrary:user-extra@0.1.0'
  ]);


  api.addFiles([
    'base.js',
    'documents/user.js',
    'documents/environment.js',
    'documents/device.js',
    'documents/data.js',
    'documents/notifications.js',
    'documents/thing.js',
    'finalize-documents.js'
  ]);

  api.addFiles([
    'documents/messages.js'
  ], 'server');

  api.export('User');
  api.export('Device');
  api.export('Data');
  api.export('Component');
  api.export('Environment');
  api.export('Notifications');
  api.export('Thing');
  api.export('Message', 'server');
});