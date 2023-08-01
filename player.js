import * as THREE from 'three';

export function player(scene, camera, controls) {
    let _controls;
    var Physics = makeStruct("pos vel accel");
    var playerData = new Physics(new THREE.Vector3(0, 0, 10), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0));;
    var geometry = new THREE.BoxGeometry(3, 6, 1);
    var material = new THREE.MeshPhongMaterial( { color: 0xFFFFFF } );
    var mesh = new THREE.Mesh( geometry, material);
    mesh.position.copy(playerData.pos);


    var oldMousePos = {x: 0, y: 0};
   
   
    var oldMousePos = {x: 0, y: 0};
   
    var mouseDelta = { x: 0, y: 0};
    
    this.getPlayerData = function() {
        return playerData;
    }

    this.init = function() {
        scene.add(mesh);
        _controls = controls;
        document.addEventListener("keydown", (event) => {
            if(event.defaultPrevented) {
                return;
            }

            switch (event.key) {
                case "w":
                    playerData.accel.y = 0.1;
                    break;

                case "s":
                    playerData.accel.y = -0.1;
                    break;
                case "a":
                    playerData.accel.x = -0.1;
                    break;
                case "d":
                        playerData.accel.x = 0.1;
                        break;

                default:
                    break;

            }
        });
        
        

        document.addEventListener("mousemove", (event) => {
            if(event.defaultPrevented) { return; }
            if(_controls.isLocked === false) return;

            mouseDelta.x = event.movementX;
            if(event.buttons ===1){
                mouseDelta.y = event.movementY;
                ;
            }
            else {
                mouseDelta.y = event.movementY;
                mouseDelta.y *= -1
            }


            
        });
    
    }

    this.update = function() {
        playerData.vel.add(playerData.accel);
        
        //mesh.translateX(playerData.vel.x);
        mesh.translateY(playerData.vel.y);
        //mesh.translateZ(playerData.vel.z);
        playerData.pos.copy(mesh.position);

        
        
        let falloff =  (1/ (1 + playerData.vel.y));
        mesh.rotateX(mouseDelta.y * 0.005 *falloff);
        mesh.rotateY(mouseDelta.x * 0.005 *falloff);
        mesh.rotateZ(playerData.vel.x * -falloff);
        if(playerData.vel.x != 0) { playerData.vel.x /= 2;};
        mesh.rotateZ(mouseDelta.x * -0.001);
        camera.position.copy(mesh.position);
        camera.rotation.copy(mesh.rotation);
        camera.rotateX(1.2);

        camera.translateZ(15);

        playerData.accel.set(0, 0, 0);
        
    }




}
function makeStruct(names) {
    var names = names.split(' ');
    var count = names.length;
    function constructor() {
      for (var i = 0; i < count; i++) {
        this[names[i]] = arguments[i];
      }
    }
    return constructor;
  }
  

  