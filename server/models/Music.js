const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let MusicModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const MusicSchema = new mongoose.Schema({
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

  MusicSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    artist: doc.artist,
    album: doc.album,
  });

  MusicSchema.statics.findByOwner = (ownderId, callback) => {
      const search = {
          owner: convertId(ownerId),
      };

      return MusicSchema.find(search).select('name artist album').exec(callback)
  }