const request = require('supertest');
const app = require('../app'); 
let usuarioTeste = {};
let token = ''

function usuarioAleatorio(){

  function gerarObjetoAleatorio() {
    const objeto = {
      nome: 'teste ' +  gerarPalavraAleatoria(7), // Gerar uma palavra aleatória de 7 caracteres para o nome
      email: gerarPalavraAleatoria(5) + '@gmail.com', // Gerar uma palavra aleatória de 5 caracteres para o início do e-mail
      senha: gerarPalavraAleatoria(8), // Gerar uma palavra aleatória de 8 caracteres para a senha
      telefone: '9' + gerarNumeroAleatorio(9) // Gerar um número de telefone aleatório começando com 9
    };
    usuarioTeste = {email: objeto.email, senha: objeto.senha};
    return objeto;
  }
  function gerarPalavraAleatoria(tamanho) {
    let palavra = '';
    for (let i = 0; i < tamanho; i++) {
      const codigoCaractere = Math.floor(Math.random() * (122 - 97 + 1)) + 97;
      palavra += String.fromCharCode(codigoCaractere);
    }
    return palavra;
  }
  function gerarNumeroAleatorio(tamanho) {
    let numero = '';
    for (let i = 0; i < tamanho; i++) {
      const digito = Math.floor(Math.random() * 10); // Gera um número aleatório de 0 a 9
      numero += digito;
    }
    return numero;
  }

  return  gerarObjetoAleatorio()
}

describe('Testando rota de signup', () => {
  test('Deve retornar: usuario registrado com sucesso', async () => {
    const userData = usuarioAleatorio()

    const response = await request(app)
      .post('/auth/signup')
      .send(userData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('msg', 'usuario registrado com sucesso');
  });
});
describe('Testando rota de login', () => {
  test("Deve retornar: Usuario autenticado com sucesso", async () => {
    const res = await request(app)
    .post('/auth/login')
    .send(usuarioTeste);
    token = res.body.token
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('msg', 'Usuario autenticado com sucesso!')
  })
});
describe("Testando rota de logout", ()=> {
  test("Deve retornar: Logout realizado com sucesso.", async () => {
    const res = await request(app)
    .get('/auth/logout')
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("msg", "Logout realizado com sucesso.")
  })
});
describe("Testando home", () => {
  test("Dere renderizar a pagina home", async () => {
    const res = await request(app)
    .get('/')
    expect(res.status).toBe(200);
  })
});
describe("Testando pagina do produto", () => {
  test("Deve renderizar a pagina do produto", async () => {
      const res = await request(app)
      .get('/produto/pó-translucido-tango-phonto-power-microfinish');
      expect(res.status).toBe(200);
  })
});
describe("Testando pagina de criar conta", () => {
  test("Deve renderizar a pagina do produto", async () => {
      const res = await request(app)
      .get('/criar-conta')
      expect(res.status).toBe(200);
  })
});
describe("Testando pagina entrar", () => {
  test("Deve renderizar a pagina de entrar", async () => {
    const res = await request(app)
    .get('/entrar')
    expect(res.status).toBe(200)
  })
});
describe("Testando página de checkout", () => {
  test("Deve renderizar a página de checkout", async () => {
    const carrinho = [{ produto_id: 22, variante_id: 28, qtd: 1 }];
    const cookie = `carrinho=${encodeURIComponent(JSON.stringify(carrinho))}; token=${token}`;

    const res = await request(app)
      .get("/checkout")
      .set('Cookie', [cookie]);
    expect(res.status).toBe(200);
  });
});
describe("Testando página de categoria", () => {
  test("Deve renderizar a página de categoria", async () => {
    const res = await request(app)
    .get('/categoria/:categoria')
    expect(res.status).toBe(200)
  })
});
