module.exports = io => {
    const users = require('./index').users;
    const randomstring = require('randomstring');
    const escapeHtml = require('escape-html');
    io.on('connection', (socket) => {
        // Someone join
        const uid = randomstring.generate(30);
        users[uid] = true;
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
            socket.emit(`chat:get:${payload.to}`, {
                msg: payload.msg,
                from: payload.from,
            });
        });
        
    });
}