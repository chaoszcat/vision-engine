import { RunParameters } from "../index"
import { EdgesGeometry, LineBasicMaterial, LineSegments, PlaneGeometry } from "three"
import { GestureRecognizerResult } from "@mediapipe/tasks-vision"
import { BoundingBox } from "../entities/BoundingBox.ts"

export function gestureMarkerArtisan(categoryNames: string[], boxColor: number = 0x00ff00) {
  return async () => {

    let boxes: LineSegments[] = []

    return ({ scene, width, height, visionResult }: RunParameters) => {

      // 1. remove all boxes first
      scene.remove(...boxes)
      boxes = []

      // 2. on result, draw them
      if (visionResult) {
        const result = visionResult as GestureRecognizerResult
        const matched = result.gestures.length

        for (let i = 0; i < matched; ++i) {
          const category = result.gestures[i][0]
          //const landmarks = result.landmarks[i]
          if (categoryNames.includes(category.categoryName)) {

            const b = BoundingBox.findBoundingBoxOfLandmarks(result.landmarks[i])

            // when the box reach here, the dimensions is normalised w.r.t the video frame
            // we convert it to our world frame here
            const boxWidth = b.width * width
            const boxHeight = b.height * height
            const centerX =
              b.min.x * width - width / 2 + boxWidth / 2
            const centerY =
              -b.min.y * height +
              height / 2 -
              boxHeight / 2

            const geometry = new PlaneGeometry(boxWidth, boxHeight)
            const box = new LineSegments(
              new EdgesGeometry(geometry),
              new LineBasicMaterial({ color: boxColor }),
            )
            box.position.x = -centerX
            box.position.y = centerY
            scene.add(box)
            boxes.push(box)
          }
        }
      }
    }
  }
}
