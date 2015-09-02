'use strict'

var express = require('express')
var favicon = require('serve-favicon');
var request = require('request');

var app = express()
app.set('view engine', 'jade')
app.set('views', __dirname + '/views')

app.use(express.static('static'))
app.use(favicon(__dirname + '/static/favicons/favicon.ico'))

var availableDatasets = ['world-2', 'se-4', 'se-7']
app.get('/demo', function(req, res) {

  if (req.query.dataset && (availableDatasets.indexOf(req.query.dataset) > -1)){
  	var dataset = req.query.dataset
  } else {
	var dataset = availableDatasets[0]
  }

  if (req.query.date){
  	var date = new Date(req.query.date).toISOString()
  } else {
	var date = new Date().toISOString()
  }
  date = date.split("T")[0]

  var apiUrl = "http://api.thenmap.net/v1/" + dataset + "/info"
  request(apiUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      var datasetInfo = JSON.parse(body).info

	  if (req.query.language && (datasetInfo.languages.indexOf(req.query.language) > -1)){
	  	var activeLanguage = req.query.language
	  } else {
		var activeLanguage = datasetInfo.defaultLanguage
	  }

      res.render('demo',{
  	    availableDatasets: availableDatasets,
  	    activeDataset: dataset,
  	    datasetInfo: datasetInfo,
  	    date: date,
  	    activeLanguage: activeLanguage,
  	    requestedProjection: req.query.projection || ""
      })
    }
  })

})

app.get('/', function(req, res) {
  res.render('index')
})

// Errors
app.use(function(req, res, next) {
  res.status(404).send('Sorry, can\'t find that!')
})

//Start server
var server = app.listen(process.env.PORT || 3001, function() {

  var host = server.address().address
  var port = server.address().port

  console.log('Thenmap site listening at http://%s:%s', host, port)

})
