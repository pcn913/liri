'use strict';


const randomfile = "random.txt";

var tkeys = require("./keys");
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');


var consumer_key = tkeys.twitterKeys.consumer_key;
var consumer_secret = tkeys.twitterKeys.consumer_secret;
var access_token_key = tkeys.twitterKeys.access_token_key;
var access_token_secret = tkeys.twitterKeys.access_token_secret;


// hold the liri command; command option if passed
var liriCommand = process.argv[2];
var liriCommandOption = process.argv[3];


whatToDo(liriCommand, liriCommandOption);

function whatToDo(liriCommand, liriCommandOption){
	switch(liriCommand){
		case 'my-tweets':
			printTweets();
			break;
		case 'spotify-this-song':
			printSpotify(liriCommandOption);
			break;
		case 'movie-this':
			printMovie(liriCommandOption);
			break;
		case 'do-what-it-says':
			doWhatItSays();
			break;
		default:
			console.log('not a valid option');

	}
}




function printTweets(){
	var twitterClient = new Twitter(tkeys.twitterKeys); //
	var params = {count: 5};  //get only the last 20


	 twitterClient.get('statuses/home_timeline', params, function(error, tweets, response) {
	   if (!error) {
	     //console.log(tweets);
	     for(var i=0; i <tweets.length; i++){
	     	console.log(i+1 + ": " + tweets[i].text + " (" + tweets[i].created_at + ") \n");
	     }
	   }
	 });
 }


function printSpotify(song){
	//console.log('spotify-this-song: ' + song);
	var spotifySong;
	if(song){
		spotifySong = song;
	}else{
		spotifySong = 'The Sign Ace of Base';
	}

	spotify.search({ type: 'track', query: spotifySong }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
	 		 //console.log(JSON.stringify(data, null, 2));

			var artist = data.tracks.items[0].album.artists[0].name;
			var album = data.tracks.items[0].album.name;
			var song = data.tracks.items[0].name;
			var previewurl = data.tracks.items[0].preview_url;


			console.log('artist:', artist);
			console.log('song:', song);
			console.log('album:', album);
			console.log('preview url:', previewurl);
	});

}

function printMovie(movie){
	console.log('movie-this: ' + movie);
	var omdbMovie;
	if(movie){
		omdbMovie = movie;
	}else{
		omdbMovie = 'Mr. Nobody';
	}

	var omdburl = "http://www.omdbapi.com?t=";

	var omdbrequest = omdburl + omdbMovie;

	request(omdbrequest, function (error, response, body) {

		
		var jsonResponse = JSON.parse(body);
		//console.log(jsonResponse.Title);

		var title = jsonResponse.Title;
		var year = jsonResponse.Year;
		var rating = jsonResponse.imdbRating;
		var country = jsonResponse.Country;
		var language = jsonResponse.language;
		var plot = jsonResponse.Plot;
		var url = jsonResponse.Website;

		console.log('* title: ' + title);
		console.log('* year released: ' + year);
		console.log('* rating: ' + rating);
		console.log('* country: ' + country);
		console.log('* language: ' + language);
		console.log('* plot: ' + plot);
		console.log('* url: ' + url);

	});


}


function doWhatItSays(){
	fs.readFile(randomfile, "utf8", function(error, data) {

	  // We will then print the contents of data
	  //console.log(data);
	  var text = data.split(',');

	  var command = text[0];
	  var commandOption = text[1];

	  whatToDo(command, commandOption);

	});

}