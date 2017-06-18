var socket = io();
var uids = document.querySelector('#uids');
var msgBox = document.querySelector('#msgBox .msg');
var msgBoxFrom = document.querySelector('#msgBox .from');
var inputBox = document.querySelector('#inputBox textarea');
var msgTo = 'No one';
var yourIDLock = false;
var yourID;
var updateingDOM = false;

inputBox.placeholder = 'Message to (' + msgTo + ')';


function renderList(payload){
    // Find the total height
    if(!yourIDLock){
        yourID = payload.yourID;
        yourIDLock = true;
    }
    uids.innerHTML = null;
    // Check for username
    for(var key in payload.uid){
        if(payload.username){
            var username = payload.username;
            // User have username
            if(key == yourID){
                uids.innerHTML += '<div class="uid" onclick="startNewChat(this.id)" id="'+key+'">'+ username + '(You)('+key+')' +'</div>';
            }else{
                uids.innerHTML += '<div class="uid" onclick="startNewChat(this.id)" id="'+key+'">'+ username + '('+key+')' +'</div>';
            }
        }else{
            if(key == yourID){
                uids.innerHTML += '<div class="uid" onclick="startNewChat(this.id)" id="'+key+'">' + key + '(You)</div>';
            }else{
                uids.innerHTML += '<div class="uid" onclick="startNewChat(this.id)" id="'+key+'">' + key + '</div>';
            }
        }
    }
    var totalHeight = uids.clientHeight;
    // On get message
    socket.on('chat:get', (payload) => {
        Push.create('New Message', {
            body: payload.rawText,
            timeout: 4000,
            onClick: function () {
                window.focus();
                this.close();
            }
        });
        try{
            player.playVideo();
        }catch(error){
            console.log(error)
        }
        msgBox.innerHTML = payload.msg;
        msgBoxFrom.innerHTML = 'From: ' + payload.from;
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
    inputBox.focus();
    msgTo = id;
    // Update the DOM
    inputBox.placeholder = 'Message to (' + msgTo + ')';
}

inputBox.addEventListener('keydown', function(e){
    if(msgTo !== 'No one'){
        if(e.keyCode === 13 /* ENTER */ ){
            // See if the user already press ENTER
            e.preventDefault();
            if(e.shiftKey){
                // Make a new line
                this.value += '\n';
                return false;
            }
            var text = this.value;
            this.value = null;
            // Send message to the server
            socket.emit('chat:send', {
                to: msgTo,
                msg: text,
                from: yourID,
            });
        }
    }else{
        inputBox.placeholder = 'You have to choose someone to chat first';
        e.preventDefault();
    }
});