const fs = require('fs');

class FileManager {
  static checkFile(caminhoArquivo) {
    try {
      return fs.existsSync(caminhoArquivo);
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  static deleteFile(caminhoArquivo) {
    try {
      fs.unlinkSync(caminhoArquivo);
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = FileManager;
