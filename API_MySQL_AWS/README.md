# REST API in AWS with MySQL

At the conception of this sample project, the REST API app was kept alive using PM2 on an AWS EC2. The MySQL was an instance created in AWS RDS.

## Tech Highlights
**1. MySQL Driver:** The node module [`mysql`](https://github.com/mysqljs/mysql#readme)

**2. REST Framework:** Restify

**3. Authentication:** JsonWebToken


### For this latest version:
1. I integrated JWT for API Authentication.
2. Re-scaffold the routes and data files.
3. I did not use async/await syntax, and instead, I kept Callbacks and Promise functions because I was being nostalgic of the old days. If you'd like to see me apply async/await used in REST API, take a look at the [API_MongoDB_Atlas](https://github.com/junerockwell/REST_NodeJS_API_Samples/tree/master/API_MongoDB_Atlas) folder. MongooseJS added the async/await features so it was a given.
4. Added proper error handlings using `restify-errors`

**Alternatives to the `mysql` driver**
[Sequelize](https://github.com/sequelize/sequelize) is an ORM and a good alternative to `mysql` driver. In this project, I use only `mysql` which expects SQL Statements. However, with Sequelize, you don't make SQL Statements. It's beneficial to use Sequelize because it handles many SQL-DB like MSSQL Server, MariaDB and especially MySQL.

## Create the Database
**1. Remote MySQL DB on Amazon RDS:** https://aws.amazon.com/getting-started/hands-on/create-mysql-db/

**2. Local using MAMP on MacOS**

**3. Local using XAMPP on Windows**
