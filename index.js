var express = require('express');
var request = require('request');
var creds = require('./.env.json');

console.log('Options:\n \
  \t--sprint [sprint title]\tthe current running sprint e.g. "MTE Sprint 14" (default, demo)\n \
  \t--project [key]\t\tthe project key e.g. "MTE" (default).\n \
  \t--jira [jira domain]\tthe organisation URL for JIRA e.g. "domesticcat.atlassian.net" (default)\n');

// Take args from CLI for sprints
// e.g. `--sprint 'MTE Sprint 14'`
var currentSprint;
var previousSprint;
var argv = require('minimist')(process.argv.slice(2));
if (argv.currentSprint) {
  currentSprint = argv.currentSprint;
  previousSprint = "Sprint " + (currentSprint.match(/\d+?$/g) - 1);
} else {
  currentSprint = "Sprint 14";
}
console.log("Prev: " + previousSprint + "\nCurr: " + currentSprint);

// TODO Allow config of Jira instance from default with optional args
// TODO More endpoints, better naming

var app = express();

app.get('/lastsprint', function(req, res) {
  var projectKey = 'MTE';
  var previousSprint = 'Sprint 14';

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
