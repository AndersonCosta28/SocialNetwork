# SocialNetwork
This is the social network project under construction, try it, have fun and contribute. \
**Despite being an Open Source project, in its current maturity it does not have moderate measures for data protection, so the project executed locally or connecting to the cloud bank (perhaps in the future) is the sole responsibility of the user, we hope that this will encourage the contribution to strengthen and make you more secure.**

# Used Components
* NodeJS
* TypeScript
* Mysql
* SocketIO (websocket)
* Redis (cache)
* ReactJS

# Prerequisites
* Have NodeJS in its LTS version
* A table called "socialnetwork" in Mysql
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
```
