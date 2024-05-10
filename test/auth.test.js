const request = require('supertest');
const app = require('../app'); 
let usuarioTeste = {};

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

// CRIAR CONTA
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


//FAZER LOGIN
describe('Testando rota de login', () => {
  test("Deve retornar: Usuario autenticado com sucesso", async () => {
    const res = await request(app)
    .post('/auth/login')
    .send(usuarioTeste);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('msg', 'Usuario autenticado com sucesso!')
  })
})
