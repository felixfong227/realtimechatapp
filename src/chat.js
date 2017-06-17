/*
describe:
A SocketIO backend
*/
module.exports = io => {
    const users = {}
    const randomstring = require('randomstring');
    const escapeHtml = require('escape-html');
    const request = require('request');
    const cookie = require('cookie');
    const showdown  = require('showdown');
    /*
    describe:
    When someone is connected, like open the web app inside a browser
    */
    io.on('connection', (socket) => {
        // Someone join
        const uid = randomstring.generate(30);
        users[uid] = {
            id: socket.id
        };
        // Check if the user already contain an username
        const socketCookie = cookie.parse(socket.handshake.headers.cookie);
        /*
        describe:
        Emit a user:new even to the client with uid, yourID, username
        */
        io.emit('user:new', {
            uid: users,
            yourID: uid,
            username: socketCookie.username || null,
        });

        /*
        describe:
        When someone leave the connection
        */
        socket.on('disconnect', () => {
            delete users[uid];
            io.emit('user:leave', {
                uid: users,
            });
        });

        /*
        describe:
        Someone send a message
        */
        socket.on('chat:send', payload => {
            console.log(`${payload.from}: ${payload.msg} to ${payload.to}`);

            const rawInput = payload.msg;

            /*
            describe:
            Doing some text formatting functinos
            */

            const isYouTubeLink = new RegExp(/https:\/\/www.youtube.com\/watch\?v=([^\s]+)/igm);
            const isImage = new RegExp(/:(.*):/igm);
            const isURL = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/igm);
            const isSoundCloud = new RegExp(/https:\/\/soundcloud.com\/(.*) /igm);

            // Check for slash commands
            // if(payload.msg.startsWith('/')){
            //     const cmd = payload.msg.split(' ')[0];
            //     switch (cmd){
            //         case '/username':
            //             const username = payload.msg.split(' ')[1];
            //             console.log(`${uid} update username to ${username}`);
            //             users[uid]['username'] = username;
            //             io.emit('user:update:username', {
            //                 uid: users,
            //             });
            //         break;
            //     }
            // }

            // Filter out all the user HTML things
            payload.msg = escapeHtml(payload.msg);


            // Make URL to a tag
            if(payload.msg.match(isURL) && payload.msg.match(isYouTubeLink) === null){
                const urls = payload.msg.match(isURL);
                urls.forEach(url => {
                    // Check for makrdown image
                    // Cuz markdown image will endwith ) like https://someurl.com/image.png)
                    if(!url.endsWith(')')){
                        payload.msg = payload.msg.replace(url, `<a href="${url}" target="_blank">${url}</a>`);
                    }
                });
            }

            // Makrdown support
            const markdownConverter = new showdown.Converter();
            payload.msg = markdownConverter.makeHtml(payload.msg);

            // Replace YouTube link to a YouTube embed object
            
            if(payload.msg.match(isYouTubeLink)){
                const youtubeLinks = payload.msg.match(isYouTubeLink);
                youtubeLinks.forEach(ytLink => {
                    const youtubeWathcID = ytLink.split('watch?v=')[1];
                    payload.msg = payload.msg.replace(ytLink, '');
                    payload.msg += `<iframe class="in-app-tag youtube-embed" src="https://www.youtube-nocookie.com/embed/${youtubeWathcID}" frameborder="0" allowfullscreen></iframe>`;
                });
            }

            // Replace new line char to <br>
            payload.msg = payload.msg.replace(/\n/igm, '<br>');

            // Replace SoundCloud url to SoundCloud embed
            // if(payload.msg.match(isSoundCloud)){
            //     const urls = payload.msg.match(isSoundCloud)
            //     urls.forEach(url => {
            //         url = url.split(' ')[0];
            //         url = url.replace('https://soundcloud.com/', '');
            //         payload.msg = payload.msg.replace(`https://soundcloud.com/${url}`, '');
            //         payload.msg = payload += `<ifr/ame class="in-app-tag soundcloud-embed" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/55221233&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>`
            //     })
            // }

            /*
            describe:
            Send back the formated text
            */
        
            io.to(users[payload.to].id).emit(`chat:get`, {
                msg: payload.msg,
                from: payload.from,
                rawText: rawInput,
            });

        });
        
    });
}