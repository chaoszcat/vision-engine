import { Camera, Scene, WebGLRenderer } from "three"

export type RunParameters = {
  scene: Scene,
  renderer: WebGLRenderer,
  camera: Camera,
  mediaStream: MediaStream,
  width: number,
  height: number,
  visionResult: VisionResult | false,
}

export type InitParameters = {
  scene: Scene,
  renderer: WebGLRenderer,
  camera: Camera,
  width: number,
  height: number,
  mediaStream: MediaStream,
}

export type VisionResult = any
export type VisionEngineDetector = () => Promise<VisionResult>
export type VisionEngine = (mediaStream: MediaStream) => Promise<VisionEngineDetector>

export type ArtisanRunner = (run: RunParameters) => void
export type Artisan = (init: InitParameters) => Promise<ArtisanRunner | void> // can have no run loops

export type EngineOpts = {
  //false: off, 0: fps, 1: ms, 2: mb
  statsPanel?: number | false
  detectionsPerSecond?: number,
  stream?: Promise<MediaStream>
}
