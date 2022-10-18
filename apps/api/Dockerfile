# use images supported by heroku
FROM --platform=linux/amd64 node:14.17.0-alpine
# switch to the /app folder in the image
WORKDIR /app
# copy all files from the folder its in into the /app folder we switched to
COPY ./ ./
# launch the main.js file
CMD node main.js
