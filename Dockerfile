FROM node:17-alpine3.12

WORKDIR /app

COPY . .

RUN npm install
RUN npm install -g nx
CMD ["nx", "run-many", "--parallel", "--target=serve", "--projects=account,api"]