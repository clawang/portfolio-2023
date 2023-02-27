import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

let camera, scene, renderer;
let logo, oval;

await init();
// render();

async function init() {

	// const container = document.createElement( 'div' );
	// document.body.appendChild( container );

	renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	//renderer.setClearColor( 0xffffff, 0 ); // the default
	//renderer.physicallyCorrectLights = true
	renderer.shadowMap.enabled = true
	//renderer.outputEncoding = THREE.sRGBEncoding

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.set(0, 0, 0);

	let loader = new THREE.TextureLoader();
    loader.setCrossOrigin("");

	let bgTexture = await loader.load("./media/clouds-2.jpg");
	scene.background = bgTexture;
	const targetWidth = window.innerWidth;
	const targetHeight = window.innerHeight;
	const imageWidth = 1920;
	const imageHeight = 1276;
	const targetAspect = targetWidth / targetHeight;
	const imageAspect = imageWidth / imageHeight;
	const factor = imageAspect / targetAspect;
	// When factor larger than 1, that means texture 'wilder' than target。 
	// we should scale texture height to target height and then 'map' the center  of texture to target， and vice versa.
	scene.background.offset.x = factor > 1 ? (1 - 1 / factor) / 2 : 0;
	scene.background.repeat.x = factor > 1 ? 1 / factor : 1;
	scene.background.offset.y = factor > 1 ? 0 : (1 - factor) / 2;
	scene.background.repeat.y = factor > 1 ? 1 : factor;
	//scene.background = new THREE.Color(0xffffff);

	const light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( light );
	const spotLight = new THREE.SpotLight( 0xffffff );
	spotLight.position.set( 100, 1000, 100 );
	scene.add(spotLight);
	const spotLight2 = new THREE.SpotLight( 0xffffff );
	spotLight2.position.set( 100, 100, 100 );
	scene.add(spotLight2);

	camera.position.z = 3;

	new RGBELoader()
		.setPath( './' )
		.load( './media/clouds-2.hdr', function ( texture ) {

			texture.mapping = THREE.EquirectangularReflectionMapping;

			//scene.background = texture;
			scene.environment = texture;
		});

	const gltfLoader = new GLTFLoader().setPath( 'models/' );
	const logoGltf = await gltfLoader.loadAsync( 'logo-vertical.glb');
	//const ovalGltf = await gltfLoader.loadAsync( 'oval.glb');

	logo = logoGltf.scene;
	//oval = ovalGltf.scene;
	// logo.rotation.y = 49.9;
	// logo.rotation.x = 0.1;

	scene.add(logo);
	scene.add(oval);
	//console.log(logo);
	
	document.getElementById('container').appendChild( renderer.domElement );

	animate();

	window.addEventListener( 'resize', onWindowResize );

}

function animate() {
	requestAnimationFrame( animate );

	logo.rotation.y += 0.01;
	//oval.rotation.y += 0.01;

	renderer.render( scene, camera );
};

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	render();

}

function render() {

	renderer.render( scene, camera );
	//animate();

}