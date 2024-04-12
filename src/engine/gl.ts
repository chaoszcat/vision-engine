import { Camera, PerspectiveCamera, Scene, WebGLRenderer } from "three"

const NEAR = 1
const FAR = 1000
const FOV = 75

export function initThree(width: number, height: number): [Scene, WebGLRenderer, Camera] {
  // the world will make sure el has a canvas in it and takes full width
  const scene = new Scene()
  const aspectRatio = width / height
  const camera = new PerspectiveCamera(FOV, aspectRatio, NEAR, FAR)

  // the plane's height must match the given height, so the
  // algorithm is = plane distance -> move front by (h/2) / tan(FOV/2)
  camera.position.z = (height / 2) / Math.tan(FOV / 2 * Math.PI / 180)
  const renderer = new WebGLRenderer()
  renderer.setSize(width, height)

  return [scene, renderer, camera]
}