var express = require('express');
var request = require('request');
var creds = require('./.env.json');

var app = express();

app.get('/lastsprint', function(req, res) {
  var projectKey = 'MTE';
  var previousSprint = 'Sprint 14';
  var currentSprint = 'Sprint 15';

  // Use JQL to fetch completed issues from `previousSprint`
  var baseURL = 'https://domesticcat.atlassian.net/rest/api/2/search';
  var fields = 'summary,labels';
  var jql = encodeURIComponent('project = MTE AND Sprint = 157 AND status in (Resolved, Closed, "Ready for UAT", "In UAT") AND resolution not in (Duplicate, "Won\'t Do")');
  var url = baseURL + '?jql=' + jql + '&fields=' + fields + '&maxResults=100';

  var requestOptions = {
    method: 'GET',
    url: url,
    auth: creds,
    headers: {
      'Accept': 'application/json'
    }
  };

  request(requestOptions, function(error, response, body) {
    if (error) throw new Error(error);
    console.log(
      'Response: ' + response.statusCode + ' ' + response.statusMessage
    );
    res.append('Access-Control-Allow-Origin', '*');
    res.send(body);
  });
});

app.listen(3001);
