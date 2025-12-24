const video = document.createElement("video");
video.style.display = "none";
document.body.appendChild(video);

const hands = new Hands({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7,
});

hands.onResults((res) => {
  if (res.multiHandLandmarks && res.multiHandLandmarks.length > 0) {
    const wrist = res.multiHandLandmarks[0][0];
    const x = wrist.x; // 0 ~ 1
    const rotation = (x - 0.5) * 1.5; // 左右摇头
    window.setTreeRotation(rotation);
  }
});

const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480,
});

camera.start();
