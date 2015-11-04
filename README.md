# Lever Postings API

This repository contains documentation and example apps for the Lever Postings
REST API. This API is designed to help you create a jobs site. If you need any
features which are missing in this API or if you find any issues, please email us at
[support@lever.co](mailto:support@lever.co) or file an issue on this repository.

You do not need to use this API to get started with Lever job postings. All
published job postings are also automatically viewable via
`jobs.lever.co/yoursite`, for example
[jobs.lever.co/lever](https://jobs.lever.co/leverdemo)

### This API lets you:

- Get paginated job postings for your company
- Get job postings which match particular queries
- Get individual job postings (if you know their Posting ID)
- Programatically apply to a job posting


### The API does not:

- Let you do full-text searches over open jobs
- Support CORS headers for posting jobs from sites that are different from your
  domain or a subdomain. This means you can't make a pure-JavaScript job
  postings page if your jobs site isn't yourdomain.com or
  something.yourdomain.com.
- Let you access internal job postings.
- Provide an iframe view for job detail pages or for application forms. You
  should either send applicants to the jobs site hosted at jobs.lever.co or build
  your own detail view and application form on top of our JSON API.
- Let you specify custom success and error URLs for job postings.
- Expose custom questions built into your job postings.
- Add referral information.

If any of these shortcomings are annoying, please [reach out to
us](mailto:support@lever.co) or file an issue and we'll prioritize the feature(s)
you need.

Note that all job postings in the `published` state are publically viewable.
These jobs may be scraped by third parties. All other jobs are completely
hidden from the jobs API.

Note that application create requests are rate limited. Your team will need to properly handle 429 responses if you build a custom jobs page.

### Examples

These examples use the jQuery.ajax function to get lists of jobs.

[Simple list with two column layout](http://codepen.io/andreasmb/pen/uogcI)

Displays all jobs alphabetically.

[<img src="https://raw.github.com/lever/postings-API/master/images/2col.png">](http://codepen.io/andreasmb/pen/uogcI)


[Two column layout with team filter](http://codepen.io/andreasmb/pen/tGbyA)

Display all jobs, and let the user filter by team.

[<img src="https://raw.github.com/lever/postings-API/master/images/2col-filter.png">](http://codepen.io/andreasmb/pen/tGbyA)


[Single column layout with cards](http://codepen.io/andreasmb/pen/qgkIb)

Displays all jobs alphabetically, with each job in a card.

[<img src="https://raw.github.com/lever/postings-API/master/images/1col-cards.png">](http://codepen.io/andreasmb/pen/qgkIb)


[Single column layout with cover image](http://codepen.io/andreasmb/pen/kJfrc)

Displays jobs in a single column, with a cover image on top.

[<img src="https://raw.github.com/lever/postings-API/master/images/1col-hero-image.jpg">](http://codepen.io/andreasmb/pen/kJfrc)



# API Methods

The API is [RESTful](http://www.infoq.com/articles/rest-introduction) and all
responses are HTML (for inlining) or serialized [JSON](http://json.org/).

All API methods are exposed under `https://api.lever.co/v0/postings/`. The API
is not available via unencrypted HTTP.

The API will output HTML or JSON based on the `Accept:` header and the `?mode=`
query parameter. If both are provided, the query parameter has a higher
precedence.


### Sites

All job postings are namespaced within a unique site name. Each company
currently only has one site (usually your company name with no spaces). For
example, Lever's job postings are under the site name `lever`, so they appear
at [https://api.lever.co/v0/postings/lever](https://api.lever.co/v0/postings/lever)
or [https://jobs.lever.co/lever/](https://jobs.lever.co/lever/).


## Get a list of job postings

> GET /v0/postings/SITE?skip=X&limit=Y

Example [https://api.lever.co/v0/postings/leverdemo?skip=1&limit=3&mode=json](https://api.lever.co/v0/postings/leverdemo?skip=1&limit=3&mode=json)

The API will return the data in three different formats:

- **JSON**: *(recommended)* Jobs list as raw JSON. See below for a list of
  supplied fields.
- **HTML**: The API returns jobs as HTML, which is designed to be inlined in
  your page. The jobs are sent as an HTML `ul` list contained inside a `<div class='lever'>` for easy styling.
- **iframe**: This returns HTML designed to be embedded in an iframe in your
  jobs page. The HTML will import a CSS stylesheet from a URL specified by the
  `css=` parameter. Like HTML mode, the jobs are listed in a `ul` inside a
  `class='lever'` div. To make the iframe size itself correctly (to remove
  scroll bars), please see the section on iframe resizing below.

You can use the HTTP `Accept: application/json` header or `&mode=json` GET
parameter to specify the output mode. The URL parameter has higher precedence.

Fetch published job postings.

| Query parameter | Description                   |
| --------------- | ----------------------------- |
| mode            | The rendering output mode. JSON, iframe or HTML. |
| skip            | skip N from the start         |
| limit           | only return at most N results |
| location        | Filter postings by location. You can specify multiple values and they are *OR*'ed together. Note: when specifying multiple values, this field is case sensitive! |
| commitment      | Filter postings by commitment. You can specify multiple values and they are *OR*'ed together. Note: when specifying multiple values, this field is case sensitive! |
| team            | Filter postings by team. You can specify multiple values and they are *OR*'ed together. Note: when specifying multiple values, this field is case sensitive! |
| level           | Filter postings by level. |
| group           | May be one of `location`, `commitment`, or `team`. Returns results grouped by category |
| css             | In iframe mode, the URL of a CSS stylesheet |
| resize          | In iframe mode, the URL of an HTML page with a script for resizing the iframe. (See usage below) |


In JSON mode, each job posting is a JSON object with the following fields:

| Field       | Description                   |
| ----------- | ----------------------------- |
| id          | Unique job posting ID
| text        | Job posting name
| categories  | Object with location, commitment and team
| description | Job description
| lists       | Extra lists (such as requirements, benefits, etc.) from the job posting. This is a list of `{text:NAME, content:"unstyled HTML of list elements"}`
| additional  | Optional closing content for the job posting. This may be an empty string.
| hostedUrl   | A URL which points to Lever's hosted job posting page. [Example](https://jobs.lever.co/leverdemo/5ac21346-8e0c-4494-8e7a-3eb92ff77902)
| applyUrl    | A URL which points to Lever's hosted application form to apply to the job posting. [Example](https://jobs.lever.co/leverdemo/5ac21346-8e0c-4494-8e7a-3eb92ff77902/apply)



## Get a specific job posting

> GET /v0/postings/SITE/POSTING-ID

Example [https://api.lever.co/v0/postings/leverdemo/5ac21346-8e0c-4494-8e7a-3eb92ff77902](https://api.lever.co/v0/postings/leverdemo/5ac21346-8e0c-4494-8e7a-3eb92ff77902)

Get the named job posting by id. The fields which are available are the same as
the fields exposed by the list API (above). This API only returns the named job
posting in JSON format. (There is no iframe view or inline HTML view).


## Apply to a job posting

> POST /v0/postings/SITE/POSTING-ID?key=APIKEY

You can add job applicants via a custom form on your site. Our API accepts
candidate information in either JSON format or multipart form-data. However,
our API only accepts resumes in multipart form data mode. Use a `Content-Type` header to instruct our server which format you're using. (Either `application/json` for JSON or `application/x-www-form-urlencoded` or `multipart/form-data` as appropriate).

The API is modeled off our hosted jobs form. Required fields and url fields can be customized per account. To determine what the job form looks like, look at any job application form for your account on jobs.lever.co or visit [your job site settings page](https://hire.lever.co/settings/site).

To use the POST API you need an API key, which a Super Admin of your account can generate at https://hire.lever.co/settings/integrations?tab=api

When testing be aware that we dedup candidates using their email address. You
won't see duplicate testing candidates appear on hire.lever.co.

Except for resume uploading, all of the fields are available in both JSON mode
and multipart form-data mode. The name and email address fields are both
required. The candidate will be emailed after they apply to the job, unless the `silent` field is set to true


| Field             | Description                   |
| ----------------- | ----------------------------- |
| `name` (*required*) | Candidate's name
| `email` (*required*)| Email address
| `resume`            | Resume data. Only in `multipart/form-data` mode. Should be a file.
| `phone`             | Phone number
| `org`               | Current company / organization
| `urls`              | URLs for sites (Github, Twitter, LinkedIn, Dribbble, etc). Should be a JSON map or individual urls[GitHub], urls[Twitter], etc fields
| `comments`          | Additional information from the candidate
| `silent`            | Disables confirmation email sent to candidates upon application


The server will respond with JSON object.

- On success, **200 OK** and a body of `{ok:true, applicationId: '...'}`
- The applicationId returned can be used to view the candidate profile in Lever at the url: `https://hire.lever.co/search/application/{applicationId}`. Note that only users logged in to Lever will be able to access that page.
- On error, we'll send the appropriate HTTP error code and a body of `{ok:false, error:<error string>}`.



## Iframe resizing

If you include Lever's postings list in an iframe, you will likely want to
resize the height of the iframe to its contents. Since the iframe is served
from a different domain than your site, you can't directly measure its size
from JavaScript in the containing window.

To work around this cross-domain restriction, the postings iframe can
communicate its height via an HTML page also served from your domain. The URL
of this page is passed in as the `resize` parameter in the Lever iframe URL.

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


