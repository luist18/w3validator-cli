function parse(data) {
  data = data.split('\n')

  data = data.filter(element => element.trim().length !== 0)

  var errors = data.map(error => {
    items = error.split(':').slice(1)

    return {
      line: items[0].split('.')[0],
      type: items[1].trim(),
      description: items[2].trim()
    }
  })

  errors = errors.sort((a, b) => a.line - b.line)

  return {
    ok: errors.length === 0,
    errors
  }
}

module.exports = { parse }
