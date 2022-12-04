FROM node:16-alpine

# can't edit the hosts file before the container is running
# because the hosts file will be maintained and reset once the container starts

CMD npm run start