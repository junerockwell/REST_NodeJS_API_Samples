# REST API Sample Apps
The main frameworks for the REST API apps is RestifyJS for NodeJS

In this one repository, there are 3 sample apps. All of them are in RestifyJS for the NodeJS Environment. But there 3 different apps to simulate the different databases that I have experience working with.

## 1. REST API with MySQL
The API was hosted on an EC2 Tier while the MySQL was hosted on a Amazon RDS.

## 2. REST API with MSSQL
The API was hosted on an EC2 Tier while the MSSQL was hosted in an Azure DB Instance specifically for Microsoft's SQL Server.

## 3. REST API with mLab
The API was hosted on an EC2 Tier and connected to a MongoDB instance on mLab.com

## The REST API app
All 3 of the REST API apps are made in RestifyJS for the NodeJS Envinroment. 

On the EC2 Container, PM2 was used for keep the app alive both in Production and Development.

## Improvements?
1. Add Unit Tests
2. Make TypeScript versions
3. Add instructions in each app to get started, and make AWS instances.
