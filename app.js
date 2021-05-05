const express = require("express")
const app = express();
const port = 8000;

const fetch = require('node-fetch');

const firebase = require("firebase");
require("firebase/auth");
require("firebase/firestore");

let playlistId = "PL64E6BD94546734D8";
let playlistPageToken = "CAUQAA";


let currentVideoLength;

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
const votingRef = db.collection("voting");


app.listen(port, () =>{


    console.log("Listing on " + port);

    start();
    setInterval(loop, 2000); //Loop every second

    //newVideo("fZMRc-UyPm0");
    //startNewVotingCycle();
});


async function loop(){
    const snapshot = await timeInfoRef.get();
    let timeInfo;

    snapshot.forEach(element => {
         timeInfo = element.data();
    });

    timeInfo.time += 2;

    console.log("Time: " + timeInfo.time)

    if (timeInfo.time >= currentVideoLength){
        console.log("Video ended. Starting new video");
        startNextVideo();
        startNewVotingCycle();
        timeInfo.time = 0;
    }

    timeInfoRef.doc("info").set(timeInfo);


}

function newVideo(videoId){

    let video;

    fetch("https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=" + videoId +"&key=AIzaSyABQyO1Hrn0HCqGgRJFZm-Wm4fqNRFcjO4&")
      .then(res => res.json())
      .then(
        (result) => {
          //result.items[0].snippet.title = result.items[0].snippet.title.replace("(Video)", "");
            
          //console.log(result.items[0].contentDetails.duration.replace("PT", ""));
          let minutes = result.items[0].contentDetails.duration.substring(2,3);
          let seconds = result.items[0].contentDetails.duration.substring(4,10).replace("S", "")
          
          currentVideoLength = Number(minutes) * 60 + Number(seconds);

          video = result.items[0].snippet;
            
            videoInfo = {
                title: formatTitle(video.title),
                videoId: videoId,
                duration: currentVideoLength
            }
            //console.log(videoInfo.title);
            
            videoInfoRef.doc("info").set(videoInfo);
            console.log("Playing video: " + video.title)
            console.log("New video length: " + currentVideoLength);

        },
      );
}


function startNewVotingCycle(){
    fetch("https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=5&playlistId=" + playlistId + "&pageToken=" + playlistPageToken + "&key=AIzaSyABQyO1Hrn0HCqGgRJFZm-Wm4fqNRFcjO4")
        .then(res => res.json())
          .then(
            (result) => {
              //console.log(result);

              playlistPageToken = result.nextPageToken;

                let votingVideoTitles = [];
                let votingVideoIds = []

                result.items.forEach(video => {
                   // console.log(video.snippet.resourceId.videoId);
                    let title = formatTitle(video.snippet.title)

                    votingVideoTitles.push(title);
                    votingVideoIds.push(video.snippet.resourceId.videoId);
                });

               
                for (let i = 0; i < 5; i++){
                    //let votes = Math.floor(Math.random() * 95);
                    votingRef.doc("song"+i).set({title: votingVideoTitles[i],  votes: 0, videoId: votingVideoIds[i], index: i});  
                }

                
            },
          );
}


async function startNextVideo(){ //Find most voted video and play it
    const snapshot = await votingRef.get();

    let mostVotes = 0;
    let votedVideo = "fZMRc-UyPm0" // Dummy video

    snapshot.forEach(element => { 
        let entry = element.data();
        let votes = entry.votes;
        if (votes > mostVotes){
            votedVideo = entry.videoId;
        }
    });

    newVideo(votedVideo);
}

async function start(){
    const snapshot = await videoInfoRef.get();

    snapshot.forEach(element => { 
        let info = element.data();
        currentVideoLength = info.duration;
    });
    
    console.log("Servert started");
    console.log("Current video length: " + currentVideoLength);
}



function formatTitle(title){
    let n = title.indexOf("(");
    if (n > 0)
        title = title.substring(0,n);
    n = title.indexOf("[");
    if (n > 0)
        title = title.substring(0,n);

    return title;
}