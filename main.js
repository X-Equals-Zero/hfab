// webglScene.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer, geometry, material, mesh, light, controls;
let ROWS, COLUMNS, instances;
ROWS = 155;
COLUMNS = 155;
let gridState = [];
let newState = [];
let neighbors = [];
let outerNeighbors = [];
let rot = 0;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(1, 1);
const color = new THREE.Color( 0xff00ff);
let previousTime = 0;
const incrementPerSecond = 1;

init();
animate(performance.now());

function getIndex(x, y){
    let x1 = x;
    let y1 = y;
    if(x1 < 0) { x1 = ROWS - 1 + x}
    if(x1 > ROWS - 1) { x1 = 0 + (x1 - (ROWS-1))}
    if(y1 < 0) { y1 = COLUMNS - 1 + y}
    if(y1 > COLUMNS - 1) { y1 = 0 + (y1 - (COLUMNS-1))}

    

    return (x1 * COLUMNS) + y1;
}
function getNeighbors(index) {
    return neighbors[index];
}

function setNeighbors(index, value) {
    neighbors[index] = value;
}

function getOuterNeighbors(index) {
    return outerNeighbors[index];
}
function setOuterNeighbors(index, value) {
    outerNeighbors[index] = value;
}
function nextState() {
    let index = 0;
    for(let i = 0; i < ROWS; i++) {
        for(let j = 0; j < COLUMNS; j++) {
            let sum = 0;
            let outerSum = 0;
            let tempIndex = getIndex( i, j);
            //outerSum += getGridState(getIndex( i-2, j-2 ));
            outerSum += getGridState(getIndex( i-2, j-1 ));
            outerSum += getGridState(getIndex( i-2, j ));
            outerSum += getGridState(getIndex( i-2, j+1 ));
            //outerSum += getGridState(getIndex( i-2, j+2 ));
            
            outerSum += getGridState(getIndex( i-1, j-2 ));
            //sum += getGridState(getIndex( i-1, j-1 ));
            sum += getGridState(getIndex( i-1, j ));
            //sum += getGridState(getIndex( i-1, j+1 ));
            outerSum += getGridState(getIndex( i-1, j+2 ));

            outerSum += getGridState(getIndex( i, j-2 ));
            sum += getGridState(getIndex( i, j-1 ));

            sum += getGridState(getIndex( i, j+1 ));
            outerSum += getGridState(getIndex( i, j+2 ));

            outerSum += getGridState(getIndex( i+1, j-2 ));
            //sum += getGridState(getIndex( i+1, j-1 ));
            sum += getGridState(getIndex( i+1, j ));
            //sum += getGridState(getIndex( i+1, j+1 ));
            outerSum += getGridState(getIndex( i+1, j+2 ));
            
           // outerSum += getGridState(getIndex( i+2, j-2 ));
            outerSum += getGridState(getIndex( i+2, j-1 ));
            outerSum += getGridState(getIndex( i+2, j ));
            outerSum += getGridState(getIndex( i+2, j+1 ));
            //outerSum += getGridState(getIndex( i+2, j+2 ));
            setNeighbors(tempIndex, sum);
            setOuterNeighbors(tempIndex, outerSum);
            
            
            let tempState = getGridState(tempIndex);
            if(tempState === 1){
                if(sum > 4) newState[tempIndex] = 0;
                if(outerSum < 2) newState[tempIndex] = 1;

                
            }
            else if(tempState === 0) {
                if (sum > 1 && outerSum < 7) { newState[tempIndex] = 1 }
            }
            index++;



            

        }
    }
    gridState = newState;


}
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 500 );
    camera.position.z = 20;
    

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // use orbit controls
    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableRotate = false;
    controls.update();

    

    
    instances = ROWS * COLUMNS;
    
    light = new THREE.HemisphereLight( 0xffffff, 0x888888, 3);
    
    // move light up 
    light.position.set( 5, 15, 1 );

    // add light and mesh to scene
    scene.add( light );

    // create mesh
    geometry = new THREE.BoxGeometry(1, 1, 5);
    material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
    mesh = new THREE.InstancedMesh( geometry, material, instances );
    for( let i = 0; i < instances; i++) {

        mesh.setColorAt( i, color.setHex( Math.random() * 0xffffff ) );
        if(i < 200){gridState.push(1);} else {gridState.push(0);}

        
        
    }
    newState = [...gridState];
    neighbors = Array.apply(null, Array(instances)).map(Number.prototype.valueOf, 0);
    outerNeighbors = [...neighbors];

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
function setGridState(index, value) {
    gridState[index] = value;

}
function getGridState(index) {
    return gridState[index];
}

var elapsedTime = 0;
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
            //let p1 = -3 * Math.cos(dist * 0.3 + rot);
            let z =  Math.sin(dist * 0.3 + rot);

            

            let tempState = getGridState(getIndex(i, j));
            if(tempState === 1) {
                
                let tempNeighbors = getNeighbors(getIndex(i, j));
                let tempOuterNeighbors = getOuterNeighbors(getIndex(i, j));
                mesh.setColorAt( index, color.setHex( 0x333aaa ) );
                z = 1;
                if (tempNeighbors > 1){
                    mesh.setColorAt( index, color.setHex( 0x111111 ) );

                }
                if (tempNeighbors > 2){
                    mesh.setColorAt( index, color.setHex( 0x222222 ) );
                    z = 1.5;
                }
                if(tempNeighbors > 3){
                    mesh.setColorAt( index, color.setHex( 0x333333 ) );
                    z = 2;
                }
                if(tempNeighbors >= 5){
                    mesh.setColorAt( index, color.setHex( 0x333aaa ) );
                    z = 2.3;
                    
                }
                if(tempOuterNeighbors > 9){
                    mesh.setColorAt( index, color.setHex( 0x333aaa ) );
                    z = 2.3;
                }
                if(tempOuterNeighbors == 5){
                    mesh.setColorAt( index, color.setHex( 0xff0000 ) );
                    z = 2.5;
                }
                if(tempOuterNeighbors == 6){
                    mesh.setColorAt( index, color.setHex( 0xff2222 ) );
                    z = 3;
                }
                



            }
            else {
                mesh.setColorAt( index, color.setHex( 0xfff111 ) );

            }
            matrix.setPosition(x, y, z); // Set the position
            mesh.setMatrixAt(index, matrix); // Apply the matrix to the instance


            mesh.instanceColor.needsUpdate = true;
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
        setGridState(instanceId, 1);
        setGridState(instanceId + COLUMNS, 1);
        setGridState(instanceId - COLUMNS, 1);
        setGridState(instanceId + 1, 1)
        setGridState(instanceId-1, 1)
        
        mesh.instanceColor.needsUpdate = true;

       
    }
    elapsedTime++;
    if(elapsedTime > 3) {nextState(gridState); elapsedTime = 0;}
    renderer.render( scene, camera );
}

