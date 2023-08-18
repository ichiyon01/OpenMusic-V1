const mapSongsToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  id_album,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  idAlbum: id_album,
});

module.exports = { mapSongsToModel };