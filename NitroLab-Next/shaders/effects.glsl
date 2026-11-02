// Example fragment shader source (not automatically compiled)
precision mediump float; uniform float u_time; uniform vec2 u_resolution;
void main(){vec2 uv=gl_FragCoord.xy/u_resolution;gl_FragColor=vec4(uv.x,0.3+0.2*sin(u_time),uv.y,1.0);}
