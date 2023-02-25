# SocialNetwork
This is the social network project under construction, try it, have fun and contribute.
**Despite being an Open Source project, in its current maturity it does not have moderate measures for data protection, so the project and data running locally or connecting to a centralized cloud database (perhaps in the future) is the sole responsibility of the user, we hope this will encourage contribution to strengthen and make it safer.**

# Technologies used
* NodeJS
* Mysql
* SocketIO (websocket)
* Redis (cache)
* ReactJS (TSX)
* Docker (optional)
* JWT

# Used libraries
## Both
* TypeScript
* SocketIO
* dotenv
* Status-code-enum

## Server side
* TypeORM
* Express
* Multer
* NodeMailer

## Client side
* React Router Dom
* React Hot Toaster
* React loading skeleton
* React textarea autosize
* React Icons
* Axios
* TypedJs
* UUID


# Prerequisites
* Have NodeJS in its LTS version
* A database called "socialnetwork" in Mysql
* Redis running on default port
* [Environment variables file in the root of the project](#envs)

# Commands to run
* `npm install`
* `npm run dev`

# <span id="envs">Environment variables file</span>
Environment variables file has the following format: <br>
```
EMAILSERVICE_EMAILTOSEND_HOST=  
EMAILSERVICE_EMAILTOSEND_PORT=  
EMAILSERVICE_EMAILTOSEND_EMAIL= 
EMAILSERVICE_EMAILTOSEND_PASSWORD= 
EMAILSERVICE_EMAILTOSEND_NAME=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_HOST=
DATABASE_PORT=
NODE_ENV=
PORT_SERVER=
PORT_CLIENT=
TZ=
```
