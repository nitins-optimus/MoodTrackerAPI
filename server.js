const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

const util = require('./util');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
var ip = require('ip');
var address = ip.address() // my ip address

console.log("the address is ", address);

//var MONGOLAB_URI = "mongodb://aditya9219:engineer001@ds131119.mlab.com:31119/db_aditya9219",db;
var MONGOLAB_URI = "mongodb://nitins123:optimus123@ds052649.mlab.com:52649/moodtracker", db;
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
	var startDate = util.covertDate(req.body.startDate);
	var endDate = util.covertDate(req.body.endDate);

	var records = { "countH": 0, "countS": 0 };

	if (startDate > endDate) {
		res.json(records);
		return;
	}
	var query = {
		date: {
			$gte: startDate,
			$lte: endDate
		}
	};

	db.collection('mood').find(query).toArray((err, result) => {
		console.log("the result is ", result);

		if (result && result.length) {
			records = util.creatMoodList(result);
		}

		res.json(records);
	});

});


app.post('/add-mood', (req, res) => {

	var dateParts = req.body.date.split("/");
	var date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

	var countH = req.body.countH;
	var countS = req.body.countS;

	console.log(date);
	console.log(countH);
	console.log(countS);

	var isReqValid = util.checkParam(req.body.date, countH, countS);

	db.collection('mood').find({ "date": date }).toArray((err, result) => {
		if (err) return console.log(err)
		console.log("isReqValid", isReqValid);
		if (isReqValid) {
			if (result && result.length) {

				db.collection('mood').update({ "date": date }, { $set: { "countH": result[0].countH + countH } });

				db.collection('mood').update({ "date": date }, { $set: { "countS": result[0].countS + countS } });
			} else {
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
