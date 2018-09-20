# Pomodoro Backend API

This is the graphql backend api for pomodoro client app, you can check it here: [PomodoroApp](https://github.com/Rafaell416/pomodoro-rn-app)

## Test the Api - explorer

You can test and explore the api using Graphiql client [here](https://pomodoro-backend-yownypqxqx.now.sh/graphql)

## Local installation

You can run the app locally with some little setup

```
1. download code

  git clone git@github.com:Rafaell416/pomodoro-api.git

2. instal dependencies

  cd pomodoro-api
  yarn install

3. set the environment variables

  export DB_URL='' && export JWT_SECRET=''

  I used a mongo db atlas instance but you can use your own mongo db databse
  also you have to export a secret phrase to generate the JSON web tokens api security

4. run the project

  yarn dev  for development
  yarn start for production

5. Open it on http://localhost:3000
```


## Run the docker image

Also if you prefer you can run the project as a docker container

```
1. Create the image

  docker build -t image_name .

2. Run container

  docker run -p ACCESS_PORT:PROJECT image_name
  // ex: docker run -p 3000:3000 image_name

3. Open it on http://localhost:3000
```

## Stack
The app is build with
- Nodejs
- GraphQL - Apollo Server
- GraphQl Subscriptions - Apollo Websockets
- MongoDB - Mongoose
