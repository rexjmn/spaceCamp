import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

export default function Earth() {
  const scene = new THREE.Scene();
  
  // Background Texture
  const bgTexture = new THREE.TextureLoader().load('./src/assets/space.jpeg');
  scene.background = bgTexture;

  // Camera
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
  camera.position.z = 10;
  scene.add(camera);

  // Renderer
  const canvas = document.querySelector('.webgl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

  // Orbit Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2;

  // Earth Group (includes Earth, Clouds, Glow, and Lights)
  const earthGroup = new THREE.Group();
  earthGroup.rotation.z = -23.4 * Math.PI / 180; // Earth's axial tilt
  scene.add(earthGroup);

  const detail = 64;  // Increase sphere detail
  const textureLoader = new THREE.TextureLoader();

  // Earth Mesh
  const earthGeometry = new THREE.SphereGeometry(3, detail, detail);
  const earthMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load('./src/assets/earth.jpeg'),
    specularMap: textureLoader.load('./src/assets/02_earthspec1k.jpg'),
    bumpMap: textureLoader.load('./src/assets/01_earthbump1k.jpg'),
    bumpScale: 0.04
  });
  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  earthGroup.add(earthMesh);

  // City Lights Mesh
  const lightsMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load('./src/assets/03_earthlights1k.jpg'),
    blending: THREE.AdditiveBlending
  });
  const lightsMesh = new THREE.Mesh(earthGeometry, lightsMaterial);
  earthGroup.add(lightsMesh);

  // Clouds Mesh
  const cloudsMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('./src/assets/04_earthcloudmap.jpg'),
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    alphaMap: textureLoader.load('./src/assets/05_earthcloudmaptrans.jpg'),
  });
  const cloudsMesh = new THREE.Mesh(earthGeometry, cloudsMaterial);
  cloudsMesh.scale.setScalar(1.003); // Slightly larger than the Earth mesh
  earthGroup.add(cloudsMesh);

  // Glow Effect (Fresnel-like)
  const fresnelMaterial = new THREE.ShaderMaterial({
    uniforms: {
      "c": { type: "f", value: 1.0 },
      "p": { type: "f", value: 2.0 },
      glowColor: { type: "c", value: new THREE.Color(0x00b3ff) },
      viewVector: { type: "v3", value: camera.position }
    },
    vertexShader: `
      uniform vec3 viewVector;
      varying float intensity;
      void main() {
        vec3 vNormal = normalize( normalMatrix * normal );
        vec3 vNormel = normalize( normalMatrix * viewVector );
        intensity = pow( c - dot(vNormal, vNormel), p );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      varying float intensity;
      void main() {
        vec4 glow = vec4( glowColor, 1.0 ) * intensity;
        gl_FragColor = glow;
      }
    `,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  });
  const glowMesh = new THREE.Mesh(earthGeometry, fresnelMaterial);
  glowMesh.scale.setScalar(1.01); // Slightly larger than the Earth mesh
  earthGroup.add(glowMesh);

  // Lighting
  const light = new THREE.PointLight(0xffffff, 10);
  light.position.set(10, 10, 10);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  // Moon
  const moonGroup = new THREE.Group();
  scene.add(moonGroup);
  const moonMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('./src/assets/06_moonmap4k.jpg'),
    bumpMap: textureLoader.load('.//07_moonbump4k.jpg'),
    bumpScale: 0.05
  });
  const moonGeometry = new THREE.SphereGeometry(0.8, detail, detail);
  const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  moonMesh.position.set(7, 0, 0); // Positioning the moon
  moonGroup.add(moonMesh);

  // Animations
  function animate() {
    requestAnimationFrame(animate);

    // Rotations for Earth, Clouds, and Moon
    earthMesh.rotation.y += 0.001;
    lightsMesh.rotation.y += 0.001;
    cloudsMesh.rotation.y += 0.0013;
    glowMesh.rotation.y += 0.001;
    moonGroup.rotation.y += 0.005;

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // GSAP Animation (Initial scale animation)
  const tl = gsap.timeline({ defaults: { duration: 1 } });
  tl.fromTo(earthMesh.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 });

  // Window Resize Handling
  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
  });
  
  // Mouse Color Change Interaction (optional)
  let mouseDown = false;
  let rgb = [12, 23, 55];
  window.addEventListener('mousedown', () => (mouseDown = true));
  window.addEventListener('mouseup', () => (mouseDown = false));
  window.addEventListener('mousemove', (e) => {
    if (mouseDown) {
      rgb = [
        Math.round((e.pageX / sizes.width) * 255),
        Math.round((e.pageY / sizes.height) * 255),
        150
      ];
      let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
      gsap.to(earthMesh.material.color, {
        r: newColor.r,
        g: newColor.g,
        b: newColor.b
      });
    }
  });

  return (
    <div></div>
  );
}
