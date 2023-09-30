let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let recordFlag = false;
let recorder;
let chunks = []; // media data in chunks
let transparentColor = "transparent";

let constraints = {
  video: true,
  audio: true,
};

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  video.srcObject = stream;

  recorder = new MediaRecorder(stream);

  recorder.addEventListener("start", (e) => {
    chunks = [];
  });

  recorder.addEventListener("dataavailable", (e) => {
    chunks.push(e.data);
  });

  recorder.addEventListener("stop", (e) => {
    // converstion of media chunks data to video
    let blob = new Blob(chunks, { type: "video/mp4" });

    //save video to indexDb when user stop recording

    if(db){
        let videoId = shortid();
        console.log('videoId is == ', videoId);
        let dbTransaction = db.transaction("video", "readwrite");
        let videoStore =  dbTransaction.objectStore("video");
        let videoEntry = {
            id:`vid-${videoId}`,
            blobData:blob
        }
        videoStore.add(videoEntry);
    }

    // let videoUrl = window.URL.createObjectURL(blob);

    // let a = document.createElement("a");

    // a.href = videoUrl;

    // a.download = "stream.mp4";

    // a.click();
  });
});

recordBtnCont.addEventListener("click", (e) => {
  if (!recorder) return;

  recordFlag = !recordFlag;

  if (recordFlag) {
    // start recording
    recorder.start();
    recordBtn.classList.add("scale-record");
    startTimer();
  } else {
    //stop recording
    recorder.stop();
    recordBtn.classList.remove("scale-record");
    stopTimer();
  }
});

let timerId;
let timer = document.querySelector(".timer");
let counter = 0;

function startTimer() {

    timer.style.display = "block";


  function displayTimer() {

    let totalSeconds = counter;

    let hours = Number.parseInt(totalSeconds/3600);

    totalSeconds = totalSeconds % 3600; // remianing value

    let minutes = Number.parseInt(totalSeconds/60);

    totalSeconds = totalSeconds % 60;

    let seconds = totalSeconds;

    hours = (hours < 10) ? `0${hours}` : hours;
    minutes = (minutes < 10) ? `0${minutes}` : minutes;
    seconds = (seconds < 10) ? `0${seconds}` : seconds;


    timer.innerText = `${hours}:${minutes}:${seconds}`;

    counter++;
  }

  timerId = setInterval(displayTimer, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  timer.innerHTML = "00:00:00";
  timer.style.display = "none";
}

captureBtnCont.addEventListener("click", (e)=>{

    captureBtn.classList.add("scale-capture");

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext('2d');

    tool.drawImage(video, 0, 0, canvas.width, canvas.height);

    //filtering

    tool.fillStyle = transparentColor;
    tool.fillRect(0,0,canvas.width,canvas.height )

    let imageURL = canvas.toDataURL();

    // let a = document.createElement("a");
    // a.href = imageURL;
    // a.download = "image.jpg";
    // a.click();

    // save image to indexDb when user clicks on image.
    


    if(db){
        let imageId = shortid();
        console.log('image is == ', imageId);
        let dbTransaction = db.transaction("image", "readwrite");
        let imageStore =  dbTransaction.objectStore("image");
        let imageEntry = {
            id:`img-${imageId}`,
            url: imageURL
        }
        imageStore.add(imageEntry);
    }

    setTimeout(()=>{
      captureBtn.classList.remove("scale-capture");
    },500)
  })

// filtering logic 

let filterLayer = document.querySelector(".filter-layer")

let allFilters = document.querySelectorAll(".filter");
allFilters.forEach((item)=>{
    item.addEventListener("click", (e)=>{
       //get value

        transparentColor =  getComputedStyle(item).getPropertyValue("background-color");
        console.log("transparentColor is == ", transparentColor)

        filterLayer.style.backgroundColor = transparentColor;
    })
})

