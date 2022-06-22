// Find the latest version by visiting https://cdn.skypack.dev/three.

// import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.129.0-chk6X8RSBl37CcZQlxof/mode=imports/optimized/three.js';
import * as THREE from '../plugin/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
const gui = new dat.GUI()
const world = {
    plane: {
        width: 400,
        height: 400,
        widthSegments : 50,
        heightSegments : 50
    }
}
gui.add(world.plane, 'width', 1, 500).onChange(genetatePlane)
gui.add(world.plane, 'height', 1, 500).onChange(genetatePlane)
gui.add(world.plane, 'widthSegments', 1, 100).onChange(genetatePlane)
gui.add(world.plane, 'heightSegments', 1, 100).onChange(genetatePlane)

function genetatePlane() {
    planeMesh.geometry.dispose()
    planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width,world.plane.height,world.plane.widthSegments,world.plane.heightSegments)
    const { array } = planeMesh.geometry.attributes.position
    const randomValues = [];

    for (let i = 0; i < array.length; i++) {
        if (i % 3 === 0) {
            const x = array[i]
            const y = array[i+1]
            const z = array[i+2]
            array[i] = x + (Math.random() - 0.5) * 3
            array[i+1] = y + (Math.random() - 0.5) *3
            array[i+2] = z + (Math.random()- 0.5) * 3
        }
        randomValues.push(Math.random()-0.5)
    }
    planeMesh.geometry.attributes.position.randomValues = randomValues
    planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array
    // console.log(planeMesh)
    // planeMesh.rotation.x = 
    const colors = []
    for (let i= 0; i <planeMesh.geometry.attributes.position.count; i++) {
        colors.push(0,.19,0.4)
    }

    planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

}

const raycaster = new THREE.Raycaster()
const scene = new THREE.Scene();
const camera =new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer()

renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera,renderer.domElement)

camera.position.z = 50
console.log(camera.rotation)
const planeGeometry = new THREE.PlaneGeometry(world.plane.width,world.plane.height,world.plane.widthSegments,world.plane.heightSegments)
const planematerial = new THREE.MeshPhongMaterial({
    side : THREE.DoubleSide,
    flatShading: THREE.FlatShading,
    vertexColors : true
})
const planeMesh = new THREE.Mesh(planeGeometry, planematerial)
scene.add(planeMesh)
genetatePlane()

const { array } = planeMesh.geometry.attributes.position
const randomValues = [];

for (let i = 0; i < array.length; i++) {
    if (i % 3 === 0) {
        const x = array[i]
        const y = array[i+1]
        const z = array[i+2]
        array[i] = x + (Math.random() - 0.5) * 3
        array[i+1] = y + (Math.random() - 0.5) *3
        array[i+2] = z + (Math.random()- 0.5) * 3
    }
    randomValues.push(Math.random() * Math.PI * 2)
}
planeMesh.geometry.attributes.position.randomValues = randomValues
planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array
//color
const colors = []
for (let i= 0; i <planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0,.19,0.4)
}

planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))


const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0,0,-1)
light.rotation.z = 5
// console.log(light)

scene.add(light)
const backlight = new THREE.DirectionalLight(0xffffff, 1)
backlight.position.set(0,0,1)
scene.add(backlight)


// 별
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
    color : 0xffffff
})

const startVerticies = [];
for (let i=0; i<10000; i++) {
    const x = (Math.random() -0.5) * 2000;
    const y = (Math.random() -0.5) * 2000;
    const z = (Math.random() -0.5) * 2000;
    startVerticies.push(x,y,z)
}
// console.log(startVerticies)

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(startVerticies, 3))

// console.log(starGeometry)
// console.log(starMaterial)

const starts = new THREE.Points(starGeometry, starMaterial)

scene.add(starts)

const mouse = {
    x: undefined,
    y: undefined
}
let frame= 0
function animate() {
    requestAnimationFrame(animate)
    // controls.update();
    renderer.render(scene, camera)
    // planeMesh.rotation.x += 0.01
    raycaster.setFromCamera(mouse, camera)
    frame += 0.01
    //파도효과
    const { array, originalPosition, randomValues } = planeMesh.geometry.attributes.position;
    for (let i=0; i< array.length; i+=3){
        // x
        array[i] = originalPosition[i] + Math.cos(frame+ randomValues[i]) *0.01
        // y
        array[i+1] = originalPosition[i+1] + Math.sin(frame+ randomValues[i+1]) *0.001

    }
    planeMesh.geometry.attributes.position.needsUpdate = true
    const intersects = raycaster.intersectObject(planeMesh)
    if(intersects.length > 0) {
        const {color} = intersects[0].object.geometry.attributes;
        // vertice 1
        color.setX(intersects[0].face.a,0.1)
        color.setY(intersects[0].face.a,0.5)
        color.setZ(intersects[0].face.a,1)
        // vertice 2
        color.setX(intersects[0].face.b,0.1)
        color.setY(intersects[0].face.b,0.5)
        color.setZ(intersects[0].face.b,1.5)

        // vertice 3
        color.setX(intersects[0].face.c,0.1)
        color.setY(intersects[0].face.c,0.5)
        color.setZ(intersects[0].face.c,1)

        intersects[0].object.geometry.attributes.color.needsUpdate = true
        const initalColor = {
            r: 0,
            g: .19,
            b: .4
        }
        const hoverColor = {
            r: 0.1,
            g: .5,
            b: 1
        }
        gsap.to(hoverColor, {
            r:initalColor.r,
            g:initalColor.g,
            b:initalColor.b,
            onUpdate:()=> {
                // vertice 1
                color.setX(intersects[0].face.a,hoverColor.r)
                color.setY(intersects[0].face.a,hoverColor.g)
                color.setZ(intersects[0].face.a,hoverColor.b)
                // vertice 2
                color.setX(intersects[0].face.b,hoverColor.r)
                color.setY(intersects[0].face.b,hoverColor.g)
                color.setZ(intersects[0].face.b,hoverColor.b)

                // vertice 3
                color.setX(intersects[0].face.c,hoverColor.r)
                color.setY(intersects[0].face.c,hoverColor.g)
                color.setZ(intersects[0].face.c,hoverColor.b)
            }
        })
    }
    starts.rotation.x += 0.0005
}
renderer.render(scene, camera)
animate()

addEventListener('mousemove', (e)=> {
    mouse.x = (e.clientX / innerWidth) * 2 -1
    mouse.y = -(e.clientY / innerHeight) * 2 +1
})

gsap.to('.title',{
    opacity: 1,
    duration: 2
})

gsap.to('.description',{
    opacity: 1,
    duration: 2
})

document.querySelector('.btn').addEventListener('click', (e)=> {
    e.preventDefault()
    gsap.to('.container',{
        opacity : 0
    })
    gsap.to(camera.position, {
        z: 25,
        ease : 'powe3.inOut',
        duration : 1.5
    })
    gsap.to(camera.rotation, {
        x: 1.57,
        ease : 'powe3.inOut',
        duration : 1.5
    })
    gsap.to(camera.position, {
        y: 1000,
        ease : 'powe3.inOut',
        duration : 3,
        delay : 1.5
    })
})