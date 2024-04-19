import * as faceapi from "face-api.js";
import example from "./assets/example.webp";

const SIZE_SCALE = 0.75;

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export class Googly {
  consructor() {}

  async load() {
    await faceapi.nets.faceLandmark68Net.loadFromUri("/");
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/");
  }

  async loadImage(url: string) {
    return new Promise<HTMLImageElement>((res) => {
      const image = new Image();
      image.onload = () => res(image);
      image.src = url;
    });
  }

  getEyeProperties(pts: faceapi.Point[]) {
    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);

    const xMin = Math.min(...xs);
    const yMin = Math.min(...ys);
    const xMax = Math.max(...xs);
    const yMax = Math.max(...ys);

    const xWidth = xMax - xMin;
    const xMid = xMin + xWidth / 2;

    const yWidth = yMax - yMin;
    const yMid = yMin + yWidth / 2;

    const xPos = Math.floor(xMid);
    const yPos = Math.floor(yMid);

    const radius = xMax - xMin;

    return { xPos, yPos, radius, xWidth, yWidth };
  }

  async process() {
    const exampleImage = await this.loadImage(example);
    const detections = await faceapi.detectAllFaces(exampleImage).withFaceLandmarks();

    const parent = document.querySelector("#parent")!;
    const canvas = document.createElement("canvas");
    canvas.width = exampleImage.width;
    canvas.height = exampleImage.height;
    parent.appendChild(canvas);

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(exampleImage, 0, 0);

    const eyeProps = detections
      .map((d) => [
        this.getEyeProperties(d.landmarks.getLeftEye()),
        this.getEyeProperties(d.landmarks.getRightEye()),
      ])
      .flat();

    eyeProps.forEach((p) => {
      const eyeRadius = p.radius * SIZE_SCALE;
      const pupilRadius = eyeRadius / 2;
      const pupilX = randomRange(p.xPos - p.radius / 2, p.xPos + p.radius / 2);
      const pupilY = p.yPos;

      // Outer
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(p.xPos, p.yPos, eyeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Inner
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(pupilX, pupilY, pupilRadius, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}
