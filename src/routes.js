import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import FileController from './app/controllers/FileController'
import MeetupController from './app/controllers/MeetupController'

import authMiddleware from './app/middleware/auth'

const routes = new Router()
const upload = multer(multerConfig)

routes
  .post('/users', UserController.store)
  .post('/sessions', SessionController.store)

  // Autenticação JWT
  .use(authMiddleware)

  // Users
  .put('/users', UserController.update)

  // Meetups
  .get('/meetups', MeetupController.index)
  .get('/meetups/:id', MeetupController.show)
  .post('/meetups', MeetupController.store)
  .put('/meetups/:id', MeetupController.update)
  .delete('/meetups/:id', MeetupController.delete)

  // Files
  .post('/files', upload.single('file'), FileController.store)

export default routes
