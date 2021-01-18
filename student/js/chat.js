(function () {
        var pubnub = PUBNUB.init({
                publish_key: 'pub-c-73c58b0d-5c27-4e4b-bb58-377024196a3c',
                subscribe_key: 'sub-c-4baa524e-5888-11eb-95c0-3253a07b53cf',
                leave_on_unload: true,
        });
        function $(id) {
                return document.getElementById(id);
        }
        var box = $('box'),
                input = $('input'),
                channel = '10chat-demo';
      
        pubnub.subscribe({
                channel: channel,
                callback: function (msg) {
                        console.log(msg);
                        box.innerHTML = ('' + msg).replace(/[<>]/g, '') + '<br>' + box.innerHTML
                }
        });
        input.addEventListener('keyup', function (e) {
                if ((e.keyCode || e.charCode) === 13) {
                        pubnub.publish({
                                channel: channel,
                                message: input.value,
                                x: (input.value = '')
                        });
                }
        });
})();
