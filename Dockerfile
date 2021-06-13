# syntax=docker/dockerfile:1

FROM node:14.17.0 as base
WORKDIR /app
COPY package*.json ./
EXPOSE 3000

FROM base as dev
ENV NODE_ENV=development
RUN npm install -g @nestjs/cli
#RUN npm install -g nodemon 
RUN npm install 
COPY . .
CMD ["npm", "run", "start:dev"]

# FROM base as production
# ENV NODE_ENV=production
# RUN npm ci
# COPY . .
# CMD [ "node", "bin/www" ]

