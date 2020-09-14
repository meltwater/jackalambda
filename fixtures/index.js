import path from 'path'
import { promises as fsPromises } from 'fs'

export const getJsonFixture = async (name) => {
  const fPath = path.join(__dirname, name)
  const data = await fsPromises.readFile(fPath)
  return JSON.parse(data.toString())
}
