import { Googly } from "./lib/Googly";

async function main() {
  const input = document.querySelector<HTMLInputElement>("#imgInput")!;

  input.onchange = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target!.result! as string;
      img.onload = async () => {
        const imageFrame = document.querySelector(".imageFrame")!;
        imageFrame.innerHTML = "Loading...";
        const googly = new Googly();
        await googly.load();
        const resultImg = await googly.process(img);
        imageFrame.replaceChildren(resultImg);
      };
    };

    reader.readAsDataURL(input.files![0]);
  };
}

window.onload = main;
