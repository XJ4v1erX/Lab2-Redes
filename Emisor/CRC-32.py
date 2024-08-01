from functools import reduce
import crcmod.predefined
import util as util

def CRC32(trama):
    polinomio = "crc-32"

        crc_func = crcmod.predefined.Crc(polinomio)

    trama_bytes = bytes(int(trama[i:i+8], 2) for i in range(0, len(trama), 8))

    crc_final = crc_func.new(trama_bytes).digest()
    crc_bin = ' '.join(format(byte, '08b') for byte in crc_final)

    return crc_bin

def simulacion(trama):
    crc_temporal = trama[-32:] 
    trama_sin_crc = trama[:-32]  

    crc_calculado_recibido = CRC32(trama_sin_crc)

    if crc_calculado_recibido == crc_temporal:
        print("La trama no contiene errores.")
    else:
        print("Se detectaron errores en la trama.")
    
def main():
    #Pedir mensaje
    trama = input("Ingrese el texto a enviar: ")
    print("Mensaje a enviar: "+trama)
    print("")
    #Codificar mensaje
    nueva_trama = util.char_to_extended_ascii_bits(trama)
    print("La trama en ascii: "+nueva_trama)
    print("")
    
    crc_calculado = CRC32(nueva_trama)
    trama_con_crc = nueva_trama + crc_calculado
    print("Trama con CRC-32:", trama_con_crc)
    print("")

    trama_final = util.add_ruido(trama_con_crc)
    print("La trama con ruido: "+ trama_final)
    print("")

def layer_implementation(msg_input) -> str:

    trama = reduce(
        (lambda acc, val: acc + val),
        [util.char_to_extended_ascii_bits(char) for char in msg_input]
    )

    encoded_trama = CRC32(trama)
    
    trama_ruido, cambios = util.add_ruido(encoded_trama)
    
    return trama_ruido, cambios 

if __name__ == "__main__":
    import socket
    from pruebas import pruebas
    s = socket.socket()
        
    HOST = "127.0.0.1" 
    PORT = 65432         
    
    s.connect((HOST, PORT))

    num_exitos = 0
    num_fracasos = 0
    
    print('---- Iniciando pruebas ----')
    for i in range(1000):
        for msg_input in pruebas:
            trama, cambios = layer_implementation(msg_input)

            s.send(trama.encode())
            response = s.recv(1024).decode('utf-8')
            if response == "1" and cambios != 0 :
                num_exitos += 1
            else:
                num_fracasos += 1

        if 100 * (i + 1) % 10000 == 0:
            print(f'> {100 * (i + 1)} pruebas realizadas')

    print('\nExitos:', num_exitos)
    print('fracasos:', num_fracasos)
    porcentaje = (num_exitos / 100000) * 100
    porcentaje = round(porcentaje, 2)
    print(f'precision: {porcentaje}%')
    s.close()