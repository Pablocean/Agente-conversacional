import { ChatOllama } from "@langchain/ollama";
import { createChain } from "../src/bot.js";
import { evaluate } from "langsmith/evaluation";
import { wrapSDK } from "langsmith/wrappers";
import { traceable } from "langsmith/traceable";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import * as dotenv from "dotenv";

dotenv.config();

const promptTemplate = `You are an expert professor specialized in grading chatbots' answers to questions. The chatbots answers don't have to be exacts just correct.
You are grading the following question:
{query}
Here is the real answer:
{answer}
You are grading the following predicted answer:
{result}
Only respond with CORRECT or INCORRECT not say more:
`;

const prompt = ChatPromptTemplate.fromMessages([["system", promptTemplate]]);

const llm = wrapSDK(new ChatOllama({ model: "gemma2:2b", temperature: 0.0 }));

const answerEvaluator = prompt.pipe(llm).pipe(new StringOutputParser());

// Row-level evaluator
async function correctLabel(rootRun, example) {
  const response = await answerEvaluator.invoke({
    query: example.inputs?.input,
    answer: example.outputs?.outputs,
    result: rootRun.outputs?.outputs,
  });
  console.log(response);
  let isCorrect;

  if (response.includes("INCORRECT")) {
    isCorrect = false;
  } else {
    isCorrect = true;
  }

  return { key: "correct_label", isCorrect };
}

const datasetName = "Conversational Agent Dataset";
const test = createChain;

const langsmith_app = traceable(async (inputs) => {
  console.log(inputs);
  const output = await createChain(inputs["input"]);
  console.log(output);
  return output;
});

const results = await evaluate(langsmith_app, {
  data: datasetName,
  evaluators: [correctLabel],
  experimentPrefix: "SIGIES Queries",
  // numRepetitions: 3,
});
console.log(results);
