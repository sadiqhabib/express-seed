# Express seed project

[![github release](https://img.shields.io/github/release/meanie/express-seed.svg)](https://github.com/meanie/express-seed/releases)
[![node dependencies](https://david-dm.org/meanie/express-seed.svg)](https://david-dm.org/meanie/express-seed)
[![github issues](https://img.shields.io/github/issues/meanie/express-seed.svg)](https://github.com/meanie/express-seed/issues)
[![codacy](https://img.shields.io/codacy/1c5ef6bbcc9e4772aedc4d2243949d5b.svg)](https://www.codacy.com/app/meanie/express-seed)
[![gitter](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg)](https://gitter.im/meanie/meanie?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This repository contains a seed project for Express server applications written in ES5/ES6. It is part of the [Meanie](https://github.com/meanie/meanie) eco system, which is a collection of boilerplate code and libraries for developing, testing and building javascript applications using the MEAN stack (MongoDB, Express, Angular and Node).

This seed project is built to work together side by side with either the [Angular seed](https://github.com/meanie/angular-seed) (ES5/ES6) or [Angular 2 seed](https://github.com/meanie/angular2-seed) (TypeScript) projects for client side applications.

## Installation
You can install this seed project either by manually cloning the repository, or by using the [Meanie CLI](https://www.npmjs.com/package/meanie).

### Cloning from github
```shell
# Create empty project directory
mkdir my-project
cd my-project

# Clone repository
git clone https://github.com/meanie/express-seed.git .

# Install dependencies
npm install
```

### Using the Meanie CLI
This feature will be available shortly.
<!-- ```shell
# Create empty project directory
mkdir my-project
cd my-project

# Seed a new Express project
meanie seed express
```

If you don't have the Meanie CLI tool installed, you can install it using:

```shell
npm install -g meanie
```  -->

## Running the server
Once installed, you can run the server using one of the following options:

```shell
# Start the server using node
npm start

# Start the server using nodemon (for development)
npm run nodemon
```

## Folder structure

The following is an outline of the folder structure of this seed project:

```shell
# This is where your server side Express application resides.
├─ app

# This folder contains your environment specific application config.
├─ config

# This folder is for your database migrations.
├─ migrations

# This folder contains the main run scripts for your application.
└─ scripts
```

## Issues & feature requests

Please report any bugs, issues, suggestions and feature requests in the appropriate issue tracker:
* [Express seed project issue tracker](https://github.com/meanie/express-seed/issues)
* [Meanie CLI issue tracker](https://github.com/meanie/meanie/issues)

## Contributing

Pull requests are welcome! If you would like to contribute to Meanie, please check out the [Meanie contributing guidelines](https://github.com/meanie/meanie/blob/master/CONTRIBUTING.md).

## License

(MIT License)

Copyright 2015-2016, [Adam Buczynski](http://adambuczynski.com)
