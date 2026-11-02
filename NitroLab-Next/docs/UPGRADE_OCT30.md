# NitroArcade game fixes

- Big Games: Lost Levels next to Mario, plus Nitro Clicker, Neon Dodge, Pixel Catcher and Goat Chaos Mega Map.
- Lost Levels page auto-loads the ROM already present in the supplied ZIP. The EmulatorJS core still downloads online. Mapper 40 is not confirmed supported, so this is an alternative attempt, not a guaranteed fix.
- WASD adapter dispatches arrow key events in the Lost Levels page. EmulatorJS may use a different keyboard handler; its Controls settings remain available.
- Happy Wheels quiz page now has a wider responsive iframe, but external site restrictions and internal scaling are outside NitroArcade control.
- Goat Sandbox is an original offline Three.js arcade-style physics prototype, not a full rigid-body engine.
