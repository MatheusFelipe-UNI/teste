const { unlink } = require("fs/promises");
const { existsSync } = require("node:fs");
const path = require("path");

async function deleteFile(fileName) {
   const dirUpload = "public/uploads";
   const filePath = path.join(dirUpload, fileName);
   if(existsSync(filePath)) {
      await unlink(filePath);
   }
   return true; 
}

module.exports = deleteFile;