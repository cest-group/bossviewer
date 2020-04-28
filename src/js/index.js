import { StructureViewer } from './structureviewer.js';
import { GPRegression, std_periodic_kernel } from './gpregression.js';

//==============================================================================
// Connect tab buttons after window load
window.onload = function(){
    document.getElementById("tab1").onclick = function() {openTab('tab1');};
    document.getElementById("tab2").onclick = function() {openTab('tab2');};
    document.getElementById("tab3").onclick = function() {openTab('tab3');};
    document.getElementById("tab4").onclick = function() {openTab('tab4');};
    document.getElementById("tab5").onclick = function() {openTab('tab5');};
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
    zoomLevel: 0.5
};
var viewer = new StructureViewer(targetElem, options);
viewer.load(STRUCTURE);

// The loaded geometry corresponds to this rotation in the GPy model
let defaultRotation = [-50, -50, -50, -50];

//==============================================================================
// Define and train the GPRegressor. The model parameters come from a
// pretrained GPy model

// Dataset
const x_train = [[130.0,130.0,130.0,130.0],[220.0,40.0,220.0,40.0],[40.0,220.0,40.0,220.0],[85.0,85.0,175.0,-5.0],[265.0,265.0,-5.0,175.0],[175.0,-5.0,85.0,85.0],[-5.0,175.0,265.0,265.0],[17.5,62.5,62.5,197.5],[197.5,242.5,242.5,17.5],[287.5,-27.5,152.5,287.5],[107.5,152.5,-27.5,107.5],[62.5,17.5,287.5,152.5],[242.5,197.5,107.5,-27.5],[152.5,107.5,17.5,242.5],[-27.5,287.5,197.5,62.5],[-19.0314526796,-41.9668124758,191.5811989559,192.4597815896],[80.2762919361,149.5333580683,149.0198857444,196.0383021744],[110.5208519885,86.3350277295,99.9518171791,188.2950515186],[48.2660688529,151.6325048456,65.8373914382,-29.847056594],[-9.5792481174,-38.5083956357,29.2911580182,28.6769878441],[118.2943907058,213.3121956756,308.2390770858,308.3278632192],[259.4933827465,81.7928322488,260.8877721815,114.207451408],[182.2810187579,27.6899638376,201.5479580337,297.5792727937],[310.0,168.3312053518,275.2104241683,-10.9893315046],[-12.8627030251,181.3339539495,72.3178745576,135.3019300317],[145.6290707528,302.4341757308,284.7540348788,209.0141709938],[101.6207367013,85.7922117319,287.0933227515,59.71326191],[108.5119132439,65.3072354804,139.5912559206,254.0337198149],[253.2084600745,246.231305657,186.0083632249,236.2540031082],[146.0358340721,168.1058895181,6.8366488455,5.3431437117],[278.4796811259,136.1491590136,-21.8918459946,68.4151836047],[246.3031229395,46.3538471546,31.0642996133,284.2370513048],[85.646042421,258.3661457657,99.575826643,43.6408459401],[191.5435943997,55.4678676411,207.662710806,153.8408764837],[181.6573308758,93.7477187749,7.3870329356,136.3171654317],[-50.0,19.8577836914,109.6258188102,5.8132976085],[149.0724012466,-4.0349941993,246.6487316083,271.8212521492],[164.0528494905,14.0198216057,228.3621578621,86.003606593],[15.5900492559,132.3029695122,78.8023486509,264.9847459353],[225.2556039769,65.5961248445,108.3401838726,214.1426150854],[224.8815406175,213.4014914234,113.4539265347,50.2678505121],[310.0,109.2507984097,-1.6620974209,-14.7661043142],[310.0,112.8779524118,130.5568879943,158.0219393918],[30.2882719288,221.9119708269,173.3596195545,100.2904019692],[301.220793711,250.7025825873,292.5271876176,-50.0],[154.3523805248,178.7367256653,36.0857908832,68.1345628327],[187.1915860495,124.4887690864,199.1405414121,-26.842737687],[217.7664815554,121.0402111175,247.8289969382,184.4447079144],[221.2180738208,170.4585831665,139.3139354894,98.4520866028],[-30.2491323883,142.4880195955,-39.100958902,230.7319380938],[11.9961789006,80.8834963481,-49.7668486761,171.9103293774],[-11.4663686618,-43.4508616292,226.5123798134,-46.9417937462],[22.4815292394,27.8294819987,310.0,26.2096133233],[89.4680850352,-12.2057220407,61.7265453065,300.9770417409],[310.0,264.2721118607,209.5687325134,124.2032893038],[21.6596689227,229.4519109355,-17.5158004836,276.2279645338],[27.4607554113,97.5541234264,258.9799430798,232.4928460087],[117.3642420699,104.6430778267,73.9350041347,-1.01165443],[-35.1874283561,88.950966081,14.4107061403,97.0677809071],[166.9149222307,-4.7424773069,4.5802014234,39.3927326268],[46.1819712979,258.2628158816,144.5861195279,310.0],[39.2148685068,-9.625257745,185.3526489319,36.394339015],[247.696321503,203.9003130921,-50.0,252.0743540777],[70.3788436133,245.3873422319,39.3278403961,160.8926011081],[63.4071613845,216.0514989117,208.0106170846,144.7676247219],[310.0,124.9872654586,-25.1116606487,133.3314912615],[247.1411656045,310.0,309.5760551159,27.8084748803],[244.6291755402,22.5135542835,49.4045502129,114.6950615479],[192.9897783598,133.000171557,109.7591355067,272.5937829306],[194.4218239616,136.0976978242,15.4993773773,-39.7378909838],[87.9031884426,236.4006317412,277.1473475373,-17.8378818006],[126.8257750473,233.8218215742,-16.7117501181,196.8836452581],[115.832002795,36.953407821,310.0,254.2156535405],[-2.9643780471,32.6735826071,87.1734545203,83.8928534381],[13.4153853325,44.6390359475,267.2517615923,91.740472355],[-3.4704330858,111.7724796425,127.1256323507,224.8240931385],[175.2982944162,175.0066362961,147.9814515625,18.9662944352],[261.4586873393,121.5118516805,67.6870298056,194.7766860487],[145.8654957826,218.5074591216,189.5964568182,212.7614993672],[-50.0,110.1340973686,255.6030458491,53.9670309068],[51.8442058979,185.4416174978,138.7408156266,171.9756444331],[291.5265058821,175.4784428309,145.0740725408,183.067427334],[169.2010037567,167.8248894916,51.6032304023,177.916121393],[54.3880804936,-46.6830614487,21.9373590549,78.2936050347],[-36.8042353873,191.2019524939,47.009621934,274.2589834783],[282.3816431141,308.1775425317,119.4792790644,60.7256619736],[129.5057678968,265.9884318068,139.8555830957,-42.5735046518],[264.056841124,119.8665652903,201.5971099457,2.1726335133],[89.4718876479,291.4135939308,188.6320144397,91.161971666],[61.3783589479,58.1569287157,257.6223685408,295.8821668245],[201.8104464121,310.0,281.832830159,-50.0],[203.4094859596,264.5783987799,-32.6202327047,228.5420365381],[11.683198585,18.9673601488,203.154445795,173.83014581],[127.6019115279,30.8516792895,228.8582291555,24.4304019365],[203.7158399204,277.8097198883,-46.7204589999,103.5618090171],[230.5986827315,270.2031065978,59.0752565399,20.185679737],[76.7209792666,301.2198438692,-13.0207979679,205.8988464292],[281.3060376205,49.6051778551,251.9817968139,231.3706606037],[19.0078883606,-38.5277910011,106.3376764074,310.0],[127.1159872292,98.6101055351,159.521817158,66.4884040609],[131.9965672558,195.3764682233,256.8428575928,132.2396648235],[168.8871153435,193.6666610714,71.876247352,301.7649591421],[-36.5756246967,37.1270494512,156.7313785273,288.7227687024],[226.4939493953,236.999780386,145.5165139876,148.9624609447],[21.8959693111,121.1582631395,-6.1584732536,100.7084748707],[-9.5528198774,277.8550915683,0.9494006255,-39.4009946313],[34.3380805768,-38.9280913021,-50.0,-9.7963445508],[263.9098938756,77.4439231274,42.9375216089,154.510999606],[14.1875569422,53.0496679088,150.5363391889,7.4080434722],[250.1779534124,59.7409975741,215.6933670551,292.408593872],[89.4283400722,110.0331176868,217.1179414976,249.7177055835],[-3.5238531786,249.0224449528,241.2537682083,-9.8843872905],[93.9082861804,94.8084288173,74.1430471921,106.0036317899],[113.4720838118,160.1502539252,224.2833983772,178.0689551931],[263.0295212459,242.9417686279,170.7522228576,85.2468971943],[-50.0,108.7379487888,263.8933656736,183.2068994777],[81.2851602941,120.4060931103,6.1785795908,24.7419232752],[32.6608365014,178.5045601964,176.9631045086,250.257011961],[171.0523047126,310.0,278.9036879774,55.4970205887],[282.4523971071,246.364704793,69.20566972,-49.9121272726],[214.380274007,-26.088196134,25.77483621,211.1114970798],[-28.0948056637,2.700833105,29.1452478997,183.0320231867],[259.8037351077,-37.2531366603,204.2058111233,172.2352160757],[155.8012850772,24.4833861835,112.4785928924,220.3057321527],[282.7469376733,307.524558987,42.0435553013,12.666652621],[100.8802067433,157.4548647393,53.7635657708,233.2632303703],[-40.2968661956,116.0693596827,215.2582547229,254.3300846179],[224.0052380952,-36.3563666089,9.301968261,73.0537026977],[289.8835184751,282.0652126867,95.8000082667,246.2040640091],[136.9579775132,188.1028894946,228.6948766964,-33.6473335465],[74.8226496548,169.7102453262,1.2190497483,301.5781214431],[-27.6912234408,185.5092531493,-42.9156621995,67.9348002231],[246.8925368768,266.5412267088,-28.8639073644,-27.3041371615],[33.2588071354,218.5526056261,95.5853106012,34.2977135356]];
const y_train = [[32.9358],[38.299],[25.513],[27.3085],[25.2292],[36.5772],[36.0907],[20.8058],[36.6902],[35.1168],[36.5209],[29.2388],[25.3631],[33.5159],[35.3341],[21.7047],[20.3567],[22.122],[29.9342],[33.0755],[41.633],[36.3537],[33.3932],[31.1396],[27.2025],[26.1395],[37.677],[32.9566],[35.0379],[29.5778],[33.775],[39.0221],[32.7151],[22.3225],[26.0402],[31.6115],[38.1059],[37.7777],[37.8335],[27.0334],[37.4949],[26.9178],[24.1241],[33.9622],[43.5431],[30.5971],[32.4926],[28.5634],[37.3359],[33.7029],[24.5153],[34.0032],[33.8533],[35.3912],[30.8339],[39.2682],[29.7507],[35.523],[35.7464],[33.5298],[32.6215],[31.6723],[41.4744],[22.6112],[22.341],[30.5412],[35.1349],[38.5446],[35.1271],[34.7399],[35.6071],[27.7549],[38.608],[37.3609],[36.1178],[31.3025],[26.1876],[29.5485],[24.2261],[36.1404],[16.5019],[18.4291],[20.6843],[32.1882],[32.4194],[34.8938],[30.9258],[37.3132],[32.8267],[31.8763],[38.7379],[33.8449],[21.9838],[32.1132],[37.0959],[24.041],[20.9967],[31.0359],[33.8553],[37.5483],[29.0233],[33.6583],[35.8309],[30.7437],[37.6538],[31.162],[30.4014],[27.8455],[29.2737],[39.7354],[32.4718],[32.8069],[33.1793],[20.2358],[41.6384],[23.3047],[30.7261],[29.4639],[36.7306],[29.3138],[29.588],[24.8393],[24.4749],[28.7207],[18.7222],[29.4482],[36.212],[33.1154],[29.1242],[30.5402],[31.7351],[33.1649],[37.6243],[31.502]];

