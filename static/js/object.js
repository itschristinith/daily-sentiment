//Create a constructor for the main object
//Constructor functions are best distinguished by capitalizing the function name
function DailySentiment(curHeadlines){
	"use strict";
	//Create two properties - Title & Image - both with hardcoded values for now
	this.date = "March 3, 2014";
	this.headlines = curHeadlines;
	this.sentiment = "positive or negative";
}
//global array to hold all of the DailySentiment objects
var headlinesSentiments = [];

//global string to hold the days headlines as one chunk of text to be analyzed
var headlinesString = '';
var headlinesArray = [];

//Define function to get NYTimes articles
function getArticles(curDate, curWord){
	var baseURL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + curWord + '&fq=section_name:("U.S.")&facet_field=section_name&'
	//var beginDate = '20140101';
	var beginDate = curDate;
	var nyTimesKey = '8bf628f2ec95db1d1378b935a3544251:17:66891658';
	var requestURL = baseURL + 'begin_date=' + beginDate +'&end_date=' + beginDate + '&api-key=' + nyTimesKey;
	console.log(requestURL);

	$.ajax({
		url: requestURL,
		type: 'GET',
		dataType: 'json',
		error: function(data){
			console.log("we got problems");
			console.log(data.status);
			alert("Something went wrong!");
		},
		success: function(data){
			console.log("success");
			//console.log(data);

			//variable to store headlines from the API call response
			var nytHeadlines;
			//Check to make sure the data is correct

			if (!(data.response.docs instanceof Array )){
				console.log("Huh??? Data is not an array");
				//Exit the function if the data is not an array
				return;
			}
			else {

			//fill todaysHeadLines array with reponse data
			nytHeadlines = data.response.docs;
			//console.log(nytHeadlines);
			}

			//variable to create/store many dailySentiment objects with just the headlines for now. 
			//then they will get pushed to the array of objects (headlinesSentiments) and wait for the sentiment
			var tempHeadlines;

			for(var i = 0; i < nytHeadlines.length; i++){
				//console.log(i + " : " + nytHeadlines[i].headline.main);
				tempHeadlines = new DailySentiment(nytHeadlines[i].headline.main);
				headlinesSentiments.push(tempHeadlines);
				headlinesArray.push(nytHeadlines[i].headline.main);
				$("#latestUpdates").append(
				//This is one long string of HTML markup broken into multiple lines for readability
				"<div class='headlinesBox'>" + 
				"<p>" 
				+ tempHeadlines.headlines + 
				"</p>" + "</div>"
				);
			}
			//convert string of headlines from array of headlines to send to sentiment analysis
			headlinesString = headlinesArray.toString();
			console.log(headlinesString);
			getSentiment(headlinesString);
		}

	});
}

function getSentiment(curText){
	var sentiURL = '/sentiment';
	var searchText = curText;
  $.ajax({
		url: sentiURL,
		type: 'GET',
		data: { theText : searchText },
		error: function(msg) {
			console.log("we got problems");

		},
		success: function(response){
			console.log("got sentiment");
			console.log(response);
			var sentimentData;
			sentimentData = response;
			var label = sentimentData.label;
			console.log(label);
			var pos = sentimentData.probability.pos;
			console.log("pos is" + pos);
			var neg = sentimentData.probability.neg;
			console.log("neg is" + neg);
			var neut = sentimentData.probability.neutral;
			console.log("neutral is" + neut);
			$("#sentiment").append(
			"<div class='dailySentiment'>" + "Daily Sentiment: " + label + "</div>"  +
			"<div class='dailyBreakdown'>" + "Positive " + pos + "</div>" + 
			"<div class='dailyBreakdown'>" + "Negative " + neg + "</div>" + 
			"<div class='dailyBreakdown'>" + "Neutral " + neut + "</div>"
			);
		}
	});
}

//Code to be executed once the page has fully loaded
$(document).ready(function(){
	"use strict";
	//Use jQuery to listen for a click on the "update" button
	$("#update").click(function(){
		headlinesArray = [];
		// $("#latestUpdates").empty();
		var newDate = $("#queryDate").val();
		var newSearchWord = $("#queryWord").val();
		//Create an InstaTimesArticle object
		//var testDailySentiment = new DailySentiment();
		$("#latestUpdates").empty();
		$("#sentiment").empty();
		getArticles(newDate, newSearchWord);
	});

});