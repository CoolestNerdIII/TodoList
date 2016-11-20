var faker = require('faker');
var Item = require('../models/item');

function generateItem(list) {
  for(var i=0; i<3; i++) {
    var item = new Item({
      text: faker.lorem.words(),
      description: faker.lorem.words(),
      created: faker.date.past(),
      archived: false,
      priority: faker.random.number() % 3 + 1,
      notes: faker.lorem.words(),
      list: list
    });

    item.save(function (err, item) {
      if (err) {
        console.error('Error saving item' + err);
      }
    });
  }
}


module.exports = generateItem;