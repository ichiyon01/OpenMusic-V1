require('dotenv').config();

const Hapi = require('@hapi/hapi');
const config = require('./utils/config/config');
const path = require('path');
const ClientError = require('./errorHandler/ClientError');

// Albums
const albums = require('./api/albums');
const albumsValidator = require('./validator/albums');
const AlbumsService = require('./services/postgres/AlbumsService');

// Songs
const songs = require('./api/songs');
const songsValidator = require('./validator/songs');
const SongsService = require('./services/postgres/songsService');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        AlbumsServices: albumsService,
        SongsService: songsService,
        AlbumsValidator: albumsValidator,
      },
    },
    // {
    //   plugin: songs,
    //   options: {
    //     SongsService: songsService,
    //     songsValidator: songsValidator,
    //   },
    // },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // get konteks response dari request
    const { response } = request;
    console.log(response);
    if (response instanceof Error) {
      // panggilan client error di Internal
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // mempertahankan penanganan oleh hapi
      if (!response.isServer) {
        return h.continue;
      }

      // penanganan error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi galat pada server',
      });
      newResponse.code(500);
      return newResponse;
    }

    // jika bukan error akan melanjutkan dengan response sebelumnya
    return h.continue;
  });

  await server.start();
  console.log(`server started on ${server.info.uri}`);
};

init();