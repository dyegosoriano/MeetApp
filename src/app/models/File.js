import Sequelize, { Model } from 'sequelize'

class File extends Model {
  static init (sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        // Campo virtual que retorna o link do arquivo
        url: {
          type: Sequelize.VIRTUAL,
          get () {
            return `http://localhost:3333/files/${this.path}`
          }
        }
      },
      {
        sequelize
      }
    )

    return this
  }
}

export default File
