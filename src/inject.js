var state = {
	video: undefined,
	isFullScreen: false,
	bookmarkBtnObj: undefined,
	bookmarkPopupObj: undefined,
	bookmarks: [], // Array of {time: number, name: string, indicator: bookmark icon}
	flags: { //Flags that the user sets for certain features
		enabledBookmarkHistory: true,
		enabledKeyShortcuts: true,
		enabledProgressBarIndicators: true
	}
}

// What to do before the page loads
function beforeFirstLoad(){
}

// What to do once the page loads
function afterFirstLoad(){
	console.log("First Video is Loaded");

	// Set the video state to the new video that was just loaded
	state.video = document.querySelector("video.video-stream");

	// Add bookmark menu button to youtube controls
	createBookmarkMenuBtn();

	// Create the popup menu for the bookmark button
	createBMPopupMenu();

	// create and add previous bookmarks if user has any from their history
	createSavedBookmarks();
	addSavedBookmarks();

	// TODO: Add toast message for when the user adds a bookmark

	// Update styles when full screen is entered
	document.addEventListener("fullscreenchange", updateStyles);
	
	// Add keyboard event handlers
	document.addEventListener("keydown", keyboardEvents);
}

function afterLoads(){
	console.log("Next Video is Loaded");

	// Clear the progress bar indicators
	clearProgBarIndicators();

	// Set the video state to the new video that was just loaded
	state.video = document.querySelector("video.video-stream");

	// Load saved bookmarks from chrome storage and draw on screen
	state.bookmarks = loadSavedBookmarks();

	// The bookmark button andpopup menu is already drawn and hooked up
	// Keyboard event handlers are already added as well
	// Fullscreen redraw handler is hooked up as well
	// Toast popup is already hooked up
}


/* Styling for popup toasts
visible
style: outline: none; position: fixed; box-sizing: border-box; left: 0px; top: 938px; max-width: 288px; max-height: 48px; z-index: 2202;
class: style-scope yt-notification-action-renderer paper-toast-open

invisble:
style: outline: none; position: fixed; box-sizing: border-box; left: 0px; top: 938px; max-width: 288px; max-height: 48px; display: none;
class: style-scope yt-notification-action-renderer
*/

//////////////////////////////////////
//			UPDATE FUNCITONS		//
//////////////////////////////////////
function updateStyles(){
	state.isFullScreen = !state.isFullScreen;
	console.log(state.isFullScreen)
	updateBookmarkMenubtn();
	updateBookmarkPopup();
	updateIndicators();
}


//////////////////////////////////////
//	BOOKMARK PROGRESS BAR INDICATOR	//
//////////////////////////////////////
function loadSavedBookmarks(){
	createSavedBookmarks();
	addSavedBookmarks();
	return [];
}

function createSavedBookmarks(){
	// TODO: load previous bookmarks in from chrome storage
}

function addSavedBookmarks(){
	// TODO: render the previous bookmarks to the screen
}

function createIndicator(time){
	const progList = document.querySelector("div.ytp-progress-list");
	const progBar = document.querySelector("div.ytp-scrubber-container");
	progBar.style.pointerEvents = "none";

	const size = state.isFullScreen ? 8 : 5;

	var indicatorDiv = document.createElement("div");
	indicatorDiv.setAttribute("class", "ytp-play-progress");
	indicatorDiv.setAttribute("id", `bm-${time}`)
	indicatorDiv.style.background = "#3369e8";
	indicatorDiv.style.height = `${size}px`;
	indicatorDiv.style.left = `${(time / state.video.duration) * 100}%`;
	indicatorDiv.style.position = "absolute";
	indicatorDiv.style.width = `${size}px`;
	indicatorDiv.style.zIndex = "43";	

	var indicatorButton = document.createElement("div");
	indicatorButton.setAttribute("class", "ytp-play-progress");
	indicatorButton.style.background = "#3369e8";
	indicatorButton.style.border = "none";
	indicatorButton.style.borderRadius = "50%";
	indicatorButton.style.display = "none";
	indicatorButton.style.height = `100%`;
	indicatorButton.style.position = "absolute";
	indicatorButton.style.transform = "translateX(-75%) translateY(-75%) scale(2.5)";
	indicatorButton.style.width = `100%`;
	indicatorButton.style.zIndex = "43";
	indicatorButton.style.pointerEvents = "auto";

	indicatorDiv.onmouseover = function() {
		this.children[0].style.display = "";
	}

	indicatorDiv.onmouseout = function() {
		this.children[0].style.display = "none";
	}

	indicatorButton.onclick = function(){
		state.video.currentTime = time;
		console.log("Skipped to bookmark at:", state.video.currentTime);
	}

 	indicatorDiv.appendChild(indicatorButton);
	progList.insertBefore(indicatorDiv, progList.children[0]);

	return indicatorDiv;
}

