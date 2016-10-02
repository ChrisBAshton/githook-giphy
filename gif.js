module.exports = function (gh) {

    var request      = gh.modules.request,
        authRequest  = gh.modules.authRequest,
        PAYLOAD      = gh.data.payload,
        prWasEdited  = PAYLOAD.action === 'opened' || PAYLOAD.action === 'edited',
        wantsGif     = PAYLOAD.pull_request.body.match(/{giphy ['"](.+)['"]}/);

    if (prWasEdited && wantsGif) {

        var shortcode     = wantsGif[0],
            searchTerm    = wantsGif[1];

        // this is a public API key - see https://github.com/Giphy/GiphyAPI
        // we should swap it for a proper key eventually
        var apiUrl = 'http://api.giphy.com/v1/gifs/translate?api_key=dc6zaTOxFJmzC&s=' + encodeURIComponent(searchTerm);

        request.get(apiUrl, function giphyReceived(err, httpResponse, body) {

            var giphyResponse = JSON.parse(body);
            var newMarkup;

            if (giphyResponse.data) {
                newMarkup = '![gif auto-fetched by GitHook-Giphy: "' + searchTerm + '"](' + giphyResponse.data.images.downsized_large.url + ')';
            }
            else {
                '![GitHook-Giphy could not find a gif for "' + searchTerm + '". Have a wilting spoon instead.](https://media.giphy.com/media/MYmFHQ3puVjsQ/giphy.gif)';
            }

            PAYLOAD.pull_request.body = PAYLOAD.pull_request.body.replace(shortcode, newMarkup);

            var options = {
                url: PAYLOAD.pull_request.url,
                json: {
                    "body": PAYLOAD.pull_request.body
                }
            };

            authRequest.post(options, function templatePosted(err, httpResponse, body) {
                if (err) {
                    gh.process.fail('Could not send POST request: ' + err);
                }
                else {
                    gh.process.succeed('Gif was successfully fetched from Giphy and applied to PR.');
                }
            });
        });
    }
    else {
        gh.process.succeed();
    }
};
