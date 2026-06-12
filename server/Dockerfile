# AWS ECR Public mirror — use when Docker Hub is blocked (e.g. Iran)
FROM public.ecr.aws/docker/library/node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
