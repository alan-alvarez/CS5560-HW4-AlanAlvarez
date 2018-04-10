
import Share from '../models/share';
import BaseCtrl from './base';

export default class ShareCtrl extends BaseCtrl {
  model = Share;
  
  getAllShares = (req, res) => {
	//pulling the username from the req.body 
    this.model.find({"user": req.body.user}, (err, docs) => {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    });
  }
  
  //not really all that different, but definitely easier for maintainability 
  insert = (req, res) => {
    const obj = new this.model(req.body);
    obj.save((err, item) => {
      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) {
        res.sendStatus(400);
      }
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  }
  
  //this is used to grab current value of share via Alpha Vantage Stock API
  getValue = (req, res) => {
	//find one share object
	this.model.findOne({ _id: req.params.id }, (err, item) => {
		if (err) { return console.error(err); }
		//if one was found, use API to get stock info 
		//item is share object 
		//used WEBSERVICES project as example from class 
		var json;
		var endpoint = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' + item.shareticker + '&interval=1min&apikey=2FVBXO0JXXWQBUSV';
		var request = require("request");
		
		var metadata;
		var time;
		var stockinfo;
		var currentClosePrice;
		
		request.get(endpoint, (error, response, body) => {
			json = JSON.parse(body); //this is the entire response 
			metadata = json['Meta Data'];
			console.log('about to check share price for ' + item.shareticker + '...');
			if (metadata != null) {
				time = metadata['3. Last Refreshed'];
				stockinfo = json['Time Series (1min)'][time];
				currentClosePrice = stockinfo['4. close']; //closing price of stock i.e. latest price
				
				console.log('Current close value for ticker ' + item.shareticker + ': $' +currentClosePrice);
				res.status(200).json({ 'currentvalue':currentClosePrice }); //SPACE CHARACTERS MAKE A HUGE DIFFERENCE!!! 'currentvalue' != 'currentvalue '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			}
			else { //error handling, the share does not exist 
				console.log("Share Ticker " + item.shareticker + " does not exist in API!");
				res.status(200).json(null); //return null if no entry exists
			}
			
			
		});
	});
  }
  
  

}
