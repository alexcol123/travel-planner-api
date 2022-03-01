const Travel = require('../models/TravelModel')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../errors')
const { collection } = require('../models/TravelModel')

const cloudinary = require('cloudinary').v2

// user FS to delete images as you upload them to cloudinary
const fs = require('fs')

// Create a  travel
const createTravel = async (req, res) => {
  req.body.createdBy = req.user.userId

  const travel = await Travel.create(req.body)
  res.status(StatusCodes.CREATED).json({ travel })
}

// Get All travels
const getAllTravels = async (req, res) => {
  const travels = await Travel.find({ createdBy: req.user.userId })
    .sort('country')
    .limit(10)

  res.status(StatusCodes.OK).json({ quantity: travels.length, travels })
}

// Get single  travel
const getSingleTravel = async (req, res) => {
  const {
    params: { id: travelId },
    user: { userId },
  } = req

  const travel = await Travel.findOne({ _id: travelId, createdBy: userId })

  res.status(StatusCodes.OK).json({ quantity: 1, travel })
}

// Delete a  travel
const deleteTravel = async (req, res) => {
  const {
    params: { id: travelId },
    user: { userId },
  } = req

  const travel = await Travel.findOneAndRemove({
    _id: travelId,
    createdBy: userId,
  })
  if (!travel) throw new NotFoundError(`No travel with id ${travelId}`)

  res.status(StatusCodes.OK).json('Item was deleted succesfully')
}

// Update a  travel
const updateTravel = async (req, res) => {
  const {
    params: { id: travelId },
    user: { userId },
    body: { state, country },
  } = req

  if (country === '' || state.length === 0) {
    throw new BadRequestError(`country and state fields cannot be empty.`)
  }

  const travel = await Travel.findOneAndUpdate(
    {
      _id: travelId,
      createdBy: userId,
    },
    req.body,
    { new: true, runValidators: true }
  )

  res.status(StatusCodes.OK).json({ quantity: 1, travel })
}

// Upload an Image
const imageUpload = async (req, res) => {
  const imgUrlResult = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: 'travel-api',
    }
  )

  // delete img in temp folder
  fs.unlinkSync(req.files.image.tempFilePath)
  // Response img URL from cloudinary
  res.status(StatusCodes.OK).json({ src: imgUrlResult.secure_url })
}

module.exports = {
  getAllTravels,
  getSingleTravel,
  createTravel,
  updateTravel,
  deleteTravel,
  imageUpload,
}
