var container;

var camera, scene, renderer, ledMaterialA, ledMaterialA2, ledMaterialB, ledMaterialB2, leds, sounds;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

    sounds = new Array();
    sounds[0] = new Howl({src: ['sounds/1.wav']});
    sounds[1] = new Howl({src: ['sounds/2.wav']});
    sounds[2] = new Howl({src: ['sounds/3.wav']});
    sounds[3] = new Howl({src: ['sounds/4.wav']});
    sounds[4] = new Howl({src: ['sounds/5.mp3']});
    sounds[5] = new Howl({src: ['sounds/6.wav']});

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.x = 4;
	camera.position.y = -15;
	camera.position.z = 25;
	camera.lookAt( new THREE.Vector3( 1.2, -0.4, 0 ) );

	// scene

	scene = new THREE.Scene();

	//var ambient = new THREE.AmbientLight( 0x050505 );
	//scene.add( ambient );

	ledMaterialA = new THREE.MeshPhongMaterial({color: 0x006600, specular: 0x111111, shininess: 150, transparent: true, opacity: 0.4});
	ledMaterialA2 = new THREE.MeshPhongMaterial({color: 0x00ff00, specular: 0x111111, shininess: 500, transparent: true, opacity: 0.6, emissive: 0x44ff00});
	ledMaterialB = new THREE.MeshPhongMaterial({color: 0x664400, specular: 0x111111, shininess: 150, transparent: true, opacity: 0.4});
	ledMaterialB2 = new THREE.MeshPhongMaterial({color: 0xff6600, specular: 0x111111, shininess: 500, transparent: true, opacity: 0.6, emissive: 0xff6600});

	var spotLight = new THREE.SpotLight( 0xffeedd, 1.6, 300 );
	spotLight.position.set( -30, -50, 30 );
	spotLight.castShadow = true;
	scene.add( spotLight );

	var plane = new THREE.PlaneBufferGeometry( 100, 80 );
	var material = new THREE.MeshPhongMaterial({color: 0xd45354, specular: 0x111111, shininess: 0});
	var planeM = new THREE.Mesh( plane, material );
	scene.add(planeM);

	var loader = new THREE.FontLoader();
	var font = loader.load('https://threejs.org/examples/fonts/droid/droid_sans_regular.typeface.json',
		function ( font ) {
			var opts = {
				font: font,
				size: 1,
				height: 0.001,
				curveSegments: 4,
				bevelThickness: 0.01,
				bevelSize: 0.05,
				bevelSegments: 3,
				bevelEnabled: true,
				material: 1,
				extrudeMaterial: 1
			};
			var textGeo1 = new THREE.TextGeometry( "PLACENÉ", opts);
			var mat = new THREE.MeshPhongMaterial({color: 0xd45354, specular: 0x111111, shininess: 100});
			var m1 = new THREE.Mesh( textGeo1, mat );
			m1.position.x = -11.5;
			m1.position.y = -7;
			scene.add( m1 );

			var textGeo2 = new THREE.TextGeometry( "FREE", opts);
			//var mat = new THREE.MeshPhongMaterial({color: 0x8e4418, specular: 0x111111, shininess: 100});
			var m2 = new THREE.Mesh( textGeo2, mat );
			m2.position.x = 7.4;
			m2.position.y = -7;
			scene.add( m2 );
		}
	);

	// texture

	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {

		console.log( item, loaded, total );

	};

	var texture = new THREE.Texture();

	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};

	var onError = function ( xhr ) {
	};

	var pos = new Array(4*7*9);
	for (x = 0; x < 4*7; x++) {
		for (y = 0; y < 9; y++) {
			pos[y*4*7+x] = [x-14, y-5];
		}
	}
	var loader = new THREE.STLLoader( manager );
	loader.load( './led.stl', function ( geometry ) {

		var mesh = new THREE.Mesh(geometry, ledMaterialA);
		mesh.castShadow = true;
		mesh.receiveShadow = true;

		leds = new Array(pos.length);
		var maxlights = 5;
		for (i = 0; i < pos.length; i++) {
			leds[i] = mesh.clone();
			leds[i].material = getMat(i, false);
			leds[i].position.x = pos[i][0] + (i%(4*7) < 2*7 ? -1 : 2);
			leds[i].position.y = pos[i][1];
			leds[i].position.z = -2.45;
			scene.add(leds[i]);
		}

	}, onProgress, onError );

	renderer = new THREE.WebGLRenderer({ maxLights: 4*7*9+10 });
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

