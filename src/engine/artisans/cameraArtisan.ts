import { InitParameters } from "../index"
import { Mesh, MeshBasicMaterial, PlaneGeometry, RepeatWrapping, SRGBColorSpace, Texture, VideoTexture } from "three"

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
    fitTexture(mat.map!, video.videoWidth / video.videoHeight, width / height, "fill")
  }
}


/**
 * @param {Texture} texture - a texture containing a loaded image with a defined width and height
 * @param {number} videoAspect - the aspect ratio (width / height) of the model that contains the texture
 * @param {number} screenAspect - the aspect ratio (width / height) of the model that contains the texture
 * @param {"fit"|"fill"|"stretch"} mode - three modes of manipulating the texture offset and scale
 * @param {number} [alignH] - optional multiplier to align the texture horizontally - 0: left, 0.5: center, 1: right
 * @param {number} [alignV] - optional multiplier to align the texture vertically - 0: bottom, 0.5: middle, 1: top
 **/
function fitTexture(texture: Texture, videoAspect: number, screenAspect: number, mode: string, alignH: number = 0.5, alignV: number = 0.5) {

  const scale = videoAspect / screenAspect
  const offsetX = (videoAspect - screenAspect) / videoAspect
  const offsetY = (screenAspect - videoAspect) / screenAspect

  switch (mode) {
    case "contain":
    case "fit": {
      if (screenAspect < videoAspect) {
        texture.offset.set(0, offsetY * alignV)
        texture.repeat.set(-1, scale)
      } else {
        texture.offset.set(offsetX * alignH, 0)
        texture.repeat.set(-1 / scale, 1)
      }
      break
    }
    case "cover":
    case "fill": {
      if (screenAspect < videoAspect) {
        texture.offset.set(offsetX * alignH, 0)
        texture.repeat.set(-1 / scale, 1)
      } else {
        texture.offset.set(0, offsetY * alignV)
        texture.repeat.set(-1, scale)
      }
      break
    }
    case "none":
    case "stretch":
    default: {
      texture.offset.set(0, 0)
      texture.repeat.set(-1, 1)
      break
    }
  }
}
