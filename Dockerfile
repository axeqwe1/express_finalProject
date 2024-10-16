FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# ติดตั้ง nodemon ทั่วไปใน container
RUN npm install -g nodemon

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]