function updateIndicators(){
	if(state.isFullScreen){
		state.bookmarks.forEach(bm => {
			bm.indicator.style.height = "8px";
			bm.indicator.style.width = "8px";
		});
	}
	else{
		state.bookmarks.forEach(bm => {
			bm.indicator.style.height = "5px";
			bm.indicator.style.width = "5px";
		});
	}
}

function clearProgBarIndicators(){
	state.bookmarks.forEach(bookmark => {
		bookmark.indicator.remove();
	});
}


//////////////////////////////////////
//		BOOKMARK MENU BUTTON		//
//////////////////////////////////////
function createBookmarkMenuBtn(){
	var ns = 'http://www.w3.org/2000/svg';

	var bookmarkMenuBtn = document.createElement("button");
	bookmarkMenuBtn.setAttribute("class", "ytp-button");
	bookmarkMenuBtn.setAttribute("aria-title", "bookmark")

	var use = document.createElementNS(ns, "use")
	use.className = "ytp-svg-shadow"

	var bookmarkSvg = document.createElementNS(ns, "svg");
	bookmarkSvg.setAttributeNS(null, 'width', '100%');
	bookmarkSvg.setAttributeNS(null, 'height', '100%');
	bookmarkSvg.setAttributeNS(null, "version", "1.1")
	bookmarkSvg.setAttributeNS(null, "viewBox", "0 0 36 36")

	var rect1 = document.createElementNS(ns, "rect")
	rect1.setAttributeNS(null, "stroke", "#ffffff")
	rect1.setAttributeNS(null, "stroke-width", "2")
	rect1.setAttributeNS(null, "id", "svg_2");
	rect1.setAttributeNS(null, "height", "4.5")
	rect1.setAttributeNS(null, "width", "18.5")
	rect1.setAttributeNS(null, "y","9")
	rect1.setAttributeNS(null, "x", "8.5")
	rect1.setAttributeNS(null, "stroke-linecap", "null")
	rect1.setAttributeNS(null, "stroke-linejoin", "null")
	rect1.setAttributeNS(null, "stroke-dasharray","null")
	rect1.setAttributeNS(null, "fill-opacity", "0")
	rect1.setAttributeNS(null, "visibility", "visible");

	var rect2 = document.createElementNS(ns, "rect")
	rect2.setAttributeNS(null, "stroke", "#ffffff")
	rect2.setAttributeNS(null, "stroke-width", "2")
	rect2.setAttributeNS(null, "id", "svg_3");
	rect2.setAttributeNS(null, "height", "11.5")
	rect2.setAttributeNS(null, "width", "14.5")
	rect2.setAttributeNS(null, "y","14.5")
	rect2.setAttributeNS(null, "x", "10.5")
	rect2.setAttributeNS(null, "stroke-linecap", "null")
	rect2.setAttributeNS(null, "stroke-linejoin", "null")
	rect2.setAttributeNS(null, "stroke-dasharray","null")
	rect2.setAttributeNS(null, "fill-opacity", "0")
	rect2.setAttributeNS(null, "visibility", "visible");

	var rect3 = document.createElementNS(ns, "rect")
	rect3.setAttributeNS(null, "stroke", "#ffffff")
	rect3.setAttributeNS(null, "id", "svg_4");
	rect3.setAttributeNS(null, "height", "1")
	rect3.setAttributeNS(null, "width", "6.5")
	rect3.setAttributeNS(null, "y","17.5")
	rect3.setAttributeNS(null, "x", "14.5")
	rect3.setAttributeNS(null, "stroke-linecap", "null")
	rect3.setAttributeNS(null, "stroke-linejoin", "null")
	rect3.setAttributeNS(null, "stroke-dasharray","null")
	rect3.setAttributeNS(null, "fill", "#ffffff")
	rect3.setAttributeNS(null, "visibility", "visible");

	bookmarkSvg.appendChild(use);
	bookmarkSvg.appendChild(rect1);
	bookmarkSvg.appendChild(rect2);
	bookmarkSvg.appendChild(rect3)

	bookmarkMenuBtn.appendChild(bookmarkSvg);

	state.bookmarkBtnObj = {
		use: use,
		rect1: rect1,
		rect2: rect2,
		rect3: rect3,
		bookmarkSvg: bookmarkSvg,
		bookmarkBtn: bookmarkMenuBtn,
		open: false
	};

	// Add open and close on click listeners
	bookmarkMenuBtn.onclick = onClickBookmarkMenuBtn;
	document.addEventListener("click", offClickBookmarkBtn);

	// Add the item to the screen
	const controls = document.querySelector("div.ytp-left-controls");
	controls.insertBefore(state.bookmarkBtnObj.bookmarkBtn, controls.children[3]);
}

