Documents = new Meteor.Collection('Documents');

if (Meteor.isClient) {
  Meteor.startup(function () {
    Meteor.subscribe('last-document', {onStop: function (error) {console.log(error)}});
  });
  
  Template.hello.helpers({
    latest: function () {
      // Comment this line out to make subscription fast.
      return Documents.findOne({}, {sort: {createdAt: -1}});
    }
  });

  Template.hello.events({
    'click button': function () {
      var start = new Date().valueOf();
      Meteor.subscribe('documents', {
        onReady: function () {
          var stop = new Date().valueOf();
          console.log("Subscription took", ((stop - start) / 1000) + " seconds");
        },
        onStop: function (error) {console.log(error)}
      });
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Documents.find().count() === 0) {
      for (var i = 0; i < 500; i++) {
        Documents.insert({
          createdAt: new Date(),
        });
      }
    }
  });

  Documents._ensureIndex({createdAt: 1});

  Meteor.publish('last-document', function () {
    return Documents.find({}, {sort: {createdAt: -1}, limit: 1});
  });

  Meteor.publish('documents', function () {
    return Documents.find({});
  });
  
  Facts.setUserIdFilter(function () { return true; });
}
