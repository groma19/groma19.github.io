const VERTEX_SHADER = `
    attribute vec4 a_Position;
    attribute float a_PointSize;

    void main() {
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
    }
`;

const FRAGMENT_SHADER = `
    precision mediump float;
    uniform vec4 u_FragColor;

    void main() {
        gl_FragColor = u_FragColor;
    }
`;

main();

function main() {
    const canvas = document.getElementById("webgl-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const gl = canvas.getContext("webgl");
    
    initShaders(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    
    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    let a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
    let u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
    
    let r = 46 / 255.0,
        g = 45 / 255.0,
        b = 43 / 255.0;
    gl.clearColor(r, g, b, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    makeRandomPoints(gl, a_Position, a_PointSize, u_FragColor);
}

function makeRandomPoints(gl, a_Position, a_PointSize, u_FragColor) {
    const POINT_SCALE = 20.0;
    const POINTS_NUM = 55;

    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let i = 0; i < POINTS_NUM; i++) {
        let x = 1 - 2 * Math.random(),
            y = 1 - 2 * Math.random();
    
        let sizeX = Math.abs(x),
            sizeY = Math.abs(y);
        let pointSize = Math.min(Math.max(1.0 / (sizeX + sizeY) / 2.0, 1.0), POINT_SCALE/8) * POINT_SCALE;
    
        gl.vertexAttrib3f(a_Position, x, y, 0.0);
        gl.vertexAttrib1f(a_PointSize, pointSize);
    
        let yelowness = 1.0 / (sizeX + sizeY) / 2.0;
        gl.uniform4f(u_FragColor, yelowness, yelowness, 0.0, 1.0);
        
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

function initShaders(gl, vShader, fShader) {
    let program = createProgram(gl, vShader, fShader);

    gl.useProgram(program);
    gl.program = program;
}

function createProgram(gl, vShader, fShader) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vShader);
    let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fShader);

    let program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    return program;
}

function loadShader(gl, type, source) {
    let shader = gl.createShader(type);
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    return shader;
}