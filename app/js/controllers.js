angular.module('word.controllers', ['angular-storage'])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

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
  .controller('HistoryCtrl', function ($scope, $stateParams, store) {
    $scope.words = store.get("words");
  })
  .controller('HomeCtrl', function ($scope, $stateParams, $http, store) {
    $scope.wotd = {};
    var wordOfTheDayAPIEndPoint = 'http://api.wordnik.com/v4/words.json/wordOfTheDay?&api_key=d010da7a2a6504b98200702b9f6027c247adee8dad74a9737';
    var pronounciationAPIEndPoint = 'http://api.wordnik.com/v4/word.json/{word}/pronunciations?useCanonical=false&limit=5&api_key=d010da7a2a6504b98200702b9f6027c247adee8dad74a9737';
    var audioAPIEndPoint = 'http://api.wordnik.com/v4/word.json/{word}/audio?useCanonical=false&limit=5&api_key=d010da7a2a6504b98200702b9f6027c247adee8dad74a9737';
    wordOfTheDay(wordOfTheDayAPIEndPoint);
    $scope.play = function () {
      $scope.audio.play();
    };
    function wordOfTheDay(url) {
      return $http.get(url)
        .success(function (data) {
          $scope.wotd = data;
          pronunciation(pronounciationAPIEndPoint.replace('{word}', $scope.wotd.word));
          audio(audioAPIEndPoint.replace('{word}', $scope.wotd.word));
          console.log($scope.wotd);
          save($scope.wotd);
        }).error(function (err) {

        });
    };
    function pronunciation(url) {
      return $http.get(url)
        .success(function (data) {
          $scope.wotd.pronunciation = data[0].raw;
          console.log($scope.wotd);
          save($scope.wotd);
        }).error(function (err) {
        });
    };
    function audio(url) {
      return $http.get(url)
        .success(function (data) {
          $scope.wotd.audio = data[0].fileUrl;
          $scope.audio = new Audio($scope.wotd.audio);
          console.log($scope.wotd);
          save($scope.wotd);
        }).error(function (err) {
        });
    };
    function save(wotd) {
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
      words.push(wotd);
      store.set("words", words);
    }
  });
