
def char_to_extended_ascii_bits(char):
    ascii_value = ord(char)
    binary_representation = ''

    while ascii_value > 0:
        binary_representation = str(ascii_value % 2) + binary_representation
        ascii_value = ascii_value // 2
    
    # Agregar ceros a la izquierda para tener una longitud fija de 8 bits
    binary_representation = binary_representation.zfill(8)
    
    return binary_representation

import random

def add_ruido(trama:str) -> str:
    cambios = 0
    new_trama = ''
    for i in range(len(trama)):
        actual_bit = trama[i]

        if random.random() <= 0.01:
            actual_bit = '0' if actual_bit == '1' else '1'
            cambios += 1

        new_trama += actual_bit

    return new_trama, cambios