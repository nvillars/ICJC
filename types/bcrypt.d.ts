declare module 'bcrypt' {
  export function hash(data: string | Buffer, saltOrRounds: number): Promise<string>
  export function compare(data: string | Buffer, encrypted: string): Promise<boolean>
}

// fallback for environments using bcryptjs short name
declare module 'bcryptjs' {
  export function hash(data: string | Buffer, saltOrRounds: number): Promise<string>
  export function compare(data: string | Buffer, encrypted: string): Promise<boolean>
}

