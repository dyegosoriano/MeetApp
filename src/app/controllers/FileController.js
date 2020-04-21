import File from '../models/File'

class FileController {
  // Salvando imagem no banco de dados
  async store (request, response) {
    const { originalname: name, filename: path } = request.file
    const file = await File.create({
      name,
      path
    })

    return response.json(file)
  }
}

export default new FileController()
