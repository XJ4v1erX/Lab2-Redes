/**
 * Converst string to array of ints
 * @param {string} trama
 * @returns the trama in an array of ints
 */
const string_to_bits = trama => {
    trama = trama.split('')
    trama = trama.map(char => parseInt(char))
    return trama
}

module.exports = {
    string_to_bits
}