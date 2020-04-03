import User from '../models/User'

class Controller {
  async store (request, response) {
    // Cadastrar usuário
    const { name, email, password } = request.body

    const user = await User.create({ name, email, password_has: password })

    return response.json(user)
  }

  async update (request, response) {
    // Alterar usuário
    return response.json()
  }

  async index (request, response) {
    // Listagem de usuários
    return response.json()
  }

  async show (request, response) {
    // Exibir um único usuário
    return response.json()
  }

  async delete (request, response) {
    // Remover usuário
    return response.json()
  }
}

export default new Controller()
