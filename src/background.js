// Add an event listener for when a tab updates signifying to reset the state
chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        // read changeInfo data and do something with it
        // like send the new url to contentscripts.js
        if (changeInfo.url) {
            chrome.tabs.sendMessage( tabId, {
                id: "NewVideo",
                url: changeInfo.url
            });
        }
    }
);

// Add a listener for when the storage should be updated
// Triggers: bookmark is added or deleted
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "add"){
        addBMToStorage(request.bookmark);
        return;
    }
    if (request.type === "sync"){
        syncBMsToStorage(request.bookmarks, sender.tab.url);
        return;
    }
    else if(request.type === "clear"){
        clearBMsFromStorage();
        return;
    }
    else if(request.type === "remove"){
        removeBMFromStorage(request.bookmark);
        return;
    }
    else if(request.type === "query"){
        const key = getKeyFromUrl(sender.tab.url);

        console.log(`Getting bookmarks for ${key}`);

        chrome.storage.sync.get(key, (result) => {
            sendResponse({message: "Completed Query", times: result[key] ? result[key] : []});
            console.log(result[key]);
        });
    }
    else if(request.type === "queryAll"){
        chrome.storage.sync.get(null, (result) => {
            console.log(result);
        });
    }
    else if(request.type === "clearStorage"){
        chrome.storage.sync.clear(() =>{
            console.log("cleared storage");
        });
    }
    else{
        console.log(`Unknown type: ${request.type} passed to background script`)
    }

    return true;
})

function addBMToStorage(bookmark){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const key = getKeyFromUrl(tabs[0].url);
        chrome.storage.sync.get(key, (result) => {
            let allBookmarks = result[key];

            if(!allBookmarks){
                allBookmarks = [];
            }
            allBookmarks.push(bookmark.time);

            let toSet = {};
            toSet[key] = allBookmarks;
            chrome.storage.sync.set(toSet, () => {
                console.log(`Added bookmark ${bookmark.time} to ${key}`);
                console.log(`Bookmarks: ${allBookmarks}`);
            });
        });
    });

    return true;
}

function removeBMFromStorage(bookmark){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const key = getKeyFromUrl(tabs[0].url);
        chrome.storage.sync.get(key, (result) => {
            let allBookmarks = result[key];

            if(allBookmarks == undefined){
                console.log("No Bookmarks in Storage");   
            }
            else if(allBookmarks.includes(bookmark.time)){
                const index = allBookmarks.indexOf(bookmark.time);
                allBookmarks.splice(index, 1);

                let toSet = {};
                toSet[key] = allBookmarks;
                chrome.storage.sync.set(toSet, () => {
                    console.log(`Removed bookmark ${bookmark.time} for ${key}`);
                    console.log(`Bookmarks: ${allBookmarks}`);
            });
            }
        });
    });

    return true;
}

function clearBMsFromStorage(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const key = getKeyFromUrl(tabs[0].url);
        chrome.storage.sync.remove(key, (result) => {
                console.log(`Cleared bookmarks`);
        });
    });

    return true;
}

function syncBMsToStorage(bookmarks, url){
        const bookmarkTimes = bookmarks.map(x => x.time);
        const key = getKeyFromUrl(url);
        let toSet = {};
        toSet[key] = bookmarkTimes;
        chrome.storage.sync.set(toSet, () => {
            console.log(`Synced bookmarks ${bookmarkTimes} to ${key}`);
            console.log(`Bookmarks: ${bookmarkTimes}`);
        });
}

function getKeyFromUrl(url){
    return url.substring(32);
}