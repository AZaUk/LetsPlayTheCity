import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';
import { FBXLoader } from './FBXLoader.js';

const manager = new THREE.LoadingManager();

let camera, scene, renderer, object1, object2, loader;
let mixer1, mixer2;

const clock = new THREE.Clock();

init();

function init() {
    const container = document.getElementById('modelDemo');

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 7000);
    camera.position.set(2000, 1000, 2000);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xEDE0CC);

    // Ground
    // const mesh = new THREE.Mesh(
    //     new THREE.PlaneGeometry(4000, 4000),
    //     new THREE.MeshPhongMaterial({ color: 0xEDE0CC, depthWrite: false })
    // );
    // mesh.rotation.x = -Math.PI / 2;
    // mesh.receiveShadow = true;
    // scene.add(mesh);

    loader = new FBXLoader(manager);
    loadAsset('./models/Bibioteca.fbx', 1);  // Load first model
    // loadAsset('./models/Biblioteca.fbx', 2);  // Load second model


    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.85);
    renderer.setAnimationLoop(animate);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    document.querySelector(".model_viewer_instructions").style.right = window.innerWidth * 0.05 + "px";

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 200, 0);
    controls.minDistance = 700;
    controls.maxDistance = 5000;
    controls.update();

    window.addEventListener('resize', onWindowResize);
}

function loadAsset(asset, modelNumber) {
    loader.load(asset, function (group) {
        let object;
        let mixer;

        // Create a reference for the object and mixer based on model number
        if (modelNumber === 1) {
            object1 = group;
            mixer1 = new THREE.AnimationMixer(object1);
            object = object1;
            mixer = mixer1;
            // object1.position.set(-1000, 0, 1250);  // Position model 1 to the left
        } else if (modelNumber === 2) {
            object2 = group;
            mixer2 = new THREE.AnimationMixer(object2);
            object = object2;
            mixer = mixer2;
            object2.position.set(1000, -400, -1000);   // Position model 2 to the right
        }

        if (object) {
            if (object.animations && object.animations.length) {
                const action = mixer.clipAction(object.animations[0]);
                action.play();
            }

            object.traverse(function (child) {
                if (child.isMesh) {
                    // Apply wireframe material to meshes
                    child.material = new THREE.MeshBasicMaterial({
                        wireframe: true,
                        color: 0x000000  // Optional: Set wireframe color
                    });

                    child.castShadow = false;
                    child.receiveShadow = false;
                }
            });

            scene.add(object);
        }
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    const delta = clock.getDelta();

    // Update the animations for both models if they exist
    if (mixer1) mixer1.update(delta);
    if (mixer2) mixer2.update(delta);

    // Optional: Apply continuous rotation to both models
    if (object1) object1.rotation.y += 0.001;
    if (object2) object2.rotation.y += 0.001;

    renderer.render(scene, camera);
}