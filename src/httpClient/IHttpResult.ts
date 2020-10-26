export interface IHttpResult<T> {
  code: number
  message?: string
  name?: string
  stack?: string
  meta?: {
    count?: number
    nb?: number
    pageSize?: number
    offset?: number
    sort?:{[key:string]:1|-1}
    mongoquery?: any
  }
  response: T[]
}
