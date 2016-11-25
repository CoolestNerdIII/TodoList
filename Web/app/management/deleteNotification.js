var schedule = require('node-schedule');

function deleteNotification (itemID) {
  var my_job = schedule.scheduledJobs[itemID.toString()];
  if (my_job) {
    my_job.cancel();
  }
}

module.exports = deleteNotification;