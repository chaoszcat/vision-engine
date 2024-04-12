const defaultConstraints: MediaStreamConstraints = {
  video: {
    // requesting full window width and height if possible
    width: window.innerWidth,
    height: window.innerHeight,
    facingMode: "user",
  },
}

/**
 * Default camera stream
 * @param constraints
 */
export function cameraStream(constraints: MediaStreamConstraints = defaultConstraints): () => Promise<MediaStream> {
  return async () => {
    if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
      return await window.navigator.mediaDevices.getUserMedia(constraints)
    } else {
      throw new Error("Cannot get camera")
    }
  }
}
