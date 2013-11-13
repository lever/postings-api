# Lever Postings API

This repository contains documentation and example apps for the lever postings
REST API. The API is designed to help you make a jobs site. This API is still
quite new and its probably missing some important features. If you need any
features which are missing in this API or find any issues, please email us at
[support@lever.co](mailto:support@lever.co) or file an issue on this repository.

You do not need to use this API to get started with lever job postings. All
published job postings are also automatically viewable via
`jobs.lever.co/yoursite`, for example
[jobs.lever.co/lever](https://jobs.lever.co/lever)

### This API lets you:

- Get paginated job postings for your company
- Get job postings which match particular queries
- Get individual job postings


### The API does not:

- Let you write a custom job posting form, or programatically apply for any of
the postings. If this feature is important to you, please let us know and we
will prioritize it. You should link to `posting.applyUrl` which is at
[jobs.lever.co/site/postingId/apply](https://jobs.lever.co/lever/f6eb3fa6-0ba5-4178-b1ae-e4e0448ba175/apply).
- Let you do full-text searches over open jobs

Note that all jobs posted to lever are currently publically viewable. Internal-only job postings is on our roadmap but not implemented yet.


# API Methods

The API is [RESTful](http://www.infoq.com/articles/rest-introduction) and all
responses are serialized [JSON](http://json.org/).

All API methods are exposed under `api.lever.co/v0/postings/`.

### Sites

All job postings are namespaced within a unique site name. Each company
currently only has one site (usually your company name with no spaces). For
example, Lever's job postings are under the site name `lever`, so they appear
at [https://api.lever.co/v0/postings/lever](https://api.lever.co/v0/postings/lever)
or [https://jobs.lever.co/lever/](https://jobs.lever.co/lever/).


## Get a list of job postings

> GET /v0/postings/SITE?skip=X&limit=Y

Example [https://api.lever.co/v0/postings/lever?skip=1&limit=3&mode=json](https://api.lever.co/v0/postings/lever?skip=1&limit=3&mode=json)

Fetch all published job postings.

| Query parameter | Description                   |
| --------------- | ----------------------------- |
| mode            | The rendering output mode. json, iframe or html. |
| skip            | skip N from the start         |
| limit           | only return at most N results |
| location        | Filter postings by location. You can specify multiple values and they are *OR*'ed together |
| commitment      | Filter postings by commitment. You can specify multiple values and they are *OR*'ed together |
| team            | Filter postings by team. You can specify multiple values and they are *OR*'ed together |
| group           | May be one of `location`, `commitment`, or `team`. Returns results grouped by category |
| css             | In iframe mode, the URL of a css stylesheet |
| resize          | In iframe mode, the URL of an HTML page with a script for resizing the iframe. (See usage below) |


Each job posting is a JSON object with the following fields:

| Field       | Description                   |
| ----------- | ----------------------------- |
| id          | Unique Job ID
| text        | Posting name
| categories  | Object with location, commitment and team
| description | Job description
| lists       | Extra lists of things like requirements from the job posting. This is a list of `{text:NAME, content:"unstyled HTML of list elements"}`
| additional  | Optional closing content for the job posting. May be an empty string.
| id          | Unique Job ID
| hostedUrl    | A URL which points to lever's hosted job posting page. [Example](https://jobs.lever.co/lever/29511546-a7c9-451f-8b01-2010abbaca82)
| applyUrl    | A URL which points to lever's hosted application form to apply to the job posting. [Example](https://jobs.lever.co/lever/29511546-a7c9-451f-8b01-2010abbaca82/apply)


## Get a specific job posting

> GET /v0/postings/SITE/POSTING-ID

Example [https://api.lever.co/v0/postings/lever/f6eb3fa6-0ba5-4178-b1ae-e4e0448ba175](https://api.lever.co/v0/postings/lever/f6eb3fa6-0ba5-4178-b1ae-e4e0448ba175)

Get the named job posting by id. The fields which are available are the same as the fields exposed by the list API (above).


## Iframe resizing

If you include Lever's postings in an iframe, you will likely want to resize the height of the iframe to its contents. Since the iframe is served from a different domain than your site, you can't directly measure its size from JavaScript in the containing window.

To work around this cross-domain restriction, the postings iframe can communicate its height via an HTML page also served from your domain. The URL of this page is passed in as the `resize` parameter in the Lever iframe URL.

```
|------------------------------------------------------------------------------------------------------------------|
|  https://example.com/jobs                                                                                        |
|                                                                                                                  |
|  Your header, links, and other containing content.                                                               |
|                                                                                                                  |
|  |------------------------------------------------------------------------------------------------------------|  |
|  |  https://api.lever.co/v0/postings/box?mode=iframe&resize=https://example.com/resizeiframe.html             |  |
|  |                                                                                                            |  |
|  |  List of jobs served by Lever                                                                              |  |
|  |                                                                                                            |  |
|  |  |------------------------------------------------------------------------------------------------------|  |  |
|  |  |  https://example.com/resizeiframe.html?height=312                                                    |  |  |
|  |  |                                                                                                      |  |  |
|  |  |  Invisible iframe served by you. Purpose is passing the height to the top window                     |  |  |
|  |  |------------------------------------------------------------------------------------------------------|  |  |
|  |------------------------------------------------------------------------------------------------------------|  |
|------------------------------------------------------------------------------------------------------------------|
```

In `https://example.com/jobs`, the Lever iframe should be embedded in a manner similar to:

``` html
<iframe id="postings-iframe" seamless frameborder="0" allowtransparency="true" scrolling="no"
  src="https://api.lever.co/v0/postings/example?mode=iframe&resize=https://example.com/resizeiframe.html">
  Your browser does not appear to support iframes. See <a href="https://jobs.lever.co/example">all job postings</a>.
</iframe>
<script type="text/javascript">
  function resizePostings(height) {
    var iframe = document.getElementById('postings-iframe');
    if (iframe) {
      iframe.style.height = height + 'px';
    }
  }
</script>
```

At the `resize` URL (e.g. `https://example.com/resizeiframe.html`), you should serve a page with a corresponding script that reads the height parameter from the window location and passes it up to the top window. For example:

``` html
<!DOCTYPE html>
<meta charset="utf-8">
<title>Resize iframe</title>
<script type="text/javascript">
  (function() {
    // Parse height from query string
    var match = /[?&]height=([0-9]+)/i.exec(window.location.href);
    if (!match) return;
    var height = parseInt(match[1]);
    // Pass height to the resizePostings global function if it is defined
    // in the page including the postings iframe
    var resizePostings = window.parent.parent.resizePostings;
    if (typeof resizePostings === 'function') {
      resizePostings(height);
    }
  })();
</script>
```
