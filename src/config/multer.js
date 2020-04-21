// Configurações do uphoad de imagens
import { resolve, extname } from 'path'
import crypto from 'crypto'
import multer from 'multer'

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (request, file, callback) => {
      crypto.randomBytes(16, (error, result) => {
        if (error) return callback(error)

        return callback(null, result.toString('hex') + extname(file.originalname))
      })
    }
  })
}
