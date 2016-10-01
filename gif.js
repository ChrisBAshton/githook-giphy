module.exports = function (data, process) {

    var request      = require('request'),
        PAYLOAD      = data.payload,
        prWasEdited  = PAYLOAD.action === 'opened' || PAYLOAD.action === 'edited',
        wantsGif     = PAYLOAD.pull_request.body.match(/{giphy "(.+)"}/);

    if (prWasEdited && wantsGif) {

        var searchTerm = encodeURIComponent(wantsGif[1]);

        // this is a public API key - see https://github.com/Giphy/GiphyAPI
        // we should swap it for a proper key eventually
        var apiUrl = 'http://api.giphy.com/v1/gifs/translate?api_key=dc6zaTOxFJmzC&s=' + searchTerm;

        request.get(apiUrl, function giphyReceived(err, httpResponse, body) {

            var giphyResponse = JSON.parse(body);
            var newMarkup;

            if (giphyResponse.data) {
                newMarkup = '![gif auto-fetched by GitHook-Giphy: "' + wantsGif[1] + '"](' + giphyResponse.data.images.downsized_large.url + ')';
            }
            else {
                '![GitHook-Giphy could not find a gif for "' + wantsGif[1] + '". Have a wilting spoon instead.](https://media.giphy.com/media/MYmFHQ3puVjsQ/giphy.gif)';
            }

            PAYLOAD.pull_request.body = PAYLOAD.pull_request.body.replace(wantsGif[0], newMarkup);

            var options = {
                url:      PAYLOAD.pull_request.url,
                headers: {
                    'Content-Type':  'application/json',
                    'User-Agent':    'githook-giphy',
                    'Authorization': 'token ' + data.access_token
                },
                json: {
                    "body": PAYLOAD.pull_request.body
                }
            };

            request.post(options, function templatePosted(err, httpResponse, body) {
                if (err) {
                    process.fail('Could not send POST request: ' + err);
                }
                else {
                    process.succeed('Template POST message successful. Response:' + body);
                }
            });
        });
    }
    else {
        process.succeed(PAYLOAD.action + ' (payload action) was not "opened", so there was nothing to do here.');
    }
};
