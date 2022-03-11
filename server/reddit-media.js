/**
 * Use request-promise to retreive articles from https://reddit.com/r/popular.json.
 * Extract from each article title, url, and author
 */

const path = require("path");
const fs = require("fs");
const request = require("request-promise"); // requiring request-promise will also import request for me

const imagesDir = path.join(__dirname, "./images"); // sets the path to the file within which the reddit media will be written
const validFileTypes = [".jpg", ".jpeg", ".png", ".gif", ".gifv", ".mp4"]; // list of the file types of interest

request("https://reddit.com/r/popular.json") // gets the data from the website
  .then((rawData) => {
    const parsedData = JSON.parse(rawData); // parse the data as JSON data and return a JS object
    const nicerData = parsedData.data.children; // drill down a little to the array level

    nicerData.forEach((post) => {
      // go thru the array of data received, and for each post, pull out some data and store it in an object
      const imageURL = post.data.url_overridden_by_dest; // for certain posts, this is the image we will be saving
      const imageThumbnail = post.data.thumbnail; // there is at least one instance where url_overridden_by_dest is not an image, but thumbnail is
      // when this is the case, we will save the thumbnail instead

      const imageTitleWithoutQuotes = post.data.title.substring(0, post.data.title.length - 1); // stores the image title without the beginning and ending quotes
      const imageTitle = imageTitleWithoutQuotes
        .split(" ")
        .join("")
        .replace(/[^\w+]/g, ""); // removes non letter and non number characters in the image title to produce a string of characters

      if (imageURL) {
        // if the link exists... (because some posts do not have images and return as undefined, and we only want the images)
        const fileExtensionOfURL = path.extname(imageURL); // ...grab the extension...
        const fileExtensionOfThumbnail = path.extname(imageThumbnail);
        const imageFileOfURL = imageTitle + fileExtensionOfURL; // concatenate the title with the extension to produce a file
        const imageFileOfThumbnail = imageTitle + fileExtensionOfThumbnail; // concatenate the title with the extension to produce a file

        validFileTypes.forEach((validImageURL) => {
          // ...then go through the list of acceptable file types...
          if (validImageURL === fileExtensionOfURL) {
            // ...if the extension is acceptable, then we know this is an image we want to download
            // console.log(imageURL);

            request(imageURL, { encoding: "base64" }).then((img) => {
              const file = path.join(imagesDir, imageFileOfURL);

              fs.writeFile(file, img, { encoding: "base64" }, (err) => {
                // go to the specified path, convert the data we want to write to JSON, then write the data
                if (err) {
                  throw err;
                }
                console.log("Image scraped and saved!");
              });
            });
          } else if (validImageURL === fileExtensionOfThumbnail) {
            request(imageThumbnail, { encoding: "base64" }).then((thumb) => {
              const file = path.join(imagesDir, imageFileOfThumbnail);

              fs.writeFile(file, thumb, { encoding: "base64" }, (err) => {
                // go to the specified path, convert the data we want to write to JSON, then write the data
                if (err) {
                  throw err;
                }
                console.log("Thumbnail scraped and saved!");
              });
            });
          }
        });
      }
    });
  })
  .catch((e) => console.log(e));
