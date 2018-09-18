FROM node
EXPOSE 3000

WORKDIR /app

ADD package.json /app
RUN npm install
ADD . /app
RUN export DB_URL='' && export JWT_SECRET=''

CMD ["npm", "start"]
