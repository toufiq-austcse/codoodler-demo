(function () {
	/* Canvas */
	let currentPage = 1;
	let pageHistory = [];
	pageHistory.length = 50;

	var canvas = document.getElementById('drawCanvas');
	var ctx = canvas.getContext('2d');
	var color = document.querySelector(':checked').getAttribute('data-color');

	//canvas.width = Math.min(document.documentElement.clientWidth, window.innerWidth || 300);
	//canvas.height = Math.min(document.documentElement.clientHeight, window.innerHeight || 300);
	canvas.width = 1080;
	canvas.height = 720;
	console.log(canvas.width, canvas.height);

	ctx.strokeStyle = color;
	ctx.lineWidth = '3';
	ctx.lineCap = ctx.lineJoin = 'round';

	let baseImg = new Image();
	baseImg.crossOrigin = '*';  //<-- set here

	/* load image */
	function loadImage(page) {

		if (pageHistory[page]) {
			console.log('history paise');
			baseImg.src = pageHistory[page];
		} else {
			//baseImg.src = `https://uadoc.uacdn.net/live_class/CWFZUJ2N/1602882378I9PSYAHO.pdf?page=${page}&fm=webp&fit=clip&auto=compress&w=1080`;

			baseImg.onload = function () {
				ctx.drawImage(baseImg, 0, 0, baseImg.width, baseImg.height, 0, 0, canvas.width, canvas.height);
			}
		}


	}

	loadImage(currentPage);


	/* Mouse and touch events */

	document.getElementById('colorSwatch').addEventListener('click', function () {
		color = document.querySelector(':checked').getAttribute('data-color');
	}, false);

	var isTouchSupported = 'ontouchstart' in window;
	var isPointerSupported = navigator.pointerEnabled;
	var isMSPointerSupported = navigator.msPointerEnabled;

	var downEvent = isTouchSupported ? 'touchstart' : (isPointerSupported ? 'pointerdown' : (isMSPointerSupported ? 'MSPointerDown' : 'mousedown'));
	var moveEvent = isTouchSupported ? 'touchmove' : (isPointerSupported ? 'pointermove' : (isMSPointerSupported ? 'MSPointerMove' : 'mousemove'));
	var upEvent = isTouchSupported ? 'touchend' : (isPointerSupported ? 'pointerup' : (isMSPointerSupported ? 'MSPointerUp' : 'mouseup'));

	canvas.addEventListener(downEvent, startDraw, false);
	canvas.addEventListener(moveEvent, draw, false);
	canvas.addEventListener(upEvent, endDraw, false);

	/* PubNub */

	var channel = 'draw';


	var pubnub = PUBNUB.init({
		publish_key: 'pub-c-73c58b0d-5c27-4e4b-bb58-377024196a3c',
		subscribe_key: 'sub-c-4baa524e-5888-11eb-95c0-3253a07b53cf',
		leave_on_unload: true,
		ssl: document.location.protocol === "https:"
	});

	pubnub.subscribe({
		channel: channel,
		callback: drawFromStream,
		presence: function (m) {
			if (m.occupancy > 1) {
				document.getElementById('unit').textContent = 'doodlers';
			}
			document.getElementById('occupancy').textContent = m.occupancy;
			var p = document.getElementById('occupancy').parentNode;
			p.classList.add('anim');
			p.addEventListener('transitionend', function () { p.classList.remove('anim'); }, false);
		}
	});

	function publish(data) {
		pubnub.publish({
			channel: channel,
			message: data
		});
	}

	/* Draw on canvas */

	function drawOnCanvas(color, plots) {

		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.moveTo(plots[0].x, plots[0].y);

		for (var i = 1; i < plots.length; i++) {
			ctx.lineTo(plots[i].x, plots[i].y);
		}
		ctx.stroke();

	}

	let arr = [
		{
			"x": 407,
			"y": 417
		},
		{
			"x": 411,
			"y": 419
		},
		{
			"x": 415,
			"y": 424
		},
		{
			"x": 416,
			"y": 428
		},
		{
			"x": 416,
			"y": 432
		},
		{
			"x": 413,
			"y": 434
		},
		{
			"x": 408,
			"y": 434
		},
		{
			"x": 402,
			"y": 433
		},
		{
			"x": 395,
			"y": 426
		},
		{
			"x": 391,
			"y": 417
		},
		{
			"x": 389,
			"y": 406
		},
		{
			"x": 393,
			"y": 395
		},
		{
			"x": 401,
			"y": 390
		},
		{
			"x": 412,
			"y": 390
		},
		{
			"x": 421,
			"y": 394
		},
		{
			"x": 434,
			"y": 411
		},
		{
			"x": 436,
			"y": 422
		},
		{
			"x": 436,
			"y": 431
		},
		{
			"x": 434,
			"y": 437
		},
		{
			"x": 428,
			"y": 441
		},
		{
			"x": 422,
			"y": 442
		},
		{
			"x": 416,
			"y": 437
		},
		{
			"x": 407,
			"y": 426
		},
		{
			"x": 401,
			"y": 409
		},
		{
			"x": 401,
			"y": 392
		},
		{
			"x": 410,
			"y": 378
		},
		{
			"x": 423,
			"y": 370
		},
		{
			"x": 455,
			"y": 369
		},
		{
			"x": 480,
			"y": 379
		},
		{
			"x": 504,
			"y": 398
		},
		{
			"x": 521,
			"y": 422
		},
		{
			"x": 531,
			"y": 458
		},
		{
			"x": 531,
			"y": 483
		},
		{
			"x": 521,
			"y": 511
		},
		{
			"x": 500,
			"y": 530
		},
		{
			"x": 470,
			"y": 537
		},
		{
			"x": 435,
			"y": 533
		},
		{
			"x": 389,
			"y": 515
		},
		{
			"x": 339,
			"y": 483
		},
		{
			"x": 299,
			"y": 437
		},
		{
			"x": 271,
			"y": 361
		},
		{
			"x": 275,
			"y": 324
		},
		{
			"x": 293,
			"y": 299
		},
		{
			"x": 311,
			"y": 290
		},
		{
			"x": 328,
			"y": 290
		},
		{
			"x": 356,
			"y": 297
		},
		{
			"x": 371,
			"y": 302
		},
		{
			"x": 389,
			"y": 315
		},
		{
			"x": 394,
			"y": 322
		},
		{
			"x": 395,
			"y": 327
		},
		{
			"x": 395,
			"y": 329
		},
		{
			"x": 394,
			"y": 329
		},
		{
			"x": 391,
			"y": 329
		}
	];
	let arr1 = [
		{
			"x": 580,
			"y": 283
		},
		{
			"x": 581,
			"y": 284
		},
		{
			"x": 583,
			"y": 288
		},
		{
			"x": 584,
			"y": 293
		},
		{
			"x": 587,
			"y": 301
		},
		{
			"x": 590,
			"y": 312
		},
		{
			"x": 591,
			"y": 317
		},
		{
			"x": 592,
			"y": 322
		},
		{
			"x": 595,
			"y": 335
		},
		{
			"x": 599,
			"y": 349
		},
		{
			"x": 604,
			"y": 363
		},
		{
			"x": 609,
			"y": 379
		},
		{
			"x": 613,
			"y": 391
		},
		{
			"x": 614,
			"y": 398
		},
		{
			"x": 614,
			"y": 406
		},
		{
			"x": 616,
			"y": 413
		},
		{
			"x": 616,
			"y": 417
		},
		{
			"x": 617,
			"y": 423
		},
		{
			"x": 617,
			"y": 428
		},
		{
			"x": 618,
			"y": 431
		},
		{
			"x": 618,
			"y": 432
		},
		{
			"x": 619,
			"y": 433
		},
		{
			"x": 620,
			"y": 434
		},
		{
			"x": 621,
			"y": 434
		},
		{
			"x": 621,
			"y": 433
		},
		{
			"x": 622,
			"y": 433
		},
		{
			"x": 623,
			"y": 433
		}
	];

	drawOnCanvas('gold', arr);
	drawOnCanvas('red', arr1)


	function drawFromStream(message) {
		if (message.page) {
			loadImage(message.page)
		} else {
			console.log(message.color, message.plots);
			if (!message || message.plots.length < 1) return;
			drawOnCanvas(message.color, message.plots);
		}

	}

	// Get Older and Past Drawings!
	if (drawHistory) {
		pubnub.history({
			channel: channel,
			count: 50,
			callback: function (messages) {
				pubnub.each(messages[0], drawFromStream);
			}
		});
	}
	var isActive = false;
	var plots = [];

	function draw(e) {
		e.preventDefault(); // prevent continuous touch event process e.g. scrolling!
		if (!isActive) return;

		var x = isTouchSupported ? (e.targetTouches[0].pageX - canvas.offsetLeft) : (e.offsetX || e.layerX - canvas.offsetLeft);
		var y = isTouchSupported ? (e.targetTouches[0].pageY - canvas.offsetTop) : (e.offsetY || e.layerY - canvas.offsetTop);

		plots.push({ x: (x << 0), y: (y << 0) }); // round numbers for touch screens

		drawOnCanvas(color, plots);
	}

	function startDraw(e) {
		e.preventDefault();
		isActive = true;
	}

	function endDraw(e) {
		e.preventDefault();
		isActive = false;

		publish({
			color: color,
			plots: plots
		});

		plots = [];
	}

	document.addEventListener('keydown', e => {
		if (e.key === 'ArrowRight') {

			pageHistory[currentPage] = canvas.toDataURL("image/jpeg", 0.5);

			console.log(pageHistory[currentPage]);

			loadImage(++currentPage);
			console.log(pageHistory[currentPage]);
			publish({
				page: currentPage,
				key: 'ArrowRight'
			});
		} else if (e.key === 'ArrowLeft') {
			pageHistory[currentPage] = canvas.toDataURL("image/jpeg", 0.5);

			loadImage(--currentPage);

			publish({
				page: currentPage,
				key: 'ArrowLeft'
			});
		}
	})
})();
