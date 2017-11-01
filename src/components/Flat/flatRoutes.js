/* eslint-disable no-underscore-dangle */
import Flat from './FlatModel';

/**
 * GET /flats
 * Get list of available filtered flats
 */
export const getFlats = async (req, res) => {
  const flats = await Flat.find({});

  return res.status(200).json({
    flats: flats.map((flat) => ({
      id: flat._id,
      title: flat.title,
      price: flat.price,
      numberOfRooms: flat.numberOfRooms,
      apartmentArea: flat.apartmentArea,
      currency: flat.currency,
      currencyLabel: flat.currencyLabel,
      authorId: flat.authorId,
      createdAt: flat.createdAt,
      updatedAt: flat.updatedAt,
      location: {
        x: flat.location.x,
        y: flat.location.y,
        adress: {
          country: flat.location.country,
          city: flat.location.city,
          street: flat.location.street,
          house: flat.location.house,
        },
      },
      shortDescription: flat.shortDescription,
      description: flat.description,
      categories: flat.categories,
      tags: flat.tags,
      mainPhoto: flat.mainPhoto,
      photos: flat.photos,
      videos: flat.videos,
    })),
    total: flats.length,
  });
};

/**
 * POST /flats
 * Get list of available filtered flats
 */
export const postFlats = async (req, res) => {
  const flat = new Flat({
    title: req.body.title,
    price: req.body.price,
    numberOfRooms: req.body.numberOfRooms,
    apartmentArea: req.body.apartmentArea,
    currency: req.body.currency,
    currencyLabel: req.body.currencyLabel,
    authorId: req.user._id,
    location: {
      x: req.body.location && req.body.location.x,
      y: req.body.location && req.body.location.y,
      adress: {
        country: req.body.location && req.body.location.country,
        city: req.body.location && req.body.location.city,
        street: req.body.location && req.body.location.street,
        house: req.body.location && req.body.location.house,
      },
    },
    shortDescription: req.body.shortDescription,
    description: req.body.description,
    categories: req.body.categories,
    tags: req.body.tags,
    mainPhoto: req.body.mainPhoto,
    photos: req.body.photos,
    videos: req.body.videos,
  });

  const savedFlat = await flat.save();
  const result = savedFlat.toObject();

  return res.status(200).json(Object.assign({}, result, { id: result._id }));
};

/**
 * PUT /flats/:id
 * Get list of available filtered flats
 */
export const putFlats = async (req, res) => {
  const flat = await Flat.findById(req.params.id).exec();

  Object.assign(flat, req.body); // eslint-disable-line
  const savedFlat = await flat.save();

  return res.status(200).json(savedFlat);
};

/**
 * DELETE /flats/:id
 * Get list of available filtered flats
 */
export const deleteFlats = async (req, res) => {
  await Flat.findByIdAndRemove(req.params.id);

  return res.status(200).json({});
};
