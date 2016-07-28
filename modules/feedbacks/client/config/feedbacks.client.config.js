'use strict';

// Configuring the Feedbacks module
angular.module('feedbacks').run(['Menus',
  function (Menus) {
    // Add the feedbacks dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Feedbacks',
      state: 'feedbacks',
      type: 'dropdown'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'feedbacks', {
      title: 'Show Feedbacks',
      state: 'feedbacks.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'feedbacks', {
      title: 'Add Feedbacks',
      state: 'feedbacks.create'
    });
  }
]);
