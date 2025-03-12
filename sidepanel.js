
// const button = document.createElement('button');
// document.body.appendChild(button)
// // Set button text
// button.textContent = 'Select The Image!';

// // Style the button using JavaScript
// button.style.backgroundColor = '#007BFF';
// button.style.color = 'white';
// button.style.padding = '15px 32px';
// button.style.textAlign = 'center';
// button.style.fontSize = '16px';
// button.style.border = 'none';
// button.style.borderRadius = '8px';
// button.style.cursor = 'pointer';
// button.style.transition = 'background-color 0.3s ease';






// // Add click event to button
// button.addEventListener('click', ()=>{
//   chrome.runtime.sendMessage({message:"select the image"})
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { data ,imageURL} = message;
  console.log(imageURL)
  const imageDisplay = document.getElementById('imageDisplay');
  console.log("imageDiv",imageDisplay)

  if (imageURL) {
    imageDisplay.style.display = 'block';
    imageDisplay.src = imageURL;
  }

  console.log("data came?", data);
  
  // Remove existing table if it exists
  const existingTable = document.querySelector('.custom-table');
  if (existingTable) {
    existingTable.remove();
  }

  const loadingDiv = document.querySelector("#loading-div")

  if (loadingDiv) {
  
    loadingDiv.remove()
  }

  const baseHTML = document.querySelector("#base-html")
  if (baseHTML) {
    baseHTML.remove()
  }

  if (!data) {
    const loadingDiv = document.createElement("div");
    loadingDiv.setAttribute("id", "loading-div");
    loadingDiv.textContent = "Loading...";
  
    // Apply styles for loading animation
    loadingDiv.style.backgroundColor = "#f0f0f0";
    loadingDiv.style.color = "#333";
    loadingDiv.style.padding = "20px";
    loadingDiv.style.borderRadius = "5px";
    loadingDiv.style.position = "fixed";
    loadingDiv.style.top = "50%";
    loadingDiv.style.left = "50%";
    loadingDiv.style.transform = "translate(-50%, -50%)";
    loadingDiv.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)";
  
    // Add keyframe animation for loading animation
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      #loading-div::after {
        content: '';
        display: block;
        width: 40px;
        height: 40px;
        border: 4px solid #ccc;
        border-top-color: #333;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 10px auto;
      }
    `;
    document.head.appendChild(styleElement);
  
    document.body.appendChild(loadingDiv);
  }
  

  const table = createTable(data);
  document.body.appendChild(table);
  setTimeout(() => {
    const existingImage = document.getElementById('imageDisplay');
    if (existingImage) {

      // existingImage.src = message.imageURL // Reset image source
      // existingImage.style.display = 'block';
      document.getElementById('selectImageText').innerText = 'Click to select an image';  // Change text back to default
    }
  }, 1000);
});

function createTable(data) {
  // Create table element
  const table = document.createElement('table');
  table.classList.add('custom-table');

  // Create table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  // Headers
  const headers = ['Brand', 'Product Image', 'Details'];

  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');

  console.log("data here", data)
  // Table rows
  data.forEach(product => {
    const row = document.createElement('tr');
    row.style.margin="20px"

    // Brand (Name and Logo)
    const brandCell = document.createElement('td');
    brandCell.style.display = 'flex';  
    brandCell.style.alignItems = 'center';  
    const brandLogoImg = document.createElement('img');
    brandLogoImg.src = product.brandLogo;
    brandLogoImg.alt = `${product.brandName} Logo`;
    brandLogoImg.style.maxWidth = '50px';
    brandLogoImg.style.maxHeight = '50px';
    brandCell.appendChild(brandLogoImg);
    const brandNameSpan = document.createElement('span');
    brandNameSpan.textContent = product.brandName;
    brandNameSpan.style.marginLeft = '10px';  // Spacing between logo and text
    brandCell.appendChild(brandNameSpan);
    row.appendChild(brandCell);

    // Product Image
    const productImageCell = document.createElement('td');
    const productImageImg = document.createElement('img');
    productImageImg.src = product.productImage;
    productImageImg.alt = product.productDescription;
    productImageImg.style.maxWidth = '100px';
    productImageImg.style.maxHeight = '100px';
    productImageCell.appendChild(productImageImg);
    row.appendChild(productImageCell);

    // Product Description and Landing Page
    const detailsCell = document.createElement('td');
    const productDescription = document.createElement('p');
    productDescription.textContent = product.productDescription;
    productDescription.style.color = 'blue'
   // productDescription.style.textDecoration = 'underline'

    const landingPageLink = document.createElement('a');
    landingPageLink.href = product.landingPageUrl;
    landingPageLink.textContent =  product.productDescription;
    landingPageLink.target = '_blank';
    landingPageLink.classList.add('landing-page-link'); 

    // detailsCell.appendChild(productDescription);
    detailsCell.appendChild(document.createElement('br')); 
    detailsCell.appendChild(landingPageLink);

    row.appendChild(detailsCell);

    tbody.appendChild(row);
  });

  table.appendChild(tbody);

  return table;
}





const baseShow=()=>{
  const mainDiv = document.createElement('div');
    mainDiv.setAttribute('id',"myDiv")
    mainDiv.style.backgroundColor = "#f0f0f0";
    mainDiv.style.height='280px'
    mainDiv.style.width='340px'
    mainDiv.style.color = "#333";
    mainDiv.style.border = "1px solid #ccc";
    mainDiv.style.textAlign='center'
    mainDiv.style.borderRadius='10px'



  // Create first div
  const firstDiv = document.createElement('div');
  firstDiv.className = 'firstDiv';
  firstDiv.style.paddingBottom='30px'
  firstDiv.style.objectFit='cover'
  firstDiv.style.overflow='hidden'
  firstDiv.style.maxWidth='250px'
  firstDiv.style.maxHeight='210px'
  // Create paragraph for image selection
  const selectImageText = document.createElement('p');
  selectImageText.id = 'selectImageText';
  selectImageText.style.cursor='pointer'
  selectImageText.style.color='blue'
  selectImageText.innerText = 'Click to select an image';
  selectImageText.style.textDecoration="underline"
  selectImageText.style.fontSize='15px'
  selectImageText.addEventListener('click', selectImage);

  // Create input for file selection
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.id = 'fileInput';
  fileInput.style.display = 'none';
  fileInput.addEventListener('change', displayImage);

  // Create image display
  const imageDisplay = document.createElement('img');
  imageDisplay.id = 'imageDisplay';
  imageDisplay.src = '#';
  imageDisplay.alt = 'Selected Image';
  imageDisplay.style.maxWidth = '250px';
  imageDisplay.style.maxHeight='175px'
  imageDisplay.style.padding="0px 0px 0px 45px";
  imageDisplay.style.display = 'none';
  imageDisplay.style.objectFit='cover'
  imageDisplay.style.overflow='hidden'

  // Append elements to firstDiv
  firstDiv.appendChild(selectImageText);
  firstDiv.appendChild(fileInput);
  firstDiv.appendChild(imageDisplay);

  // Create second div
  const secondDiv = document.createElement('div');
  secondDiv.className = 'secondDiv';

  // Create div for search input and button
  const searchDiv = document.createElement('div');
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'searchInput';
  searchInput.placeholder = 'Enter Url Here';
  searchInput.style.padding='5px 10px'
  searchInput.style.borderRadius='5px'


  const searchButton = document.createElement('button');
  searchButton.id = 'searchButton';
  searchButton.innerText = 'Search';
  searchButton.style.backgroundColor = '#007BFF';
  searchButton.style.color = 'white';
  searchButton.style.padding = '5px 10px';
  searchButton.style.textAlign = 'center';
  searchButton.style.fontSize = '16px';
  searchButton.style.border = 'none';
  searchButton.style.borderRadius = '8px';
  searchButton.style.cursor = 'pointer';
  searchButton.style.transition = 'background-color 0.3s ease';
  searchButton.addEventListener('click', function() {
      const searchText = searchInput.value;
      console.log(searchText)
      document.getElementById('imageDisplay').src=searchText
      document.getElementById('imageDisplay').style.display = 'block';

      chrome.runtime.sendMessage({message:"Selected-image" ,searchText})
      searchInput.value = '';
  });

  searchDiv.appendChild(searchInput);
  searchDiv.appendChild(searchButton);

  secondDiv.appendChild(searchDiv);

  mainDiv.appendChild(firstDiv);
  mainDiv.appendChild(secondDiv);

  document.body.appendChild(mainDiv);

  function selectImage() {
      document.getElementById('fileInput').click();
  }

  // Function to display the selected image
  function displayImage(event) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
              const imgSrc = e.target.result;
              console.log(imgSrc)
              chrome.runtime.sendMessage({message:"Selected-image" ,imgSrc})
              document.getElementById('imageDisplay').src = imgSrc;

              document.getElementById('imageDisplay').style.display = 'block';
              document.getElementById('selectImageText').innerText = 'Image selected';  // Change text after image selection
          }
          reader.readAsDataURL(file);
      }
  }

}
baseShow()

const tableStyle = `
.table-container {
  float: right;
  width: 50%;
}
  .custom-table {
    width: 100%;
    // border-collapse: collapse;
    // margin: 20px auto;
  }
  .custom-table thead{
     border-radius:20px;
    box-shadow: 5px 5px 5px lightblue inset;
  }

  .custom-table th, .custom-table td {
    padding: 20px;
    text-align: left;
  }

  .custom-table th {
    // background-color: #f2f2f2;
    padding-bottom:10px;
  }

   .landing-page-link {
    font-size: 16px;
    text-decoration:none;
  }

  .custom-table tr {
    // border: 1px solid black;
    border-radius:20px;
    box-shadow: 5px 5px 5px lightblue inset;

  }

  .custom-table tr:last-child {
    border-bottom: none;
  }

  .custom-table tr:first-child {
    border-top: none;
  }
`;

const styleElement = document.createElement('style');
styleElement.textContent = tableStyle;

document.body.appendChild(styleElement);
