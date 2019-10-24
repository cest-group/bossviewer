var sliders = document.getElementsByClassName("round-slider");
for (let i = 0; i < sliders.length; i++) {
	sliders[i].addEventListener("click", round_slider_tune, false);
	sliders[i].addEventListener("mousedown", function(event) {
		sliders[i].onmousemove = function(event) {
			if (event.buttons == 1 || event.buttons == 3) {
				round_slider_tune(event);
			}
		}
	});
}

function round_slider_tune(event) {
	let eventDoc = (event.target && event.target.ownerDocument) || document,
		doc = eventDoc.documentElement,
		body = eventDoc.body;
	event.pageX = event.clientX +
		  (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
		  (doc && doc.clientLeft || body && body.clientLeft || 0);
	event.pageY = event.clientY +
		  (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
		  (doc && doc.clientTop  || body && body.clientTop  || 0 );
	let output = event.target.getElementsByClassName("selection")[0],
		text = event.target.getElementsByClassName("holder")[0],
		styleafter = document.head.appendChild(document.createElement("style")),
		elpos = event.target.getBoundingClientRect(),
		cX = elpos.width / 2,
		cY = elpos.height / 2,
		eX = event.pageX - elpos.left,
		eY = event.pageY - elpos.top,
		dX = 0,
		dY = 0,
		angle = Math.atan2(cX - eX, cY - eY) * (180 / Math.PI),
		value = 100;

	if (Math.abs(eX - cX) >= Math.abs(eY - cY)) { // 110 90
		dX = 150 / 2 + Math.sign(eX - cX) * 150 / 2;
		dY = 150 / 2 + (eY - cY) / Math.abs(eX - cX) * 150 / 2;
	} else {
		dX = 150 / 2 + (eX - cX) / Math.abs(eY - cY) * 150 / 2;
		dY = 150 / 2 + Math.sign(eY - cY) * 150 / 2;
	}
	dX = Math.round(dX / 150 * 100)
	dY = Math.round(dY / 150 * 100)
	styleafter.innerHTML = ".round-slider {transform: rotate(" + -angle + "deg);}";
	text.innerHTML = value + "%";
}
