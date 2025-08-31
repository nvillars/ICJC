// Ambient module declarations for project models used in server routes
declare module 'models/*' {
  const m: any
  export default m
}

// Generic model shapes (used only to silence TS in dev tooling)
interface IUser {
  _id?: string
  name?: string
  email?: string
  roles?: string[]
  passwordHash?: string
  isActive?: boolean
}

interface IAuditLog { [k: string]: any }
interface IPost { [k: string]: any }
interface ISermon { [k: string]: any }
