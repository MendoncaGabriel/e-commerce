const fs = require('fs').promises;

async function deleteFile(caminhoArquivo) {
  try {
    const exists = await fs.access(caminhoArquivo).then(() => true).catch(() => false);
    if (exists) {
      await fs.unlink(caminhoArquivo);
      console.log(`Arquivo deletada: ${caminhoArquivo}`);
    } else {
      console.log(`Arquivo não encontrada: ${caminhoArquivo}`);
    }
  } catch (error) {
    console.error(`Erro ao deletar Arquivo ${caminhoArquivo}:`, error);
  }
}

module.exports = deleteFile