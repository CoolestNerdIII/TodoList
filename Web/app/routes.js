var express = require('express');
var List = require('./models/list');
var Item = require('./models/item');

var listViewModel = require('./viewModels/list');
var listsViewModel = require('./viewModels/lists');
var User = require('./models/user');
var jwt = require('express-jwt');
var updateNotification = require('./management/updateNotification');
var deleteNotification = require('./management/deleteNotification');

var auth = jwt({
  secret: require('../config/auth').randomSecret,
  userProperty: 'payload'
});

module.exports = function (app, passport) {

  var router = express.Router();

  router.use(function (req, res, next) {
    // log each request to the console
    console.log(req.method, req.url);

    next();
  });

  // API ROUTES =============================================

  // AUTHENTICATION ====================================
  router.route('/register')
  // Handle new users registering
    .post(function (req, res) {
      var user = new User();

      user.first_name = req.body.first_name;
      user.last_name = req.body.last_name;
      user.local.email = req.body.email;
      user.local.password = user.generateHash(req.body.password);

      user.save(function (err) {
        var token;
        token = user.generateJwt();
        res.status(200);
        res.json({
          "token": token
        });
      });

    });

  router.route('/login')
  // handle returning users logging
    .post(function (req, res) {
      passport.authenticate('local-login', function (err, user, info) {
        var token;

        if (err) {
          res.status(404).json(err);
          return;
        }

        // If a user is found
        if (user) {
          token = user.generateJwt();
          res.status(200);
          res.json({token: token});
        } else {
          res.status(401).json(info);
        }
      })(req, res);

    });

  router.route('/profile/:user_id')
  // return profile details when given a userid
    .get(function (req, res) {

    });

  // LISTS =============================================
  router.route('/lists')
  // Create a new list
    .post(function (req, res) {
      List.create({
        name: req.body.name,
        description: req.body.description,
        priority: req.body.priority,
        backgroundColor: req.body.backgroundColor

      }, function (err, item) {
        if (err) {
          res.send(err);
        }

        res.json(item);
      });
    })

    .get(function (req, res) {
      List.find(function (err, lists) {
        if (err) {
          res.send(err);
        }

        Item.find({}).populate('list').exec(function (err, items) {
          if (err) {
            res.send(err);
          }

          res.json(listsViewModel(lists, items));

        });
      })

    });

  router.route('/lists/:list_id')

  // Return the list with that id
    .get(function (req, res) {
      List.findById(req.params.list_id, function (err, list) {
        if (err) {
          res.send(err);
        }

        if (!list) {
          res.send({error: 'Unable to find list'});
        }

        list.getItems(function (err, items) {
          if (err) {
            res.send(err);
          }

          res.json(listViewModel(list, items));
        })
      });
    })

    // Perform an update/put on a single list
    .put(function (req, res) {
      // Search based on the id
      List.findById(req.params.list_id, function (err, list) {
        if (err) {
          res.send(err);
        }

        // update the information
        list.name = req.body.name;
        list.description = req.body.description;
        list.archived = req.body.archived;
        list.priority = req.body.priority;
        list.backgroundColor = req.body.backgroundColor;

        // save the item
        list.save(function (err) {
          if (err) {
            res.send(err);
          }

          // Send back the updated item
          res.json(list);
        });

      });
    })

    // Perform a delete on a single category and all associated items
    .delete(function (req, res) {
      Item.remove({list: req.params.list_id}, function (err) {
        if (err) {
          console.log('Error removing items with list: ' + err);
        }
      });

      List.remove({_id: req.params.list_id}, function (err) {
        if (err) {
          res.send(err);
        }
        res.json({message: 'Successfully deleted'});
      });
    });

  // Items =============================================
  router.route('/items')
  // Create a new item
    .post(function (req, res) {
      Item.create({
        text: req.body.text,
        description: req.body.description,
        priority: req.body.priority,
        backgroundColor: req.body.backgroundColor,
        list: req.body.list

      }, function (err, item) {
        if (err) {
          res.send(err);
        }

        updateNotification(item._id);
        res.json(item);
      });
    })

    .get(function (req, res) {
      Item.find(function (err, items) {
        if (err) {
          res.send(err);
        }
        res.json(items);
      })

    });

  router.route('/items/:item_id')

    // Return the item with that id
    .get(function (req, res) {
      Item.findById(req.params.item_id, function (err, item) {
        if (err) {
          res.send(err);
        }

        if (!item) {
          res.send({error: 'Unable to find item'});
        }

        res.json(item);
      });
    })

    // Perform an update/put on a single item
    .put(function (req, res) {
      // Search based on the id
      Item.findById(req.params.item_id, function (err, item) {
        if (err) {
          res.send(err);
          return;
        }

        // update the information
        item.text = req.body.text;
        item.isComplete = req.body.isComplete;
        item.priority = req.body.priority;
        item.dueDate = new Date(req.body.dueDate);
        item.reminderDate = new Date(req.body.reminderDate);
        item.notes = req.body.notes;
        item.text = req.body.text;

        // save the item
        item.save(function (err) {
          if (err) {
            console.error(err);
            res.send(err);
          } else {
            // Update the notification
            updateNotification(item._id);
            // Send back the updated item
            res.json(item);
          }
        });

      });
    })

    // Perform a delete on a single item
    .delete(function (req, res) {
      Item.remove({_id: req.params.item_id}, function (err) {
        if (err) {
          res.send(err);
        }
        deleteNotification(req.params.item_id);
        res.json({message: 'Successfully deleted' });
      });
    });

  app.use('/api', router);

  // ===================================
  // CATCH ALL =========================
  // ===================================
  app.get('*', function (req, res) {
    res.sendFile('index.html', {root: 'public'}); // load the single view file
  });

  // router middleware to make sure a user is logged in
  function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
      return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
  }

};
