CREATE TABLE produtos (
    produto_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    status BOOLEAN DEFAULT false,
    referencia VARCHAR(45) UNIQUE,
    custo DECIMAL(10, 2),
    estoque INT,
    vendas INT,
    modelo VARCHAR (45),
    ean CHAR(13) UNIQUE,
    marca_id INT,
    categoria_id INT,
    FOREIGN KEY (categoria_id) REFERENCES categorias (categoria_id),
    Foreign Key (marda_id) REFERENCES marcas (marca_id)
)

-- Variantes na relação 1:N, um produto pode ter varias variantes, mas as variantes so tem um produto
CREATE TABLE variantes (
    variante_id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT,
    preco DECIMAL(10, 2),
    tamanho VARCHAR(20),
    quantidade INT,
    imagem VARCHAR(255),
    FOREIGN KEY (produto_id) REFERENCES produtos(produto_id) 
)

CREATE TABLE categorias (
    categoria_id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(45) NOT NULL
)

CREATE TABLE marcas (
    marca_id INT AUTO_INCREMENT PRIMARY key,
    nome VARCHAR(45)
)


--INSERIR ---------------------------------------------------------


--Inserir nova categoria
INSERT INTO categorias (descricao) VALUES ('Metalizado');
INSERT INTO categorias (descricao) VALUES ('Latex');
INSERT INTO categorias (descricao) VALUES ('Candy');




--Inserir Produto:
INSERT INTO produtos (nome, descricao, status, referencia, custo, estoque, vendas, marca, modelo, ean, categoria_id)
VALUES ('Nome do Produto 2', 'Descrição do Produto', true, 'Referência do Produto 2', 10.99, 100, 0, 'Marca do Produto', 'Modelo do Produto', '1234567890122', 1);


--Inserir Variante:
INSERT INTO variantes (produto_id, tamanho, quantidade, preco, imagem) VALUES 
(LAST_INSERT_ID(), 'Tamanho1', 10, 5.99, 'https://images.tcdn.com.br/img/img_prod/1238052/180_balao_metalizado_folha_verde_1_unidade_pf_shop_dos_baloes_8108_1_13d10d37ffd40d7db229c18feb65cad0.png'),
(LAST_INSERT_ID(), 'Tamanho3', 30, 10.99, 'https://images.tcdn.com.br/img/img_prod/1238052/180_balao_metalizado_folha_verde_1_unidade_pf_shop_dos_baloes_8108_1_13d10d37ffd40d7db229c18feb65cad0.png');
--LAST_INSERT_ID() - (id_do_produto_inserido_anteriormente)


--BUSCAR ---------------------------------------------------------


--Buscar produtos com todas suas variantes
SELECT produtos.*, variantes.*
FROM produtos
JOIN variantes ON produtos.produto_id = variantes.produto_id
WHERE produtos.produto_id = 2;


--Atualizar campo de produto
UPDATE produtos set preco = 5.95 WHERE produto_id = 8