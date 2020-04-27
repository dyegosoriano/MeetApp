import * as Yup from 'yup'

import User from '../models/User'
import File from '../models/File'

class UserController {
  async store (request, response) {
    // Validando campos de entrada com Yup
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required().email(),
      password: Yup.string().required().min(6)
    })

    // Tratamento de erro de validação do Yup
    if (!(await schema.isValid(request.body))) response.status(400).json({ error: 'Validations fails' })

    // Verificando existência do avatar no banco de dados
    const avatarExist = await File.findByPk(request.body.avatar_id)

    if (!avatarExist && request.body.avatar_id) {
      return response.status(400).json({ error: 'Avatar does not exist' })
    }

    // Verificando se usuário ja existe
    const emailExist = await User.findOne({ where: { email: request.body.email } })
    if (emailExist) response.status(400).json({ error: 'The email already exists in the database.' })

    // Cadastrando usuário
    const { id, name, email } = await User.create(request.body)
    return response.json({
      id,
      name,
      email
    })
  }

  async update (request, response) {
    // Buscando id no banco de dados atraves do userId inserido pelo Middleware de autenticação
    const user = await User.findByPk(request.userId)

    // Buscando dados da requisição
    const data = request.body

    // Validando campos de entrada
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6)
        .when('oldPassword', (oldPassword, field) => oldPassword ? field.required() : field),
      confirmPassword: Yup.string()
        .when('password', (password, field) => password ? field.required().oneOf([Yup.ref('password')]) : field)
    })

    // Tratamento de erro de validação do Yup
    if (!(await schema.isValid(data))) {
      return response.status(400).json({ error: 'Validations fails' })
    }

    // Vefiricando a existência do email no banco de dados para atualização
    if (data.email !== user.email) {
      const emailExists = await User.findOne({ where: { email: data.email } })
      if (emailExists) response.status(400).json({ error: 'The email already exists in the database.' })
    }

    // Verificando se a senha é a mesma cadastrada no banco de dados
    if (data.oldPassword && !(await user.checkPassword(data.oldPassword))) {
      return response.status(400).json({ error: 'Password does not match' })
    }

    // Verificando existência do avatar no banco de dados
    const avatarExist = await File.findByPk(request.body.avatar_id)

    if (!avatarExist && request.body.avatar_id) {
      return response.status(400).json({ error: 'Avatar does not exist' })
    }

    // Atualizando e retornando os dados do usuário
    const { name, email, avatar_id } = await user.update(request.body)

    // Retornando dados
    return response.json({
      name,
      email,
      avatar_id
    })
  }
}

export default new UserController()
