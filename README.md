## Description

A repository with the goal of obtaining a client's score. You can see all the endpoints in "modules/clients/clients.controller.ts".

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Requisitos para ejecutar programa

-Node instalado
-Creada la base de datos lidz en postgres y cambiar usuario y pass de postgres

## Comentario

-Se agrega los campos age y undueDebt en clients para usarlos en el score y los deje como requeridos por simplicidad, pero se pondrían poner opcionales. undueDebt sería las "deudas vigentes" como los cupos de las tarjetas de credito y los creditos vigentes sin atrasos, estos claramente no pesan lo mismo que lo que estará en la tabla debts, pero si tiene peso.

-Se asume UF a $37.597

-Se asume que vienen no se van a crear clientes repetidos, esto se arregla simplemente verificando si existe y si existe devolver un error.

-Se asume que no se piden datos de clientes no existentes.

## Calculo score

Importante saber que cuando se habla de cuota de credito se uso un interes simple y un cae del 5%, pero se buscaria ver como obtener un cae actualizado y calcular bien las cuotas.

Mensajes pondera 10% donde si mando más de 10 mensajes tiene 100 puntos y 0 puntos si mando 0

Edad pondera 10% donde 45 años se toma 100 puntos y menor de 20 años o mayor de 70 años da 0 puntos. También esta la idea de que sea por tramo, porque tal vez sería bueno por ejemplo que entre 40 y 50 valga 100 puntos, pero por simplicidad se hizo lineal.

Sueldo pondera 30% donde va a ser 100 puntos si su 20% de su sueldo da para pagar la cuota de un credito a 10 años y si 60% de su sueldo da menos que una cuota a 30 años valdra 0 puntos y ponderara el doble (se divide en 2 la ponderación de los otros campos).

Deudas vigentes pondera 20% donde 100 puntos si no tiene y 0 puntos si 20% de su sueldo no cubre la cuota de un crédito de 30 años de ese monto.

Ahorros-deudas(Dicom) 30%, donde son 100 puntos si tiene 120% el pie o más y 0 puntos si tiene 30% del pie. Si se tiene una deuda en dicom de más de un año que valga más de un millon se penaliza con 20 puntos, esto podría ser progresivo en vez de una penalización cruzando un limite, pero por simplicidad se hace así.
