var video;
var bookmarkBtnObj;
var state = {
	bookmarks: [], //Array of {time: number, name: string}
}

// What to do before the page loads
function beforeLoads(){
}

// What to do once the page loads
function afterLoads(){
	console.log("Video is loaded");
	video = document.querySelector("video.video-stream");

	// Add bookmark to youtube controls
	const controls = document.querySelector("div.ytp-left-controls");
	createBookmarkBtn();
	controls.appendChild(bookmarkBtnObj.bookmarkBtn);

	// Create the popup menu for the bookmark button
	createBookmarkBox();
	
	// Add event handlers
	document.addEventListener("keydown", (event) => {
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
	});
}

//////////////////////////////////////
//			BOOKMARK BUTTON			//
//////////////////////////////////////
function createBookmarkBtn(){
	var ns = 'http://www.w3.org/2000/svg';

	var bookmarkBtn = document.createElement("button");
	bookmarkBtn.className = "ytp-button";
	bookmarkBtn.setAttribute("aria-title", "bookmark")
	bookmarkBtn.onclick = onClickBookmarkBtn;

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
	rect1.setAttributeNS(null, "y","8")
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
	rect2.setAttributeNS(null, "y","13.5")
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
	rect3.setAttributeNS(null, "y","16.5")
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

	bookmarkBtn.appendChild(bookmarkSvg);

	bookmarkBtnObj = {
		use: use,
		rect1: rect1,
		rect2: rect2,
		rect3: rect3,
		bookmarkSvg: bookmarkSvg,
		bookmarkBtn: bookmarkBtn,
		open: false
	};
}

function onClickBookmarkBtn(){
	if(bookmarkBtnObj.open){
		bookmarkBtnObj.rect1.setAttributeNS(null, "visibility", "visible");
		bookmarkBtnObj.open = false;
	}
	else{
		bookmarkBtnObj.rect1.setAttributeNS(null, "visibility", "hidden");
		bookmarkBtnObj.open = true;
	}
	//Create the bookmark
	addBookmark()
}

function offClickBookmarkBtn(event){
	if (event.target !== bookmarkBtnObj.bookmarkBtn){
		bookmarkBtnObj.rect1.setAttributeNS(null, "visibility", "visible");
		bookmarkBtnObj.open = false;
	}
}

//////////////////////////////////////
//			BOOKMARK BOX			//
//////////////////////////////////////
function createBookmarkBox(){
	// Add styles to bookmark box
	bookmarkBox = document.createElement("div");
	bookmarkBox.textContent = "This text is really long";
	bookmarkBox.style.display = "none";
	bookmarkBox.style.position = "relative"
	bookmarkBox.style.width = "30%"

	// Add close on click listener
	document.addEventListener("click", offClickBookmarkBtn);

	// Add the element to the dom
	const videoDiv = document.querySelector("div.ytp-gradient-bottom");
	videoDiv.appendChild(bookmarkBox);
}

function bmGoto(){

}

//////////////////////////////////////
//			KEYBOARD SHORTCUTS		//
//////////////////////////////////////
function findIndex(forward){
	// Allow for proper skipping forward and backwards multiple times
	var timeBuffer = 4;
	if(forward)
		timeBuffer *= -1;

	// Return index of nearest time stamp bookmark (always rounds up)
	const time = parseInt(video.currentTime) - timeBuffer;

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
	video.currentTime = state.bookmarks[index].time;
}

function skipBackwardKey(){
	const index = findIndex(false)

	if(state.bookmarks.length === 0){
		console.log("No Bookmarks in List");
	}

	console.log(`Going back to previous bookmark at ${index}`);
	video.currentTime = state.bookmarks[index].time;
}

function addBookmarkKey(){
	addBookmark()
	console.log("added bookmark by key")
}

//////////////////////////////////////
//			BOOKMARK FUNCTION		//
//////////////////////////////////////
function addBookmark(){
	const time = parseInt(video.currentTime);
	const toInsert = { time: time, name: "defaultName"}
	var greaterThanPrev = false;
	var inserted = false;

	for(i = 0; i < state.bookmarks.length; i++){
		if(time <= state.bookmarks[i].time){
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
