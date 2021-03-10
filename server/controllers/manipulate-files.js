const fs = require('fs').promises;




// async function readFile(filePath) {
//     try {
//       const data = await fs.readFile(filePath);
//       console.log(data.toString());
//     } catch (error) {
//       console.error(`Got an error trying to read the file: ${error.message}`);
//     }
//   }
  
//   readFile('greetings.txt');


// async function deleteFile(filePath) {
//   try {
//     await fs.unlink(filePath);
//     console.log(`Deleted ${filePath}`);
//   } catch (error) {
//     console.error(`Got an error trying to delete the file: ${error.message}`);
//   }
// }

// deleteFile('groceries.csv');





// async function openFile() {
//   try {
//     const csvHeaders = 'name,quantity,price'
//     await fs.writeFile('groceries.csv', csvHeaders);
//   } catch (error) {
//     console.error(`Got an error trying to write to a file: ${error.message}`);
//   }
// }




// async function moveFile(source, destination) {
//   try {
//     await fs.rename(source, destination);
//     console.log(`Moved file from ${source} to ${destination}`);
//   } catch (error) {
//     console.error(`Got an error trying to move the file: ${error.message}`);
//   }
// }

// moveFile('greetings-2.txt', 'test-data/salutations.txt');


//directoryString=/public directory
const generateFileTreeObject = directoryString => {  
  return fs.readdirAsync(directoryString)
    .then(arrayOfFileNameStrings => {
      const fileDataPromises = arrayOfFileNameStrings.map(fileNameString => {
        const fullPath = `${directoryString}/${fileNameString}`;
        return fs.statAsync(fullPath)
          .then(fileData => {
            const file = {};
            file.filePath = fullPath;
            file.isFileBoolean = fileData.isFile();
            /*Here is where we'll do our recursive call*/
            if (!file.isFileBoolean) {
              return generateFileTreeObject(file.filePath)
                .then(fileNamesSubArray => {
                  file.files = fileNamesSubArray;
                })
                .catch(console.error);
            }
            /*End recursive condition*/
            return file;
          });
      });
      return Promise.all(fileDataPromises);
    });
};

  ShowAllfiles = async (req, res)  => {
  var Files=[]
  await generateFileTreeObject(req.body.directory)
  .then(files => {
    Files=files
  
    return res.status(200).json({files:Files})
  })
  .catch(error => {
    return res.status(400).json({error:true, error: 'User not created!'})
}) 

}
module.exports = {
  ShowAllfiles
}