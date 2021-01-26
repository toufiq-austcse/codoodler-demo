(function () {
        var pubnub = new PubNub({
                publish_key: 'pub-c-73c58b0d-5c27-4e4b-bb58-377024196a3c',
                subscribe_key: 'sub-c-4baa524e-5888-11eb-95c0-3253a07b53cf',
                leave_on_unload: true,
                uuid: "2558966",
                authKey:"da177b989757c89d274598479b814257"
        });
        function $(id) {
                return document.getElementById(id);
        }
        var box = $('box'),
                input = $('input'),
                channel = 'chat.600ea7b1b16f65a35e430df3';
      
                pubnub.addListener({
                        status: function(statusEvent) {
                                console.log(statusEvent);
                            if (statusEvent.category === "PNConnectedCategory") {
                               // publishSampleMessage();
                            }
                        },
                        message: function(msg) {
                                console.log(msg);
                                msg = msg.message.msg;
                              //  console.log(msg);
                                box.innerHTML = ('' + msg).replace(/[<>]/g, '') + '<br>' + box.innerHTML
                        },
                        presence: function(presenceEvent) {
                            // This is where you handle presence. Not important for now :)
                        }
                    })
                    console.log("Subscribing...");
                
                    pubnub.subscribe({
                        channels: ['chat.*']
                    });
        input.addEventListener('keyup', function (e) {
                if ((e.keyCode || e.charCode) === 13) {
                        pubnub.publish({
                                channel: channel,
                                message: {
                                        msg:input.value
                                },
                                x: (input.value = '')
                               
                        },function(status, response) {
                                console.log(status, response);
                            });
                }
        });
})();
