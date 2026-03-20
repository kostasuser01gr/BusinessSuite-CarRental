import { User } from '../../shared/types.js'

// In-memory store for users (temporary baseline)
// In production, this would be replaced with a real database
export const usersStore: (User & { passwordHash: string })[] = []

export const findUserByEmail = (email: string) => {
  return usersStore.find(u => u.email === email)
}

export const findUserById = (id: string) => {
  return usersStore.find(u => u.id === id)
}

export const createUser = (user: User & { passwordHash: string }) => {
  usersStore.push(user)
  return user
}
