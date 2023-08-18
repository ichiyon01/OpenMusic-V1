/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(8)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
      notNull: true,
    },
    duration: {
      type: 'INTEGER',
    },
    id_album: {
      type: 'VARCHAR(8)',
    },
  });

  pgm.addConstraint(
    'songs',
    'fk_song.id_album',
    'FOREIGN KEY (id_album) REFERENCES albums(id) ON DELETE CASCADE ON UPDATE CASCADE',
  )
};

exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_song.id_album');
  pgm.dropTable('songs');
};
