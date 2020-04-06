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
    // Buscando dados da requisição
    const data = request.body

    // Buscando id no banco de dados atraves do userId inserido pelo Middleware de autenticação
    const user = await User.findByPk(request.userId)

    // Validando campos de entrada
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6)
        .when('oldPassword', (oldPassword, field) => oldPassword ? field.required() : field),
      confirmPassword: Yup.string()
        .when('password', (password, field) => password ? field.required().oneOf([Yup.ref('password')]) : field)
    })

    // Tratamento de erro de validação do Yup
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validations fails' })
    }

    // Vefiricando a existência do email no banco de dados para atualização
    if (data.email !== user.email) {
      const userExists = await User.findOne({ where: { email: data.email } })
      if (userExists) response.status(400).json({ error: 'User already exists.' })
    }

    // Verificando se a senha é a mesma cadastrada no banco de dados
    if (data.oldPassword && !(await user.checkPassword(data.oldPassword))) {
      return response.status(400).json({ error: 'Password does not match' })
    }

    // Atualizando e retornando os dados do usuário
    const { name, email } = await user.update(request.body)

    // Retornando dados
    return response.json({
      name,
      email
    })
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
