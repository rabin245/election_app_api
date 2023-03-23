# Election Dapp

The api used for auth in [Election Dapp](https://electiondapp.onrender.com/) built with Node.js

> Checkout to the `sepolia-testnet` branch to browse the deployed api code.

---

## Requirements

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
- [Nodejs](https://nodejs.org/en/)
  - You'll know you've installed nodejs right if you can run:
    - `node --version` and get an ouput like: `vx.x.x`

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
