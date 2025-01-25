class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //Identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        const curr_text = this.text.toLowerCase();

        if(curr_text.startsWith("just completed") || curr_text.startsWith("just posted")) {
            return "completed_event";
        }
        else if(curr_text.includes("watch") && curr_text.includes("live")) {
            return "live_event";
        }
        else if(curr_text.startsWith("achieved") && curr_text.includes("new personal record")) {
            return "achievement"
        }
        else {
            return "miscellaneous";
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        const curr_text = this.text.toLowerCase();

        if(curr_text.startsWith("just completed") || curr_text.startsWith("just posted")) {
            if(curr_text.indexOf("-") != -1)
            {
                return true;
            }
        }
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        else
        {
            let startIdx: number = this.text.indexOf("-") + 2;
            let endIdx: number = this.text.indexOf("https");
            return this.text.substring(startIdx, endIdx);
        }
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}