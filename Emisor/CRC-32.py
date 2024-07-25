import crcmod.predefined

def CRC32(trama):
    polinomio = "crc-32"
    crc_func = crcmod.predefined.Crc(polinomio)
    trama_bytes = bytes(int(trama[i:i+8], 2) for i in range(0, len(trama), 8))
    crc_final = crc_func.new(trama_bytes).digest()
    crc_bin = bin(int.from_bytes(crc_final, byteorder='big'))[2:].zfill(32)
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
    trama = input("Ingrese la trama en binario: ")
    crc_calculado = CRC32(trama)
    trama_con_crc = trama + crc_calculado

    print("Trama con CRC-32:", trama_con_crc)
    

if __name__ == "__main__":
    main()
