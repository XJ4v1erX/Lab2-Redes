require('slice')
const { string_to_bits } = require('./util')

P0_LIST = [1, 3, 5, 7]
P1_LIST = [2, 3, 6, 7]
P2_LIST = [4, 5, 6, 7]

const get_parity = (trama, list) => {
    const subtrama = list.map(index => trama[index-1])
    const bit = subtrama.filter(b => b == 1).length % 2 == 0
    return bit ? 0 : 1
}

const process_hamming = trama => {
    // pre-process trama
    trama = string_to_bits(trama)
    trama = trama.reverse()

    // Get parity bits
    const bit1 = get_parity(trama, P0_LIST)
    const bit2 = get_parity(trama, P1_LIST)
    const bit3 = get_parity(trama, P2_LIST)

    // convert to decimal
    const dirty_bit = parseInt(bit1.toString() + bit2.toString() + bit3.toString(), 2)
    
    if (dirty_bit > 0) {
        // Error Correction
        trama[dirty_bit - 1] = (trama[dirty_bit - 1] === 1) ? 0 : 1
        trama = trama.reverse()
    }

    return [trama, dirty_bit]
}

const hamming = trama => {
    // Get subtramas
    let sub_tramas = []
    
    while (trama.length > 0) {
        sub_tramas.push(trama.slice(0, 7))
        trama = trama.length > 0 ? trama.slice(7, trama.length) : trama
    }

    // Print initial trama
    console.log('Trama inicial:', sub_tramas)
    
    // Make corrections in sub tramas
    sub_tramas = sub_tramas.reverse()
    let error_founded = false

    const corrections = sub_tramas.map((msg, index) => {
        const process_result = process_hamming(msg)
        const actual = process_result[0]
        const dirty_bit = process_result[1]

        if (dirty_bit > 0) {
            error_founded = true
            console.log(
                '> Se encontraron errores en el bit:',
                dirty_bit + ((index) * 7),
            )
            // console.log(msg)
        }
        return actual
    })
    
    // Print correct trama
    if (error_founded) {
        let trama_str = corrections.reduce((acc, trama) => [...trama, ' ', ...acc], [])
        trama_str = trama_str.reduce((acc, bit) => acc + bit.toString(), '')
        console.log('> trama correcta:', trama_str)

    } else {
        console.log('> No se detectaron errores en la trama')
    }
}

const tramas_correctas = [
    '0110011',
    '1001100',
    '1010010',
]

const tramas_errores = [
    '0100011',
    '1001110',
    '0010010',
]

console.log('---- Pruebas con tramas correctas ----')
tramas_correctas.map(trama => {
    hamming(trama)
    console.log()
})

console.log('---- Pruebas con tramas con error ----')
tramas_errores.map(trama => {
    hamming(trama)
    console.log()
})

const tramas_2_errores = [
    '0111011' + '0100011',
    '1001000' + '1001110',
]

console.log('---- Pruebas con 2 errores ----')
tramas_2_errores.map(trama => {
    hamming(trama)
    console.log()
})
t = '0110011'
t2 = '1001100'

const tramas_2_correctas = [
    '1010010',
    '1100110',
]

console.log('---- Pruebas con cambios sin errores ----')
tramas_2_correctas.map(trama => {
    hamming(trama)
    console.log()
})

