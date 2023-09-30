setTimeout(() => {
  if (db) {
    // video retrival

    //image retrival

    let dbTransactionVideo = db.transaction("video", "readonly");
    let videoStore = dbTransactionVideo.objectStore("video");
    let videoRequest = videoStore.getAll();

    videoRequest.onsuccess = (e) => {
      console.log("e is == ", e);
      let videoResult = videoRequest.result;
      console.log("video result is == ", videoResult);

      let galleryCont = document.querySelector(".gallery-cont");

      videoResult.forEach((video) => {
        let mediaElem = document.createElement("div");
        mediaElem.setAttribute("class", "media-cont");
        mediaElem.setAttribute("id", video.id);

        let url = URL.createObjectURL(video.blobData);

        mediaElem.innerHTML = `
            <div class="media">
                <video autoplay loop src="${url}"></video>
            </div>
            <div class="download action-btn">Download</div>
            <div class="delete action-btn">Delete</div>
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
      console.log("e is == ", e);
      let imageResult = imageRequest.result;
      console.log("image result is == ", imageResult);

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
            <div class="download action-btn">Download</div>
            <div class="delete action-btn">Delete</div>
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

function deleteListener(e) {
  //   console.log("id is == ", e.target.parentElement.getAttribute("id"));

  //db removal

  let id = e.target.parentElement.getAttribute("id");
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

  e.target.parentElement.remove();
}

function downloadListener(e) {
  let id = e.target.parentElement.getAttribute("id");
  let type = id.slice(0, 3);

  if (type === "vid") {
    let dbTransactionVideo = db.transaction("video", "readwrite");
    let videoStore = dbTransactionVideo.objectStore("video");
    let videoRequest = videoStore.get(id);
    videoRequest.onsuccess = (e) => {
      let videoResult = videoRequest.result;

      console.log("videoResult is == ", videoResult);

      let videoUrl = window.URL.createObjectURL(videoResult.blobData);
      let a = document.createElement("a");
      a.href = videoUrl;
      a.download = "stream.mp4";
      a.click();
    };
  } else if (type === "img") {
    let dbTransactionImage = db.transaction("image", "readwrite");
    let imageStore = dbTransactionImage.objectStore("image");
    let imageRequest = imageStore.get(id);

    console.log("image request is == ", imageRequest);
    console.log('id == ', id); 
    imageRequest.onsuccess = (e) => {
      let imageResult = imageRequest.result;    

      console.log("imageResult is == ", imageResult);

      let a = document.createElement("a");
      a.href = imageResult.url;
      a.download = "image.jpg";
      a.click();
    };
  }
}
