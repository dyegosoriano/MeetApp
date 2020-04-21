// arquivo de conexão com banco de dados
import Sequelize from 'sequelize'

import User from '../app/models/User'
import File from '../app/models/File'

import databaseConfig from '../config/database'

const models = [User, File]

class Database {
  constructor () {
    this.init()
  }

  init () {
    // conectando com banco de dados
    this.connection = new Sequelize(databaseConfig)

    // conectando models com banco de dados
    models.map((model) => model.init(this.connection))
  }
}

export default new Database()
