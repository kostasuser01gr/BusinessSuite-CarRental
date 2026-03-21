import { User } from '../../shared/types.js'

type UserWithPassword = User & { passwordHash: string }

// Isolated in-memory store
class MemoryStore {
  private users: UserWithPassword[] = []

  findUserByEmail(email: string) {
    return this.users.find(u => u.email === email)
  }

  findUserById(id: string) {
    return this.users.find(u => u.id === id)
  }

  createUser(user: UserWithPassword) {
    this.users.push(user)
    return user
  }

  clear() {
    this.users = []
  }
}

const store = new MemoryStore()

export const findUserByEmail = (email: string) => store.findUserByEmail(email)
export const findUserById = (id: string) => store.findUserById(id)
export const createUser = (user: UserWithPassword) => store.createUser(user)
export const clearStore = () => store.clear()