function onClickBookmarkMenuBtn(){
	if(state.bookmarkBtnObj.open){
		state.bookmarkPopupObj.popup.style.display = "none";
		state.bookmarkBtnObj.rect1.setAttributeNS(null, "visibility", "visible");
		state.bookmarkBtnObj.open = false;
		
	}
	else{
		state.bookmarkPopupObj.popup.style.display = "";
		state.bookmarkBtnObj.rect1.setAttributeNS(null, "visibility", "hidden");
		state.bookmarkBtnObj.open = true;
	}
}

function offClickBookmarkBtn(event){
	if (event.target !== state.bookmarkBtnObj.bookmarkBtn){
		state.bookmarkPopupObj.popup.style.display = "none";
		state.bookmarkBtnObj.rect1.setAttributeNS(null, "visibility", "visible");
		state.bookmarkBtnObj.open = false;
	}
}

function updateBookmarkMenubtn(isFullScreen){
	return;
}


//////////////////////////////////////
//		BOOKMARK POPUP MENU			//
//////////////////////////////////////
function createBMPopupMenu(){
	// Add styles to bookmark box
	var popup = document.createElement("div");
	popup.setAttribute("class", "ytp-popup ytp-settings-menu");
	popup.setAttribute("data-layer", "6");
	popup.setAttribute("id", "ytp-id-20");
	popup.style.width = "256px";
	popup.style.height = "177px";
	popup.style.display = "none";

	const cls = document.querySelector(".ytp-settings-menu")
	popup.style.left = getComputedStyle(cls).right;
	popup.style.right = "auto";

	var panel = document.createElement("div");
	panel.setAttribute("data-layer", "6");
	panel.className = "ytp-panel";
	panel.style.minWidth = "250px";
	panel.style.width = "256px";
	panel.style.height = "177px";

	var panelMenu = document.createElement("div");
	panelMenu.setAttribute("data-layer", "6");
	panelMenu.className = "ytp-panel-menu";
	panelMenu.style.height = "177px";

	// Create the buttons to be added to the panel menu
	const bookmarkListBtn = createBMListBtn();
	const addBookmarkBtn = createAddBMBtn();
	const editBookmarksBtn = createEditBMBtn();
	const clearBookmarksBtn = createClearBMBtn();

	// Add listeners for each button click
	//bookmarkListBtn.addEventListener("click")
	addBookmarkBtn.addEventListener("click", addBookmark)
	//editBookmarksBtn.addEventListener("click")
	clearBookmarksBtn.addEventListener("click", clearBookmarks)

	// Get the parent of where we are adding the popup
	const videoDiv = document.querySelector("div.ytp-transparent");

	// Add the buttons to the panel menu
	panelMenu.appendChild(bookmarkListBtn);
	panelMenu.appendChild(addBookmarkBtn);
	panelMenu.appendChild(editBookmarksBtn);
	panelMenu.appendChild(clearBookmarksBtn);

	panel.appendChild(panelMenu);

	popup.appendChild(panel)

	videoDiv.appendChild(popup);

	state.bookmarkPopupObj = {
		popup: popup,
		panel: panel,
		panelMenu: panelMenu,
		bookmarkListBtn: bookmarkListBtn,
		addBookmarkBtn: addBookmarkBtn,
		editBookmarksBtn: editBookmarksBtn,
		clearBookmarksBtn: clearBookmarksBtn
	};
}

