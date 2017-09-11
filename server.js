const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

const util = require('./util');
console.log(util);

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

app.post('/add-mood', (req, res) => {

	var date = req.body.date;
	var countH = req.body.countH;
	var countS = req.body.countS;
	var isReqValid = util.checkParam(date, countH, countS);

	 db.collection('mood').find({"date":req.body.date}).toArray((err, result) => {
     if (err) return console.log(err)
		 console.log("isReqValid", isReqValid);
		if (isReqValid) {
	     if(result && result.length) {
			  
				db.collection('mood').update({"date":req.body.date},{$set:{"countH":result[0].countH + countH}});
									
				db.collection('mood').update({"date":req.body.date},{$set:{"countS":result[0].countS + countS}});
				} else  {	    
					// New record
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