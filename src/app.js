import express from 'express'
import routes from './routes'

// importando conexão com banco de dados
import './database'

class App {
  constructor () {
    this.server = express()

    this.middlewares()
    this.routes()
  }

  middlewares () {
    this.server.use(express.json())
  }

  routes () {
    this.server.use(routes)
  }
}

export default new App().server
