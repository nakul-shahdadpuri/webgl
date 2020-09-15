var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec2 vertTexCoord;',
'varying vec2 fragTexCoord;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'void main()',
'{',
'  gl_Position =  mProj * mView * mWorld * vec4(vertPosition, 1.0);',
'  fragTexCoord = vertTexCoord;',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'varying vec2 fragTexCoord;',
'uniform sampler2D sampler;',
'',
'void main()',
'{',
'  gl_FragColor = texture2D(sampler,fragTexCoord);',
'}'
].join('\n');


function main()
{
	let canvas = document.getElementById('webgl')
	let gl = canvas.getContext('webgl')

	gl.clearColor(0.5,0.85,0.87,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	let vertexShader = gl.createShader(gl.VERTEX_SHADER)
	let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

	gl.shaderSource(vertexShader,vertexShaderText);
	gl.shaderSource(fragmentShader,fragmentShaderText);

	gl.compileShader(vertexShader);
	gl.compileShader(fragmentShader);


	let program = gl.createProgram();
	gl.attachShader(program,vertexShader);
	gl.attachShader(program,fragmentShader);
	gl.linkProgram(program);


	let boxVertices = 
	[	//x,y ,z        u,v
		// Top
		-1.0, 1.0, -1.0,   0, 0,
		-1.0, 1.0, 1.0,    0, 1,
		1.0, 1.0, 1.0,     1, 1,
		1.0, 1.0, -1.0,    1, 0,

		// Left
		-1.0, 1.0, 1.0,    0, 0,
		-1.0, -1.0, 1.0,   1, 0,
		-1.0, -1.0, -1.0,  1, 1,
		-1.0, 1.0, -1.0,   0, 1,

		// Right
		1.0, 1.0, 1.0,    1, 1,
		1.0, -1.0, 1.0,   0, 1,
		1.0, -1.0, -1.0,  0, 0,
		1.0, 1.0, -1.0,   1, 0,

		// Front
		1.0, 1.0, 1.0,    1, 1,
		1.0, -1.0, 1.0,    1, 0,
		-1.0, -1.0, 1.0,    0, 0,
		-1.0, 1.0, 1.0,    0, 1,

		// Back
		1.0, 1.0, -1.0,    0, 0,
		1.0, -1.0, -1.0,    0, 1,
		-1.0, -1.0, -1.0,    1, 1,
		-1.0, 1.0, -1.0,    1, 0,

		// Bottom
		-1.0, -1.0, -1.0,   1, 1,
		-1.0, -1.0, 1.0,    1, 0,
		1.0, -1.0, 1.0,     0, 0,
		1.0, -1.0, -1.0,    0, 1,
	];

	let boxIndices = 
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23,
	];

	let boxVertexbufferObject = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER,boxVertexbufferObject)
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(boxVertices),gl.STATIC_DRAW)

	let boxIndexbufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,boxIndexbufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices),gl.STATIC_DRAW)

	let positionAttriblocation = gl.getAttribLocation(program,'vertPosition');
	let texCoordAttriblocation = gl.getAttribLocation(program,'vertTexCoord');

	gl.vertexAttribPointer(
		positionAttriblocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT,
		0
		);

		gl.vertexAttribPointer(
		texCoordAttriblocation,
		2,
		gl.FLOAT,
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT,
		3 * Float32Array.BYTES_PER_ELEMENT
		);

	gl.enableVertexAttribArray(positionAttriblocation);
	gl.enableVertexAttribArray(texCoordAttriblocation);

	//texture
	let boxTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D,boxTexture);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
	
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,
		gl.UNSIGNED_BYTE,
		document.getElementById('crate-image')
		);


	gl.bindTexture(gl.TEXTURE_2D,null);


	gl.useProgram(program);

	let matWorldUniformLocation = gl.getUniformLocation(program,'mWorld');
	let matViewUniformLocation = gl.getUniformLocation(program,'mView');
	let matProjUniformLocation = gl.getUniformLocation(program,'mProj');


	let worldMatrix = new Float32Array(16);
	let viewMatrix = new Float32Array(16);
	let projMatrix = new Float32Array(16);
	
	mat4.identity(worldMatrix);
	mat4.lookAt(viewMatrix,[0,0,-10],[0,0,0],[0,1,0]);
	mat4.perspective(projMatrix,glMatrix.toRadian(45),canvas.width/canvas.height,0.1,1000.0);

	gl.uniformMatrix4fv(matWorldUniformLocation,gl.FALSE,worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation,gl.FALSE,viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation,gl.FALSE,projMatrix);

	let angle = 0;
	let color = 0;
	let identitye = new Float32Array(16);
	mat4.identity(identitye);
	var loop = function(){
		angle = performance.now()/1000/6*2*Math.PI;

		mat4.rotate(worldMatrix,identitye,angle,[0,1,1])

		gl.uniformMatrix4fv(matWorldUniformLocation,gl.FALSE,worldMatrix)
		color = color + 0.01
		gl.clearColor(color/12,color/16,color/10,1.0)
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
		gl.bindTexture(gl.TEXTURE_2D,boxTexture);
		gl.activeTexture(gl.TEXTURE0)
		gl.drawElements(gl.TRIANGLES,boxIndices.length,gl.UNSIGNED_SHORT,0);

		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
	
} 