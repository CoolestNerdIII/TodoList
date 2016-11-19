function getListViewModel(list, items) {
  return {
    name: list.name,
    description: list.description,
    created: list.created,
    archived: list.archived,
    priority: list.priority,
    backgroundColor: list.backgroundColor,
    items: items.map(function (item) {
      return {
        text: item.text,
        isComplete: item.isComplete,
        created: item.created,
        priority: item.priority,
        dueDate: item.dueDate,
        reminderDate: item.reminderDate,
        notes: item.notes,
      };
    })
  };
}

module.exports = getListViewModel;
