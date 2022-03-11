const fs = require("fs"); // this comes with node by default
const path = require("path"); // this comes with node by default

let chirps = [
  { message: "some message", username: "some username", uuid: "some uuid", timeOfChirp: 12, someOtherProp: true },
  { message: "some other message", username: "some other username", uuid: "some other uuid", timeOfChirp: 34, someOtherProp: false },
  { message: "some new message", username: "some new username", uuid: "some new uuid", timeOfChirp: 56, someOtherProp: null },
  { message: "another message", username: "another username", uuid: "another uuid", timeOfChirp: 78, someOtherProp: undefined },
  { message: "yet another message", username: "yet another username", uuid: "yet another uuid", timeOfChirp: 910, someOtherProp: { someLame: "object" } },
];

const chirpPath = path.join(__dirname, "./chirps.json");
// joins the relative path to the file, with the file itself
// this relative pathing to the file can then be used anywhere

function readChirps() {
  // function to read chirps from chirpPath - resolves with chirps as JS object
  return new Promise((resolve, reject) => {
    // read the file located at chirpPath...
    fs.readFile(chirpPath, (err, data) => {
      // ...if there is an error...
      if (err) {
        reject(err); // ...return the promise as rejected
      }
      resolve(JSON.parse(data)); // ...if no error occurs, parse the data as JSON data, and return the promise as resolved
    });
  });
}

function writeChirps(dataToWrite) {
  // function to write chirps to chirpPath - resolves with success message
  return new Promise((resolve, reject) => {
    // write to the file located at chirpPath...
    fs.writeFile(chirpPath, JSON.stringify(dataToWrite), (err) => {
      // ...if there is an error...
      if (err) {
        reject(err); // ...return the promise as rejected
      }
      resolve("Chirps Written!"); // ...if no error occurs, resolve with "Chirps Written!"
    });
  });
}

//* I don't really like this .then business here, so i'm just going to comment it out :D

// writeChirps(chirps)
//   .then((chirps) => {
//     return readChirps(chirps);
//   })
//   .then((msg) => console.log(msg))
//   .catch((e) => console.log(e));

async function readAndWriteChirps() {
  try {
    const successMsg = await writeChirps(chirps);
    console.log(successMsg);
    const chirpMsg = await readChirps();
    console.log(chirpMsg);
  } catch (error) {
    console.log(error);
  }
}

readAndWriteChirps();
