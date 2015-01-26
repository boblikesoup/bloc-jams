
// Example album.
var albumPicasso = {
 name: 'The Colors',
 artist: 'Pablo Picasso',
 label: 'Cubism',
 year: '1881',
 albumArtUrl: '/images/album-placeholder.png',

 songs: [
 { name: 'Blue', length: '4:26' },
 { name: 'Green', length: '3:14' },
 { name: 'Red', length: '5:01' },
 { name: 'Pink', length: '3:21'},
 { name: 'Magenta', length: '2:15'}
 ]
};


blocJams = angular.module('BlocJams', ['ui.router']);

//arguments in paranthesis are imported modules for ui-router and urls
blocJams.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider){
  //prevent hashbangs #! in url ex: fsdfsd/#!/albume.html
  $locationProvider.html5Mode(true);

  $stateProvider.state('landing', {
   url: '/',
   controller: 'Landing.controller',
   templateUrl: '/templates/landing.html'
  });

  $stateProvider.state('collection', {
   url: '/collection',
   controller: 'Collection.controller',
   templateUrl: '/templates/collection.html'
  });
}]);


blocJams.controller('Landing.controller', ['$scope', function($scope) {
  $scope.subText= "Turn the music up!";

  $scope.subTextClicked = function() {
    $scope.subText += '!';
  };

  $scope.albumURLs = [
  '/images/album-placeholders/album-1.jpg',
  '/images/album-placeholders/album-2.jpg',
  '/images/album-placeholders/album-3.jpg',
  '/images/album-placeholders/album-4.jpg',
  '/images/album-placeholders/album-5.jpg',
  '/images/album-placeholders/album-6.jpg',
  '/images/album-placeholders/album-7.jpg',
  '/images/album-placeholders/album-8.jpg',
  '/images/album-placeholders/album-9.jpg',
  ];

  function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
  };

  $scope.shuffleAlbums = function(){
    newOrder = shuffle($scope.albumURLs)
  }
}]);

blocJams.controller('Collection.controller', ['$scope', function($scope) {
 $scope.albums = [];
 for (var i = 0; i < 33; i++) {
   $scope.albums.push(angular.copy(albumPicasso));
 }
}]);