// Define model
const periods = [360.0, 120.0, 360.0, 360.0];
const lengthscales = [0.5903924170903855, 2.7336270953356148, 0.938191844517205, 0.5856140739596537];
const std_variance = 45.693562016361284;
const gaussian_noise_variance = 2.061153622438558e-09;
const mean = 31.645791993529627;
let kernel = std_periodic_kernel(std_variance, periods, lengthscales);
let model = new GPRegression(kernel, gaussian_noise_variance, mean)

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
bond02.getObjectByName("fill").material.color.setHex(0x00ff00);  // d4
bond911.getObjectByName("fill").material.color.setHex(0x774cc1); // d13
bond05.getObjectByName("fill").material.color.setHex(0xff720c);  // d7
bond09.getObjectByName("fill").material.color.setHex(0x000000);  // d11
viewer.render();

//==============================================================================
// Form object groups and attach them to the scene

/**
 * Function for forming object groups. The group root is located at the pivot
 * point for easy rotation.
 */
function formGroup(components, pivotAtom, axisStartAtom, axisEndAtom, world=false) {
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
    return {group: group, axis:axis, func:rotateFunc};
}
let groupObjectd13 = formGroup([atom11, atom12, bond1112], atom11, atom9, atom11, true);
let d13_group = groupObjectd13.group;
let d13_axis = groupObjectd13.axis;
let rotated13 = groupObjectd13.func;

