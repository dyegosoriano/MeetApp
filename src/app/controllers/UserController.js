import * as Yup from 'yup'

import User from '../models/User'
import File from '../models/File'

class UserController {
  async store (request, response, next) {
    // Buscando dados da requisição
    const { name, email, password, avatar_id } = request.body

    // Validando campos de entrada com Yup
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required().email(),
      password: Yup.string().required().min(6)
    })

    try {
      // Tratamento de erro de validação do Yup
      if (!(await schema.isValid(request.body))) {
        return response
          .json({ error: 'Validations fails' })
          .status(400)
      }

      // Verificando existência do avatar no banco de dados
      const avatarExist = await File.findByPk(avatar_id)
      if (!avatarExist && avatar_id) {
        return response
          .json({ error: 'Avatar does not exist' })
          .status(400)
      }

      // Verificando se usuário ja existe
      const emailExist = await User.findOne({ where: { email } })
      if (emailExist) {
        return response
          .json({ error: 'The email already exists in the database.' })
          .status(400)
      }

      // Cadastrando usuário
      const user = await User.create({
        name,
        email,
        password,
        avatar_id
      })

      return response.json({
        id: user.id,
        avatar_id: user.avatar_id,
        name: user.name,
        email: user.email
      })
    } catch (error) {
      next(error)
    }
  }

  async update (request, response, next) {
    // Buscando dados da requisição
    const { name, email, avatar_id, newPassword, newPasswordConfirm, oldPassword } = request.body

    // Validando campos de entrada
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
      newPassword: Yup.string().min(6),
      oldPassword: Yup.string().min(6),
      newPasswordConfirm: Yup.string().min(6)
    })

    // Tratamento de erro de validação do Yup
    if (!(await schema.isValid(request.body))) {
      return response
        .json({ error: 'Validations fails' })
        .status(400)
    }

    // Validação de nova senha com senha de confirmação
    if (newPassword !== newPasswordConfirm) {
      return response
        .json({ error: 'The confirmation password does not match the new password' })
        .status(400)
    }

    try {
      // Buscando id no banco de dados atraves do userId inserido pelo Middleware de autenticação
      const user = await User.findByPk(request.userId)

      // Vefiricando a existência do email no banco de dados para atualização
      if (email !== user.email) {
        const emailExists = await User.findOne({ where: { email } })

        if (emailExists) {
          return response
            .json({ error: 'The email already exists in the database.' })
            .status(400)
        }
      }

      // Verificando se a senha é a mesma cadastrada no banco de dados
      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        return response
          .json({ error: 'Password does not match' })
          .status(400)
      }

      // Verificando existência do avatar no banco de dados
      const avatarExist = await File.findByPk(avatar_id)
      if (!avatarExist && avatar_id) {
        return response
          .json({ error: 'Avatar does not exist' })
          .status(400)
      }

      // Atualizando e retornando os dados do usuário
      await user.update({
        name,
        email,
        avatar_id,
        password: newPassword
      })

      // Retornando dados
      return response.json({
        name,
        email,
        avatar_id
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new UserController()
