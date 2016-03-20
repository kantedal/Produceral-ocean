var scene, camera, renderer, controls, ocean_plane, clock;
var composer, dofPass, multiPassBloomPass;

init();
animate();
render();

function init(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	camera.position.z = -10;
	camera.position.y = -15;
	camera.lookAt(new THREE.Vector3(0,0,-11));


	clock = new THREE.Clock();

	var ocean_geometry = new THREE.PlaneGeometry( 35, 35, 200, 200 );
	ocean_material = new THREE.ShaderMaterial( {
		uniforms: { 
	        time: { 
	            type: "f", 
	            value: 0.0 
	        }
	    },
	    vertexShader: document.getElementById( 'vertexWaterShader' ).textContent,
	    fragmentShader: document.getElementById( 'fragmentWaterShader' ).textContent
	} );
	ocean_material.side = THREE.DoubleSide;
	ocean_plane = new THREE.Mesh( ocean_geometry, ocean_material );
	scene.add( ocean_plane );

	var geometry   = new THREE.SphereGeometry(25, 32, 32)
	var skyMesh = new THREE.Mesh(geometry, ocean_material)
	scene.add(skyMesh);

	var map = THREE.ImageUtils.loadTexture("cloud.png");
    var cloud_material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true } );
     for(var c=0; c<10; c++){
        var angle = -Math.random()*Math.PI*2;
        var length = Math.sqrt(Math.random())*5;
        var x_val = Math.cos(angle)*length;
        var y_val = Math.sin(angle)*length;
        var z_val = 3 + Math.random()*5;
        var scale = 10*Math.random()*5;

        var new_cloud = new THREE.Sprite(cloud_material);
        new_cloud.position.set(x_val, y_val, z_val);
        new_cloud.scale.set(scale,scale,scale);
        scene.add(new_cloud);
    }

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set( 0, 1, 1 );
	scene.add( directionalLight );

	//var mtl_loader = new THREE.MTLLoader();
	//mtl_loader.setBaseUrl( 'obj/' );
	//mtl_loader.setPath( 'obj/' );
	//mtl_loader.load( 'boat.mtl', function( materials ) {
	//	materials.preload();
    //
	//	var obj_loader = new THREE.OBJLoader();
	//	obj_loader.setMaterials( materials );
	//	obj_loader.load(
	//		'obj/boat.obj',
	//		function ( object ) {
	//			object.scale.set(0.003,0.003,0.003);
	//			object.rotateZ(Math.PI/2);
	//			object.rotateX(Math.PI/2);
	//			object.position.set(0,-5,-1);
	//			object.position.set(0,-5,-1);
	//			scene.add( object );
	//	});
	//});

	composer = new WAGNER.Composer( renderer );
	composer.setSize( window.innerWidth, window.innerHeight ); // or whatever resolution
	//zoomBlurPass = new WAGNER.ZoomBlurPass();
	multiPassBloomPass = new WAGNER.MultiPassBloomPass();
	dofPass = new WAGNER.DOFPass();

}

function animate(){
	requestAnimationFrame( animate );
	var time = clock.getElapsedTime();

	camera.position.set(Math.sin(time)*0.4, -15 + Math.cos(time)*0.1, 0.3 + Math.sin(time)*0.4);

	ocean_material.uniforms[ 'time' ].value = time;
}

function render(){
	requestAnimationFrame( render );
	//renderer.render(scene, camera);

	renderer.autoClearColor = true;
	composer.reset();
	composer.render( scene, camera );
	//composer.pass( multiPassBloomPass );
	//composer.pass( dofPass );
	composer.toScreen();
}