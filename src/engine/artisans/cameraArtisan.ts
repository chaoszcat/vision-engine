import { InitParameters } from "../index"
import { Mesh, MeshBasicMaterial, PlaneGeometry, RepeatWrapping, SRGBColorSpace, VideoTexture } from "three"

export function cameraArtisan() {
  return async ({ mediaStream, width, scene }: InitParameters) => {
    const video = document.createElement("video")
    const texture = new VideoTexture(video)
    texture.colorSpace = SRGBColorSpace
    texture.wrapS = RepeatWrapping
    texture.repeat.x = -1
    video.srcObject = mediaStream
    await video.play()

    const geometry = new PlaneGeometry(width, width * 9 / 16)
    const material = new MeshBasicMaterial({ map: texture })
    const mesh = new Mesh(geometry, material)
    scene.add(mesh)
  }
}
