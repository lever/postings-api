var express = require('express');
var request = require('request');

// Change this to your postings site shortname.
var SITE = 'lever';

var BASE = 'https://api.lever.co/v0/postings/' + SITE;

var app = express();

// At the root page, we'll display all postings.
app.get('/', function(req, res, next) {
  // Get postings from REST api.
  request({url:BASE, json:true}, function(err, r, postings) {
    if (err) {
      next(err);
      return;
    }

    // You should use a templating engine to render the postings list.
    var page = "<!DOCTYPE html>\n";
    page += "<h1>Come work at my rad company!</h1>\n"

    for (var i = 0; i < postings.length; i++) {
      var posting = postings[i];

      page += "<div>";
      page += "<a href='" + posting.id + "'>" + posting.text + "</a>";
      page += "</div>\n";
    }
    res.send(page);
  });
});

// Display the named posting
app.get('/:id', function(req, res, next) {
  // Get the specified posting
  var id = req.params.id;
  request({url:BASE + '/' + id, json:true}, function(err, r, posting) {
    if (err) {
      next(err);
      return;
    }

    // If the posting doesn't exist (or some other error occurs), we'll forward
    // the error to our user.
    if (r.statusCode !== 200) {
      res.send(r.statusCode);
      return;
    }

    // Render the posting. Again, you should use a templating engine to render
    // this.
  
    // There's a few more fields available in the posting object that I'm not
    // using here including location, team, commitment, tags and posting date.
    var page = "<!DOCTYPE html>\n";
    page += "<title>" + posting.text + "</title>\n";
    page += "<h1>" + posting.text + "</h1>\n";
    page += "<p>" + posting.description + "</p>\n";
    for (var i = 0; i < posting.lists.length; i++) {
      var list = posting.lists[i];
      page += "<p>" + list.text + "</p>\n";
      page += "<div>" + list.content + "</div>\n";
      page += "<br>";
    }

    if (posting.additional) {
      page += "<p>" + posting.additional + "</p>\n";
    }

    page += "<a href='" + posting.applyUrl + "'>Apply now!</a>\n";

    res.send(page);
  });
});

port = process.env.PORT || 5000;
app.listen(port);
console.log('Listening on http://localhost:' + port + '/');
