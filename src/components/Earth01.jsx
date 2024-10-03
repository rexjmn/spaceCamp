import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'



export default function Earth() {
    
const scene = new THREE.Scene()
  const bgTexture = new THREE.TextureLoader().load('./src/assets/space.jpeg')
  scene.background = bgTexture


  const geometry = new THREE.SphereGeometry(3, 64, 64);
  const textureLoader = new THREE.TextureLoader()
  const material = new THREE.MeshPhongMaterial({
    map: textureLoader.load('./src/assets/earth.jpeg'),
    specularMap: textureLoader.load('./src/assets/02_earthspec1k.jpg'), 
    bumpMap: textureLoader.load('./src/assets/01_earthbump1k.jpg'),
    roughness: 0,
    metalness: 0.1,
    opacity: 0.9,
    reflectivity: 4,
    clearcoat: 2,
    clearcoatRoughness: 0,



  })
  

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = 0
  scene.add(mesh);

  const lightsMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load("./textures/03_earthlights1k.jpg"),
    blending: THREE.AdditiveBlending,
  });
  const lightsMesh = new THREE.Mesh(geometry, lightsMat);
  lightsMesh.renderOrder = ;
  scene.add(lightsMesh);
  
  const cloudsMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load("./textures/04_earthcloudmap.jpg"),
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    alphaMap: textureLoader.load('./textures/05_earthcloudmaptrans.jpg'),
    // alphaTest: 0.4,
  });
  const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
  cloudsMesh.scale.setScalar(1.003);
  scene.add(cloudsMesh);

  //sizes 

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  ///Lights
  const light = new THREE.PointLight(0xffffff, 200, 100);
  light.position.set(1, 1, 10)
  scene.add(light)


  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  // camera
  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
  camera.position.z = 20

  camera.lookAt(mesh.position)
  scene.add(camera)



  //Renderer
  const canvas = document.querySelector('.webgl');
  const renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(3)

  renderer.render(scene, camera)


  //Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.enablePan = false
  controls.enableZoom = false
  controls.autoRotate = true 
  controls.autoRotateSpeed = 5
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();


  ///Resize
  window.addEventListener('resize', () => {
    // Update sizes

    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    // Update camera
    camera.aspect = sizes.width / sizes.height
    renderer.setSize(sizes.width, sizes.height)
    camera.updateProjectionMatrix()
  })


  const loop = () => {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(loop)
  }
  loop()


  const tl = gsap.timeline({ defaults: { duration: 1 } })
  tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })
  tl.fromTo('nav', { y: '-100%' }, { y: '0%' })
  tl.fromTo('.title', { opacity: 0 }, { opacity: 1 })

  ///Mouse animation color

  let mouseDown = false
  let rgb = [12, 23, 55]
  window.addEventListener('mousedown', () => (mouseDown = true))

  window.addEventListener('mouseup', () => (mouseDown = false))

  window.addEventListener('mousemove', (e) => {
    if (mouseDown) {
      rgb = [
        Math.round((e.pageX / sizes.width) * 255),
        Math.round((e.pageY / sizes.height) * 255),
        150
      ]
      // lets animate 
      let newColor = new THREE.Color(rgb(${rgb.join(",")}))
      gsap.to(mesh.material.color, {
        r: newColor.r,
        g: newColor.g,
        b: newColor.b,

      })
    }
  })
  

    return (
      <div>
        
      </div>
    )
  }