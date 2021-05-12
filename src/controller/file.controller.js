const uploadFile = require("../middleware/upload");
const fs = require("fs");
const baseUrl = "http://localhost:8080/files/";
//
var MongoClient = require('mongodb').MongoClient;
//

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);
	// make a connection 
            var url = "mongodb://devlamine:formeduc@cluster0-shard-00-00.phlgv.mongodb.net:27017,cluster0-shard-00-01.phlgv.mongodb.net:27017,cluster0-shard-00-02.phlgv.mongodb.net:27017/sample_airbnb?ssl=true&replicaSet=atlas-zxw3cn-shard-0&authSource=admin&retryWrites=true&w=majority";
            
            MongoClient.connect(url, function(err, db) {
              if (err) throw err;
              var dbo = db.db("sample_airbnb");
			  //
			  let renameFile = req.file.originalname
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
			renameFile = renameFile
            .split(' ')
            .join('')
            .toLowerCase();
			  //
              var myobj = { name_image: renameFile };
              dbo.collection("imagedocuments").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
              });
            });
            //

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};


//
const deletefile = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";
  
  // make a connection 
            var url = "mongodb://devlamine:formeduc@cluster0-shard-00-00.phlgv.mongodb.net:27017,cluster0-shard-00-01.phlgv.mongodb.net:27017,cluster0-shard-00-02.phlgv.mongodb.net:27017/sample_airbnb?ssl=true&replicaSet=atlas-zxw3cn-shard-0&authSource=admin&retryWrites=true&w=majority";
            
            MongoClient.connect(url, function(err, db) {
              if (err) throw err;
              var dbo = db.db("sample_airbnb");
			  //
			
			  //
              var myobj = { name_image: fileName };
              dbo.collection("imagedocuments").deleteOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document deleted");
                db.close();
              });
            });
            //

		 fs.unlink(directoryPath + fileName, (err) => {
		  if (err) {
			return res.status(500).send({
        message: "fichier introuvable!",
      });
		  }

		  res.status(200).send({
      message: "suppression réussi " + directoryPath+fileName,
    });
		})

    
};
//
const updateFile = async (req, res) => {
  
  try {
    await uploadFile(req, res);
	// make a connection 
	const directoryPath = __basedir + "/resources/static/assets/uploads/";
    const fileName = req.params.name;   
	var url = "mongodb://devlamine:formeduc@cluster0-shard-00-00.phlgv.mongodb.net:27017,cluster0-shard-00-01.phlgv.mongodb.net:27017,cluster0-shard-00-02.phlgv.mongodb.net:27017/sample_airbnb?ssl=true&replicaSet=atlas-zxw3cn-shard-0&authSource=admin&retryWrites=true&w=majority";
            
            MongoClient.connect(url, function(err, db) {
              if (err) throw err;
              var dbo = db.db("sample_airbnb");
			  //
			//
			 let renameFile = req.file.originalname
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
			renameFile = renameFile
            .split(' ')
            .join('')
            .toLowerCase();
			  //
			  //
              var myobj = { name_image: fileName };
			  var newvalues = { $set: {name_image: renameFile } };
              dbo.collection("imagedocuments").updateOne(myobj, newvalues, function(err, res) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
              });
            });
	
            //

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    res.status(200).send({
      message: "Update succesfull : " + req.file.originalname,
    });
    
    //delete file
    fs.unlink(directoryPath + fileName, (err) => {
		  if (err) {
			return res.status(500).send({
        message: "fichier introuvable!",
      });
		  }

		  res.status(200).send({
      message: "suppression réussi " + directoryPath+fileName,
    });
		})
    
    //
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};
//

module.exports = {
  upload,
  getListFiles,
  download,
  deletefile,
  updateFile,
};
