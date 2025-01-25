function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	let tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	let earliest_tweet = tweet_array.reduce((earliest, current) => {
		return new Date(current.time) < new Date(earliest.time) ? current : earliest;
	});
	let latest_tweet = tweet_array.reduce((latest, current) => {
		return new Date(current.time) > new Date(latest.time) ? current : latest;
	});

	let completed_events= 0;
	let live_events= 0;
	let achievements= 0;
	let miscellaneous= 0;

	tweet_array.forEach(tweet => {
		switch(tweet.source) {
			case "completed_event": completed_events++; break;
			case "live_event": live_events++; break;
			case "achievement": achievements++; break;
			case "miscellaneous": miscellaneous++; break;
		}
	});
	let completedEventsPct = math.format(completed_events / tweet_array.length * 100, { notation: 'fixed', precision: 2 });
	let liveEventsPct = math.format(live_events / tweet_array.length * 100, { notation: 'fixed', precision: 2 });
	let achievementsPct = math.format(achievements / tweet_array.length * 100, { notation: 'fixed', precision: 2 });
	let miscPct = math.format(miscellaneous / tweet_array.length * 100, { notation: 'fixed', precision: 2 });

	let userWrittenCount = 0;
	tweet_array.forEach(tweet => {
		if(tweet.written)
		{
			userWrittenCount++;
			console.log(tweet.writtenText);
		}
	})
	let userWrittenPct = math.format(userWrittenCount / tweet_array.length * 100, { notation: 'fixed', precision: 2 });

	console.log("Updating numberTweets:", tweet_array.length);
	document.getElementById('numberTweets').innerText = tweet_array.length;

	const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	console.log("Updating firstDate:", earliest_tweet.time);
	document.getElementById('firstDate').innerText = earliest_tweet.time.toLocaleDateString(
		'en-US', dateOptions);
	console.log("Updating lastDate:", latest_tweet.time);
	document.getElementById('lastDate').innerText = latest_tweet.time.toLocaleDateString(
		'en-US', dateOptions);

	console.log("Updating tweet categories & their percentages:", completed_events, live_events, achievements, miscellaneous);
	document.querySelectorAll('.completedEvents').forEach(function (element) {
		element.innerText = completed_events.toString()
	});
	document.querySelector('.completedEventsPct').innerText = completedEventsPct.toString() + "%";
	document.querySelector('.liveEvents').innerText = live_events.toString();
	document.querySelector('.liveEventsPct').innerText = liveEventsPct.toString() + "%";
	document.querySelector('.achievements').innerText = achievements.toString();
	document.querySelector('.achievementsPct').innerText = achievementsPct.toString() + "%";
	document.querySelector('.miscellaneous').innerText = miscellaneous.toString();
	document.querySelector('.miscellaneousPct').innerText = miscPct.toString() + "%";

	console.log("Updating user written text count and percentage");
	document.querySelector('.written').innerText = userWrittenCount.toString();
	document.querySelector('.writtenPct').innerText = userWrittenPct.toString() + "%";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});