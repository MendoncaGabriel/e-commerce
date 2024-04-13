CREATE TABLE produtos (
    produto_id INT AUTO_INCREMENT PRIMARY KEY,
    nome_produto VARCHAR(100) NOT NULL UNIQUE,
    descricao_produto TEXT NULL,
    status_produto BOOLEAN DEFAULT false ,
    modelo_produto VARCHAR (45) NULL,
    categoria VARCHAR(45) NULL,
    marca VARCHAR(45) NULL
);

-- Variantes na relação 1:N, um produto pode ter varias variantes, mas as variantes so tem um produto
CREATE TABLE variantes (
    variante_id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    tamanho VARCHAR(20) NULL,
    quantidade INT NULL,
    referencia VARCHAR(45) UNIQUE NULL,
    vendas INT NULL,
    ean CHAR(13) UNIQUE NULL,
    estoque INT NULL,
    custo DECIMAL(10, 2) NULL,
    imagem VARCHAR(255) NULL,
    FOREIGN KEY (produto_id) REFERENCES produtos(produto_id) 
);
