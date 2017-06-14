var socket = io();
var uids = document.querySelector('#uids');
var msgBox = document.querySelector('#msgBox .msg');
var msgBoxFrom = document.querySelector('#msgBox .from');
var inputBox = document.querySelector('#inputBox input');
var msgTo = 'No one';
var yourIDLock = false;
var yourID;
var updateingDOM = false;

inputBox.placeholder = 'Message to (' + msgTo + ')';


function renderList(payload){
    if(!yourIDLock){
        yourID = payload.yourID;
        yourIDLock = true;
    }
    uids.innerHTML = null;
    // Check for username
    for(var key in payload.uid){
        if(typeof payload.uid[key].username !== 'undefined'){
            // User have username
            uids.innerHTML += '<div class="uid" onclick="startNewChat(this.id)" id="'+key+'">'+ payload.uid[key].username + '('+key+')' +'</div>';
        }else{
            if(key == yourID){
                uids.innerHTML += '<div class="uid" onclick="startNewChat(this.id)" id="'+key+'">' + key + '(You)</div>';
            }else{
                uids.innerHTML += '<div class="uid" onclick="startNewChat(this.id)" id="'+key+'">' + key + '</div>';
            }
        }
    }
    // On get message
    socket.on('chat:get', (payload) => {
        Push.create('New Message', {
            body: payload.msg,
            timeout: 4000,
            onClick: function () {
                window.focus();
                this.close();
            }
        });
        player.playVideo();
        msgBox.innerHTML = payload.msg;
        msgBoxFrom.innerHTML = 'From: ' + payload.from;
    });

    socket.on('lol', payload => {
        console.log(payload);
    });

}

socket.on('user:new', function(payload){
    renderList(payload);
});
socket.on('user:leave', function(payload){
    renderList(payload);
});

socket.on('user:update:username', function(payload){
    renderList(payload);
});


function startNewChat(id){
    msgTo = id;
    // Update the DOM
    inputBox.placeholder = 'Message to (' + msgTo + ')';
    inputBox.addEventListener('keypress', function(e){
        if(e.keyCode === 13 /* ENTER */ ){
            var text = this.value;
            this.value = null;
            // Send message to the server
            socket.emit('chat:send', {
                to: msgTo,
                msg: text,
                from: yourID,
            });
        }
    });
}