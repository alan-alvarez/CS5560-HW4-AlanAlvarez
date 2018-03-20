import * as mongoose from 'mongoose';

const domainSchema = new mongoose.Schema({
  domainname: String,
  user: String
});

const Domain = mongoose.model('Domain', domainSchema);

export default Domain;