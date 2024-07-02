FROM node:20.15.0-alpine3.20

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
USER node

RUN npm install
COPY --chown=node:node . .
EXPOSE 3000

RUN npx prisma generate
RUN npm run build
CMD ["npm", "run", "start"]