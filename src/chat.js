module.exports = io => {
    const users = {}
    const randomstring = require('randomstring');
    const escapeHtml = require('escape-html');
    io.on('connection', (socket) => {
        // Someone join
        const uid = randomstring.generate(30);
        users[uid] = {
            id: socket.id
        };

        io.emit('user:new', {
            uid: users,
            yourID: uid,
        });
        // Someone leave
        socket.on('disconnect', () => {
            delete users[uid];
            io.emit('user:leave', {
                uid: users,
            });
        });

        // Someone send a message
        socket.on('chat:send', payload => {
            console.log(`${payload.from}: ${payload.msg} to ${payload.to}`);

            // Check for slash commands
            if(payload.msg.startsWith('/')){
                const cmd = payload.msg.split(' ')[0];
                switch (cmd){
                    case '/username':
                        const username = payload.msg.split(' ')[1];
                        console.log(`${uid} update username to ${username}`);
                        users[uid]['username'] = username;
                        io.emit('user:update:username', {
                            uid: users,
                        });
                    break;
                }
            }

            // Filter out all the user HTML things
            payload.msg = escapeHtml(payload.msg);

            // Make URL to a tag
            const isURL = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/igm;
            if(payload.msg.match(isURL)){
                const urls = payload.msg.match(isURL);
                urls.forEach(url => {
                    payload.msg = payload.msg.replace(url, `<a href="${url}" target="_blank">${url}</a>`);
                });
            }

            // Replace image
            const isImage = /:(.*):/igm;

            if(payload.msg.match(isImage)){
                const imageSource = payload.msg.match(isImage);
                imageSource.forEach(src => {
                    payload.msg = payload.msg.replace(src, `<img src="${src.slice(1, -1)}" class="in-app-tag image">` );
                });
            }

            io.to(users[payload.to].id).emit(`chat:get`, {
                msg: payload.msg,
                from: payload.from,
            });
            
        });
        
    });
}