let app = new PIXI.Application({
	width: 1024,
	height: 1024,
	backgroundColor: "#ffffff",
	view: document.getElementById("yuleCanvas")
});

let manifest = [
	{
		"key" : "yuleText", 
		"url" : "assets/images/CoolYule_Text.png"
	},
	{
		"key" : "yuleFill1", 
		"url" : "assets/images/CoolYule_Fill_01.png"
	},
	{
		"key" : "yuleFill2", 
		"url" : "assets/images/CoolYule_Fill_02.png"
	},
	{
		"key" : "yuleFill3", 
		"url" : "assets/images/CoolYule_Fill_03.png"
	},
	{
		"key" : "yuleFill4", 
		"url" : "assets/images/CoolYule_Fill_04.png"
	},
	{
		"key" : "snowflake", 
		"url" : "assets/images/Snowflake.png"
	}
];

let bgColors = [
	0x601a8f,
	0x43a220,
	0xaf0e1b,
	0xfdfa41,
	0xff7700
];
let fillColors = [
	0x601a8f,
	0x43a220,
	0xcf0e1b,
	0xfdfa41
];
let snowColors = [
	0x601a8f,
	0x601a8f,
	0x43a220,
	0xcf0e1b,
	0xffffff,
	0xffffff,
	0xffffff,
	0xffffff
];

let bgRects = [];
let yuleFills = [];
let yuleText;
let tickCount = 0;
let ticksPerPulse = 10;
let snowTickCount = 0;
let ticksPerSnowflake = 10;
let bgTickCount = 0;
let ticksPerBg = 10;
let yuleContainer;

function loadAssets() {
	app.loader.add(manifest);
	app.loader.load(onAssetsLoaded);
}

function onAssetsLoaded(loader, resources) {
	console.log(resources);
	// addExplodingBall(resources);

	window.resources = resources;

	setupGame();

	app.ticker.add((e) => update(e));
}

function setupGame() {
	// background rectangles

	let rect3 = new PIXI.Graphics();
	rect3.lineStyle(5, 0x000000);
	rect3.beginFill(0xffffff);
	rect3.drawRect(450, 0, 600, 500);
	rect3.tint = 0xaf0e1b;
	app.stage.addChild(rect3);

	let rect6 = new PIXI.Graphics();
	rect6.lineStyle(5, 0x000000);
	rect6.beginFill(0xffffff);
	rect6.drawRect(0, 500, 600, 800);
	rect6.tint = 0xaf0e1b;
	app.stage.addChild(rect6);

	let rect4 = new PIXI.Graphics();
	rect4.lineStyle(5, 0x000000);
	rect4.beginFill(0xffffff);
	rect4.drawRect(600, 400, 500, 700);
	rect4.tint = 0x601a8f;
	app.stage.addChild(rect4);

	let rect5 = new PIXI.Graphics();
	rect5.lineStyle(5, 0x000000);
	rect5.beginFill(0xffffff);
	rect5.drawRect(0, 300, 300, 500);
	rect5.tint = 0xff7700;
	app.stage.addChild(rect5);

	

	let rect1 = new PIXI.Graphics();
	rect1.lineStyle(5, 0x000000);
	rect1.beginFill(0xffffff);
	rect1.drawRect(220, 320, 600, 350);
	rect1.tint = 0x53b230;
	app.stage.addChild(rect1);

	let rect2 = new PIXI.Graphics();
	rect2.lineStyle(5, 0x000000);
	rect2.beginFill(0xffffff);
	rect2.drawRect(0, 0, 460, 380);
	rect2.tint = 0xfdfa41;
	app.stage.addChild(rect2);

	bgRects = [
		rect1,
		rect2,
		rect3,
		rect4,
		rect5,
		rect6
	];

	yuleContainer = new PIXI.Container();
	yuleContainer.x = 512;
	yuleContainer.y = 512;

	for (let i = 2; i >= 0; i--) {
		let name = "yuleFill" + (i + 2);
		let newFill = new PIXI.Sprite(resources[name].texture);
		newFill.anchor.set(0.5, 0.5);
		newFill.tint = fillColors[i];

		yuleFills.push(newFill);

		yuleContainer.addChild(newFill);

	}

	let newFill = new PIXI.Sprite(resources.yuleFill1.texture);
	newFill.anchor.set(0.5, 0.5);
	newFill.tint = fillColors.shift();

	yuleContainer.addChild(newFill);

	yuleText = new PIXI.Sprite(resources.yuleText.texture);
	yuleText.anchor.set(0.5, 0.5);
	yuleContainer.addChild(yuleText);

	TweenMax.fromTo(yuleContainer.scale, 1, {
		x: 0.6,
		y: 0.6
	}, {
		x: 0.5,
		y: 0.5,
		repeat: -1,
		ease: Power1.easeInOut,
		yoyo: true
	});

	TweenMax.fromTo(yuleContainer, 2, {rotation: -0.2}, {rotation: 0.6, ease: Power1.easeInOut, repeat: -1, delay: 0.4, yoyo:true});

	app.stage.addChild(yuleContainer);
}

function cycleColors() {
	yuleFills.unshift(yuleFills.pop());

	for (let i = yuleFills.length - 1; i >= 0; i--) {
		yuleFills[i].tint = fillColors[i];
	}
}

function generateSnowflake() {
	let newSnowflake = new PIXI.Sprite(resources.snowflake.texture);
	newSnowflake.anchor.set(0.5, 0.5);
	newSnowflake.tint = snowColors[Math.floor(Math.random() * snowColors.length)];
	newSnowflake.scale.set(0.05 + (Math.random() * 0.1));
	newSnowflake.x = -300 + (Math.random() * 1624);
	newSnowflake.y = -100;

	app.stage.addChild(newSnowflake);

	TweenMax.to(newSnowflake, 5 + (Math.random() * 5), {
		x: Math.random() * 1024,
		y: 1124,
		rotation: -10 + (Math.random() * 20),
		ease: Linear.easeNone,
		onComplete: () => {
			app.stage.removeChild(newSnowflake);
			newSnowflake = null
		}
	});

	
}

function cycleBgColors() {
	// return;

	// let rect = bgRects[Math.floor(Math.random() * bgRects.length)];
	// let color = bgColors[Math.floor(Math.random() * bgColors.length)];
	bgRects.push(bgRects.shift());
	bgColors.push(bgColors.shift());
	bgRects[0].tint = bgColors[0];

	bgRects[3].tint = bgColors[4];
}

function update(e) {
	tickCount++;
	if (tickCount >= ticksPerPulse) {
		cycleColors();
		tickCount = 0;
	}

	snowTickCount++;
	if (snowTickCount >= ticksPerSnowflake) {
		generateSnowflake();
		snowTickCount = 0;
	}

	bgTickCount++;
	if (bgTickCount >= ticksPerBg) {
		cycleBgColors();
		bgTickCount = 0;
	}
}

function onResize(e) {
	let canvasAspect = app.screen.width / app.screen.height;
	let screenAspect = window.innerWidth / window.innerHeight;
	let scale = 1;
	if (screenAspect >= canvasAspect) {
		// if screen > canvas, screen is wider
		// landscape, make width match
		scale = window.innerWidth / app.screen.width;
	} else {
		// else canvas is wider, so make height match
		// portrait, make height match
		scale = window.innerHeight / app.screen.height;
	}

	let newTransform = 'scale(' + scale + ')';

	app.view.style.transform = newTransform;
}

window.onload = function() {
	window.addEventListener("resize", onResize);
	onResize();

	loadAssets();

	document.body.addEventListener("click", function(e) {
		document.getElementById("music").play();
	});
}
