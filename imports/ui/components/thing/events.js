Polymer({
  is:"thing-events",
  properties:{
    events: Object
  },
  tracker:function(){
    this.subscribe('Thing.events');
    // TODO: list events in a thing object.
    this.set('events', Things.find({uuid: this.uuid}));
    // if (device.thing.events) {
    //   var eventlist = [];
    //   _.each(device.thing.events, (value, key, list) => {
    //     value.id = key;
    //     eventlist.push(value);
    //   });
    // }
  }
});
