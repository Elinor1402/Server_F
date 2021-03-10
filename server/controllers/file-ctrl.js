const express = require('express');
const multer = require('multer');
const path = require('path');
const helpers = require('../helpers/file-filter');
const fs = require('fs');




const storage = multer.diskStorage({
    //cb= callback function
    destination: (req, file, cb)=> {
    // let dest = path.join(__dirname, './public', req.body.directory.toString());
    // var req = req.body;

    console.log(req.query.directory)
        // cb(null, 'uploads/');
        // cb(null,dest)
      
        //רק האופציה הזו עם הפרמטרים עובדת
        // console.log(req.param('directory'))
        
        // if(req.param('directory')!=="")
        
        // cb(null, 'public/'+req.param('directory'))

        // else
        // {
        //     return cb(new Error('no location of file'), false);
        // }
        //not working

        cb(null, 'public/'+req.query.directory)
    },

    // By default, multer removes file extensions so let's add them back
    filename: (req, file, cb) =>{
        // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        cb(null, file.originalname);
    }
});


fileUpload = async (req, res)  => {
    
const maxSize = 1 * 1000 * 1000; 
const upload = multer({ storage: storage,limits: { fileSize: maxSize },fileFilter: helpers.FilesFilter}).single('dataFile');


    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
        file=req.file;
       if (err instanceof multer.MulterError) {
            return res.status(400).json({error:err});
        }
        else if(err)
        {
            if (req.fileValidationError) {
                return res.status(400).json({error: true, error: req.fileValidationError});    
            }
            return res.status(400).json({error:err});
        }
        else if (!file) {
            return res.status(400).json({error: true, error: "Please select a file to upload"});    
        }

        // Display uploaded image for user validation
        // res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
    
        return res.status(200).json({ message: 'File uploaded successfully.',file});
    })

}


files_Upload = async (req, res)  => {

const maxSize = 1 * 1000 * 1000; 
const upload = multer({ storage: storage,limits: { fileSize: maxSize },fileFilter: helpers.FilesFilter}).array('dataFiles', 10);

    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
        // file=req.file;
        const files = req.files;

        if (err instanceof multer.MulterError) {
            return res.status(400).json({error:err});
        }
        else if(err)
        {
            if (req.fileValidationError) {
                return res.status(400).json({error: true, error: req.fileValidationError});   
            }
            return res.status(400).json({error:"no such location"});
        }
        else if (!files || files.length==0) {
            return res.status(400).json({error: true, error: "Please select files to upload"});    
        }


        let result = "You have uploaded these files";
        // const files = req.files;
        let index, len;

        // Loop through all the uploaded images and display them on frontend
        // for (index = 0, len = files.length; index < len; ++index) {
        //     result += `<img src="${files[index].path}" width="300" style="margin-right: 20px;">`;
        // }
        // result += '<hr/><a href="./">Upload more images</a>';


        return res.status(200).json({ message: 'Files uploaded successfully.',files});
        // res.send(result);
    })
}

create_directory = (req, res)  => {
//create directory inside another when req.params contains a path
    fs.mkdir('public/'+req.query.directory, 
    { recursive: true }, (err) => { 
        if (err) { 
            return res.status(400).json({error:err});
        } 
    }); 
return res.status(200).json({ message: 'Directory created successfully'});
}

const  generatefiles = (dirPath,arrayOfFiles,arrayofchildrens=[])  => {

    arrayOfFiles=arrayOfFiles||[]
 
    try
    {
        files = fs.readdirSync(dirPath)

        files.forEach(function(file) {

            const fullPath=path.resolve(dirPath,file);

            if (fs.statSync(fullPath).isDirectory()) {
                
                const FileItem = {
                    type: "folder",
                    name: file,
                    path: path.join(__dirname, dirPath, "/", file),
                    childrens:arrayofchildrens.concat(generatefiles(fullPath))
                };


                arrayOfFiles.push(FileItem)
                // arrayofchildrens=[]
                // arrayOfFiles =generatefiles(fullPath, arrayOfFiles)
            } 

            else {
                const FileItem = {
                    type: "file",
                    name: file,
                    path: path.join(__dirname, dirPath, "/", file),
                    childrens:[]
                };
              
                    arrayOfFiles.push(FileItem)

            }
        })
    }
    catch
    {
        return
    }
    return arrayOfFiles
}


    getfiles = (req, res)  => {

     const results=  generatefiles('public/'+req.query.directory);

        // console.log(results)
        // for (i = 0; i < results.length; i++) 
        // {   
        //     // for(j=0; j<results[i].length;j++)
        //     // {
        //         console.log(results[i].filename)
        //     // }

        // }
        return res.status(200).json({success: true, data:results});
    }
    
module.exports = {
    fileUpload,
    files_Upload,
    getfiles,
    create_directory,
}
