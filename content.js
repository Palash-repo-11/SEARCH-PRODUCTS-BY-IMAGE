console.log("i am here");
let imageURL;

const getCurrentURL = () => {
  return window.location.href;
}



const getImageURL = () => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const images = document.querySelectorAll("img");
     
      images.forEach(item => {
        const height = item.clientHeight;
       
        if (height > 100) {
          const button = document.createElement('button');
          button.setAttribute('class', "clickingBtn");
          // button.innerText = 'Click me';
          button.style.position = 'absolute';
          button.style.top = '0';
          button.style.left = '0';
          button.style.zIndex='999';
          button.style.cursor='pointer'
          button.style.border="none"
          const img = document.createElement('img');
          img.src = chrome.runtime.getURL('Icons/Icon32.png'); 
          img.style.width = '30px'; 
          img.style.height = '30px'; 
          img.style.marginRight = '5px'; 
          
          // Append the image to the button
          button.appendChild(img);



          button.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            // const imageURL = item.src;
            const imageURL = images.length ? item.src : null;
            resolve(imageURL);

            console.log('Button clicked');
            chrome.runtime.sendMessage({message:'butten-append', imageURL})
            main()
          });
          

          item.parentNode.insertBefore(button, item);
        }
      });

      console.log(imageURL)
      clearInterval(interval);
    }, 1000);
  });
}

async function getImageDimensions(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = url;
  });
}

const FetchApi = async (data) => {

  let DataOfProduct = [];
  
  try {
    const parser = new DOMParser();
    let dom = parser.parseFromString(data, "text/html");

    const mainDiv = dom.querySelectorAll(".G19kAf.ENn9pd");

    mainDiv.forEach((data) => {
      console.log(data)
      let redirectUrl = data.querySelector("a:first-child");
      let landingPageUrl = redirectUrl.href;

      if (redirectUrl) {
        let ksQYvbDiv = redirectUrl.querySelector(".ksQYvb");

        if (ksQYvbDiv) {
          console.log(ksQYvbDiv)
          let jPzKFDiv = ksQYvbDiv.querySelector(".jPzKF.lE2DFd.OFiffe");
          // console.log(jPzKFDiv)
          let sFT7ofDiv = ksQYvbDiv.querySelector(".sFT7of.hckFVe.dliAB");


          if (jPzKFDiv && sFT7ofDiv) {
            let obj = {
              brandName: "",
              brandLogo: "",
              productImage: "",
              productDescription: "",
              landingPageUrl: ""
            };

            obj.productImage = jPzKFDiv.querySelector(".Me0cf img").getAttribute("data-src") ?? jPzKFDiv.querySelector(".Me0cf img").getAttribute("src");
            obj.brandLogo = sFT7ofDiv.querySelector(".PlAMyb img").getAttribute("data-src") ?? sFT7ofDiv.querySelector(".PlAMyb img").getAttribute("src");
            obj.brandName = sFT7ofDiv.querySelector(".PlAMyb .OwskJc").innerText;

            let prdDec = sFT7ofDiv.querySelector(".UAiK1e");
            if (prdDec) {
              let description = prdDec.innerHTML;
              obj.productDescription = description.length > 50 ? description.substring(0, 80) + "..." : description;
            }

            obj.landingPageUrl = landingPageUrl;
            DataOfProduct.push(obj);
          }
        }
      }
    });

    //createSidePanel(DataOfProduct);
    chrome.runtime.sendMessage({ message: "DataFetched", data: DataOfProduct }); // Send message to background script

    return dom;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const main = async () => {
  console.log("main started")
  const url = await getImageURL()

  const dimensions = await getImageDimensions(url)
  console.log(dimensions)

  chrome.runtime.sendMessage({
    message: "imageData",
    query: url,
    dimensions,
  })

}

// main()

let isEventListenerAdded = false;

chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {

  console.log("response",response)
  const { message } = response

  if (message === "scrap-data") {
    FetchApi(response.data);
  } else if (message === "fetch-image-again") {
    main();
  } else if (message === "Error") {
    console.error("Error:", message.error);
  }else if(message === "find-image") 
  {
    imageURL=response.imgSrc ??response.searchText
    // imageURL=response.searchText
    console.log(imageURL)
    const dimensions =  getImageDimensions(imageURL)
    console.log(dimensions)
  
    chrome.runtime.sendMessage({
      message: "imageData",
      query: imageURL,
      dimensions,
    })
  }

  // else if (message === "find-image" && !isEventListenerAdded) {
  //   console.log("image is selected");
    
  //   document.body.addEventListener('click', async function clickHandler(e) {
  //     chrome.runtime.sendMessage({message:"openSidepanel"})
  //     e.stopPropagation();
  //     e.preventDefault();

  //     if (e.target.tagName === 'IMG') {
  //       let src = e.target.src;
  //       if (src) {
  //         console.log(src);
  //         const dimensions = await getImageDimensions(src);
  //         console.log(dimensions);
          
  //         chrome.runtime.sendMessage({
  //           message: "imageData",
  //           query: src,
  //           dimensions,
  //         });

  //         // Remove the event listener after one click
  //         document.body.removeEventListener('click', clickHandler);
  //         isEventListenerAdded = false;
  //       }
  //     } else {
  //       // If the user clicks outside the image, remove the event listener
  //       document.body.removeEventListener('click', clickHandler);
  //       isEventListenerAdded = false;
  //     }
  //   });

  //   isEventListenerAdded = true;
  // }
});


function getFromChromeStorage(callback) {
  chrome.storage.local.get(['blockedList', 'whiteList'], function(result) {
      callback(result);
  });
}

getFromChromeStorage(function(data) {
  let blockedList = data.blockedList || [];
  let whiteList = data.whiteList || [];

  if (blockedList.includes(getCurrentURL())) {
    delete window.main;
    let mainButton=document.querySelector("clickingBtn")
    if(mainButton){
     mainButton.remove()
    }

    console.log('URL is blocked:', getCurrentURL());
} else {
    console.log('BlockedList:', blockedList);
    console.log('WhiteList:', whiteList);

    if (blockedList !== getCurrentURL()) {
        main();
    }
}

  console.log('BlockedList:', blockedList);
  console.log('WhiteList:', whiteList);
});






