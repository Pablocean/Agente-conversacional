import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";

import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { OllamaEmbeddings } from "@langchain/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { MessagesPlaceholder } from "@langchain/core/prompts";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";

import { StringOutputParser } from "@langchain/core/output_parsers";
import * as dotenv from "dotenv";
import { traceable } from "langsmith/traceable";
import { wrapSDK } from "langsmith/wrappers";

// dotenv.config();

// Urls con información relevante
// const urls = [
//   "https://www.ecured.cu/Universidad_de_las_Ciencias_Informáticas",
//   "https://www.uci.cu/universidad/noticias/la-informatizacion-del-ingreso-la-educacion-superior-aporta-mayor-transparencia",

//   // "https://www.juventudtecnica.cu/articulos/ingreso-universitario-en-cuba-curso-2024-2025/",
// ];

// Load Data from URls
// const urlPromises = urls.map(async (url) => {
//   const pTagSelector = "p";
//   const loader = new CheerioWebBaseLoader(url, {
//     selector: pTagSelector,
//   });
//   return await loader.load();
// });

// Load Data
const allSplits = async () => {
  // const docs = (await Promise.all(urlPromises)).flat(); // Aplana el array
  // console.log(docs[0].pageContent.length);
  const pTagSelector = "p";
  const loader = new CheerioWebBaseLoader(
    "https://www.uci.cu/universidad/noticias/la-informatizacion-del-ingreso-la-educacion-superior-aporta-mayor-transparencia",
    {
      selector: pTagSelector,
    }
  );

  // const loader = new DocxLoader("../SIGIES.docx");

  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    // separators: ["\n\n", "\n", " ", ""],
    chunkOverlap: 200,
  });

  const splitDocs = await textSplitter.splitDocuments(docs);
  // console.log(splitDocs[0].pageContent.length);
  // splitDocs[10].metadata;
  return splitDocs;
};

//  Create Vector Store
const createVectorStore = async () => {
  const splitDocs = await allSplits();

  const embeddings = new OllamaEmbeddings({
    model: "gemma2:2b",
    // temperature: 0,
  });

  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );
  // console.log(vectorStore);
  return vectorStore;
};
const llm = wrapSDK(
  new ChatOllama({
    model: "gemma2:2b",
    temperature: 0,
  })
);
//Create Retrieval Chain
export const createChain = traceable(async (textInput) => {
  const retriever = vectorStore.asRetriever({ k: 6, searchType: "similarity" });
  // console.log(retrievedDocs.length);
  // console.log(retrievedDocs[0].pageContent);

  const template = `Use the following pieces of context to answer the question at the end.
  If you don't know the answer, just say that you don't know, don't try to make up an answer.
  Use three sentences maximum and keep the answer as concise as possible.
  Always say "gracias por preguntar!" at the end of the answer.
  Always answer in spanish.
  
  {context}
  
  
  Question: {input}
  
  
  Helpful Answer:`;
  const customRagPrompt = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder("chat_history"),
    ["system", template],
  ]);

  const ragChain = await createStuffDocumentsChain({
    llm,
    prompt: customRagPrompt,
    outputParser: new StringOutputParser(),
  });

  const retrieverPrompt = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder("chat_history"),
    ["user", "{input}"],
    [
      "user",
      "Give the above conversation,generate a search query to look up in order to get information to the conversation",
    ],
  ]);

  const historyAwareRetriever = await createHistoryAwareRetriever({
    llm,
    retriever,
    rephrasePrompt: retrieverPrompt,
  });

  const conversationChain = await createRetrievalChain({
    combineDocsChain: ragChain,
    retriever: historyAwareRetriever,
  });

  const response = await conversationChain.invoke({
    input: textInput,
    chat_history,
  });
  // // console.log(response.context);

  // return response.answer;

  // const context = await retriever.invoke(textInput);
  return response.answer;
  // return await ragChain.invoke({
  //   input: textInput,
  //   context,
  //   chat_history,
  // });
});

const chat_history = [
  new HumanMessage("Hola,me llamo Pablo"),
  new AIMessage("Buenas Pablo que deseas saber sobre el SIGIES"),
  new HumanMessage(
    "Que eres?,que te puedo preguntar?, en que me puedes ayudar?"
  ),
  new AIMessage(
    "Soy un Agente Conversacional para el Sistema de Gestión para el Ingreso a la Educación Superior(SIGIES), cuya misión es brindar información y resolver las dudas sobre el mismo a los usuarios."
  ),
  new HumanMessage(
    "Deseo revisar alguna pagina oficial o link que me ayude a resolver más dudas"
  ),
  new AIMessage(
    `Puede consultar más información en nuestras páginas oficiales:
      https://www.uci.cu/universidad/noticias/la-informatizacion-del-ingreso-la-educacion-superior-aporta-mayor-transparencia
      http://www.cubadebate.cu/etiqueta/examen-de-ingreso/
      https://www.mined.gob.cu/informan-sobre-pruebas-de-ingreso-a-la-educacion-superior/
      `
  ),
];

const vectorStore = await createVectorStore();
