let blockedList = [];

// Function to save lists to Chrome storage
function saveToChromeStorage() {
    chrome.storage.local.set({
        'blockedList': blockedList
    });
}

// Function to add URL to blocked list
function addToBlockedList(url) {
    if (!blockedList.includes(url)) {
        blockedList.push(url);
        document.getElementById("blockedListInput").value = "";
        saveToChromeStorage();
        displayBlockedList();
    } else {
        console.log(`${url} is already in the blocked list.`);
    }
}

// Function to display blocked list
function displayBlockedList() {
    let container = document.getElementById("blockedListContainer");
    container.innerHTML = `<h2>Blocked List</h2>`;
    
    blockedList.forEach((url, index) => {
        container.innerHTML += `
            <div class="list-item">
                <span>${url}</span>
                <button class="remove-button" data-index="${index}" data-type="blockedList">Remove</button>
            </div>
        `;
    });
}

// Function to remove URL from blocked list
function removeFromBlockedList(index) {
    blockedList.splice(index, 1);
    saveToChromeStorage();
    displayBlockedList();
}

// Event listeners
document.getElementById("addToBlockedList").addEventListener("click", function() {
    let url = document.getElementById("blockedListInput").value;
    addToBlockedList(url);
});

document.addEventListener("click", function(event) {
    if (event.target && event.target.className == "remove-button") {
        let index = event.target.getAttribute("data-index");
        let type = event.target.getAttribute("data-type");
        
        if (type === "blockedList") {
            removeFromBlockedList(index);
        }
    }
});

// Load from storage on startup
chrome.storage.local.get(['blockedList'], function(data) {
    blockedList = data.blockedList || [];
    displayBlockedList();
});
