const { string_to_bits, print, binaryToString } = require('./util.js')


/**
 * Operates xor with a given trama and a polinom
 * @param {Array[int]} trama 
 * @param {Array[int]} polinom 
 */
const trama_xor = (trama, polinom) => trama.map((bit, i) => bit ^ polinom[i])

const get_usable_trama = trama => {
    let usable = []
    let operate = []
    let usable_end = false
    
    for (let i = 0; i < trama.length; i++) {
        if (usable_end) {
            operate.push(trama[i])
            continue
        }
        
        if (trama[i] === 1) {
            usable_end = true
            operate.push(trama[i])
            continue
        }

        usable.push(trama[i])
    }

    return [usable, operate]
}

/**
 * Process recived trama
 * @param {string} trama
 * @param {string} polinom
 */
const process_trama = (trama, polinom) => {
    tramaBlocks = trama.split(' ');
    polinom = tramaBlocks[tramaBlocks.length - 1];

    trama = string_to_bits(trama)
    polinom = string_to_bits(polinom)
    let out_trama = []
    let operate_trama = trama.slice(0, polinom.length)
    trama = trama.slice(polinom.length, trama.length)
    trama = trama.reverse()

    if (trama.length == 0) {
        out_trama = trama_xor(operate_trama, polinom)
    }
    
    while (trama.length > 0) {
        let result = trama_xor(operate_trama, polinom)
        
        if (trama.length === 0){
            out_trama = [...out_trama, ...result]
            continue
        }

        result = get_usable_trama(result)
        if (result[0].length === 0){
            return true
        }

        out_trama = [...out_trama, ...result[0]]
        operate_trama = result[1]

        if (trama.length + operate_trama.length < polinom.length) {
            out_trama = [...out_trama, ...trama]
            trama = []
        }

        while (operate_trama.length < polinom.length && trama.length > 0) {
            operate_trama.push(trama.pop())
        }

    }

    errors_founded = out_trama.includes(1)
    return errors_founded
}

const crc = (trama, polinom) => {
    const founded_errors = process_trama(trama, polinom)
    if (founded_errors) {
        return '0'
    } else {
        return '1'
    }
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
        let trama =  data.toString()
        const tramaBlocks = trama.split(' ');
        const polinom = tramaBlocks[tramaBlocks.length - 1];

        trama = trama.replace(' ', '')
        trama = trama.replace(' ', '')
        trama = trama.replace(' ', '')
        // Capa de enlace: verificar integridad 
        let result = crc(trama,polinom)
        socket.write(result)
    })

    socket.on('close', () => {
        print('> Comunicacion finalizada')
    })
    
    socket.on('error', err => {
        print(err.message)
    })
})