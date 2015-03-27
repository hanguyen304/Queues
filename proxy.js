var redis = require('redis')
var express = require('express')
var request = require('request')
var proxy = express()
var client = redis.createClient(6379, '127.0.0.1', {})
var nextserver='3000'

var proxy_server = proxy.listen(2015, function () {

	  var host = proxy_server.address().address
	  var port = proxy_server.address().port
	client.set('lastserver','3000')
   	console.log('Example app listening at http://%s:%s', host, port)
})

proxy.get('/', function(req, res) 
{
	client.get('lastserver',function(err,value)
	{
		if(value == '3000')
		{
			nextserver='3001'
			client.set('lastserver','3001')
		}
		else
		{
			nextserver='3000'
			client.set('lastserver','3000')
		}
		request('http://localhost:'+nextserver, function (error, response, body) 
		{
			if (!error && response.statusCode == 200) 
			{
				res.send(body) 
			}

		})
	});
	client.get("lastserver",function(err,value){console.log("Last server: "+value)});
	console.log(proxy.listen.port);
})

proxy.get('/get',function(req,res)
{
	request('http://localhost:'+nextserver+'/get', function (error, response, body) 
			{
				if (!error && response.statusCode == 200) 
				{
					res.send(body) 
				}

			})

})

proxy.get('/set',function(req,res)
{
	request('http://localhost:'+nextserver+'/set', function (error, response, body) 
			{
				if (!error && response.statusCode == 200) 
				{
					res.send(body) 
				}

			})
})

proxy.get('/upload',function(req,res)
{
	request('http://localhost:'+nextserver+'/upload', function (error, response, body) 
			{
				if (!error && response.statusCode == 200) 
				{
					res.send(body) 
				}

			})
})

proxy.get('/meow',function(req,res)
{
	request('http://localhost:'+nextserver+'/meow', function (error, response, body) 
			{
				if (!error && response.statusCode == 200) 
				{
					res.send(body) 
				}

			})
})

proxy.get('/recent',function(req,res)
{
	request('http://localhost:'+nextserver+'/recent', function (error, response, body) 
			{
				if (!error && response.statusCode == 200) 
				{
					res.send(body) 
				}

			})
})
