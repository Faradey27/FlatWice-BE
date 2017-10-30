import mongoose from 'mongoose';

const flatSchema = new mongoose.Schema({
  title: String,
  price: Number,
  numberOfRooms: Number,
  apartmentArea: Number,
  currency: String,
  currencyLabel: String,
  authorId: String,
  createdAt: Number,
  updatedAt: Number,
  location: {
    x: Number,
    y: Number,
    address: {
      country: String,
      city: String,
      street: String,
      house: String,
    },
  },
  shortDescription: String,
  description: String,
  categories: [String],
  tags: [String],
  mainPhoto: String,
  photos: [String],
  videos: [String],
}, { timestamps: true });


const Flat = mongoose.model('Flat', flatSchema);

export default Flat;
