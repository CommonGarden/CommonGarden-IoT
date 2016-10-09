import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.publish('Things.messages', function(auth) {
  var thing, handle, options, query;
  
  check(auth, {
    uuid: Match.NonEmptyString,
    token: Match.NonEmptyString
  });

  thing = Things.findOne(auth, {
    fields: {
      _id: 1,
      owner: 1
    }
  });
  if (!thing) {
    throw new Meteor.Error('unauthorized', "Unauthorized.");
  }
  Things.update(thing._id, {
    $set: {
      onlineSince: new Date()
    }
  });
  query = {
    'Things._id': thing._id,
    createdAt: {
      $gte: new Date()
    }
  };
  options = {
    fields: {
      body: 1
    },
    sort: {
      createdAt: 1
    }
  };
  handle = Messages.find(query, options).observeChanges({
    added: (function(_this) {
      return function(id, fields) {
        _this.added('Things.messages', id, fields);
        _this.removed('Things.messages', id);
        return Messages.remove(id);
      };
    })(this)
  });
  this.ready();
  return this.onStop((function(_this) {
    return function() {
      if (handle != null) {
        handle.stop();
      }
      handle = null;
      return Meteor.setTimeout(function() {
        Things.update({
          _id: thing._id,
          onlineSince: {
            $lt: new Date(new Date().valueOf() - 5000)
          }
        }, {
          $set: {
            onlineSince: false
          }
        });
        Meteor.call('Things.emit', auth, {
          name: "offline",
          message: "Thing offline"
        }, function(error, documentId) {
          if (error) {
            return console.error("New Thing.emit Error", error);
          }
        });
        return Meteor.call('Notifications.new', "Thing offline.", thing.owner._id, function(error, documentId) {
          if (error) {
            return console.error("New Notification Error", error);
          }
        });
      }, 5000);
    };
  })(this));
});

Meteor.publish('Things.list', function(ThingUuid) {
  return Things.find({
    'owner': this.userId
  });
});

Meteor.publish('Things.one', function(ThingUuid) {
  check(ThingUuid, Match.NonEmptyString);
  return Things.find({
    uuid: ThingUuid
  });
});
