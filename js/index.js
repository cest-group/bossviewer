"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structureviewer = require("structureviewer");

// Load the structure viewer
let targetElem = document.getElementById("viewer-canvas");
let options = {
    showParam: false,
    showCopies: false,
    showShadows: true,
    showTags: true,
    allowRepeat: false,
    showCell: false,
    wrap: false,
    showLegend: false,
    showOptions: false,
    showUnit: true,
    showBonds: true,
    radiusScale: 0.7,
    bondScale: 1.5,
    enableZoom: false,
    enablePan: false,
    enableRotate: true,
    translation: [2.5, 2.5, 2.5]
};
var viewer = new structureviewer.StructureViewer(targetElem, false, options);
viewer.loadJSON("data/geometry.json");

// Recolor the bonds
viewer.bonds.getObjectByName("bond0-2").getObjectByName("fill").material.color.setHex(0x00ff00); // d4
viewer.bonds.getObjectByName("bond9-11").getObjectByName("fill").material.color.setHex(0x0000ff); // d13
viewer.bonds.getObjectByName("bond0-5").getObjectByName("fill").material.color.setHex(0xff0000);  // d7
viewer.bonds.getObjectByName("bond0-9").getObjectByName("fill").material.color.setHex(0x000000); // d11
viewer.render();

//viewer.bonds.children[6].material.color.setHex(0x000000);  // d11
//viewer.bonds.children[20].material.color.setHex(0x00ff00);  // d13
//viewer.bonds.children[4].material.color.setHex(0xff0000);  // d7
//viewer.bonds.children[2].material.color.setHex(0x0000ff);  // d4

// Define functions for rotating
function rotated11(angle) {

    // The atoms to rotate
    let atom9 = viewer.atoms.getObjectByName("atom9");
    let atom11 = viewer.atoms.getObjectByName("atom11");
    let atom12 = viewer.atoms.getObjectByName("atom12");
    let atom10 = viewer.atoms.getObjectByName("atom10");

    // The bonds to rotate

    // Make pivot group: Notice the use of attach instead of add
    let group = new THREE.Group();
    let pivotPoint = new THREE.Vector3();
    atom9.getObjectByName("fill").getWorldPosition(pivotPoint);
    group.position.copy(pivotPoint);
    group.attach(atom9);
    group.attach(atom11);
    group.attach(atom12);
    group.attach(atom10);
    viewer.atoms.attach(group);

    // Get global rotation axis
    let atom0 = viewer.atoms.getObjectByName("atom0");
    let axisStart = new THREE.Vector3();
    atom0.getObjectByName("fill").getWorldPosition(axisStart);
    let axisEnd = new THREE.Vector3();
    atom9.getObjectByName("fill").getWorldPosition(axisEnd);
    console.log(axisEnd);
    console.log(axisStart);
    let axis = new THREE.Vector3().subVectors(axisStart, axisEnd).normalize();
    console.log(axis);

    // Do the rotation
    group.rotateOnWorldAxis(axis, THREE.Math.degToRad(angle));

    viewer.render();
}

function rotater( ) {
  rotated11(1);
}

setInterval(rotater, 50);


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
