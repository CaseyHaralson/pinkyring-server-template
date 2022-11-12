FROM node:16-alpine
WORKDIR /build
COPY package-lock.json package.json ./
COPY ../../packages/infrastructure/repositories/prisma ./prisma
RUN npm ci
COPY . .

# https://esbuild.github.io/api/
# also refer to: https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-lambda-nodejs/lib/bundling.ts
RUN npx esbuild migration-runner.ts --bundle --outdir=dist --platform=node --external:aws-sdk --external:@prisma/client


RUN npm install nodemon --global

CMD nodemon --exec npm run build \
  --watch '.'