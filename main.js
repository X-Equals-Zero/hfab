// webglScene.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer, geometry, material, mesh, light, controls;
let ROWS, COLUMNS, instances;
let rot = 0;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(1, 1);
const color = new THREE.Color( 0xff00ff);
let previousTime = 0;
const incrementPerSecond = 1;

init();
animate(performance.now());
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100 );
    camera.position.z = 20;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // use orbit controls
    controls = new OrbitControls( camera, renderer.domElement );
    controls.update();

    

    ROWS = 25;
    COLUMNS = 25;
    instances = ROWS * COLUMNS;
    
    light = new THREE.HemisphereLight( 0xffffff, 0x888888, 3);
    
    // move light up 
    light.position.set( 5, 15, 1 );

    // add light and mesh to scene
    scene.add( light );

    // create mesh
    geometry = new THREE.PlaneGeometry(0.8, 0.8);
    material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
    mesh = new THREE.InstancedMesh( geometry, material, instances );
    for( let i = 0; i < instances; i++) {
        mesh.setColorAt( i, color.setHex( Math.random() * 0xffffff ) );
    }

    scene.add( mesh );

    // Event listener for mouse movement
    document.addEventListener( 'pointermove', onMouseMove, false );
}

// Function to handle mouse movement
function onMouseMove( event ) {
    event.preventDefault();
    // Calculate the mouse coordinates relative to the canvas

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

}

function animate(currentTime) {

	
    requestAnimationFrame( animate );
    
    // Calculate the time difference since the last frame
    currentTime = performance.now();
    const deltaTime = (currentTime - previousTime) / 1000; // Convert to seconds

    previousTime = currentTime;
    rot += incrementPerSecond * deltaTime;

    let index = 0;
    const matrix = new THREE.Matrix4();

	for (let i = 0; i < ROWS; i++) {
        
       for(let j = 0; j < COLUMNS; j++) {
        

            // Set the transform (position, rotation, scale) for each instance
            //matrix.makeRotationFromQuaternion( camera.quaternion ); // Rotate towards the camera
            let x = -COLUMNS / 2 + i; 
            let y = -ROWS / 2 + j;
            // make it do waves with z axis
            let dist = i + j;
            let p1 = -3 * Math.cos(dist * 0.3 + rot);
            let z =  Math.sin(dist * 0.3 + rot);

            matrix.setPosition(x, y, z); // Set the position

            mesh.setMatrixAt(index, matrix); // Apply the matrix to the instance
            index += 1;
       }
    }
    mesh.instanceMatrix.needsUpdate = true; // Update the instance data

    // raycast to find the object and change its color
    raycaster.setFromCamera( mouse, camera );
    const intersection = raycaster.intersectObject( mesh );
    if ( intersection.length > 0 ) {
        const instanceId = intersection[ 0 ].instanceId;
        mesh.setColorAt( instanceId, color.setHex( 0x000aaa ) );
        mesh.instanceColor.needsUpdate = true;

       
    }
    renderer.render( scene, camera );
}

