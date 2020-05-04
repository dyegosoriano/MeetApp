import { Op } from 'sequelize'
import { startOfHour, addHours } from 'date-fns'

import Meetup from '../models/Meetup'
import File from '../models/File'
import User from '../models/User'

class SubscriptionController {
  async store (request, response, next) {
    try {
      const { userId } = request

      const meetup = await Meetup.findOne({
        where: { id: request.params.id },
        include: [
          {
            model: File,
            as: 'banner',
            attributes: ['name', 'url']
          },
          {
            model: User,
            as: 'owner',
            attributes: ['name', 'email']
          }
        ]
      })

      // Verificando existencia de meetup
      if (!meetup) {
        return response
          .status(400)
          .json({ error: 'Meetup does not exists' })
      }

      // Veridicando se meetup ainda esta disponível
      if (meetup.date < new Date()) {
        return response
          .status(400)
          .json({ erro: 'Meetup is already finished' })
      }

      // Verificando se o usuário e dono do meetup
      if (meetup.user_id === userId) {
        return response
          .status(406)
          .json({ error: "The meetup owner can't subscribe" })
      }

      // Validando se suário ja esta inscrito
      if (meetup.subscribers.includes(userId)) {
        return response
          .status(400)
          .json({ error: 'Already subscribed' })
      }

      // Verificando se existe conflito de horários
      const hourStart = startOfHour(Number(meetup.date))
      const conflictMeetups = await Meetup.findOne({
        where: {
          subscribers: { [Op.contains]: [userId] },
          date: { [Op.between]: [hourStart, addHours(hourStart, 2)] }
        },
        attributes: ['id', 'title', 'adress', 'date']
      })

      if (conflictMeetups) {
        return response
          .status(400)
          .json({ error: 'You are already subscribed to a meetapp at the same time' })
      }

      await meetup.update({ subscribers: [userId, ...meetup.subscribers] })

      return response.json(meetup)
    } catch (error) {
      next(error)
    }
  }

  async delete (request, response, next) {
    try {
      const { userId } = request
      const { id } = request.params

      const meetup = await Meetup.findOne({ where: { id } })

      // Verificando existencia de meetup
      if (!meetup) {
        return response
          .status(400)
          .json({ error: 'Meetup does not exists' })
      }

      // Veridicando se meetup ainda esta disponível
      if (meetup.date < new Date()) {
        return response
          .status(400)
          .json({ erro: 'Meetup is already finished' })
      }

      // Verificando se suário esta inscrito
      if (!meetup.subscribers.includes(userId)) {
        return response
          .status(400)
          .json({ error: "User's not registered to the meetup" })
      }

      const removeSubscribers = subs => {
        subs.splice(subs.indexOf(userId), 1)
        return subs
      }

      const subscribers = removeSubscribers(meetup.subscribers)

      await meetup.update({ subscribers })

      return response.json(meetup)
    } catch (error) {
      next(error)
    }
  }
}

export default new SubscriptionController()
