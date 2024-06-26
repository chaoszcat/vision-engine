import "./style.css"
import { engine } from "engine/engine.ts"
import { cameraArtisan } from "engine/artisans/cameraArtisan.ts"
import { gestureVision } from "engine/visions/gestureVision.ts"
import { gestureMarkerArtisan } from "engine/artisans/gestureMarkerArtisan.ts"
import {
  MEDIA_PIPE_GESTURE_CATEGORY_CLOSED_FIST,
  MEDIA_PIPE_GESTURE_CATEGORY_OPEN_PALM,
  MEDIA_PIPE_GESTURE_CATEGORY_Pointing_Up,
  MEDIA_PIPE_GESTURE_CATEGORY_VICTORY,
} from "engine/visions/constants.ts"
import { videoOnGestureArtisan } from "engine/artisans/videoOnGestureArtisan.ts"

/**
 * The engine starts off by supplying the gesture engine
 * Supplied is the demo hand gesture engine. On detection, it will be
 * passed to all the artisans below to render.
 */
engine(
  gestureVision({
    // number of hands, [1, 8]
    numHands: 8,

    // true to use worker
    useWorker: true,
  }),
  {
    // Controlling the stats panel [false, 0 (fps), 1 (ms), 2 (mb)]
    statsPanel: 0,

    // Controlling how many detections per seconds [1-30]
    detectionsPerSecond: 10,
  })
  .run(
    /**
     * This is the main run loop. It's drawn from top to bottom
     * ie, the top most will be replaced by the lower items.
     *
     * Freely stack as much, but be sensible
     */
    cameraArtisan(),
    // greenBoxArtisan(),
    gestureMarkerArtisan([
      MEDIA_PIPE_GESTURE_CATEGORY_OPEN_PALM,
      MEDIA_PIPE_GESTURE_CATEGORY_CLOSED_FIST,
      MEDIA_PIPE_GESTURE_CATEGORY_Pointing_Up,
      MEDIA_PIPE_GESTURE_CATEGORY_VICTORY,
    ], 0x00ff00),
    videoOnGestureArtisan(MEDIA_PIPE_GESTURE_CATEGORY_OPEN_PALM, "/roses-RYxWRne9.webm"),
  )
