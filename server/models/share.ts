
import * as mongoose from 'mongoose';

const shareSchema = new mongoose.Schema({
  shareticker: String,
  sharenumbers: Number,
  sharebuyprice: Number,
  user: String
});

const Share = mongoose.model('Share', shareSchema);

export default Share;
