import formError from '../errors/formError'
import prisma from '../../prisma/client'
import bcrypt from 'bcrypt'

class User {
  constructor({ username, password, email } = {}) {
    this.username = username,
    this.password = password,
    this.email = email
  }
  
  async create() {
    const saltRounds = 3
    const passedPassword = this.password
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassowrd = await bcrypt.hash(passedPassword, salt)

    await prisma.users.create({
      data: {
        username: this.username,
        password: hashedPassowrd,
        email: this.email
      }
    }).catch((error) => {
      throw new formError({
        message: `Woopsie something went wrong T.T, The data sent through already exists! Please change: (${error.meta.target})`,
        target: error.meta.target
      })
    })
  } 
}

export default User