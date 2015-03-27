var redis = require('redis')
var express = require('express')
var request = require('request')
var proxy = express()
var client = redis.createClient(6379, '127.0.0.1', {})
var nexthit='3000'

var proxy_server = proxy.listen(2015, function () {

	  var host = proxy_server.address().address
	  var port = proxy_server.address().port
	client.set('lasthit','3000')
   	console.log('Example app listening at http://%s:%s', host, port)
})

proxy.get('/', function(req, res) {
		  client.get('lasthit',function(err,value){
				if(value == '3000'){
					nexthit='3001'
					client.set('lasthit','3001')
				}
				else{
					nexthit='3000'
					client.set('lasthit','3000')
				}
				request('http://localhost:'+nexthit+'/', function (error, response, body) {
					if (!error && response.statusCode == 200) {
						res.send(body) 
					}
				})
			})
})
