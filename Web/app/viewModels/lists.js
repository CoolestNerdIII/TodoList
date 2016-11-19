var _ = require('underscore');

function getListsViewModel(lists, items) {
    "use strict";

    var groupedLists = _
        .chain(items)
        .groupBy(function(item) {
            if(item.list) return item.list._id;
            else return null;
        })
        .map(function(value, key) {

            var list = value[0].list;
            if(list) {
                return {
                    created: list.created,
                    name: list.name,
                    description: list.description,
                    _id: list._id,
                    list: key,
                    archived: list.archived,
                    priority: list.priority,
                    backgroundColor: list.backgroundColor,
                    items: value
                }
            } else {
                return {
                    _id: null,
                    list: key,
                    items: value
                }
            }

        })
        .value();

    for (var i = 0; i < Object.keys(lists).length; i++ ) {

        var list = lists[i];
        var obj = groupedLists.filter(function(obj) {
            if (obj._id) {
                return obj._id.toString() == list._id.toString();
            }
        });

        if (!obj || Object.keys(obj).length == 0) {
            groupedLists.push(list);
        }
    }

    return groupedLists;
}

// export the function
module.exports = getListsViewModel;
