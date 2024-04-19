// Define um cookie com o nome, valor e dias de expiração fornecidos
function setCookie(name, value, days) {
    if (typeof name !== 'string' || typeof value !== 'string' || typeof days !== 'number' || days <= 0) {
        console.error('Parâmetros inválidos para setCookie.');
        return;
    }
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
    return {
        msg: 'Item salvo em Cookies',
        name: name, 
        value: value
    }
}

// Obtém o valor do cookie com o nome fornecido
function getCookie(name) {
    if (typeof name !== 'string') {
        console.error('Parâmetro inválido para getCookie.');
        return null;
    }
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`));
    return cookie ? cookie.substring(name.length + 1) : null;
}

// Remove o cookie com o nome fornecido
function removeCookie(name) {
    if (typeof name !== 'string') {
        console.error('Parâmetro inválido para removeCookie.');
        return;
    }
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    return {
        msg: 'Item removido de cookie',
        name: name
    }
}