let groupObjectd11 = formGroup([atom9, atom10, bond911, bond910], atom9, atom0, atom9);
let d11_group = groupObjectd11.group;
let d11_axis = groupObjectd11.axis;
let rotated11 = groupObjectd11.func;

let groupObjectd7 = formGroup([atom5, atom6, atom7, atom8, bond56, bond57, bond58], atom5, atom0, atom5);
let d7_group = groupObjectd7.group;
let d7_axis = groupObjectd7.axis;
let rotated7 = groupObjectd7.func;

let groupObjectd4 = formGroup([atom2, atom3, atom4, bond23, bond24], atom2, atom0, atom2);
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
const tolerance = 1
const maxEnergy = 49.697+tolerance;
const minEnergy = 14.905-tolerance;
let userMinEnergy = maxEnergy;

/**
 * Calculates and updates the energy for the given rotation.
 */
function updateEnergy(d4angle, d7angle, d11angle, d13angle) {

    // We use the analytical regression model to do on-the-fly predictions.
    // There is an offset of -50 degrees in the loaded structure.
    let x = [d4angle, d7angle, d11angle, d13angle];
    x = math.add(x, defaultRotation);
    let energy = model.predict(x)

    // Update text
    energyValue.innerHTML = energy.toFixed(2);

    // Update current energy
    let pos = (energy-minEnergy)/(maxEnergy-minEnergy)*100;
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
    let pos = (energy-minEnergy)/(maxEnergy-minEnergy)*100;
    energyMinKnob.style.left = pos + "%";
    userMinEnergy = energy;

    // Update text
    energyMinValue.innerHTML = userMinEnergy.toFixed(2);
}
updateEnergy(d4angle, d7angle, d11angle, d13angle);

let d11 = document.getElementById("d11");
d11.oninput = function() {
    rotated11(this.value-d11angle);
    d11angle = this.value;
    updateEnergy(d4angle, d7angle, d11angle, d13angle);

};
let d13 = document.getElementById("d13");
d13.oninput = function() {
    rotated13(this.value-d13angle);
    d13angle = this.value;
    updateEnergy(d4angle, d7angle, d11angle, d13angle);
};
let d7 = document.getElementById("d7");
d7.oninput = function() {
    rotated7(this.value-d7angle);
    d7angle = this.value;
    updateEnergy(d4angle, d7angle, d11angle, d13angle);
};
let d4 = document.getElementById("d4");
d4.oninput = function() {
    rotated4(this.value-d4angle);
    d4angle = this.value;
    updateEnergy(d4angle, d7angle, d11angle, d13angle);
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
    updateMinEnergy(model.predict(defaultRotation));
    viewer.controls.reset();
    openTab('tab1');
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
  document.getElementById(tabName+"-content").style.display = "block";
  document.getElementById(tabName).className += " is-active";
}

