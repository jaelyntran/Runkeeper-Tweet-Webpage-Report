class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

    get source():string {
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
        else {
            const activityRegex = /\b(run|walk|bike|hike|swim|meditation|yoga|workout|row|skate|dance|pilates|boxing|snowboard)\b/i;
            const match = this.text.match(activityRegex);
            return match ? match[0] : "other activities";
        }
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        } else {
            let miConversion = true;
            let kmToMi = 1.609;

            let startIdx = this.text.indexOf("a");
            let endIdx = this.text.indexOf("km");
            if (endIdx == -1) {
                endIdx = this.text.indexOf("mi");
                miConversion = false;
            }
            let distance = this.text.substring(startIdx + 2, endIdx - 1);

            let numDistance = Number(distance);
            if (miConversion) {
                numDistance = numDistance * kmToMi;
            }
            return numDistance ? numDistance : 0;
        }
    }

    getHTMLTableRow(rowNumber:number, activityType: string, text: string):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const linkedText = text.replace(urlRegex, function(url) {
            return `<a href="${url}" target="_blank">${url}</a>`;
        });

        return "<tr>" +
            "<td>" + rowNumber.toString() + "</td>" +
            "<td>" + activityType + "</td>" +
            "<td>" + linkedText + "</td>" +
            "</tr>";
    }
}