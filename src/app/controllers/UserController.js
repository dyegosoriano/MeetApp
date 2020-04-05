import * as Yup from 'yup'

import User from '../models/User'

class UserController {
  async store (request, response) {
    // Buscando dados da erquisição
    const { name, email, password } = request.body

    // Validando campos de entrada com Yup
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required().email(),
      password: Yup.string().required().min(6)
    })

    // Tratamento de erro de validação do Yup
    if (!(await schema.isValid({ name, email, password }))) response.status(400).json({ error: 'Validations fails' })

    // Verificando se usuário ja existe
    const userExist = await User.findOne({ where: { email } })
    if (userExist) response.status(400).json({ error: 'User already exists.' })

    // Cadastrando usuário
    const user = await User.create({ name, email, password })
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

export default new UserController()
