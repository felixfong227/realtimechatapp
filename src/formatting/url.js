module.exports = (payload) => {
    const isURL = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/igm);
    let isURLMatch = false;
    if (payload.msg.match(isURL) && payload.isYoutube === false) {
        isURLMatch = true;
        const urls = payload.msg.match(isURL);
        urls.forEach((url) => {
            // Check for makrdown image
            // Cuz markdown image will endwith ) like https://someurl.com/image.png)
            if (!url.endsWith(')')) {
                payload.msg = payload.msg.replace(url, `<a href="${url}" target="_blank">${url}</a>`);
            }
        });
    }
    return {
        isURL: isURLMatch,
        msg: payload.msg,
    };
};
