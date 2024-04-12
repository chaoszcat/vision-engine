import { InitParameters } from "../index"
import { BoxGeometry, Mesh, MeshBasicMaterial } from "three"

export function greenBoxArtisan() {
  return async ({ scene }: InitParameters) => {
    const geometry = new BoxGeometry(50, 50, 0)
    const material = new MeshBasicMaterial({
      color: 0x00ff00,
    })
    const cube = new Mesh(geometry, material)
    scene.add(cube)
  }
}
