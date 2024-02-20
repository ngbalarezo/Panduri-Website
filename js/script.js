//select all required tags or elements

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseButton = wrapper.querySelector(".play-pause"),
prevButton = wrapper.querySelector("#prev"),
nextButton = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreButton = wrapper.querySelector("#more-music"),
hideMusicButton = musicList.querySelector("#close");

let musicIndex = 1;

window.addEventListener("load", ()=>{
  loadMusic(musicIndex);//calling load music function once window loaded
  playingNow();
})

//load music function
function loadMusic(indexNum){
  musicName.innerText = allMusic[indexNum - 1].name;
  musicArtist.innerText = allMusic[indexNum - 1].artist;
  musicImg.src = `music-player/images/${allMusic[indexNum - 1].img}.jpg`
  mainAudio.src = `music-player/songs/${allMusic[indexNum - 1].src}.mp3`
}

//play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseButton.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//pause music function
function pauseMusic(){
  wrapper.classList.remove("paused");
  playPauseButton.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

//next music function
function nextMusic(){
  //increment index by 1
  musicIndex++;
  //if music index is greater than array length then musicIndex = 1
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

//prev music function
function prevMusic(){
  //decrement index by 1
  musicIndex--;
  //if music index is less than 1 then musicIndex = allMusic.length for last song
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

//play or pause music button event
playPauseButton.addEventListener("click", ()=>{
  const isMusicPaused = wrapper.classList.contains("paused");
  //if isMusicPaused is true then call pauseMusic, else call playMusic
  isMusicPaused ? pauseMusic() : playMusic();
  playingNow();
});

nextButton.addEventListener("click", ()=>{
  nextMusic();//calls next music function
});

prevButton.addEventListener("click", ()=>{
  prevMusic();//calls next music function
});

mainAudio.addEventListener("timeupdate", (e)=>{
  const currentTime = e.target.currentTime; //gets current time
  const duration = e.target.duration; //gets duration of song
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current"),
  musicDuration = wrapper.querySelector(".duration");

  mainAudio.addEventListener("loadeddata", ()=>{
    //update song total duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if(totalSec < 10){ //adds 0 if sec is less than 10
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });

  //update playing song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if(currentSec < 10){ //adds 0 if sec is less than 10
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//updates song according to progress bar width
progressArea.addEventListener("click", (e)=>{
  let progressWidthVal = progressArea.clientWidth; //gets width of progress bar
  let clickedOffsetX = e.offsetX; //gets offset x value
  let songDuration = mainAudio.duration; //gets song total duration

  mainAudio.currentTime = (clickedOffsetX / progressWidthVal) * songDuration;
  playMusic();
});

//repeat/shuffle song according to icon
const repeatButton = wrapper.querySelector("#repeat-playlist");
repeatButton.addEventListener("click", ()=>{
  //get the innerText of the icon and then change accordingly
  let getText = repeatButton.innerText; //gets innerText of icon
  //different changes on different icon click using switch
  switch(getText){
    case "repeat": //if icon is repeat
      repeatButton.innerText = "repeat_one";
      repeatButton.setAttribute("title", "Song looped");
      break;
    case "repeat_one": //if icon is repeat_one
      repeatButton.innerText = "shuffle";
      repeatButton.setAttribute("title", "Playback shuffle");
      break;
    case "shuffle": //if icon is shuffle
      repeatButton.innerText = "repeat";
      repeatButton.setAttribute("title", "Playlist looped");
      break;
  }
});

//functionality of loop song, loop playlist, and shuffle playback feature
mainAudio.addEventListener("ended", ()=>{
  //loop song - repeats current song continually
  let getText = repeatButton.innerText; //gets innerText of icon
  //sets up cases for each icon
  switch(getText){
    case "repeat": //if icon is repeat then play next song
      nextMusic();
      break;
    case "repeat_one": //if icon is repeat_one then load same song from start
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle": //if icon is shuffle then generate random index
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
      do{
        randIndex = Math.floor((Math.random() * allMusic.length) + 1);
      }while(musicIndex == randIndex); //loops until index is different than current index
      //passes randIndex to musicIndex;
      musicIndex = randIndex;
      //loads and plays music
      loadMusic(musicIndex);
      playMusic();
      playingNow();
      break;
  }

});

showMoreButton.addEventListener("click", ()=>{
  musicList.classList.toggle("show");
});

hideMusicButton.addEventListener("click", ()=>{
  showMoreButton.click();
});

const ulTag = wrapper.querySelector("ul");

//creates ul according to array length
for (let i = 0; i < allMusic.length; i++) {
  let liTag = `<li li-index="${i + 1}">
                  <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                  </div>
                  <audio class="${allMusic[i].src}" src="music-player/songs/${allMusic[i].src}.mp3"></audio>
                  <span id="${allMusic[i].src}" class="audio-duration">0:30</span>
                </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

  liAudioTag.addEventListener("loadeddata", ()=>{
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if(totalSec < 10){ //adds 0 if sec is less than 10
      totalSec = `0${totalSec}`;
    }
    liAudioDuration.innerText = `${totalMin}:${totalSec}`;
    //adds t-duration attribute which we'll use below
    liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });
}

//particular song on click
const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector(".audio-duration");
    //removes playing class from all other li except currently playing song
    if(allLiTags[j].classList.contains("playing")){
      allLiTags[j].classList.remove("playing");
      //passes t-duration to .audio-duration innertext
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration; //
    }

    //if there is an li tag which li-index = musicIndex
    //then this music is playing now and we will style it
    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
      allLiTags[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }
  
    //adding onclick attribute in all li tags
    allLiTags[j].setAttribute("onclick", "clicked(this)");
    
  }
}

//play song on li click
function clicked(element){
  //gets li index of clicked li tag
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; //passes li index to musicIndex
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}
