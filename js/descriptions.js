function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	let tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	window.writtenTweets = tweet_array.filter(tweet => tweet.written);
	console.log(window.writtenTweets.length);
}

function addEventHandlerForSearch() {
	const textFilter = document.getElementById("textFilter");
	let debounceTimeout;
	textFilter.addEventListener("input", function(e) {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(function() {
			const input = textFilter.value.toLowerCase();
			let searchCount = 0;
			let rows = "";
			window.writtenTweets.forEach(tweet => {
				let text = tweet.writtenText;
				if(text.toLowerCase().includes(input)) {
					searchCount++;
					const thisRow = tweet.getHTMLTableRow(searchCount, tweet.activityType, tweet.text);
					rows += thisRow;
				}
			})

			const tweetTable = document.getElementById("tweetTable");
			tweetTable.innerHTML = rows;
			document.getElementById("searchCount").innerText = searchCount.toString();
			document.getElementById("searchText").innerText = input;
		}, 300);
	});

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});