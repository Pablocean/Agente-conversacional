import { Client } from "langsmith";
import * as dotenv from "dotenv";

dotenv.config();

const langsmith = new Client();

// create a dataset
const questionExamples = [
  [
    "¿Qué es el SIGIES?",
    "El Sistema de Gestión para el Ingreso a la Educación Superior (Sigies).",
  ],
  [
    "Deseo información sobre la UCI.",
    "Es la Universidad de Ciencias Informáticas",
  ],
  [
    "¿Cuáles son los subprocesos del SIGIES?",
    "Organización de los exámenes, exámenes, asignación y otorgamiento de las carreras.",
  ],
  ["¿Qué es el FORTES?", "Centro de Tecnologías para la Formación"],
  ["¿Qué es el MES?", "Ministerio de Educación Superior"],
  [
    "¿Qué labor desarrolla el SIGIES?",
    "Gestionar la información del proceso de ingreso a las universidades cubanas.",
  ],
  [
    "¿Qué otra información me puedes brindar?",
    "Puedo brindarte la información que desee sobre el sistema de ingreso a la educación superior cubana y el SIGIES.",
  ],
  [
    "¿Qué links oficiales puedo consultar?",
    `https://www.uci.cu/universidad/noticias/la-informatizacion-del-ingreso-la-educacion-superior-aporta-mayor-transparencia
    http://www.cubadebate.cu/etiqueta/examen-de-ingreso/
    https://www.mined.gob.cu/informan-sobre-pruebas-de-ingreso-a-la-educacion-superior/
    `,
  ],
  ["Deseo información sobre cocina.", "No tengo información sobre cocina."],
];
const [inputs, outputs] = questionExamples.reduce(
  ([inputs, outputs], item) => [
    [...inputs, { input: item[0] }],
    [...outputs, { outputs: item[1] }],
  ],
  [[], []]
);
const datasetName = "Conversational Agent Dataset";
const chatbotDataset = await langsmith.createDataset(datasetName);
await langsmith.createExamples({
  inputs,
  outputs,
  datasetId: chatbotDataset.id,
});
