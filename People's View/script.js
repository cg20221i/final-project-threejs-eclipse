console.clear();

var renderCalls = [];
function render () {
  requestAnimationFrame( render );
  renderCalls.forEach((callback)=>{ callback(); });
}
render();

/*////////////////////////////////////////*/

var scene, renderer, orbit, light;

/*////////////////////////////////////////*/


var camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 10, 1000 );

camera.position.z = 800;



/*////////////////////////////////////////*/
const loader = new THREE.TextureLoader(); // untk background
const bgTexture = loader.load('langit.jpg');

scene = new THREE.Scene();
scene.fog =  new THREE.FogExp2( 0x000000, 0.0005);//new THREE.Fog(0xEEEEEE, 20, 600);
scene.background = bgTexture;
renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = Math.pow( 0.91, 7 ); //untuk bekgron makin gelap/terang

window.addEventListener( 'resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}, false );

document.body.appendChild( renderer.domElement);

renderCalls.push(function(){ renderer.render( scene, camera ); });

function TrackPointer(callback){

  var frame;
  var pointer = {
    cx: 0,
    cy: 0,
    px: 0,
    py: 0,
    track: function(e){
      e = e.touches ? e.touches[0] : e;
      pointer.cx = ((e.clientX / window.innerWidth) - 0.5) * 2;
      pointer.cy = ((e.clientY / window.innerHeight) - 0.5) * 2;
      pointer.px = e.clientX;
      pointer.py = e.clientY;
      frame = frame || requestAnimationFrame(update);
    },
  };
  
  callback = (callback || function(){});

  function update(){
    frame = null;
    callback(pointer);
  }

  document.addEventListener('mousemove',pointer.track);

  return pointer;

}

var center = new THREE.Vector3(0,1,0);
camera.lookAt(center);

var pointer = TrackPointer(updateCamera);
function ease(current,target,ease){ return current + (target - current) * ( ease || 0.2 ); }
function updateCamera(pointer){
  camera.position.x = ease(camera.position.x, pointer.cx * 10, 0.1);
  camera.position.y = ease(camera.position.y, pointer.cy * 10, 0.1);
  camera.lookAt(center);
}
updateCamera(pointer);

var light = new THREE.DirectionalLight();
light.position.set( 25, 25, 1);
scene.add(light);

/*////////////////////////////////////////*/


function makeSun(){

  var geometry = new THREE.SphereGeometry( 100, 32, 32 );
  
  var customMaterial = new THREE.ShaderMaterial({
    uniforms: { t: { value: 0.1 } },
    vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  });
  
  renderCalls.push(function(){
    customMaterial.uniforms.t.value += 0.02;
  });

  let sun = new THREE.Mesh( geometry, customMaterial );
  
  // sun.position.set(-500,270,100);
  sun.castShadow = true;
  return sun;
}

var sun = makeSun();
scene.add( sun );




/*////////////////////////////////////////*/

function makeMoon(size, distance, color, speed){
  
  size = size || 30,
  distance = distance || 400;
  speed = speed || 0.001;
  color = color || 0x6DECB9;

  let pivot = new THREE.Group();
  var geometry = new THREE.SphereGeometry( size, 16, 16 );
  var material = new THREE.MeshLambertMaterial({
    color: color,
    reflectivity: 6,
  });

  let planet = new THREE.Mesh( geometry, material );
  pivot.add(planet);
  planet.position.z = distance;

  return pivot;
}

var moon = makeMoon(40, 400, 0x000000);
//planet.rotation.x = Math.PI/7;
scene.add(moon);


TweenMax.from(moon.rotation, 0.1, {
    y: -0.2,
    ease: Expo.easeOut
});
var tl = new TimelineMax({ repeat: -1, yoyo: true })

tl.from(moon.rotation, 4, {
    y: -0.2,
    ease: Expo.easeInOut
});

tl.to(moon.rotation, 4, {
    y: 0.2,
    ease: Expo.easeInOut
});


/*////////////////////////////////////////*/

function makeStars() {

  let starMaterial = new THREE.PointsMaterial({
    size: 2,
    blending: THREE.AdditiveBlending
  });

  let geometry = new THREE.SphereGeometry(1400, 80, 80, 0, Math.PI * 2);
  for (let i = 0, len = geometry.vertices.length; i < len; i++){
    let vertex = geometry.vertices[i];
    vertex.x += Math.random() * -200;
    vertex.y += Math.random() * -200;
    vertex.z += Math.random() * -100;
  }

  geometry.verticesNeedUpdate = true;
  geometry.normalsNeedUpdate = true;
  geometry.computeFaceNormals(); 

  return new THREE.Points(geometry, starMaterial);
}

let stars = makeStars()
scene.add(stars);
