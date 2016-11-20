var deps = [
  'ui.router',
  'ngResource',
  'todolist.services',
  'todolist.controllers',
  'todolist.directives',
  'ngMessages',
  'ngRoute',
  'ngAnimate',
  // 'satellizer',
  // 'ngCookies',
  // 'ngSanitize',
  'ngNotify',
  'angular-loading-bar',
  'ui.bootstrap',
  'oc.lazyLoad'
];

angular.module('todolist', deps)
  .config(function ($httpProvider, $resourceProvider, $locationProvider, $urlMatcherFactoryProvider) {

    // CSRF Support
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    // This only works in angular 3!
    // It makes dealing with Django slashes at the end of everything easier.
    $resourceProvider.defaults.stripTrailingSlashes = false;

    // Django expects jQuery like headers
    // $httpProvider.defaults.headers.post['Content-Type'] =
    // 'application/x-www-form-urlencoded;charset=utf-8';

    $urlMatcherFactoryProvider.strictMode(false);

    // user the HTML5 History API for removing hashtag
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');

  })
  // Configure Routes and States
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');
    $stateProvider

    // Public Routes
      .state('public', {
        abstract: true,
        templateUrl: 'partials/common/content.html',
        controller: 'ParentCtrl'
      })
      .state('public.lists', {
        url: '/',
        templateUrl: 'partials/todos/lists.html',
        controller: 'ListCtrl'
      })
  })
  /**
   * Configure the locations of the notifications
   */
  .run(function (ngNotify) {
    ngNotify.config({
      'position': 'top'
    });
  });
