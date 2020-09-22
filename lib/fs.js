import path from 'path'
import { promises as fsPromises } from 'fs'

export const readJson = async (...args) => {
  const fPath = path.resolve(...args)
  const data = await fsPromises.readFile(fPath)
  return JSON.parse(data.toString())
}
