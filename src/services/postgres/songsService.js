const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapSongsToModel } = require('../../utils/songs');
const InvariantError = require('../../errorHandler/InvariantError');
const NotFoundError = require('../../errorHandler/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title,
    year,
    performer,
    genre,
    duration = null,
    idAlbum = null,
  }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [
        id,
        title,
        year,
        performer,
        genre,
        duration,
        idAlbum,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu tidak ditambahkan');
    }
    return result.rows[0].id;
  }

  async getSongs(title = '', performer = '') {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2',
      values: [`%${title}%`, `%${performer}%`],
    };

    const { rows } = await this._pool.query(query);
    
    return rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if(!result.rowCount) {
      throw new NotFoundError('Lagu tidak ada');
    }

    return result.rows.map(mapSongsToModel)[0];
  }

  async getSongsByAlbumId(idAlbum) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE idAlbum = $1',
      values: [idAlbum],
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapSongsToModel);
  }

  async editSongById(id, {
    title,
    year,
    performer,
    genre,
    duration = null,
    idAlbum = null,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year =$2, performer = $3, genre = $4, duration = $5, idAlbum = $6',
      values: [title, year, performer, genre, duration, idAlbum],
    };

    const result = await this._pool.query(query);

    if(!result.rowCount) {
      throw new NotFoundError ('Gagal update lagu, id tidak ada');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError ('Gagal delete lagu, id tidak ada');
    }
  }

}

module.exports = SongsService;
