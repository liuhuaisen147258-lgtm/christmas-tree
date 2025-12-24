let scene, camera, renderer, tree;
let targetRotation = 0;

init();
animate();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 1.5, 4);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // HDR 环境光（写实感关键）
  new THREE.RGBELoader()
    .load(
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr",
      (hdr) => {
        hdr.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = hdr;
      }
    );

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 10, 7);
  scene.add(light);

  // 加载写实圣诞树模型（Sketchfab CDN）
  const loader = new THREE.GLTFLoader();
  loader.load(
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/ChristmasTree.glb",
    (gltf) => {
      tree = gltf.scene;
      tree.scale.set(1.5, 1.5, 1.5);
      scene.add(tree);
    }
  );

  createSnow();
  window.addEventListener("resize", onResize);
}

function createSnow() {
  const count = 1000;
  const geo = new THREE.BufferGeometry();
  const pos = [];

  for (let i = 0; i < count; i++) {
    pos.push(
      (Math.random() - 0.5) * 10,
      Math.random() * 5,
      (Math.random() - 0.5) * 10
    );
  }

  geo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(pos, 3)
  );

  const mat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.03,
  });

  const snow = new THREE.Points(geo, mat);
  scene.add(snow);

  snow.tick = () => {
    const p = snow.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) {
      p.array[i * 3 + 1] -= 0.01;
      if (p.array[i * 3 + 1] < 0) {
        p.array[i * 3 + 1] = 5;
      }
    }
    p.needsUpdate = true;
  };

  scene.userData.snow = snow;
}

function animate() {
  requestAnimationFrame(animate);

  if (tree) {
    tree.rotation.y += (targetRotation - tree.rotation.y) * 0.1;
  }

  if (scene.userData.snow) {
    scene.userData.snow.tick();
  }

  renderer.render(scene, camera);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// 给 hand.js 调用
window.setTreeRotation = (v) => {
  targetRotation = v;
};
