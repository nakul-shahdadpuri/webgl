var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'',
'void main()',
'{',
'  gl_Position = vec4(vertPosition, 0.0, 1.0);',
'  fragColor = vertColor;',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'varying vec3 fragColor;',
'',
'void main()',
'{',
'  gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');


function main()
{
	let canvas = document.getElementById('webgl')
	let gl = canvas.getContext('webgl')

	gl.clearColor(0.5,0.85,0.87,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


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


	let triangleVertex = 
	[	//x,y     //rgb
		0.0,0.5,	1.0,0.0,0.0,
		-0.5,-0.5,	0.7,1.0,0.2,
		0.5,-0.5,	0.2,0.7,1.0
	];

	let triangleVertexbuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER,triangleVertexbuffer)
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(triangleVertex),gl.STATIC_DRAW)

	let positionAttriblocation = gl.getAttribLocation(program,'vertPosition');
	let colorAttriblocation = gl.getAttribLocation(program,'vertColor');

	gl.vertexAttribPointer(
		positionAttriblocation,
		2,
		gl.FLOAT,
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT,
		0
		);

		gl.vertexAttribPointer(
		colorAttriblocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT,
		2 * Float32Array.BYTES_PER_ELEMENT
		);

	gl.enableVertexAttribArray(positionAttriblocation);
	gl.enableVertexAttribArray(colorAttriblocation);


	gl.useProgram(program);
	gl.drawArrays(gl.TRIANGLES,0,3);
} 