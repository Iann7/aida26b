# INFORME
Buscando generar una nueva logica de negocio sobre el esquema que ya teniamos, optamos por diseñar un sistema que permita observar el recorrido barcos alrededor del mundo. El objetivo era el siguiente:
- Realizar una representacion grafica de un Mapa, que permita poder indentificar los barcos a los largo del mundo
- Poder enlistar los barcos, con el fin de poder obtener informacion relevane sobre ellos, como: Bandera de pais de origen, Nombre, Longitud, etc.
- Poder crear sectores de interes que puedan ser facilmente indentificables en el mapa, con el fin de poder observar los barcos de una determinada parte del mundo.

Para poder cumplir con esto se realiaron los siguientes cambios:
- Con el fin de poder representar las tablas de nuestro proyecto, modificamos el archivo structure.ts. En este caso, detro del campo de tables agregamos una denominada vessels que indenficaa los barcos 