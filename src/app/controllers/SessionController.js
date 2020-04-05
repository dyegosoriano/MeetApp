import jwt from 'jsonwebtoken'

import authConfig from '../../config/auth'

import User from '../models/User'

// Controller de autenticação
class SessionController {
  async store (request, response) {
    // Buscando dados da requisição
    const { email, password } = request.body

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
