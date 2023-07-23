// webglScene.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { player } from './player';
let camera, scene, renderer, geometry, material, mesh, light, controls;
let ROWS, COLUMNS, instances;
let playerData;
ROWS = 255;
COLUMNS = 255;
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

function getCord(i) {
    let x = Math.floor( i / ROWS);
    let y = i - (x * ROWS);
    return [x, y];
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

function calcNeighbors(cords) {
    let sum = 0;
    let outerSum = 0;

    outerSum += getGridState(getIndex( cords[0]-2, cords[1]-2 ));
    outerSum += getGridState(getIndex( cords[0]-2, cords[1]-1 ));
    outerSum += getGridState(getIndex( cords[0]-2, cords[1] ));
    outerSum += getGridState(getIndex( cords[0]-2, cords[1]+1 ));
    outerSum += getGridState(getIndex( cords[0]-2, cords[1]+2 ));
    
    outerSum += getGridState(getIndex( cords[0]-1, cords[1]-2 ));
    sum += getGridState(getIndex( cords[0]-1, cords[1]-1 ));
    sum += getGridState(getIndex( cords[0]-1, cords[1] ));
    sum += getGridState(getIndex( cords[0]-1, cords[1]+1 ));
    outerSum += getGridState(getIndex( cords[0]-1, cords[1]+2 ));

    outerSum += getGridState(getIndex( cords[0], cords[1]-2 ));
    sum += getGridState(getIndex( cords[0], cords[1]-1 ));

    sum += getGridState(getIndex( cords[0], cords[1]+1 ));
    outerSum += getGridState(getIndex( cords[0], cords[1]+2 ));

    outerSum += getGridState(getIndex( cords[0]+1, cords[1]-2 ));
    sum += getGridState(getIndex( cords[0]+1, cords[1]-1 ));
    sum += getGridState(getIndex( cords[0]+1, cords[1] ));
    sum += getGridState(getIndex( cords[0]+1, cords[1]+1 ));
    outerSum += getGridState(getIndex( cords[0]+1, cords[1]+2 ));
    
    outerSum += getGridState(getIndex( cords[0]+2, cords[1]-2 ));
    outerSum += getGridState(getIndex( cords[0]+2, cords[1]-1 ));
    outerSum += getGridState(getIndex( cords[0]+2, cords[1] ));
    outerSum += getGridState(getIndex( cords[0]+2, cords[1]+1 ));
    outerSum += getGridState(getIndex( cords[0]+2, cords[1]+2 ));
    return [sum, outerSum];
}
function nextState() {

    for(let i = 0; i < instances; i++) {
        let cords = getCord(i);
        let sums = calcNeighbors(cords);
        setNeighbors(i, sums[0]);
        setOuterNeighbors(i, sums[1]);
        
        
        let tempState = getGridState(i);
        let tempTotal = sums[0] + sums[1];
        if(tempTotal < 4 && sums[1] < 8) newState[i] = 0;
        if(tempTotal > 7 && sums[1] > 17) { newState[i] = 0 }
        if (tempTotal > 9 && tempTotal < 12) { newState[i] = 1 }
        if(tempState === 1){
            //if(sum < 3 || sum > 4) newState[tempIndex] = 0;
            

            
        }
        else if(tempState === 0) {
            

        }




            

        
    }
    gridState = newState;


}
function nextNextState() {

    for(let i = 0; i < instances; i++) {
        let tempState = getGridState(i);
        if(tempState === 0) continue;
        let cords = getCord(i);
        let sums = calcNeighbors(cords);
        setNeighbors(i, sums[0]);
        setOuterNeighbors(i, sums[1]);
        
        
        
        let tempTotal = sums[0] + sums[1];
        if(tempState === 1){
            //if(sum < 3 || sum > 4) newState[tempIndex] = 0;
            //if(tempTotal < 4 && sums[1] < 8) newState[i] = 0;
            if(tempTotal > 20 && tempTotal < 22) { newState[i] = 2 }

            
        }
        else if(tempState === 2){
            //if(sum < 3 || sum > 4) newState[tempIndex] = 0;
            //if(tempTotal < 4 && sums[1] < 8) newState[i] = 0;
            if(tempTotal > 15) { newState[i] = 1 }

            
        }
        else if(tempState === 0) {
            //if (tempTotal > 9 && tempTotal < 12) { newState[i] = 1 }

        }




            

        
    }
    gridState = newState;


}
function nextStateDeprecated() {
    let index = 0;
    for(let i = 0; i < ROWS; i++) {
        for(let j = 0; j < COLUMNS; j++) {
            let sum = 0;
            let outerSum = 0;
            let tempIndex = getIndex( i, j);
            outerSum += getGridState(getIndex( i-2, j-2 ));
            outerSum += getGridState(getIndex( i-2, j-1 ));
            outerSum += getGridState(getIndex( i-2, j ));
            outerSum += getGridState(getIndex( i-2, j+1 ));
            outerSum += getGridState(getIndex( i-2, j+2 ));
            
            outerSum += getGridState(getIndex( i-1, j-2 ));
            sum += getGridState(getIndex( i-1, j-1 ));
            sum += getGridState(getIndex( i-1, j ));
            sum += getGridState(getIndex( i-1, j+1 ));
            outerSum += getGridState(getIndex( i-1, j+2 ));

            outerSum += getGridState(getIndex( i, j-2 ));
            sum += getGridState(getIndex( i, j-1 ));

            sum += getGridState(getIndex( i, j+1 ));
            outerSum += getGridState(getIndex( i, j+2 ));

            outerSum += getGridState(getIndex( i+1, j-2 ));
            sum += getGridState(getIndex( i+1, j-1 ));
            sum += getGridState(getIndex( i+1, j ));
            sum += getGridState(getIndex( i+1, j+1 ));
            outerSum += getGridState(getIndex( i+1, j+2 ));
            
           outerSum += getGridState(getIndex( i+2, j-2 ));
            outerSum += getGridState(getIndex( i+2, j-1 ));
            outerSum += getGridState(getIndex( i+2, j ));
            outerSum += getGridState(getIndex( i+2, j+1 ));
            outerSum += getGridState(getIndex( i+2, j+2 ));
            setNeighbors(tempIndex, sum);
            setOuterNeighbors(tempIndex, outerSum);
            
            
            let tempState = getGridState(tempIndex);
            let tempTotal = sum + outerSum;
            if(tempState === 1){
                //if(sum < 3 || sum > 4) newState[tempIndex] = 0;
                if(tempTotal < 3) newState[tempIndex] = 0;
                if(sum > 8) { newState[tempIndex] = 0 }

                
            }
            else if(tempState === 0) {
                if (tempTotal > 10 && tempTotal < 13) { newState[tempIndex] = 1 }
                if(outerSum > 12) { newState[tempIndex] = 1 }
            }
            index++;



            

        }
    }
    gridState = newState;


}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 500 );



    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // use orbit controls
    //controls = new OrbitControls( camera, renderer.domElement );
    //controls.enableRotate = false;
    //controls.update();

    

    
    instances = ROWS * COLUMNS;
    
    light = new THREE.HemisphereLight( 0xffffff, 0x888888, 3);
    
    // move light up 
    light.position.set( 5, 15, 1 );

    // add light and mesh to scene
    scene.add( light );
    playerData = new player(scene, camera);
    playerData.init();


    // create mesh
    geometry = new THREE.PlaneGeometry(1, 1);
    material = new THREE.MeshPhongMaterial( { color: 0xF0FFFF } );
    mesh = new THREE.InstancedMesh( geometry, material, instances );
    for( let i = 0; i < instances; i++) {
        mesh.setColorAt( i, color.setHex( Math.random() * 0xF0FFFF ) );
        if(Math.random()  > 0.8){gridState.push(1);} else {gridState.push(0);}

        
        
    }
    for( let x = 0; x < ROWS; x++) {
        for( let y = 0; y < COLUMNS; y ++ ) {
            
        }
    }
    newState = [...gridState];
    neighbors = new Array(newState.length).fill(0);
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
var renderedFrames = 0;
function animate(currentTime) {

	
    requestAnimationFrame( animate );
    
    // Calculate the time difference since the last frame
    currentTime = performance.now();
    const deltaTime = (currentTime - previousTime) / 1000; // Convert to seconds

    previousTime = currentTime;
    rot += incrementPerSecond * deltaTime;

    let index = 0;
    const matrix = new THREE.Matrix4();

    playerData.update();
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
            let neighs = { 0: 6, 1: 9, 2: 10, 3: 18};
            if(tempState === 1) {
                
                let tempNeighbors = getNeighbors(getIndex(i, j));
                let tempOuterNeighbors = getOuterNeighbors(getIndex(i, j));
                mesh.setColorAt( index, color.setHex( 0xC9CC3F ) );
                
                let tempTotal = tempNeighbors + tempOuterNeighbors;
                if (tempTotal === 0){
                    mesh.setColorAt( index, color.setHex( 0x40B5AD ) );
                

                }
                else if(tempTotal > neighs[3]){ //most neighbors
                    mesh.setColorAt( index, color.setHex( 0x2E8B57 ) );
                    z = 2.5;
                    
                }
                else if(tempTotal > neighs[2]){
                    mesh.setColorAt( index, color.setHex( 0x93C572 ) );
                    z = 1.5;
                }
                else if (tempTotal > neighs[1]){
                    mesh.setColorAt( index, color.setHex( 0xB4C424 ) );
                    z = 1.3;
                }

                else if (tempTotal >= neighs[0]){ // least neighbors
                    mesh.setColorAt( index, color.setHex( 0x40B5AD ) );
                    z = 1.1;
                }
            }
            else if(tempState === 2) {
                mesh.setColorAt( index, color.setHex( 0xbf8734 ) );
                z = 3;
            }
            else {
                mesh.setColorAt( index, color.setHex( 0x0F52BA ) );

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
        setGridState(instanceId + 1, 1);
        setGridState(instanceId-1, 1);

        updateNeighbors(instanceId);
        updateNeighbors(instanceId + COLUMNS);
        updateNeighbors(instanceId - COLUMNS);
        updateNeighbors(instanceId + 1);
        updateNeighbors(instanceId-1);
        
        mesh.instanceColor.needsUpdate = true;

       
    }
    elapsedTime++;
    if(elapsedTime > 3 && renderedFrames < 25) {nextState(gridState); renderedFrames++; elapsedTime = 0;}
    //if(renderedFrames >=25 && renderedFrames < 30) { nextNextState(gridState); renderedFrames++;}

    renderer.render( scene, camera );
}

function updateNeighbors(id) {
    let sums = calcNeighbors(getCord(id));
    setNeighbors(id, sums[0]);
    setOuterNeighbors(id, sums[1]);
}