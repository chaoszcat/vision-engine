import { cameraStream } from "./streams/camera.ts"
import { initThree } from "./gl.ts"
import { Artisan, ArtisanRunner, EngineOpts, VisionEngine, VisionResult } from "./index"
import Stats from "stats.js"

export function engine(visionEngine: VisionEngine, opts?: EngineOpts) {

  // save video trial
  // setTimeout(async () => {
  //   const stream = renderer.domElement.captureStream(30)
  //   const m = new MediaRecorder(stream)
  //   m.ondataavailable = (e) => {
  //     saveAs(e.data, "video.mkv")
  //   }
  //   m.start()
  //
  //   setTimeout(async () => {
  //     m.stop()
  //   }, 15000)
  // }, 5000)

  return {
    run(...artisans: Artisan[]) {
      ;(async () => {

        // 0. Init stats for fun stuff
        let stats: Stats | null = null
        if (opts?.statsPanel !== false) {
          stats = new Stats()
          stats.showPanel(opts?.statsPanel as number)
          document.body.appendChild(stats.dom)
        }

        // 1. Start by requesting the media stream
        const mediaStream = await (opts?.stream || cameraStream())()

        // 2. Create the global video element
        const video = document.createElement("video")
        video.srcObject = mediaStream
        await video.play()

        // 3. We then start the scene based off the video we get
        const width = video.videoWidth
        const height = video.videoHeight
        const [scene, renderer, camera] = initThree(width, height)
        document.body.appendChild(renderer.domElement)

        // 4. Initialize our vision engine with the media stream
        const detect = await visionEngine(video)
        const msPerDetection = Math.floor(1000 / Math.min(30, Math.max(1, (opts?.detectionsPerSecond ?? 10))))

        // 5. Before run loop, we initialize all init scripts of all artisans
        const runners: ArtisanRunner[] = []
        for (let i = 0; i < artisans.length; ++i) {
          const run = await artisans[i]({ scene, renderer, camera, width, height, video })
          if (run) runners.push(run)
        }

        // 6. Vision result caches
        let visionResult: VisionResult
        let lastDetection: number = 0

          // 7. Main run loop
        ;(function animate() {

          if (stats) stats.begin()

          // Start of render loop
          runners.map((r) => r({
            scene,
            renderer,
            camera,
            video,
            width,
            height,
            visionResult,
          }))
          renderer.render(scene, camera)
          // End of render loop

          // Detection loop
          if (Date.now() - lastDetection > msPerDetection) {
            visionResult = detect().then((vr) => visionResult = vr)
            lastDetection = Date.now()
          }

          if (stats) stats.end()

          requestAnimationFrame(animate)
        })()
      })()
    },
  }
}
