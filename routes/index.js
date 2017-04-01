const express = require('express');
const router = express.Router();
const fs = require('fs'),
PDFDocument = require('pdfkit'),
blobStream = require('blob-stream');


router.get('/', (req, result, next) => {
  result.render('input');
});

router.post('/', function(req, response, next) {
  let searchName = req.body.name;
  let doc,
    imgBlob;
  req.getConnection(function(err, conn) {
    if (err) {
      console.log('sql error', err);
    } else {
      conn.query('SELECT * FROM user WHERE firstName = ?', searchName, function(err, result) {
        if (err) {
          console.log('sql error:', err);
        } else {
          //generate pdf
          let writeStream = fs.createWriteStream('file.pdf');
          doc = new PDFDocument({size: 'LEGAL'});
          doc.pipe(blobStream());
          doc.pipe(writeStream);
          imgBlob = result[0].image;
          fullName = result[0].firstName + ' ' + result[0].lastName;
          doc.text(fullName, 100, 100);
          doc.image(imgBlob, {width: 300});
          doc.end();

          //get bytes
          let buffers = [];
          doc.on('data', function(buff) {
          buffers.push(buff);
          });

          doc.on('end', function () {
          //insert pdf
           conn.query(`UPDATE user SET pdf = ? WHERE firstName = '${searchName}'` , buffers.toString(), function(err, resul) {
              if (err) {
                throw err;
                console.log('sql error:', err);
                response.send(JSON.stringify({ result: false }));
              } else {
                if (!!resul) {
                  response.send(JSON.stringify({ result: true }));
                }
              }
            });
        });

          fs.unlink('file.pdf');
        }
      });
    }
  });
});


module.exports = router;
