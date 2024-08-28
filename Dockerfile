FROM node:20-slim

USER node

WORKDIR /home/node/

COPY --chown=node:node shopper-node-technical-test .

COPY --chown=node:node .env .

RUN npm install -y && \ 
    node setup.mjs && \ 
    npm run migration:run && \ 
    npm run build && \ 
    npm cache clean --force

EXPOSE 8080

CMD ["npm", "run", "start:prod"]