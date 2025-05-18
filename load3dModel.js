import * as THREE from './three.module.js';

import { OrbitControls } from './OrbitControls.js';
import { FBXLoader } from './FBXLoader.js';

const manager = new THREE.LoadingManager();

let camera, scene, renderer, object, loader;
let mixer;

const clock = new THREE.Clock();

init();

function init() {
	const container = document.getElementById('modelDemo');

	camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 5000);
	camera.position.set(2000, 2000, 2000);

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xEDE0CC );
// 		scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

// 		const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444, 0.5 );
// 		hemiLight.position.set( 0, 200, 0 );
// 		scene.add( hemiLight );

// 		const dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
// 		dirLight.position.set( 0, 200, 100 );
// 		dirLight.castShadow = true;
// 		dirLight.shadow.camera.top = 180;
// 		dirLight.shadow.camera.bottom = - 100;
// 		dirLight.shadow.camera.left = - 120;
// 		dirLight.shadow.camera.right = 120;
// 		scene.add( dirLight );

	// scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

	// ground
	const mesh = new THREE.Mesh( new THREE.PlaneGeometry(4000, 4000), new THREE.MeshPhongMaterial( { color: 0xEDE0CC, depthWrite: false } ) );
	mesh.rotation.x = - Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add( mesh );

// 		const grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
// 		grid.material.opacity = 0.2;
// 		grid.material.transparent = true;
// 		scene.add( grid );

	loader = new FBXLoader( manager );
	loadAsset( './models/Bibioteca.fbx' );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight - (window.innerHeight * 0.15));
	renderer.setAnimationLoop(animate);
	renderer.shadowMap.enabled = true;
	container.appendChild(renderer.domElement);

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.target.set( 0, 200, 0 );
	controls.minDistance = 700;
    controls.maxDistance = 4000;
	controls.update();

	window.addEventListener( 'resize', onWindowResize );
}

function loadAsset(asset) {
	loader.load(asset, function (group) {
		if (object) {
			object.traverse(function (child) {
				if (child.material) {
					const materials = Array.isArray(child.material) ? child.material : [ child.material ];
					materials.forEach(material => {
						if (material.map) material.map.dispose();
						material.dispose();
					});
				}
				if (child.geometry) child.geometry.dispose();

			});
			scene.remove(object);
		}

		object = group;
		
		if (object.animations && object.animations.length) {
			mixer = new THREE.AnimationMixer(object);

			const action = mixer.clipAction(object.animations[0]);
			action.play();
		} else mixer = null;

		object.traverse(function (child) {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});

		scene.add(object);
	});
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  const delta = clock.getDelta();

  if (mixer) mixer.update(delta);

  // 🔁 Apply continuous rotation
  if (object) object.rotation.y += 0.001;

  renderer.render(scene, camera);
}