const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let SongModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();
const setArtist = (artist) => _.escape(artist).trim();
const setAlbum = (album) => _.escape(album).trim();


const SongSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  artist: {
    type: String,
    required: true,
    trim: true,
    set: setArtist,
  },

  album: {
    type: String,
    required: true,
    trim: true,
    set: setAlbum,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    require: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

SongSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  perception: doc.perception,
});

SongSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return SongModel.find(search).select('name age perception').exec(callback);
};

SongModel = mongoose.model('Song', SongSchema);

module.exports.SongModel = SongModel;
module.exports.SongSchema = SongSchema;
