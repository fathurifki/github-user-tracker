FROM node:20-alpine AS builder

ARG VITE_GITHUB_TOKEN=${VITE_GITHUB_TOKEN}
ENV VITE_GITHUB_TOKEN=${VITE_GITHUB_TOKEN}

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:20-alpine

WORKDIR /app

RUN yarn global add serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]