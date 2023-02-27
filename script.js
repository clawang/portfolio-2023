import {icons, foodPics} from './icons.js';

const popups = [
	{
		elmnt: null,
		status: 0,
		id: 'about-page',
		icon: './media/internet-icon.png',
		name: 'About'
	},
	{
		elmnt: null,
		status: 0,
		id: 'fun-fact-page',
		icon: './media/folder-icon.png',
		name: 'File Explorer'
	},
	{
		elmnt: null,
		status: 0,
		id: 'info-page',
	},
	{
		elmnt: null,
		status: 0,
		id: 'videography-page',
		icon: './media/video-icon.png',
		name: 'Videography'
	},
	{
		elmnt: null,
		status: 0,
		id: 'contact-page',
		icon: './media/phone-icon.png',
		name: 'Contact'
	}
];
// status: 0 is closed, 1 is open, 2 is active
let openIcon = -1;
var mobileMode = false;

window.addEventListener("load", function() {
	const container = document.getElementById("icons-container");
	let width = window.innerWidth;
	let height = window.innerHeight - 35;

	// Adding icons to desktop
	icons.forEach((icon, index) => {
		var div = document.createElement('div');
		div.classList.add("icon-wrapper");
		div.id = icon.id;

		var img = document.createElement('img');
		img.setAttribute("src", icon.img);
		div.appendChild(img);

		var p = document.createElement('p');
		const text = document.createTextNode(icon.name);
		p.appendChild(text);
		div.appendChild(p);

		div.style.left = String(icon.left*100) + "%";
		div.style.top = String(icon.top*100) + "%";

		if(icon.type) {
			//if(icon.title) div.title = icon.title;
			div.addEventListener("click", function() {
				// window.open(icon.link,'_blank');
				openInfoPopup(icon);
			});
		} else {
			div.addEventListener("click", (e) => openPopup(icon.window));
		}

		container.appendChild(div);
	});

	// const picsContainer = document.getElementById("pics-container");
	// foodPics.forEach(pic => {
	// 	var img = document.createElement('img');
	// 	img.setAttribute("src", pic);
	// 	picsContainer.appendChild(img);
	// });

	updateClock();

	document.querySelector('.start-button').addEventListener("click", function() {
		const startMenu = document.querySelector('.start-menu');
		if(startMenu.classList.contains('close')) {
			startMenu.classList.remove('close');
			startMenu.classList.add('open');
		} else {
			closeMenu();
		}
	});

	document.querySelector('#file-explorer-link').addEventListener('click', function() {
		openFilePopup();
		closeMenu();
	});
	document.querySelector('#contact-link').addEventListener('click', function() {
		openPopup(4);
		closeMenu();
	});

	popups.forEach(popup => {
		popup.elmnt = document.querySelector('.window-wrapper#'+popup.id);
	})
	for(let i = 0; i < popups.length; i++) {
		let popup = popups[i].elmnt;
		popup.addEventListener('click', function() {
			adjustActiveWindow(i);
		});
	}

	setMobile();
});

window.addEventListener('resize', function() {
	popups.forEach(popup => {
		if(popup.status === 0) return;
		const elmnt = popup.elmnt;
		var maxHeight = window.innerHeight - elmnt.clientHeight - 35;
    var maxWidth = window.innerWidth - elmnt.clientWidth;
		elmnt.style.top = Math.min(Math.max(elmnt.offsetTop, 0), maxHeight) + "px";
    elmnt.style.left = Math.min(Math.max(elmnt.offsetLeft, 0), maxWidth) + "px";
	});
	const canvas = document.querySelector('canvas');
	if(window.innerWidth < window.innerHeight || window.innerWidth < 600) {
		canvas.style.display =  "none";
		document.querySelector('.mobile-mode').style.display = "none";
	} else {
		canvas.removeEventListener('click', fadeOutCanvas);
		canvas.style.zIndex = "0";
		canvas.style.display =  "block";
		canvas.classList.remove('fade-out');
	}
	const content = document.querySelector('#videography-page .content-window');
	const video = document.getElementById('video');
	if(content.clientWidth < 560) {
		video.width = content.clientWidth-60;
		video.height = (content.clientWidth-60)/560*315;
	}
});

function dragElement(windowId) {
	const elmnt = popups[windowId].elmnt;

  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var windowTitleBar = document.querySelector("#" + elmnt.id + " .window-title-bar");
  if (windowTitleBar) {
    // if present, the header is where you move the DIV from:
    windowTitleBar.onmousedown = dragMouseDown;
    //windowTitleBar.ontouchstart = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.ontouchend = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    document.ontouchmove = elementDrag;
    adjustActiveWindow(windowId);
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    // set the element's new position:
    var maxHeight = window.innerHeight - elmnt.clientHeight - 35;
    var maxWidth = window.innerWidth - elmnt.clientWidth;
    elmnt.style.top = Math.min(Math.max(elmnt.offsetTop - pos2, 0), maxHeight) + "px";
    elmnt.style.left = Math.min(Math.max(elmnt.offsetLeft - pos1, 0), maxWidth) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchmove = null;
    document.ontouchend = null;
  }
}

