// Example album.
var albumPicasso = {
	name: 'The Colors',
	artist: 'Pablo Picasso',
	label: 'Cubism',
	year: '1881',
	albumArtUrl: '/images/album-placeholder.png',

	songs: [
	{ name: 'Blue', length: '4:26', audioUrl: '/music/placeholders/blue' },
	{ name: 'Green', length: '3:14', audioUrl: '/music/placeholders/green' },
	{ name: 'Red', length: '5:01', audioUrl: '/music/placeholders/red' },
	{ name: 'Pink', length: '3:21', audioUrl: '/music/placeholders/pink' },
	{ name: 'Magenta', length: '2:15', audioUrl: '/music/placeholders/magenta' }
	]
};

blocJams = angular.module('BlocJams', ['ui.router']);

//arguments in paranthesis are imported modules for ui-router and urls
blocJams.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider){
  //prevent hashbangs #! in url ex: fsdfsd/#!/album.html
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

  $stateProvider.state('album', {
  	url: '/album',
  	controller: 'Album.controller',
  	templateUrl: '/templates/album.html'
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

blocJams.controller('Collection.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
	$scope.albums = [];
	for (var i = 0; i < 33; i++) {
		$scope.albums.push(angular.copy(albumPicasso));
	};
	$scope.playAlbum = function(album){
    	SongPlayer.setSong(album, album.songs[0]); // Targets first song in the array.
    }
}]);

blocJams.controller('Album.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
	$scope.album = angular.copy(albumPicasso);

	var hoveredSong = null;
	var playingSong = null;

	$scope.onHoverSong = function(song) {
		hoveredSong = song;
	};

	$scope.offHoverSong = function(song) {
		hoveredSong = null;
	};

	$scope.getSongState = function(song) {
		if (song === SongPlayer.currentSong && SongPlayer.playing) {
			return 'playing';
		}
		else if (song === hoveredSong) {
			return 'hovered';
		}
		return 'default';
	};

	$scope.playSong = function(song) {
		SongPlayer.setSong($scope.album, song);
	};

	$scope.pauseSong = function(song) {
		SongPlayer.pause();
	};
}]);

blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
	$scope.songPlayer = SongPlayer;
}]);

blocJams.service('SongPlayer', function() {
	var currentSoundFile = null;
	var trackIndex = function(album, song) {
		return album.songs.indexOf(song);
	};

	return {
		currentSong: null,
		currentAlbum: null,
		playing: false,

		play: function() {
			this.playing = true;
			currentSoundFile.play();
		},
		pause: function() {
			this.playing = false;
			currentSoundFile.pause();
		},
		setSong: function(album, song) {
			if (currentSoundFile) {
				currentSoundFile.stop();
			}
			this.currentAlbum = album;
			this.currentSong = song;
			currentSoundFile = new buzz.sound(song.audioUrl, {
				formats: [ "mp3" ],
				preload: true
			});

			this.play();
		},
		next: function() {
			var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
			currentTrackIndex++;
			if (currentTrackIndex >= this.currentAlbum.songs.length) {
				currentTrackIndex = 0;
			}
			var song = this.currentAlbum.songs[currentTrackIndex];
			this.setSong(this.currentAlbum, song);
		},
		previous: function() {
			var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
			currentTrackIndex--;
			if (currentTrackIndex < 0) {
				currentTrackIndex = this.currentAlbum.songs.length - 1;
			}
			var song = this.currentAlbum.songs[currentTrackIndex];
			this.setSong(this.currentAlbum, song);
		},
	};
});
blocJams.directive('slider', ['$document', function($document){
	// Returns a number between 0 and 1 to determine where the mouse event happened along the slider bar.
	var calculateSliderPercentFromMouseEvent = function($slider, event) {
    	var offsetX =  event.pageX - $slider.offset().left; // Distance from left
	    var sliderWidth = $slider.width(); // Width of slider
	    var offsetXPercent = (offsetX  / sliderWidth);
	    offsetXPercent = Math.max(0, offsetXPercent);
	    offsetXPercent = Math.min(1, offsetXPercent);
	    return offsetXPercent;
	}

	return {
		templateUrl: '/templates/directives/slider.html',
		replace: true,
		restrict: 'E',
		scope: {},
		link: function(scope, element, attributes) {
			scope.value = 0;
			scope.max = 200;
			var $seekBar = $(element);

			var percentString = function() {
				var percent = Number(scope.value) / Number(scope.max) * 100;
				return percent + "%";
			}

			scope.fillStyle = function() {
				return {width: percentString()}
			}

			scope.thumbStyle = function() {
				return {left: percentString()};
			}

			scope.onClickSlider = function(event) {
				var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
				scope.value = percent * scope.max;
			}

			scope.trackThumb = function() {
				$document.bind('mousemove.thumb', function(event){
					var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
					scope.$apply(function(){
						scope.value = percent * scope.max;
					});
				});

         		//cleanup
         		$document.bind('mouseup.thumb', function(){
         			$document.unbind('mousemove.thumb');
         			$document.unbind('mouseup.thumb');
         		});
     		};
 		}
	};
}]);