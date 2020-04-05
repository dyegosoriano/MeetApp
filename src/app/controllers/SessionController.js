import jwt from 'jsonwebtoken'
import * as Yup from 'yup'

// Arquivo de configuração do token JWT
import authConfig from '../../config/auth'

import User from '../models/User'

// Controller de autenticação
class SessionController {
  async store (request, response) {
    // Buscando dados da requisição
    const { email, password } = request.body

    // Validando campos de entrada com Yup
    const schema = Yup.object().shape({
      email: Yup.string().required().email(),
      password: Yup.string().required()
    })

    // Tratamento de erro de validação do Yup
    if (!(await schema.isValid({ password, email }))) response.status(400).json({ error: 'Validations fails' })

    // Vefiricando a existência do email no banco de dados
    const user = await User.findOne({ where: { email } })
    if (!user) response.status(401).json({ error: 'User not found' })

    // Verificando se a senha é a mesma cadastrada no banco de dados
    if (!(await user.checkPassword(password))) response.status(401).json({ error: 'Password does not match' })

    // Retornando dados via token JWT
    const { id, name } = user

    return response.json({
      id,
      name,
      email,
      // Exportando token usando JWT
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    })
  }
}

export default new SessionController()
