// webglScene.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.PlaneGeometry(0.8, 0.8);
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: false } );
var rot = 0;
var ROWS = 51;
var COLUMNS = 51;

var instances = ROWS * COLUMNS;
const mesh = new THREE.InstancedMesh( geometry, material, instances );
const light = new THREE.PointLight( 0xff0000, 5, instances );
// move light up 
light.position.set( 5, 15, 1 );
scene.add( light );
scene.add( mesh );
let { scaleX, scaleY, scaleZ } = { scaleX: 1, scaleY: 1, scaleZ: 1 }
const matrix = new THREE.Matrix4();


// use orbit controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

camera.position.z = 20;
// set camera y to scroll wheel position

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Event listener for mouse movement
document.addEventListener( 'mousemove', onMouseMove, false );

// Function to handle mouse movement
function onMouseMove( event ) {
    
    // Calculate the mouse coordinates relative to the canvas
    const canvas = renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    mouse.x = ( event.clientX - rect.left) / rect.width * 2 - 1;
    mouse.y = - ( event.clientY - rect.top) / rect.height * 2 + 1;

    // Performing raycasting
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    // Check for intersections
    if (intersects.length > 0) {
        // Get the first insterscted object
        const intersectedObj = intersects[0].object;

        // Do something with the object
        intersectedObj.material.color.set(0xff0000);
    }
}
let {previousTime, currentTime} = {previousTime: performance.now(), currentTime: performance.now()};
const incrementPerSecond = 15;
function animate() {

	
    requestAnimationFrame( animate );
    let index = 0;
    // Calculate the time difference since the last frame
    currentTime = performance.now();
    const deltaTime = (currentTime - previousTime) / 1000; // Convert to seconds
    console.log(deltaTime);
    previousTime = currentTime;

    rot += incrementPerSecond * deltaTime;
	for (let i = 0; i < ROWS; i++) {
        
       for(let j = 0; j < COLUMNS; j++) {
        

            // Set the transform (position, rotation, scale) for each instance
            //matrix.makeRotationFromQuaternion( camera.quaternion ); // Rotate towards the camera
            let x = -COLUMNS / 2 + i; 
            let y = -ROWS / 2 + j;
            // make it do waves with z axis
            let dist = i + j;
            let p1 = -3 * Math.cos(dist * 0.3 + rot);
            let z =  2 * Math.sin(dist * 0.3 + rot) + p1;
            if(i%10 == 0) {
                z *= -1;
            }
            if(j%10 == 0) {
                z *= -1;
            }
            matrix.setPosition(x, y, z); // Set the position

            mesh.setMatrixAt(index, matrix); // Apply the matrix to the instance
            index += 1;
       }
    }
    mesh.instanceMatrix.needsUpdate = true; // Update the instance data

    renderer.render( scene, camera );
}

animate();