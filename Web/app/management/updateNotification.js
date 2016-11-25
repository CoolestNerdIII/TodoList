var Item = require('../models/item');
var schedule = require('node-schedule');
var sendEmailUpdate = require('./sendEmailUpdate');

function checkPreviousNotification (item) {
  var my_job = schedule.scheduledJobs[item._id.toString()];
  if (my_job) {
    my_job.cancel();
  }
}

function createNotification (item) {
  if (!item.reminderDate) {
    return;
  }

  schedule.scheduleJob(item.reminderDate, function () {
    sendEmailUpdate(item._id);
  });
}

function updateNotification (itemID) {
  Item.findOne({_id: itemID}, function (err, item) {
    if (err) {
      console.error('Error finding item ' + err);
    } else if (!item) {
      console.error('Unable to find item for email update');
    } else {
      checkPreviousNotification(item);
      createNotification(item);
    }
  })
}

module.exports = updateNotification;