function openFilePopup() {
	openPopup(1);

	document.getElementById('video-folder').addEventListener('click', function(e) {
		e.stopPropagation();
		openPopup(3);
	});
	document.getElementById('spotify-folder').addEventListener('click', () => openLink('https://open.spotify.com/user/1241364699?si=5278203f6e2942e6'));
	document.getElementById('travel-folder').addEventListener('click', () => openLink('https://www.adventureatwork.co/'));
	document.getElementById('photography-folder').addEventListener('click', () => openLink('https://www.instagram.com/fooodiesadventures/'));
}

let openFunction;

function openInfoPopup(icon) {
	if (popups[2].status > 0) {
		adjustActiveWindow(2);
		popups[2].elmnt.classList.add('alert');
		setTimeout(() => {
			popups[2].elmnt.classList.remove('alert');
		}, 300);
		return;
	}

	openIcon = icons.findIndex(item => item === icon);
	openPopup(2);

	document.getElementById('app-icon').src = icon.img;
	document.getElementById('app-title').textContent = icon.name;
	document.getElementById('info-description').textContent = icon.title;
	document.getElementById('info-subtitle').textContent = icon.subtitle || "";
	document.getElementById('open-button').removeEventListener('click', openFunction);
	openFunction = () => openLink(icon.link);
	document.getElementById('open-button').addEventListener('click', openFunction);
	document.getElementById('cancel-button').addEventListener('click', function(e) {
		e.stopPropagation();
		closePopup(2);
	});
}

function openLink(link) {
	window.open(link,'_blank');
}

function openPopup(windowId) {
	const popup = popups[windowId].elmnt;

	// handle popup arrangement
	if (popups[windowId].status > 1) {
		return;
	} else if(popups[windowId].status > 0) {
		adjustActiveWindow(windowId);
		return;
	}
	popup.classList.remove('close');
	popup.classList.add('open');

	// adjust position of popup
	popup.style.left = ((window.innerWidth - popup.clientWidth)/2) + "px";
	popup.style.top = ((window.innerHeight - popup.clientHeight - 35)/2) + "px";

	// adding corresponding window indicator to start bar
	const openWindowsContainer = document.getElementById('open-windows-container');
	const div = document.createElement('div');
	div.classList.add('start-window-button');
	var img = document.createElement('img');
	img.setAttribute("src", popups[windowId].icon || icons[openIcon].img);
	div.appendChild(img);
	var p = document.createElement('p');
	const text = document.createTextNode(popups[windowId].name || icons[openIcon].name);
	p.appendChild(text);
	div.appendChild(p);
	openWindowsContainer.appendChild(div);
	popups[windowId].button = div;
	div.addEventListener('click', (e) => adjustActiveWindow(windowId));

	adjustActiveWindow(windowId);
	dragElement(windowId);

	popup.querySelector('.close-button').addEventListener('click', function(e) {
		e.stopPropagation();
		closePopup(windowId);
	});
}

function closePopup(windowId) {
	const popup = popups[windowId].elmnt;
	popup.classList.remove('open');
	popup.classList.add('close');
	popups[windowId].status = 0;

	const openWindowsContainer = document.getElementById('open-windows-container');
	openWindowsContainer.removeChild(popups[windowId].button);
	popups[windowId].button = null;
}

function adjustActiveWindow(popupIndex) {
	let activePopupIndex = popups.findIndex(popup => popup.status === 2);
	if (activePopupIndex >= 0 && activePopupIndex !== popupIndex) {
		popups[activePopupIndex].elmnt.classList.remove('active');
		popups[activePopupIndex].button.classList.remove('active');
		popups[activePopupIndex].status = 1;
	}
	popups[popupIndex].elmnt.classList.add('active');
	popups[popupIndex].button.classList.add('active');
	popups[popupIndex].status = 2;
}

function closeMenu() {
	const startMenu = document.querySelector('.start-menu');
	startMenu.classList.remove('open');
	startMenu.classList.add('close');
}

function setMobile() {
	if(window.innerWidth > window.innerHeight || window.innerWidth > 600) return;
	mobileMode = true;

	const canvas = document.querySelector('canvas');
	canvas.style.zIndex = "3";
	document.querySelector('.mobile-mode').style.display = "block";

	canvas.addEventListener('click', fadeOutCanvas);
}

function fadeOutCanvas() {
	const canvas = document.querySelector('canvas');
	canvas.classList.add('fade-out');
	document.querySelector('.mobile-mode').classList.add('fade-out');
	setTimeout(() => {
		canvas.style.display = "none";
		document.querySelector('.mobile-mode').style.display = "none";
	}, 400);
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function updateClock() {
	var now = new Date();
	let period = now.toLocaleTimeString().split(" ")[1];
	let times = now.toLocaleTimeString().split(":");
	const time = times[0] + ":" + times[1] + " " + period;
	document.getElementById('time-string').textContent = time;

	setTimeout(updateClock, 1000);
}