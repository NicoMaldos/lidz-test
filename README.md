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

## Comentario

-Traduje los nombres de la base de datos que estaban en español, como deudas a debts y institución a institution
-Se agrega los campos age y undueDebt en clients para usarlos en el score y los deje como requeridos pos simplicidad, pero se pondrían poner opcionales. undueDebt sería las "deudas vigentes" como los cupos de las tarjetas de credito y los creditos vigentes sin atrasos, estos claramente no pesan lo mismo que lo que estará en la tabla debts, pero si tiene peso.
