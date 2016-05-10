angular.module('word.controllers', ['angular-storage', 'ngTouch', 'ionic-material'])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, ionicMaterialInk) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
    ionicMaterialInk.displayEffect();
  })

  .controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [
      {title: 'Reggae', id: 1},
      {title: 'Chill', id: 2},
      {title: 'Dubstep', id: 3},
      {title: 'Indie', id: 4},
      {title: 'Rap', id: 5},
      {title: 'Cowbell', id: 6}
    ];
  })

  .controller('PlaylistCtrl', function ($scope, $stateParams) {
  })
  .controller('HistoryCtrl', function ($scope, $stateParams, $timeout, store, ionicMaterialInk) {
    $scope.words = store.get("words");
    $timeout(function () {
      ionicMaterialInk.displayEffect();
    }, 0);
  })
  .controller('HomeCtrl', function ($rootScope, $scope, $stateParams, $http, $timeout, store, ionicMaterialInk) {
    $timeout(function () {
      ionicMaterialInk.displayEffect();
    }, 0);
    $scope.wotd = {};
    var wordOfTheDayAPIEndPointByDate = 'http://api.wordnik.com:80/v4/words.json/wordOfTheDay?date={date}&api_key=d010da7a2a6504b98200702b9f6027c247adee8dad74a9737';
    var wordOfTheDayAPIEndPoint = 'http://api.wordnik.com/v4/words.json/wordOfTheDay?&api_key=d010da7a2a6504b98200702b9f6027c247adee8dad74a9737';
    var pronounciationAPIEndPoint = 'http://api.wordnik.com/v4/word.json/{word}/pronunciations?useCanonical=false&limit=5&api_key=d010da7a2a6504b98200702b9f6027c247adee8dad74a9737';
    var audioAPIEndPoint = 'http://api.wordnik.com/v4/word.json/{word}/audio?useCanonical=false&limit=5&api_key=d010da7a2a6504b98200702b9f6027c247adee8dad74a9737';

    wordOfTheDay(wordOfTheDayAPIEndPoint);

    $rootScope.random = function () {
      var d = randomDate(new Date(2009, 08, 10), new Date())
      wordOfTheDay(wordOfTheDayAPIEndPointByDate.replace("{date}", d.getFullYear() + "-" + d.getMonth() + "-" + d.getDay()));
    };

    $scope.play = function () {
      try {
        $scope.audio ? $scope.audio.play() : undefined;
      } catch (e) {
      }
    };

    function wordOfTheDay(url) {
      return $http.get(url)
        .success(function (data) {
          $scope.wotd = data;
          pronunciation(pronounciationAPIEndPoint.replace('{word}', $scope.wotd.word));
          audio(audioAPIEndPoint.replace('{word}', $scope.wotd.word));
          console.log($scope.wotd);
          save(store, $scope.wotd);
        }).error(function (err) {

        });
    }

    function pronunciation(url) {
      return $http.get(url)
        .success(function (data) {
          $scope.wotd.pronunciation = data && data[0] && data[0].raw;
          console.log($scope.wotd);
          save(store, $scope.wotd);
        }).error(function (err) {
        });
    }

    function audio(url) {
      return $http.get(url)
        .success(function (data) {
          var audio = data && data[0] && data[0].fileUrl;
          $scope.wotd.audio = audio;
          $scope.audio = new Audio(audio);
          console.log($scope.wotd);
          save(store, $scope.wotd);

        }).error(function (err) {
        });
    }
  });
function save(store, wotd) {
  var words = store.get("words") || [];
  var index = -1;
  for (var i = 0; i < words.length; i++) {
    if (words[i].id === wotd.id) {
      index = i;
      break;
    }
  }
  if (index >= 0) {
    words.splice(index, 1);
  }
  words.unshift(wotd);
  store.set("words", words);
}
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
