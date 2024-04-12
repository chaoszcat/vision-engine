import { FilesetResolver } from "@mediapipe/tasks-vision"

export async function createVision() {
  return await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm")
}