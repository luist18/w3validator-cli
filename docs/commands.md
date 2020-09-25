# w3v Documentation

`w3v` command line tool documentation.

## Table of contents

1. [Markup Validation Service](#w3-validator-description)
2. [Features](#features)
3. [Installing](#installing)
4. [Commands](#commands)
    4.1. [w3v](#w3v)
5. [License](#license)

## w3 validator description

The Markup Validation Service is a validator made by the World Wide Web Consortium (W3C) to validate the integrity of HTML and XHTML documents, ensuring its technical quality.

## Features

The `w3v` command line tool is a tool that allows users to run the [validator](https://validator.w3.org/) in their development workspace through the command line. Since HTML documents are usually part of a project, users can also validate their entire project through the command line instead of using the w3 validator website.

## Installing

Using npm:

```bash
$ npm install -g @luist18/w3v
```

Using yarn:

```bash
$ yarn add global @luist18/w3v
```

## Commands

### w3v

The `w3v` root command validates the filename of directory specified in the first parameter.

**Usage:** ```$ w3v <filename or directory>```

The default output is `OK` or `FAILED`, if the file is successfully validated or not.

#### Options

`--all` provides a complete description of the errors if the file is not successfully validated.

`--recursive` validates the `.html` and `.xhtml` files in the sub directories.

## License

[MIT](LICENSE)
