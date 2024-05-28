uniform float uTime;
uniform float uProgress;
uniform vec4 uResolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.1415926535

void main() {
    vec4 color = texture2D(1.0, 1.0, 0.8, 1.0)
    gl_FragColor = color;
}