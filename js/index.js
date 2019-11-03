"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structureviewer = require("structureviewer");

//==============================================================================
// Load the structure viewer
let targetElem = document.getElementById("canvas");
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
    translation: [2.5, 2.5, 2.5],
    zoomLevel: 0.65
};
var viewer = new structureviewer.StructureViewer(targetElem, false, options);
viewer.loadJSON("data/geometry.json");

//==============================================================================
// Customizing viewer to the BOSS demo
let atom0 = viewer.atoms.getObjectByName("atom0");
let atom2 = viewer.atoms.getObjectByName("atom2");
let atom3 = viewer.atoms.getObjectByName("atom3");
let atom4 = viewer.atoms.getObjectByName("atom4");
let atom5 = viewer.atoms.getObjectByName("atom5");
let atom6 = viewer.atoms.getObjectByName("atom6");
let atom7 = viewer.atoms.getObjectByName("atom7");
let atom8 = viewer.atoms.getObjectByName("atom8");
let atom9 = viewer.atoms.getObjectByName("atom9");
let atom11 = viewer.atoms.getObjectByName("atom11");
let atom12 = viewer.atoms.getObjectByName("atom12");
let atom10 = viewer.atoms.getObjectByName("atom10");
let bond02 = viewer.bonds.getObjectByName("bond0-2");
let bond05 = viewer.bonds.getObjectByName("bond0-5");
let bond09 = viewer.bonds.getObjectByName("bond0-9");
let bond23 = viewer.bonds.getObjectByName("bond2-3");
let bond24 = viewer.bonds.getObjectByName("bond2-4");
let bond56 = viewer.bonds.getObjectByName("bond5-6");
let bond57 = viewer.bonds.getObjectByName("bond5-7");
let bond58 = viewer.bonds.getObjectByName("bond5-8");
let bond911 = viewer.bonds.getObjectByName("bond9-11");
let bond910 = viewer.bonds.getObjectByName("bond9-10");
let bond1112 = viewer.bonds.getObjectByName("bond11-12");

// Create groups and place them at the pivot point for easy rotation
let d11_group = new THREE.Group();
let d13_group = new THREE.Group();
let d4_group = new THREE.Group();
let d7_group = new THREE.Group();
let d4_pivot = new THREE.Vector3();
atom2.getObjectByName("fill").getWorldPosition(d4_pivot);
d4_group.position.copy(d4_pivot);
let d7_pivot = new THREE.Vector3();
atom5.getObjectByName("fill").getWorldPosition(d7_pivot);
d7_group.position.copy(d7_pivot);
let d13_pivot = new THREE.Vector3();
atom11.getObjectByName("fill").getWorldPosition(d13_pivot);
d13_group.position.copy(d13_pivot);
let d11_pivot = new THREE.Vector3();
atom9.getObjectByName("fill").getWorldPosition(d11_pivot);
d11_group.position.copy(d11_pivot);
d11_group.attach(d13_group);
viewer.atoms.attach(d11_group);
viewer.atoms.attach(d4_group);
viewer.atoms.attach(d7_group);

// Recolor the bonds
bond02.getObjectByName("fill").material.color.setHex(0x00ff00);  // d4
bond911.getObjectByName("fill").material.color.setHex(0x0000ff); // d13
bond05.getObjectByName("fill").material.color.setHex(0xff0000);  // d7
bond09.getObjectByName("fill").material.color.setHex(0x000000);  // d11
viewer.render();

console.log(viewer.bonds);

//==============================================================================
// d13
let d13_components = [atom11, atom12, bond1112];
let d13_axisStart = new THREE.Vector3();
let d13_axisEnd = new THREE.Vector3();
atom11.getObjectByName("fill").getWorldPosition(d13_axisStart);
atom9.getObjectByName("fill").getWorldPosition(d13_axisEnd);
let d13_axis = new THREE.Vector3().subVectors(d13_axisEnd, d13_axisStart).normalize();
for (let comp of d13_components) {
    d13_group.attach(comp);
}
function rotated13(angle) {
    rotate(d13_group, d13_axis, angle);
}

//==============================================================================
// d11
let d11_components = [atom9, atom10, bond911, bond910];
let d11_axisStart = atom0.getObjectByName("fill").position;
let d11_axisEnd = atom9.getObjectByName("fill").position;
let d11_axis = new THREE.Vector3().subVectors(d11_axisEnd, d11_axisStart).normalize();
for (let comp of d11_components) {
    d11_group.attach(comp);
}

function rotated11(angle) {
    rotate(d11_group, d11_axis, angle);
}

//==============================================================================
// d7
let d7_components = [atom5, atom6, atom7, atom8, bond56, bond57, bond58];
let d7_axisStart = atom0.getObjectByName("fill").position;
let d7_axisEnd = atom5.getObjectByName("fill").position;
let d7_axis = new THREE.Vector3().subVectors(d7_axisEnd, d7_axisStart).normalize();
for (let comp of d7_components) {
    d7_group.attach(comp);
}

function rotated7(angle) {
    rotate(d7_group, d7_axis, angle);
}

//==============================================================================
// d4
let d4_components = [atom2, atom3, atom4, bond23, bond24];
let d4_axisStart = atom0.getObjectByName("fill").position;
let d4_axisEnd = atom2.getObjectByName("fill").position;
let d4_axis = new THREE.Vector3().subVectors(d4_axisEnd, d4_axisStart).normalize();
for (let comp of d4_components) {
    d4_group.attach(comp);
}

function rotated4(angle) {
    rotate(d4_group, d4_axis, angle);
}

//==============================================================================
// Testing
function rotate(group, axis, angle) {
    group.rotateOnWorldAxis(axis, THREE.Math.degToRad(angle));
    viewer.render();
}

function rotater() {
    rotated4(1);
    rotated13(1);
    rotated7(1);
    rotated11(1);
}

setInterval(rotater, 50);

// Connect linear sliders to viz
let d11 = document.getElementById("d11");
d11.onchange = function() {
    d11val.innerHTML = this.value;
}


//==============================================================================
// For setting up the radial sliders
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
