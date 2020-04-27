import Sequelize, { Model } from 'sequelize'

class Meetup extends Model {
  static init (sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        adress: Sequelize.STRING,
        date: Sequelize.DATE,
        subscribers: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      { sequelize }
    )

    return this
  }

  // Método de associação da tabela Meetup com outras tabelas
  static associate (models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'owner' })
    this.belongsTo(models.File, { foreignKey: 'banner_id', as: 'banner' })
  }
}

export default Meetup
