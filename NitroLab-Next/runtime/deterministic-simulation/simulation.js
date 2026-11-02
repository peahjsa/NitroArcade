// Fixed-step movement demo, independent of display refresh rate.
export function simulate({x=0,velocity=1,steps=60,dt=1/60}={}){for(let i=0;i<steps;i++)x+=velocity*dt;return x}
