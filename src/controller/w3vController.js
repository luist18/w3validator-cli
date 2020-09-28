const axios = require('axios')
const fs = require('fs')
const path = require('path')
const parser = require('../util/parser')

const options = file => ({
  method: 'post',
  url: 'https://validator.w3.org/nu/?out=gnu',
  data: file,
  headers: {
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
    'content-type': 'text/html',
    charset: 'utf-8'
  }
})

async function single(file) {
  const { status, data } = await axios(options(file))

  if (status !== 200) {
    return {
      error: true,
      ok: false,
      message: 'FAILED'
    }
  }

  parsedData = parser.parse(data)

  if (parsedData.ok) {
    return {
      error: false,
      ok: true,
      message: 'OK'
    }
  }

  const errorCount = parsedData.errors.filter(err => err.type === 'error')
    .length

  return {
    error: false,
    ok: false,
    errorCount,
    warningCount: parsedData.errors.length - errorCount,
    errors: parsedData.errors
  }
}

async function directory(directory, recursive) {
  const files = await getFiles(directory, recursive)

  if (files.length === 0)
    return {
      error: true,
      message: 'No files were found'
    }

  const data = []

  for (var filename of files) {
    const file = await fs.promises.readFile(filename, 'utf-8')

    const fileData = await single(file)

    fileData.path = filename

    data.push(fileData)
  }

  return data
}

async function getFiles(directory, recursive, files = []) {
  const filenames = await fs.promises.readdir(directory)

  for (var filename of filenames) {
    const fullPath = path.join(directory, filename)

    const stat = await fs.promises.stat(fullPath)

    if (stat.isFile()) {
      if (/\.x?html/i.test(filename))
        files.push(fullPath)
    } else if (stat.isDirectory() && recursive) {
      await getFiles(fullPath, recursive, files)
    }
  }

  return files
}

module.exports = { single, directory }
