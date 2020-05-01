import File from '../models/File'

class FileController {
  // Salvando imagem no banco de dados
  async store (request, response, next) {
    const { originalname: name, filename: path } = request.file

    try {
      const file = await File.create({
        name,
        path
      })

      return response.json(file)
    } catch (error) {
      next(error)
    }
  }
}

export default new FileController()
