import Domain from '../models/domain';
import BaseCtrl from './base';

//load the username password object Cat 
import Cat from '../models/cat';

export default class DomainCtrl extends BaseCtrl {
  model = Domain;
  combModel = Cat; //needed for deletion command
  
  //get all domains to a specifc signed on user 
  getAll = (req, res) => {
    this.model.find({"user": req.body.user}, (err, docs) => {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    });
  }
  
  //get a specific domain based on passed id 
  get = (req, res) => {
    this.model.findOne({ _id: req.params.id }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  }

  insert = (req, res) => {
	this.model.find({"user": req.body.user, "domainname": req.body.domainname}, (err, docs) => { 
      if (err) { return console.error(err); }	  
      else{
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
    });
  }

  delete = (req, res) => {
    this.model.findOneAndRemove({ _id: req.params.id }, (err) => {
      if (err) { return console.error(err); }
	  
	  //delete cat objects that have the same user and catdomain, something like this...  
	  this.combModel.remove({user: req.query.user, catdomain: req.query.catdomain}, (err) => {
		    if (err) { return console.error(err); }
			res.sendStatus(200);
	  });
	  
    });
  }

}