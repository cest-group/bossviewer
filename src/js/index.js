import { GPRegression, std_periodic_kernel } from "./gpregression.js";
import { MODEL_4D_E0 } from "./model_4D_E0.js";
import { StructureViewer } from "./structureviewer.js";

//==============================================================================
// Connect tab buttons after window load
window.onload = function () {
  document.getElementById("tab1").onclick = function () {
    openTab("tab1");
  };
  document.getElementById("tab2").onclick = function () {
    openTab("tab2");
  };
  document.getElementById("tab3").onclick = function () {
    openTab("tab3");
  };
  document.getElementById("tab4").onclick = function () {
    openTab("tab4");
  };
  document.getElementById("tab5").onclick = function () {
    openTab("tab5");
  };
};

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
  zoomLevel: 0.5,
};
var viewer = new StructureViewer(targetElem, options);
viewer.load(STRUCTURE);

// The loaded geometry corresponds to this rotation in the GPy model
let defaultRotation = [-50, -50, -50, -50];

//==============================================================================
// Define and train the GPRegressor. The model parameters come from a
// pretrained GPy model

// Dataset
const x_train = MODEL_4D_E0.x;
const y_train = MODEL_4D_E0.y;
const p = MODEL_4D_E0.params;

if (!Array.isArray(x_train) || x_train.length === 0) {
  throw new Error("x_train is missing or empty");
}
if (!Array.isArray(x_train[0]) || x_train[0].length !== 4) {
  throw new Error("Expected x_train to have shape (N, 4)");
}
if (!Array.isArray(y_train) || y_train.length === 0) {
  throw new Error("y_train is missing or empty");
}
if (!Array.isArray(y_train[0])) {
  y_train = y_train.map((v) => [v]);
}
if (!Array.isArray(p) || p.length !== 11) {
  throw new Error("Expected params to contain 11 entries");
}

// Define model
const mean = p[0];
const std_variance = p[1];
const periods = p.slice(2, 6);
const lengthscales = p.slice(6, 10);
const gaussian_noise_variance = p[10];
let kernel = std_periodic_kernel(std_variance, periods, lengthscales);
let model = new GPRegression(kernel, gaussian_noise_variance, mean);

// Fit model
model.fit(x_train, y_train);

//==============================================================================
// Customize viewer to the BOSS demo
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

// Recolor the bonds
bond02.getObjectByName("fill").material.color.setHex(0x00ff00); // d4
bond911.getObjectByName("fill").material.color.setHex(0x774cc1); // d13
bond05.getObjectByName("fill").material.color.setHex(0xff720c); // d7
bond09.getObjectByName("fill").material.color.setHex(0x000000); // d11
viewer.render();

//==============================================================================
// Form object groups and attach them to the scene

/**
 * Function for forming object groups. The group root is located at the pivot
 * point for easy rotation.
 */
function formGroup(
  components,
  pivotAtom,
  axisStartAtom,
  axisEndAtom,
  world = false,
) {
  let group = new THREE.Group();
  let pivot = new THREE.Vector3();
  pivotAtom.getObjectByName("fill").getWorldPosition(pivot);
  group.position.copy(pivot);
  let axisStart, axisEnd;
  if (world) {
    axisStart = new THREE.Vector3();
    axisEnd = new THREE.Vector3();
    axisStartAtom.getObjectByName("fill").getWorldPosition(axisStart);
    axisEndAtom.getObjectByName("fill").getWorldPosition(axisEnd);
  } else {
    axisStart = axisStartAtom.getObjectByName("fill").position;
    axisEnd = axisEndAtom.getObjectByName("fill").position;
  }
  let axis = new THREE.Vector3().subVectors(axisEnd, axisStart).normalize();
  for (let comp of components) {
    group.attach(comp);
  }
  function rotateFunc(angle) {
    group.rotateOnWorldAxis(axis, THREE.Math.degToRad(angle));
    viewer.render();
  }
  return { group: group, axis: axis, func: rotateFunc };
}
let groupObjectd13 = formGroup(
  [atom11, atom12, bond1112],
  atom11,
  atom9,
  atom11,
  true,
);
let d13_group = groupObjectd13.group;
let d13_axis = groupObjectd13.axis;
let rotated13 = groupObjectd13.func;

