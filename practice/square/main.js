let vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'',
'void main()',
'{',
'  gl_Position = vec4(vertPosition, 0.0, 1.0);',
'}'
].join('\n');

let fragmentShaderText =
[
'precision mediump float;',
'varying vec3 fragColor;',
'',
'void main()',
'{',
'  gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);',
'}'
].join('\n');

let squareVertices = 
	[
		//x,y	
		0,0.5,
		0.5,0,
		0,0,
		0.5,0.5,

	]
let squareIndices = 
	[
		0,1,2,
		0,3,1,

	]

function main()
{
	let cavas = document.getElementById('canvas')
	let gl = canvas.getContext('webgl')

	console.log(gl)
	canvas_setup(gl);
	let program = load_shaders(gl);
	gl.linkProgram(program);

	buffers(program,gl,squareVertices,squareIndices);

	inputing(program,gl);
	draw(gl,squareIndices);

}

function canvas_setup(gl){

	gl.clearColor(0.5,0.85,0.2,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

function load_shaders(gl){
	
	let vertexShader = gl.createShader(gl.VERTEX_SHADER)
	let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

	gl.shaderSource(vertexShader,vertexShaderText);
	gl.shaderSource(fragmentShader,fragmentShaderText);

	gl.compileShader(vertexShader);
	gl.compileShader(fragmentShader);

	
	let program = gl.createProgram();
	gl.attachShader(program,vertexShader);
	gl.attachShader(program,fragmentShader);
	return program
}

function buffers(program,gl,squareVertices){

	let squareVertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,squareVertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(squareVertices),gl.STATIC_DRAW);


	let squareIndicesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,squareIndicesBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(squareIndices),gl.STATIC_DRAW);

}

function inputing(program,gl){
	let positionAttriblocation = gl.getAttribLocation(program,'vertPosition');
	gl.vertexAttribPointer(
		positionAttriblocation,
		2,
		gl.FLOAT,
		gl.FALSE,
		2 * Float32Array.BYTES_PER_ELEMENT,
		0
		);
	gl.enableVertexAttribArray(positionAttriblocation);
	gl.useProgram(program);
}

function draw(gl)
{
	gl.drawElements(gl.TRIANGLES,squareIndices.length,gl.UNSIGNED_SHORT,0);
}