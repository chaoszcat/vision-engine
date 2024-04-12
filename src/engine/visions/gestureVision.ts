import workerUrl from "./gesture-vision-engine-worker/worker.cjs?worker&url"
import { VisionResult } from "engine/index"
import { createVision } from "engine/visions/mediapipe/mediapipe.ts"
import { GestureRecognizer, GestureRecognizerOptions } from "@mediapipe/tasks-vision"

export const MODEL =
  "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task"

export type GestureVisionOptions = {
  numHands?: number,
  useWorker?: boolean
}

export function gestureVision(opts?: GestureVisionOptions) {

  // Create the video stream and draw it on a canvas
  const video = document.createElement("video")
  const gestureRecognizerOptions: GestureRecognizerOptions = {
    baseOptions: {
      modelAssetPath: MODEL,
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numHands: Math.min(8, Math.max(1, Math.round(opts?.numHands ?? 2))),
  }

  return async (mediaStream: MediaStream) => {
    video.srcObject = mediaStream
    await video.play()

    if (opts?.useWorker) {

      // Create the video stream and draw it on a canvas
      const worker = new Worker(workerUrl, { type: "classic" })
      const canvas = new OffscreenCanvas(video.videoWidth, video.videoHeight)
      const context = canvas.getContext("2d")!
      let visionResult = false

      // Changing to IMAGE recogniser as it's for creating the bitmaps
      gestureRecognizerOptions.runningMode = "IMAGE"

      worker.addEventListener("message", (msg) => {
        if (msg.data.visionResult) {
          visionResult = msg.data.visionResult
        } else if (msg.data.ready) {
          worker.postMessage({
            gestureRecognizerOptions,
          })
        }
      })

      return async () => {
        // draw the image to context and send to worker to check
        context.drawImage(video, 0, 0)
        const frame = canvas.transferToImageBitmap()
        worker.postMessage({
          frame,
        }, [frame])
        frame.close()
        return visionResult
      }

    } else {

      // straight to use video detector
      const gr = await GestureRecognizer.createFromOptions(await createVision(), gestureRecognizerOptions)
      let lastVideoTime = 0
      let visionResult: VisionResult

      return async () => {
        if (video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime
          return visionResult = gr.recognizeForVideo(video, Date.now())
        }
        return visionResult
      }
    }
  }
}
