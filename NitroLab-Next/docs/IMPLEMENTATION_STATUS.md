# Implementation status (2026-10-30)

## Offline playable prototypes
Goat Chaos Sandbox (bundled Three.js), Nitro Clicker, Neon Dodge, Pixel Catcher, and NEW Maze Runner. These are small original prototypes, not commercial-scale games.

## Online iframe launchers
Capybara Clicker and NEW Fun Clicker. Both require the team to enter a verified embeddable URL and require internet. The games themselves are not copied or bundled.

## Implemented small code modules
Canvas NitroEngine, ECS scheduler, seeded maze generator, fixed-step simulation, tiny arithmetic compiler, bytecode VM, binary serialization, object pool, dependency graph, reactive store, GLSL/WGSL source, JSON API, optional Node API, optional WebSocket gateway (requires npm ws), Python catalog worker, PHP catalog endpoint, binary packer, Rust/C++ examples. Some are demonstration-sized and need integration/testing.

## Not finished or bundled
Fully offline second NES core supporting mapper 40; complete WASM physics/emulator builds; production GPU compute; GLSL↔WGSL shader transpiler; Knuth WEB compiler; historical WATFIV runtime; webMethods server workflows. These need real external compilers, licenses, binaries, or platform environments. No empty folder is being represented as a finished engine.

## Test status
ZIP integrity and static checks only. Browser runtime and full game compatibility have not been verified on the user's computer.


Oct 30 mascot animation update: SVG pixel-art mascots animate, have a showcase and dialogue. Node.js is not bundled; optional Windows x64 portable downloader is included at CrazyArcade/NODE_LTS_WINDOWS. Other advanced architecture placeholders remain incomplete.
