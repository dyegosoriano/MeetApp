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

  async update (request, response) {
    // Verificando existência de usuário
    const user = await User.findByPk(request.params.user_id)
    if (!user) return response.status(400).json({ error: 'User not found' })

    // Verificando existência de Meetup
    const meetup = await Meetup.findByPk(request.params.meetup_id)
    if (!meetup) return response.status(400).json({ error: 'Meetup does not exist' })
    if (user.id !== meetup.user_id) return response.status(401).json({ error: 'User does not autorised' })

    // Verificando existência de Meetup
    const banner = await File.findByPk(request.body.banner_id)
    if (!banner) return response.status(400).json({ error: 'Banner does not exist' })

    const meetupUpdate = await meetup.update(request.body)

    return response.json(meetupUpdate)
  }
}

export default new MeetupController()
