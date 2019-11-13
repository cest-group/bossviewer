import { StructureViewer } from './structureviewer.js';

// Hide load message after page load
window.onload = function(){ document.getElementById("loadscreen").style.display = "none"};

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
    zoomLevel: 0.5
};
var viewer = new StructureViewer(targetElem, options);
viewer.load(STRUCTURE);

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

//==============================================================================
// Connect linear sliders to viz
let energyValue = document.getElementById("energy-value");
let energyMinValue = document.getElementById("energy-min-value");
let energyKnob = document.getElementById("energy-slider-knob");
let energyMinKnob = document.getElementById("energy-slider-min-knob");
let angleStep = 10;
let energyIndices = [];
for (let i=0; i < 36; ++i) {
    energyIndices.push(i);
};
energyIndices.push(0);
let d11_index = 0;
let d13_index = 0;
let d7_index = 0;
let d4_index = 0;

// It is a bit annoying to get the min and max values with JS, so these
// hardcoded values are from python
const maxEnergy = 49.697;
const minEnergy = 14.905;
let userMinEnergy = maxEnergy;

function updateEnergy(id4, id7, id11, id13) {

    // Update text
    let energy = ENERGIES[id4][id7][id11][id13][4];
    energyValue.innerHTML = energy.toFixed(2);

    // Update current energy
    let pos = (energy-minEnergy)/(maxEnergy-minEnergy)*100;
    energyKnob.style.left = pos + "%";

    // Update best energy
    if (energy < userMinEnergy) {
        updateMinEnergy(energy);
    }
}
function updateMinEnergy(energy) {
    let pos = (energy-minEnergy)/(maxEnergy-minEnergy)*100;
    energyMinKnob.style.left = pos + "%";
    userMinEnergy = energy;

    // Update text
    energyMinValue.innerHTML = userMinEnergy.toFixed(2);
}
updateEnergy(d4_index, d7_index, d11_index, d13_index);

let d11 = document.getElementById("d11");
var d11angle = 0;
d11.oninput = function() {
    d11_index = energyIndices[this.value];
    let angle = d11_index*angleStep;
    let newangle = angle-d11angle;
    rotated11(newangle);
    d11angle = angle;
    updateEnergy(d4_index, d7_index, d11_index, d13_index);

};
let d13 = document.getElementById("d13");
var d13angle = 0;
d13.oninput = function() {
    d13_index = energyIndices[this.value];
    let angle = -d13_index*angleStep;
    let newangle = angle-d13angle;
    rotated13(newangle);
    d13angle = angle;
    updateEnergy(d4_index, d7_index, d11_index, d13_index);
};
let d7 = document.getElementById("d7");
var d7angle = 0;
d7.oninput = function() {
    d7_index = energyIndices[this.value];
    let angle = d7_index*angleStep;
    let newangle = angle-d7angle;
    rotated7(newangle);
    d7angle = angle;
    updateEnergy(d4_index, d7_index, d11_index, d13_index);
};
let d4 = document.getElementById("d4");
var d4angle = 0;
d4.oninput = function() {
    d4_index = energyIndices[this.value];
    let angle = d4_index*angleStep;
    let newangle = angle-d4angle;
    rotated4(newangle);
    d4angle = angle;
    updateEnergy(d4_index, d7_index, d11_index, d13_index);
};

let reset = document.getElementById("reset");
reset.onclick = function() {
    d4.value = "0";
    d4.oninput();
    d7.value = "0";
    d7.oninput();
    d11.value = "0";
    d11.oninput();
    d13.value = "0";
    d13.oninput();
    updateMinEnergy(ENERGIES[0][0][0][0][4]);
};
