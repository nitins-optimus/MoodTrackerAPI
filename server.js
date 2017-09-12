const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

const util = require('./util');

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

app.post('/get-mood-bydate', (req, res) => {
	var startDate = req.body.startDate;
	var endDate = req.body.endDate;
	var records = {"countH":0,"countS":0};
	
	if( new Date(startDate) > new Date(endDate)){
		res.json(records);
		return;
	}
	var query = {
		date: {
		    $gte:new Date(startDate),
			  $lte:new Date(endDate)
		}
	};

	console.log(startDate);
	console.log(endDate);

	
	db.collection('mood').find(query).toArray((err, result) => {
		console.log("the result is ", result);
	
		if(result && result.length) {
			records = util.creatMoodList(result);
		}
		
		res.json(records);
	});

});


app.post('/add-mood', (req, res) => {

	var date = new Date(req.body.date);
	var countH = req.body.countH;
	var countS = req.body.countS;
	var isReqValid = util.checkParam(req.body.date, countH, countS);

	 db.collection('mood').find({"date":date}).toArray((err, result) => {
     if (err) return console.log(err)
		 console.log("isReqValid", isReqValid);
		if (isReqValid) {
	     if(result && result.length) {
			  
				db.collection('mood').update({"date":date},{$set:{"countH":result[0].countH + countH}});
									
				db.collection('mood').update({"date":date},{$set:{"countS":result[0].countS + countS}});
				} else  {	    
					// New record
					req.body.date = date;
					db.collection('mood').insert(req.body);    
				}
			}	 		
		});
	
		res.json({
			"isReqValid": isReqValid,
			"Params": req.body
		});
	//res.end();
});