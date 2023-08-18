const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: () => handler.postAlbumsHandler(request, h),
  },
  {
    method: 'GET',
    path: '/albums',
    handler: () => handler.getAlbumsHandler(request, h),
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: () => handler.getAlbumByIdHandler(request),
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: () => handler.putAlbumByIdHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: () => handler.deleteAlbumByIdHandler(request, h),
  },
];

module.exports = routes;