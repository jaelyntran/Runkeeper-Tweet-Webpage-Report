function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	let tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const activityMap = new Map();
	tweet_array.forEach(tweet => {
		if(!tweet.activityType.includes("unknown")) {
			activityMap.set(tweet.activityType,
				(activityMap.get(tweet.activityType) || 0) + 1);
		}
	});

	const sortedActivityMap = new Map([...activityMap.entries()].sort((a, b) => b[1] - a[1]));
	for (let [key, value] of sortedActivityMap) {
		console.log(key, " ", value);
	}

	console.log("Updating number of activity:", activityMap.size);
	document.getElementById('numberActivities').innerText = activityMap.size;

	let topThreeArray = Array.from(sortedActivityMap.keys()).slice(0, 3);
	document.getElementById('firstMost').innerText = topThreeArray[0];
	document.getElementById('secondMost').innerText = topThreeArray[1];
	document.getElementById('thirdMost').innerText = topThreeArray[2];

	let runDistance = 0;
	let runCount = 0;
	let walkDistance = 0;
	let walkCount = 0;
	let bikeDistance = 0;
	let bikeCount = 0;
	let weekendCount = 0;
	let weekdayCount = 0;
	let weekendDistance = 0;
	let weekdayDistance = 0;
	let topThree = false;

	const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const distancesByDayOfWeekMap = new Map();
	distancesByDayOfWeekMap.set("run", new Map([
		["Monday", []],
		["Tuesday", []],
		["Wednesday", []],
		["Thursday", []],
		["Friday", []],
		["Saturday", []],
		["Sunday", []]
	]));

	distancesByDayOfWeekMap.set("walk", new Map([
		["Monday", []],
		["Tuesday", []],
		["Wednesday", []],
		["Thursday", []],
		["Friday", []],
		["Saturday", []],
		["Sunday", []]
	]));

	distancesByDayOfWeekMap.set("bike", new Map([
		["Monday", []],
		["Tuesday", []],
		["Wednesday", []],
		["Thursday", []],
		["Friday", []],
		["Saturday", []],
		["Sunday", []]
	]));

	tweet_array.forEach(tweet => {
		let tweetActivity = tweet.activityType;
		if(tweetActivity === "run") {
			runDistance += tweet.distance;
			runCount++;
			topThree = true;
		} else if(tweetActivity === "walk") {
			walkDistance += tweet.distance;
			walkCount++;
			topThree = true;
		} else if(tweetActivity === "bike") {
			bikeDistance += tweet.distance;
			bikeCount++;
			topThree = true;
		}

		if(topThree) {
			let dayNumber = new Date(tweet.time).getDay();
			let dayString = daysOfWeek[dayNumber];
			console.log(dayString);
			let activityMap = distancesByDayOfWeekMap.get(tweetActivity);
			activityMap.get(dayString).push(tweet.distance);

			if(dayNumber === 0 || dayNumber === 6) {
				weekendDistance += tweet.distance;
				weekendCount++;
			}
			else
			{
				weekdayDistance += tweet.distance;
				weekdayCount++;
			}
			topThree = false;
		}
	});

	console.log("Run distance: ", runDistance);
	console.log("Run count: ", runCount);
	console.log("Walk distance: ", walkDistance);
	console.log("Walk count: ", walkCount);
	console.log("Bike distance: ", bikeDistance);
	console.log("Bike count: ", bikeCount);

	let runAvg = runDistance/runCount;
	let walkAvg = walkDistance/walkCount;
	let bikeAvg = bikeDistance/bikeCount;
	const activityAverages = {
		Run: runAvg,
		Walk: walkAvg,
		Bike: bikeAvg
	};

	let longestActivity = Object.keys(activityAverages).reduce((max, activity) =>
		activityAverages[activity] > activityAverages[max] ? activity : max
	);
	let shortestActivity = Object.keys(activityAverages).reduce((min, activity) =>
		activityAverages[activity] < activityAverages[min] ? activity : min
	);

	document.getElementById('longestActivityType').innerText = longestActivity.toLowerCase();
	document.getElementById('shortestActivityType').innerText = shortestActivity.toLowerCase();


	let weekendAvg = weekendDistance / weekendCount;
	let weekdayAvg = weekdayDistance / weekdayCount;

	console.log("Weekend distance :", weekendDistance);
	console.log("Weekend count: ", weekendCount);
	console.log("Weekday distance: ", weekdayDistance);
	console.log("Weekday count: ", weekdayCount);

	document.getElementById("weekdayOrWeekendLonger").innerText = weekendAvg > weekdayAvg ? "the weekends" : "the weekdays";


	let activityData = Array.from(activityMap, ([activity, count]) => ({
		activity: activity,
		count: count,
	}));
	activity_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
			"values": activityData
		},
		"mark": "bar",
		"encoding": {
			"x": {
				"field": "activity",
				"type": "nominal",
				"axis": {"title": "Activity Type"}
			},
			"y": {
				"field": "count",
				"type": "quantitative",
				"axis": {"title": "Number of Tweets"}
			}
		},
		"width": 600,
		"height": 400
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	let formattedData = [];
	distancesByDayOfWeekMap.forEach((activityMap, activityType) => {
		activityMap.forEach((distances, day) => {
			distances.forEach(distance => {
				formattedData.push({
					activity: activityType,
					day: day,
					distance: distance
				});
			});
		});
	});

	distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of distances by day of the week for all of the three most tweeted-about activities.",
		"data": {
			"values": formattedData
		},
		"mark": "point",
		"encoding": {
			"x": {
				"field": "day",
				"type": "ordinal",
				"sort": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
				"title": "Day of the Week"
			},
			"y": {
				"field": "distance",
				"type": "quantitative",
				"title": "Distance"
			},
			"color": {
				"field": "activity",
				"type": "nominal",
				"title": "Activity"
			}
		}
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	let formattedDataAgg = [];
	distancesByDayOfWeekMap.forEach((activityMap, activityType) => {
		activityMap.forEach((distances, day) => {
			if (distances.length > 0) {
				let meanDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
				formattedDataAgg.push({
					activity: activityType,
					day: day,
					distance: meanDistance
				});
			}
		});
	});

	distance_vis_agg_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of distances by day of the week for all of the three most tweeted-about activities.",
		"data": {
			"values": formattedDataAgg
		},
		"mark": "point",
		"encoding": {
			"x": {
				"field": "day",
				"type": "ordinal",
				"sort": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
				"title": "Day of the Week"
			},
			"y": {
				"field": "distance",
				"type": "quantitative",
				"title": "Average Distance"
			},
			"color": {
				"field": "activity",
				"type": "nominal",
				"title": "Activity"
			}
		}
		//TODO: Add mark and encoding

	};
	vegaEmbed('#distanceVisAggregated', distance_vis_agg_spec, {actions:false});

	document.getElementById("aggregate").addEventListener("click", function (event) {
		const distanceVis = document.getElementById("distanceVis");
		const distanceVisAgg = document.getElementById("distanceVisAggregated");

		if(distanceVis.style.display !== "none") {
			distanceVis.style.display = "none";
			distanceVisAgg.style.display = "block";
		} else {
			distanceVisAgg.style.display = "none";
			distanceVis.style.display = "block";
		}
	})
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});