let isMenuHidden = true;
window.onresize = resize;

function toggleMenu() {
	let menuItems = document.querySelectorAll('#menu li');

	// If nav menu items are hidden, display them
	if (isMenuHidden) {
		menuItems.forEach((item) => { item.style.display = 'block'; });
	}
	// Otherwise, hide all nav menu items except the menu button
	else {
		menuItems.forEach((item) => { if (item.id !== 'menu-button') item.style.display = 'none'; });
	}

	isMenuHidden = !isMenuHidden;
}

function resize() {

	if (window.innerWidth > 800) {
		isMenuHidden = true;
		let menuItems = document.querySelectorAll('#menu li');
		menuItems.forEach((item) => { item.style.display = 'block'; });
		document.getElementById('menu-button').style.display = 'none';
	}
	else {
		isMenuHidden = true;
		let menuItems = document.querySelectorAll('#menu li');
		menuItems.forEach((item) => { if (item.id !== 'menu-button') item.style.display = 'none'; });
		document.getElementById('menu-button').style.display = 'block';
	}
}