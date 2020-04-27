// arquivo de conexão com banco de dados
import Sequelize from 'sequelize'

import User from '../app/models/User'
import File from '../app/models/File'
import Meetup from '../app/models/Meetup'

import databaseConfig from '../config/database'

const models = [User, File, Meetup]

class Database {
  constructor () {
    this.init()
  }

  init () {
    // Conectando com banco de dados
    this.connection = new Sequelize(databaseConfig)

    models
    // Conectando models com banco de dados
      .map((model) => model.init(this.connection))
    // Chamando método de associação
      .map(model => { model.associate && model.associate(this.connection.models) })
  }
}

export default new Database()
