const mongoose = require('mongoose')

// Declare the Schema of the Mongo model
const travelSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, 'Please provide Country of destination'],
      minlength: 2,
    },
    state: {
      type: [],
      required: [true, 'Please provide States you like to visit  '],
      minlength: 2,
    },
    image: {
      type: String,
      required: true,
      default:
        'https://higherlogicdownload.s3.amazonaws.com/SRAINTERNATIONAL/UploadedImages/167e255a-8759-4a2f-92f6-591d6d8f7afb/Catalyst-pictures/Text-body-images/april2021/Picture_2_Travel.jpeg',
    },
    reason: {
      type: String,
      enum: ['vacation', 'business', 'spiritual', 'other'],
      default: 'vacation',
    },
    visited: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
)

//Export the model
module.exports = mongoose.model('Travel', travelSchema)
