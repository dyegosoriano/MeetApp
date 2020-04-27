import * as Yup from 'yup'

import User from '../models/User'
import Meetup from '../models/Meetup'
import File from '../models/File'

class MeetupController {
  async store (request, response) {
    // Buscando id no banco de dados atraves do userId inserido pelo Middleware de autenticação
    const user = await User.findByPk(request.userId)

    const { banner_id, title, description, location, date } = request.body

    // Validando campos de entrada com Yup
    const schema = Yup.object().shape({
      banner_id: Yup.number().required(),
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required()
    })

    // Tratamento de erro de validação do Yup
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validations fails' })
    }

    // Verificando existência de banner no banco de dados
    if (!(await File.findByPk(banner_id))) {
      return response.status(400).json({ error: 'File not found' })
    }

    // Cadastrando Meetup
    const meetup = await Meetup.create({
      user_id: user.id,
      banner_id,
      title,
      description,
      location,
      date
    })

    return response.json(meetup)
  }

  async update (request, response) {
    // Buscando id no banco de dados atraves do userId inserido pelo Middleware de autenticação
    const user = await User.findByPk(request.userId)

    // Verificando existência de Meetup e autorização de update
    const meetup = await Meetup.findByPk(request.params.meetup_id)
    if (!meetup) return response.status(400).json({ error: 'Meetup does not exist' })
    if (user.id !== meetup.user_id) {
      return response.status(401).json({ error: 'User does not autorised' })
    }

    // Verificando existência de Meetup
    const banner = await File.findByPk(request.body.banner_id)
    if (!banner) return response.status(400).json({ error: 'Banner does not exist' })

    const meetupUpdate = await meetup.update(request.body)

    return response.status(400).json(meetupUpdate)
  }

  async index (request, response) {
    // Buscando id no banco de dados atraves do userId inserido pelo Middleware de autenticação
    const user = await User.findByPk(request.userId, {
      include: { association: 'meetups' }
    })

    return response.json(user.meetups)
  }
}

export default new MeetupController()
