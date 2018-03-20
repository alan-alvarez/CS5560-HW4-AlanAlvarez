/* import * as mongoose from 'mongoose';

const catSchema = new mongoose.Schema({
  name: String,
  weight: Number,
  age: Number
});

const Cat = mongoose.model('Cat', catSchema);

export default Cat; */

import * as mongoose from 'mongoose';

const userpassSchema = new mongoose.Schema({
  catdomain: String,
  catusername: String,
  catpassword: String,
  user: String
});

const Cat = mongoose.model('Cat', userpassSchema);

export default Cat;
