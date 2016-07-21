// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todo', ['ionic', 'firebase'])

.factory('SodaBrands', function($firebaseArray) {
  var itemsRef = new Firebase("https://sodashopjohnryan.firebaseio.com/sodaBrands");
  return $firebaseArray(itemsRef);
})

.factory('Sodas', function($firebaseArray) {
  var itemsRef = new Firebase("https://sodashopjohnryan.firebaseio.com/sodas");
  return $firebaseArray(itemsRef);
})

.filter('sodaFilter', function() {
  return function(sodas, desiredSodaBrand) {
    if (!sodas) return;
    var out = [];
    angular.forEach(sodas, function(soda) {
      if (soda.sodaBrand === desiredSodaBrand.$id) {
        out.push(soda)
      }
    })
    return out;
  }
})

.controller('TodoCtrl', function($scope, $ionicSideMenuDelegate, SodaBrands, Sodas) {
  initializeScope(SodaBrands);

  function initializeScope(SodaBrands) {
    $scope.sodaBrands = SodaBrands;
    $scope.selectedSodaBrand = {
      "name": ""
    };
    $scope.selectedSoda = {
      "image": "",
      "name": ""
    };
    $scope.selectedSodaBackup = {};
    $scope.sodas = Sodas;
    $scope.isShowingSodaListing = true;
  }

  function showSodaListing() {
    $scope.isShowingSodaListing = true;
    $scope.isShowingSodaDetails = false;
  }

  function selectSodaBrand(sodaBrand) {
    if (!sodaBrand) return;
    $scope.selectedSodaBrand = sodaBrand;
  }

  SodaBrands.$loaded().then(function() {
    selectSodaBrand(SodaBrands.$getRecord("1"));
  });

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.selectSodaBrandFromMenu = function(sodaBrand) {
    selectSodaBrand(sodaBrand);
    showSodaListing();
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  $scope.sodaDetailHandler = {
    showSodaDetail: function(soda) {
      $scope.selectedSoda = soda;
      angular.copy($scope.selectedSoda, $scope.selectedSodaBackup);
      $scope.isShowingSodaListing = false;
      $scope.isShowingSodaDetails = true;
    },
    saveSodaChanges: function(soda) {
      $scope.sodas.$save(soda);
      showSodaListing();
    },
    resetAndShowSodaListing: function() {
      angular.copy($scope.selectedSodaBackup, $scope.selectedSoda);
      showSodaListing();
    }
  };
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
