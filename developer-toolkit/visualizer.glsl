// Example fragment shader for future WebGL effects, not loaded by default.
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){vec2 p=(gl_FragCoord.xy/u_resolution.xy)*2.0-1.0;float rings=sin(14.0*length(p)-u_time*2.0);vec3 c=mix(vec3(0.08,0.03,0.2),vec3(0.3,0.75,0.9),0.5+0.5*rings);gl_FragColor=vec4(c,1.0);}
