# GitHook Giphy
Automatically add animated gifs to your PRs.

## Usage
Just make sure you include `{giphy "search term"}` in your PR somewhere.

Example PR body:

```
This PR adds the foo to the bar.

{giphy "awesome"}

Testing:

* `mocha`
* etc...
```

This webhook is called whenever a PR is opened or edited. Not happy with your gif the first time around? Just edit your PR and add `{giphy "search term"}` again!

## Limitations
Currently only supports 1 `{giphy}` call per PR.

Currently uses the [public API key](https://github.com/Giphy/GiphyAPI), which is rate-limited.

------
![Powered by Giphy](https://raw.githubusercontent.com/cirla/vim-giphy/master/powered_by_giphy.gif)