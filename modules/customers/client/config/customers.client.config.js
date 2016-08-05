'use strict';

// Configuring the Customers module
angular.module('customers').run(['Menus',
  function (Menus) {
    // Add the customers dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Customers',
      state: 'customers',
      type: 'dropdown'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'customers', {
      title: 'Show Customers',
      state: 'customers.list'
    });

    /*// Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'customers', {
      title: 'Add Customers',
      state: 'customers.create'
    });*/
  }
]);
