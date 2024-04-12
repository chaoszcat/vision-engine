const defaultConstraints: MediaStreamConstraints = {
  video: {
    width: 1280, height: 720, facingMode: "user",
  },
}

/**
 * Default camera stream
 * @param constraints
 */
export function cameraStream(constraints: MediaStreamConstraints = defaultConstraints): Promise<MediaStream> {
  return new Promise(async (resolve, reject) => {
    if (window.navigator.mediaDevices) {
      resolve(await window.navigator.mediaDevices.getUserMedia(constraints))
    } else {
      reject("Cannot get media-stream-providers")
    }
  })
}
