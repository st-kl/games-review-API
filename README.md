# House of Games API

## Description

This is an API to give access to board game reviews and related information.
It's a project to mimic the building of a real world back end service which provides the information to the front end architecture.

A productive version is hosted on Heroku and can be access via
https://be-nc-games-sk.herokuapp.com/api. \
The `/api` path contains more details about available endpoints and how to interact with them.

### Tables

- `reviews`: details about the board game
- `comments`: comments related to reviews
- `categories`: board game categories
- `users`: users who can post comments

### Endpoints

| Endpoint                           | Methods            |
| ---------------------------------- | ------------------ |
| `/api `                            | GET                |
| `/api/reviews`                     | GET, POST          |
| `/api/reviews/:review_id `         | GET, PATCH, DELETE |
| `/api/reviews/:review_id/comments` | GET, POST          |
| `/api/comments/:comment_id`        | PATCH, DELETE      |
| `/api/categories`                  | GET, POST          |
| `/api/users`                       | GET                |
| `/api/users/:username`             | GET                |


### Major Used Packages

- Web Application: `express`
- Database Interaction: `node-postgres`
- Testing: `jest`

---

## Setup

### Step 1 - Clone

- fork the repo
- clone it to your local machine: `git clone <url>`

### Step 2 - Install Dependencies

- in your cloned repo, open a new terminal and run `npm install` to install all packages
- if you don't need any of the dev dependencies, run `npm install --production`

### Step 3 - Define Environment

- you will need to create two .env files for the project to work:
  - `.env.test`
  - `.env.development`
- into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names)
- double check that these `.env` files are `.gitignored`

### Step 4 - Seed

- to create the databases, run `npm run setup-dbs`
- to seed the databases, run `npm run seed `
  - in the `run-seed.js` file you can select if you want to use `test` or `dev` data, the latter being more extensive

### Step 5 - Test

- run `run npm test` to run all tests
- run `npm test __tests__/<test-file-name>` to run a specific test file
- add `.only` to a `describe` or `it` to run selected tests only

---

## Version Requirements

- `Node.js`: 16.0.0 or higher
- `Postgres`: 12.7 or higher
