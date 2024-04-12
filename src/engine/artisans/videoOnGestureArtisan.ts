import { InitParameters, RunParameters } from "../index"
import { Mesh, MeshBasicMaterial, PlaneGeometry, RepeatWrapping, RGBAFormat, VideoTexture } from "three"
import { GestureRecognizerResult } from "@mediapipe/tasks-vision"

export function videoOnGestureArtisan(categoryName: string, videoSrc: string) {
  return async ({ scene }: InitParameters) => {

    const video = document.createElement("video")
    const texture = new VideoTexture(video)
    texture.format = RGBAFormat
    texture.wrapS = RepeatWrapping
    texture.repeat.x = -1
    video.loop = true
    video.src = videoSrc
    await video.play()

    const geometry = new PlaneGeometry(video.videoWidth, video.videoHeight)
    const material = new MeshBasicMaterial({ map: texture, transparent: true })
    const mesh = new Mesh(geometry, material)

    // added hidden, so we can freely show/hide on gesture
    mesh.visible = false
    scene.add(mesh)

    return ({ visionResult }: RunParameters) => {
      if (visionResult) {
        const result = visionResult as GestureRecognizerResult
        mesh.visible =
          result.gestures.filter(
            (categories) => categories[0].categoryName === categoryName)
            .length > 0
      }
    }
  }
}
