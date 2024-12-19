#
# 🧑‍💻 Dependencies
#
FROM node:18-alpine as deps

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

#
# 🧪 Test Stage
#
FROM deps as test

WORKDIR /usr/src/app

COPY . .

RUN npm run test

#
# 🏡 Production Build
#
FROM node:18-alpine as build

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

RUN npm run build
RUN npm ci -f --only=production && npm cache clean --force

#
# 🚀 Production Server
#
FROM node:18-alpine as prod

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

ENV NODE_ENV production

USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]
