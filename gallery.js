setTimeout(() => {
  if (db) {
    // video retrival

    let dbTransactionVideo = db.transaction("video", "readonly");
    let videoStore = dbTransactionVideo.objectStore("video");
    let videoRequest = videoStore.getAll();

    videoRequest.onsuccess = (e) => {
      let videoResult = videoRequest.result;
      let galleryCont = document.querySelector(".gallery-cont");

      videoResult.forEach((video) => {
        let mediaElem = document.createElement("div");
        mediaElem.setAttribute("class", "media-cont");
        mediaElem.setAttribute("id", video.id);
        // mediaElem.setAttribute("title", video.id);

        let url = URL.createObjectURL(video.blobData);

        mediaElem.innerHTML = `
            <div class="media">
                <video src="${url}" controls>
                </video>
                
            </div>
            <div title="Dowload Video" class="download action-btn">Download</div>
            <div title="Delete Video" class="delete action-btn">Delete</div>
            `;

        galleryCont.appendChild(mediaElem);

        let deleteBtn = mediaElem.querySelector(".delete");
        let downloadBtn = mediaElem.querySelector(".download");

        deleteBtn.addEventListener("click", deleteListener);
        downloadBtn.addEventListener("click", downloadListener);
      });
    };

    //image retrival

    let dbTransactionImage = db.transaction("image", "readonly");
    let imageStore = dbTransactionImage.objectStore("image");
    let imageRequest = imageStore.getAll();

    imageRequest.onsuccess = (e) => {
      let imageResult = imageRequest.result;
      let galleryCont = document.querySelector(".gallery-cont");

      imageResult.forEach((image) => {
        let mediaElem = document.createElement("div");
        mediaElem.setAttribute("class", "media-cont");
        mediaElem.setAttribute("id", image.id);

        let url = image.url;

        mediaElem.innerHTML = `
            <div class="media">
                <img src="${url}"/>
            </div>
            <div title="Dowload Image" class="download action-btn">Download</div>
            <div title="Delete Image" class="delete action-btn">Delete</div>
            `;

        galleryCont.appendChild(mediaElem);

        let deleteBtn = mediaElem.querySelector(".delete");
        let downloadBtn = mediaElem.querySelector(".download");

        deleteBtn.addEventListener("click", deleteListener);
        downloadBtn.addEventListener("click", downloadListener);
      });
    };
  }
}, 100);

//remove image or video from ui and also from db.
// first check that select element is video or image element.

function deleteListener(event) {
  //db removal

  let id = event.target.parentElement.getAttribute("id");
  let type = id.slice(0, 3);

  if (type === "vid") {
    // change second parameter from "readonly" to "readwrite" because we are doing modification.

    let dbTransactionVideo = db.transaction("video", "readwrite");
    let videoStore = dbTransactionVideo.objectStore("video");
    videoStore.delete(id);
  } else if (type === "img") {
    let dbTransactionImage = db.transaction("image", "readwrite");
    let imageStore = dbTransactionImage.objectStore("image");
    imageStore.delete(id);
  }

  event.target.parentElement.remove();
}

function downloadListener(event) {
  let id = event.target.parentElement.getAttribute("id");
  let type = id.slice(0, 3);

  if (type === "vid") {
    let dbTransactionVideo = db.transaction("video", "readwrite");
    let videoStore = dbTransactionVideo.objectStore("video");
    let videoRequest = videoStore.get(id);
    videoRequest.onsuccess = (e) => {
      let videoResult = videoRequest.result;

      // console.log("videoResult is == ", videoResult);

      let videoUrl = window.URL.createObjectURL(videoResult.blobData);
      let a = document.createElement("a");
      a.href = videoUrl;
      a.download = `stream-${(new Date()).toJSON()}.mp4`;
      a.click();
    };
  } else if (type === "img") {
    let dbTransactionImage = db.transaction("image", "readwrite");
    let imageStore = dbTransactionImage.objectStore("image");
    let imageRequest = imageStore.get(id);
    imageRequest.onsuccess = (e) => {
      let imageResult = imageRequest.result;    
      let a = document.createElement("a");
      a.href = imageResult.url;
      a.download =  `image-${(new Date()).toJSON()}.jpg`;
      a.click();
    };
  }
}
