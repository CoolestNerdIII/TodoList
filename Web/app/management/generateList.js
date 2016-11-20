var faker = require('faker');
var List = require('../models/list');
var generateItem = require('./generateItem');

function generateList() {
  for(var i=0; i<3; i++) {
    var list = new List({
      name: faker.lorem.words(),
      description: faker.lorem.words(),
      created: faker.date.past(),
      archived: false,
      priority: faker.random.number() % 10,
      backgroundColor: 'red'
    });

    list.save(function (err, list) {
      if (err) {
        console.error('Error saving list' + err);
      } else {
        for (var j=0; j<5; j++) {
          generateItem(list._id);
        }
      }
    });
  }
}


module.exports = generateList;