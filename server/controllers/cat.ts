/* import Cat from '../models/cat';
import BaseCtrl from './base';

export default class CatCtrl extends BaseCtrl {
  model = Cat;
} */

import Cat from '../models/cat';
import BaseCtrl from './base';

export default class CatCtrl extends BaseCtrl {
  model = Cat;
  
  //since Cats now have username tied, cannot use Base! must add condition to find 'cats' based on username 
  getAll = (req, res) => {
	//pulling the username from the req.body 
    this.model.find({"user": req.body.user}, (err, docs) => {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    });
  }
  
  //not really using count ever..
  count = (req, res) => {
    this.model.count({"user": req.body.user}, (err, count) => {
      if (err) { return console.error(err); }
      res.status(200).json(count);
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

}
