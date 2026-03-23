const Media = require('../models/media');

const uploadMediaService = async (files, userId) => {
  if (!files || files.length === 0) {
    throw new Error('No files provided');
  }

  if (files.length > 10) {
    throw new Error('Max 10 files allowed per request');
  }

  // Upload + DB insert in parallel
  const uploadedMedia = await Promise.all(
    files.map(async (file) => {
      const mediaType = file.mimetype.startsWith('video')
        ? 'video'
        : 'image';

      const media = await Media.create({
        user_id: userId,
        media_type: mediaType,
        file_url: file.location,
        file_key: file.key
      });

      return {
        id: media.id,
        type: mediaType,
        url: file.location,
        key: file.key
      };
    })
  );

  return {
    message: 'Upload successful',
    count: uploadedMedia.length,
    media: uploadedMedia
  };
};



const getMediaByUserIdService = async (userId,mediaType, page = 1, limit = 10) => {
  try {
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const offset = (parsedPage - 1) * parsedLimit;
    const { rows, count } = await Media.findAndCountAll({
      where: { user_id: userId, is_deleted: false,media_type:mediaType},
      attributes: ['id', 'media_type', 'file_url', 'is_favourite'],
      limit: parsedLimit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      pagination: {
        totalItems: count,
        currentPage: parsedPage,
        totalPages: Math.ceil(count / parsedLimit),
        pageSize: parsedLimit,
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch media by user id: ${error.message}`);
  }
};

const getSoftDeletedMediaByUserIdService = async (userId) => {
  try {
    const media = await Media.findAll({
      where: { user_id: userId, is_deleted: true },
      attributes: ['id', 'media_type', 'file_url', 'is_favourite', 'title']
    });
    return media;
  } catch (error) {
    throw new Error(`Failed to fetch media by user id: ${error.message}`);
  }
};

const getMediaByIdService = async (id) => {
  try {
    const media = await Media.findByPk(id, {
      where: { is_deleted: false },
      attributes: ['id', 'media_type', 'file_url', 'is_favourite', 'title'],
    });
    return media;
  } catch (error) {
    throw new Error(`Failed to fetch media by id: ${error.message}`);
  }
};

const updateMediaService = async (id, data) => {
  try {
    const media = await Media.findByPk(id);
    return media;
  } catch (error) {
    throw new Error(`Failed to update media: ${error.message}`);
  }
};

const deleteMediaService = async (id) => {
  try {
    const media = await Media.findByPk(id);
    return media;
  } catch (error) {
    throw new Error(`Failed to delete media: ${error.message}`);
  }
};

const makeFavouriteService = async (id, isFavourite) => {
  try {
    const media = await Media.findByPk(id);
    if (!media) {
      return 'Media not found';
    }

    media.is_favourite = isFavourite;
    await media.save();
    const updatedMedia = media.toJSON();

    return { message: 'Favourite updated', media: updatedMedia };
  } catch (error) {
    console.error(error);
    return `Failed to update favourite: ${error.message}`;
  }
}

const getFavouriteMediaByUserIdService = async (userId) => {
  try {
    const media = await Media.findAll({where:{user_id : userId, is_favourite: true, is_deleted: false}});
    return media;
  } catch (error) { 
    throw new Error(`Failed to fetch favourite media by user id: ${error.message}`);
  }
} 


module.exports = {
  uploadMediaService,
  getMediaByUserIdService,
  getMediaByIdService,
  updateMediaService,
  deleteMediaService,
  getSoftDeletedMediaByUserIdService,
  makeFavouriteService,
  getFavouriteMediaByUserIdService,
};