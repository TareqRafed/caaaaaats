import "./style.css";
import * as THREE from "three";

// Setup

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("app") || undefined,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);

renderer.render(scene, camera);

// Light

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 0);
scene.add(pointLight);

// Geometry

const geometry = new THREE.TorusKnotGeometry(4, 0.6, 8, 5, 2, 8);
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
});

const torus = new THREE.Mesh(geometry, material);

const ppTexture = new THREE.TextureLoader().load("pp.jpg");
const box = new THREE.BoxGeometry(7, 7, 0.5);
const profileMesh = new THREE.Mesh(
  box,
  new THREE.MeshBasicMaterial({
    map: ppTexture,
  })
);

scene.add(profileMesh);
scene.add(torus);
profileMesh.rotation.z += 0.8;

// Stars

const addStar = () => {
  const box = new THREE.BoxGeometry(2, 2, 0.1);
  const doraTexture = new THREE.TextureLoader().load("dora.png");

  const doraMesh = new THREE.Mesh(
    box,
    new THREE.MeshBasicMaterial({
      map: doraTexture,
    })
  );

  const [x, y, z] = Array(3)
    .fill(0)
    .map(() => THREE.MathUtils.randFloatSpread(100));

  doraMesh.position.set(x, y, z);
  scene.add(doraMesh);
  return doraMesh;
};

const spaceTexutre = new THREE.TextureLoader().load("bg.webp");

scene.background = spaceTexutre;

const stars = Array(200).fill(null).map(addStar);
camera.position.z = 30 * -0.01;
const moveCamera = () => {
  const t = document.body.getBoundingClientRect().top;
  stars.forEach((star) => (star.position.x += 0.01));

  camera.position.z = -30 + t * -0.01;
};

document.body.onscroll = moveCamera;

const animate = () => {
  requestAnimationFrame(animate);

  // Renderer Loop
  stars.forEach((star) => (star.position.x -= 0.01));
  profileMesh.rotation.x += 0.01;
  profileMesh.rotation.y += 0.01;
  profileMesh.rotation.z += 0.01;
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.01;

  renderer.render(scene, camera);
};

animate();
