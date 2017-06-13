var soundEffect = document.querySelector('#soundEffect');
// Sound effect
var player;
function onYouTubeIframeAPIReady(){
    console.log('Sound effect is ready');
    player = new YT.Player('soundEffect', {
    height: '0',
    width: '0',
    videoId: 'MU4HMhic6AU',
    events: {
        onStateChange: function(event){
            if(event.data === 0) {
                player.stopVideo();
            }
        }
    }
    });
}