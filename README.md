# searchadder

[searchadder](searchadder.pages.dev) is a simple tool to add custom search engines to your browser.

## Usage

* Set the Name and URL of your custom search engine (replace the query with `%s`)
* Click "Update Search"
* Click "Do dummy search"
* Set the search engine in Chrome settings > Search Engine > Recently Visited
* If it doesn't appear, ¯\\\_(ツ)\_/¯

## Examples

* Google AI Mode <https://searchadder.pages.dev/?name=Google+AI+Mode&url=https%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3D%25s%26udm%3D50>
* Ecosia AI Search <https://searchadder.pages.dev/?name=Ecosia+AI&url=https%3A%2F%2Fwww.ecosia.org%2Fai-search%3Fq%3D%25s>
* Brave Ask <https://searchadder.pages.dev/?name=Brave+Ask&url=https%3A%2F%2Fsearch.brave.com%2Fask%3Fq%3D%25s>

## Why

Google Chrome on Android doesn't provide any way to set a custom search engine.
I previously used essentially a static version of this with a hardcoded OpenSearch XML.
However, having to deploy a new Cloudflare Pages website for every search engine I want to add to Chrome is rather cumbersome.
So I made this.

![](https://imgs.xkcd.com/comics/automation.png)


## Google Chrome Quirks

Chrome on Android is very fussy about showing custom search engines.
Sometimes the search engine will disappear and randomly reappear.
Additionally, Chrome seems to only allow one custom search engine entry per domain.
Setting a new search engine on searchadder will replace the existing entry automagically (seemingly without updating the icon or name).
With the current approach, this does mean that an attacker can set your search engine by redirecting you to a searchadder URL.

## Deployment

searchadder is designed to be deployed to Cloudflare Pages.

```
npm run deploy
```

## Technical details

Search engines use a specification called [the OpenSearch description format](https://developer.mozilla.org/en-US/docs/Web/XML/Guides/OpenSearch) to tell your browser what search engines are on the page.
Your browser will use this specification to show them to you in your search settings.
You could try to generate this specification client-side and shove it into a data URI, however at least in the case of Google Chrome this won't actually work.
As far as I can tell, the OpenSearch description must be served on a valid (HTTPS?) domain.
To get around this, searchadder uses a Cloudflare Pages function to dynamically generate and serve the OpenSearch descriptions.

## Misc

[favicon](https://commons.wikimedia.org/wiki/File:Adder_(PSF).png)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.