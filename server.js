const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

//var MONGOLAB_URI = "mongodb://aditya9219:engineer001@ds131119.mlab.com:31119/db_aditya9219",db;
var MONGOLAB_URI = "mongodb://nitins123:optimus123@ds052649.mlab.com:52649/moodtracker",db;
MongoClient.connect(process.env.MONGOLAB_URI || MONGOLAB_URI, (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 5000, () => {
    console.log('listening');
  })
})

app.get('/', (req, res) => {
  res.send('hello world')
})

app.post('/mood', (req, res) => {
     console.log("the request is ", req.body);
     console.log("the date is ",req.body.date);
	 console.log("countH is ", req.body.countH);
	 console.log("countS is ", req.body.countS);
	 
	 db.collection('mood').find({"date":req.body.date}).toArray((err, result) => {
       if (err) return console.log(err)
       console.log("result = ",result);
	   if(result && result.length)
       {
	      var countH = req.body.countH;
          var countS = req.body.countS;
	      if(countH)
		  {
		      console.log("going to update countH", countH);
	          db.collection('mood').update({"date":req.body.date},{$set:{"countH":result[0].countH + countH}});
		  }
	      else
          {		  
		      console.log("going to update countS", countS);
	          db.collection('mood').update({"date":req.body.date},{$set:{"countS":result[0].countS + countS}});
		  }
       }
       else
	   {
	      console.log("in else");
	      db.collection('mood').insert(req.body);    
       }	   
    })
	res.end();
});