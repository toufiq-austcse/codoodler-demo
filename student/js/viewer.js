(() => {
        'use strict';

        // ~Warning~ You must get your own API Keys for non-demo purposes.
        // ~Warning~ Get your PubNub API Keys: https://www.pubnub.com/get-started/
        // The phone *number* can by any string value
        const pubkey = 'pub-c-73c58b0d-5c27-4e4b-bb58-377024196a3c';
        const subkey = 'sub-c-4baa524e-5888-11eb-95c0-3253a07b53cf';
        const number = "BROADCAST-VIEWER";//(''+Math.random()*100000).split('.')[0];
    
        // Phone
        const phone = PHONE({
            number        : number
        ,   media         : { audio : true, video : false }
        ,   publish_key   : pubkey
        ,   subscribe_key : subkey 
        ,   ssl           : true
        });
    
        // Local Camera Display
        phone.ready( video => {
            console.log('Ready');
            //phone.$('video-out').appendChild(video);
        });
    
        // Debugging Output
        phone.debug( info => console.info(info) );
    
        // Receive Broadcaster Updates
        PUBNUB({
            pubkey  : pubkey
        ,   subkey  : subkey
        ,   ssl     : true
        }).subscribe({
            channel  : "BROADCASTER1234"
        ,   callback : message => message.notify == "reload" && location.reload(false)
        });
    
        // As soon as the phone is ready we can make calls
        phone.ready(()=>{
            phone.hangup();
            phone.dial("BROADCASTER-TEST");
            //setTimeout( () => playing || location.reload, 6000 );
        });
    
        // Broadcaster's Video
        var playing = false;
        phone.receive(function(broadcaster){
            console.log("Fetching broadcaster's video");
    
            // Display Your Friend's Live Video
            broadcaster.connected( broadcaster => {
                if (playing) return;
                playing = true;
                console.log("Playing broadcaster's video");
                PUBNUB.$('video-out').appendChild(broadcaster.video);
                setTimeout( phone.toggleAudio, 1000 );
                setTimeout( phone.toggleVideo, 1000 );
            });
    
            broadcaster.ended( broadcaster => {
                playing = false;
                console.log('Stream ended');
            });
        });
    })();