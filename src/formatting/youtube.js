module.exports = (message) => {
    const isYouTubeLink = new RegExp(/https:\/\/www.youtube.com\/watch\?v=([^\s]+)/igm);
    let isYoutube = false;
    if (message.match(isYouTubeLink)) {
        isYoutube = true;
        const youtubeLinks = message.match(isYouTubeLink);
        youtubeLinks.forEach((ytLink) => {
            const youtubeWathcID = ytLink.split('watch?v=')[1];
            message = message.replace(ytLink, '');
            message += `<iframe class="in-app-tag youtube-embed" src="https://www.youtube-nocookie.com/embed/${youtubeWathcID}" frameborder="0" allowfullscreen></iframe>`;
        });
    }
    return {
        isYoutube,
        msg: message,
    };
};
