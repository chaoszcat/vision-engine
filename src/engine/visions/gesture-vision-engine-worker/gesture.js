import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision"

async function createVision() {
  return await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm")
}

// This will be the main detect call
let detect = () => false
let vision = null
let gr = null

self.onmessage = function(e) {
  if (e.data.frame instanceof ImageBitmap) {
    const visionResult = detect(e.data.frame)
    e.data.frame.close()
    self.postMessage({
      visionResult,
    })
  } else if (e.data.gestureRecognizerOptions) {
    (async () => {
      vision = await createVision()
      gr = await GestureRecognizer.createFromOptions(vision, e.data.gestureRecognizerOptions)
      detect = (frame) => {
        return gr.recognize(frame)
      }
    })()
  }
}

// tells main script that we are ready to accept gestureRecogniserOptions
self.postMessage({
  ready: true,
})