// Button for list of bookmarks
function createBMListBtn(){
	var menuItem = document.createElement("div");
	menuItem.setAttribute("aria-haspopup", "false");
	menuItem.setAttribute("role", "menuitem");
	menuItem.setAttribute("tabindex", "0");
	menuItem.className = "ytp-menuitem";
	menuItem.setAttribute("aria-haspopup", "true");

	var menuSpacer = document.createElement("div");
	menuSpacer.className = "ytp-menuitem-icon";

	var itemText = document.createElement("div");
	itemText.className = "ytp-menuitem-label";
	itemText.textContent = "Bookmark List";

	menuItem.appendChild(menuSpacer);
	menuItem.appendChild(itemText);

	return menuItem;
}

// Create a list of bookmarks
function createBMList(){

}

// Button to add a bookmark
function createAddBMBtn(){
	var menuItem = document.createElement("div");
	menuItem.setAttribute("aria-haspopup", "false");
	menuItem.setAttribute("role", "menuitem");
	menuItem.setAttribute("tabindex", "0");
	menuItem.className = "ytp-menuitem";

	var menuSpacer = document.createElement("div");
	menuSpacer.className = "ytp-menuitem-icon";

	var itemText = document.createElement("div");
	itemText.className = "ytp-menuitem-label";
	itemText.textContent = "Add Bookmark";

	menuItem.appendChild(menuSpacer);
	menuItem.appendChild(itemText);

	menuItem.addEventListener("click", addBookmark);

	return menuItem;
}

// Button to edit bookmarks
function createEditBMBtn(){
	var menuItem = document.createElement("div");
	menuItem.setAttribute("aria-haspopup", "false");
	menuItem.setAttribute("role", "menuitem");
	menuItem.setAttribute("tabindex", "0");
	menuItem.className = "ytp-menuitem";
	menuItem.setAttribute("aria-haspopup", "true");

	var menuSpacer = document.createElement("div");
	menuSpacer.className = "ytp-menuitem-icon";

	var itemText = document.createElement("div");
	itemText.className = "ytp-menuitem-label";
	itemText.textContent = "Edit Bookmarks";
	
	menuItem.appendChild(menuSpacer);
	menuItem.appendChild(itemText);

	return menuItem;
}

// Button to edit bookmarks
function createClearBMBtn(){
	var menuItem = document.createElement("div");
	menuItem.setAttribute("aria-haspopup", "false");
	menuItem.setAttribute("role", "menuitem");
	menuItem.setAttribute("tabindex", "0");
	menuItem.className = "ytp-menuitem";
	menuItem.setAttribute("aria-haspopup", "true");

	var menuSpacer = document.createElement("div");
	menuSpacer.className = "ytp-menuitem-icon";

	var itemText = document.createElement("div");
	itemText.className = "ytp-menuitem-label";
	itemText.textContent = "Clear Bookmarks";
	
	menuItem.appendChild(menuSpacer);
	menuItem.appendChild(itemText);

	return menuItem;
}

// Goto a specific bookmark after clicking an item
function bmGoto(){

}

function updateBookmarkPopup(){
	if(state.isFullScreen){
		state.bookmarkPopupObj.popup.style.left = "24px";
		state.bookmarkPopupObj.popup.style.width = "361px";
		state.bookmarkPopupObj.popup.style.height = "212px";

		state.bookmarkPopupObj.panel.style.width = "361px";
		state.bookmarkPopupObj.panel.style.height = "212px";
	}
	else{
		state.bookmarkPopupObj.popup.style.left = "12px";
		state.bookmarkPopupObj.popup.style.width = "256px";
		state.bookmarkPopupObj.popup.style.height = "177px";

		state.bookmarkPopupObj.panel.style.width = "256px";
		state.bookmarkPopupObj.panel.style.height = "177px";
	}
}


//////////////////////////////////////
//			KEYBOARD SHORTCUTS		//
//////////////////////////////////////
function keyboardEvents(event){
	const keyName = event.key;

	if (keyName === 'Control' || event.ctrlKey) {
		// do not alert when only Control key is pressed.
		return;
	}

	switch(keyName){
		case ';':
			skipBackwardKey();
			break;
		case '\'':
			skipForwardKey();
			break;
		case 'b':
			addBookmarkKey();
			break;
		case 'd':
			remBookmarkKey();
			break;
		default:
			return;
	}
}

