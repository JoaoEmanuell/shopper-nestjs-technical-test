FROM node:20

USER node

WORKDIR /home/node/

COPY --chown=node:node shopper-node-technical-test .

COPY --chown=node:node .env .

RUN npm install -y

RUN node setup.mjs

RUN npm run migration:run

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]