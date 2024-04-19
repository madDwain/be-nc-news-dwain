# Northcoders News API

Hello, this project is an API which allows us to programatically interact with the PSQL database, using node-postgres.

To setup the test and devlopment databases, you will need to create a .env.test file and a .env.devlopment file. Each of these must include PGDATABASE=... and include the necessary database name, which can be found in the package.JSON file. 

You will also need to run:
 - npm install
 - npm install jest -D
 - npm install jest-sorted -D
 - npm install supertest
 - npm install pg
 - npm install dotenv

The hosted version can be found at https://nc-news-dwainfco.onrender.com 

The minimum version of node required to run this project is v21.6.1.
The minimum version of node-postgres required to run this project is v8.11.5

