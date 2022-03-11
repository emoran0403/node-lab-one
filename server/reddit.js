/**
 * Use request-promise to retreive articles from https://reddit.com/r/popular.json.
 * Extract from each article title, url, and author
 */

const path = require("path");
const fs = require("fs");
const request = require("request-promise"); // requiring request-promise will also import request for me

const articlesPath = path.join(__dirname, "./popular-articles.json");

request("https://reddit.com/r/popular.json") // gets the data from the website
  .then((rawData) => {
    const parsedData = JSON.parse(rawData); // parse the data as JSON data and return a JS object
    const nicerData = parsedData.data.children; // drill down a little to the array level
    let dataToWrite = []; // this array will be pushed into for each reddit post
    nicerData.forEach((post) => {
      // go thru the array of data received, and for each post, pull out some data and store it in an object
      const redditPost = {
        author: post.data.author_fullname,
        title: post.data.title,
        url: post.data.url_overridden_by_dest,
        subReddit: post.data.subreddit,
      };
      dataToWrite.push(redditPost); // once the post data of interest has been pulled out, push it into an array
    });

    fs.writeFile(articlesPath, JSON.stringify(dataToWrite), (err) => {
      // go to the specified path, convert the data we want to write to JSON, then write the data
      if (err) {
        throw err;
      }
      console.log("Reddit scraped and saved!");
    });
  })
  .catch((e) => console.log(e));
