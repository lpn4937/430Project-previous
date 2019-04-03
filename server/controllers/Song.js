const models = require('../models');

const Song = models.Song;

const makerPage = (req, res) => {
  Song.SongModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), songs: docs });
  });
};

const makeSong = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  const songData = {
    name: req.body.name,
    age: req.body.age,
    perception: req.body.perception,
    owner: req.session.account._id,
  };
  if (!req.body.perception) {
    songData.perception = Math.random(1, 21);
  }

  const newSong = new Song.SongModel(songData);

  const songPromise = newSong.save();

  songPromise.then(() => res.json({ redirect: '/maker' }));

  songPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Song already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return songPromise;
};

const getSongs = (request, response) => {
  const req = request;
  const res = response;

  return Song.SongModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ songs: docs });
  });
};

const removeSong = (request) => {
  Song.SongModel.remove({ name: request.query.name });
};


module.exports.makerPage = makerPage;
module.exports.getSongs = getSongs;
module.exports.removeSong = removeSong;
module.exports.make = makeSong;
