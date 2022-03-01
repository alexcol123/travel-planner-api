const express = require('express')
const router = express.Router()

const {
  getAllTravels,
  getSingleTravel,
  createTravel,
  updateTravel,
  deleteTravel,
  imageUpload,
} = require('../controller/travelController')

router.route('/').get(getAllTravels).post(createTravel)

router.route('/upload').post(imageUpload)

router
  .route('/:id')
  .get(getSingleTravel)
  .patch(updateTravel)
  .delete(deleteTravel)

module.exports = router
