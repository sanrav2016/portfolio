uniform float uTime;
uniform vec2 mouse;
uniform sampler2D prev;
uniform sampler2D current;
varying vec2 vUv;

void main() {
    vec4 prevVec = texture2D(prev, vUv);
    vec4 currentVec = texture2D(current, vUv);

    float dist = distance(vUv, mouse);
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    if(dist < 0.1) {
        gl_FragColor = vec4(1.0);
    }
    gl_FragColor += prevVec * 0.9;
}