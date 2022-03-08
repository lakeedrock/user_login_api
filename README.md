# REST API for User Register, Update Info, Login with JWT and Change Password
### Technologies and Frameworks / Libraries
* Node.js 
* Express
* Typescript
* MySQL
* TypeOrm

## Requirements

This API Service can be run in Node.js and MySQL environments

## Clone the project

Use either following command to clone the repository

```shell
git clone git@github.com:lakeedrock/user_login_api.git
```

or

```shell
git clone https://github.com/lakeedrock/user_login_api.git
```

## Update configs

Run following commands in your terminal to generate config files
`.env` and `ormconfig.json`


```shell
// Change path to project directory
cd user_login_api

// Create config files
cp sample.env .env
cp sample.ormconfig.json ormconfig.json
```

useing your favoirite text editer update following fonfig values

### Environment configuration #.env file
```shell
PORT= { Application server port }
SECRET_KEY= { JWT secret key }
MAX_AGE= { Lifetime of JWT cookie : 86400000 (one day) }
FRONTEND_ORIGIN= { Origin for cors : "http://localhost:80" }
```
### Database configuration #ormconfig.json file

```shell
{
  "type": "",           // Database type : mysql
  "host": "",           // Database host : localhost // mysql_server for docker
  "port": "",           // Database port : 3308
  "username": "",       // Database user : root
  "password": "",       // Database user password : Dev@r0ot
  "database": "",       // Database name: node_db
  "entities": ["src/entity/*.ts"],
  "logging": false,      // Set to true if you need to see logs in console
  "synchronize": true,
  "dropSchema": true
}
```

## Run in docker
run following command in terminal in your project root
````shell
docker compose up
````

## Run in local
#### Requirements
* Node Js and NPM installed
* MySQL server installed
* Postman installed (For testing purposes)

## Install node modules
```shell
npm install
```

## Run the project
```shell
npm run start
```

## To build the project
```shell
npm run build
```

## To run unit tests
```shell
npm run test
```

## Testing API

Use `Postman` application to test the API service. Download `Postman` application from https://www.postman.com/downloads/

Import API collection json file from `postman/Node User API.postman_collection.json` to Postman. For more instruction please visit https://learning.postman.com/docs/getting-started/importing-and-exporting-data/

## API Documentation

### Register user

```shell
API Call : http://api_service_url/api/register

Method : POST

Body Parms Object:
{
    "firstName": String,
    "lastName": String,
    "email": String,
    "password": String,
    "passwordConfirmation": String
}

Response Object:
{
    "first_name": String,
    "last_name": String",
    "email": String,
    "id": Number
}

```

### Login User

```shell
API Call : http://api_service_url/api/login

Method : POST

Body Parms Object:
{
    "email": String,
    "password": String
}

Response Object:
{
    "message": "success",
}

``````

### Get User
```shell
API Call : http://api_service_url/api/user

Method : GET

Body Parms Object: { none }

Response Object:
{
    "id": Number,
    "first_name": String,
    "last_name": String,
    "email": String
}
``````

### Update User
```shell
API Call : http://api_service_url/api/user

Method : PUT

Body Parms Object: 
{ 
    "firstName": String,
    "lastName": String,
    "email": String
}

Response Object:
{
    "id": Number,
    "first_name": String,
    "last_name": String,
    "email": String
}
``````

### Change Password

```shell
API Call : http://api_service_url/api/password

Method : PUT

Body Parms Object: 
{ 
    "currentPassword": String,
    "newPassword": String,
    "passwordConfirmation": String
}

Response Object:
{
    "message": "succcess"
}
``````

### Thank you !

`#happycoding`
