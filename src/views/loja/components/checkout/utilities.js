function stringParaReal(string) {
    let number = typeof string == 'string'? Number(string) : string;
    let fixed = typeof number == "number" ? number.toFixed(2): number
    let string2 = typeof fixed != "string" ? String(fixed) : fixed
    let real = typeof string2 == 'string' ? string2.replace('.', ',') : string2
    return real;
}

module.exports = {stringParaReal}