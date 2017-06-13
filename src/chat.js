module.exports = (io) => {
    const path = require('path');
    const randomstring = require('randomstring');
    const sha256 = require('sha256');

    const users = {};
    io.on('connection', function(socket){
        const uid = randomstring.generate(50);
        users[uid] = true;
        io.emit('user:new', {
            uid: users,
            yourID: uid
        });
        console.log(Object.keys(users).length)
        // socket.on('disconnect', (payload)  => {
        //     delete users[uid];
        //     io.emit('user:leave', {
        //         uid: users,
        //     });
        // });


        socket.on('chat:send', (payload) => {
            const msg = payload.msg;
            const to = payload.to;
            const from = payload.from;
            // Send the message to the user
            console.log(`msg: ${msg} from ${from}`)
            io.emit(`chat:get:${to}`, {
                msg: msg,
                from: from,
            });
        });

    });
}