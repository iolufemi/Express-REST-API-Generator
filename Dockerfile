FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install nodemon -g

COPY . .

EXPOSE 8080

CMD [ "npm", "watch" ]
