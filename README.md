# Agente-conversacional / Conversational Agent LangChain ollama
 Final university Project in order to be a Software Engineer.
 The Construction of a chatbot using Langchain and Ollama. Their mission is answer and get the most important information from a group of PDFs or URLs in the cuban educational topic.

 # Agente Conversacional para el SIGIES

Este proyecto consta de dos carpetas destinadas para el backend y frontend. El frontend es una primera percepción antes de ser incluido al ecosistema SIGIES y no se actualizará en este repositorio.

## Características e Instrucciones de Uso

El Chatbot está construido con el framework Langchain, el cual utiliza un ChatModel denominado ChatOllama, que emplea el modelo Gemma2. Tanto el backend como el frontend se pueden ejecutar con el comando:

```bash
npm start
```

Es ESENCIAL para el correcto uso del backend la previa instalación/descarga de ChatOllama y su modelo Gemma2, el cual, a pesar de ser uno de los de menor tamaño, consta de alrededor de 1.6 GB. Dicha descarga o instalación se realiza a través de la web oficial de Ollama [https://ollama.com/download](https://ollama.com/download). Al instalar la aplicación, se procede a través de su ventana de comandos a realizar la descarga del modelo utilizando:

```bash
ollama run gemma2:2b
```

## Funcionamiento

Este proceso resulta ESENCIAL, pues la lógica del chatbot se maneja de manera local en la versión actual. Una vez desplegados tanto el frontend como el backend, se pueden realizar las pruebas necesarias enviando preguntas o pidiendo información en un chat semejante a cualquier otro. Para mejor uso y traceabilidad de las pruebas del chatbot usar [LangSmith](https://smith.langchain.com)

## Funcionalidades

En esta versión se toma como Base de Conocimiento todos los PDFs en la carpeta del mismo nombre. Solo es capaz de trabajar con información referente y textual de esos documentos. Deben tener extensión .pdf para ser leídos, no obstantes hay otras variantes a valorar desde la página oficial de [LangChain](https://js.langchain.com/docs/integrations/document_loaders/) donde se encuentran otros formatos a poder usar. Es una versión temprana y en estado de prueba recomendado el uso de poca cantidad de texto independientemente del total de documentos.

## Versiones y Dependencias

Las versiones y dependencias que se utilizan son:

- cheerio v1
- langchain v0.2.16
- @langchain/community v0.2.27
- @langchain/ollama v0.0.4

## Recomendaciones de uso y mantenimiento

- El uso de MemoryVectoreStore como VectoreStore es solo recomendable en versiones tempranas de proyectos. Para proyectos profesionales y de mayor alcance y utilización de datos a gran escala se tienen que usar VectoreStore de licencia de pago. Mirar [Neon Postgres](https://js.langchain.com/docs/integrations/vectorstores/neon/) basado en postgres 16, entre las mejores opciones a tomar. MemoryVectoreStore usa directamente la ram para alojar las cadenas de texto y el modelo a utilizar, no recomendable, al haber grandes cantidades de datos no solo está la posibilidad de sobrecarga sino que el Agente Conversacional tendría una mayor cantidad de respuestas incorrectas al estar saturado de datos. Al crearlo solo es necesario el poner la key creada, en el archivo del proyecto llamado: `NEON_POSTGRES_CONNECTION_STRING `

- El uso de base de datos convencionales como postgresql para la gestión de chats y sus mensajes asociados trae dificultades en proyectos que utilizan datos a gran escala. Estas funcionalidades es recomendable y se pueden implementar desde los VectoreStore de licencia de pago. Mirar [Neon Postgres](https://neon.tech/?gad_source=1&gclid=EAIaIQobChMIoKaU3JiAigMVC6JaBR24bw34EAAYASAAEgKYKPD_BwE) como una posible opción, basada en postgres 16. Al crearlo solo es necesario el poner la key creada, en el archivo del proyecto llamado: `NEON_POSTGRES_CONNECTION_STRING `

- Esta versión es ejecutada de manera local por lo que es necesario la descarga del modelo. Para usos sin esta restricción y una posibilidad de obtención de respuestas más rápidas del Agente Conversacional, usar licencias de pago para usos de API de modelos como [OpenAI](https://openai.com). Al crearlo solo es necesario el poner la key creada, en el archivo del proyecto llamado: `.env `

- En `built/ ` se encuentran archivos `dataset.js y evaluation.js ` destinados a pruebas los cuales se pueden utlizar una vez creado un usuario en [LangSmith](https://smith.langchain.com). Al crearlo solo es necesario el poner la key creada, en el archivo del proyecto llamado: `.env `. Esto es recomendable para una mejor traceabilidad de las pruebas y análisis del chatbot.
