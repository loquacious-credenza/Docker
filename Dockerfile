FROM node:argon
RUN mkdir -p /DockerServer 
WORKDIR /DockerServer
COPY ../Server/package.json .
RUN npm install
COPY ../Server .
EXPOSE 8000

CMD ["node", "Server/server.js"]
