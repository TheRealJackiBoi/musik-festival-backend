const express = require("express")
const app = express();
const port = 8000;

const fetch = require('node-fetch');

const firebase = require("firebase");
require("firebase/auth");
require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyAqTzo-Dw0BRpn-CtcoMKwBTinuyMcw05w",
    authDomain: "musik-festival.firebaseapp.com",
    projectId: "musik-festival",
    storageBucket: "musik-festival.appspot.com",
    messagingSenderId: "926170899503",
    appId: "1:926170899503:web:a2fc0c1a26737b463e92da",
    measurementId: "G-2RSJLKW2FP"
  };

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

const timeInfoRef = db.collection("timeInfo");
const videoInfoRef = db.collection("videoInfo");


app.listen(port, () =>{
    console.log("Listing on " + port);

    setInterval(loop, 2000); //Loop every second

    newVideo("fZMRc-UyPm0");
});


async function loop(){
    const snapshot = await timeInfoRef.get();
    let timeInfo;

    snapshot.forEach(element => {
         timeInfo = element.data();
    });

    timeInfo.time += 2;

    timeInfoRef.doc("info").set(timeInfo).then(ref => console.log("Time: " + timeInfo.time));
}

function newVideo(videoId){

    let video;

    fetch("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoId +"&key=AIzaSyABQyO1Hrn0HCqGgRJFZm-Wm4fqNRFcjO4")
      .then(res => res.json())
      .then(
        (result) => {
          //result.items[0].snippet.title = result.items[0].snippet.title.replace("(Video)", "");
            video = result.items[0].snippet;
            
            
            
            videoInfo = {
                title: video.title,
                videoId: videoId
            }
            console.log(videoInfo.title);
            
            videoInfoRef.doc("info").set(videoInfo);

        },
      );
}