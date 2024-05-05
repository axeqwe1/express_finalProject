const express = require('express')
const listImage = express.Router()
const fs = require('fs');
const path = require('path');
listImage.get('/list-images', (req, res) => {
    const directoryPath = path.join(__dirname, '../../images');
    console.log(__dirname)
    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        return res.status(500).send({ message: "Unable to scan files!" });
      }
      const fileUrls = files.map(file => `${req.protocol}://${req.get('host')}/images/${file}`);
      res.send(fileUrls);
    });
  });


  module.exports = listImage