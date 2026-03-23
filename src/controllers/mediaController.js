const { uploadMediaService,getMediaByUserIdService, getMediaByIdService, updateMediaService, deleteMediaService, makeFavouriteService, getFavouriteMediaByUserIdService } = require("../services/mediaService");

const uploadMedia = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        message: 'No files uploaded'
      });
    }

    const result = await uploadMediaService(files, req.user?.id);
    return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({
      message: err.message || 'Something went wrong'
    });
  }
};

const getMediaByUserId = async (req, res) => {
  try {
    const result = await getMediaByUserIdService(req.params.userId,req.query.mediaType, req.query.page, req.query.limit);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getMediaById = async (req, res) => {
  try {
    const result = await getMediaByIdService(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateMedia = async (req, res) => {
  try {
    const result = await updateMediaService(req.params.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteMedia = async (req, res) => {
  try {
    const result = await deleteMediaService(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getSoftDeletedMediaByUserId = async (req, res) => {
  try {
    const result = await getSoftDeletedMediaByUserIdService(req.params.userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const makeFavourite = async (req, res) => { 
  try {
    const { id } = req.params;
    const { isFavourite } = req.body;

    const result = await makeFavouriteService(id, isFavourite);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getFavMediaByUserId = async (req,res) => {
  const userId = req.params.userId;
  try {
    const result = await getFavouriteMediaByUserIdService(userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  uploadMedia,
  getMediaByUserId,
  getMediaById,
  updateMedia,
  deleteMedia,
  getSoftDeletedMediaByUserId,
  makeFavourite,
  getFavMediaByUserId
};