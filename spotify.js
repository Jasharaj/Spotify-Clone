console.log("Lets write javascript")

let songs = [];
let songLocation = "";
let currentSong = new Audio();

// Initializing values

// Play video function
function pleaseplay() {      
        currentSong.play();
} 

// Pause video function
function pauseVid() {     
        currentSong.pause();
}


// function findIndex(array,track){
//     for (let index = 0; index < array.length; index++) {
//         const element = array[index];
//         if (element==track){
//             return index;
//         }        
//     }
//     return -2;
// }

// //Add an event listener to previous
// prev.addEventListener("click", () => {
//     console.log("Previous clicked");
// })



function secondsToMinuteSeconds(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    return (minutes < 10 ? "0" : "") + minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
}



const playmusic = (folder, track) => {
    pauseVid();
    document.querySelector(".volume>img").src = "volume.svg";
    songLocation = "";
    songLocation = `./Songs/${folder}/` + track;
    songLocation.replaceAll(" ", "%20");

    currentSong = new Audio(songLocation);

    pleaseplay();
    play.src = "pause.svg";
    songname.innerHTML = track.slice(0, track.length - 4);

    //Listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector("#song-time").innerHTML = secondsToMinuteSeconds(currentSong.currentTime).slice(0, 5) + "/" + secondsToMinuteSeconds(currentSong.duration).slice(0, 5);
        // console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".circle").style.left = ((currentSong.currentTime / currentSong.duration) * 100 - 110) + "%";
    })

    //Add an event listener to seek bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        document.querySelector(".circle").style.left = ((e.offsetX / e.target.getBoundingClientRect().width) * 100 - 110) + "%";
        currentSong.currentTime = (e.offsetX / e.target.getBoundingClientRect().width) * currentSong.duration;
    })

    // //Add an event listener for hamburger
    // document.querySelector(".hamburger").addEventListener("click",()=>{
    //     document.querySelector(".left").style.left = "100vw";
    // })

    
}

async function main(folder) {
    let a = await fetch(`./Songs/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }

    // console.log(songs[0]);

    console.log(songs);

    let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li class="songID">
        <div class="flex align-items gap">
            <img class="invert" src="music.svg" alt="">
            <span class="info">${song.split(`/${folder}/`)[1].replaceAll("%20", " ")}</span>
        </div>
        <div class="flex align-items gap">
            <img class="invert" src="play2.svg" alt="">
        </div>
    </li>`;
    }

    // audio.addEventListener("loadeddata", ()=>{
    //     console.log(audio.duration,audio.currentSrc,audio.currentTime);
    // })

    //Whenever a card is clicked, the first song will be played
    // playmusic(folder, document.querySelector(".info").innerHTML);

    //Attach an event listener to each song
    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // currentSong.pause();
            playmusic(folder, e.querySelector(".info").innerHTML);
        })
    })

    //Add an event listener to previous
    prev.addEventListener("click", () => {
        let temp = currentSong.src.split(`/${folder}/`)[1];
        temp = `./Songs/${folder}/` + temp;
        let index = songs.indexOf(temp);
        index -= 1;
        if (index >= 0) {
            let s = songs[index].split(`/${folder}/`)[1].replaceAll("%20", " ");
            // currentSong.pause();
            playmusic(folder, s);
        }
    })

    //Add an event listener to next
    next.addEventListener("click", () => {
        // let temp = currentSong.src.split(`${folder}`)[1];
        let temp = currentSong.src.split(`/${folder}/`)[1];
        temp = `./Songs/${folder}/` + temp;
        let index = songs.indexOf(temp);
        index += 1;
        if (index <= songs.length - 1) {
            let s = songs[index].split(`/${folder}/`)[1].replaceAll("%20", " ");
            // currentSong.pause();
            playmusic(folder, s);
        }
    })
}

async function displayAlbum() {
    let a = await fetch(`./Songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".card-container");
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        let e = array[index];
        if (e.href.includes("./Songs")) {
            let folder = e.href.split("/").slice(-2)[0];
            //Get the meta data of the folder
            a = await fetch(`./Songs/${folder}/info.json`);
            response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                <div class="play">
                    <img class="invert" src="play.svg" alt="">
                </div>
                <img src="./Songs/${folder}/cover.jpeg" alt="">
                    <h4>${response.title}</h4>
                    <p>${response.description}</p>
            </div>`
        }
    }

    //Load the playlist when card is clicked 
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            await currentSong.pause();
            songs = [];
            let fldr = item.currentTarget.dataset.folder;
            await main(fldr);
            playmusic(fldr, songs[0].split(`/${fldr}/`)[1].replaceAll("%20", " "));
        })
    })

    let saveSongVol;

    //Add an event listener to mute the song
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            saveSongVol = currentSong.volume;
            currentSong.volume = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = saveSongVol;
        }
    })

    //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".right").style.width = "0vw";
        document.querySelector(".left").style.width = "100vw";
    })

    //Add an event listener for close
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".right").style.width = "100vw";
        document.querySelector(".left").style.width = "0vw";
    })

    //Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        document.querySelector(".volume>img").src = "volume.svg";
    })




    //Attach an event listener to prev ,play and next
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            pleaseplay();
            play.src = "pause.svg";
        }
        else {
            pauseVid();
            play.src = "play2.svg";
        }
    })
}

displayAlbum();





