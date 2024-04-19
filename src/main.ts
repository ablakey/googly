import { Googly } from "./Googly";

async function main() {
  const googly = new Googly();
  await googly.load();
  await googly.process();
}

window.onload = main;
