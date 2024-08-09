uniform float uTime;
uniform vec2 mouse;
uniform sampler2D prev;
uniform bool mouseMove;
varying vec2 vUv;

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5433);
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);
    float res = mix(
        mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x), 
        mix(rand(ip+vec2(0.0, 1.0)), rand(ip+vec2(1.0,1.0)), u.x),
        u.y
        );
    return res*res;
}

float fbm(vec2 x, int numOctaves) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100);

    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < numOctaves; ++i) {
        v += a * noise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

float blendDarken(float base, float blend) {
    return min(blend, base);
}
vec3 blendDarken(vec3 base, vec3 blend) {
    return vec3(blendDarken(base.r, blend.r), blendDarken(base.g, blend.g), blendDarken(base.b, blend.b));
}

vec3 blendDarken(vec3 base, vec3 blend, float opacity) {
    return (blendDarken(base, blend) * opacity + base * (1.0 - opacity));
}

vec3 hsl2rgb(vec3 hsl) {
    float h = hsl.x; // Hue
    float s = hsl.y; // Saturation
    float l = hsl.z; // Lightness

    float c = (1.0 - abs(2.0 * l - 1.0)) * s; // Chroma
    float x = c * (1.0 - abs(mod(h * 6.0, 2.0) - 1.0)); // Intermediate value
    float m = l - c * 0.5; // Offset

    vec3 rgb;

    if (h < 1.0 / 6.0) {
        rgb = vec3(c, x, 0.0);
    } else if (h < 2.0 / 6.0) {
        rgb = vec3(x, c, 0.0);
    } else if (h < 3.0 / 6.0) {
        rgb = vec3(0.0, c, x);
    } else if (h < 4.0 / 6.0) {
        rgb = vec3(0.0, x, c);
    } else if (h < 5.0 / 6.0) {
        rgb = vec3(x, 0.0, c);
    } else {
        rgb = vec3(c, 0.0, x);
    }

    return rgb + vec3(m, m, m);
}

void main() {
    vec4 prevVec = texture2D(prev, vUv);

    float dist = distance(vUv, mouse);
    float disp = fbm(vUv * 22.0, 10) * 0.001;

    vec4 texel2 = texture2D(prev, vUv + vec2(disp, 0));
    vec4 texel3 = texture2D(prev, vUv + vec2(-disp, 0));
    vec4 texel4 = texture2D(prev, vUv + vec2(0, disp));
    vec4 texel5 = texture2D(prev, vUv + vec2(0, -disp));
    vec3 floodColor = prevVec.rgb;
    floodColor = blendDarken(floodColor, texel2.rgb);
    floodColor = blendDarken(floodColor, texel3.rgb);
    floodColor = blendDarken(floodColor, texel4.rgb);
    floodColor = blendDarken(floodColor, texel5.rgb);

    vec3 watercolor = mix(vec3(1), floodColor, 0.99);
    gl_FragColor = vec4(watercolor, 0.5);
    vec3 gradient = hsl2rgb(vec3(fract(uTime*0.1), 0.7, 0.5));
    if(dist < disp * 100. + 0.005 && mouseMove) {
        gl_FragColor = vec4(gradient, 1.0);
    }
}