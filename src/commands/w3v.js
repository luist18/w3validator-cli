const fs = require('fs')
const controller = require('../controller/w3vController')
const { print } = require('gluegun')
require('colors')

const command = {
  name: 'w3v',
  description: 'Validate an HTML file in the w3 validator',
  run: async toolbox => {
    const {
      print: { info, error, success },
      parameters
    } = toolbox

    if (!parameters.first) {
      error('Missing file operand')
      return
    }

    const verbosity = parameters.options.all | false
    const recursive = parameters.options.recursive | false
    const path = parameters.first

    try {
      const stat = await fs.promises.stat(path)

      if (!stat.isFile()) {
        const data = await controller.directory(path, recursive)

        displayBulk(data, verbosity)
      } else {
        const file = await fs.promises.readFile(path, 'utf-8')

        const data = await controller.single(file)

        display(data, verbosity)
      }
    } catch (err) {
      error(`No such file ${path}`)
    }
  }
}

function display(data, verbosity) {
  const { info, error, success, warning } = print

  if (data.error) {
    error(data.message)
    return
  }

  if (data.ok) {
    success(data.message)
    return
  }

  if (!verbosity) {
    error('FAILED')
    return
  }

  info((data.path !== undefined ? `${data.path} ` : '').red.concat
    (!data.errorCount
      ? ''
      : `❌ ${data.errorCount} `.concat(
        data.errorCount === 1 ? 'error' : 'errors'
      ).red
    )
      .concat(data.errorCount > 0 && data.warningCount > 0 ? ' and ' : '')
      .concat(
        !data.warningCount
          ? ''
          : `⚠ ${data.warningCount} `.concat(
            data.warningCount === 1 ? 'warning' : 'warnings'
          ).brightYellow
      )
  )

  data.errors.forEach(err => {
    if (err.type === 'error')
      error(
        `    Line ${err.line}\t`.gray.bold
          .concat(`${err.type}\t\t`)
          .concat(`${err.description}`.white)
      )
    else
      warning(
        `    Line ${err.line}\t`.gray.bold
          .concat(`${err.type}\t`)
          .concat(`${err.description}`.white)
      )
  })
}

function displayBulk(data, verbosity) {
  const { info, error, success, warning } = print

  if (data.error) {
    error(data.message)
    return
  }

  if (!verbosity) {
    for (var file of data) {
      if (file.error) {
        error(`${file.path}: `.concat(`${file.message}`))
        continue
      }
    
      if (file.ok) {
        success(`${file.path}: `.concat(`${file.message}`))
        continue
      }

      error(`${file.path}: FAILED`)
    }

    return
  }

  for (var file of data) {
    if (file.ok) {
      success(`${file.path}: `.concat(`${file.message}`))
      console.log()
      continue
    }

    display(file, verbosity)

    console.log()
  }
}

module.exports = command
