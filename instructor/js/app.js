(function () {
	/* Canvas */
	let currentPage = 1;

	var canvas = document.getElementById('drawCanvas');
	var ctx = canvas.getContext('2d');
	var color = document.querySelector(':checked').getAttribute('data-color');

	//canvas.width = Math.min(document.documentElement.clientWidth, window.innerWidth || 300);
	//canvas.height = Math.min(document.documentElement.clientHeight, window.innerHeight || 300);
	canvas.width = 1080;
	canvas.height = 720;
	console.log(canvas.width,canvas.height);

	ctx.strokeStyle = color;
	ctx.lineWidth = '3';
	ctx.lineCap = ctx.lineJoin = 'round';

	let baseImg = new Image();


	/* load image */
	function loadImage(page) {
		baseImg.src = `https://uadoc.uacdn.net/live_class/CWFZUJ2N/1602882378I9PSYAHO.pdf?page=${page}&fm=webp&fit=clip&auto=compress&w=1080`;

		baseImg.onload = function () {
			ctx.drawImage(baseImg, 0, 0, baseImg.width, baseImg.height, 0, 0, canvas.width, canvas.height);
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

	function drawFromStream(message) {
		if (message.page) {
			loadImage(message.page)
		} else {
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
			loadImage(++currentPage);
			publish({
				page: currentPage
			});
		} else if (e.key === 'ArrowLeft') {
			loadImage(--currentPage);
			publish({
				page: currentPage
			});
		}
	})
})();
