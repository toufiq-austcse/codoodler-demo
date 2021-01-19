(() => {
        'use strict';

        // ~Warning~ You must get your own API Keys for non-demo purposes.
        // ~Warning~ Get your PubNub API Keys: https://www.pubnub.com/get-started/
        // The phone *number* can by any string value
        const pubkey = 'pub-c-561a7378-fa06-4c50-a331-5c0056d0163c';
        const subkey = 'sub-c-17b7db8a-3915-11e4-9868-02ee2ddab7fe';
        const number = ('' + Math.random() * 100000).split('.')[0];

        // Phone
        const phone = PHONE({
                number: "BROADCASTER-TEST"
                , publish_key: pubkey
                , subscribe_key: subkey
                , ssl: true,
                media: { audio: true, video: false }
        });

        // Debugging Output
        phone.debug(info => console.info(info));

        // As soon as the phone is ready we can make calls
        phone.ready(video => {
                PUBNUB.$('video-out').appendChild(phone.video);
                PUBNUB({
                        pubkey: pubkey
                        , subkey: subkey
                        , ssl: true
                }).publish({
                        channel: "BROADCASTER1234"
                        , message: { notify: "reload" }
                });
        });

        // When Call Comes In
        phone.receive(function (session) {
                console.log("new viewer joined");
                session.ended(session => console.log('viewr left'));
        });

})();