var Item = require('../models/item');
var mailgun = require('mailgun-js')({
  apiKey: require('../../config/mail').MAILGUN.API,
  domain: require('../../config/domain').DOMAIN
});

function generateMessage (item) {
  return 'TodoList Item is due: \n\n' +
    'Name:' + item.text + '\n' +
    'Creation Date:' + item.created + '\n' +
    'Due Date:' + item.dueDate + '\n' +
    'Notes: ' + item.notes;
}

function sendMessage(item) {
  var message = generateMessage(item);
  var data = {
    from: 'TodoList Notifier <postmaster@paulwilson3.com>',
    to: 'paul.l.wilson3@gmail.com',
    subject: 'TodoList Status Update',
    text: message
  };

  mailgun.messages().send(data, function (error, body) {
    if (error) {
      console.error('Error sending message ' + error);
    } else {
      console.log(body);
    }
  });
}

function sendEmailUpdate(itemID) {
  Item.findOne({_id: itemID}, function (err, item) {
    if (err) {
      console.error('Error finding item for email update ' + err);
    } else if (!item) {
      console.error('Unable to find item for email update');
    } else if (!item.isComplete) {
      sendMessage(item);
    }
  })
}

module.exports = sendEmailUpdate;