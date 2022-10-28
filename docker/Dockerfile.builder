FROM node:16-alpine

RUN npm install nodemon --global 

CMD nodemon --exec npm run build \
  --ext ts \
  --watch './packages/**' \
  --ignore './packages/**/bin/**'