function findIndex(forward){
	// Allow for proper skipping forward and backwards multiple times
	var TOLERANCE = 4;
	if(forward)
		TOLERANCE *= -1;

	// Return index of nearest time stamp bookmark (always rounds up)
	const time = parseInt(state.video.currentTime) - TOLERANCE;

	for(i = 0; i < state.bookmarks.length; i++){
		if(time <= state.bookmarks[i].time){
			if (i === 0)
				return state.bookmarks.length - 1;
			return i - 1;
		}	
	}

	// If current time stamp is less than all bookmarks, return the last bookmark index for circular pathing
	return state.bookmarks.length - 1;
}

function skipForwardKey(){
	var index = findIndex(true)

	if(state.bookmarks.length === 0){
		console.log("No Bookmarks in List");
		return;
	}

	index++;
	if(index === state.bookmarks.length)
		index = 0;

	console.log(`Skipping to next bookmark at ${index}`);
	state.video.currentTime = state.bookmarks[index].time;
}

function skipBackwardKey(){
	const index = findIndex(false)

	if(state.bookmarks.length === 0){
		console.log("No Bookmarks in List");
		return;
	}

	console.log(`Going back to previous bookmark at ${index}`);
	state.video.currentTime = state.bookmarks[index].time;
}

function remBookmarkKey(){
	remBookmark()
}

function addBookmarkKey(){
	addBookmark()
}


//////////////////////////////////////
//			BOOKMARK FUNCTIONS		//
//////////////////////////////////////
function addBookmark(){
	const time = parseInt(state.video.currentTime);

	// The amount of variability between bookmarks
	// Prevents duplicates
	const TOLERANCE = 10;

	for(i = 0; i < state.bookmarks.length; i++){
		if(state.bookmarks[i].time - TOLERANCE <= time && time <= state.bookmarks[i].time + TOLERANCE){
			console.log("Bookmark already added")
			return
		}
		if(time < state.bookmarks[i].time){
			const toInsert = { time: time, name: "defaultName", indicator: createIndicator(time) };
			state.bookmarks.splice(i, 0, toInsert);
			console.log("added bookmark");
			console.log(state.bookmarks);
			return;
		}
	}

	const toInsert = { time: time, name: "defaultName", indicator: createIndicator(time) };
	state.bookmarks.splice(state.bookmarks.length, 0, toInsert);
	console.log("splicing added bookmark")
	console.log(state.bookmarks);
}

function clearBookmarks(){
	for(i = 0; i < state.bookmarks.length; i++){
		console.log("Deleted Bookmark");
		// Remove the bookmark indicator node from the screen
		state.bookmarks[i].indicator.remove();
	}

	state.bookmarks = [];
}

function remBookmark(){
	const TOLERANCE = 3;
	const time = parseInt(state.video.currentTime);

	// Check if a bookmark is within TOLERANCE
	for(i = 0; i < state.bookmarks.length; i++){
		if(time - TOLERANCE <= state.bookmarks[i].time && state.bookmarks[i].time <= time + TOLERANCE){
			console.log(`Deleted Bookmark at ${time}`);

			// Remove the bookmark indicator node from the screen
			state.bookmarks[i].indicator.remove();
		
			// Remove the bookmark from the list of bookmarks
			state.bookmarks.splice(i, 1);
			
			return;
		}
	}

	console.log(`No bookmarks within range ${time} to delete`);
	return;
}


//////////////////////////////////////
//				SCRIPT				//
//////////////////////////////////////
beforeFirstLoad();

// After the page loads initially
chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete" && location.href.includes("watch")) {
			clearInterval(readyStateCheckInterval);
			afterFirstLoad();
		}
	}, 10);
});

// Add an event listener for when the background page sends a message about a url update
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	  // listen for messages sent from background.js
	  if (request.id === 'NewVideo') {
		var readyStateCheckInterval = setInterval(function() {
			if (document.readyState === "complete" && location.href.includes("watch")) {
				clearInterval(readyStateCheckInterval);
				afterLoads();
			}
		}, 10);
	  }
  });