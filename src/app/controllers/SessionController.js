import jwt from 'jsonwebtoken'
import * as Yup from 'yup'

// Arquivo de configuração do token JWT
import authConfig from '../../config/auth'

import User from '../models/User'

// Controller de autenticação
class SessionController {
  async store (request, response, next) {
    // Buscando dados da requisição
    const { email, password } = request.body

    try {
      // Validando campos de entrada com Yup
      const schema = Yup.object().shape({
        email: Yup.string().required().email(),
        password: Yup.string().required()
      })

      // Tratamento de erro de validação do Yup
      if (!(await schema.isValid({ password, email }))) {
        return response
          .json({ error: 'Validations fails' })
          .status(400)
      }

      // Vefiricando a existência do email no banco de dados
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return response
          .json({ error: 'User not found' })
          .status(401)
      }

      // Verificando se a senha é a mesma cadastrada no banco de dados
      if (!(await user.checkPassword(password))) {
        return response
          .json({ error: 'Password does not match' })
          .status(401)
      }

      // Retornando dados via token JWT
      return response.json({
        // Exportando token usando JWT
        token: jwt.sign({ id: user.id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn
        })
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new SessionController()
