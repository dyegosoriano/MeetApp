import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcryptjs'

class User extends Model {
  static init (sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // Campo virtual
        password_has: Sequelize.STRING
      },
      { sequelize }
    )

    // Executando função do Sequelize que é executa antes de salvar os dados do usuário
    // addHook são trechos de códigos executados de forma automática baseada em ações que acontecem no Model
    this.addHook('beforeSave', async user => {
      // Verificando existência de senha e criptografando
      user.password_has = await bcrypt.hash(user.password, 8)
    })

    // Retornando o Model criado
    return this
  }

  // Relacionando model User com model File
  static associate (models) {
    // belongsTo -> relação 1 para 1
    this.belongsTo(models.File, { foreignKey: 'avatar_id' })
    // hasMany -> relação 1 para N
    this.hasMany(models.Meetup, { foreignKey: 'user_id', as: 'meetups' })
  }

  // Método de verificação de senha
  checkPassword (password) {
    return bcrypt.compare(password, this.password_has)
  }
}

export default User
