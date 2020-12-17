# REST NodeJS API Sample Apps
I've kept these sample apps for a while now, and it's time to make them public! And, also improve them if I even find the time.

Since a lot of the REST API concepts are very similar, especially in the NodeJS way (e.g. Express, Restify, HapiJS, etc.), I figured that I'll make templates for each REST API that I personally like doing to prevent re-creating the wheel, look back and see what I can improve as years go by...The only difference for each template is that they're interfacing different types of Databases.

In this one repository, there are 4 sample apps. All of them are in RestifyJS for the NodeJS Environment. But there are 4 different apps to simulate the different databases that I have experiences working with.

## 1. REST API with MySQL
The API was hosted on an EC2 Tier while the MySQL was hosted on a Amazon RDS.

## 2. REST API with MSSQL
The API was hosted on an EC2 Tier while the MSSQL was hosted in an Azure DB Instance specifically for Microsoft's SQL Server.

## 3. REST API with mLab
The API was hosted on an EC2 Tier and connected to a MongoDB instance on mLab.com

## 4. REST API with MongoDB Atlas
This version replaces the `mLab` version because `mLab` is now obsolete. I transferred to MongoDB Atlas as my new playground for MongoDB DBaaS. The updates for this project will reflect the the other versions with MySQL and MSSQL in due time.

## The REST API app
All 4 of the REST API apps are made in RestifyJS for the NodeJS Envinroment. 

On the EC2 Container, PM2 was used to keep the apps alive both in Production and Development.

## EC2 Container
1. Linux (the Amazon OS version, and the free tier one!)
2. NodeJS (version 8, at the time, I believe)
3. PM2

## Improvements?
1. Add Unit Tests - I might use Jest instead of Mocha and Chai.
2. Make TypeScript versions(?)
3. Add instructions in each app to get started, and make AWS instances.
4. Microservices
5. DevOps
6. JSON Web Token - Added to the REST API with MongoDB Atlas. Will integrate with the other versions soon.
