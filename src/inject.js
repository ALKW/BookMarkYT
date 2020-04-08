var bookmarkBtnObj;
var bookmarkPopupObj;

var state = {
	video: undefined,
	isFullScreen: false,
	bookmarks: [], //Array of {time: number, name: string}
}

// What to do before the page loads
function beforeLoads(){
}

// What to do once the page loads
function afterLoads(){
	console.log("Video is loaded");
	state.video = document.querySelector("video.video-stream");

	// Add bookmark menu button to youtube controls
	createBookmarkMenuBtn();

	// Create the popup menu for the bookmark button
	createBMPopupMenu();

	// Update styles when full screen button is pressed
	var fullScreenBtn = document.querySelector("button.ytp-fullscreen-button");
	fullScreenBtn.addEventListener("click", updateStyles);
	
	// Add keyboard event handlers
	document.addEventListener("keydown", keyboardEvents);
	
}

//////////////////////////////////////
//			UPDATE FUNCITONS		//
//////////////////////////////////////
function updateStyles(){
	state.isFullScreen = !state.isFullScreen;
	console.log(state.isFullScreen)
	updateBookmarkMenubtn();
	updateBookmarkPopup();

	
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

	bookmarkBtnObj = {
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
	controls.insertBefore(bookmarkBtnObj.bookmarkBtn, controls.children[3]);
}

function onClickBookmarkMenuBtn(){
	if(bookmarkBtnObj.open){
		bookmarkPopupObj.popup.style.display = "none";
		bookmarkBtnObj.rect1.setAttributeNS(null, "visibility", "visible");
		bookmarkBtnObj.open = false;
		
	}
	else{
		bookmarkPopupObj.popup.style.display = "";
		bookmarkBtnObj.rect1.setAttributeNS(null, "visibility", "hidden");
		bookmarkBtnObj.open = true;
	}
}

function offClickBookmarkBtn(event){
	if (event.target !== bookmarkBtnObj.bookmarkBtn){
		bookmarkPopupObj.popup.style.display = "none";
		bookmarkBtnObj.rect1.setAttributeNS(null, "visibility", "visible");
		bookmarkBtnObj.open = false;
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

	// Get the parent of where we are adding the popup
	const videoDiv = document.querySelector("div.ytp-transparent");

	// Add the buttons to the panel menu
	panelMenu.appendChild(bookmarkListBtn);
	panelMenu.appendChild(addBookmarkBtn);
	panelMenu.appendChild(editBookmarksBtn);

	panel.appendChild(panelMenu);

	popup.appendChild(panel)

	videoDiv.appendChild(popup);

	bookmarkPopupObj = {
		popup: popup,
		panel: panel,
		panelMenu: panelMenu,
		bookmarkListBtn: bookmarkListBtn,
		///addBookmarkBtn: addBookmarkBtn,
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
	
	var ns = 'http://www.w3.org/2000/svg';
	var itemIcon = document.createElementNS(ns, "svg");
	

	menuItem.appendChild(menuSpacer);
	menuItem.appendChild(itemText);

	return menuItem;
}

// Goto a specific bookmark after clicking an item
function bmGoto(){

}

function updateBookmarkPopup(){
	if(state.isFullScreen){
		bookmarkPopupObj.popup.style.left = "24px";
		bookmarkPopupObj.popup.style.width = "361px";
		bookmarkPopupObj.popup.style.height = "212px";

		bookmarkPopupObj.panel.style.width = "361px";
		bookmarkPopupObj.panel.style.height = "212px";
	}
	else{
		bookmarkPopupObj.popup.style.left = "12px";
		bookmarkPopupObj.popup.style.width = "256px";
		bookmarkPopupObj.popup.style.height = "177px";

		bookmarkPopupObj.panel.style.width = "256px";
		bookmarkPopupObj.panel.style.height = "177px";
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
		default:
			return;
	}
}

function findIndex(forward){
	// Allow for proper skipping forward and backwards multiple times
	var timeBuffer = 4;
	if(forward)
		timeBuffer *= -1;

	// Return index of nearest time stamp bookmark (always rounds up)
	const time = parseInt(state.video.currentTime) - timeBuffer;

	console.log(time, state.bookmarks.length)

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
	}

	console.log(`Going back to previous bookmark at ${index}`);
	state.video.currentTime = state.bookmarks[index].time;
}

function addBookmarkKey(){
	addBookmark()
}

//////////////////////////////////////
//			BOOKMARK FUNCTION		//
//////////////////////////////////////
function addBookmark(){
	const time = parseInt(state.video.currentTime);
	const toInsert = { time: time, name: "defaultName"}
	var inserted = false;

	// The amount of variability between bookmarks
	// Prevents duplicates
	var buffer = 2;

	for(i = 0; i < state.bookmarks.length; i++){
		if(state.bookmarks[i].time - buffer <= time && time <= state.bookmarks[i].time + buffer){
			console.log("Bookmark already added")
			return
		}
		if(time < state.bookmarks[i].time){
			state.bookmarks.splice(i, 0, toInsert);
			console.log("added bookmark");
			console.log(state.bookmarks);
			return
		}
	}

	if(!inserted){
		state.bookmarks.splice(state.bookmarks.length, 0, toInsert);
		console.log("splicing")
	}
		
	console.log("added bookmark");
	console.log(state.bookmarks);
}

//////////////////////////////////////
//				SCRIPT				//
//////////////////////////////////////
beforeLoads();

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
			console.log("ON new page")
			afterLoads()
		}
	}, 10);
});
