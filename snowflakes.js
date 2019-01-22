'use strict';

(function main() {
	const canvas = document.createElement('canvas');

	// function onResize() {
	// 	canvas.height = window.innerHeight;
	// 	canvas.width = window.innerWidth;
	// }
	// onResize();
	// window.addEventListener('resize', onResize);

	canvas.height = 500;
	canvas.width = 500;

	document.body.appendChild(canvas);
	const gl = canvas.getContext('webgl');
	console.log(gl);

	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
	gl.clearColor(0, 0, 0, 1);
	gl.viewport(0, 0, canvas.height, canvas.width);

	// const vertexShaderText = fetch('vertexShader.glsl').then(resp => resp.text());
	const vertexShaderText = `
	attribute vec2 coords;

	void main() {
		gl_Position = vec4(coords, 0, 1);
		gl_PointSize = 10.0;
	}`;
	const vert = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vert, vertexShaderText);
	gl.compileShader(vert);
	console.log(gl.getShaderInfoLog(vert));

	// const fragmentShaderText = fetch('fragmentShader.glsl').then(resp => resp.text());
	const fragmentShaderText = `
	precision highp float;

	void main() {
		gl_FragColor = vec4(1, 1, 1, 1);
	}`;
	const frag = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(frag, fragmentShaderText);
	gl.compileShader(frag);
	console.log(gl.getShaderInfoLog(frag));

	const prog = gl.createProgram();
	console.log(prog);

	gl.attachShader(prog, vert);
	gl.attachShader(prog, frag);

	gl.linkProgram(prog);
	gl.useProgram(prog);

	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.POINTS, 0, 1);

	window.webglIsFun = {
		drawTriangle: function() {
			const triangleArray = [
				0.0, 0.5,
				0.5, -0.5,
				-0.5, -0.5,
			];
			const posAttribLocation = gl.getAttribLocation(prog, 'coords');

			gl.vertexAttribPointer(
					posAttribLocation,
					2,
					gl.FLOAT,
					gl.FALSE,
					2 * Float32Array.BYTES_PER_ELEMENT,
					0 * Float32Array.BYTES_PER_ELEMENT,
				);
			gl.enableVertexAttribArray(posAttribLocation);
			
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleArray), gl.DYNAMIC_DRAW);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		},

		drawLine: function(animate) {
			const coords = [-1, -1, 1, 1];
			const vectors = [false, false, true, true];
			const posAttribLocation = gl.getAttribLocation(prog, 'coords');

			gl.vertexAttribPointer(
					posAttribLocation,
					2,
					gl.FLOAT,
					gl.FALSE,
					2 * Float32Array.BYTES_PER_ELEMENT,
					0 * Float32Array.BYTES_PER_ELEMENT,
				);
			gl.enableVertexAttribArray(posAttribLocation);
			
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.DYNAMIC_DRAW);
			gl.drawArrays(gl.LINE_STRIP, 0, 2);

			if (animate) {
				function rotateLine() {
					for (let i = 0; i <= coords.length - 1; i += 2) {
						let elem = coords[i];
						const canIncrease = vectors[i]; 
						if (canIncrease && elem < 1) {
							coords[i] += 0.05;
						} else if (!canIncrease && elem > -1) {
							coords[i] += -0.05;
						} else if (canIncrease && elem >= 1) {
							vectors[i] = false;
							coords[i] += -0.05;
						} else if (!canIncrease && elem <= -1) {
							vectors[i] = true;
							coords[i] += 0.05;
						}
					}
					gl.clear(gl.COLOR_BUFFER_BIT);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.DYNAMIC_DRAW);
					gl.drawArrays(gl.LINE_STRIP, 0, 2);
					requestAnimationFrame(rotateLine);
				}
				rotateLine();
			}
		},

		startFalling: function() {
			requestAnimationFrame(() => {

			})
		},

		redraw: function() {
			gl.clear(gl.COLOR_BUFFER_BIT);
			setTimeout(() => {
				gl.drawArrays(gl.POINTS, 0, 1);
			}, 1000);
		}
	}
})()