let groupObjectd11 = formGroup(
  [atom9, atom10, bond911, bond910],
  atom9,
  atom0,
  atom9,
);
let d11_group = groupObjectd11.group;
let d11_axis = groupObjectd11.axis;
let rotated11 = groupObjectd11.func;

let groupObjectd7 = formGroup(
  [atom5, atom6, atom7, atom8, bond56, bond57, bond58],
  atom5,
  atom0,
  atom5,
);
let d7_group = groupObjectd7.group;
let d7_axis = groupObjectd7.axis;
let rotated7 = groupObjectd7.func;

let groupObjectd4 = formGroup(
  [atom2, atom3, atom4, bond23, bond24],
  atom2,
  atom0,
  atom2,
);
let d4_group = groupObjectd4.group;
let d4_axis = groupObjectd4.axis;
let rotated4 = groupObjectd4.func;

d11_group.attach(d13_group);
viewer.atoms.attach(d11_group);
viewer.atoms.attach(d4_group);
viewer.atoms.attach(d7_group);

//==============================================================================
// Connect linear sliders to viz
let energyValue = document.getElementById("energy-value");
let energyMinValue = document.getElementById("energy-min-value");
let energyKnob = document.getElementById("energy-slider-knob");
let energyMinKnob = document.getElementById("energy-slider-min-knob");
var d11angle = 0;
var d13angle = 0;
var d7angle = 0;
var d4angle = 0;

// These hard-coded values come from a simple grid search through different
// angle combinations done with python. A small tolerance is added because the
// continuous model may have different boundaries.
const tolerance = 1;
const maxEnergy = 47.52 + tolerance;
const minEnergy = 15.79 - tolerance;
let userMinEnergy = maxEnergy;

/**
 * Calculates and updates the energy for the given rotation.
 */
function updateEnergy(d4angle, d7angle, d11angle, d13angle) {
  // We use the analytical regression model to do on-the-fly predictions.
  // There is an offset of -50 degrees in the loaded structure.
  let x = [d4angle, d7angle, d11angle, d13angle];
  x = math.add(x, defaultRotation);
  let energy = model.predict(x);

  // Update text
  energyValue.innerHTML = energy.toFixed(2);

  // Update current energy
  let pos = ((energy - minEnergy) / (maxEnergy - minEnergy)) * 100;
  energyKnob.style.left = pos + "%";

  // Update best energy
  if (energy < userMinEnergy) {
    updateMinEnergy(energy);
  }
}

/**
 * Updates the current minimum energy on the GUI.
 */
function updateMinEnergy(energy) {
  let pos = ((energy - minEnergy) / (maxEnergy - minEnergy)) * 100;
  energyMinKnob.style.left = pos + "%";
  userMinEnergy = energy;

  // Update text
  energyMinValue.innerHTML = userMinEnergy.toFixed(2);
}
updateEnergy(d4angle, d7angle, d11angle, d13angle);

let d11 = document.getElementById("d11");
d11.oninput = function () {
  rotated11(this.value - d11angle);
  d11angle = this.value;
  updateEnergy(d4angle, d7angle, d11angle, d13angle);
};
let d13 = document.getElementById("d13");
d13.oninput = function () {
  rotated13(this.value - d13angle);
  d13angle = this.value;
  updateEnergy(d4angle, d7angle, d11angle, d13angle);
};
let d7 = document.getElementById("d7");
d7.oninput = function () {
  rotated7(this.value - d7angle);
  d7angle = this.value;
  updateEnergy(d4angle, d7angle, d11angle, d13angle);
};
let d4 = document.getElementById("d4");
d4.oninput = function () {
  rotated4(this.value - d4angle);
  d4angle = this.value;
  updateEnergy(d4angle, d7angle, d11angle, d13angle);
};

let reset = document.getElementById("reset");
reset.onclick = function () {
  d4.value = "0";
  d4.oninput();
  d7.value = "0";
  d7.oninput();
  d11.value = "0";
  d11.oninput();
  d13.value = "0";
  d13.oninput();
  updateMinEnergy(model.predict(defaultRotation));
  viewer.controls.reset();
  openTab("tab1");
};

function openTab(tabName) {
  var i, x, tablinks;
  x = document.getElementsByClassName("content-tab");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tab");
  for (i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" is-active", "");
  }
  document.getElementById(tabName + "-content").style.display = "block";
  document.getElementById(tabName).className += " is-active";
}
