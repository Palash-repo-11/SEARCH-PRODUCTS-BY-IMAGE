
let id = chrome.runtime.id

chrome.runtime.onMessage.addListener(async function (response, sender, sendResponse) {

    if (response.message === "imageData") {
        const { query, dimensions } = response;
        const timestamp = Date.now().toString();

        const imageBlob = await getImageAsBlob(query);

        const formData = new FormData();

        formData.append('encoded_image', imageBlob);
        formData.append('processed_image_dimensions', `${dimensions.width},${dimensions.height}`);

        sendFormData(formData, dimensions, timestamp);
    }
    else if(response.message === "Selected-image"){
        console.log(response.searchText)
        const {imgSrc,searchText}=response
        console.log(imgSrc)
        console.log(searchText)
        
            // getImageAsBlob(imgSrc)
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { message:"find-image",searchText,imgSrc});
            });

        
        console.log("image is selected")
      }
      else if(response.message==="openSidepanel")
      {
        chrome.windows.getCurrent(function (window) {
            var windowId = window.id;
            console.log("Window ID:", windowId);
    
            // chrome.tabs.sendMessage(tab.id, { message: "fetch-image-again" });
    
            chrome.sidePanel.open({ windowId: windowId });
        });
      }
      else if(response.message==="butten-append")
      {  
        let {imageURL}=response
        console.log(imageURL)
        chrome.windows.getCurrent(function (window) {
        var windowId = window.id;
        console.log("Window ID:", windowId);

         //chrome.tabs.sendMessage(tab.id, { message: "fetch-image-again" });
         
         chrome.sidePanel.open({ windowId: windowId });
         chrome.tabs.sendMessage(tab.id, { message: "clicker-image-pick" ,imageURL})
    });

        // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        //     chrome.tabs.sendMessage(tabs[0].id, { message:"btnClicked"});
        // });
       
      }

});

function sendFormData(formData, dimensions, timestamp) {
    fetch(`https://lens.google.com/v3/upload?hl=en-IN&re=df&st=${timestamp}&vpw=1920&vph=479&ep=gisbubb`, {
        mode: "no-cors",
        method: 'POST',
        body: formData,
        credentials: "include",

    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log(data)
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { message:"scrap-data", data  });
            });
        })


        .catch(error => {
            console.error('There was a problem with the fetch operation:', error.message);
        });


}

async function getImageAsBlob(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
}




chrome.action.onClicked.addListener((tab) => {
    chrome.windows.getCurrent(function (window) {
        var windowId = window.id;
        console.log("Window ID:", windowId);

        chrome.tabs.sendMessage(tab.id, { message: "fetch-image-again" });

        chrome.sidePanel.open({ windowId: windowId });
    });

});

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
     notify("Extension has been installed successfully.It will work on particular product.")
    }
  });
  
function notify(msg) {
    chrome.notifications.create({
      type: "basic",
      iconUrl:"Icons/Icon 64.png",
      title: "Search Product By Image",
      message: msg,
    });
  }