# Lever Postings API

![job postings api](https://cloud.githubusercontent.com/assets/1847828/19331557/2c2a5e9c-909a-11e6-8eb4-161bd37aeea3.jpg)

## Table of contents

* [Introduction](https://github.com/lever/postings-api/blob/master/README.md#introduction)
* [Examples](https://github.com/lever/postings-api/blob/master/README.md#examples)
* [API methods](https://github.com/lever/postings-api/blob/master/README.md#api-methods)
  * [Sites](https://github.com/lever/postings-api/blob/master/README.md#sites)
  * [Get a list of job postings](https://github.com/lever/postings-api/blob/master/README.md#get-a-list-of-job-postings)
  * [Get a specific job posting](https://github.com/lever/postings-api/blob/master/README.md#get-a-specific-job-posting)
  * [Apply to a job posting](https://github.com/lever/postings-api/blob/master/README.md#apply-to-a-job-posting)
  * [iFrame resizing](https://github.com/lever/postings-api/blob/master/README.md#iframe-resizing)
 * [Third-party Libraries](https://github.com/lever/postings-api/blob/master/README.md#third-party-libraries)


## Introduction

This repository contains documentation and example apps for the Lever Postings
REST API. This API is designed to help you create a job site. If you need any
features which are missing in this API or if you find any issues, please [create a ticket](https://help.lever.co/hc/en-us/requests/new) or file an issue on this repository.

You do not need to use this API to get started with Lever job postings. All
published job postings are also automatically viewable via your Lever-hosted job site (e.g. `https://jobs.lever.co/leverdemo`).

**NOTE:** When relevant, multiple URL examples are provided for the instances we support: `global` (default) and `EU`.

### This API lets you:

- Get paginated job postings for your company
- Get job postings which match particular queries
- Get individual job postings (if you know their Posting ID)
- Programmatically apply to a job posting


### The API does not:

- Let you do full-text searches over open jobs.
- Support cross-origin HTTP requests from sites outside of your company's domains/subdomains.
    - Note: The postings API _does_ support cross-origin requests from your company's domains/subdomains, via CORS. For example, requests from `yourcompanyname.com` and subdomains like `careers.yourcompanyname.com` are allowed.
- Let you access internal job postings.
- Provide an iframe view for job detail pages or for application forms. You
  should either send applicants to the jobs site hosted at your Lever-hosted job site ([global][lever-job-site-global] / [EU][lever-job-site-eu]) or build your own detail view and application form on top of our JSON API.
- Let you specify custom success and error URLs for job postings.
- Expose custom questions built into your job postings.
- Add referral information.

If you are concerned about any features, please [reach out to
us](https://help.lever.co/hc/en-us/requests/new) and we'll prioritize the feature(s)
you need.

Note that all job postings in the `published` state are publicly viewable.
These jobs may be scraped by third parties. All other jobs are completely
hidden from the jobs API.

## Examples
[](#examples)
These examples use the jQuery.ajax function to get lists of jobs and all use the global instance base url (i.e. `https://api.lever.co/v0/postings/`).

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

[Search and filtering example](https://codepen.io/andreasmb/pen/pXJeLB)

Uses List.js to add search and filtering functionality similar to the Lever-hosted job site.

[<img src="https://user-images.githubusercontent.com/1847828/65989057-d178be80-e43d-11e9-8999-8195681c5f68.png">](https://codepen.io/andreasmb/pen/pXJeLB)

# API Methods

The API is [RESTful](http://www.infoq.com/articles/rest-introduction) and all
responses are HTML (for inlining) or serialized [JSON](http://json.org/).

All API methods are exposed under our postings base url ([global][postings-api-base-url-global] / [EU][postings-api-base-url-eu]).

The API is not available via unencrypted HTTP.

All URL parameters must be properly URL encoded.

The API will output HTML or JSON based on the `Accept:` header and the `?mode=`
query parameter. If both are provided, the query parameter has a higher
precedence.


### Sites

All job postings are name-spaced within a unique site name. Each company
currently only has one site (usually your company name with no spaces). For
example, Lever's job postings are under the site name `lever`, so they appear
at [this API link][lever-postings-api-global] and [this job site link][lever-job-site-global]
for those on the global instance and [this API link][lever-postings-api-eu] and [this job site link][lever-job-site-eu] for those on the EU instance.


## Get a list of job postings

> GET /v0/postings/SITE?skip=X&limit=Y

Examples: [global][leverdemo-postings-api-get-list-global] / [EU][leverdemo-postings-api-get-list-eu]

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
| location        | Filter postings by location. You can specify multiple values and they are *OR*'ed together. Note: when specifying multiple values, this field is case sensitive! To specify multiple values, use the format `?location=Oakland&location=Boston`. |
| commitment      | Filter postings by commitment. You can specify multiple values and they are *OR*'ed together. Note: when specifying multiple values, this field is case sensitive! To specify multiple values, use the format `?commitment=Fulltime&commitment=Intern`. |
| team            | Filter postings by team. You can specify multiple values and they are *OR*'ed together. Note: when specifying multiple values, this field is case sensitive! To specify multiple values, use the format `?team=Product&team=Engineering`. |
| department            | Filter postings by department, if your company uses departments. You can specify multiple values and they are *OR*'ed together. Note: when specifying multiple values, this field is case sensitive! To specify multiple values, use the format `?department=Legal&department=Operations`. |
| level           | Filter postings by level. |
| group           | May be one of `location`, `commitment`, or `team`. Returns results grouped by category |
| css             | In iframe mode, the URL of a CSS stylesheet |
| resize          | In iframe mode, the URL of an HTML page with a script for resizing the iframe. (See usage below) |


In JSON mode, each job posting is a JSON object with the following fields:

| Field       | Description                   |
| ----------- | ----------------------------- |
| id          | Unique job posting ID
| text        | Job posting name
| categories  | Object with location, commitment, team, and department
| country     | An ISO 3166-1 alpha-2 code for a country / territory (or null to indicate an unknown country). This is not filterable
| description | Job description (as styled HTML).
| descriptionPlain | Job description (as plaintext).
| lists       | Extra lists (such as requirements, benefits, etc.) from the job posting. This is a list of `{text:NAME, content:"unstyled HTML of list elements"}`
| additional  | Optional closing content for the job posting (as styled HTML). This may be an empty string.
| additionalPlain  | Optional closing content for the job posting (as plaintext). This may be an empty string.
| hostedUrl   | A URL which points to Lever's hosted job posting page. Examples: [global][leverdemo-job-site-posting-global] / [EU][leverdemo-job-site-posting-eu]
| applyUrl    | A URL which points to Lever's hosted application form to apply to the job posting. Examples: [global][leverdemo-job-site-posting-application-global] / [EU][leverdemo-job-site-posting-application-eu]

## Get a specific job posting

> GET /v0/postings/SITE/POSTING-ID

Examples: [global][leverdemo-postings-api-get-specific-posting-global] / [EU][leverdemo-postings-api-get-specific-posting-eu]

Get the named job posting by id. The fields which are available are the same as
the fields exposed by the list API (above). This API only returns the named job
posting in JSON format. (There is no iframe view or inline HTML view).

## Apply to a job posting

**WARNING: Application create requests are rate limited. Your team will need to properly handle `429` responses if you build a custom job application page.** If you are unable to implement this logic, please consider directing to Lever's hosted application form instead of implementing a custom application form. [See more below](#POST-Application-Rate-Limit).

> POST /v0/postings/SITE/POSTING-ID?key=APIKEY

You can add job applicants via a custom form on your site. Our API accepts
candidate information in either JSON format or multipart form-data. However,
our API only accepts resumes in multipart form data mode. Use a `Content-Type` header to instruct our server which format you're using. (Either `application/json` for JSON or `application/x-www-form-urlencoded` or `multipart/form-data` as appropriate).

The API is modeled off our hosted jobs form. Required fields and url fields can be customized per account. To determine what the job form looks like, look at any job application form for on your Lever-hosted job site ([global][job-site-global] / [EU][job-site-eu]) or visit your job site settings page ([global][lever-job-site-settings-global] / [EU][lever-job-site-settings-eu]).

To use the POST API, you need an API key, which a Super Admin of your account can generate from your integrations settings page ([global][lever-integrations-settings-global] / [EU][lever-integrations-settings-eu]).

Two fields are required by our system in order to create a candidate: name and email address. Required fields are also required when submitting against the POST API. Lever account administrators can customize their job applications and choose to make other fields required, too. Please make sure you coordinate with your Lever administrator to learn which fields on the job application they've selected as required.

When testing, be aware that Lever de-dupes candidates using the email address field. You won't see duplicate testing candidates appear within your Lever account ([global][lever-site-global] / [EU][lever-site-eu]).

If you don't have email addresses of the candidate available and you MUST create a candidate, you can submit any string that is unique and includes an "@" symbol. If you have a standard string, we will merge candidate records using that string.

Except for resume uploading, all of the fields are available in both JSON mode
and multipart form-data mode. The name and email address fields are both
required. The candidate will be emailed after they apply to the job, unless the `silent` field is set to true.

| Field               | Description                   |
| ------------------- | ----------------------------- |
| `name` (*required*) | Candidate's name
| `email` (*required*)| Email address. Requires an "@" symbol. Candidate records will be merged when email addresses match.
| `resume`            | Resume data. Only in `multipart/form-data` mode. Should be a file.
| `phone`             | Phone number
| `org`               | Current company / organization
| `urls`              | URLs for sites (Github, Twitter, LinkedIn, Dribbble, etc). Should be a JSON object like `{"GitHub":"https://github.com/"}` for `JSON`, or `urls[GitHub]=https://github.com/` for `multipart/form-data`
| `comments`          | Additional information from the candidate
| `silent`            | Disables confirmation email sent to candidates upon application. Accepts values of `true`, `false`, `"true"` or `"false"`.
| `source`            | Adds a source tag to candidate (e.g. 'LinkedIn')
| `ip`                | IP application was submitted from, used for detecting country for compliance reasons (e.g. `"184.23.195.146"`)
| `consent`           | Indicate whether candidate is open to being contacted about future opportunities (e.g. `"consent":{"marketing":true}` for `JSON` or `consent[marketing]=true` for `multipart/form-data`)

The server will respond with JSON object.

- On success, **200 OK** and a body of `{ok:true, applicationId: '...'}`
- The applicationId returned can be used to view the candidate profile in Lever by adding it to the end of this URL ([global][lever-application-search-global] / [EU][lever-application-search-eu]).
  - Note that only users logged into Lever will be able to access that page.
- On error, we'll send the appropriate HTTP error code and a body of `{ok:false, error:<error string>}`.

### POST Application Rate Limit

To guard against possible misuse of Lever's APIs and maintain high availability, Lever will return a `429` status code (`TOO MANY REQUESTS`) if your custom job site issues more than 2 application POST requests per second. This rate limit may also be changed without warning if necessary to maintain the stability of Lever's systems. To avoid losing applicants, you must either implement your own logic to queue and retry application POST requests that receive a 429 response or direct candidates to Lever's hosted application form.

When implementing a custom job site, directing candidates to Lever's hosted application form is considered a best practice. Lever's application form properly handles all custom form configurations, has an excellent candidate experience, and maintains very high availability including queuing and retries at peak times.

If you do choose to implement a fully custom application form, please remember to:

* Retry all requests that receive a 429 response
* Queue application requests in case you receive a temporary increase in applications that exceeds Lever's application POST rate limit
* Implement spam mitigations such as captchas and session or IP based rate limits

If you do not retry application POST requests upon receiving a 429 response, you will unfortunately lose candidate applications.

## Iframe resizing

If you include Lever's postings list in an iframe, you will likely want to
resize the height of the iframe to its contents. Since the iframe is served
from a different domain than your site, you can't directly measure its size
from JavaScript in the containing window.

To work around this cross-domain restriction, the postings iframe can
communicate its height via an HTML page also served from your domain. The URL
of this page is passed in as the `resize` parameter in the Lever iframe URL.

Below is a visual example using the global instance:

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

## Third-party Libraries

Some developers have kindly contributed Posting API clients for different programming languages. If you know something that is missing from this page, please [create a pull request](https://github.com/lever/postings-api/pull/new/master).

Please note that the software is not endorsed or certified by Lever.

### PHP
* [mjacobus/lever-api-client](https://github.com/mjacobus/lever-api-client)

### Gatsby - Blazing-fast static site generator for React
* [mjacobus/lever-api-client](https://www.gatsbyjs.org/packages/gatsby-source-lever/)

[job-site-global]: https://jobs.lever.co/
[job-site-eu]: https://jobs.eu.lever.co/
[leverdemo-job-site-posting-global]: https://jobs.lever.co/leverdemo/5ac21346-8e0c-4494-8e7a-3eb92ff77902
[leverdemo-job-site-posting-eu]: https://jobs.eu.lever.co/leverdemo/5ac21346-8e0c-4494-8e7a-3eb92ff77902
[leverdemo-job-site-posting-application-global]: https://jobs.lever.co/leverdemo/5ac21346-8e0c-4494-8e7a-3eb92ff77902/apply
[leverdemo-job-site-posting-application-eu]: https://jobs.eu.lever.co/leverdemo/5ac21346-8e0c-4494-8e7a-3eb92ff77902/apply
[leverdemo-postings-api-get-list-global]: https://api.lever.co/v0/postings/leverdemo?skip=1&limit=3&mode=json
[leverdemo-postings-api-get-list-eu]: https://api.eu.lever.co/v0/postings/leverdemo?skip=1&limit=3&mode=json
[leverdemo-postings-api-get-specific-posting-global]: https://api.lever.co/v0/postings/leverdemo/5ac21346-8e0c-4494-8e7a-3eb92ff77902
[leverdemo-postings-api-get-specific-posting-eu]: https://api.eu.lever.co/v0/postings/leverdemo/5ac21346-8e0c-4494-8e7a-3eb92ff77902
[postings-api-base-url-global]: https://api.lever.co/v0/postings/
[postings-api-base-url-eu]: https://api.eu.lever.co/v0/postings/
[lever-job-site-global]: https://jobs.lever.co/lever
[lever-job-site-eu]: https://jobs.eu.lever.co/lever
[lever-postings-api-global]: https://api.lever.co/v0/postings/lever
[lever-postings-api-eu]: https://api.eu.lever.co/v0/postings/lever
[lever-job-site-settings-global]: https://hire.lever.co/settings/site
[lever-job-site-settings-eu]: https://hire.eu.lever.co/settings/site
[lever-integrations-settings-global]: https://hire.lever.co/settings/integrations?tab=api
[lever-integrations-settings-eu]: https://hire.eu.lever.co/settings/integrations?tab=api
[lever-site-global]: https://hire.lever.co
[lever-site-eu]: https://hire.eu.lever.co
[lever-application-search-global]: https://hire.lever.co/search/application/
[lever-application-search-eu]: https://hire.eu.lever.co/search/application/
