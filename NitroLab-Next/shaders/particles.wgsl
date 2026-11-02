struct Uniforms { time: f32, aspect: f32, padding0: f32, padding1: f32 }; @group(0) @binding(0) var<uniform> uniforms: Uniforms;
@vertex fn vs(@builtin(vertex_index) i: u32)->@builtin(position) vec4f {var points=array<vec2f,3>(vec2f(-1.,-1.),vec2f(3.,-1.),vec2f(-1.,3.));return vec4f(points[i],0.,1.);}
@fragment fn fs(@builtin(position) p:vec4f)->@location(0) vec4f {let v=sin(p.x*0.02+uniforms.time)*cos(p.y*0.02-uniforms.time);return vec4f(0.18+v*0.12,0.08,0.38+v*0.2,1.);}
