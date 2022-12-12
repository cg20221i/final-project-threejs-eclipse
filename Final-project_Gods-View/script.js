import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";

import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer;

let earth, earthRevolutionCount = 0,
    moon, moonRevolutionCount = 0;
let earthPosition = 600;
let moonPosition = 200;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        45,
        30000
    );
    camera.position.set(-900, 0, 0);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", renderer);
    controls.minDistance = 50;
    controls.maxDistance = 2500;

    let skyboxTexture = new THREE.TextureLoader().load("space.jpg");
    skyboxTexture.wrapS = THREE.RepeatWrapping;
    skyboxTexture.repeat.x = -1;
    const skyboxMaterial = new THREE.MeshBasicMaterial({
        map: skyboxTexture
    });
    skyboxMaterial.side = THREE.BackSide;
    let skyboxGeo = new THREE.SphereGeometry(5000, 64, 32);
    let skybox = new THREE.Mesh(skyboxGeo, skyboxMaterial);
    scene.add(skybox);

    const sunGeo = new THREE.SphereGeometry(100, 64, 32);
    const sunTexture = new THREE.TextureLoader().load("sun/sun.jpg");
    const sunMaterial = new THREE.MeshBasicMaterial({
        map: sunTexture
    });
    const sun = new THREE.Mesh(sunGeo, sunMaterial);
    scene.add(sun);

    const moonGeo = new THREE.SphereGeometry(40, 64, 32);
    const moonTexture = new THREE.TextureLoader().load("earth/moon.jpg");
    const moonMaterial = new THREE.MeshBasicMaterial({
        map: moonTexture
    });
    moon = new THREE.Mesh(moonGeo, moonMaterial);
    moon.position.set(400, 0, 0);
    scene.add(moon);

    const earthGeo = new THREE.SphereGeometry(60, 64, 32);
    const earthTexture = new THREE.TextureLoader().load("earth/earth.png");
    const earthMaterial = new THREE.MeshBasicMaterial({
        map: earthTexture
    });
    earth = new THREE.Mesh(earthGeo, earthMaterial);
    earth.position.set(600, 0, 0);
    scene.add(earth);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);


    animate();
}

function animate() {
    earth.position.x = earthPosition * Math.sin(earthRevolutionCount);
    earth.position.z = earthPosition * Math.cos(earthRevolutionCount);
    earthRevolutionCount += 0.001;
    moon.position.x = earth.position.x + (moonPosition * Math.sin(moonRevolutionCount));
    moon.position.z = earth.position.z + (moonPosition * Math.cos(moonRevolutionCount));
    moonRevolutionCount += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

}
init();