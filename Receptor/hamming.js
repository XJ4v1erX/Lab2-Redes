const { string_to_bits, print, binaryToString } = require('./util')

P0_LIST = [1, 3, 5, 7]
P1_LIST = [2, 3, 6, 7]
P2_LIST = [4, 5, 6, 7]

const get_parity = (trama, list) => {
    const subtrama = list.map(index => trama[index-1])
    const bit = subtrama.filter(b => b == 1).length % 2 == 0
    return bit ? 0 : 1
}

const process_hamming = trama => {
    trama = string_to_bits(trama)
    trama = trama.reverse()

    const bit1 = get_parity(trama, P0_LIST)
    const bit2 = get_parity(trama, P1_LIST)
    const bit3 = get_parity(trama, P2_LIST)

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

    sub_tramas = sub_tramas.reverse()
    let error_founded = false

    const corrections = sub_tramas.map((msg, index) => {
        const process_result = process_hamming(msg)
        const actual = process_result[0]
        const dirty_bit = process_result[1]

        if (dirty_bit > 0) {
            error_founded = true
        }
        return actual
    })
    
    if (error_founded) {
        let trama_str = corrections.reduce((acc, trama) => [...trama, ' ', ...acc], [])
        trama_str = trama_str.reduce((acc, bit) => acc + bit.toString(), '')

    } 
    return corrections
}

var net = require('net')
const HOST = "127.0.0.1"  
const PORT = 65432             

const server = net.createServer()

server.listen(PORT, () => {
    print(`server listening on port ${server.address().port}`)
})

server.on('connection', socket => {
    print('> conexion a socket iniciada')
    socket.on('data', data => {

        const data_str = data.toString()
        let trama = hamming(data_str)
        trama = trama.map(sub => {
            return [sub[2], sub[4], sub[5], sub[6]].reverse()
        }).reverse()

        let ascii_chars = []
        
        for (let index = 0; index < trama.length; index += 2) {
            ascii_chars.push([...trama[index], ...trama[index+1]])
        }

        let chars = ascii_chars.map(ascii => ascii.reduce(
            (acc, va) => acc.toString() + va.toString()),
            ''
        )
        chars = chars.map(ascii => binaryToString(ascii))
        chars = chars.reduce((acc, val) => acc + val, '')

        socket.write(chars)
    })

    socket.on('close', () => {
        print('> Comunicacion finalizada')
    })
    
    socket.on('error', err => {
        print(err.message)
    })
})