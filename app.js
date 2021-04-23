const express = require("express")
const app = express();
const port = 8000;

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

const globalRef = db.collection("global");


app.listen(port, () =>{
    console.log("Listing on " + port);

    setInterval(loop, 2000); //Loop every second
});


async function loop(){
    const snapshot = await globalRef.get();
    let global;

    snapshot.forEach(element => {
         global = element.data();
    });

    global.time += 2;

    globalRef.doc("songInfo").set(global).then(ref => console.log("Time: " + global.time));

}