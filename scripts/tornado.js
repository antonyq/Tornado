try { 
	var CIRCLES_COUNT = parseInt(prompt("Количество кругов в слое: ", 1));
	var RADIUS = parseInt(prompt("Радиус: ", 5));
	var DISTANCE = parseInt(prompt("Отклонение: ", 20));
	var A = parseInt(prompt("Скорость оборота вокруг оси Z: ", 1));
	var B = parseInt(prompt("Скорость оборота вокруг собственной оси: ", 1));

	console.table({
		'Количество кругов в слое': CIRCLES_COUNT,
		'Радиус': RADIUS,
		'Отклонение': DISTANCE,
		'Количество витков по оси Z': A,
		'Количество витков по собственной оси': B
	});
	
	if (isNaN(CIRCLES_COUNT) ||
		isNaN(RADIUS) || 
		isNaN(DISTANCE) ||
		isNaN(A) ||
		isNaN(B) ||
		CIRCLES_COUNT < 0 ||
		RADIUS < 0 ||
		DISTANCE < 0 ||
		A < 0 ||
		B < 0 ||
		RADIUS > DISTANCE) {
		throw new Error("Incorrect data input!");
	}
} catch (e) {
	console.log("Incorrect data input!");
	window.location.reload();
}

const PI = Math.PI;
const PI2 = PI * 2;
const STEP = PI2 / CIRCLES_COUNT;
const RENDER_POINTS_COUNT = PI2 / 100;

function drawPowerCurve(scene, i) {
	var points = [];
	var x, y, z;
	for (var t = 0; t <= Math.ceil(PI2); t += RENDER_POINTS_COUNT) {
		x = (DISTANCE + RADIUS * Math.cos(B*t + i)) * Math.cos(A*t);
		y = RADIUS * Math.sin(B*t+i);
		z = (DISTANCE + RADIUS * Math.cos(B*t + i)) * Math.sin(A*t);
		points.push(new BABYLON.Vector3(x, y, z));
	}
	var initial = new BABYLON.Vector3(0, 1, 0);
	var path3d = new BABYLON.Path3D(points, initial);
	var curve = path3d.getCurve();
	var li = BABYLON.Mesh.CreateLines('li', curve, scene);
	li.color = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
}

function drawPowerCurves(scene) {
	for (var i = 0; i < PI2; i += STEP) {
		drawPowerCurve(scene, i)
	}
};

function setCamera(scene) {
	var camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
	camera.setPosition(new BABYLON.Vector3(0, 30, -60));
	camera.setTarget(BABYLON.Vector3.Zero());
	camera.attachControl(canvas, false);
};

function setLight(scene) {
	var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
	light.intensity = 0.5;
};

function createScene(engine) {
	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color3(0.0, 0.0, 0.0);	
	setCamera(scene);
	setLight(scene);
	drawPowerCurves(scene);
	return scene;
};

var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var scene = createScene(engine);

engine.runRenderLoop(function () {
	scene.render();
});

window.addEventListener("resize", function () {
	engine.resize();
});