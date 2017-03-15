import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import '../imports/ui';
import '../imports/collections';
import '../imports/api';
import '../imports/examples';
import App from '../imports/ui/App.jsx';
 
Meteor.startup(() => {
  render(<App />, document.getElementById('root'));
});

Meteor.startup(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(() => {
      // Registration was successful
      // console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch((err) => {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  }
});

