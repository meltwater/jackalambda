import path from 'path'
import { promises as fsPromises } from 'fs'

/**
 * A method read a file from disk and parse it as JSON
 * @param  {...any} args - The path as it would be provided to path.resolve
 *
 * @returns {Object} - The file contents parsed as JSON
 */
export const readJson = async (...args) => {
  const fPath = path.resolve(...args)
  const data = await fsPromises.readFile(fPath)
  return JSON.parse(data.toString())
}
