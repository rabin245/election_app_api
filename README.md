# Election Dapp

The api used for auth in [Election Dapp](https://electiondapp.onrender.com/) built with Node.js

> Checkout to the `sepolia-testnet` branch to browse the deployed api code.

---

## Requirements

For development, you will only need Node.js and a node global package, npm, installed in your environement.

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v16.17.0

    $ npm --version
    8.15.0

---

## Install

    $ git clone https://github.com/rabin245/election_app_api.git
    $ cd election_app_api
    $ npm install

## Configure app

Open `.env.example` then rename it to `.env` and set the evironment variables for the api.

- A secret key for `jsonwebtoken`
- The `MongoDB` connection uri
- Outlook email and password for `nodemailer` package

Open `./config/corsOptions.js` and change the CORS origin to the deployed app url.

## Running the project

    $ npm run dev

## Simple build for production

    $ npm start
