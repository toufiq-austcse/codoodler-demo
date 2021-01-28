(function () {
	let uuid = '2558966';
	var xhr = new XMLHttpRequest();
	xhr.open("POST", 'https://stage-live.10minuteschool.com/api/v1/class/admin/config', true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({
		class_id: "1",
		user_name: "sadi",
		uuid: uuid

	}));

	xhr.onreadystatechange = function () {
		if (this.readyState != 4) return;

		if (this.status == 200) {
			var res = JSON.parse(this.responseText);
			console.log(res);
			let { agora_config, channel_list, pubnub_config } = res.data[0];

			/* Canvas */
			let currentPage = 1;
			var canvas = document.getElementById('drawCanvas');
			var ctx = canvas.getContext('2d');
			canvas.width = 800;
			canvas.height = 600;


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




			/* Mouse and touch events */

			document.getElementById('colorSwatch').addEventListener('click', function () {
				color = document.querySelector(':checked').getAttribute('data-color');
			}, false);


			/* PubNub */

			var drawChannel = channel_list.drawing;
			let pageChannel = channel_list.page;


			var pubnub = PUBNUB.init({
				publish_key: pubnub_config.pub_key,
				subscribe_key: pubnub_config.sub_key,
				leave_on_unload: true,
				ssl: document.location.protocol === "https:",
				uuid: uuid,
				authKey: pubnub_config.auth_key

			});

			pubnub.subscribe({
				channel: drawChannel,
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

			pubnub.history(
				{
					channel: pageChannel,
					count: 1, // how many items to fetch
					stringifiedTimeToken: true, // false is the default
				},
				function (status, response) {
					if (status.length > 0) {
						console.log(status);
						if (status[0][0].page) {
							currentPage = status[0][0].page
							loadImage(currentPage);
						} else {
							loadImage(currentPage);
						}
					}
					// handle status, response
				}
			);

			/* function publish(data) {
				pubnub.publish({
					channel: channel,
					message: data
				});
			} */

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




			// we get the returned data
		}

		// end of state change: it can be after some time (async)
	};



})();
