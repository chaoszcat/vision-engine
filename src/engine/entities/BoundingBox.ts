import { Point } from "./Point.ts"
import { NormalizedLandmark } from "@mediapipe/tasks-vision"

export class BoundingBox {
  public width: number
  public height: number

  constructor(
    public min: Point,
    public max: Point,
  ) {
    this.width = max.x - min.x
    this.height = max.y - min.y
  }

  public static findBoundingBoxOfLandmarks(landmarks: NormalizedLandmark[]): BoundingBox {
    const def = new BoundingBox(
      new Point(Infinity, Infinity),
      new Point(-Infinity, -Infinity),
    )
    return landmarks.reduce((box, lm) => box.fit(lm.x, lm.y), def)
  }

  fit(x: number, y: number): this {
    this.min.x = Math.min(this.min.x, x)
    this.min.y = Math.min(this.min.y, y)
    this.max.x = Math.max(this.max.x, x)
    this.max.y = Math.max(this.max.y, y)
    this.width = this.max.x - this.min.x
    this.height = this.max.y - this.min.y
    return this
  }
}
