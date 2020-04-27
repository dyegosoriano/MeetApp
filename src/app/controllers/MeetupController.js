import * as Yup from 'yup'

import User from '../models/User'
import Meetup from '../models/Meetup'
import File from '../models/File'

class MeetupController {
  async store (request, response) {
    const { user_id } = request.params
    const { title, description, location, date, banner_id } = request.body

    // Verificando existência de usuário
    const user = await User.findByPk(user_id)
    if (!user) response.status(400).json({ error: 'User not found' })

    // Validando campos de entrada com Yup
    const schema = Yup.object().shape({
      banner_id: Yup.number().required(),
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required()
    })

    // Tratamento de erro de validação do Yup
    if (!(await schema.isValid(request.body))) response.status(400).json({ error: 'Validations fails' })

    // Verificando existência de banner no banco de dados
    const file = await File.findByPk(banner_id)
    if (!file) response.status(400).json({ error: 'File not found' })

    // Cadastrando Meetup
    const meetup = await Meetup.create({ user_id, banner_id, title, description, location, date })

    return response.json(meetup)
  }
}

export default new MeetupController()
