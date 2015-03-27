var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()



// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

// client.set("key", "value");
// client.get("key", function(err,value){ console.log(value)});

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
	console.log(req.method, req.url);

	client.lpush("visits",req.url);

	next(); // Passing the request to the next handler in the stack.
});



//  1st server
	var server1 = app.listen(3000, function () {

	  var host = server1.address().address
	  var port = server1.address().port

	  console.log('First app listening at http://%s:%s', host, port)
	})

// 	2nd server
	var server2 = app.listen(3001, function () {

	  var host = server2.address().address
	  var port = server2.address().port

	  console.log('Second app listening at http://%s:%s', host, port)
	})


app.get('/',function(req,res)
{
	res.send("Hello World!");
})

app.get('/set',function(req,res)
{
	client.set("key", "this message will destruct in 10 sec");
	client.expire("key",10);
	res.send("Key added! ");
})

	
app.get('/get',function(req,res)
{
	client.get("key",function(err,value){res.send(value)})
})

app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res)
{
   console.log(req.body) // form fields
   console.log(req.files) // form files

   if( req.files.image )
   {
	   fs.readFile( req.files.image.path, function (err, data) {
	  		if (err) throw err;
	  		var img = new Buffer(data).toString('base64');
	  		console.log(img);
	  		client.lpush('Images', img)
		});
	}

   // res.status(204).end();
   res.send("Image uploaded!")
}])

app.get('/meow', function(req, res) {
	
	client.lpop("Images", function(err, imagedata)
	{
		if (err) throw err
		res.writeHead(200, {'content-type':'text/html'});
		
   		res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+imagedata+"'/>");
		
   	res.end();
	})
})

app.get('/recent', function(req, res) 
{
	client.lrange("visits",0,5,function(err,value)
	{
		res.send(value);
	})
})
