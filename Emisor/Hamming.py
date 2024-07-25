#CORRECCION DE ERRORES HAMMING 

def get_parity_bit(trama, index):
    subtrama = [trama[i] for i in range(len(trama)) if (i + 1) & (1 << index)]
    return sum(subtrama) % 2

def hamming_encode(trama):
    n = len(trama)
    m = 0
    while 2 ** m < n + m + 1:
        m += 1

    mensaje_codificado = [0] * (n + m)

    j = 0
    for i in range(1, n + m + 1):
        if i == 2 ** j:
            mensaje_codificado[i - 1] = get_parity_bit(trama + mensaje_codificado, j)
            j += 1
        else:
            mensaje_codificado[i - 1] = trama.pop(0)

    return "".join(str(bit) for bit in mensaje_codificado)


def main():
    trama_input = input("Ingrese una trama en binario: ")
    trama = [int(bit) for bit in trama_input]

    mensaje_codificado = hamming_encode(trama)

    print("Trama codificada con Hamming:", mensaje_codificado)

if __name__ == "__main__":
    main()
