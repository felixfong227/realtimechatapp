const socket = io();
const uids = document.querySelector('#uids');
const msgBox = document.querySelector('#msgBox .msg');
const msgBoxFrom = document.querySelector('#msgBox .from');
const inputBox = document.querySelector('#inputBox textarea');
let msgTo = 'No one';
let yourIDLock = false;
let yourID;
const updateingDOM = false;

inputBox.placeholder = `Message to (${msgTo})`;


function renderList(payload) {
    // Find the total height
    if (!yourIDLock) {
        yourID = payload.yourID;
        yourIDLock = true;
    }
    uids.innerHTML = null;
    // Check for username
    for (const key in payload.uid) {
        if (payload.username) {
            const username = payload.username;
            // User have username
            if (key == yourID) {
                uids.innerHTML += `<div class="uid" onclick="startNewChat(this.id)" id="${key}">${username}(You)(${key})` + '</div>';
            } else {
                uids.innerHTML += `<div class="uid" onclick="startNewChat(this.id)" id="${key}">${username}(${key})` + '</div>';
            }
        } else if (key == yourID) {
                uids.innerHTML += `<div class="uid" onclick="startNewChat(this.id)" id="${key}">${key}(You)</div>`;
            } else {
                uids.innerHTML += `<div class="uid" onclick="startNewChat(this.id)" id="${key}">${key}</div>`;
            }
    }
    const totalHeight = uids.clientHeight;
    // On get message
    socket.on('chat:get', (payload) => {
        // Send push notification if user allow it
        if (userSettings.notification === 'true') {
            Push.create('New Message', {
                body: payload.rawText,
                timeout: 4000,
                onClick() {
                    window.focus();
                    this.close();
                },
            });
        }
        if (userSettings.soundeffect === 'true') {
            player.playVideo();
        }
        msgBox.innerHTML = payload.msg;
        msgBoxFrom.innerHTML = `From: ${payload.from}`;
    });
}

socket.on('user:new', (payload) => {
    renderList(payload);
});
socket.on('user:leave', (payload) => {
    renderList(payload);
});

socket.on('user:update:username', (payload) => {
    renderList(payload);
});


function startNewChat(id) {
    inputBox.focus();
    msgTo = id;
    // Update the DOM
    inputBox.placeholder = `Message to (${msgTo})`;
}

inputBox.addEventListener('keydown', function (e) {
    if (msgTo !== 'No one') {
        if (e.keyCode === 13 /* ENTER */) {
            // See if the user already press ENTER
            e.preventDefault();
            if (e.shiftKey) {
                // Make a new line
                this.value += '\n';
                return false;
            }
            const text = this.value;
            if (!text.length <= 0) {
                this.value = null;
                // Send message to the server
                socket.emit('chat:send', {
                    to: msgTo,
                    msg: text,
                    from: yourID,
                });
            }
        }
    } else {
        inputBox.placeholder = 'You have to choose someone to chat first';
        e.preventDefault();
    }
});
