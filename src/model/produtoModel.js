const path = require('path');
const db = require('../../database/database');
const varianteModel = require('./varianteModel');
const { checkFile, deleteFile } = require('../utilities/checkFile');

class Crud {
    async create(data, imagem) {
        const sql = `INSERT INTO produtos (nome, descricao, ativo, marca, modelo, preco, tamanho, quantidade, referencia, vendas, ean, estoque, custo, imagem, categorias_categoria_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        const values = [
            data.nome, data.descricao, data.ativo || 1, data.marca, data.modelo, data.preco,
            data.tamanho, data.quantidade, data.referencia, data.vendas || 0, data.ean, data.estoque || 0,
            data.custo || null, imagem || null, data.categoria
        ];
        try {
            const result = await db.query(sql, values);
            return result;
        } catch (error) {
            console.error("Erro ao criar novo produto:", error);
            throw error;
        }
    }

    async getById(id) {
        const sql = `SELECT * FROM produtos WHERE produto_id = ?;`;
        const values = [id];
        try {
            const result = await db.query(sql, values);
            return result;
        } catch (error) {
            console.error("Erro ao pegar produto por id:", error);
            throw error;
        }
    }

    async getImagem(id) {
        const sql = `SELECT imagem FROM produtos WHERE produto_id = ? AND imagem IS NOT NULL AND imagem != '';`;
        const values = [id];
        try {
            const result = await db.query(sql, values);
            return result;
        } catch (error) {
            console.error("Erro ao pegar imagem do produto:", error);
            throw error;
        }
    }

    async getByIdWithCategoria(id) {
        const sql = `SELECT produtos.*, categorias.* FROM produtos JOIN categorias ON produtos.categorias_categoria_id = categorias.categoria_id WHERE produtos.produto_id = ?;`;
        const values = [id];
        try {
            const result = await db.query(sql, values);
            return result;
        } catch (error) {
            console.error("Erro ao pegar produto por id com categoria:", error);
            throw error;
        }
    }

    async getByName(nome) {
        const sql = `SELECT * FROM produtos WHERE LOWER(REPLACE(nome, ' ', '-')) = ?;`;
        const nomeLowerCase = nome.toLowerCase().replace(/ /g, '-');
        const values = [nomeLowerCase];
        try {
            const result = await db.query(sql, values);
            return result;
        } catch (error) {
            console.error("Erro ao pegar produto por nome:", error);
            throw error;
        }
    }

    async updateStock(id, decrementAmount) {
        const sql = `UPDATE produtos SET estoque = GREATEST(estoque - ?, 0) WHERE produto_id = ?;`;
        const values = [decrementAmount, id];
        try {
            const result = await db.query(sql, values);
            return result;
        } catch (error) {
            console.error("Erro ao atualizar estoque do produto:", error);
            throw error;
        }
    }

    async getByCategoria(categoria) {
        const sql = `SELECT * FROM produtos JOIN categorias ON categorias.nome_categoria = ? AND categorias.categoria_id = produtos.categorias_categoria_id;`;
        const values = [categoria];
        try {
            const result = await db.query(sql, values);
            return result;
        } catch (error) {
            console.error("Erro ao pegar produtos por categoria:", error);
            throw error;
        }
    }

    async getByOffsetAll(offset, limit) {
        const sql = `SELECT * FROM produtos LIMIT ? OFFSET ?;`;
        const values = [limit, offset];
        try {
            const result = await db.query(sql, values);
            return result;
        } catch (error) {
            console.error("Erro ao pegar produtos por Offset:", error);
            throw error;
        }
    }

    async getByOffsetAndActive(offset, limit) {
        const sql = `SELECT * FROM produtos LIMIT ? OFFSET ?;`;
        const values = [limit, offset];
        try {
            const result = await db.query(sql, values);
            return result;
        } catch (error) {
            console.error("Erro ao pegar produto por offset e ativo:", error);
            throw error;
        }
    }

    async update(id, ativo, nome, modelo, marca, categoria, preco, tamanho, quantidade, referencia, ean, estoque, custo, descricao, imagem) {
        let sql = `UPDATE produtos SET ativo = ?, nome = ?, modelo = ?, marca = ?, categorias_categoria_id = ?, preco = ?, tamanho = ?, quantidade = ?, referencia = ?, ean = ?, estoque = ?, custo = ?, descricao = ?`;
        const values = [ativo, nome, modelo, marca, categoria, preco, tamanho, quantidade, referencia, ean, estoque, custo, descricao];

        if (imagem) {
            sql += `, imagem = ?`;
            values.push(imagem);
        }

        sql += ` WHERE produto_id = ?`;
        values.push(id);

        try {
            if (imagem) await this.removePreviousImagem(id);

            const result = await db.query(sql, values);
            return result;
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            throw error;
        }
    }

    async delete(id) {
        try {
            // Remover imagens de variantes relacionadas
            const imagensVariantes = await varianteModel.getImagem(id);
            for (const element of imagensVariantes) {
                const filePath = path.resolve('src', 'public', 'img', element.imagem);
                if (checkFile(filePath)) {
                    deleteFile(filePath);
                }
            }

            // Remover variantes relacionadas
            await varianteModel.deleteByProdutoId(id);

            // Remover imagem do produto
            const imagemProduto = await this.getImagem(id);
            for (const element of imagemProduto) {
                const filePath = path.resolve('src', 'public', 'img', element.imagem);
                if (checkFile(filePath)) {
                    deleteFile(filePath);
                }
            }

            // Remover produto
            const sql = `DELETE FROM produtos WHERE produto_id = ?`;
            const values = [id];
            const result = await db.query(sql, values);
            return result;
        } catch (error) {
            console.error("Erro ao remover produto:", error);
            throw error;
        }
    }
}

class Produto extends Crud {
    constructor(nome, descricao, ativo, marca, modelo, preco, tamanho, quantidade, referencia, vendas, ean, estoque, custo, imagem, categorias_categoria_id) {
        super();
        this.nome = nome;
        this.descricao = descricao || null;
        this.ativo = ativo || 1;
        this.marca = marca || null;
        this.modelo = modelo || null;
        this.preco = preco || null;
        this.tamanho = tamanho || null;
        this.quantidade = quantidade || 0; // Referente a quantidade de itens na caixa / embalagem por produto.
        this.referencia = referencia || null;
        this.vendas = vendas || 0;
        this.ean = ean || null;
        this.estoque = estoque || 0;
        this.custo = custo || null;
        this.imagem = imagem || null;
        this.categorias_categoria_id = categorias_categoria_id || null;
    }

    async removePreviousImagem(id) {
        try {
            const produto = await this.getById(id);
            if (!produto[0]?.imagem) return;

            const caminhoArquivo = path.resolve('src', 'public', 'img', produto[0].imagem);
            if (checkFile(caminhoArquivo)) {
                deleteFile(caminhoArquivo);
            }
        } catch (error) {
            console.error("Erro ao remover imagem anterior do produto:", error);
            throw error;
        }
    }
}

module.exports = Produto;