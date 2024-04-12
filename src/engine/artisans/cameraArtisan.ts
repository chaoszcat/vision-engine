import { InitParameters } from "../index"
import { Mesh, MeshBasicMaterial, PlaneGeometry, RepeatWrapping, SRGBColorSpace, VideoTexture } from "three"

export function cameraArtisan() {
  return async ({ video, width, height, scene }: InitParameters) => {
    const texture = new VideoTexture(video)
    texture.colorSpace = SRGBColorSpace
    texture.wrapS = RepeatWrapping
    texture.repeat.x = -1

    const geo = new PlaneGeometry(width, height)
    const mat = new MeshBasicMaterial({ map: texture })
    const mesh = new Mesh(geo, mat)
    scene.add(mesh)

    // fit the texture
    // adapt from: https://gist.github.com/bartwttewaall/5a1168d04a07d52eaf0571f7990191c2
    const screenAspect = width / height
    const videoAspect = video.videoWidth / video.videoHeight
    const scale = videoAspect / screenAspect
    const offsetX = (videoAspect - screenAspect) / videoAspect
    const offsetY = (screenAspect - videoAspect) / screenAspect
    const alignH = 0.5
    const alignV = 0.5
    // fill aspect
    if (screenAspect < videoAspect) {
      texture.offset.set(offsetX * alignH, 0)
      texture.repeat.set(-1 / scale, 1)
    } else {
      texture.offset.set(0, offsetY * alignV)
      texture.repeat.set(-1, scale)
    }
  }
}