var frame = 0, counter = 20, num = "0000", type = 0, refresh = 0;
readStats();
function animate() {
	if (frame++ >= 10) {
		switch (type) {
			case 1:
				animation1();
				break;
			case 3:
				animation3();
				break;
			case 2:
				animation2();
				break;
			case 4:
				animation4();
				break;
			default:
				animation0();
		}
		frame = 0;
	}
	requestAnimationFrame( animate );
	render();

}

function animation0() {
	if (counter > 8) {
		counter--;
	} else if (counter > 0) {
		var rnd = "";
		for (i = 0; i < 4; i++) {
			rnd += String.fromCharCode(48 + Math.random() * 9);
		}
		rnd = rnd.substring(0, counter) + num.substring(counter);
		lightUpStr1(rnd);
		counter--;
	} else {
		finish();
	}
}

function animation1() {
	if (counter > 4*7) {
		counter--;
	} else if (counter > 0) {
		lightUpStr2(num, counter);
		counter--;
	} else {
		finish();
	}
}

function animation2() {
	if (counter > 8) {
		counter--;
	} else if (counter > 0) {
		lightsX(counter>4);
		counter--;
	} else {
		finish();
	}
}

function animation3() {
	if (counter > 8) {
		counter--;
	} else if (counter > 0) {
		if (counter %2 == 1) {
			lightsOff();
		} else {
			lightUpStr1(num);
		}
		counter--;
	} else {
		finish();
	}
}

function animation4() {
	if (counter > 8) {
		counter--;
	} else if (counter > 0) {
		lightsY(counter %2 == 1);
		counter--;
	} else {
		finish();
	}
}

function finish() {
	lightUpStr1(num);
	counter = 40;
	type = (type > 2 ? 0 : type + 1);
	if (refresh++ == 5) {
		readStats();
		refresh = 0;
	}
}

function lightsOff() {
	for (var i = 0; i < 4*7*9; i++) {
		leds[i].material = getMat(i, false);
	}
}

function lightsX(isOn) {
	for (var i = 0; i < 4*7*9; i++) {
		leds[i].material = getMat(i, i%2==(isOn?1:0));
		if (i%(4*7)==(4*7-1)) {
			isOn = !isOn;
		}
	}
}

function lightsY(isOn) {
	for (var i = 0; i < 4*7*9; i++) {
		leds[i].material = getMat(i, i%2==(isOn?1:0));
	}
}

function getMat(pos, on) {
    var type = pos%(4*7) < 2*7;
    return type ? (on ? ledMaterialA2 : ledMaterialA) : (on ? ledMaterialB2 : ledMaterialB);
}

function lightUpStr1(str) {
	lightsOff();
	for (var i = 0; i < str.length; i++) {
		lightUp(i, 0, parseInt(str.charAt(i)));
	}
}

function lightUpStr2(str, off) {
	lightsOff();
	for (var i = 0; i < str.length; i++) {
		lightUp(i, off, parseInt(str.charAt(i)));
	}
}

function lightUp(pos, offX, num) {
	var number = numbers[num];
	var on = 0;
	for (var i = 0; i < 7; i++) {
		for (var j = 0; j < 9; j++) {
			var idx = pos*7 + offX + j*4*7 + i;
			if (pos*7 + offX + i >= 4*7) {
				continue;
			}
			if (idx < 0 || idx >= leds.length) {
				continue;
			}
			if (number[8-j][i]>0) {
				leds[idx].material = getMat(idx, true);
			}
		}
	}
}

function render() {
	renderer.render( scene, camera );
}

function readStats() {
	console.log("reading");
	$.ajax({
		url: "http://localhost:8080/proxy.php"
	}).done(function(data) {
		var free = new String(data.countOfNewFreePlaceOrders);
		while(free.length<2) free = "0" + free;
		var paid = new String(data.countOfNewPaidPlaceOrders);
		while(paid.length<2) paid = "0" + paid;
		var tmp = paid + free;
		if (tmp != num) {
		    rnd = Math.round(Math.random() * sounds.length);
            sounds[rnd].play();
		}
		num = tmp;
	});
}
