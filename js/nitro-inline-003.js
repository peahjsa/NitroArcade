
        const dashboardView = document.getElementById('dashboardView');
        const gameView = document.getElementById('gameView');
        const activeTitle = document.getElementById('activeGameTitle');
        const playerContainer = document.getElementById('playerContainer');
        const loginModal = document.getElementById('loginModal');
        const aboutModal = document.getElementById('aboutModal');

        let activeRufflePlayer = null;
        let currentGame = null;
        let libraryFilter = 'all';

        const gamesDatabase = [
            {id:'nitro_moved_5',name:'Extreme Car Drift Simulator',category:'arcade',type:'iframe',source:'https://gamebol.com/gamefile/Extreme_Car_Drift_Simulator/index.html',desc:'Online iframe · internet required'},
            {id:'nitro_moved_4',name:'Talking Ben',category:'arcade',type:'iframe',source:'https://html-classic.itch.zone/html/12272713/index.html',desc:'Online iframe · internet required'},
            {id:'nitro_moved_0',name:'Hexanaut',category:'arcade',type:'iframe',source:'https://hexanaut.io/',desc:'Online iframe · internet required'},
            {id:'nitro_io_new_01',name:'Wormate.io',category:'arcade',type:'iframe',source:'https://wormate.io/',desc:'Online multiplayer · internet required; some sites restrict iframes'},
            {id:'nitro_io_new_02',name:'Skribbl.io',category:'arcade',type:'iframe',source:'https://skribbl.io/',desc:'Online multiplayer · internet required; some sites restrict iframes'},
            {id:'nitro_io_new_03',name:'Zombs.io',category:'arcade',type:'iframe',source:'https://zombs.io/',desc:'Online multiplayer · internet required; some sites restrict iframes'},
            {id:'nitro_io_new_04',name:'Mope.io',category:'arcade',type:'iframe',source:'https://mope.io/',desc:'Online multiplayer · internet required; some sites restrict iframes'},
            {id:'nitro_io_new_05',name:'Splix.io',category:'arcade',type:'iframe',source:'https://splix.io/',desc:'Online multiplayer · internet required; some sites restrict iframes'},
            {id:'nitro_io_new_06',name:'Tetr.io',category:'arcade',type:'iframe',source:'https://tetr.io/',desc:'Online multiplayer · internet required; some sites restrict iframes'},
            {id:'nitro_io_01',name:'Agar.io',category:'arcade',type:'iframe',source:'https://agar.io/',desc:'Online iframe · internet required'},
            {id:'nitro_io_02',name:'Paper.io',category:'arcade',type:'iframe',source:'https://paperio.site/',desc:'Online iframe · internet required'},
            {id:'nitro_io_04',name:'Diep.io',category:'arcade',type:'iframe',source:'https://diep.io/',desc:'Online iframe · internet required'},
            {id:'nitro_io_06',name:'Gartic.io',category:'arcade',type:'iframe',source:'https://gartic.io/',desc:'Online iframe · internet required'},
            {id:'nitro_io_07',name:'Bonk.io',category:'arcade',type:'iframe',source:'https://bonk.io/',desc:'Online iframe · internet required'},
            {id:'nitro_io_08',name:'Krunker.io',category:'arcade',type:'iframe',source:'https://krunker.io/',desc:'Online iframe · internet required'},
            {id:'nitro_io_11',name:'Block Blast',category:'arcade',type:'iframe',source:'https://g.igroutka.ru/games/23/AD4Qer9Vj6EqpNPH/rvvASMiM/058a3fd0d58949be9b79e666de9ac36d/',desc:'Online iframe · internet required'},
            {id:'nitro_io_12',name:'Temple Run 2',category:'arcade',type:'iframe',source:'https://sudoku-online.github.io/a8/temple-run-2',desc:'Online iframe · internet required'},
            {id:'nitro_io_13',name:'Sausage Flip',category:'arcade',type:'iframe',source:'https://abinbins.github.io/a6/sausage-flip',desc:'Online iframe · internet required'},
            {id:'nitro_io_14',name:'Stack',category:'arcade',type:'iframe',source:'https://sudoku-online.github.io/a2/stack',desc:'Online iframe · internet required'},
            {id:'nitro_io_15',name:'Stickman Bike',category:'arcade',type:'iframe',source:'https://23azostore.github.io/s6/stickman-bike',desc:'Online iframe · internet required'},
            {id:'nitro_io_17',name:'Hitbox.io',category:'arcade',type:'iframe',source:'https://hitbox.io/',desc:'Online iframe · internet required'},
            {id:'nitro_io_16',name:'House of Hazards',category:'arcade',type:'iframe',source:'https://files.twoplayergames.org/files/games/o1/House_of_Hazards/index.html',desc:'Online iframe · internet required'},
            {id:'undertale_turbowarp',name:'Undertale',category:'arcade',type:'iframe',source:'https://turbowarp.org/791527350',desc:'Fan-made TurboWarp project · internet required'},
            {id:'deltarune_itch',name:'Deltarune',category:'arcade',type:'iframe',source:'https://html-classic.itch.zone/html/15192261/deltarune-main-1/index.html',desc:'itch.io HTML game · internet required'},
            {id:'my_mini_mart',name:'My Mini Mart',category:'arcade',type:'iframe',source:'https://gamess.funox.com/p3307474851966636433/assets/index.html',desc:'Mini mart game · internet required'},
            {id:'angry_birds_chrome',name:'Angry Birds Chrome',category:'arcade',type:'iframe',source:'https://angry-birds-chrome.vercel.app/',desc:'Bird-flinging puzzle game · online · internet required'},
            {id:'granny_online',name:'Granny',category:'arcade',type:'iframe',source:'https://grannyonline.io/granny.embed',desc:'Horror escape game · online · internet required'},
            {id:'growden_io',name:'Growden.io',category:'arcade',type:'iframe',source:'https://growden.io/#4TUWS3',desc:'Grow your garden · online iframe · internet required'},
            {id:'solar_smash_online',name:'Solar Smash',category:'arcade',type:'iframe',source:'https://solarsmashonline.com/play/solar-smash',desc:'Solar Smash browser game · online iframe · internet required'},

            {id:'geometry_dash_webport',name:'Geometry Dash',category:'arcade',type:'iframe',source:'https://gd-webport.pages.dev/',desc:'Online browser game · iframe · internet required'},
            {id:'minecraft_versions',name:'Minecraft Versions',category:'arcade',type:'iframe',source:'https://eaglercraft.com/play',desc:'Minecraft-style browser versions · internet required · iframe'},
            {id:'zombs_royale',name:'ZombsRoyale',category:'arcade',type:'iframe',source:'https://zombsroyale.io',desc:'Online multiplayer battle royale · iframe (internet required)'},
            {id:'real_football_challenge',name:'Real Football Challenge',category:'arcade',type:'iframe',source:'https://yell0wsuit.page/assets/games/real-football-challenge/index.html',desc:'Football challenge · online iframe game'},
            {id:'fruit_ninja_yellow',name:'Fruit Ninja',category:'arcade',type:'iframe',source:'https://yell0wsuit.page/assets/games/fruitninja/index.html',desc:'Fruit-slicing arcade game · internet required'},
            {id:'subway_surfers',name:'Subway Surfers',category:'arcade',type:'iframe',source:'https://yell0wsuit.page/assets/games/subway-surfers/index.html',desc:'Online endless runner · Embedding may be blocked'},
            {id:'nitro_clicker',name:'Stimulation Clicker',category:'arcade',type:'iframe',source:'https://neal.fun/stimulation-clicker/',desc:'Online Neal.fun clicker · embedding may be restricted'},
            {id:'neon_dodge',name:'Neon Dodge',category:'arcade',type:'iframe',source:'NitroLab-Next/games/dodge.html',desc:'Original offline obstacle dodging game'},
            {id:'amogus_io',name:'Amogus.io',category:'arcade',type:'iframe',source:'https://amogus.io/',desc:'Online multiplayer game · iframe availability depends on the website'},
            {id:'pixel_catcher',name:'Pixel Catcher',category:'arcade',type:'iframe',source:'NitroLab-Next/games/catcher.html',desc:'Original offline falling-object game'},
            {id:'happy_wheels_eligibility',name:'Happy Wheels — Eligibility Test',category:'arcade',type:'iframe',source:'HappyWheels_Eligibility/index.html',desc:'Five-question skill challenge before opening the official Happy Wheels website · Internet required'},
            {id:'alin_nexus_macro',name:'ALIN // NEXUS ARCADE',category:'arcade',type:'iframe',source:'MacroArcade_Extras/ALIN_NEXUS_ARCADE.html',desc:'Local original arcade by ALIN · 120 titles sharing 12 game engines'},
            {id:'ultra_gaming_macro',name:'ULTRA GAMING ARCADE',category:'arcade',type:'iframe',source:'MacroArcade_Extras/ULTRA_GAMING_ARCADE.html',desc:'Local multi-game arcade by MA7 5B · racing, maze, puzzles and more'},
            {id:'familiars_io',name:'Familiars.io',category:'arcade',type:'iframe',source:'https://www.familiars.io/',desc:'Official multiplayer game · internet required · embedding may be restricted'},
            {id:'nitrogenie_local',name:'NitroGenie Expanded',category:'arcade',type:'iframe',source:'NitroGenie/index.html',desc:'Offline guessing game · actors, musicians, Steam games and more'},
            {id:'fnaf_hd_1',name:'Five Nights at Freddy’s',category:'arcade',type:'iframe',source:'https://irv77.github.io/hd_fnaf/1/',desc:'Unofficial browser edition • iframe test'},
            {id:'fnaf_hd_2',name:'Five Nights at Freddy’s 2',category:'arcade',type:'iframe',source:'https://irv77.github.io/hd_fnaf/2/',desc:'Unofficial browser edition • iframe test'},
            {id:'fnaf_hd_3',name:'Five Nights at Freddy’s 3',category:'arcade',type:'iframe',source:'https://irv77.github.io/hd_fnaf/3/',desc:'Unofficial browser edition • iframe test'},
            {id:'fnaf_hd_4',name:'Five Nights at Freddy’s 4',category:'arcade',type:'iframe',source:'https://irv77.github.io/hd_fnaf/4/',desc:'Unofficial browser edition • iframe test'},
            {id:'fnaf_hd_w',name:'FNAF World',category:'arcade',type:'iframe',source:'https://irv77.github.io/hd_fnaf/w/',desc:'Unofficial browser edition • iframe test'},
            {id:'fnaf_hd_sl',name:'Sister Location',category:'arcade',type:'iframe',source:'https://irv77.github.io/hd_fnaf/sl/',desc:'Unofficial browser edition • iframe test'},
            {id:'fnaf_hd_ps',name:'Freddy Fazbear’s Pizzeria Simulator',category:'arcade',type:'iframe',source:'https://irv77.github.io/hd_fnaf/ps/',desc:'Unofficial browser edition • iframe test'},
            {id:'baldi_web_direct',name:"Baldi's Basics (Web)",category:'arcade',type:'iframe',source:'https://html-classic.itch.zone/html/16773469/index.html',desc:'Baldi browser port • iframe test'},
            {id:'among_us_itch_direct',name:'Among Us Online',category:'arcade',type:'iframe',source:'https://html-classic.itch.zone/html/13242932/index.html?v=1782318305',desc:'Browser remake • direct itch HTML5 game'},
            {id:'coaster_foundry_direct',name:'Coaster Foundry',category:'arcade',type:'iframe',source:'https://html-classic.itch.zone/html/19239060/index.html?v=1789404315',desc:'3D roller coaster builder • direct itch HTML5 game'},
            {id:'ucn_browser_test',name:'Ultimate Custom Night (HTML5)',category:'arcade',type:'iframe',source:'https://irv77.github.io/hd_fnaf/ucn/',desc:'Unofficial HD FNAF browser edition • iframe test'},
            {id:'demolition_tycoon_3d',name:'Demolition Tycoon 3D',category:'arcade',type:'iframe',source:'https://html5.gamemonetize.co/op87t2kkk7487kg66q8o2dg8mc05d8in/',desc:'3D building demolition tycoon'},
            {id:'yohoho_io',name:'YoHoHo.io',category:'arcade',type:'iframe',source:'https://yohoho.io/',desc:'Pirate multiplayer survival'},
            {id:'defly_io',name:'Defly.io',category:'arcade',type:'iframe',source:'https://defly.io/',desc:'Helicopter territory control'},
            {id:'astrorace_io',name:'Astrorace.io',category:'arcade',type:'iframe',source:'https://astrorace.io/',desc:'Multiplayer space racing'},
            {id:'nitroclash_io',name:'Nitroclash.io',category:'arcade',type:'iframe',source:'https://nitroclash.io/',desc:'Multiplayer boost soccer'},
            
            {
                id: 'crazysnake',
                name: 'CrazySnake',
                category: 'arcade',
                type: 'native',
                nativeGame: 'snake',
                desc: 'Arcade • Skill • Original'
            },
            {
                id: 'brickbreaker',
                name: 'Brick Breaker',
                category: 'arcade',
                type: 'native',
                nativeGame: 'brick',
                desc: 'Arcade • Classic • Original'
            },
            {
                id: 'hackerchallenge',
                name: 'Are You A Hacker?',
                category: 'challenge',
                type: 'native',
                nativeGame: 'hacker',
                desc: 'Challenge • Reflex • Logic'
            }
        ];
        const premiumGames = [{"id": "crazy_mini_golf", "name": "Crazy Mini Golf", "category": "physics", "type": "native", "nativeGame": "premium", "engine": "golf", "desc": "Sports \u2022 Physics \u2022 Original"}, {"id": "block_grid", "name": "Block Grid", "category": "puzzle", "type": "native", "nativeGame": "premium", "engine": "blockgrid", "desc": "Puzzle \u2022 Strategy \u2022 Original"}, {"id": "baby_animal_merge", "name": "Baby Animal Merge", "category": "physics", "type": "native", "nativeGame": "premium", "engine": "merge", "desc": "Merge \u2022 Physics \u2022 Original"}, {"id": "ball_lab", "name": "Ball Physics Lab", "category": "physics", "type": "native", "nativeGame": "premium", "engine": "balllab", "desc": "Physics \u2022 Sandbox \u2022 Original"}];
        gamesDatabase.push(...premiumGames);
const ultraGames = [{"id": "star_catch", "name": "Star Catch", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "catch", "desc": "Arcade • Catch • Original", "goal": 12, "speed": 3.2}, {"id": "gem_catch", "name": "Gem Catch", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "catch", "desc": "Arcade • Catch • Original", "goal": 15, "speed": 3.5}, {"id": "comet_catch", "name": "Comet Catch", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "catch", "desc": "Arcade • Catch • Original", "goal": 18, "speed": 3.8}, {"id": "data_catch", "name": "Data Catch", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "catch", "desc": "Arcade • Catch • Original", "goal": 20, "speed": 4.0}, {"id": "moon_catch", "name": "Moon Catch", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "catch", "desc": "Arcade • Catch • Original", "goal": 22, "speed": 4.2}, {"id": "meteor_escape", "name": "Meteor Escape", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "avoid", "desc": "Arcade • Dodge • Original", "goal": 14, "speed": 3.3}, {"id": "red_zone", "name": "Red Zone", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "avoid", "desc": "Arcade • Dodge • Original", "goal": 16, "speed": 3.6}, {"id": "asteroid_run", "name": "Asteroid Run", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "avoid", "desc": "Arcade • Dodge • Original", "goal": 18, "speed": 3.9}, {"id": "firewall_dodge", "name": "Firewall Dodge", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "avoid", "desc": "Arcade • Dodge • Original", "goal": 20, "speed": 4.2}, {"id": "void_runner", "name": "Void Runner", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "avoid", "desc": "Arcade • Dodge • Original", "goal": 22, "speed": 4.5}, {"id": "neon_breakout", "name": "Neon Breakout", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "breakout", "desc": "Arcade • Breakout • Original", "rows": 3}, {"id": "ice_breaker", "name": "Ice Breaker", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "breakout", "desc": "Arcade • Breakout • Original", "rows": 4}, {"id": "cosmic_bricks", "name": "Cosmic Bricks", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "breakout", "desc": "Arcade • Breakout • Original", "rows": 4}, {"id": "pixel_breaker", "name": "Pixel Breaker", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "breakout", "desc": "Arcade • Breakout • Original", "rows": 5}, {"id": "turbo_bricks", "name": "Turbo Bricks", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "breakout", "desc": "Arcade • Breakout • Original", "rows": 5}, {"id": "signal_sequence", "name": "Signal Sequence", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "simon", "desc": "Memory • Sequence • Original", "length": 4}, {"id": "orbit_memory", "name": "Orbit Memory", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "simon", "desc": "Memory • Sequence • Original", "length": 5}, {"id": "laser_memory", "name": "Laser Memory", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "simon", "desc": "Memory • Sequence • Original", "length": 6}, {"id": "pixel_sequence", "name": "Pixel Sequence", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "simon", "desc": "Memory • Sequence • Original", "length": 7}, {"id": "cipher_lights", "name": "Cipher Lights", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "simon", "desc": "Memory • Sequence • Original", "length": 8}, {"id": "bullseye", "name": "Bullseye", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "aim", "desc": "Precision • Aim • Original", "hits": 8, "size": 60}, {"id": "tiny_target", "name": "Tiny Target", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "aim", "desc": "Precision • Aim • Original", "hits": 10, "size": 48}, {"id": "crosshair", "name": "Crosshair", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "aim", "desc": "Precision • Aim • Original", "hits": 12, "size": 42}, {"id": "precision_shot", "name": "Precision Shot", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "aim", "desc": "Precision • Aim • Original", "hits": 14, "size": 36}, {"id": "center_hit", "name": "Center Hit", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "aim", "desc": "Precision • Aim • Original", "hits": 16, "size": 30}, {"id": "arcade_anagram", "name": "Arcade Anagram", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "anagram", "desc": "Word • Puzzle • Original", "rounds": 5}, {"id": "pixel_anagram", "name": "Pixel Anagram", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "anagram", "desc": "Word • Puzzle • Original", "rounds": 6}, {"id": "space_anagram", "name": "Space Anagram", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "anagram", "desc": "Word • Puzzle • Original", "rounds": 7}, {"id": "tech_anagram", "name": "Tech Anagram", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "anagram", "desc": "Word • Puzzle • Original", "rounds": 8}, {"id": "turbo_anagram", "name": "Turbo Anagram", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "anagram", "desc": "Word • Puzzle • Original", "rounds": 9}, {"id": "addition_attack", "name": "Addition Attack", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "math2", "desc": "Math • Speed • Original", "mode": "add", "rounds": 8}, {"id": "subtraction_sprint", "name": "Subtraction Sprint", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "math2", "desc": "Math • Speed • Original", "mode": "sub", "rounds": 8}, {"id": "multiply_mania", "name": "Multiply Mania", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "math2", "desc": "Math • Speed • Original", "mode": "mul", "rounds": 8}, {"id": "mixed_math", "name": "Mixed Math", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "math2", "desc": "Math • Speed • Original", "mode": "mixed", "rounds": 10}, {"id": "number_blitz", "name": "Number Blitz", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "math2", "desc": "Math • Speed • Original", "mode": "mixed", "rounds": 12}, {"id": "path_finder", "name": "Path Finder", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "path", "desc": "Puzzle • Path • Original", "size": 5}, {"id": "grid_escape", "name": "Grid Escape", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "path", "desc": "Puzzle • Path • Original", "size": 6}, {"id": "robot_route", "name": "Robot Route", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "path", "desc": "Puzzle • Path • Original", "size": 6}, {"id": "circuit_path", "name": "Circuit Path", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "path", "desc": "Puzzle • Path • Original", "size": 7}, {"id": "portal_path", "name": "Portal Path", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "path", "desc": "Puzzle • Path • Original", "size": 7}, {"id": "beat_tap", "name": "Beat Tap", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "rhythm", "desc": "Rhythm • Timing • Original", "bpm": 80, "beats": 10}, {"id": "rhythm_pulse", "name": "Rhythm Pulse", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "rhythm", "desc": "Rhythm • Timing • Original", "bpm": 95, "beats": 12}, {"id": "tempo_tap", "name": "Tempo Tap", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "rhythm", "desc": "Rhythm • Timing • Original", "bpm": 110, "beats": 14}, {"id": "beat_lock", "name": "Beat Lock", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "rhythm", "desc": "Rhythm • Timing • Original", "bpm": 125, "beats": 16}, {"id": "pulse_master", "name": "Pulse Master", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "rhythm", "desc": "Rhythm • Timing • Original", "bpm": 140, "beats": 18}, {"id": "lane_shift", "name": "Lane Shift", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "lane2", "desc": "Arcade • Racing • Original", "goal": 15, "speed": 4}, {"id": "traffic_dash", "name": "Traffic Dash", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "lane2", "desc": "Arcade • Racing • Original", "goal": 18, "speed": 4.5}, {"id": "cyber_racer", "name": "Cyber Racer", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "lane2", "desc": "Arcade • Racing • Original", "goal": 20, "speed": 5}, {"id": "tunnel_run", "name": "Tunnel Run", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "lane2", "desc": "Arcade • Racing • Original", "goal": 22, "speed": 5.5}, {"id": "hyper_lane", "name": "Hyper Lane", "category": "arcade", "type": "native", "nativeGame": "ultra", "engine": "lane2", "desc": "Arcade • Racing • Original", "goal": 25, "speed": 6}];
        gamesDatabase.push(...ultraGames);

        const megaGames = [{"id": "crazy_pong", "name": "Crazy Pong", "category": "arcade", "type": "native", "nativeGame": "mega", "engine": "pong", "desc": "Arcade • Sports • Original"}, {"id": "space_blaster", "name": "Space Blaster", "category": "arcade", "type": "native", "nativeGame": "mega", "engine": "shooter", "desc": "Arcade • Space • Original"}, {"id": "sky_hopper", "name": "Sky Hopper", "category": "arcade", "type": "native", "nativeGame": "mega", "engine": "flappy", "desc": "Arcade • Flying • Original"}, {"id": "maze_escape", "name": "Maze Escape", "category": "arcade", "type": "native", "nativeGame": "mega", "engine": "maze", "desc": "Puzzle • Maze • Original"}, {"id": "connect_four", "name": "Connect Four", "category": "arcade", "type": "native", "nativeGame": "mega", "engine": "connect4", "desc": "Strategy • Board • Original"}, {"id": "tic_tac_cpu", "name": "Tic-Tac-Toe CPU", "category": "arcade", "type": "native", "nativeGame": "mega", "engine": "tictac", "desc": "Strategy • CPU • Original"}, {"id": "whack_orb", "name": "Whack An Orb", "category": "arcade", "type": "native", "nativeGame": "mega", "engine": "whack", "desc": "Arcade • Targets • Original"}, {"id": "platform_jump", "name": "Platform Jump", "category": "arcade", "type": "native", "nativeGame": "mega", "engine": "jumper", "desc": "Arcade • Platform • Original"}, {"id": "mini_racer", "name": "Mini Racer", "category": "arcade", "type": "native", "nativeGame": "mega", "engine": "racer", "desc": "Arcade • Racing • Original"}, {"id": "mine_grid", "name": "Mine Grid", "category": "arcade", "type": "native", "nativeGame": "mega", "engine": "mines", "desc": "Puzzle • Grid • Original"}, {"id": "snake_duel", "name": "Snake Duel", "category": "arcade", "type": "native", "nativeGame": "mega", "engine": "snake2", "desc": "Arcade • Survival • Original"}, {"id": "brick_stack", "name": "Brick Stack", "category": "arcade", "type": "native", "nativeGame": "mega", "engine": "stack", "desc": "Arcade • Balance • Original"}, {"id": "laser_dodge", "name": "Laser Dodge", "category": "arcade", "type": "native", "nativeGame": "mega", "engine": "laserdodge", "desc": "Arcade • Dodge • Original"}, {"id": "orbital_defense", "name": "Orbital Defense", "category": "arcade", "type": "native", "nativeGame": "mega", "engine": "orbit", "desc": "Arcade • Defense • Original"}, {"id": "color_switch", "name": "Color Switch", "category": "arcade", "type": "native", "nativeGame": "mega", "engine": "colorswitch", "desc": "Arcade • Matching • Original"}, {"id": "gravity_flip", "name": "Gravity Flip", "category": "arcade", "type": "native", "nativeGame": "mega", "engine": "gravity", "desc": "Arcade • Gravity • Original"}, {"id": "tile_slide", "name": "Tile Slide", "category": "arcade", "type": "native", "nativeGame": "mega", "engine": "slide", "desc": "Puzzle • Sliding • Original"}, {"id": "word_scramble", "name": "Word Scramble", "category": "arcade", "type": "native", "nativeGame": "mega", "engine": "scramble", "desc": "Word • Puzzle • Original"}, {"id": "reaction_race", "name": "Reaction Race", "category": "arcade", "type": "native", "nativeGame": "mega", "engine": "lane", "desc": "Arcade • Racing • Original"}, {"id": "memory_pairs", "name": "Memory Pairs", "category": "arcade", "type": "native", "nativeGame": "mega", "engine": "pairs", "desc": "Memory • Cards • Original"}];
        gamesDatabase.push(...megaGames);

        const novaGames = [{"id":"nova_largest_1","name":"Neon Peak Picker","category":"puzzle","type":"native","nativeGame":"nova","engine":"largest","tier":1,"rounds":6,"desc":"Number • Precision • Original","rule":"Pick the largest value"},{"id":"nova_largest_2","name":"Orbit Peak Picker","category":"puzzle","type":"native","nativeGame":"nova","engine":"largest","tier":2,"rounds":6,"desc":"Number • Precision • Original","rule":"Pick the largest value"},{"id":"nova_largest_3","name":"Pixel Peak Picker","category":"puzzle","type":"native","nativeGame":"nova","engine":"largest","tier":3,"rounds":7,"desc":"Number • Precision • Original","rule":"Pick the largest value"},{"id":"nova_largest_4","name":"Quantum Peak Picker","category":"puzzle","type":"native","nativeGame":"nova","engine":"largest","tier":4,"rounds":7,"desc":"Number • Precision • Original","rule":"Pick the largest value"},{"id":"nova_largest_5","name":"Turbo Peak Picker","category":"puzzle","type":"native","nativeGame":"nova","engine":"largest","tier":5,"rounds":7,"desc":"Number • Precision • Original","rule":"Pick the largest value"},{"id":"nova_largest_6","name":"Crystal Peak Picker","category":"puzzle","type":"native","nativeGame":"nova","engine":"largest","tier":6,"rounds":8,"desc":"Number • Precision • Original","rule":"Pick the largest value"},{"id":"nova_largest_7","name":"Nova Peak Picker","category":"puzzle","type":"native","nativeGame":"nova","engine":"largest","tier":7,"rounds":8,"desc":"Number • Precision • Original","rule":"Pick the largest value"},{"id":"nova_largest_8","name":"Cipher Peak Picker","category":"puzzle","type":"native","nativeGame":"nova","engine":"largest","tier":8,"rounds":8,"desc":"Number • Precision • Original","rule":"Pick the largest value"},{"id":"nova_smallest_1","name":"Neon Tiny Signal","category":"puzzle","type":"native","nativeGame":"nova","engine":"smallest","tier":1,"rounds":6,"desc":"Number • Precision • Original","rule":"Pick the smallest value"},{"id":"nova_smallest_2","name":"Orbit Tiny Signal","category":"puzzle","type":"native","nativeGame":"nova","engine":"smallest","tier":2,"rounds":6,"desc":"Number • Precision • Original","rule":"Pick the smallest value"},{"id":"nova_smallest_3","name":"Pixel Tiny Signal","category":"puzzle","type":"native","nativeGame":"nova","engine":"smallest","tier":3,"rounds":7,"desc":"Number • Precision • Original","rule":"Pick the smallest value"},{"id":"nova_smallest_4","name":"Quantum Tiny Signal","category":"puzzle","type":"native","nativeGame":"nova","engine":"smallest","tier":4,"rounds":7,"desc":"Number • Precision • Original","rule":"Pick the smallest value"},{"id":"nova_smallest_5","name":"Turbo Tiny Signal","category":"puzzle","type":"native","nativeGame":"nova","engine":"smallest","tier":5,"rounds":7,"desc":"Number • Precision • Original","rule":"Pick the smallest value"},{"id":"nova_smallest_6","name":"Crystal Tiny Signal","category":"puzzle","type":"native","nativeGame":"nova","engine":"smallest","tier":6,"rounds":8,"desc":"Number • Precision • Original","rule":"Pick the smallest value"},{"id":"nova_smallest_7","name":"Nova Tiny Signal","category":"puzzle","type":"native","nativeGame":"nova","engine":"smallest","tier":7,"rounds":8,"desc":"Number • Precision • Original","rule":"Pick the smallest value"},{"id":"nova_smallest_8","name":"Cipher Tiny Signal","category":"puzzle","type":"native","nativeGame":"nova","engine":"smallest","tier":8,"rounds":8,"desc":"Number • Precision • Original","rule":"Pick the smallest value"},{"id":"nova_closest_1","name":"Neon Target Drift","category":"puzzle","type":"native","nativeGame":"nova","engine":"closest","tier":1,"rounds":6,"desc":"Number • Estimation • Original","rule":"Pick the value closest to the target"},{"id":"nova_closest_2","name":"Orbit Target Drift","category":"puzzle","type":"native","nativeGame":"nova","engine":"closest","tier":2,"rounds":6,"desc":"Number • Estimation • Original","rule":"Pick the value closest to the target"},{"id":"nova_closest_3","name":"Pixel Target Drift","category":"puzzle","type":"native","nativeGame":"nova","engine":"closest","tier":3,"rounds":7,"desc":"Number • Estimation • Original","rule":"Pick the value closest to the target"},{"id":"nova_closest_4","name":"Quantum Target Drift","category":"puzzle","type":"native","nativeGame":"nova","engine":"closest","tier":4,"rounds":7,"desc":"Number • Estimation • Original","rule":"Pick the value closest to the target"},{"id":"nova_closest_5","name":"Turbo Target Drift","category":"puzzle","type":"native","nativeGame":"nova","engine":"closest","tier":5,"rounds":7,"desc":"Number • Estimation • Original","rule":"Pick the value closest to the target"},{"id":"nova_closest_6","name":"Crystal Target Drift","category":"puzzle","type":"native","nativeGame":"nova","engine":"closest","tier":6,"rounds":8,"desc":"Number • Estimation • Original","rule":"Pick the value closest to the target"},{"id":"nova_closest_7","name":"Nova Target Drift","category":"puzzle","type":"native","nativeGame":"nova","engine":"closest","tier":7,"rounds":8,"desc":"Number • Estimation • Original","rule":"Pick the value closest to the target"},{"id":"nova_closest_8","name":"Cipher Target Drift","category":"puzzle","type":"native","nativeGame":"nova","engine":"closest","tier":8,"rounds":8,"desc":"Number • Estimation • Original","rule":"Pick the value closest to the target"},{"id":"nova_odd_1","name":"Neon Odd Reactor","category":"puzzle","type":"native","nativeGame":"nova","engine":"odd","tier":1,"rounds":6,"desc":"Logic • Number • Original","rule":"Pick the odd number"},{"id":"nova_odd_2","name":"Orbit Odd Reactor","category":"puzzle","type":"native","nativeGame":"nova","engine":"odd","tier":2,"rounds":6,"desc":"Logic • Number • Original","rule":"Pick the odd number"},{"id":"nova_odd_3","name":"Pixel Odd Reactor","category":"puzzle","type":"native","nativeGame":"nova","engine":"odd","tier":3,"rounds":7,"desc":"Logic • Number • Original","rule":"Pick the odd number"},{"id":"nova_odd_4","name":"Quantum Odd Reactor","category":"puzzle","type":"native","nativeGame":"nova","engine":"odd","tier":4,"rounds":7,"desc":"Logic • Number • Original","rule":"Pick the odd number"},{"id":"nova_odd_5","name":"Turbo Odd Reactor","category":"puzzle","type":"native","nativeGame":"nova","engine":"odd","tier":5,"rounds":7,"desc":"Logic • Number • Original","rule":"Pick the odd number"},{"id":"nova_odd_6","name":"Crystal Odd Reactor","category":"puzzle","type":"native","nativeGame":"nova","engine":"odd","tier":6,"rounds":8,"desc":"Logic • Number • Original","rule":"Pick the odd number"},{"id":"nova_odd_7","name":"Nova Odd Reactor","category":"puzzle","type":"native","nativeGame":"nova","engine":"odd","tier":7,"rounds":8,"desc":"Logic • Number • Original","rule":"Pick the odd number"},{"id":"nova_odd_8","name":"Cipher Odd Reactor","category":"puzzle","type":"native","nativeGame":"nova","engine":"odd","tier":8,"rounds":8,"desc":"Logic • Number • Original","rule":"Pick the odd number"},{"id":"nova_even_1","name":"Neon Even Reactor","category":"puzzle","type":"native","nativeGame":"nova","engine":"even","tier":1,"rounds":6,"desc":"Logic • Number • Original","rule":"Pick the even number"},{"id":"nova_even_2","name":"Orbit Even Reactor","category":"puzzle","type":"native","nativeGame":"nova","engine":"even","tier":2,"rounds":6,"desc":"Logic • Number • Original","rule":"Pick the even number"},{"id":"nova_even_3","name":"Pixel Even Reactor","category":"puzzle","type":"native","nativeGame":"nova","engine":"even","tier":3,"rounds":7,"desc":"Logic • Number • Original","rule":"Pick the even number"},{"id":"nova_even_4","name":"Quantum Even Reactor","category":"puzzle","type":"native","nativeGame":"nova","engine":"even","tier":4,"rounds":7,"desc":"Logic • Number • Original","rule":"Pick the even number"},{"id":"nova_even_5","name":"Turbo Even Reactor","category":"puzzle","type":"native","nativeGame":"nova","engine":"even","tier":5,"rounds":7,"desc":"Logic • Number • Original","rule":"Pick the even number"},{"id":"nova_even_6","name":"Crystal Even Reactor","category":"puzzle","type":"native","nativeGame":"nova","engine":"even","tier":6,"rounds":8,"desc":"Logic • Number • Original","rule":"Pick the even number"},{"id":"nova_even_7","name":"Nova Even Reactor","category":"puzzle","type":"native","nativeGame":"nova","engine":"even","tier":7,"rounds":8,"desc":"Logic • Number • Original","rule":"Pick the even number"},{"id":"nova_even_8","name":"Cipher Even Reactor","category":"puzzle","type":"native","nativeGame":"nova","engine":"even","tier":8,"rounds":8,"desc":"Logic • Number • Original","rule":"Pick the even number"},{"id":"nova_prime_1","name":"Neon Prime Scanner","category":"puzzle","type":"native","nativeGame":"nova","engine":"prime","tier":1,"rounds":6,"desc":"Logic • Number • Original","rule":"Find the prime number"},{"id":"nova_prime_2","name":"Orbit Prime Scanner","category":"puzzle","type":"native","nativeGame":"nova","engine":"prime","tier":2,"rounds":6,"desc":"Logic • Number • Original","rule":"Find the prime number"},{"id":"nova_prime_3","name":"Pixel Prime Scanner","category":"puzzle","type":"native","nativeGame":"nova","engine":"prime","tier":3,"rounds":7,"desc":"Logic • Number • Original","rule":"Find the prime number"},{"id":"nova_prime_4","name":"Quantum Prime Scanner","category":"puzzle","type":"native","nativeGame":"nova","engine":"prime","tier":4,"rounds":7,"desc":"Logic • Number • Original","rule":"Find the prime number"},{"id":"nova_prime_5","name":"Turbo Prime Scanner","category":"puzzle","type":"native","nativeGame":"nova","engine":"prime","tier":5,"rounds":7,"desc":"Logic • Number • Original","rule":"Find the prime number"},{"id":"nova_prime_6","name":"Crystal Prime Scanner","category":"puzzle","type":"native","nativeGame":"nova","engine":"prime","tier":6,"rounds":8,"desc":"Logic • Number • Original","rule":"Find the prime number"},{"id":"nova_prime_7","name":"Nova Prime Scanner","category":"puzzle","type":"native","nativeGame":"nova","engine":"prime","tier":7,"rounds":8,"desc":"Logic • Number • Original","rule":"Find the prime number"},{"id":"nova_prime_8","name":"Cipher Prime Scanner","category":"puzzle","type":"native","nativeGame":"nova","engine":"prime","tier":8,"rounds":8,"desc":"Logic • Number • Original","rule":"Find the prime number"},{"id":"nova_sum_1","name":"Neon Sum Lock","category":"puzzle","type":"native","nativeGame":"nova","engine":"sum","tier":1,"rounds":6,"desc":"Math • Logic • Original","rule":"Choose the pair-total answer"},{"id":"nova_sum_2","name":"Orbit Sum Lock","category":"puzzle","type":"native","nativeGame":"nova","engine":"sum","tier":2,"rounds":6,"desc":"Math • Logic • Original","rule":"Choose the pair-total answer"},{"id":"nova_sum_3","name":"Pixel Sum Lock","category":"puzzle","type":"native","nativeGame":"nova","engine":"sum","tier":3,"rounds":7,"desc":"Math • Logic • Original","rule":"Choose the pair-total answer"},{"id":"nova_sum_4","name":"Quantum Sum Lock","category":"puzzle","type":"native","nativeGame":"nova","engine":"sum","tier":4,"rounds":7,"desc":"Math • Logic • Original","rule":"Choose the pair-total answer"},{"id":"nova_sum_5","name":"Turbo Sum Lock","category":"puzzle","type":"native","nativeGame":"nova","engine":"sum","tier":5,"rounds":7,"desc":"Math • Logic • Original","rule":"Choose the pair-total answer"},{"id":"nova_sum_6","name":"Crystal Sum Lock","category":"puzzle","type":"native","nativeGame":"nova","engine":"sum","tier":6,"rounds":8,"desc":"Math • Logic • Original","rule":"Choose the pair-total answer"},{"id":"nova_sum_7","name":"Nova Sum Lock","category":"puzzle","type":"native","nativeGame":"nova","engine":"sum","tier":7,"rounds":8,"desc":"Math • Logic • Original","rule":"Choose the pair-total answer"},{"id":"nova_sum_8","name":"Cipher Sum Lock","category":"puzzle","type":"native","nativeGame":"nova","engine":"sum","tier":8,"rounds":8,"desc":"Math • Logic • Original","rule":"Choose the pair-total answer"},{"id":"nova_difference_1","name":"Neon Delta Lock","category":"puzzle","type":"native","nativeGame":"nova","engine":"difference","tier":1,"rounds":6,"desc":"Math • Logic • Original","rule":"Solve the difference"},{"id":"nova_difference_2","name":"Orbit Delta Lock","category":"puzzle","type":"native","nativeGame":"nova","engine":"difference","tier":2,"rounds":6,"desc":"Math • Logic • Original","rule":"Solve the difference"},{"id":"nova_difference_3","name":"Pixel Delta Lock","category":"puzzle","type":"native","nativeGame":"nova","engine":"difference","tier":3,"rounds":7,"desc":"Math • Logic • Original","rule":"Solve the difference"},{"id":"nova_difference_4","name":"Quantum Delta Lock","category":"puzzle","type":"native","nativeGame":"nova","engine":"difference","tier":4,"rounds":7,"desc":"Math • Logic • Original","rule":"Solve the difference"},{"id":"nova_difference_5","name":"Turbo Delta Lock","category":"puzzle","type":"native","nativeGame":"nova","engine":"difference","tier":5,"rounds":7,"desc":"Math • Logic • Original","rule":"Solve the difference"},{"id":"nova_difference_6","name":"Crystal Delta Lock","category":"puzzle","type":"native","nativeGame":"nova","engine":"difference","tier":6,"rounds":8,"desc":"Math • Logic • Original","rule":"Solve the difference"},{"id":"nova_difference_7","name":"Nova Delta Lock","category":"puzzle","type":"native","nativeGame":"nova","engine":"difference","tier":7,"rounds":8,"desc":"Math • Logic • Original","rule":"Solve the difference"},{"id":"nova_difference_8","name":"Cipher Delta Lock","category":"puzzle","type":"native","nativeGame":"nova","engine":"difference","tier":8,"rounds":8,"desc":"Math • Logic • Original","rule":"Solve the difference"},{"id":"nova_sequence_1","name":"Neon Sequence Forge","category":"puzzle","type":"native","nativeGame":"nova","engine":"sequence","tier":1,"rounds":6,"desc":"Pattern • Logic • Original","rule":"Continue the changing sequence"},{"id":"nova_sequence_2","name":"Orbit Sequence Forge","category":"puzzle","type":"native","nativeGame":"nova","engine":"sequence","tier":2,"rounds":6,"desc":"Pattern • Logic • Original","rule":"Continue the changing sequence"},{"id":"nova_sequence_3","name":"Pixel Sequence Forge","category":"puzzle","type":"native","nativeGame":"nova","engine":"sequence","tier":3,"rounds":7,"desc":"Pattern • Logic • Original","rule":"Continue the changing sequence"},{"id":"nova_sequence_4","name":"Quantum Sequence Forge","category":"puzzle","type":"native","nativeGame":"nova","engine":"sequence","tier":4,"rounds":7,"desc":"Pattern • Logic • Original","rule":"Continue the changing sequence"},{"id":"nova_sequence_5","name":"Turbo Sequence Forge","category":"puzzle","type":"native","nativeGame":"nova","engine":"sequence","tier":5,"rounds":7,"desc":"Pattern • Logic • Original","rule":"Continue the changing sequence"},{"id":"nova_sequence_6","name":"Crystal Sequence Forge","category":"puzzle","type":"native","nativeGame":"nova","engine":"sequence","tier":6,"rounds":8,"desc":"Pattern • Logic • Original","rule":"Continue the changing sequence"},{"id":"nova_sequence_7","name":"Nova Sequence Forge","category":"puzzle","type":"native","nativeGame":"nova","engine":"sequence","tier":7,"rounds":8,"desc":"Pattern • Logic • Original","rule":"Continue the changing sequence"},{"id":"nova_sequence_8","name":"Cipher Sequence Forge","category":"puzzle","type":"native","nativeGame":"nova","engine":"sequence","tier":8,"rounds":8,"desc":"Pattern • Logic • Original","rule":"Continue the changing sequence"},{"id":"nova_missing_1","name":"Neon Missing Node","category":"puzzle","type":"native","nativeGame":"nova","engine":"missing","tier":1,"rounds":6,"desc":"Pattern • Logic • Original","rule":"Recover the missing value"},{"id":"nova_missing_2","name":"Orbit Missing Node","category":"puzzle","type":"native","nativeGame":"nova","engine":"missing","tier":2,"rounds":6,"desc":"Pattern • Logic • Original","rule":"Recover the missing value"},{"id":"nova_missing_3","name":"Pixel Missing Node","category":"puzzle","type":"native","nativeGame":"nova","engine":"missing","tier":3,"rounds":7,"desc":"Pattern • Logic • Original","rule":"Recover the missing value"},{"id":"nova_missing_4","name":"Quantum Missing Node","category":"puzzle","type":"native","nativeGame":"nova","engine":"missing","tier":4,"rounds":7,"desc":"Pattern • Logic • Original","rule":"Recover the missing value"},{"id":"nova_missing_5","name":"Turbo Missing Node","category":"puzzle","type":"native","nativeGame":"nova","engine":"missing","tier":5,"rounds":7,"desc":"Pattern • Logic • Original","rule":"Recover the missing value"},{"id":"nova_missing_6","name":"Crystal Missing Node","category":"puzzle","type":"native","nativeGame":"nova","engine":"missing","tier":6,"rounds":8,"desc":"Pattern • Logic • Original","rule":"Recover the missing value"},{"id":"nova_missing_7","name":"Nova Missing Node","category":"puzzle","type":"native","nativeGame":"nova","engine":"missing","tier":7,"rounds":8,"desc":"Pattern • Logic • Original","rule":"Recover the missing value"},{"id":"nova_missing_8","name":"Cipher Missing Node","category":"puzzle","type":"native","nativeGame":"nova","engine":"missing","tier":8,"rounds":8,"desc":"Pattern • Logic • Original","rule":"Recover the missing value"},{"id":"nova_wordlen_1","name":"Neon Word Gauge","category":"puzzle","type":"native","nativeGame":"nova","engine":"wordlen","tier":1,"rounds":6,"desc":"Word • Precision • Original","rule":"Choose the word with the requested length"},{"id":"nova_wordlen_2","name":"Orbit Word Gauge","category":"puzzle","type":"native","nativeGame":"nova","engine":"wordlen","tier":2,"rounds":6,"desc":"Word • Precision • Original","rule":"Choose the word with the requested length"},{"id":"nova_wordlen_3","name":"Pixel Word Gauge","category":"puzzle","type":"native","nativeGame":"nova","engine":"wordlen","tier":3,"rounds":7,"desc":"Word • Precision • Original","rule":"Choose the word with the requested length"},{"id":"nova_wordlen_4","name":"Quantum Word Gauge","category":"puzzle","type":"native","nativeGame":"nova","engine":"wordlen","tier":4,"rounds":7,"desc":"Word • Precision • Original","rule":"Choose the word with the requested length"},{"id":"nova_wordlen_5","name":"Turbo Word Gauge","category":"puzzle","type":"native","nativeGame":"nova","engine":"wordlen","tier":5,"rounds":7,"desc":"Word • Precision • Original","rule":"Choose the word with the requested length"},{"id":"nova_wordlen_6","name":"Crystal Word Gauge","category":"puzzle","type":"native","nativeGame":"nova","engine":"wordlen","tier":6,"rounds":8,"desc":"Word • Precision • Original","rule":"Choose the word with the requested length"},{"id":"nova_wordlen_7","name":"Nova Word Gauge","category":"puzzle","type":"native","nativeGame":"nova","engine":"wordlen","tier":7,"rounds":8,"desc":"Word • Precision • Original","rule":"Choose the word with the requested length"},{"id":"nova_wordlen_8","name":"Cipher Word Gauge","category":"puzzle","type":"native","nativeGame":"nova","engine":"wordlen","tier":8,"rounds":8,"desc":"Word • Precision • Original","rule":"Choose the word with the requested length"},{"id":"nova_vowels_1","name":"Neon Vowel Radar","category":"puzzle","type":"native","nativeGame":"nova","engine":"vowels","tier":1,"rounds":6,"desc":"Word • Logic • Original","rule":"Count the vowels"},{"id":"nova_vowels_2","name":"Orbit Vowel Radar","category":"puzzle","type":"native","nativeGame":"nova","engine":"vowels","tier":2,"rounds":6,"desc":"Word • Logic • Original","rule":"Count the vowels"},{"id":"nova_vowels_3","name":"Pixel Vowel Radar","category":"puzzle","type":"native","nativeGame":"nova","engine":"vowels","tier":3,"rounds":7,"desc":"Word • Logic • Original","rule":"Count the vowels"},{"id":"nova_vowels_4","name":"Quantum Vowel Radar","category":"puzzle","type":"native","nativeGame":"nova","engine":"vowels","tier":4,"rounds":7,"desc":"Word • Logic • Original","rule":"Count the vowels"},{"id":"nova_vowels_5","name":"Turbo Vowel Radar","category":"puzzle","type":"native","nativeGame":"nova","engine":"vowels","tier":5,"rounds":7,"desc":"Word • Logic • Original","rule":"Count the vowels"},{"id":"nova_vowels_6","name":"Crystal Vowel Radar","category":"puzzle","type":"native","nativeGame":"nova","engine":"vowels","tier":6,"rounds":8,"desc":"Word • Logic • Original","rule":"Count the vowels"},{"id":"nova_vowels_7","name":"Nova Vowel Radar","category":"puzzle","type":"native","nativeGame":"nova","engine":"vowels","tier":7,"rounds":8,"desc":"Word • Logic • Original","rule":"Count the vowels"},{"id":"nova_vowels_8","name":"Cipher Vowel Radar","category":"puzzle","type":"native","nativeGame":"nova","engine":"vowels","tier":8,"rounds":8,"desc":"Word • Logic • Original","rule":"Count the vowels"},{"id":"nova_alphabet_1","name":"Neon Letter Vector","category":"puzzle","type":"native","nativeGame":"nova","engine":"alphabet","tier":1,"rounds":6,"desc":"Word • Number • Original","rule":"Convert a letter to its alphabet position"},{"id":"nova_alphabet_2","name":"Orbit Letter Vector","category":"puzzle","type":"native","nativeGame":"nova","engine":"alphabet","tier":2,"rounds":6,"desc":"Word • Number • Original","rule":"Convert a letter to its alphabet position"},{"id":"nova_alphabet_3","name":"Pixel Letter Vector","category":"puzzle","type":"native","nativeGame":"nova","engine":"alphabet","tier":3,"rounds":7,"desc":"Word • Number • Original","rule":"Convert a letter to its alphabet position"},{"id":"nova_alphabet_4","name":"Quantum Letter Vector","category":"puzzle","type":"native","nativeGame":"nova","engine":"alphabet","tier":4,"rounds":7,"desc":"Word • Number • Original","rule":"Convert a letter to its alphabet position"},{"id":"nova_alphabet_5","name":"Turbo Letter Vector","category":"puzzle","type":"native","nativeGame":"nova","engine":"alphabet","tier":5,"rounds":7,"desc":"Word • Number • Original","rule":"Convert a letter to its alphabet position"},{"id":"nova_alphabet_6","name":"Crystal Letter Vector","category":"puzzle","type":"native","nativeGame":"nova","engine":"alphabet","tier":6,"rounds":8,"desc":"Word • Number • Original","rule":"Convert a letter to its alphabet position"},{"id":"nova_alphabet_7","name":"Nova Letter Vector","category":"puzzle","type":"native","nativeGame":"nova","engine":"alphabet","tier":7,"rounds":8,"desc":"Word • Number • Original","rule":"Convert a letter to its alphabet position"},{"id":"nova_alphabet_8","name":"Cipher Letter Vector","category":"puzzle","type":"native","nativeGame":"nova","engine":"alphabet","tier":8,"rounds":8,"desc":"Word • Number • Original","rule":"Convert a letter to its alphabet position"},{"id":"nova_symbols_1","name":"Neon Symbol Sweep","category":"arcade","type":"native","nativeGame":"nova","engine":"symbols","tier":1,"rounds":6,"desc":"Visual • Counting • Original","rule":"Count the requested symbol"},{"id":"nova_symbols_2","name":"Orbit Symbol Sweep","category":"arcade","type":"native","nativeGame":"nova","engine":"symbols","tier":2,"rounds":6,"desc":"Visual • Counting • Original","rule":"Count the requested symbol"},{"id":"nova_symbols_3","name":"Pixel Symbol Sweep","category":"arcade","type":"native","nativeGame":"nova","engine":"symbols","tier":3,"rounds":7,"desc":"Visual • Counting • Original","rule":"Count the requested symbol"},{"id":"nova_symbols_4","name":"Quantum Symbol Sweep","category":"arcade","type":"native","nativeGame":"nova","engine":"symbols","tier":4,"rounds":7,"desc":"Visual • Counting • Original","rule":"Count the requested symbol"},{"id":"nova_symbols_5","name":"Turbo Symbol Sweep","category":"arcade","type":"native","nativeGame":"nova","engine":"symbols","tier":5,"rounds":7,"desc":"Visual • Counting • Original","rule":"Count the requested symbol"},{"id":"nova_symbols_6","name":"Crystal Symbol Sweep","category":"arcade","type":"native","nativeGame":"nova","engine":"symbols","tier":6,"rounds":8,"desc":"Visual • Counting • Original","rule":"Count the requested symbol"},{"id":"nova_symbols_7","name":"Nova Symbol Sweep","category":"arcade","type":"native","nativeGame":"nova","engine":"symbols","tier":7,"rounds":8,"desc":"Visual • Counting • Original","rule":"Count the requested symbol"},{"id":"nova_symbols_8","name":"Cipher Symbol Sweep","category":"arcade","type":"native","nativeGame":"nova","engine":"symbols","tier":8,"rounds":8,"desc":"Visual • Counting • Original","rule":"Count the requested symbol"},{"id":"nova_coordinate_1","name":"Neon Grid Beacon","category":"arcade","type":"native","nativeGame":"nova","engine":"coordinate","tier":1,"rounds":6,"desc":"Spatial • Logic • Original","rule":"Read a coordinate target"},{"id":"nova_coordinate_2","name":"Orbit Grid Beacon","category":"arcade","type":"native","nativeGame":"nova","engine":"coordinate","tier":2,"rounds":6,"desc":"Spatial • Logic • Original","rule":"Read a coordinate target"},{"id":"nova_coordinate_3","name":"Pixel Grid Beacon","category":"arcade","type":"native","nativeGame":"nova","engine":"coordinate","tier":3,"rounds":7,"desc":"Spatial • Logic • Original","rule":"Read a coordinate target"},{"id":"nova_coordinate_4","name":"Quantum Grid Beacon","category":"arcade","type":"native","nativeGame":"nova","engine":"coordinate","tier":4,"rounds":7,"desc":"Spatial • Logic • Original","rule":"Read a coordinate target"},{"id":"nova_coordinate_5","name":"Turbo Grid Beacon","category":"arcade","type":"native","nativeGame":"nova","engine":"coordinate","tier":5,"rounds":7,"desc":"Spatial • Logic • Original","rule":"Read a coordinate target"},{"id":"nova_coordinate_6","name":"Crystal Grid Beacon","category":"arcade","type":"native","nativeGame":"nova","engine":"coordinate","tier":6,"rounds":8,"desc":"Spatial • Logic • Original","rule":"Read a coordinate target"},{"id":"nova_coordinate_7","name":"Nova Grid Beacon","category":"arcade","type":"native","nativeGame":"nova","engine":"coordinate","tier":7,"rounds":8,"desc":"Spatial • Logic • Original","rule":"Read a coordinate target"},{"id":"nova_coordinate_8","name":"Cipher Grid Beacon","category":"arcade","type":"native","nativeGame":"nova","engine":"coordinate","tier":8,"rounds":8,"desc":"Spatial • Logic • Original","rule":"Read a coordinate target"},{"id":"nova_fraction_1","name":"Neon Fraction Flux","category":"puzzle","type":"native","nativeGame":"nova","engine":"fraction","tier":1,"rounds":6,"desc":"Math • Comparison • Original","rule":"Choose the larger fraction"},{"id":"nova_fraction_2","name":"Orbit Fraction Flux","category":"puzzle","type":"native","nativeGame":"nova","engine":"fraction","tier":2,"rounds":6,"desc":"Math • Comparison • Original","rule":"Choose the larger fraction"},{"id":"nova_fraction_3","name":"Pixel Fraction Flux","category":"puzzle","type":"native","nativeGame":"nova","engine":"fraction","tier":3,"rounds":7,"desc":"Math • Comparison • Original","rule":"Choose the larger fraction"},{"id":"nova_fraction_4","name":"Quantum Fraction Flux","category":"puzzle","type":"native","nativeGame":"nova","engine":"fraction","tier":4,"rounds":7,"desc":"Math • Comparison • Original","rule":"Choose the larger fraction"},{"id":"nova_fraction_5","name":"Turbo Fraction Flux","category":"puzzle","type":"native","nativeGame":"nova","engine":"fraction","tier":5,"rounds":7,"desc":"Math • Comparison • Original","rule":"Choose the larger fraction"},{"id":"nova_fraction_6","name":"Crystal Fraction Flux","category":"puzzle","type":"native","nativeGame":"nova","engine":"fraction","tier":6,"rounds":8,"desc":"Math • Comparison • Original","rule":"Choose the larger fraction"},{"id":"nova_fraction_7","name":"Nova Fraction Flux","category":"puzzle","type":"native","nativeGame":"nova","engine":"fraction","tier":7,"rounds":8,"desc":"Math • Comparison • Original","rule":"Choose the larger fraction"},{"id":"nova_fraction_8","name":"Cipher Fraction Flux","category":"puzzle","type":"native","nativeGame":"nova","engine":"fraction","tier":8,"rounds":8,"desc":"Math • Comparison • Original","rule":"Choose the larger fraction"},{"id":"nova_binary_1","name":"Neon Bit Decoder","category":"puzzle","type":"native","nativeGame":"nova","engine":"binary","tier":1,"rounds":6,"desc":"Tech • Number • Original","rule":"Convert a binary signal"},{"id":"nova_binary_2","name":"Orbit Bit Decoder","category":"puzzle","type":"native","nativeGame":"nova","engine":"binary","tier":2,"rounds":6,"desc":"Tech • Number • Original","rule":"Convert a binary signal"},{"id":"nova_binary_3","name":"Pixel Bit Decoder","category":"puzzle","type":"native","nativeGame":"nova","engine":"binary","tier":3,"rounds":7,"desc":"Tech • Number • Original","rule":"Convert a binary signal"},{"id":"nova_binary_4","name":"Quantum Bit Decoder","category":"puzzle","type":"native","nativeGame":"nova","engine":"binary","tier":4,"rounds":7,"desc":"Tech • Number • Original","rule":"Convert a binary signal"},{"id":"nova_binary_5","name":"Turbo Bit Decoder","category":"puzzle","type":"native","nativeGame":"nova","engine":"binary","tier":5,"rounds":7,"desc":"Tech • Number • Original","rule":"Convert a binary signal"},{"id":"nova_binary_6","name":"Crystal Bit Decoder","category":"puzzle","type":"native","nativeGame":"nova","engine":"binary","tier":6,"rounds":8,"desc":"Tech • Number • Original","rule":"Convert a binary signal"},{"id":"nova_binary_7","name":"Nova Bit Decoder","category":"puzzle","type":"native","nativeGame":"nova","engine":"binary","tier":7,"rounds":8,"desc":"Tech • Number • Original","rule":"Convert a binary signal"},{"id":"nova_binary_8","name":"Cipher Bit Decoder","category":"puzzle","type":"native","nativeGame":"nova","engine":"binary","tier":8,"rounds":8,"desc":"Tech • Number • Original","rule":"Convert a binary signal"},{"id":"nova_sides_1","name":"Neon Shape Circuit","category":"arcade","type":"native","nativeGame":"nova","engine":"sides","tier":1,"rounds":6,"desc":"Visual • Logic • Original","rule":"Match a shape to its side count"},{"id":"nova_sides_2","name":"Orbit Shape Circuit","category":"arcade","type":"native","nativeGame":"nova","engine":"sides","tier":2,"rounds":6,"desc":"Visual • Logic • Original","rule":"Match a shape to its side count"},{"id":"nova_sides_3","name":"Pixel Shape Circuit","category":"arcade","type":"native","nativeGame":"nova","engine":"sides","tier":3,"rounds":7,"desc":"Visual • Logic • Original","rule":"Match a shape to its side count"},{"id":"nova_sides_4","name":"Quantum Shape Circuit","category":"arcade","type":"native","nativeGame":"nova","engine":"sides","tier":4,"rounds":7,"desc":"Visual • Logic • Original","rule":"Match a shape to its side count"},{"id":"nova_sides_5","name":"Turbo Shape Circuit","category":"arcade","type":"native","nativeGame":"nova","engine":"sides","tier":5,"rounds":7,"desc":"Visual • Logic • Original","rule":"Match a shape to its side count"},{"id":"nova_sides_6","name":"Crystal Shape Circuit","category":"arcade","type":"native","nativeGame":"nova","engine":"sides","tier":6,"rounds":8,"desc":"Visual • Logic • Original","rule":"Match a shape to its side count"},{"id":"nova_sides_7","name":"Nova Shape Circuit","category":"arcade","type":"native","nativeGame":"nova","engine":"sides","tier":7,"rounds":8,"desc":"Visual • Logic • Original","rule":"Match a shape to its side count"},{"id":"nova_sides_8","name":"Cipher Shape Circuit","category":"arcade","type":"native","nativeGame":"nova","engine":"sides","tier":8,"rounds":8,"desc":"Visual • Logic • Original","rule":"Match a shape to its side count"},{"id":"nova_xor_1","name":"Neon Switch Logic","category":"puzzle","type":"native","nativeGame":"nova","engine":"xor","tier":1,"rounds":6,"desc":"Logic • Circuit • Original","rule":"Evaluate an XOR switch rule"},{"id":"nova_xor_2","name":"Orbit Switch Logic","category":"puzzle","type":"native","nativeGame":"nova","engine":"xor","tier":2,"rounds":6,"desc":"Logic • Circuit • Original","rule":"Evaluate an XOR switch rule"},{"id":"nova_xor_3","name":"Pixel Switch Logic","category":"puzzle","type":"native","nativeGame":"nova","engine":"xor","tier":3,"rounds":7,"desc":"Logic • Circuit • Original","rule":"Evaluate an XOR switch rule"},{"id":"nova_xor_4","name":"Quantum Switch Logic","category":"puzzle","type":"native","nativeGame":"nova","engine":"xor","tier":4,"rounds":7,"desc":"Logic • Circuit • Original","rule":"Evaluate an XOR switch rule"},{"id":"nova_xor_5","name":"Turbo Switch Logic","category":"puzzle","type":"native","nativeGame":"nova","engine":"xor","tier":5,"rounds":7,"desc":"Logic • Circuit • Original","rule":"Evaluate an XOR switch rule"},{"id":"nova_xor_6","name":"Crystal Switch Logic","category":"puzzle","type":"native","nativeGame":"nova","engine":"xor","tier":6,"rounds":8,"desc":"Logic • Circuit • Original","rule":"Evaluate an XOR switch rule"},{"id":"nova_xor_7","name":"Nova Switch Logic","category":"puzzle","type":"native","nativeGame":"nova","engine":"xor","tier":7,"rounds":8,"desc":"Logic • Circuit • Original","rule":"Evaluate an XOR switch rule"},{"id":"nova_xor_8","name":"Cipher Switch Logic","category":"puzzle","type":"native","nativeGame":"nova","engine":"xor","tier":8,"rounds":8,"desc":"Logic • Circuit • Original","rule":"Evaluate an XOR switch rule"},{"id":"nova_clock_1","name":"Neon Clock Shift","category":"puzzle","type":"native","nativeGame":"nova","engine":"clock","tier":1,"rounds":6,"desc":"Time • Logic • Original","rule":"Advance a clock by a given number of hours"},{"id":"nova_clock_2","name":"Orbit Clock Shift","category":"puzzle","type":"native","nativeGame":"nova","engine":"clock","tier":2,"rounds":6,"desc":"Time • Logic • Original","rule":"Advance a clock by a given number of hours"},{"id":"nova_clock_3","name":"Pixel Clock Shift","category":"puzzle","type":"native","nativeGame":"nova","engine":"clock","tier":3,"rounds":7,"desc":"Time • Logic • Original","rule":"Advance a clock by a given number of hours"},{"id":"nova_clock_4","name":"Quantum Clock Shift","category":"puzzle","type":"native","nativeGame":"nova","engine":"clock","tier":4,"rounds":7,"desc":"Time • Logic • Original","rule":"Advance a clock by a given number of hours"},{"id":"nova_clock_5","name":"Turbo Clock Shift","category":"puzzle","type":"native","nativeGame":"nova","engine":"clock","tier":5,"rounds":7,"desc":"Time • Logic • Original","rule":"Advance a clock by a given number of hours"},{"id":"nova_clock_6","name":"Crystal Clock Shift","category":"puzzle","type":"native","nativeGame":"nova","engine":"clock","tier":6,"rounds":8,"desc":"Time • Logic • Original","rule":"Advance a clock by a given number of hours"},{"id":"nova_clock_7","name":"Nova Clock Shift","category":"puzzle","type":"native","nativeGame":"nova","engine":"clock","tier":7,"rounds":8,"desc":"Time • Logic • Original","rule":"Advance a clock by a given number of hours"},{"id":"nova_clock_8","name":"Cipher Clock Shift","category":"puzzle","type":"native","nativeGame":"nova","engine":"clock","tier":8,"rounds":8,"desc":"Time • Logic • Original","rule":"Advance a clock by a given number of hours"}];
        gamesDatabase.push(...novaGames);

        const ultraBlockGame = {
            id:'ultra_block_burst', name:'Block Burst', category:'puzzle',
            type:'native', nativeGame:'specialOriginal', engine:'blockburst',
            desc:'Place shapes, clear rows and columns • Original NitroArcade'
        };
        const ultraRunnerGame = {
            id:'ultra_metro_dash', name:'Metro Dash', category:'arcade',
            type:'native', nativeGame:'specialOriginal', engine:'metrodash',
            desc:'Three-lane dodge-and-collect runner • Original NitroArcade'
        };
        const ultraVoxelGame={id:'ultra_voxel_frontier',name:'Voxel Frontier 3D',category:'arcade',type:'native',nativeGame:'specialOriginal',engine:'voxel3d',desc:'First-person 3D block world • mine, place and explore • Original NitroArcade'};
        const ultraFootballGame={id:'ultra_stadium_strike',name:'Stadium Strike 3D',category:'sports',type:'native',nativeGame:'specialOriginal',engine:'football3d',desc:'3D football • dribble, shoot, defend and score • Original NitroArcade'};
        const ultraFlightGame={id:'ultra_sky_pilot',name:'Sky Pilot 3D',category:'arcade',type:'native',nativeGame:'specialOriginal',engine:'flight3d',desc:'Full 3D flight mission • detailed airport • runway takeoff/landing • 8-ring course • clouds, mountains and scenery • 10 energy-drone targets • flight HUD'};
        const ultraMazeGame={id:'ultra_brick_maze_90s',name:'Brick Maze 95',category:'arcade',type:'native',nativeGame:'specialOriginal',engine:'brickmaze3d',desc:'Randomized first-person 90s brick labyrinth • six unique souvenirs • roaming creatures • minimap • timer • sprinting • green exit mission'};
        const ultraTheDayGame={id:'ultra_the_day',name:'School Nightmare',category:'arcade',type:'native',nativeGame:'specialOriginal',engine:'theday',desc:'3D school adventure • race for the last parking slot • escape school • football finale • Original NitroArcade'};
        const ultraNightWatchGame={id:'ultra_night_watch',name:'Night Watch',category:'arcade',type:'native',nativeGame:'specialOriginal',engine:'nightwatch',desc:'Polished security-night survival • camera network • doors • lights • power management • roaming mascots • Original NitroArcade'};
        const enemiesAndYouGame={id:'enemies_and_you',name:'Enemies and You',category:'arcade',type:'native',nativeGame:'specialOriginal',engine:'enemiesyou',desc:'Arena survival • 10 waves • bosses • upgrades • original NitroArcade'};
        const techQuizGame={id:'nitro_tech_quiz',name:'Tech Quiz',category:'quiz',type:'native',nativeGame:'specialOriginal',engine:'techquiz',desc:'Computers • AI • web • hardware • cybersecurity • NitroArcade Original'};
        gamesDatabase.push(ultraBlockGame, ultraRunnerGame, ultraVoxelGame, ultraFootballGame, ultraFlightGame, ultraMazeGame, ultraTheDayGame, ultraNightWatchGame, enemiesAndYouGame);





        gamesDatabase.push(
            {id:'smash_karts',name:'Smash Karts',category:'arcade',type:'iframe',source:'https://www.minijuegos.com/embed/smash-karts',desc:'Multiplayer kart arena • Online embed'},
            {id:'lolbeans',name:'LOLBeans',category:'arcade',type:'iframe',source:'https://www.bubbleshooter.net/embed.php?id=1654',desc:'Multiplayer obstacle race • Online embed'},
            {id:'skribbl_io',name:'Skribbl.io',category:'arcade',type:'iframe',source:'https://skribbl.io/',desc:'Multiplayer drawing and guessing • Online embed'},
            {id:'pacman_embed',name:'Pac-Man',category:'arcade',type:'iframe',source:'https://pacman.live/play.html',desc:'Classic maze arcade • Online embed'},
            {id:'mario_embed',name:'Mario',category:'arcade',type:'iframe',source:'https://fulscreenmario.github.io/',desc:'Platform adventure • Online embed'},
            {id:'slither_io',name:'Slither.io',category:'arcade',type:'iframe',source:'https://slither.io/',desc:'Multiplayer snake arena • Online'},
            {id:'deadshot_io',name:'Deadshot.io',category:'arcade',type:'iframe',source:'https://deadshot.io/',desc:'3D multiplayer shooter • Online'},
            {id:'2048_web',name:'2048',category:'arcade',type:'local2048',source:'local',desc:'Number puzzle • Online'},
            {id:'chrome_dino_web',name:'Chrome Dino',category:'arcade',type:'iframe',source:'https://chromedino.com/embed/',desc:'Endless dinosaur runner • Online'},
        );

        const favorites = new Set(JSON.parse(localStorage.getItem('crazyarcade-favorites') || '[]'));
        const playCounts = JSON.parse(localStorage.getItem('crazyarcade-play-counts') || '{}');
        let recentGames = JSON.parse(localStorage.getItem('crazyarcade-recent') || '[]');

        function saveFavorites() {
            localStorage.setItem('crazyarcade-favorites', JSON.stringify([...favorites]));
        }

        function updateFavoriteUI() {
            document.querySelectorAll('[data-fav-id]').forEach(btn => {
                const active = favorites.has(btn.dataset.favId);
                btn.classList.toggle('active', active);
                btn.textContent = active ? '★' : '☆';
            });

            const gameBtn = document.getElementById('gameFavoriteBtn');
            if (gameBtn && currentGame) {
                const active = favorites.has(currentGame.id);
                gameBtn.textContent = active ? '★ Favorited' : '☆ Favorite';
            }
        }

        function toggleFavorite(event, id) {
            event.stopPropagation();

            if (favorites.has(id)) {
                favorites.delete(id);
                showToast('Removed from favorites');
            } else {
                favorites.add(id);
                showToast('Added to favorites');
            }

            saveFavorites();
            updateFavoriteUI();
            filterGames();
        }

        function toggleCurrentFavorite() {
            if (!currentGame) return;

            if (favorites.has(currentGame.id)) {
                favorites.delete(currentGame.id);
                showToast('Removed from favorites');
            } else {
                favorites.add(currentGame.id);
                showToast('Added to favorites');
            }

            saveFavorites();
            updateFavoriteUI();
        }

        function incrementPlayCount(id) {
            playCounts[id] = (playCounts[id] || 0) + 1;
            localStorage.setItem('crazyarcade-play-counts', JSON.stringify(playCounts));
            updatePlayCounts();
        }

        function updatePlayCounts() {
            document.querySelectorAll('[data-count-id]').forEach(el => {
                const gamePlaysYippee = playCounts[el.dataset.countId] || 0;
                el.textContent = gamePlaysYippee + (gamePlaysYippee === 1 ? ' play' : ' plays');
            });
        }

        function addRecent(game) {
            recentGames = recentGames.filter(id => id !== game.id);
            recentGames.unshift(game.id);
            recentGames = recentGames.slice(0, 3);
            localStorage.setItem('crazyarcade-recent', JSON.stringify(recentGames));
            renderRecent();
        }

        function renderRecent() {
            const host = document.getElementById('recentList');
            if (!host) return;

            host.innerHTML = '';

            if (!recentGames.length) {
                host.innerHTML = '<span style="color:var(--muted);font-size:12px;">Play a game and it will appear here.</span>';
                return;
            }

            recentGames.forEach(id => {
                const game = gamesDatabase.find(g => g.id === id);
                if (!game) return;

                const btn = document.createElement('button');
                btn.className = 'recent-item';
                btn.innerHTML = '<span class="recent-dot"></span>' + game.name;
                btn.onclick = () => launchGame(game);
                host.appendChild(btn);
            });
        }

        function setLibraryFilter(filter) {
            libraryFilter = filter;

            document.getElementById('filterAll').classList.toggle('active', filter === 'all');
            document.getElementById('filterFav').classList.toggle('active', filter === 'favorites');

            filterGames();
        }

        function filterGames() {
            const query = (document.getElementById('gameSearch')?.value || '').trim().toLowerCase();
            let visibleCount = 0;
            const part = typeof currentArcadePart === 'string' ? currentArcadePart : 'small';
            document.querySelectorAll('#gameGrid .game-card').forEach(card => {
                const game = gamesDatabase.find(g => g.id === card.dataset.gameId);
                const cardPart = card.dataset.arcadePart || (card.dataset.gameId === 'hackerchallenge' ? 'challenge' : 'small');
                const title = card.querySelector('h3')?.textContent || '';
                const description = card.querySelector('.game-meta p')?.textContent || '';
                const matchesText = !query || [game?.name,game?.desc,title,description].some(v => String(v || '').toLowerCase().includes(query));
                const matchesFilter = libraryFilter === 'all' || (libraryFilter === 'favorites' && favorites.has(card.dataset.gameId));
                const visible = cardPart === part && matchesText && matchesFilter;
                card.style.setProperty('display', visible ? '' : 'none', 'important');
                card.hidden = !visible;
                if (visible) visibleCount++;
            });
            const noResults = document.getElementById('noResults');
            if (noResults) noResults.style.display = ['small','big','challenge'].includes(part) && !visibleCount ? 'block' : 'none';
        }

        function launchRandomGame() {
            const pool = gamesDatabase.filter(game => {
                if (libraryFilter === 'favorites') return favorites.has(game.id);
                return true;
            });

            if (!pool.length) {
                showToast('No games available in this filter');
                return;
            }

            const game = pool[Math.floor(Math.random() * pool.length)];
            launchGame(game);
        }

        function restartCurrentGame() {
            if (!currentGame) return;
            launchGame(currentGame);
        }

        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');

            clearTimeout(showToast.timer);
            showToast.timer = setTimeout(() => {
                toast.classList.remove('show');
            }, 1400);
        }


        function addMegaGameCards(){
            const grid=document.getElementById('gameGrid');
            if(!grid)return;
            megaGames.forEach(game=>{
                const card=document.createElement('article');
                card.className='game-card'; card.dataset.gameId=game.id; card.dataset.arcadePart='small'; card.onclick=()=>launchGame(game);
                card.innerHTML=`<button class="favorite-btn" data-fav-id="${game.id}" title="Favorite">☆</button>
                <div class="thumb thumb-newgame"><div class="thumb-label">NITROARCADE ORIGINAL</div><div class="play-pill">▶</div></div>
                <div class="game-meta"><div><h3>${game.name}</h3><p>${game.desc}</p></div><div class="meta-right"><span class="play-count" data-count-id="${game.id}">0 plays</span><div class="tag">PLAY NOW</div></div></div>`;
                card.querySelector('.favorite-btn').onclick=e=>toggleFavorite(e,game.id);
                grid.appendChild(card);
            });
        }


        function addUltraGameCards(){
            const grid=document.getElementById('gameGrid');
            if(!grid)return;
            ultraGames.forEach(game=>{
                const card=document.createElement('article');
                card.className='game-card';card.dataset.gameId=game.id; card.dataset.arcadePart='small';card.onclick=()=>launchGame(game);
                card.innerHTML=`<button class="favorite-btn" data-fav-id="${game.id}" title="Favorite">☆</button>
                <div class="thumb thumb-ultra"><div class="thumb-label">NITROARCADE ORIGINAL</div><div class="play-pill">▶</div></div>
                <div class="game-meta"><div><h3>${game.name}</h3><p>${game.desc}</p></div><div class="meta-right"><span class="play-count" data-count-id="${game.id}">0 plays</span><div class="tag">PLAY NOW</div></div></div>`;
                card.querySelector('.favorite-btn').onclick=e=>toggleFavorite(e,game.id);
                grid.appendChild(card);
            });
        }


        function addNovaGameCards(){
            const grid=document.getElementById('gameGrid');
            if(!grid)return;
            novaGames.forEach((game,index)=>{
                const card=document.createElement('article');
                card.className='game-card';
                card.dataset.gameId=game.id; card.dataset.arcadePart='small';
                card.onclick=()=>launchGame(game);
                card.innerHTML=`<button class="favorite-btn" data-fav-id="${game.id}" title="Favorite">☆</button>
                <div class="thumb thumb-nova" style="--nova-h:${(index*47)%360}"><div class="thumb-label">NEW ORIGINAL • ${game.engine.toUpperCase()}</div><div class="nova-glyph">${String(index+1).padStart(3,'0')}</div><div class="play-pill">▶</div></div>
                <div class="game-meta"><div><h3>${game.name}</h3><p>${game.desc}</p></div><div class="meta-right"><span class="play-count" data-count-id="${game.id}">0 plays</span><div class="tag">PLAY NOW</div></div></div>`;
                card.querySelector('.favorite-btn').onclick=e=>toggleFavorite(e,game.id);
                grid.appendChild(card);
            });
        }


        function addSpecialOriginalCards(){
            const grid=document.getElementById('gameGrid'); if(!grid)return;
            [ultraBlockGame,ultraRunnerGame,ultraVoxelGame,ultraFootballGame,ultraFlightGame,ultraMazeGame,ultraTheDayGame,ultraNightWatchGame,enemiesAndYouGame,techQuizGame].forEach((game,i)=>{
                const card=document.createElement('article');
                card.className='game-card'; card.dataset.gameId=game.id; card.dataset.arcadePart=['voxel3d','football3d','flight3d','brickmaze3d','theday','nightwatch','enemiesyou'].includes(game.engine)?'big':'small'; card.onclick=()=>launchGame(game);
                card.innerHTML=`<button class="favorite-btn" data-fav-id="${game.id}" title="Favorite">☆</button>
                <div class="thumb special-original-thumb ${i?'runner-thumb':'burst-thumb'}">
                    <div class="thumb-label">NITROARCADE ORIGINAL</div>
                    <div class="special-card-icon">${['▦','⇧','◫','⚽','✈','▥','🌅','📹','⚡','⌘'][i]||'⌘'}</div><div class="play-pill">▶</div>
                </div>
                <div class="game-meta"><div><h3>${game.name}</h3><p>${game.desc}</p></div>
                <div class="meta-right"><span class="play-count" data-count-id="${game.id}">0 plays</span><div class="tag">PLAY NOW</div></div></div>`;
                card.querySelector('.favorite-btn').onclick=e=>toggleFavorite(e,game.id);
                grid.appendChild(card);
            });
            filterGames();
        }


        let currentArcadePart='small';
        function showArcadePart(part){
            if(document.getElementById('aboutPage')?.classList.contains('active'))closeAboutPage();
            if(!['small','big','challenge','macro','fnaf','cool','nexus','ultra'].includes(part))part='small';
            currentArcadePart=part;
            const info={
              small:['Small Games','Detailed quick-play originals with clear goals, controls, game-specific previews and richer arcade presentation.'],
              big:['Big Games','Larger NitroArcade experiences with worlds, missions and longer sessions.'],
              challenge:['Challenge','Beat the Hacker Challenge to discover the secret game.'],
              macro:['MacroArcade Games','Eight original MacroArcade worlds plus two complete local arcade collections.'],
              fnaf:['FNAF Games','Eight unofficial browser ports from the HD FNAF collection. Internet required; embedding is not guaranteed.'],
              nexus:['NexusArcade Games','ALIN Nexus Arcade collection with its own dedicated game section.'],
              ultra:['UltraArcade Games','Ultra Gaming Arcade collection with its own dedicated game section.'],
              cool:['HexiArcade Games','Play the merged local game collections from 90s Games, Arcade Portal, RetroArcade, GH-Arcade, and Pen Fight.']
            };
            const title=document.getElementById('libraryPartTitle'),sub=document.getElementById('libraryPartSubtitle');
            if(title)title.textContent=info[part][0];if(sub)sub.textContent=info[part][1];
            ['small','big','challenge','macro','fnaf','cool','nexus','ultra'].forEach(p=>{
              const b=document.getElementById('part'+p.charAt(0).toUpperCase()+p.slice(1));
              if(b)b.classList.toggle('active',p===part);
            });
            const tools=document.getElementById('normalLibraryTools');if(tools)tools.style.display=(part==='challenge'||part==='macro'||part==='fnaf'||part==='cool'||part==='nexus'||part==='ultra')?'none':'flex';
            const macroPanel=document.getElementById('nitroMacroWorlds');if(macroPanel)macroPanel.style.display=part==='macro'?'block':'none';
            const fnafPanel=document.getElementById('nitroFnafGames');if(fnafPanel)fnafPanel.style.display=part==='fnaf'?'block':'none';
            for(const [key,id] of [['nexus','nexusArcadeSection'],['ultra','ultraArcadeSection']]){const panel=document.getElementById(id);if(panel)panel.style.display=part===key?'block':'none';}
            const coolPanel=document.getElementById('hexiArcadeSection');if(coolPanel)coolPanel.style.display=part==='cool'?'block':'none';
            const coolFrame=document.getElementById('hexiArcadeFrame');if(coolFrame){if(part==='cool'&&!coolFrame.getAttribute('src'))coolFrame.src='HexiArcade/index.html';}
            const gameGrid=document.getElementById('gameGrid');if(gameGrid)gameGrid.style.display=(part==='macro'||part==='fnaf'||part==='cool'||part==='nexus'||part==='ultra')?'none':'';
            const noResults=document.getElementById('noResults');if(noResults&&(part==='macro'||part==='fnaf'||part==='cool'||part==='nexus'||part==='ultra'))noResults.style.display='none';
            document.querySelectorAll('#gameGrid .game-card').forEach(card=>{
              const cp=card.dataset.arcadePart||(card.dataset.gameId==='hackerchallenge'?'challenge':'small');
              card.style.display=cp===part?'':'none';
            });
            filterGames();
            const section=document.getElementById('featuredSection');if(section)section.scrollIntoView({behavior:'smooth',block:'start'});
        }

        function sortLibrary(mode){
            const grid=document.getElementById('gameGrid'); if(!grid)return;
            const cards=[...grid.querySelectorAll('.game-card')];
            const plays=JSON.parse(localStorage.getItem('crazyarcade-play-counts')||'{}');
            const favs=JSON.parse(localStorage.getItem('crazyarcade-favorites')||'[]');
            cards.sort((a,b)=>{
                const ga=gamesDatabase.find(g=>g.id===a.dataset.gameId), gb=gamesDatabase.find(g=>g.id===b.dataset.gameId);
                if(mode==='az') return (ga?.name||'').localeCompare(gb?.name||'');
                if(mode==='plays') return (plays[b.dataset.gameId]||0)-(plays[a.dataset.gameId]||0);
                if(mode==='favorites') return Number(favs.includes(b.dataset.gameId))-Number(favs.includes(a.dataset.gameId));
                return gamesDatabase.findIndex(g=>g.id===a.dataset.gameId)-gamesDatabase.findIndex(g=>g.id===b.dataset.gameId);
            });
            cards.forEach(c=>grid.appendChild(c));
        }

        function toggleFeatureDrawer(){
            document.getElementById('featureDrawer')?.classList.toggle('show');
            updateProfileFeatures();
        }

        function updateProfileFeatures(){
            const plays=JSON.parse(localStorage.getItem('crazyarcade-play-counts')||'{}');
            const favs=JSON.parse(localStorage.getItem('crazyarcade-favorites')||'[]');
            const recent=JSON.parse(localStorage.getItem('crazyarcade-recent')||'[]');
            const total=Object.values(plays).reduce((a,b)=>a+Number(b||0),0);
            const played=Object.keys(plays).filter(k=>plays[k]>0).length;
            const stats=document.getElementById('profileStats');
            if(stats)stats.textContent=`${total} total launches • ${played} different games played • ${favs.length} favorites • ${recent.length} recent`;
            const achievements=[
                ['FIRST BOOT','Launch your first game',total>=1],
                ['ARCADE TOURIST','Play 5 different games',played>=5],
                ['ARCADE EXPLORER','Play 15 different games',played>=15],
                ['GAME HOPPER','Launch games 25 times',total>=25],
                ['SUPER PLAYER','Launch games 75 times',total>=75],
                ['COLLECTOR','Favorite 5 games',favs.length>=5],
                ['MEGA COLLECTOR','Favorite 15 games',favs.length>=15]
            ];
            const list=document.getElementById('achievementList');
            if(list)list.innerHTML=achievements.map(a=>`<div class="achievement ${a[2]?'unlocked':''}">${a[2]?'✓':'○'} <b>${a[0]}</b><br><span style="color:var(--muted)">${a[1]}</span></div>`).join('');
        }

        function resetArcadeStats(){
            if(!confirm('Reset local NitroArcade play counts, favorites and recent games?'))return;
            localStorage.removeItem('crazyarcade-play-counts');
            localStorage.removeItem('crazyarcade-favorites');
            localStorage.removeItem('crazyarcade-recent');
            location.reload();
        }


        const SECRET_WINDOSILL_SOURCE = 'games/windosill.swf';
        const SECRET_WINDOSILL_KEY = 'crazyarcade-secret-windosill';

        function isWindosillUnlocked(){
            return localStorage.getItem(SECRET_WINDOSILL_KEY) === 'unlocked';
        }

        function unlockWindosill(){
            localStorage.setItem(SECRET_WINDOSILL_KEY, 'unlocked');
            showToast('SECRET ARCADE UNLOCKED: FLASH GAMES!');
            updateWindosillShortcut();
        }

        function updateWindosillShortcut(){
            const card=document.querySelector('[data-game-id="hackerchallenge"]');
            if(!card)return;
            let bar=card.querySelector('.windosill-quick-access');
            if(!bar){
                bar=document.createElement('div');
                bar.className='windosill-quick-access';
                card.appendChild(bar);
            }
            if(isWindosillUnlocked()){
                bar.innerHTML='<span>🏆 CYBERARCADE VETERAN <small>Flash Games unlocked permanently in this browser</small></span><button type="button" class="windosill-play">⚡ OPEN FLASH GAMES →</button>';
                bar.querySelector('button').onclick=(event)=>{event.stopPropagation();openFlashArcade()};
            }else{
                bar.innerHTML='<span>🔐 CYBERARCADE LEGACY <small>Beat all three trials once to unlock Flash Games forever</small></span><span class="windosill-locked">LOCKED</span>';
            }
        }

        function getEmbeddedWindosillBytes(){
            const encoded=document.getElementById('nitro-windosill-swf-bytes').textContent.trim();
            const raw=atob(encoded);
            const bytes=new Uint8Array(raw.length);
            for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
            return bytes;
        }

        async function launchSecretWindosill(){
            if(!isWindosillUnlocked()){
                showToast('Complete the Hacker Challenge to unlock Windosill.');
                return;
            }
            cleanupPlayer();
            currentGame={id:'secret_windosill',name:'Windosill',category:'secret',type:'swf',desc:'Secret Game • Unlocked'};
            dashboardView.style.display='none';
            gameView.style.display='flex';
            activeTitle.innerText='SECRET // WINDOSILL';
            playerContainer.replaceChildren();
            playerContainer.style.position='relative';
            const message=document.createElement('div');
            message.style.cssText='width:100%;min-height:450px;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;color:#cbd5e1;background:#090b19;box-sizing:border-box;';
            message.textContent='🪟 Starting Windosill…';
            playerContainer.appendChild(message);
            try{
                if(!window.RufflePlayer || !window.RufflePlayer.newest){
                    throw new Error('Ruffle has not loaded. Check your internet connection and reload NitroArcade.');
                }
                const bytes=getEmbeddedWindosillBytes();
                const ruffle=window.RufflePlayer.newest();
                const player=ruffle.createPlayer();
                player.config={allowScriptAccess:false,menu:false,autoplay:'auto'};
                player.style.cssText='width:100%;height:100%;min-height:450px;display:block;';
                activeRufflePlayer=player;
                playerContainer.replaceChildren(player);
                await player.load({data:bytes});
                showToast('Windosill unlocked and loaded!');
            }catch(error){
                if(activeRufflePlayer){try{activeRufflePlayer.remove()}catch(e){}activeRufflePlayer=null;}
                playerContainer.replaceChildren(message);
                message.textContent='Windosill could not start: '+(error?.message||String(error));
                const retry=document.createElement('button');
                retry.textContent='↻ Retry Windosill';
                retry.style.cssText='margin:16px;padding:12px 18px;background:#6231b8;color:white;border:0;border-radius:10px;cursor:pointer;';
                retry.onclick=launchSecretWindosill;
                message.appendChild(document.createElement('br'));
                message.appendChild(retry);
            }
            updateCurrentFavoriteVisibility?.();
        }

        function featureHackerCard(){
            const grid=document.getElementById('gameGrid');
            if(!grid)return;
            const card=grid.querySelector('[data-game-id="hackerchallenge"]');
            if(!card)return;
            card.classList.add('hacker-featured');
            grid.prepend(card);
            const label=card.querySelector('.thumb-label');
            if(label) label.textContent='CYBERARCADE LEGACY • SECRET GAME INSIDE';
            updateWindosillShortcut();
        }


        const PRIZE_KEY='crazyarcade-prizes';
        function getPrizes(){return Math.max(0,parseInt(localStorage.getItem(PRIZE_KEY)||'0',10)||0)}
        function updatePrizeCounter(){const el=document.getElementById('prizeCount');if(el)el.textContent=getPrizes()}
        function awardPrizes(amount,reason){
            amount=Math.max(0,Math.floor(amount||0));if(!amount)return;
            localStorage.setItem(PRIZE_KEY,String(getPrizes()+amount));updatePrizeCounter();
            showToast(`🏆 +${amount} prize${amount===1?'':'s'}${reason?' • '+reason:''}`);
        }

        function addPremiumCards(){
            const grid=document.getElementById('gameGrid');if(!grid)return;
            premiumGames.forEach(game=>{
                const card=document.createElement('article');card.className='game-card';card.dataset.gameId=game.id; card.dataset.arcadePart='small';card.onclick=()=>launchGame(game);
                card.innerHTML=`<button class="favorite-btn" data-fav-id="${game.id}" title="Favorite">☆</button><div class="thumb premium-thumb"><div class="thumb-label">NEW • NITROARCADE ORIGINAL</div><div class="play-pill">▶</div></div><div class="game-meta"><div><h3>${game.name}</h3><p>${game.desc}</p></div><div class="meta-right"><span class="play-count" data-count-id="${game.id}">0 plays</span><div class="tag">PLAY NOW</div></div></div>`;
                card.querySelector('.favorite-btn').onclick=e=>toggleFavorite(e,game.id);grid.appendChild(card);
            });
        }



        function openAboutPage(event){
            if(event)event.preventDefault();
            cleanupPlayer();
            const main=document.querySelector('main.page');
            const about=document.getElementById('aboutPage');
            if(main) main.style.display='none';
            if(about){about.style.display='block';about.classList.add('active');}
            window.scrollTo(0,0);
        }
        function closeAboutPage(){
            const main=document.querySelector('main.page');
            const about=document.getElementById('aboutPage');
            if(about){about.classList.remove('active');about.style.display='none';}
            if(main) main.style.display='';
            window.scrollTo(0,0);
        }


        function addUniqueVisualToEveryCard(){
            const styles=['orbit','scan','grid','pulse','rain','radar','shards','wavefx','cross','bars'];
            document.querySelectorAll('.game-card').forEach((card,index)=>{
                const thumb=card.querySelector('.thumb');
                if(!thumb || thumb.querySelector('.card-vfx')) return;
                const key=(card.dataset.gameId || card.querySelector('h3')?.textContent || String(index));
                let hash=0;
                for(let i=0;i<key.length;i++) hash=((hash<<5)-hash+key.charCodeAt(i))|0;
                const style=styles[Math.abs(hash)%styles.length];
                const layer=document.createElement('div');
                layer.className='card-vfx vfx-'+style;
                layer.setAttribute('aria-hidden','true');
                layer.innerHTML='<span class="vfx-a"></span><span class="vfx-b"></span><span class="vfx-c"></span>';
                thumb.prepend(layer);

                const speed=(2.2+(Math.abs(hash)%19)/10).toFixed(1)+'s';
                layer.style.setProperty('--card-vfx-speed',speed);
            });
        }


        function customArtMarkup(gameId,name){
            const s=(gameId+' '+name).toLowerCase();
            const grid='<span class="gridbg"></span>';
            if(s.includes('hacker')) return grid+'<div class="art-hacker"></div>';
            if(s.includes('golf')) return grid+'<div class="art-golf"></div><span class="ball" style="left:25%;top:58%"></span>';
            if(s.includes('pong')) return grid+'<div class="art-pong"><i class="p1"></i><i class="p2"></i><span class="ball"></span></div>';
            if(s.includes('brick')||s.includes('breakout')) return grid+'<div class="art-bricks">'+('<i></i>'.repeat(24))+'</div><span class="ball" style="left:53%;top:70%"></span>';
            if(s.includes('snake')) return grid+'<div class="art-snake"><i></i><i></i><i></i><i></i><i></i></div><span class="target" style="right:18%;top:43%"></span>';
            if(s.includes('space')||s.includes('blaster')||s.includes('asteroid')||s.includes('comet')) return grid+'<div class="art-ship"></div><span class="target" style="right:19%;top:22%"></span><span class="target" style="left:18%;top:30%;transform:scale(.55)"></span>';
            if(s.includes('maze')||s.includes('path')) return grid+'<div class="art-maze"></div><span class="ball" style="left:18%;bottom:22%"></span>';
            if(s.includes('memory')||s.includes('simon')) return grid+'<div class="art-cards"><i></i><i></i><i></i><i></i></div>';
            if(s.includes('race')||s.includes('racer')||s.includes('lane')) return grid+'<div class="art-road"></div><span class="block" style="left:44%;bottom:25%;width:25px;height:42px"></span>';
            if(s.includes('platform')||s.includes('hopper')||s.includes('jump')||s.includes('gravity')) return grid+'<div class="art-platforms"><i></i><i></i><i></i></div><span class="ball" style="left:48%;top:33%"></span>';
            if(s.includes('animal')||s.includes('merge')) return grid+'<div class="art-merge">'+('<i></i>'.repeat(9))+'</div>';
            if(s.includes('physics')||s.includes('orbital')||s.includes('ball')) return grid+'<div class="art-rings"></div><span class="ball" style="left:23%;top:30%"></span>';
            if(s.includes('word')||s.includes('anagram')||s.includes('scramble')) return grid+'<div class="art-word">'+(name.replace(/[^A-Za-z]/g,'').slice(0,6).toUpperCase()||'WORDS')+'</div>';
            if(s.includes('quiz')||s.includes('math')||s.includes('number')) return grid+'<div class="art-question">?</div>';
            if(s.includes('reaction')||s.includes('aim')||s.includes('target')||s.includes('whack')) return grid+'<span class="target" style="left:45%;top:38%"></span><span class="target" style="left:22%;top:65%;transform:scale(.6)"></span><span class="target" style="right:18%;top:25%;transform:scale(.45)"></span>';
            if(s.includes('rhythm')||s.includes('signal')) return grid+'<div class="art-bars">'+Array.from({length:14},(_,i)=>`<i style="height:${28+(i*17)%92}px"></i>`).join('')+'</div>';
            if(s.includes('connect')||s.includes('tic')||s.includes('tile')||s.includes('block')) return grid+'<div class="art-merge">'+('<i></i>'.repeat(9))+'</div>';
            if(s.includes('laser')||s.includes('dodge')||s.includes('escape')||s.includes('firewall')||s.includes('void')) return grid+'<span class="line" style="left:13%;right:13%;top:28%;transform:rotate(13deg)"></span><span class="line" style="left:18%;right:8%;top:63%;transform:rotate(-17deg)"></span><span class="ball" style="left:48%;top:46%"></span>';
            if(s.includes('catch')||s.includes('star')||s.includes('gem')||s.includes('moon')) return grid+'<div class="art-nodes"><i></i><i></i><i></i><i></i></div><span class="block" style="left:42%;bottom:18%;width:90px"></span>';
            const initials=name.split(/\s+/).map(w=>w[0]).join('').slice(0,3).toUpperCase();
            return grid+`<div class="art-label">${initials}</div><div class="art-nodes"><i></i><i></i><i></i><i></i></div>`;
        }

        function addCustomArtToEveryGame(){
            document.querySelectorAll('.game-card').forEach((card,index)=>{
                const thumb=card.querySelector('.thumb'); if(!thumb)return;
                if(card.dataset.arcadePart==='small')return;
                if(card.dataset.gameId?.startsWith('viz_'))return;
                thumb.querySelectorAll('.card-vfx').forEach(n=>n.remove());
                if(thumb.querySelector('.custom-game-art'))return;
                const name=card.querySelector('h3')?.textContent?.trim() || 'Arcade Game';
                const id=card.dataset.gameId || ('game_'+index);
                const art=document.createElement('div');
                art.className='custom-game-art anim';
                art.setAttribute('aria-hidden','true');
                art.innerHTML=customArtMarkup(id,name);
                thumb.prepend(art);
            });
        }



        function nitroHashHue(text){
            let hash=0;
            const s=String(text||'nitro');
            for(let i=0;i<s.length;i++)hash=((hash<<5)-hash+s.charCodeAt(i))|0;
            return Math.abs(hash)%360;
        }

        function nitroSmallEngine(game){
            return String((game&&game.engine)||(game&&game.nativeGame)||'arcade').toLowerCase();
        }

        function nitroSmallInfo(game){
            const e=nitroSmallEngine(game);
            const exact={
                snake:{summary:'Guide a growing snake through a compact arena, collect pickups and survive without hitting your own trail.',goal:'Grow as long as possible',controls:'Arrow keys / WASD',pace:'SKILL'},
                brick:{summary:'Keep the ball in play, angle your paddle returns and clear the full brick formation.',goal:'Clear every brick',controls:'Mouse / arrows',pace:'CLASSIC'},
                golf:{summary:'Line up each shot, judge the bounce and sink the ball while keeping your stroke count low.',goal:'Finish in few strokes',controls:'Aim + click',pace:'PHYSICS'},
                blockgrid:{summary:'Place incoming shapes efficiently and complete full rows or columns before the board runs out of space.',goal:'Clear lines for score',controls:'Click / tap',pace:'STRATEGY'},
                merge:{summary:'Drop matching animals together, create higher tiers and keep the container from overflowing.',goal:'Build the highest merge',controls:'Move + drop',pace:'PHYSICS'},
                balllab:{summary:'Experiment with bouncing balls, gravity and collisions in a compact physics sandbox.',goal:'Experiment and survive',controls:'Mouse / touch',pace:'SANDBOX'},
                pong:{summary:'Defend your side, read the ball angle and outscore the opposing paddle.',goal:'Win the rally score',controls:'W/S or arrows',pace:'SPORT'},
                shooter:{summary:'Pilot through incoming threats, line up shots and clear targets before they overwhelm the lane.',goal:'Destroy incoming targets',controls:'Move + fire',pace:'ACTION'},
                flappy:{summary:'Thread a tiny flyer through narrow gaps using short, carefully timed boosts.',goal:'Pass the obstacles',controls:'Click / Space',pace:'TIMING'},
                maze:{summary:'Read the maze quickly, avoid dead ends and reach the exit in the shortest route you can find.',goal:'Reach the exit',controls:'Arrow keys / WASD',pace:'PUZZLE'},
                connect4:{summary:'Plan several moves ahead and connect four pieces before the CPU blocks your line.',goal:'Connect four',controls:'Click a column',pace:'STRATEGY'},
                tictac:{summary:'Build a three-in-a-row line while anticipating the CPU response.',goal:'Make three in a row',controls:'Click a cell',pace:'STRATEGY'},
                whack:{summary:'React to appearing targets and build a clean hit streak before the timer ends.',goal:'Hit every target',controls:'Mouse / touch',pace:'REFLEX'},
                jumper:{summary:'Jump from platform to platform, maintain momentum and avoid falling out of the course.',goal:'Climb the platforms',controls:'A/D + Space',pace:'PLATFORM'},
                racer:{summary:'Hold your racing line, avoid traffic and reach the finish without throwing away speed.',goal:'Reach the finish',controls:'Arrow keys / WASD',pace:'RACING'},
                mines:{summary:'Use number clues to uncover safe cells while avoiding hidden mines.',goal:'Clear the safe grid',controls:'Click / flag',pace:'LOGIC'},
                snake2:{summary:'Survive a tighter snake arena where every turn matters and space disappears quickly.',goal:'Stay alive and grow',controls:'Arrow keys / WASD',pace:'SURVIVAL'},
                stack:{summary:'Drop moving blocks with precision and keep the tower balanced as the target gets narrower.',goal:'Build the tallest stack',controls:'Click / Space',pace:'PRECISION'},
                laserdodge:{summary:'Read warning lines and move through safe gaps before the lasers activate.',goal:'Survive the laser field',controls:'Arrow keys / WASD',pace:'DODGE'},
                orbit:{summary:'Protect the center by tracking threats around a circular orbit and intercepting them in time.',goal:'Hold the orbit',controls:'Move / aim',pace:'DEFENSE'},
                colorswitch:{summary:'Match the active color at the correct moment and avoid passing through the wrong gate.',goal:'Match every gate',controls:'Click / Space',pace:'TIMING'},
                gravity:{summary:'Flip gravity at the right moment to land on safe surfaces and avoid hazards.',goal:'Reach the end',controls:'Click / Space',pace:'GRAVITY'},
                slide:{summary:'Rearrange the scrambled board one tile at a time until the original layout is restored.',goal:'Restore the board',controls:'Click tiles',pace:'PUZZLE'},
                scramble:{summary:'Reorder shuffled letters into the correct word before the round counter runs out.',goal:'Solve every word',controls:'Keyboard / click',pace:'WORD'},
                lane:{summary:'React to lane prompts quickly and shift into the safe route before the window closes.',goal:'Win the reaction race',controls:'Left / right',pace:'REFLEX'},
                pairs:{summary:'Memorize card positions, reveal matching pairs and clear the board efficiently.',goal:'Match every pair',controls:'Click cards',pace:'MEMORY'},
                catch:{summary:'Track falling objects, move the catcher underneath them and build a clean collection streak.',goal:'Catch the target total',controls:'Left / right',pace:'ARCADE'},
                avoid:{summary:'Read incoming hazard patterns and keep your player inside the safe gaps.',goal:'Survive the target time',controls:'Arrow keys / WASD',pace:'DODGE'},
                breakout:{summary:'Control the paddle, shape the rebound angle and break the entire formation.',goal:'Clear the brick field',controls:'Mouse / arrows',pace:'ARCADE'},
                simon:{summary:'Watch the light sequence, remember the order and reproduce it without a mistake.',goal:'Repeat the sequence',controls:'Click the pads',pace:'MEMORY'},
                aim:{summary:'Acquire each target quickly and accurately before the hit requirement expires.',goal:'Hit all targets',controls:'Mouse / touch',pace:'AIM'},
                anagram:{summary:'Unscramble each letter set and enter the hidden word before the round ends.',goal:'Solve every anagram',controls:'Keyboard',pace:'WORD'},
                math2:{summary:'Solve rapid-fire arithmetic rounds while the challenge gradually speeds up.',goal:'Answer every round',controls:'Keyboard / click',pace:'MATH'},
                path:{summary:'Study the grid and route the player from the start node to the goal without trapping yourself.',goal:'Find the valid route',controls:'Click / arrows',pace:'LOGIC'},
                rhythm:{summary:'Follow the beat markers and tap inside the timing window to build a streak.',goal:'Hit the full beat set',controls:'Click / Space',pace:'RHYTHM'},
                lane2:{summary:'Switch lanes through traffic, preserve your run and reach the target distance.',goal:'Reach the distance goal',controls:'Left / right',pace:'RACING'},
                blockburst:{summary:'Fit block shapes into the board and create full lines before available space disappears.',goal:'Clear rows and columns',controls:'Click / tap',pace:'PUZZLE'},
                metrodash:{summary:'Sprint through three lanes, dodge obstacles and collect pickups without breaking your run.',goal:'Run as far as possible',controls:'Arrows / WASD',pace:'RUNNER'},
                techquiz:{summary:'Answer a rotating set of computer, AI, web, hardware and cybersecurity questions.',goal:'Score 10/10',controls:'Click answers',pace:'QUIZ'}
            };
            if(exact[e])return exact[e];

            const nova={
                largest:['Pick the largest value from each fast-changing set.','Choose the largest value','Click an option','NUMBER'],
                smallest:['Pick the smallest value before moving to the next set.','Choose the smallest value','Click an option','NUMBER'],
                closest:['Estimate which value is closest to the target.','Find the closest value','Click an option','NUMBER'],
                odd:['Identify the odd number hidden among the choices.','Find the odd number','Click an option','NUMBER'],
                even:['Identify the even number hidden among the choices.','Find the even number','Click an option','NUMBER'],
                prime:['Recognize prime numbers quickly across escalating rounds.','Find the prime value','Click an option','NUMBER'],
                sum:['Calculate the requested sum and select the matching answer.','Solve the sum','Click an option','MATH'],
                difference:['Calculate the difference and choose the correct result.','Solve the difference','Click an option','MATH'],
                sequence:['Read the number pattern and predict the next value.','Continue the sequence','Click an option','LOGIC'],
                missing:['Find the missing value in a short numerical pattern.','Fill the missing value','Click an option','LOGIC'],
                wordlen:['Compare words and identify the requested length.','Judge word length','Click an option','WORD'],
                vowels:['Count vowels accurately across quick word rounds.','Count the vowels','Click an option','WORD'],
                alphabet:['Use alphabetical order to identify the correct choice.','Order the words','Click an option','WORD'],
                symbols:['Read a symbol rule and choose the matching result.','Decode the symbol rule','Click an option','LOGIC'],
                coordinate:['Interpret simple coordinate prompts and identify the right point.','Read the coordinate','Click an option','GRID'],
                fraction:['Compare fraction values and choose the correct relationship.','Compare fractions','Click an option','MATH'],
                binary:['Translate small binary values into the requested answer.','Decode the binary','Click an option','LOGIC'],
                sides:['Use shape properties to identify the correct number of sides.','Identify the shape value','Click an option','GEOMETRY'],
                xor:['Evaluate an XOR switch rule and select the correct output.','Evaluate the XOR rule','Click an option','CIRCUIT'],
                clock:['Advance the clock by the requested number of hours.','Solve the clock shift','Click an option','TIME']
            };
            if(nova[e]){
                return {summary:nova[e][0],goal:nova[e][1],controls:nova[e][2],pace:nova[e][3]};
            }
            return {summary:'A compact NitroArcade original built for a quick score chase and replayable short sessions.',goal:'Beat the game objective',controls:'Keyboard / mouse',pace:'ARCADE'};
        }

        function nitroSmallScene(game){
            const e=nitroSmallEngine(game);
            const map={
                snake:'snake',snake2:'snake',
                brick:'breakout',breakout:'breakout',
                catch:'catch',
                avoid:'dodge',laserdodge:'dodge',
                simon:'memory',pairs:'memory',
                aim:'target',whack:'target',
                anagram:'word',scramble:'word',
                largest:'number',smallest:'number',closest:'number',odd:'number',even:'number',prime:'number',sum:'number',difference:'number',sequence:'number',missing:'number',wordlen:'word',vowels:'word',alphabet:'word',symbols:'number',coordinate:'maze',fraction:'number',binary:'number',sides:'number',xor:'number',clock:'number',
                math2:'number',
                path:'maze',maze:'maze',mines:'maze',
                rhythm:'rhythm',
                lane2:'racer',racer:'racer',lane:'racer',
                pong:'pong',
                shooter:'space',
                flappy:'flappy',
                connect4:'board',tictac:'board',slide:'board',blockgrid:'board',blockburst:'board',merge:'board',
                jumper:'platform',gravity:'platform',
                stack:'stack',
                orbit:'orbit',balllab:'orbit',colorswitch:'orbit',
                golf:'golf',
                metrodash:'runner',
                techquiz:'quiz'
            };
            return map[e]||'board';
        }

        function nitroSmallSceneMarkup(scene){
            if(scene==='snake')return '<div class="snake-chain">'+('<i></i>'.repeat(6))+'</div><span class="food"></span>';
            if(scene==='breakout')return '<div class="brickfield">'+('<i></i>'.repeat(21))+'</div><span class="paddle"></span><span class="orb"></span>';
            if(scene==='catch')return '<span class="catcher"></span><span class="fall a"></span><span class="fall b"></span><span class="fall c"></span>';
            if(scene==='dodge')return '<span class="shot-player"></span><i class="haz h1"></i><i class="haz h2"></i>';
            if(scene==='memory')return '<div class="pads"><i></i><i></i><i></i><i></i></div>';
            if(scene==='target')return '<span class="targetring t1"></span><span class="targetring t2"></span><span class="targetring t3"></span>';
            if(scene==='number')return '<div class="equation">12 × 7 = ?</div><div class="answer">84</div>';
            if(scene==='word')return '<div class="letters"><i>N</i><i>I</i><i>T</i><i>R</i><i>O</i></div>';
            if(scene==='maze')return '<div class="mazegrid"></div><span class="shot-player"></span><span class="goal"></span>';
            if(scene==='rhythm')return '<div class="lanes"><i></i><i></i><i></i><i></i></div><span class="note n1"></span><span class="note n2"></span><span class="note n3"></span>';
            if(scene==='racer')return '<div class="road"></div><span class="car c1"></span><span class="car c2"></span><span class="car c3"></span>';
            if(scene==='pong')return '<span class="bat p1"></span><span class="bat p2"></span><span class="orb"></span>';
            if(scene==='space')return '<span class="ship"></span><i class="asteroid a1"></i><i class="asteroid a2"></i><i class="asteroid a3"></i>';
            if(scene==='flappy')return '<span class="bird"></span><span class="pipe p1"></span><span class="pipe p2"></span>';
            if(scene==='platform')return '<i class="plat a"></i><i class="plat b"></i><i class="plat c"></i><span class="shot-player"></span>';
            if(scene==='stack')return '<div class="tower"><i style="width:86px"></i><i style="width:75px"></i><i style="width:65px"></i><i style="width:56px"></i><i style="width:45px"></i></div>';
            if(scene==='orbit')return '<span class="ring"></span><span class="planet"></span>';
            if(scene==='golf')return '<span class="green"></span><span class="flag"></span><span class="ball"></span>';
            if(scene==='runner')return '<span class="track"></span><span class="runner"></span><span class="crate"></span>';
            if(scene==='quiz')return '<div class="quizpanel"><b>WHICH COMPONENT STORES DATA?</b><i></i><i></i><i></i></div>';
            return '<div class="boardgrid">'+('<i></i>'.repeat(16))+'</div>';
        }

        function nitroBuildSmallThumb(game,index){
            const info=nitroSmallInfo(game);
            const scene=nitroSmallScene(game);
            const hue=nitroHashHue(game.id||game.name||index);
            const level=game.tier?('TIER '+game.tier):(game.speed?('SPEED '+game.speed):(game.rounds?('ROUNDS '+game.rounds):info.pace));
            return '<div class="small-game-shot" style="--shot-h:'+hue+'">'+
                '<div class="shot-hud"><span>NITROARCADE // '+info.pace+'</span><b>'+level+'</b></div>'+
                '<div class="shot-stage scene-'+scene+'">'+nitroSmallSceneMarkup(scene)+'</div>'+
                '<div class="shot-footer"><b>'+info.goal+'</b><span>'+info.controls+'</span></div>'+
                '<div class="thumb-label">ORIGINAL • '+info.pace+'</div><div class="play-pill">▶</div>'+
            '</div>';
        }

        function upgradeSmallGameCards(){
            const cards=[...document.querySelectorAll('#gameGrid .game-card[data-arcade-part="small"]')];
            cards.forEach((card,index)=>{
                const id=card.dataset.gameId;
                const game=gamesDatabase.find(g=>g.id===id);
                if(!game)return;
                const info=nitroSmallInfo(game);
                card.classList.add('small-game-card-v3');
                card.dataset.engine=nitroSmallEngine(game);
                card.tabIndex=0;
                card.setAttribute('role','button');
                card.setAttribute('aria-label','Play '+game.name+'. '+info.summary+' Goal: '+info.goal+'. Controls: '+info.controls+'.');
                if(!card.dataset.nitroKeyboard){
                    card.dataset.nitroKeyboard='1';
                    card.addEventListener('keydown',ev=>{
                        if((ev.key==='Enter'||ev.key===' ') && ev.target===card){
                            ev.preventDefault();
                            launchGame(game);
                        }
                    });
                }

                const thumb=card.querySelector('.thumb');
                if(thumb)thumb.innerHTML=nitroBuildSmallThumb(game,index);

                const left=card.querySelector('.game-meta>div:first-child');
                if(left&&!left.querySelector('.small-card-detail')){
                    const detail=document.createElement('div');
                    detail.className='small-card-detail';
                    detail.textContent=info.summary;
                    const specs=document.createElement('div');
                    specs.className='small-card-specs';
                    specs.innerHTML='<span><b>GOAL</b>'+info.goal+'</span><span><b>CONTROL</b>'+info.controls+'</span><span><b>STYLE</b>'+info.pace+'</span>';
                    left.append(detail,specs);
                }
            });
        }

        function updateGameDetailStrip(game){
            const strip=document.getElementById('gameDetailStrip');
            if(!strip)return;
            const isSmall=!!(game && document.querySelector('.game-card[data-game-id="'+game.id+'"][data-arcade-part="small"]'));
            if(!isSmall){strip.hidden=true;return}
            const info=nitroSmallInfo(game);
            strip.hidden=false;
            document.getElementById('gameDetailSummary').textContent=info.summary;
            document.getElementById('gameDetailGoal').textContent=info.goal;
            document.getElementById('gameDetailControls').textContent=info.controls;
            document.getElementById('gameDetailStyle').textContent=info.pace+(game.tier?' • Tier '+game.tier:'');
        }


        const TOY_KEY='crazyarcade-owned-toys';
        const TOYS=[
            {id:'rubber_duck',name:'Pixel Duck',icon:'🐤',price:3,desc:'A tiny arcade desk duck.'},
            {id:'robot',name:'Pocket Bot',icon:'🤖',price:5,desc:'A miniature NitroArcade robot.'},
            {id:'ufo',name:'Mini UFO',icon:'🛸',price:7,desc:'Definitely from somewhere suspicious.'},
            {id:'bear',name:'Arcade Bear',icon:'🐻',price:8,desc:'Soft, collectible and extremely serious.',art:`<svg viewBox="0 0 120 120" width="82" height="82" aria-label="Arcade Bear"><circle cx="32" cy="30" r="18" fill="#8b5a3c"/><circle cx="88" cy="30" r="18" fill="#8b5a3c"/><circle cx="60" cy="58" r="42" fill="#a86f48"/><circle cx="46" cy="52" r="5" fill="#111"/><circle cx="74" cy="52" r="5" fill="#111"/><ellipse cx="60" cy="70" rx="18" ry="14" fill="#d6a277"/><circle cx="60" cy="66" r="5" fill="#17120f"/><path d="M52 76 Q60 83 68 76" fill="none" stroke="#17120f" stroke-width="4" stroke-linecap="round"/><rect x="29" y="91" width="62" height="20" rx="10" fill="#a86f48"/></svg>`},
            {id:'rocket',name:'Desk Rocket',icon:'🚀',price:10,desc:'For very important imaginary launches.'},
            {id:'dino',name:'Neon Dino',icon:'🦖',price:12,desc:'A prehistoric prize-counter legend.'},
            {id:'crystal',name:'Mystery Crystal',icon:'💎',price:15,desc:'Nobody knows what it actually does.'},
            {id:'crown',name:'Arcade Crown',icon:'👑',price:20,desc:'The ridiculous final shelf flex.'}
        ];
        function ownedToys(){try{return JSON.parse(localStorage.getItem(TOY_KEY)||'[]')}catch(e){return []}}
        function saveOwnedToys(v){localStorage.setItem(TOY_KEY,JSON.stringify(v))}
        function renderToyShop(){
            const balance=getPrizes(),owned=ownedToys(),grid=document.getElementById('toyGrid'),inv=document.getElementById('toyInventory');
            const sb=document.getElementById('shopBalance');if(sb)sb.textContent=balance;
            if(grid)grid.innerHTML=TOYS.map(t=>{const has=owned.includes(t.id);return `<article class="toy-card"><div class="toy-art">${t.art||t.icon}</div><h3>${t.name}</h3><p>${t.desc}</p><div class="toy-price">🏆 ${t.price}</div><button class="toy-buy ${has?'toy-owned':''}" data-toy="${t.id}" ${has||balance<t.price?'disabled':''}>${has?'OWNED':balance<t.price?'NEED '+(t.price-balance)+' MORE':'BUY TOY'}</button></article>`}).join('');
            grid?.querySelectorAll('[data-toy]').forEach(b=>b.addEventListener('click',()=>buyToy(b.dataset.toy)));
            if(inv)inv.innerHTML=owned.length?owned.map(id=>{const t=TOYS.find(x=>x.id===id);return t?`<span class="inventory-item">${t.icon} ${t.name}</span>`:''}).join(''):'<span class="inventory-item">No toys yet — earn some prizes!</span>';
        }
        function buyToy(id){
            const toy=TOYS.find(t=>t.id===id),owned=ownedToys();
            if(!toy || owned.includes(id)) return;
            const balance=getPrizes();
            if(balance<toy.price){showToast('Not enough prizes yet');return;}
            localStorage.setItem(PRIZE_KEY,String(balance-toy.price));
            owned.push(id);
            saveOwnedToys(owned);
            updatePrizeCounter();
            renderToyShop();
            showToast(`🧸 ${toy.name} added to your toy shelf!`);
        }
        function openToyShop(){
            const shop=document.getElementById('toyShop');
            if(!shop){ if(typeof showToast==='function') showToast('Prize shop unavailable'); return; }
            renderToyShop();
            shop.style.display='flex';
            shop.classList.add('show','active');
        }

        function cleanupPlayer() {
            stopNativeGame();
            if (activeRufflePlayer) {
                try {
                    activeRufflePlayer.remove();
                } catch (e) {}
                activeRufflePlayer = null;
            }

            playerContainer.innerHTML = '';
        }


        function startNitro2048(host) {
            const shell = document.createElement('div');
            shell.style.cssText = 'width:100%;height:100%;overflow:auto;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:15px;background:#12101d;color:#fff;padding:18px;font-family:Arial,sans-serif';
            shell.innerHTML = '<h2 style="font-size:34px;margin:0">2048</h2><p style="color:#aaa;margin:0">Use arrow keys or WASD. Join equal numbers!</p><div style="display:flex;align-items:center;gap:16px"><b id="nitro2048score">Score: 0</b><button id="nitro2048reset" style="padding:9px 15px;border:0;border-radius:8px;background:#b486ff;color:#130d20;cursor:pointer;font-weight:bold">New game</button></div><div id="nitro2048board" style="display:grid;grid-template-columns:repeat(4,minmax(55px,80px));gap:9px;padding:10px;background:#3a304c;border-radius:12px"></div><p id="nitro2048msg" style="min-height:20px;color:#b7f5c5"></p>';
            host.append(shell);
            const board = shell.querySelector('#nitro2048board');
            const scoreEl = shell.querySelector('#nitro2048score');
            const msg = shell.querySelector('#nitro2048msg');
            let cells, score;
            function spawn(){const empty=[];cells.forEach((n,i)=>{if(!n)empty.push(i)});if(empty.length)cells[empty[Math.floor(Math.random()*empty.length)]]=Math.random()<.9?2:4;}
            function draw(){board.innerHTML='';cells.forEach(n=>{const t=document.createElement('div');t.textContent=n||'';t.style.cssText='height:70px;display:grid;place-items:center;border-radius:7px;font-size:25px;font-weight:900;background:'+(n?({2:'#eee4da',4:'#ede0c8',8:'#f2b179',16:'#f59563',32:'#f67c5f',64:'#f65e3b',128:'#edcf72',256:'#edcc61',512:'#edc850',1024:'#edc53f',2048:'#edc22e'}[n]||'#9a6de0'):'#554b67')+';color:'+(n<=4?'#574d42':'#fff');board.append(t)});scoreEl.textContent='Score: '+score;if(cells.includes(2048))msg.textContent='🎉 You reached 2048!';else if(!cells.includes(0)&&!canMove())msg.textContent='Game over — try again!';else msg.textContent='';}
            function canMove(){for(let i=0;i<16;i++)if(i%4<3&&cells[i]===cells[i+1]||i<12&&cells[i]===cells[i+4])return true;return false;}
            function slide(line){const a=line.filter(Boolean);for(let i=0;i<a.length-1;i++){if(a[i]===a[i+1]){a[i]*=2;score+=a[i];a.splice(i+1,1)}}while(a.length<4)a.push(0);return a;}
            function move(dir){if(!shell.isConnected)return;const old=cells.join(',');for(let k=0;k<4;k++){const ids=[];for(let j=0;j<4;j++){let r,c;if(dir==='left'){r=k;c=j}else if(dir==='right'){r=k;c=3-j}else if(dir==='up'){r=j;c=k}else{r=3-j;c=k}ids.push(r*4+c)}const a=slide(ids.map(i=>cells[i]));ids.forEach((id,j)=>cells[id]=a[j]);}if(cells.join(',')!==old){spawn();draw()}}
            function key(e){const dirs={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down',a:'left',d:'right',w:'up',s:'down'};if(dirs[e.key]&&shell.isConnected){e.preventDefault();move(dirs[e.key])}}
            function reset(){cells=Array(16).fill(0);score=0;spawn();spawn();draw()}
            shell.querySelector('#nitro2048reset').onclick=reset;
            window.addEventListener('keydown',key);
            const oldCleanup=window.nitro2048Cleanup;if(oldCleanup)oldCleanup();
            window.nitro2048Cleanup=()=>window.removeEventListener('keydown',key);
            reset();
        }

        function launchGame(game) {
            if (!game) return;
            if (game.type === 'external') {
                incrementPlayCount(game.id);
                addRecent(game);
                window.open(game.source, '_blank', 'noopener,noreferrer');
                return;
            }
            if(game && ULTRA_3D_TRACKS[game.engine]) ultraStart3DMusic(game.engine);
            else ultraStop3DMusic(false);

            cleanupPlayer();

            currentGame = game;
            incrementPlayCount(game.id);
            setTimeout(updateProfileFeatures, 0);
            addRecent(game);

            dashboardView.style.display = 'none';
            gameView.style.display = 'block';
            activeTitle.textContent = game.name;
            updateGameDetailStrip(game);
            updateFavoriteUI();

            if (game.type === 'external') {
                const panel = document.createElement('div');
                panel.style.cssText = 'padding:35px;max-width:620px;text-align:center;color:white;line-height:1.7';
                const heading = document.createElement('h2');
                heading.textContent = game.name;
                const note = document.createElement('p');
                note.textContent = 'This game does not have a verified NitroArcade embed. Use the official game website below to play. NitroArcade cannot override another website’s iframe restrictions.';
                const link = document.createElement('a');
                link.href = game.source;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.textContent = '▶ Open ' + game.name + ' in new tab';
                link.style.cssText = 'display:inline-block;margin-top:18px;padding:13px 22px;border-radius:10px;background:#8fc7cb;color:#071012;font-weight:800;text-decoration:none';
                panel.append(heading,note,link);
                playerContainer.appendChild(panel);
            } else if (game.type === 'local2048') {
                startNitro2048(playerContainer);
            } else if (game.type === 'localdino') {
                startNitroDino(playerContainer);
            } else if (game.type === 'iframe') {
                const frame = document.createElement('iframe');
                frame.src = game.source;
                frame.title = game.name;
                frame.allowFullscreen = true;
                frame.allow = 'fullscreen; autoplay; gamepad';
                frame.referrerPolicy = 'strict-origin-when-cross-origin';
                frame.style.cssText = 'width:100%;height:100%;border:0;background:#000;display:block;';
                playerContainer.appendChild(frame);
                const reloadFrame = document.createElement('button');
                reloadFrame.type = 'button';
                reloadFrame.textContent = '↻ Reload game';
                reloadFrame.title = 'Reload the game if it is stuck. This cannot unblock a restricted website.';
                reloadFrame.style.cssText = 'position:absolute;bottom:10px;left:14px;z-index:5;padding:7px 10px;border-radius:7px;background:#101318;color:#fff;font-size:11px;cursor:pointer;border:1px solid #555';
                reloadFrame.onclick = () => { frame.src = game.source; };
                playerContainer.appendChild(reloadFrame);
                const fallback = document.createElement('a');
                fallback.href = game.source;
                fallback.target = '_blank';
                fallback.rel = 'noopener noreferrer';
                fallback.textContent = 'Game not loading? Open website ↗';
                fallback.style.cssText = 'position:absolute;bottom:10px;right:14px;z-index:5;padding:7px 10px;border-radius:7px;background:#101318;color:#fff;font-size:11px;text-decoration:none;border:1px solid #444';
                playerContainer.style.position = 'relative';
                playerContainer.appendChild(fallback);
            } else if (game.type === 'swf') {
                const ruffle = window.RufflePlayer.newest();
                activeRufflePlayer = ruffle.createPlayer();

                activeRufflePlayer.config = {
                    allowScriptAccess: false,
                    menu: false,
                    autoplay: 'auto'
                };

                playerContainer.appendChild(activeRufflePlayer);
                activeRufflePlayer.load({ url: game.source });
            } else if (game.type === 'native') {
                if (game.nativeGame === 'snake') {
                    startCrazySnake(playerContainer);
                } else if (game.nativeGame === 'brick') {
                    startBrickBreaker(playerContainer);
                } else if (game.nativeGame === 'hacker') {
                    startHackerChallenge(playerContainer);
                } else if (game.nativeGame === 'mega') {
                    startMegaGame(playerContainer, game);
                } else if (game.nativeGame === 'ultra') {
                    startUltraGame(playerContainer, game);
                } else if (game.nativeGame === 'premium') {
                    startPremiumGame(playerContainer, game);
                } else if (game.nativeGame === 'nova') {
                    startNovaGame(playerContainer, game);
                } else if (game.nativeGame === 'specialOriginal') {
                    startSpecialOriginalGame(playerContainer, game);
                }
            }
        }



        function startNovaGame(host, game){
            stopNativeGame();
            let round=0, score=0, dead=false;
            const total=game.rounds||7;
            host.innerHTML=`<div class="nova-shell"><div class="nova-panel">
                <div class="nova-head"><div><div class="mega-kicker">NITROARCADE ORIGINAL // NOVA ${String(game.tier).padStart(2,'0')}</div><div class="nova-title">${game.name}</div></div><div class="nova-rule">${game.rule}</div></div>
                <div class="nova-board"><div class="nova-center">
                    <div id="novaPrompt" class="nova-question">READY?</div>
                    <div id="novaOptions" class="nova-options"></div>
                    <div id="novaMessage" class="nova-message">Complete ${total} rounds.</div>
                    <div class="nova-status"><span>ROUND <b id="novaRound">0/${total}</b></span><span>SCORE <b id="novaScore">0</b></span></div>
                </div></div></div></div>`;

            const prompt=host.querySelector('#novaPrompt'), opts=host.querySelector('#novaOptions'),
                  msg=host.querySelector('#novaMessage'), roundEl=host.querySelector('#novaRound'),
                  scoreEl=host.querySelector('#novaScore');
            const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
            const shuffle=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);
            const uniqueOptions=(answer, pool)=>{
                const a=[String(answer),...pool.map(String)].filter((v,i,x)=>x.indexOf(v)===i);
                while(a.length<4)a.push(String(rand(1,99)));
                return shuffle(a.slice(0,4));
            };
            const isPrime=n=>{if(n<2)return false;for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true;};
            const words=['ORBIT','LASER','NOVA','PIXEL','CIPHER','ROCKET','CRYSTAL','SIGNAL','TURBO','VECTOR','BEACON','PLASMA','COMET','GALAXY'];
            const shapes=[['triangle',3],['square',4],['pentagon',5],['hexagon',6],['heptagon',7],['octagon',8]];
            function build(){
                const tier=game.tier||1, mode=game.engine;
                let q='', answer='', choices=[];
                if(mode==='largest'||mode==='smallest'){
                    const nums=shuffle([rand(10,30+tier*8),rand(31,55+tier*7),rand(56,80+tier*6),rand(81,110+tier*5)]);
                    q=(mode==='largest'?'Largest signal? ':'Smallest signal? ')+nums.join('  •  ');
                    answer=mode==='largest'?Math.max(...nums):Math.min(...nums); choices=nums.map(String);
                } else if(mode==='closest'){
                    const target=rand(20,90), nums=shuffle([target+rand(1,4),target-rand(5,9),target+rand(10,15),target-rand(11,17)]);
                    answer=nums.reduce((a,b)=>Math.abs(b-target)<Math.abs(a-target)?b:a); q=`Closest to ${target}?`; choices=nums.map(String);
                } else if(mode==='odd'||mode==='even'){
                    const wantOdd=mode==='odd', base=rand(5,20)*2;
                    const target=wantOdd?base+1:base; const others=[base+2,base+4,base+6].map(n=>wantOdd?n:n+1);
                    q=wantOdd?'Find the ODD signal':'Find the EVEN signal'; answer=target; choices=shuffle([target,...others]).map(String);
                } else if(mode==='prime'){
                    let p=rand(11,70); while(!isPrime(p))p++; const comps=[rand(4,12)*2,rand(4,10)*3,rand(3,8)*5];
                    q='Which signal is PRIME?';answer=p;choices=shuffle([p,...comps]).map(String);
                } else if(mode==='sum'||mode==='difference'){
                    const a=rand(8,30+tier*3),b=rand(3,20+tier*2); answer=mode==='sum'?a+b:a-b;
                    q=mode==='sum'?`${a} + ${b} = ?`:`${a} − ${b} = ?`;choices=uniqueOptions(answer,[answer+1,answer-2,answer+3]);
                } else if(mode==='sequence'){
                    const start=rand(1,12),step=rand(2,4+tier); answer=start+step*4;
                    q=`${start}, ${start+step}, ${start+step*2}, ${start+step*3}, ?`;choices=uniqueOptions(answer,[answer-step,answer+step,answer+2]);
                } else if(mode==='missing'){
                    const start=rand(2,15),step=rand(2,6),missing=rand(1,3); const seq=[0,1,2,3,4].map(i=>start+i*step);answer=seq[missing];
                    q=seq.map((n,i)=>i===missing?'__':n).join('  →  ');choices=uniqueOptions(answer,[answer-step,answer+step,answer+1]);
                } else if(mode==='wordlen'){
                    const chosen=words[rand(0,words.length-1)];answer=chosen.length;q=`Which word has ${answer} letters?`;
                    let pool=shuffle(words.filter(w=>w.length!==answer)).slice(0,3);choices=shuffle([chosen,...pool]);
                } else if(mode==='vowels'){
                    const w=words[rand(0,words.length-1)];answer=(w.match(/[AEIOU]/g)||[]).length;q=`How many vowels in ${w}?`;choices=uniqueOptions(answer,[0,1,2,3,4]);
                } else if(mode==='alphabet'){
                    const n=rand(1,26),letter=String.fromCharCode(64+n);answer=n;q=`Alphabet position of ${letter}?`;choices=uniqueOptions(answer,[n+1,Math.max(1,n-1),Math.min(26,n+2)]);
                } else if(mode==='symbols'){
                    const symbols=['◆','●','▲','■'];const target=symbols[rand(0,3)],count=rand(2,5+tier);answer=count;
                    const bag=Array(count).fill(target).concat(Array(rand(4,8)).fill(0).map(()=>symbols[rand(0,3)])).slice(0,12);q=`Count ${target}:  ${shuffle(bag).join(' ')}`;choices=uniqueOptions(answer,[answer-1,answer+1,answer+2]);
                } else if(mode==='coordinate'){
                    const x=rand(1,8),y=rand(1,8);answer=`(${x}, ${y})`;q=`Beacon: column ${x}, row ${y}`;choices=shuffle([answer,`(${y}, ${x})`,`(${x+1}, ${y})`,`(${x}, ${Math.max(1,y-1)})`]);
                } else if(mode==='fraction'){
                    const a=rand(1,8),b=rand(a+1,12),c=rand(1,8),d=rand(c+1,12); const f1=a/b,f2=c/d;answer=f1>=f2?`${a}/${b}`:`${c}/${d}`;
                    q='Choose the larger fraction';choices=shuffle([`${a}/${b}`,`${c}/${d}`,`${a}/${d}`,`${c}/${b}`]);
                } else if(mode==='binary'){
                    const n=rand(3,15+tier);const bits=n.toString(2);answer=n;q=`Decode binary ${bits}`;choices=uniqueOptions(answer,[n+1,Math.max(0,n-1),n+2]);
                } else if(mode==='sides'){
                    const sh=shapes[rand(0,shapes.length-1)];answer=sh[1];q=`How many sides does a ${sh[0]} have?`;choices=uniqueOptions(answer,[answer-1,answer+1,answer+2]);
                } else if(mode==='xor'){
                    const a=rand(0,1),b=rand(0,1);answer=(a!==b)?'ON':'OFF';q=`XOR switches: A=${a?'ON':'OFF'}, B=${b?'ON':'OFF'}`;choices=['ON','OFF','BOTH','NEITHER'];
                } else if(mode==='clock'){
                    const h=rand(1,12),shift=rand(1,8+tier);answer=((h-1+shift)%12)+1;q=`${h}:00 + ${shift} hours = ?`;choices=uniqueOptions(answer,[((answer)%12)+1,((answer+10)%12)+1,((answer+1)%12)+1]);
                }
                return {q,answer:String(answer),choices};
            }
            function next(){
                if(dead)return;
                if(round>=total){
                    prompt.textContent=`MISSION COMPLETE — ${score}/${total}`;
                    opts.innerHTML=`<button class="nova-option" id="novaAgain">PLAY AGAIN</button>`;
                    msg.textContent=score===total?'PERFECT CLEAR!':score>=Math.ceil(total*.7)?'Strong clear!':'Clear — try for a higher score.';
                    const prize=Math.max(1,Math.floor(score/2));
                    try{awardPrizes(prize)}catch(e){}
                    host.querySelector('#novaAgain').onclick=()=>startNovaGame(host,game);
                    return;
                }
                round++;roundEl.textContent=`${round}/${total}`;
                const data=build();prompt.textContent=data.q;opts.innerHTML='';msg.textContent='Choose one.';
                data.choices.forEach(choice=>{
                    const b=document.createElement('button');b.className='nova-option';b.textContent=choice;
                    b.onclick=()=>{
                        [...opts.children].forEach(x=>x.disabled=true);
                        if(String(choice)===data.answer){score++;scoreEl.textContent=score;b.classList.add('correct');msg.textContent='CORRECT SIGNAL';}
                        else{b.classList.add('wrong');msg.textContent=`Correct: ${data.answer}`;[...opts.children].forEach(x=>{if(x.textContent===data.answer)x.classList.add('correct')});}
                        setTimeout(next,520);
                    };
                    opts.appendChild(b);
                });
            }
            activeNativeCleanup=()=>{dead=true;};
            next();
        }


        function startSpecialOriginalGame(host,game){
            if(game.engine==='blockburst') return startBlockBurst(host,game);
            if(game.engine==='metrodash') return startMetroDash(host,game);
            if(game.engine==='voxel3d') return startVoxelFrontier3D(host,game);
            if(game.engine==='football3d') return startStadiumStrike3D(host,game);
            if(game.engine==='flight3d') return startSkyPilot3D(host,game);
            if(game.engine==='brickmaze3d') return startBrickMaze95(host,game);
            if(game.engine==='theday') return startTheDay(host,game);
            if(game.engine==='nightwatch') return startNightWatch(host,game);
            if(game.engine==='enemiesyou') return startEnemiesAndYou(host,game);
            if(game.engine==='techquiz') return startNitroTechQuiz(host,game);
        }




        function startEnemiesAndYou(host,game){
          stopNativeGame();
          host.innerHTML=`<div class="eayu">
            <div class="eayu-top"><div><b>ENEMIES AND YOU</b><small> NITRO ARENA</small></div><div id="eyWave">WAVE 1 / 10</div><div id="eyScore">SCORE 000000</div></div>
            <canvas id="eyCanvas" width="1280" height="720"></canvas>
            <div class="eayu-bottom"><span id="eyStatus">HP 100 • ENERGY 100 • COINS 0</span><span>WASD move • MOUSE aim • CLICK / ARROWS energy shot • SHIFT dash • E special</span></div>
            <div class="eayu-overlay" id="eyOverlay"><div class="eayu-card"><small>NITROARCADE ORIGINAL</small><div class="ey-monster-banner">DARE TO MESS AROUNG WITH THESE MONSTERS?</div><h2>ENEMIES AND YOU</h2><p>Survive ten escalating arena waves. Every wave ends with an original boss. Collect coins, choose upgrades, and build a stronger character.</p><div class="ey-features">10 WAVES • 10 BOSSES • UPGRADES • COMBOS • POWER-UPS</div><button id="eyStart">ENTER ARENA</button></div></div>
          </div>`;
          const root=host.querySelector('.eayu'),cv=host.querySelector('#eyCanvas'),c=cv.getContext('2d'),overlay=host.querySelector('#eyOverlay'),waveEl=host.querySelector('#eyWave'),scoreEl=host.querySelector('#eyScore'),statusEl=host.querySelector('#eyStatus');
          let stopped=false,raf=0,last=performance.now(),keys={},mouse={x:640,y:360,down:false},wave=1,score=0,coins=0,combo=0,comboT=0,spawnT=0,bossSpawned=false,waveKills=0,waveGoal=10;
          let player={x:640,y:390,r:20,hp:100,maxHp:100,energy:100,speed:270,damage:18,fireRate:.19,fireT:0,dashT:0,inv:0,special:100};
          let shots=[],enemies=[],particles=[],drops=[],hazards=[],decoys=[]; player.freezeT=0;
          const enemyRoster=[
            {name:'Bouncer',col:'#ff6d8a',type:'chaser',power:'CHARGE',powerDesc:'Bursts straight toward you.'},
            {name:'Zip',col:'#66e3ff',type:'zigzag',power:'SPEED DASH',powerDesc:'Suddenly accelerates.'},
            {name:'Mochi',col:'#ffd45c',type:'orbiter',power:'SPLIT',powerDesc:'Splits into two mini Mochis.'},
            {name:'Rivet',col:'#8dff8a',type:'chaser',power:'FRONT SHIELD',powerDesc:'Blocks shots from the front.'},
            {name:'Blink',col:'#b28cff',type:'zigzag',power:'CLOAK',powerDesc:'Turns nearly invisible.'},
            {name:'Pebble',col:'#ff9f5c',type:'orbiter',power:'SHOCKWAVE',powerDesc:'Sends out a stun shockwave.'},
            {name:'Glitch',col:'#68f0c2',type:'zigzag',power:'TELEPORT',powerDesc:'Jumps around the arena.'},
            {name:'Crank',col:'#f57dff',type:'chaser',power:'BLAST ZONE',powerDesc:'Drops timed blast zones.'},
            {name:'Orbit',col:'#72a7ff',type:'orbiter',power:'SATELLITES',powerDesc:'Fires orbiting energy bolts.'},
            {name:'Pogo',col:'#f6e36a',type:'zigzag',power:'POUNCE',powerDesc:'Leaps toward your position.'},
            {name:'Nibbler',col:'#ff789b',type:'chaser',power:'DRAIN',powerDesc:'Steals HP on contact.'},
            {name:'Volt',col:'#67e7ff',type:'orbiter',power:'CHAIN SPARK',powerDesc:'Fires electric sparks.'},
            {name:'Tumble',col:'#b5ff70',type:'zigzag',power:'ROLL',powerDesc:'Rolls in a fast straight line.'},
            {name:'Clank',col:'#ffa46c',type:'chaser',power:'MAGNET',powerDesc:'Pulls you toward itself.'},
            {name:'Pixel',col:'#d391ff',type:'orbiter',power:'DECOYS',powerDesc:'Creates fake copies.'},
            {name:'Dash',col:'#7affd4',type:'zigzag',power:'ENERGY TRAIL',powerDesc:'Leaves dangerous trails.'},
            {name:'Boomer',col:'#ffcf62',type:'chaser',power:'FINAL BLAST',powerDesc:'Creates a blast when defeated.'},
            {name:'Prism',col:'#77b6ff',type:'orbiter',power:'PRISM SHOT',powerDesc:'Fires shots in several directions.'},
            {name:'Jinx',col:'#ff72d1',type:'zigzag',power:'FREEZE',powerDesc:'Freezes your movement briefly.'},
            {name:'Titan',col:'#91ff83',type:'chaser',power:'FORTRESS',powerDesc:'Becomes temporarily invulnerable.'}
          ];
          function unlockedEnemyRoster(){return enemyRoster.slice(0,Math.min(enemyRoster.length,wave*2))}
          function newestEnemies(){return enemyRoster.slice((wave-1)*2,wave*2)}
          const colors=['#66e3ff','#ff6d8a','#ffd45c','#8dff8a','#b28cff'];
          const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=(a,b)=>a+Math.random()*(b-a),dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
          function circle(x,y,r,col){c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()}
          function txt(s,x,y,z=18,col='#fff',align='left'){c.fillStyle=col;c.font=`900 ${z}px Arial`;c.textAlign=align;c.fillText(s,x,y)}
          function burst(x,y,col,n=12){for(let i=0;i<n;i++)particles.push({x,y,vx:rnd(-180,180),vy:rnd(-180,180),life:rnd(.25,.7),col})}
          function shoot(dx,dy,mult=1){let l=Math.hypot(dx,dy)||1;shots.push({x:player.x,y:player.y,vx:dx/l*620,vy:dy/l*620,r:6,damage:player.damage*mult,life:1.5});player.fireT=player.fireRate}
          function spawnEnemy(type='chaser',boss=false){
            let side=Math.floor(Math.random()*4),x=side===0?-35:side===1?1315:rnd(40,1240),y=side===2?-35:side===3?755:rnd(100,650);
            if(side<2)y=rnd(100,650);else x=rnd(40,1240);
            const scale=boss?2.1:1, base=30+wave*7;
            let character=null;
            if(!boss){const pool=unlockedEnemyRoster();character=pool[Math.floor(Math.random()*pool.length)];type=character.type}
            enemies.push({x,y,r:(boss?38:18)*scale,hp:(boss?base*12:base),maxHp:(boss?base*12:base),speed:(boss?55:70)+wave*5,type,boss,phase:0,shoot:rnd(.5,1.4),abilityT:rnd(.7,2.0),abilityOn:0,shield:0,cloaked:false,splitLevel:0,name:boss?bossName():character.name,col:boss?'#ffb84d':character.col,power:boss?'BOSS':character.power,powerDesc:boss?'':character.powerDesc});
          }
          function startWave(){
            enemies=[];shots=[];drops=[];hazards=[];decoys=[];waveKills=0;bossSpawned=false;spawnT=.4;waveGoal=8+wave*2;
            waveEl.textContent=`WAVE ${wave} / 10`;
            const added=newestEnemies();
            overlay.style.display='grid';
            overlay.innerHTML=`<div class="eayu-card ey-round-card"><small>WAVE ${wave} / 10</small><div class="ey-monster-banner mini">DARE TO MESS AROUNG WITH THESE MONSTERS?</div><h2>2 NEW ENEMIES</h2><div class="ey-new-names">${added.map(n=>`<span><b>${n.name}</b><em>POWER: ${n.power}</em><small>${n.powerDesc}</small></span>`).join('')}</div><p>${wave===1?'Learn their powers before they learn you.':'The arena just got more dangerous.'}</p><button id="eyWaveGo">START WAVE ${wave}</button></div>`;
            overlay.querySelector('#eyWaveGo').onclick=()=>{overlay.style.display='none'};

          }
          function bossName(){return ['THE BLOCKER','ORBIT EYE','TURBO CUBE','MIRROR','THE SWARM CORE','VOLT GIANT','PHASE ORB','NEON TOWER','CHAOS ENGINE','OMEGA ZERO'][wave-1]}
          function showUpgrade(){
            const opts=[
              {n:'POWER CORE',d:'+25% shot damage',f:()=>player.damage*=1.25},
              {n:'TURBO SHOES',d:'+12% movement speed',f:()=>player.speed*=1.12},
              {n:'HEART MODULE',d:'+25 max HP and heal',f:()=>{player.maxHp+=25;player.hp=Math.min(player.maxHp,player.hp+35)}},
              {n:'RAPID CHIP',d:'15% faster shots',f:()=>player.fireRate=Math.max(.08,player.fireRate*.85)},
              {n:'ENERGY BANK',d:'Restore HP + special',f:()=>{player.hp=Math.min(player.maxHp,player.hp+45);player.special=100}}
            ].sort(()=>Math.random()-.5).slice(0,3);
            overlay.style.display='grid';overlay.innerHTML=`<div class="eayu-card"><small>WAVE ${wave} CLEAR</small><h2>CHOOSE AN UPGRADE</h2><div class="ey-upgrades">${opts.map((o,i)=>`<button data-u="${i}"><b>${o.n}</b><small>${o.d}</small></button>`).join('')}</div><p>COINS ${coins} • SCORE ${score}</p></div>`;
            overlay.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{opts[+b.dataset.u].f();wave++;if(wave>10){finishGame();return}startWave()});
          }
          function finishGame(){
            stopped=true;cancelAnimationFrame(raf);overlay.style.display='grid';overlay.innerHTML=`<div class="eayu-card"><small>ARENA COMPLETE</small><h2>YOU SURVIVED.</h2><p>All ten waves and all ten arena bosses cleared.</p><strong>SCORE ${score} • COINS ${coins}</strong><button id="eyAgain">PLAY AGAIN</button></div>`;
            try{NitroArcade?.game?.win?.(score,{coins:Math.max(5,Math.floor(coins/10))})}catch(e){}
            overlay.querySelector('#eyAgain').onclick=()=>startEnemiesAndYou(host,game);
          }
          function gameOver(){
            stopped=true;cancelAnimationFrame(raf);overlay.style.display='grid';overlay.innerHTML=`<div class="eayu-card"><small>ARENA RUN ENDED</small><h2>WAVE ${wave}</h2><p>SCORE ${score} • COINS ${coins}</p><button id="eyRetry">RETRY</button></div>`;
            overlay.querySelector('#eyRetry').onclick=()=>startEnemiesAndYou(host,game);
          }
          function update(dt){
            let mx=(keys.KeyD?1:0)-(keys.KeyA?1:0),my=(keys.KeyS?1:0)-(keys.KeyW?1:0),ml=Math.hypot(mx,my)||1;
            player.freezeT=Math.max(0,player.freezeT-dt);let moveScale=player.freezeT>0?0.12:1;player.x=clamp(player.x+mx/ml*player.speed*moveScale*dt,28,1252);player.y=clamp(player.y+my/ml*player.speed*moveScale*dt,95,690);
            player.fireT=Math.max(0,player.fireT-dt);player.dashT=Math.max(0,player.dashT-dt);player.inv=Math.max(0,player.inv-dt);player.special=Math.min(100,player.special+dt*3.2);
            if((mouse.down)&&player.fireT<=0)shoot(mouse.x-player.x,mouse.y-player.y);
            let ax=(keys.ArrowRight?1:0)-(keys.ArrowLeft?1:0),ay=(keys.ArrowDown?1:0)-(keys.ArrowUp?1:0);if((ax||ay)&&player.fireT<=0)shoot(ax,ay);
            spawnT-=dt;
            if(waveKills<waveGoal&&spawnT<=0){spawnEnemy(['chaser','zigzag','orbiter'][Math.min(2,Math.floor((wave-1)/3))]);spawnT=Math.max(.28,.95-wave*.055)}
            if(waveKills>=waveGoal&&!bossSpawned&&enemies.filter(e=>!e.boss).length===0){bossSpawned=true;spawnEnemy('boss',true)}
            shots.forEach(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt});
            enemies.forEach(e=>{
              let dx=player.x-e.x,dy=player.y-e.y,l=Math.hypot(dx,dy)||1;e.phase+=dt;
              let wob=e.type==='zigzag'?Math.sin(e.phase*6)*85:0;
              e.abilityT-=dt;e.abilityOn=Math.max(0,e.abilityOn-dt);
              let speedBoost=1;
              if(!e.boss){
                if(e.name==='Bouncer'&&e.abilityT<=0){e.abilityOn=.42;e.abilityT=2.4;burst(e.x,e.y,e.col,8)}
                if(e.name==='Zip'&&e.abilityT<=0){e.abilityOn=.7;e.abilityT=2.1}
                if(e.name==='Blink'){if(e.abilityT<=0){e.cloaked=!e.cloaked;e.abilityT=e.cloaked?1.45:2.0}}
                if(e.name==='Rivet'){e.shield=(Math.sin(e.phase*1.7)>-.15)?1:0}
                if(e.name==='Glitch'&&e.abilityT<=0){e.x=clamp(player.x+rnd(-250,250),45,1235);e.y=clamp(player.y+rnd(-210,210),105,680);e.abilityT=2.5;burst(e.x,e.y,e.col,12)}
                if(e.name==='Crank'&&e.abilityT<=0){hazards.push({type:'blast',x:e.x,y:e.y,r:12,maxR:72,t:1.15,hit:false,col:e.col});e.abilityT=2.8}
                if(e.name==='Pebble'&&e.abilityT<=0&&l<230){hazards.push({type:'shock',x:e.x,y:e.y,r:12,maxR:150,t:.75,hit:false,col:e.col});e.abilityT=3.0}
                if(e.name==='Orbit'&&e.abilityT<=0){for(let a=0;a<Math.PI*2;a+=Math.PI/2)shots.push({x:e.x,y:e.y,vx:Math.cos(a)*180,vy:Math.sin(a)*180,r:6,damage:-8,enemy:true,life:2.4});e.abilityT=2.6}
                if(e.name==='Pogo'&&e.abilityT<=0){e.x+=dx/l*115;e.y+=dy/l*115;e.abilityT=2.3;burst(e.x,e.y,e.col,8)}
                if(e.name==='Volt'&&e.abilityT<=0){let a=Math.atan2(dy,dx);shots.push({x:e.x,y:e.y,vx:Math.cos(a)*310,vy:Math.sin(a)*310,r:7,damage:-9,enemy:true,life:2});e.abilityT=1.9}
                if(e.name==='Tumble'&&e.abilityT<=0){e.abilityOn=.85;e.abilityT=2.6}
                if(e.name==='Clank'&&l<250){player.x=clamp(player.x-dx/l*34*dt,28,1252);player.y=clamp(player.y-dy/l*34*dt,95,690)}
                if(e.name==='Pixel'&&e.abilityT<=0){decoys.push({x:e.x+70,y:e.y-30,t:1.8,col:e.col},{x:e.x-60,y:e.y+45,t:1.8,col:e.col});e.abilityT=3.1}
                if(e.name==='Dash'&&e.abilityT<=0){e.abilityOn=.8;e.abilityT=2.3}
                if(e.name==='Prism'&&e.abilityT<=0){for(let a=0;a<Math.PI*2;a+=Math.PI/3)shots.push({x:e.x,y:e.y,vx:Math.cos(a)*220,vy:Math.sin(a)*220,r:6,damage:-8,enemy:true,life:2.5});e.abilityT=2.7}
                if(e.name==='Jinx'&&e.abilityT<=0){let a=Math.atan2(dy,dx);shots.push({x:e.x,y:e.y,vx:Math.cos(a)*240,vy:Math.sin(a)*240,r:9,damage:-5,enemy:true,freeze:true,life:2.6});e.abilityT=2.9}
                if(e.name==='Titan'&&e.abilityT<=0){e.abilityOn=1.25;e.abilityT=3.5;burst(e.x,e.y,'#ffffff',12)}
                speedBoost=(e.name==='Bouncer'&&e.abilityOn>0)?3.0:(e.name==='Zip'&&e.abilityOn>0)?2.35:(e.name==='Tumble'&&e.abilityOn>0)?2.0:(e.name==='Dash'&&e.abilityOn>0)?2.15:1;
                if(e.name==='Dash'&&e.abilityOn>0&&Math.random()<dt*12)hazards.push({type:'trail',x:e.x,y:e.y,r:22,maxR:22,t:.8,hit:false,col:e.col});
              }
              e.x+=(dx/l*e.speed*speedBoost + -dy/l*wob)*dt;e.y+=(dy/l*e.speed*speedBoost + dx/l*wob)*dt;
              if(e.boss){e.shoot-=dt;if(e.shoot<=0){for(let a=0;a<Math.PI*2;a+=Math.PI/5)shots.push({x:e.x,y:e.y,vx:Math.cos(a)*210,vy:Math.sin(a)*210,r:8,damage:-10,enemy:true,life:3});e.shoot=Math.max(.55,1.25-wave*.045)}}
              if(dist(e,player)<e.r+player.r&&player.inv<=0){let hit=e.boss?18:10;if(e.name==='Nibbler'){hit=8;e.hp=Math.min(e.maxHp,e.hp+14)}player.hp-=hit;player.inv=.8;burst(player.x,player.y,'#ff6d7a',16);if(player.hp<=0)gameOver()}
            });
            shots.forEach(s=>{
              if(s.enemy){if(dist(s,player)<s.r+player.r&&player.inv<=0){player.hp-=s.freeze?5:10;if(s.freeze)player.freezeT=1.35;player.inv=.7;s.life=0;if(player.hp<=0)gameOver()}return}
              enemies.forEach(e=>{if(s.life>0&&e.hp>0&&dist(s,e)<s.r+e.r){let blocked=(e.name==='Rivet'&&e.shield)||(e.name==='Titan'&&e.abilityOn>0);if(blocked){s.life=0;burst(s.x,s.y,'#ffffff',4);return}e.hp-=s.damage;s.life=0;burst(s.x,s.y,e.col,5);if(e.hp<=0){
                  if(e.name==='Mochi'&&e.splitLevel<1){for(let k=0;k<2;k++)enemies.push({x:e.x+rnd(-25,25),y:e.y+rnd(-25,25),r:11,hp:Math.max(12,e.maxHp*.28),maxHp:Math.max(12,e.maxHp*.28),speed:e.speed*1.25,type:'chaser',boss:false,phase:0,shoot:9,abilityT:9,abilityOn:0,shield:0,cloaked:false,splitLevel:1,name:'Mini Mochi',col:e.col,power:'SPLIT',powerDesc:''})}
                  if(e.name==='Boomer')hazards.push({type:'blast',x:e.x,y:e.y,r:10,maxR:105,t:.8,hit:false,col:e.col});
                  score+=e.boss?1000:100+combo*10;coins+=e.boss?20:1;combo++;comboT=2.2;player.special=Math.min(100,player.special+(e.boss?25:4));burst(e.x,e.y,e.col,e.boss?35:14);if(!e.boss)waveKills++;if(Math.random()<.13)drops.push({x:e.x,y:e.y,type:Math.random()<.55?'heal':'coin',r:10});if(e.boss)setTimeout(showUpgrade,650)}}})
            });
            drops.forEach(d=>{if(dist(d,player)<34){if(d.type==='heal')player.hp=Math.min(player.maxHp,player.hp+18);else coins+=5;d.dead=true}});
            particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.96;p.vy*=.96;p.life-=dt});
            hazards.forEach(z=>{z.t-=dt;if(z.type==='shock'||z.type==='blast')z.r+=(z.maxR-z.r)*Math.min(1,dt*7);if(!z.hit&&dist(z,player)<z.r+player.r){z.hit=true;if(z.type==='shock'){player.freezeT=Math.max(player.freezeT,.65);player.hp-=6}else if(z.type==='blast'){player.hp-=12;player.inv=.55}else if(z.type==='trail'){player.hp-=5;player.inv=.35}if(player.hp<=0)gameOver()}});
            decoys.forEach(d=>d.t-=dt);
            comboT-=dt;if(comboT<=0)combo=0;
            hazards=hazards.filter(z=>z.t>0);decoys=decoys.filter(d=>d.t>0);
            shots=shots.filter(s=>s.life>0&&s.x>-50&&s.x<1330&&s.y>40&&s.y<770);enemies=enemies.filter(e=>e.hp>0);particles=particles.filter(p=>p.life>0);drops=drops.filter(d=>!d.dead);
            scoreEl.textContent='SCORE '+String(score).padStart(6,'0');statusEl.textContent=`HP ${Math.ceil(player.hp)}/${player.maxHp} • SPECIAL ${Math.floor(player.special)} • COINS ${coins} • COMBO x${Math.max(1,combo)}`;
          }
          function draw(){
            let bg=c.createLinearGradient(0,0,0,720);bg.addColorStop(0,'#111a35');bg.addColorStop(1,'#080914');c.fillStyle=bg;c.fillRect(0,0,1280,720);
            c.strokeStyle='rgba(80,180,255,.10)';c.lineWidth=1;for(let x=0;x<1280;x+=64){c.beginPath();c.moveTo(x,80);c.lineTo(x,720);c.stroke()}for(let y=80;y<720;y+=64){c.beginPath();c.moveTo(0,y);c.lineTo(1280,y);c.stroke()}
            c.fillStyle='#17284a';c.fillRect(0,80,1280,8);c.fillRect(0,704,1280,16);
            drops.forEach(d=>{circle(d.x,d.y,13,d.type==='heal'?'#68ff9b':'#ffd55f');txt(d.type==='heal'?'+':'¢',d.x,d.y+5,13,'#172018','center')});
            particles.forEach(p=>{c.globalAlpha=Math.max(0,p.life*1.7);circle(p.x,p.y,3,p.col);c.globalAlpha=1});
            hazards.forEach(z=>{c.save();c.globalAlpha=Math.max(.15,Math.min(.75,z.t));c.strokeStyle=z.col;c.lineWidth=z.type==='trail'?8:5;c.beginPath();c.arc(z.x,z.y,z.r,0,Math.PI*2);c.stroke();c.restore()});
            decoys.forEach(d=>{c.save();c.globalAlpha=Math.min(.45,d.t);c.fillStyle=d.col;c.beginPath();c.roundRect(d.x-18,d.y-18,36,36,7);c.fill();txt('Pixel?',d.x,d.y-28,10,'#ddd','center');c.restore()});
            shots.forEach(s=>circle(s.x,s.y,s.r,s.freeze?'#a9efff':s.enemy?'#ff697e':'#7cecff'));
            enemies.forEach(e=>{
              c.save();c.translate(e.x,e.y);if(e.cloaked)c.globalAlpha=.16;
              if(e.boss){
                c.fillStyle=e.col;c.beginPath();for(let i=0;i<8;i++){let a=i*Math.PI/4,r=i%2?e.r*.72:e.r;c.lineTo(Math.cos(a)*r,Math.sin(a)*r)}c.closePath();c.fill();
                txt(e.name,0,-e.r-18,13,'#fff','center');
              } else {
                c.fillStyle=e.col;c.beginPath();c.roundRect(-e.r,-e.r,e.r*2,e.r*2,7);c.fill();
                circle(-6,-3,3,'#10131d');circle(6,-3,3,'#10131d');
                c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=2;c.beginPath();c.arc(0,4,7,.15,Math.PI-.15);c.stroke();
                txt(e.name,0,-e.r-12,11,'#fff','center');txt(e.power,0,e.r+17,8,e.col,'center');
              }
              c.restore();if(e.boss){c.fillStyle='#29151a';c.fillRect(e.x-80,e.y+e.r+15,160,8);c.fillStyle='#ff735f';c.fillRect(e.x-80,e.y+e.r+15,160*(e.hp/e.maxHp),8)}
            });
            c.save();c.translate(player.x,player.y);if(player.inv>0)c.globalAlpha=.45+.35*Math.sin(performance.now()*.03);circle(0,0,player.r,'#58c8ff');circle(-7,-4,4,'#08131e');circle(7,-4,4,'#08131e');c.strokeStyle='#d8f8ff';c.lineWidth=4;c.beginPath();c.arc(0,0,27,-Math.PI*.8,Math.PI*.8);c.stroke();c.restore();
            c.fillStyle='#17202d';c.fillRect(24,104,300,18);c.fillStyle='#62e68c';c.fillRect(24,104,300*(player.hp/player.maxHp),18);txt('HP',28,99,11,'#bfead0');
            c.fillStyle='#17202d';c.fillRect(24,140,300,12);c.fillStyle='#8e7dff';c.fillRect(24,140,300*(player.special/100),12);txt('SPECIAL [E]',28,136,10,'#d5ceff');
            txt(`ENEMIES ${Math.max(0,waveGoal-waveKills)}${bossSpawned?' • BOSS ACTIVE':''}`,1250,116,14,'#fff','right');if(player.freezeT>0)txt('❄ FROZEN',640,165,20,'#bcefff','center');
            if(combo>1)txt(`COMBO x${combo}`,640,118,24,'#ffd45c','center');
          }
          function loop(now){if(stopped)return;let dt=Math.min(.033,(now-last)/1000);last=now;update(dt);draw();raf=requestAnimationFrame(loop)}
          const kd=e=>{
            keys[e.code]=true;
            if((e.code==='ShiftLeft'||e.code==='ShiftRight')&&player.dashT<=0){let dx=(keys.KeyD?1:0)-(keys.KeyA?1:0),dy=(keys.KeyS?1:0)-(keys.KeyW?1:0),l=Math.hypot(dx,dy)||1;player.x=clamp(player.x+dx/l*115,30,1250);player.y=clamp(player.y+dy/l*115,100,690);player.dashT=1.1;player.inv=.28;burst(player.x,player.y,'#68e8ff',18)}
            if(e.code==='KeyE'&&player.special>=100){player.special=0;enemies.forEach(en=>{en.hp-=player.damage*2.4;burst(en.x,en.y,'#b38cff',10)});burst(player.x,player.y,'#b38cff',45)}
          };
          const ku=e=>keys[e.code]=false,mm=e=>{let r=cv.getBoundingClientRect();mouse.x=(e.clientX-r.left)*1280/r.width;mouse.y=(e.clientY-r.top)*720/r.height},md=()=>mouse.down=true,mu=()=>mouse.down=false;
          addEventListener('keydown',kd);addEventListener('keyup',ku);cv.addEventListener('mousemove',mm);cv.addEventListener('mousedown',md);addEventListener('mouseup',mu);
          activeNativeCleanup=()=>{stopped=true;cancelAnimationFrame(raf);removeEventListener('keydown',kd);removeEventListener('keyup',ku);removeEventListener('mouseup',mu);cv.removeEventListener('mousemove',mm);cv.removeEventListener('mousedown',md)};
          host.querySelector('#eyStart').onclick=()=>{startWave();last=performance.now();raf=requestAnimationFrame(loop);root.focus?.()};
        }

        function startNightWatch(host,game){
          stopNativeGame();
          host.innerHTML=`<div class="nwf">
            <div class="nwf-top"><b>NIGHT WATCH</b><span id="nwfTime">12 AM</span><span id="nwfPower">POWER 100%</span></div>
            <div class="nwf-office" id="nwfOffice">
              <div class="nwf-hall left"><span>WEST HALL</span><div class="nwf-eyes" id="nwfEyesL">● ●</div></div>
              <div class="nwf-hall right"><span>EAST HALL</span><div class="nwf-eyes" id="nwfEyesR">● ●</div></div>
              <div class="nwf-desk"><div class="nwf-fan">✣</div><div class="nwf-screen">SECURITY<br><small>CAMERAS READY</small></div></div>
              <div class="nwf-buttons left"><button id="nwfLightL">LIGHT</button><button id="nwfDoorL">DOOR</button></div>
              <div class="nwf-buttons right"><button id="nwfLightR">LIGHT</button><button id="nwfDoorR">DOOR</button></div>
              <div class="nwf-shutter left" id="nwfShutterL"></div><div class="nwf-shutter right" id="nwfShutterR"></div>
              <button class="nwf-open" id="nwfOpen">▲ OPEN CAMERAS</button>
            </div>
            <div class="nwf-cams" id="nwfCams">
              <div class="nwf-feed"><canvas id="nwfCanvas" width="1000" height="600"></canvas><b id="nwfCamTitle">CAM 1 · SHOW STAGE</b></div>
              <div class="nwf-map" id="nwfMap"></div>
              <button class="nwf-lower" id="nwfLower">▼ LOWER MONITOR</button>
            </div>
            <div class="nwf-bottom"><span id="nwfUsage">USAGE ▮</span><span>Survive until 6 AM</span></div>
            <div class="nwf-cover" id="nwfCover"><div class="nwf-card"><small>NITROARCADE BIG GAME</small><h2>NIGHT WATCH</h2><p>Watch the camera network, check both halls, and shut the correct door before a roaming mascot reaches the office.</p><button id="nwfStart">BEGIN NIGHT</button></div></div>
          </div>`;

          const office=host.querySelector('#nwfOffice'),cams=host.querySelector('#nwfCams'),cover=host.querySelector('#nwfCover');
          const cv=host.querySelector('#nwfCanvas'),c=cv.getContext('2d'),timeEl=host.querySelector('#nwfTime'),powerEl=host.querySelector('#nwfPower'),usageEl=host.querySelector('#nwfUsage');
          const title=host.querySelector('#nwfCamTitle'),map=host.querySelector('#nwfMap');
          let running=false, cameraUp=false, leftDoor=false,rightDoor=false,leftLight=false,rightLight=false,power=100,t=0,last=performance.now(),raf=0,cam=0;
          const rooms=['SHOW STAGE','DINING','PRIZE ROOM','ARCADE','PARTY ROOM','STORAGE','WEST HALL','EAST HALL','OFFICE'];
          const bots=[
            {name:'PATCH',color:'#d55f55',path:[0,1,4,6,8],step:0,wait:7},
            {name:'BOLT',color:'#4e79d8',path:[0,2,3,7,8],step:0,wait:9},
            {name:'MOTH',color:'#a96bc0',path:[5,4,3,6,8],step:0,wait:11}
          ];
          rooms.forEach((name,i)=>{let b=document.createElement('button');b.textContent='CAM '+(i+1);b.onclick=()=>{cam=i;title.textContent=`CAM ${i+1} · ${name}`;drawFeed()};map.appendChild(b)});

          function resetBots(){bots[0].step=0;bots[1].step=0;bots[2].step=0}
          function roomOf(b){return b.path[b.step]}
          function drawMascot(x,y,b){
            c.fillStyle=b.color;c.beginPath();c.arc(x,y,55,0,Math.PI*2);c.fill();
            c.fillStyle='#17191c';c.fillRect(x-48,y+38,96,120);
            c.fillStyle='#fff';c.beginPath();c.arc(x-19,y-10,7,0,7);c.arc(x+19,y-10,7,0,7);c.fill();
            c.fillStyle='#111';c.beginPath();c.arc(x-19,y-10,3,0,7);c.arc(x+19,y-10,3,0,7);c.fill();
            c.fillStyle='#fff';c.font='bold 15px monospace';c.fillText(b.name,x-28,y+185);
          }
          function drawFeed(){
            let g=c.createLinearGradient(0,0,0,600);g.addColorStop(0,'#34393d');g.addColorStop(1,'#080a0b');c.fillStyle=g;c.fillRect(0,0,1000,600);
            c.strokeStyle='#555b60';c.lineWidth=2;
            for(let x=0;x<1000;x+=100){c.beginPath();c.moveTo(x,0);c.lineTo(x,600);c.stroke()}
            for(let y=0;y<600;y+=75){c.beginPath();c.moveTo(0,y);c.lineTo(1000,y);c.stroke()}
            bots.filter(b=>roomOf(b)===cam).forEach((b,i)=>drawMascot(390+i*210,260,b));
            c.fillStyle='rgba(255,255,255,.09)';
            for(let i=0;i<120;i++)c.fillRect(Math.random()*1000,Math.random()*600,20+Math.random()*120,1);
            c.fillStyle='#fff';c.font='bold 20px monospace';c.fillText(`CAM ${cam+1} // ${rooms[cam]}`,25,35);
          }
          function updateOffice(){
            host.querySelector('#nwfShutterL').classList.toggle('down',leftDoor);
            host.querySelector('#nwfShutterR').classList.toggle('down',rightDoor);
            const atL=bots.some(b=>roomOf(b)===8 && b.path[Math.max(0,b.step-1)]===6);
            const atR=bots.some(b=>roomOf(b)===8 && b.path[Math.max(0,b.step-1)]===7);
            host.querySelector('#nwfEyesL').style.opacity=leftLight&&atL?'1':'0';
            host.querySelector('#nwfEyesR').style.opacity=rightLight&&atR?'1':'0';
            office.classList.toggle('lit-l',leftLight);office.classList.toggle('lit-r',rightLight);
          }
          function finish(win,b){
            running=false;cover.style.display='grid';
            cover.innerHTML=win?`<div class="nwf-card win"><small>SHIFT COMPLETE</small><h2>6:00 AM</h2><p>The front doors unlock. You survived Night Watch.</p><button id="nwfAgain">PLAY AGAIN</button></div>`:
            `<div class="nwf-card lose"><small>SHIFT FAILED</small><h2>${b.name} GOT IN</h2><p>You made it to ${timeEl.textContent}. Watch the hall routes and save power.</p><button id="nwfAgain">RETRY</button></div>`;
            host.querySelector('#nwfAgain').onclick=start;
          }
          function start(){
            power=100;t=0;cameraUp=leftDoor=rightDoor=leftLight=rightLight=false;resetBots();cover.style.display='none';cams.style.display='none';office.style.display='block';running=true;last=performance.now();updateOffice();
          }
          function loop(now){
            const dt=Math.min(.05,(now-last)/1000||.016);last=now;
            if(running){
              t+=dt;
              const use=1+(cameraUp?1:0)+(leftDoor?1:0)+(rightDoor?1:0)+(leftLight?1:0)+(rightLight?1:0);
              power=Math.max(0,power-dt*(.045+.027*(use-1)));
              const hour=Math.min(6,Math.floor(t/18));timeEl.textContent=hour===0?'12 AM':hour+' AM';powerEl.textContent='POWER '+Math.ceil(power)+'%';usageEl.textContent='USAGE '+'▮'.repeat(use);
              if(power<=0){leftDoor=rightDoor=leftLight=rightLight=false;updateOffice()}
              bots.forEach((b,i)=>{
                if(Math.random()<dt/Math.max(3,b.wait-t/80)){
                  if(roomOf(b)===8){
                    const cameLeft=b.path[Math.max(0,b.step-1)]===6, blocked=cameLeft?leftDoor:rightDoor;
                    if(blocked){b.step=Math.max(0,b.step-2)}
                    else finish(false,b);
                  }else b.step=Math.min(b.path.length-1,b.step+1);
                }
              });
              if(cameraUp)drawFeed();updateOffice();if(t>=108)finish(true);
            }
            raf=requestAnimationFrame(loop);
          }
          host.querySelector('#nwfDoorL').onclick=()=>{if(power){leftDoor=!leftDoor;updateOffice()}};
          host.querySelector('#nwfDoorR').onclick=()=>{if(power){rightDoor=!rightDoor;updateOffice()}};
          host.querySelector('#nwfLightL').onclick=()=>{if(power){leftLight=true;updateOffice();setTimeout(()=>{leftLight=false;updateOffice()},900)}};
          host.querySelector('#nwfLightR').onclick=()=>{if(power){rightLight=true;updateOffice();setTimeout(()=>{rightLight=false;updateOffice()},900)}};
          host.querySelector('#nwfOpen').onclick=()=>{if(power){cameraUp=true;office.style.display='none';cams.style.display='grid';drawFeed()}};
          host.querySelector('#nwfLower').onclick=()=>{cameraUp=false;cams.style.display='none';office.style.display='block'};
          host.querySelector('#nwfStart').onclick=start;
          raf=requestAnimationFrame(loop);
          activeNativeCleanup=()=>cancelAnimationFrame(raf);
        }

        function startTheDay(host,game){
          stopNativeGame();
          host.innerHTML=`<div class="snfp" tabindex="0">
            <div class="snfp-hud">
              <div><b>SCHOOL NIGHTMARE</b><span id="snp">CHALLENGE 1 · PARKING PANIC</span></div>
              <div><span id="sns">SCORE 0000</span><span id="snstat">LAP TO SCHOOL</span></div>
            </div>
            <canvas id="sncv" width="1280" height="720"></canvas>
            <div class="snfp-foot"><span id="sno">Race to the final parking slot.</span><span id="snctrl">WASD / ARROWS · SPACE boost</span></div>
            <div class="snfp-cover" id="sncover"><div class="snfp-card">
              <small>NITROARCADE DELUXE FIRST-PERSON STORY GAME</small><h2>SCHOOL NIGHTMARE</h2>
              <p>Three completely different first-person challenges in one chaotic school day.</p>
              <div class="snfp-list"><b>🏎 1 · PARKING PANIC — high-speed school traffic race</b><b>🏃 2 · AFTER THE PRANK — endless-runner escape</b><b>⚽ 3 · FINAL WHISTLE — first-person football</b></div>
              <button id="snstart">START THE DAY</button>
            </div></div>
          </div>`;

          const sh=host.querySelector('.snfp'),cv=host.querySelector('#sncv'),c=cv.getContext('2d'),cover=host.querySelector('#sncover'),
                pEl=host.querySelector('#snp'),sEl=host.querySelector('#sns'),stat=host.querySelector('#snstat'),obj=host.querySelector('#sno'),ctrl=host.querySelector('#snctrl');
          let running=false,dead=false,raf=0,last=performance.now(),t=0,part=1,score=0,keys={};
          const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lerp=(a,b,n)=>a+(b-a)*n;
          function text(s,x,y,z=20,col='#fff',align='left'){c.fillStyle=col;c.font=`900 ${z}px Arial`;c.textAlign=align;c.fillText(s,x,y)}
          function rr(x,y,w,h,r,col){c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=col;c.fill()}
          function vignette(){let g=c.createRadialGradient(640,360,180,640,360,690);g.addColorStop(.55,'transparent');g.addColorStop(1,'rgba(0,0,0,.58)');c.fillStyle=g;c.fillRect(0,0,1280,720)}
          function finish(title,msg,next){
            running=false;cover.style.display='grid';cover.innerHTML=`<div class="snfp-card"><small>CHALLENGE COMPLETE</small><h2>${title}</h2><p>${msg}</p><strong>SCORE ${String(score).padStart(4,'0')}</strong><button id="snn">${next===4?'FINISH THE DAY':'NEXT CHALLENGE'}</button></div>`;
            cover.querySelector('#snn').onclick=()=>{if(next===4){cover.innerHTML=`<div class="snfp-card"><small>SCHOOL SURVIVED</small><h2>WHAT A DAY.</h2><p>You won the parking race, escaped the school, and finished the football match.</p><strong>FINAL SCORE ${String(score).padStart(4,'0')}</strong><button id="snr">PLAY AGAIN</button></div>`;cover.querySelector('#snr').onclick=()=>{score=0;cover.style.display='none';startRace();running=true;sh.focus()}}else{cover.style.display='none';next===2?startStealth():startFootball();running=true;sh.focus()}}
          }

          
          let race={x:0,z:0,v:0,boost:100,rival:0,cones:[],turn:0};
          function startRace(){
            part=1;t=0;race={x:0,z:0,v:0,boost:100,rival:0,cones:Array.from({length:18},(_,i)=>({x:(Math.random()-.5)*13,z:45+i*22})),turn:0};
            pEl.textContent='CHALLENGE 1 · PARKING PANIC';stat.textContent='BOOST 100%';obj.textContent='Beat the rival through traffic and take the glowing LAST SLOT.';ctrl.textContent='WASD / ARROWS steer · SPACE boost';
          }
          function raceFrame(dt){
            let steer=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),gas=(keys.w||keys.arrowup)?1:0,brake=(keys.s||keys.arrowdown)?1:0,boost=keys[' ']&&race.boost>0;
            race.v+=gas*29*dt-brake*38*dt;race.v*=.985;race.v=clamp(race.v,0,boost?46:32);
            if(boost){race.v+=32*dt;race.boost=Math.max(0,race.boost-30*dt)}else race.boost=Math.min(100,race.boost+9*dt);
            race.x=clamp(race.x+steer*(5.5+race.v*.14)*dt,-7.5,7.5);race.z+=race.v*dt;race.rival+=27.5*dt;
            const shake=boost?Math.sin(t*42)*2.2:0;
            c.save();c.translate(shake,boost?Math.cos(t*35)*1.3:0);
            let sky=c.createLinearGradient(0,0,0,360);sky.addColorStop(0,'#1687d5');sky.addColorStop(.58,'#75d4ff');sky.addColorStop(1,'#f5d7a4');c.fillStyle=sky;c.fillRect(-10,-10,1300,380);
            c.fillStyle='rgba(255,238,170,.85)';c.beginPath();c.arc(1030,115,55,0,7);c.fill();
            for(let i=0;i<15;i++){let x=i*95-40,hg=45+(i%5)*17;c.fillStyle=i%2?'#607486':'#4f6578';c.fillRect(x,270-hg,75,hg)}
            c.fillStyle='#df9257';c.fillRect(360,92,560,220);c.fillStyle='#7b2830';c.fillRect(330,72,620,28);
            c.fillStyle='#f6e3bd';c.fillRect(600,100,80,212);text('NITRO HIGH',640,139,27,'#fff','center');
            for(let i=0;i<8;i++){let wx=390+i*65;c.fillStyle='#82d5ee';c.fillRect(wx,174,40,48);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(wx+5,179,30,5)}
            c.fillStyle='#303942';c.fillRect(605,232,70,80);text('SCHOOL',640,260,11,'#fff','center');
            c.fillStyle='#456338';c.fillRect(-10,310,1300,420);let bend=Math.sin(race.z*.012)*115-race.x*34;
            c.fillStyle='#272d34';c.beginPath();c.moveTo(525+bend*.1,310);c.lineTo(755+bend*.1,310);c.lineTo(1210+bend,730);c.lineTo(70+bend,730);c.closePath();c.fill();
            c.fillStyle='#4d5359';c.beginPath();c.moveTo(540+bend*.1,310);c.lineTo(740+bend*.1,310);c.lineTo(1090+bend,720);c.lineTo(190+bend,720);c.closePath();c.fill();
            c.strokeStyle='#f5f5f5';c.lineWidth=6;c.beginPath();c.moveTo(535+bend*.1,310);c.lineTo(1150+bend,720);c.stroke();c.beginPath();c.moveTo(745+bend*.1,310);c.lineTo(130+bend,720);c.stroke();
            for(let i=1;i<16;i++){let d=((i*19-race.z*1.25)%304+304)%304+10,sc=1/(d*.011+.13),yy=310+390*sc/7,xx=640+bend*(yy-310)/410;c.fillStyle='#fff1b5';c.fillRect(xx-4*sc,yy,8*sc,27*sc)}
            for(let i=0;i<24;i++){let d=((i*17-race.z)%408+408)%408+14,sc=135/d,yy=310+405*sc/7,side=i%2?-1:1,xx=640+side*(165+270*sc)+bend*(yy-310)/410;
              if(i%4===0){c.fillStyle='#4a535c';c.fillRect(xx-3*sc,yy-75*sc,6*sc,75*sc);c.fillStyle='#fff6c7';c.beginPath();c.arc(xx,yy-80*sc,10*sc,0,7);c.fill()}
              else {c.fillStyle='#714b2f';c.fillRect(xx-5*sc,yy-38*sc,10*sc,38*sc);c.fillStyle=i%3?'#258842':'#36a353';c.beginPath();c.arc(xx,yy-51*sc,24*sc,0,7);c.fill()}
            }
            race.cones.forEach((o,i)=>{let d=o.z-race.z;if(d>3&&d<135){let sc=155/d,yy=315+400*sc/7,xx=640+(o.x-race.x)*32*sc+bend*(yy-310)/410;
              if(i%5===0){rr(xx-32*sc,yy-48*sc,64*sc,48*sc,6*sc,'#e8b13e');c.fillStyle='#9ad8ed';c.fillRect(xx-22*sc,yy-40*sc,44*sc,17*sc);text('BUS',xx,yy-8*sc,Math.max(7,10*sc),'#4b3512','center')}
              else if(i%3===0){rr(xx-29*sc,yy-30*sc,58*sc,30*sc,5*sc,i%2?'#e65c68':'#50a0e8');c.fillStyle='#bde8f7';c.fillRect(xx-17*sc,yy-25*sc,34*sc,11*sc)}
              else {c.fillStyle='#ff7b27';c.beginPath();c.moveTo(xx,yy-35*sc);c.lineTo(xx-14*sc,yy);c.lineTo(xx+14*sc,yy);c.fill()}
              if(Math.abs(o.x-race.x)<1.2&&d<6){race.v*=.45;o.z+=300}
            }});
            let rd=race.rival-race.z+18;if(rd>3&&rd<110){let sc=150/rd,yy=315+400*sc/7,xx=640+(2-race.x)*30*sc;rr(xx-40*sc,yy-40*sc,80*sc,40*sc,7*sc,'#3e73e6');c.fillStyle='#a9e7ff';c.fillRect(xx-23*sc,yy-33*sc,46*sc,15*sc);c.fillStyle='#ff4141';c.fillRect(xx-31*sc,yy-7*sc,12*sc,6*sc);c.fillRect(xx+19*sc,yy-7*sc,12*sc,6*sc);text('RIVAL',xx,yy-48*sc,Math.max(8,10*sc),'#fff','center')}
            if(boost)for(let i=0;i<24;i++){let x=(i*173+t*900)%1280,y=330+(i*79)%350;c.strokeStyle='rgba(120,225,255,.42)';c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.lineTo(x+(x-640)*.09,y+45);c.stroke()}
            let dash=c.createLinearGradient(0,590,0,720);dash.addColorStop(0,'#202832');dash.addColorStop(1,'#07090c');c.fillStyle=dash;c.beginPath();c.moveTo(-10,730);c.lineTo(-10,610);c.quadraticCurveTo(210,535,430,620);c.lineTo(850,620);c.quadraticCurveTo(1070,535,1290,610);c.lineTo(1290,730);c.fill();
            c.strokeStyle='#394654';c.lineWidth=20;c.beginPath();c.arc(640,735,150,Math.PI,Math.PI*2);c.stroke();
            rr(548,628,184,72,12,'#05080b');text(Math.round(race.v*7)+' km/h',640,661,25,boost?'#6be8ff':'#71e39b','center');text(boost?'NITRO BOOST':'DRIVE',640,686,10,'#b7c6d3','center');
            rr(28,28,270,58,12,'rgba(4,9,15,.78)');text('NITRO',45,51,12,'#9cecff');c.fillStyle='#24323d';c.fillRect(45,61,225,10);c.fillStyle=boost?'#61eaff':'#64e39a';c.fillRect(45,61,225*race.boost/100,10);
            stat.textContent='BOOST '+Math.ceil(race.boost)+'%';
            if(race.z>300){text('SCHOOL PARKING →',1180,355,18,'#9cffb4','right')}
            if(race.z>390){if(race.z>race.rival){score+=1400;finish('LAST SLOT SECURED!','You won the morning race and slid into the final parking space.',2)}else finish('RIVAL GOT THERE FIRST','You reached school, but the blue rival stole the final slot.',2)}
            vignette();c.restore();
          }

          
          const MAP=[
            '1111111111111111','1000000010000001','1011110010111101','1000010000000101',
            '1110011111000101','1000000001000001','1011110101011101','1000000101000001',
            '1011100000011101','1000101111000001','1100101000010111','1000001000000001',
            '1011101111011101','1000000000000001','1000111111100001','1111111111111111'
          ];
          
          let st={lane:1,x:0,y:0,vy:0,speed:18,distance:0,passes:0,coins:0,teacherGap:16,slide:0,obstacles:[],pickups:[],spawn:0,pickSpawn:0,flash:0};
          const RUN_LANES=[-4.4,0,4.4];
          function startStealth(){
            part=2;t=0;
            st={lane:1,x:0,y:0,vy:0,speed:18,distance:0,passes:0,coins:0,teacherGap:16,slide:0,obstacles:[],pickups:[],spawn:.7,pickSpawn:.4,flash:0};
            pEl.textContent='CHALLENGE 2 · AFTER THE PRANK';
            stat.textContent='ESCAPE 0 / 650m · PASSES 0 / 3';
            obj.textContent='RUN! Switch lanes, jump and slide through a packed school while the teacher chases you.';
            ctrl.textContent='A/D or ←/→ lanes · W/↑/SPACE jump · S/↓ slide';
          }
          function runnerProject(lane,z,y=0){
            const depth=Math.max(.5,z), horizon=238;
            const scale=560/(depth+8);
            return {x:640+RUN_LANES[lane]*scale,y:horizon+430/(depth*.085+1)-y*scale,scale:Math.max(.18,scale/38),depth};
          }
          function spawnRunnerObstacle(){
            const types=['desk','locker','cart','books','barrier'];
            st.obstacles.push({lane:Math.floor(Math.random()*3),z:66+Math.random()*12,type:types[Math.floor(Math.random()*types.length)],hit:false});
          }
          function spawnRunnerPickup(){
            const livePasses=st.pickups.filter(q=>q.type==='pass'&&!q.got).length;
            const isPass=(st.passes+livePasses)<3 && Math.random()<.24;
            st.pickups.push({lane:Math.floor(Math.random()*3),z:62+Math.random()*10,y:isPass?1.2:(Math.random()<.45?2.6:.7),type:isPass?'pass':'token',got:false});
          }
          function drawRunnerWorld(){
            let sky=c.createLinearGradient(0,0,0,300);sky.addColorStop(0,'#bfe8ff');sky.addColorStop(1,'#edf8ff');c.fillStyle=sky;c.fillRect(0,0,1280,300);
            c.fillStyle='#d8d1bd';c.fillRect(0,300,1280,420);
            const hz=238;
            c.fillStyle='#e8dfc7';c.beginPath();c.moveTo(0,0);c.lineTo(470,hz);c.lineTo(470,720);c.lineTo(0,720);c.fill();
            c.beginPath();c.moveTo(1280,0);c.lineTo(810,hz);c.lineTo(810,720);c.lineTo(1280,720);c.fill();
            c.fillStyle='#6d8394';c.beginPath();c.moveTo(470,hz);c.lineTo(810,hz);c.lineTo(1180,720);c.lineTo(100,720);c.closePath();c.fill();
            c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=3;
            [560,720].forEach(x=>{c.beginPath();c.moveTo(640+(x-640)*.18,hz);c.lineTo(640+(x-640)*3.2,720);c.stroke()});
            for(let i=0;i<14;i++){
              let z=((i*7-(st.distance*.75)%7)+7)%98+2, p=runnerProject(1,z);
              c.strokeStyle=`rgba(255,255,255,${Math.min(.25,.04+p.scale*.04)})`;c.lineWidth=Math.max(1,p.scale*2);
              c.beginPath();c.moveTo(640-11*p.scale,p.y);c.lineTo(640+11*p.scale,p.y);c.stroke();
            }
            for(let side of [-1,1])for(let i=0;i<7;i++){
              let z=((i*15-(st.distance*.45)%15)+15)%105+4,p=runnerProject(1,z),w=50*p.scale,hg=95*p.scale;
              let x=640+side*(9.2*p.scale+120);
              c.fillStyle=side<0?'#7db7d1':'#55718b';c.fillRect(x-w/2,p.y-hg,w,hg);
              c.fillStyle='rgba(255,255,255,.22)';c.fillRect(x-w*.35,p.y-hg*.84,w*.7,3*p.scale);
            }
            [...st.pickups].sort((a,b)=>b.z-a.z).forEach(o=>{
              if(o.got)return;let p=runnerProject(o.lane,o.z,o.y);
              if(o.type==='pass'){
                c.save();c.translate(p.x,p.y);c.rotate(Math.sin(t*5)*.12);rr(-35*p.scale,-25*p.scale,70*p.scale,44*p.scale,6*p.scale,'#68ffb0');text('PASS',0,2*p.scale,Math.max(9,13*p.scale),'#123c29','center');c.restore();
              }else{
                c.fillStyle='#ffd85c';c.beginPath();c.arc(p.x,p.y,13*p.scale,0,7);c.fill();text('N',p.x,p.y+5*p.scale,Math.max(8,12*p.scale),'#704d00','center');
              }
            });
            [...st.obstacles].sort((a,b)=>b.z-a.z).forEach(o=>{
              if(o.hit)return;let p=runnerProject(o.lane,o.z,0),s=p.scale;
              if(o.type==='desk'){rr(p.x-45*s,p.y-55*s,90*s,48*s,5*s,'#8b5a35');c.fillStyle='#51351f';c.fillRect(p.x-36*s,p.y-7*s,8*s,48*s);c.fillRect(p.x+28*s,p.y-7*s,8*s,48*s)}
              else if(o.type==='locker'){rr(p.x-32*s,p.y-120*s,64*s,120*s,4*s,'#52799b');c.strokeStyle='#b8d3e6';c.strokeRect(p.x-25*s,p.y-105*s,50*s,38*s)}
              else if(o.type==='cart'){rr(p.x-46*s,p.y-58*s,92*s,55*s,7*s,'#e28d42');c.fillStyle='#222';c.beginPath();c.arc(p.x-30*s,p.y,10*s,0,7);c.arc(p.x+30*s,p.y,10*s,0,7);c.fill()}
              else if(o.type==='books'){['#e45b5b','#5f8fe8','#efc452'].forEach((co,i)=>rr(p.x-38*s+i*8*s,p.y-(18+i*16)*s,76*s,15*s,3*s,co))}
              else {rr(p.x-55*s,p.y-62*s,110*s,62*s,6*s,'#e65050');text('WET FLOOR',p.x,p.y-28*s,Math.max(8,11*s),'#fff','center')}
            });
            const px=640+(st.x/4.4)*150, py=585-st.y*44+(st.slide>0?35:0);
            c.fillStyle='#252b35';c.fillRect(px-18,py-6,15,74);c.fillRect(px+3,py-6,15,74);
            rr(px-31,py-82,62,78,13,'#3f79d7');c.fillStyle='#d6a17f';c.beginPath();c.arc(px,py-103,23,0,7);c.fill();
            const chaseSize=clamp(125-(st.teacherGap-6)*4,58,125);
            c.fillStyle='rgba(35,26,45,.84)';c.beginPath();c.arc(95,555-chaseSize*.55,chaseSize*.17,0,7);c.fill();rr(95-chaseSize*.22,555-chaseSize*.43,chaseSize*.44,chaseSize*.55,10,'rgba(72,43,89,.9)');
            text(st.teacherGap<9?'TEACHER CLOSE!':'TEACHER',95,590,13,st.teacherGap<9?'#ff6868':'#fff','center');
            rr(22,20,350,82,12,'rgba(5,12,20,.78)');text('AFTER THE PRANK — ESCAPE RUN',42,48,16,'#8ee5ff');text(`${Math.floor(st.distance)} / 650m   •   PASSES ${st.passes}/3   •   TOKENS ${st.coins}`,42,76,13,'#fff');
            rr(930,22,320,54,12,'rgba(5,12,20,.72)');text('CHASE DISTANCE',950,45,11,'#b8d8ea');c.fillStyle='#243443';c.fillRect(950,55,270,9);c.fillStyle=st.teacherGap<9?'#ff5d68':'#65e6a4';c.fillRect(950,55,270*clamp(st.teacherGap/18,0,1),9);
            if(st.flash>0){c.fillStyle=`rgba(255,80,80,${st.flash*.32})`;c.fillRect(0,0,1280,720)}
            vignette();
          }
          function stealthFrame(dt){
            st.speed=Math.min(30,18+st.distance/110);
            st.distance+=st.speed*dt;
            st.spawn-=dt;st.pickSpawn-=dt;
            if(st.spawn<=0){spawnRunnerObstacle();st.spawn=Math.max(.42,1.15-st.speed*.018)+Math.random()*.35}
            if(st.pickSpawn<=0){spawnRunnerPickup();st.pickSpawn=.55+Math.random()*.8}
            if(!st._left&&(keys.a||keys.arrowleft)){st.lane=Math.max(0,st.lane-1);st._left=true}
            if(!(keys.a||keys.arrowleft))st._left=false;
            if(!st._right&&(keys.d||keys.arrowright)){st.lane=Math.min(2,st.lane+1);st._right=true}
            if(!(keys.d||keys.arrowright))st._right=false;
            st.x=lerp(st.x,RUN_LANES[st.lane],Math.min(1,dt*12));
            const jump=keys.w||keys.arrowup||keys.space;
            if(jump&&st.y<=.01&&!st._jump){st.vy=9.2;st._jump=true}
            if(!jump)st._jump=false;
            st.vy-=22*dt;st.y=Math.max(0,st.y+st.vy*dt);if(st.y===0&&st.vy<0)st.vy=0;
            st.slide=(keys.s||keys.arrowdown)&&st.y<.15?.32:Math.max(0,st.slide-dt);
            st.obstacles.forEach(o=>o.z-=st.speed*dt);
            st.pickups.forEach(o=>o.z-=st.speed*dt);
            st.obstacles.forEach(o=>{
              if(o.hit||o.z>3.2||o.z<-.8||o.lane!==st.lane)return;
              let safe=st.y>1.15 || (st.slide>0 && o.type==='locker');
              o.hit=true;
              if(!safe){st.teacherGap=Math.max(4,st.teacherGap-5);score=Math.max(0,score-80);st.flash=1}
              else score+=35;
            });
            st.pickups.forEach(o=>{
              if(o.got||o.z>3.4||o.z<-.8||o.lane!==st.lane)return;
              if(Math.abs(st.y-o.y)<1.9 || (o.y<1.4&&st.y<2.2)){o.got=true;if(o.type==='pass'){st.passes++;score+=300}else{st.coins++;score+=40};st.teacherGap=Math.min(18,st.teacherGap+.6)}
            });
            st.obstacles=st.obstacles.filter(o=>o.z>-4);st.pickups=st.pickups.filter(o=>o.z>-4);
            st.teacherGap=Math.min(18,st.teacherGap+dt*.55);st.flash=Math.max(0,st.flash-dt*2.5);
            stat.textContent=`ESCAPE ${Math.floor(st.distance)} / 650m · PASSES ${st.passes}/3 · TOKENS ${st.coins}`;
            if(st.teacherGap<=4.05){st.distance=Math.max(0,st.distance-35);st.teacherGap=12;score=Math.max(0,score-180)}
            if(st.distance>=650){
              score+=st.passes>=3?1100:550;
              finish('ESCAPED THE SCHOOL!',st.passes>=3?`Perfect getaway — all 3 hall passes and ${st.coins} Nitro tokens collected.`:`You escaped with ${st.passes}/3 hall passes and ${st.coins} Nitro tokens.`,3);
              return;
            }
            drawRunnerWorld();
          }

          
          let fb={x:0,z:26,ball:{x:0,z:8,vx:0,vz:0},def:[],goals:0,keeper:0,charge:0,flash:0};
          function respawnFootball(){
            fb.x=0;fb.z=26;
            fb.ball={x:0,z:8,vx:0,vz:0};
          }
          function startFootball(){
            part=3;t=0;
            fb={x:0,z:26,ball:{x:0,z:8,vx:0,vz:0},def:[{x:-7,z:-3},{x:7,z:-13},{x:-1,z:-23}],goals:0,keeper:0,charge:0,flash:0};
            pEl.textContent='CHALLENGE 3 · FINAL WHISTLE';
            stat.textContent='GOALS 0 / 3';
            obj.textContent='Dribble toward goal, beat the defenders, and score 3.';
            ctrl.textContent='WASD / ARROWS move · Hold SPACE to charge · release to shoot';
          }
          function fbScreen(wx,wz){
            let depth=fb.z-wz;
            if(depth<.35)return null;
            let sc=520/(depth+3);
            return {x:640+(wx-fb.x)*sc,y:350+235/(depth+2),sc:clamp(sc/22,.22,2.6),depth};
          }
          function footballFrame(dt){
            let mx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0);
            let mz=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);
            let ml=Math.hypot(mx,mz)||1;
            fb.x=clamp(fb.x+mx/ml*9*dt,-19,19);
            fb.z=clamp(fb.z+mz/ml*9*dt,-34,35);

            let b=fb.ball,dx=b.x-fb.x,dz=b.z-fb.z,bd=Math.hypot(dx,dz);
            if(bd<2.35 && Math.hypot(b.vx,b.vz)<10){
              b.vx += (fb.x-b.x)*2.1*dt;
              b.vz += (-5-b.vz)*.45*dt;
            }
            if(keys[' ']) fb.charge=clamp(fb.charge+65*dt,0,100);
            if(!keys[' '] && fb.charge>0 && bd<3.1){
              let power=13+fb.charge*.16;
              b.vx=(b.x-fb.x)*2.0;
              b.vz=-power;
              fb.flash=.14;fb.charge=0;
            } else if(!keys[' '] && bd>=3.1) fb.charge=0;

            fb.def.forEach((g,i)=>{
              let gx=b.x-g.x,gz=b.z-g.z,ll=Math.hypot(gx,gz)||1;
              g.x=clamp(g.x+gx/ll*(2.2+i*.28)*dt,-18,18);
              g.z=clamp(g.z+gz/ll*(2.2+i*.28)*dt,-34,20);
              if(ll<1.25){b.vx=(gx/ll)*7;b.vz=(gz/ll)*7}
            });
            fb.keeper=Math.sin(t*2.0)*4.1;

            b.x+=b.vx*dt;b.z+=b.vz*dt;b.vx*=.987;b.vz*=.987;
            fb.flash=Math.max(0,fb.flash-dt);

            if(b.z<-36){
              if(Math.abs(b.x)<6.4){
                if(Math.abs(b.x-fb.keeper)<1.8){
                  b.z=-33;b.vz=10;b.vx+=(b.x-fb.keeper)*2.2;
                }else{
                  fb.goals++;score+=650;stat.textContent=`GOALS ${fb.goals} / 3`;
                  if(fb.goals>=3){finish('HAT TRICK!','Three goals. Final whistle. School Nightmare complete.',4);return}
                  respawnFootball();
                }
              } else respawnFootball();
            }
            if(!Number.isFinite(b.x)||!Number.isFinite(b.z)||Math.abs(b.x)>28||b.z>42||b.z<-48)respawnFootball();

            let sky=c.createLinearGradient(0,0,0,310);sky.addColorStop(0,'#55afe9');sky.addColorStop(1,'#dff6ff');c.fillStyle=sky;c.fillRect(0,0,1280,310);
            c.fillStyle='#293746';c.fillRect(0,190,1280,150);
            for(let row=0;row<5;row++)for(let i=0;i<64;i++){c.fillStyle=['#f9d45c','#62b5ff','#ff6878','#f4f4f4','#79db8c'][(i+row)%5];c.fillRect(i*20+(row%2)*7,205+row*22,7,7)}
            poly([[75,720],[1205,720],[815,310],[465,310]],'#3d9d53');
            for(let i=0;i<8;i++){
              let a=i/8,bn=(i+1)/8;
              let y1=lerp(720,310,a),y2=lerp(720,310,bn);
              let l1=lerp(75,465,a),r1=lerp(1205,815,a),l2=lerp(75,465,bn),r2=lerp(1205,815,bn);
              if(i%2===0)poly([[l1,y1],[r1,y1],[r2,y2],[l2,y2]],'rgba(255,255,255,.045)');
            }
            c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=4;c.beginPath();c.moveTo(640,720);c.lineTo(640,310);c.stroke();
            c.strokeStyle='#fff';c.lineWidth=7;c.strokeRect(510,235,260,135);
            c.lineWidth=1;for(let i=1;i<7;i++){c.beginPath();c.moveTo(510+i*37,235);c.lineTo(510+i*37,370);c.stroke()}
            for(let j=1;j<5;j++){c.beginPath();c.moveTo(510,235+j*27);c.lineTo(770,235+j*27);c.stroke()}

            let sprites=[
              ...fb.def.map(g=>({...g,type:'def'})),
              {x:fb.keeper,z:-35,type:'keeper'},
              {...b,type:'ball'}
            ].map(o=>({o,p:fbScreen(o.x,o.z)})).filter(q=>q.p).sort((A,B)=>B.p.depth-A.p.depth);

            sprites.forEach(({o,p})=>{
              let sc=p.sc;
              if(o.type==='ball'){
                c.fillStyle='#fff';c.beginPath();c.arc(p.x,p.y,13*sc,0,Math.PI*2);c.fill();
                c.strokeStyle='#111';c.lineWidth=Math.max(1,2*sc);c.stroke();
                c.fillStyle='#111';c.beginPath();c.arc(p.x,p.y,4*sc,0,Math.PI*2);c.fill();
              }else{
                let col=o.type==='keeper'?'#f2b83d':'#356bd8';
                c.fillStyle='#d5a07c';c.beginPath();c.arc(p.x,p.y-52*sc,13*sc,0,Math.PI*2);c.fill();
                rr(p.x-18*sc,p.y-38*sc,36*sc,52*sc,5*sc,col);
                c.fillStyle='#172033';c.fillRect(p.x-16*sc,p.y+10*sc,11*sc,34*sc);c.fillRect(p.x+5*sc,p.y+10*sc,11*sc,34*sc);
              }
            });

            c.fillStyle='#e64f5d';poly([[470,720],[555,610],[610,720]],'#e64f5d');poly([[810,720],[725,610],[670,720]],'#e64f5d');
            rr(455,25,370,76,12,'rgba(5,11,18,.80)');
            text(`ULTRA  ${fb.goals}  —  0  RIVALS`,640,59,23,'#fff','center');
            text('FIRST TO 3 GOALS',640,84,12,'#9ed8ff','center');
            rr(480,665,320,18,9,'rgba(0,0,0,.55)');
            rr(480,665,320*(fb.charge/100),18,9,fb.charge>75?'#ffcf4a':'#6ee7a2');
            text(bd<3.1?'HOLD SPACE · POWER SHOT':'GET CLOSER TO THE BALL',640,650,14,bd<3.1?'#fff':'#ffd166','center');
            if(fb.flash){c.fillStyle=`rgba(255,255,255,${fb.flash*2})`;c.fillRect(0,0,1280,720)}
            vignette();
          }

          function poly(points,col){c.fillStyle=col;c.beginPath();c.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)c.lineTo(points[i][0],points[i][1]);c.closePath();c.fill()}

          function loop(ts){
            if(dead)return;let dt=Math.min(.04,(ts-last)/1000||.016);last=ts;
            if(running){t+=dt;c.clearRect(0,0,1280,720);part===1?raceFrame(dt):part===2?stealthFrame(dt):footballFrame(dt);sEl.textContent='SCORE '+String(score).padStart(4,'0')}
            raf=requestAnimationFrame(loop)
          }
          sh.addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault()});
          sh.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
          host.querySelector('#snstart').onclick=()=>{cover.style.display='none';startRace();running=true;sh.focus()};
          c.fillStyle='#76c3ee';c.fillRect(0,0,1280,360);c.fillStyle='#3f4850';c.fillRect(0,360,1280,360);text('SCHOOL NIGHTMARE',640,300,64,'#fff','center');text('FIRST-PERSON STORY ADVENTURE',640,345,20,'#dff4ff','center');
          raf=requestAnimationFrame(loop);activeNativeCleanup=()=>{dead=true;cancelAnimationFrame(raf)};
        }

        function startBlockBurst(host,game){
            stopNativeGame();
            const N=8, board=Array.from({length:N},()=>Array(N).fill(0));
            let score=0, selected=0, dead=false;
            const shapes=[
                [[0,0],[1,0],[2,0]], [[0,0],[0,1],[1,0],[1,1]],
                [[0,0],[1,0],[1,1]], [[0,0],[1,0],[2,0],[2,1]],
                [[0,0],[0,1],[0,2]], [[0,0],[1,0],[2,0],[3,0]]
            ];
            let choices=[];
            host.innerHTML=`<div class="nova-shell"><div class="nova-panel"><div class="nova-head">
              <div><div class="mega-kicker">NITROARCADE ORIGINAL</div><div class="nova-title">Block Burst</div></div>
              <div class="nova-rule">Select a shape → click its top-left board position. Fill complete rows/columns to clear them.</div></div>
              <div class="nova-board"><div class="nova-center"><div id="burstBoard" class="burst-board"></div>
              <div id="burstShapes" class="burst-shapes"></div><div class="nova-status"><span>SCORE <b id="burstScore">0</b></span></div>
              <div id="burstMsg" class="nova-message">Build smart combinations.</div></div></div></div></div>`;
            const boardEl=host.querySelector('#burstBoard'),shapeEl=host.querySelector('#burstShapes'),scoreEl=host.querySelector('#burstScore'),msg=host.querySelector('#burstMsg');
            function newChoices(){choices=Array.from({length:3},()=>shapes[Math.floor(Math.random()*shapes.length)]);selected=0;renderShapes();}
            function render(){
                boardEl.innerHTML='';
                for(let y=0;y<N;y++)for(let x=0;x<N;x++){
                    const b=document.createElement('button');b.className='burst-cell'+(board[y][x]?' on':'');b.title=`Row ${y+1}, Column ${x+1}`;
                    b.onclick=()=>place(x,y);boardEl.appendChild(b);
                }
            }
            function renderShapes(){
                shapeEl.innerHTML='';
                choices.forEach((s,i)=>{
                    const b=document.createElement('button');b.className='burst-shape'+(i===selected?' selected':'');
                    b.textContent=`PIECE ${i+1} • ${s.length} blocks`;b.onclick=()=>{selected=i;renderShapes();};shapeEl.appendChild(b);
                });
            }
            function canPlace(s,x,y){return s.every(([dx,dy])=>x+dx<N&&y+dy<N&&!board[y+dy][x+dx]);}
            function anyMove(){return choices.some(s=>{for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(canPlace(s,x,y))return true;return false;});}
            function clearLines(){
                const rows=[],cols=[];
                for(let y=0;y<N;y++)if(board[y].every(Boolean))rows.push(y);
                for(let x=0;x<N;x++)if(board.every(r=>r[x]))cols.push(x);
                rows.forEach(y=>board[y].fill(0));cols.forEach(x=>board.forEach(r=>r[x]=0));
                const n=rows.length+cols.length;if(n){score+=n*20;msg.textContent=`${n} line${n>1?'s':''} cleared!`;}
            }
            function place(x,y){
                if(dead)return;const s=choices[selected];if(!s||!canPlace(s,x,y)){msg.textContent='That piece does not fit there.';return;}
                s.forEach(([dx,dy])=>board[y+dy][x+dx]=1);score+=s.length;choices.splice(selected,1);selected=0;clearLines();
                if(!choices.length)newChoices();render();renderShapes();scoreEl.textContent=score;
                if(!anyMove()){dead=true;msg.innerHTML=`NO MORE MOVES • Final score ${score} <button class="nova-option" id="burstAgain">PLAY AGAIN</button>`;host.querySelector('#burstAgain').onclick=()=>startBlockBurst(host,game);}
            }
            activeNativeCleanup=()=>{dead=true;};newChoices();render();
        }

        function startMetroDash(host,game){
            stopNativeGame();
            let dead=false, running=true, lane=1, score=0, coins=0, speed=4.2, spawn=0, coinSpawn=0, last=performance.now();
            host.innerHTML=`<div class="nova-shell"><div class="nova-panel"><div class="nova-head">
              <div><div class="mega-kicker">NITROARCADE ORIGINAL</div><div class="nova-title">Metro Dash</div></div>
              <div class="nova-rule">← → / A D change lanes • ↑ / W jump • dodge barriers • collect sparks</div></div>
              <canvas class="runner-canvas" width="900" height="506" tabindex="0"></canvas>
              <div class="nova-status"><span>DISTANCE <b id="runScore">0</b></span><span>SPARKS <b id="runCoins">0</b></span></div>
              <div id="runMsg" class="nova-message">Click the game, then run.</div></div></div>`;
            const c=host.querySelector('canvas'),ctx=c.getContext('2d'),scoreEl=host.querySelector('#runScore'),coinEl=host.querySelector('#runCoins'),msg=host.querySelector('#runMsg');
            const obstacles=[],sparks=[];let jump=0,jumpV=0;
            const laneX=i=>300+i*150;
            function key(e){
                if(['ArrowLeft','a','A'].includes(e.key))lane=Math.max(0,lane-1);
                if(['ArrowRight','d','D'].includes(e.key))lane=Math.min(2,lane+1);
                if(['ArrowUp','w','W',' '].includes(e.key)&&jump===0)jumpV=12;
                e.preventDefault();
            }
            c.addEventListener('keydown',key);c.focus();
            function reset(){dead=false;running=true;lane=1;score=0;coins=0;speed=4.2;obstacles.length=0;sparks.length=0;jump=0;jumpV=0;last=performance.now();requestAnimationFrame(loop);}
            function loop(t){
                if(dead||!running)return;const dt=Math.min(2,(t-last)/16.67);last=t;score+=dt*.55;speed=Math.min(10,4.2+score/450);
                spawn-=dt;if(spawn<=0){obstacles.push({lane:Math.floor(Math.random()*3),y:-70});spawn=Math.max(25,70-speed*3)+Math.random()*25;}
                coinSpawn-=dt;if(coinSpawn<=0){sparks.push({lane:Math.floor(Math.random()*3),y:-30});coinSpawn=35+Math.random()*45;}
                if(jumpV||jump>0){jump+=jumpV*dt;jumpV-=.7*dt;if(jump<=0){jump=0;jumpV=0;}}
                obstacles.forEach(o=>o.y+=speed*dt);sparks.forEach(s=>s.y+=speed*.9*dt);
                for(const o of obstacles)if(o.lane===lane&&o.y>380&&o.y<465&&jump<45){dead=true;running=false;msg.innerHTML=`CRASH • Distance ${Math.floor(score)} • Sparks ${coins} <button class="nova-option" id="runAgain">RUN AGAIN</button>`;host.querySelector('#runAgain').onclick=reset;}
                for(let i=sparks.length-1;i>=0;i--)if(sparks[i].lane===lane&&sparks[i].y>390&&sparks[i].y<470){coins++;sparks.splice(i,1);}
                while(obstacles.length&&obstacles[0].y>540)obstacles.shift();while(sparks.length&&sparks[0].y>540)sparks.shift();
                draw();scoreEl.textContent=Math.floor(score);coinEl.textContent=coins;if(!dead)requestAnimationFrame(loop);
            }
            function draw(){
                ctx.fillStyle='#02060a';ctx.fillRect(0,0,c.width,c.height);
                ctx.fillStyle='#07131c';ctx.fillRect(210,0,480,c.height);
                ctx.strokeStyle='#27404f';ctx.lineWidth=3;[285,435,585,735].forEach(x=>{ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,c.height);ctx.stroke();});
                for(let y=(score*8)%70-70;y<c.height;y+=70){ctx.strokeStyle='#18303c';ctx.beginPath();ctx.moveTo(210,y);ctx.lineTo(690,y);ctx.stroke();}
                obstacles.forEach(o=>{ctx.fillStyle='#d36b5f';ctx.fillRect(laneX(o.lane)-42,o.y,84,52);ctx.fillStyle='#ffd0c9';ctx.fillRect(laneX(o.lane)-30,o.y+12,60,7);});
                sparks.forEach(s=>{ctx.fillStyle='#f1c75b';ctx.beginPath();ctx.arc(laneX(s.lane),s.y,12,0,Math.PI*2);ctx.fill();});
                const px=laneX(lane),py=430-jump;ctx.fillStyle='#6cc5ef';ctx.fillRect(px-22,py-34,44,44);ctx.fillStyle='#dff7ff';ctx.fillRect(px-11,py-24,7,7);ctx.fillRect(px+5,py-24,7,7);
            }
            activeNativeCleanup=()=>{dead=true;running=false;c.removeEventListener('keydown',key);};requestAnimationFrame(loop);
        }


        function ultraPolish3DRenderer(ren,T,exposure=1.05){
          try{
            ren.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));
            ren.shadowMap.enabled=true;
            if(T.VSMShadowMap) ren.shadowMap.type=T.VSMShadowMap;
            else if(T.PCFSoftShadowMap) ren.shadowMap.type=T.PCFSoftShadowMap;
            if('outputColorSpace' in ren && T.SRGBColorSpace) ren.outputColorSpace=T.SRGBColorSpace;
            if(T.NeutralToneMapping) ren.toneMapping=T.NeutralToneMapping;
            else if(T.ACESFilmicToneMapping) ren.toneMapping=T.ACESFilmicToneMapping;
            ren.toneMappingExposure=exposure;
            ren.debug && (ren.debug.checkShaderErrors=true);
            // Actual built-in 3D game renderer upgrade: physical-material conversion,
            // improved shadow filtering, realistic color management, and per-scene fill lighting.
            ren.domElement.dataset.nitroRenderer='graphics-v2';
            ren.shadowMap.autoUpdate=true;
            if('physicallyCorrectLights' in ren)ren.physicallyCorrectLights=true;
            const originalRender=ren.render.bind(ren);
            const polishedScenes=new WeakSet();
            ren.render=function(scene,camera){
              if(scene&&!polishedScenes.has(scene)){
                polishedScenes.add(scene);
                const fill=new T.HemisphereLight(0xa7cfff,0x3a2d3b,.24);
                fill.name='Nitro Graphics V2 Ambient Bounce';scene.add(fill);
                scene.traverse(obj=>{
                  if(!obj.isMesh)return;
                  if(obj.geometry&&obj.geometry.computeVertexNormals&&!obj.geometry.attributes.normal){try{obj.geometry.computeVertexNormals()}catch(e){}}
                  const mats=Array.isArray(obj.material)?obj.material:[obj.material];
                  const convert=m=>{
                    if(!m||m.isShaderMaterial||m.isSpriteMaterial||m.isMeshBasicMaterial||m.isMeshPhysicalMaterial||m.isMeshStandardMaterial)return m;
                    if(!m.isMeshLambertMaterial&&!m.isMeshPhongMaterial)return m;
                    const opts={color:m.color?m.color.clone():0xffffff,map:m.map||null,transparent:m.transparent,opacity:m.opacity,side:m.side,alphaTest:m.alphaTest||0,vertexColors:m.vertexColors,roughness:m.isMeshPhongMaterial?.42:.8,metalness:.04};
                    if(m.emissive)opts.emissive=m.emissive.clone();
                    if(m.emissiveIntensity!=null)opts.emissiveIntensity=m.emissiveIntensity;
                    const upgraded=new T.MeshStandardMaterial(opts);
                    upgraded.name=(m.name||'game-material')+'-PBR';return upgraded;
                  };
                  obj.material=Array.isArray(obj.material)?mats.map(convert):convert(mats[0]);
                  if(obj.receiveShadow!==false)obj.receiveShadow=true;
                });
              }
              return originalRender(scene,camera);
            };
          }catch(e){console.warn('Nitro 3D polish fallback',e)}
          return ren;
        }
        function ultraLoadThree(){
          if(window.THREE)return Promise.resolve(window.THREE);
          if(window.__threePromise)return window.__threePromise;
          window.__threePromise=(async()=>{
            try{
              const T=await import('https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js');
              window.THREE=T;
              window.NITRO_THREE_REVISION=T.REVISION||'186';
              document.documentElement.dataset.threeRevision=window.NITRO_THREE_REVISION;
              console.info('[NitroArcade] Three.js modern engine r'+window.NITRO_THREE_REVISION);
              return T;
            }catch(moduleErr){
              console.warn('[NitroArcade] Modern Three.js failed; using r160 compatibility fallback.',moduleErr);
              return await new Promise((ok,bad)=>{
                const urls=['./scripts/three.min.js','https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js','https://unpkg.com/three@0.160.0/build/three.min.js'];
                let i=0;
                const tryNext=()=>{
                  if(i>=urls.length){bad(new Error('Three.js failed to load'));return}
                  const s=document.createElement('script');s.src=urls[i++];
                  s.onload=()=>{
                    if(window.THREE){
                      window.NITRO_THREE_REVISION=window.THREE.REVISION||'160';
                      document.documentElement.dataset.threeRevision=window.NITRO_THREE_REVISION;
                      ok(window.THREE);
                    }else tryNext();
                  };
                  s.onerror=tryNext;
                  document.head.appendChild(s);
                };
                tryNext();
              });
            }
          })();
          return window.__threePromise;
        }
        async function startVoxelFrontier3D(host,game){
          stopNativeGame();
          let stopped=false, raf=0;

          host.innerHTML=`<div class="three3d-shell voxel-deluxe">
            <div class="three3d-bar"><b>VOXEL FRONTIER 3D — WILDLANDS</b><small style="opacity:.6;margin-left:8px">ENHANCED</small><span id="v3clock">DAY 1 • 08:00</span></div>
            <div id="v3stage" class="three3d-stage">
              <div class="v3-top-left"><b id="v3biome">MEADOW OUTPOST</b><small id="v3quest">QUEST • Reach the glowing Crystal Ruins</small></div>
              <button class="v3-controls-btn" id="v3controlsBtn" type="button">⌨ CONTROLS</button>
              <div class="v3-controls-panel" id="v3controlsPanel">
                <div class="v3-controls-head"><b>VOXEL FRONTIER CONTROLS</b><button id="v3controlsClose" type="button">×</button></div>
                <div class="v3-control-grid">
                  <div><kbd>W A S D</kbd><span>Move</span></div>
                  <div><kbd>MOUSE</kbd><span>Look around</span></div>
                  <div><kbd>SHIFT</kbd><span>Sprint</span></div>
                  <div><kbd>SPACE</kbd><span>Jump</span></div>
                  <div><kbd>1 — 5</kbd><span>Select block</span></div>
                  <div><kbd>LMB</kbd><span>Mine placed block</span></div>
                  <div><kbd>RMB</kbd><span>Place selected block</span></div>
                  <div><kbd>F</kbd><span>Interact / activate</span></div>
                  <div><kbd>R</kbd><span>Respawn at outpost</span></div>
                  <div><kbd>ESC</kbd><span>Release mouse</span></div><div><kbd>[ / ]</kbd><span>Look sensitivity</span></div>
                </div>
                <small>Click the world for mouse-look. If pointer lock is unavailable, hold and drag to rotate. [ and ] change sensitivity.</small>
              </div>
              <div class="v3-world-info" id="v3world">CLEAR • X 0 Z 0 • DISCOVERED 0/4</div><div class="v3-bars"><label>HEALTH <i><em id="v3hp"></em></i></label><label>STAMINA <i><em id="v3stam"></em></i></label></div>
              <div class="v3-cross">+</div>
              <div class="v3-toast" id="v3toast"></div>
              <div class="v3-hotbar" id="v3hotbar"></div>
              <div class="v3-minimap"><canvas id="v3map" width="150" height="150"></canvas><b>N</b></div>
            </div>
            <div class="three3d-help">CLICK game to lock mouse • WASD move • SHIFT sprint • SPACE jump • 1–5 select • LEFT mine placed blocks • RIGHT place • F interact • R respawn • ESC unlock mouse</div>
          </div>`;

          let T;
          try{ T=await ultraLoadThree(); }
          catch(err){
            host.querySelector('#v3stage').innerHTML='<div style="padding:30px;color:white">Three.js could not load. Check your internet connection.</div>';
            return;
          }

          const st=host.querySelector('#v3stage'), clock=host.querySelector('#v3clock'),
                biomeEl=host.querySelector('#v3biome'), questEl=host.querySelector('#v3quest'),
                hpEl=host.querySelector('#v3hp'), stamEl=host.querySelector('#v3stam'),
                toast=host.querySelector('#v3toast'), hotbar=host.querySelector('#v3hotbar'),
                mapcv=host.querySelector('#v3map'), mx=mapcv.getContext('2d'),
                controlsBtn=host.querySelector('#v3controlsBtn'), controlsPanel=host.querySelector('#v3controlsPanel'),
                controlsClose=host.querySelector('#v3controlsClose'), worldEl=host.querySelector('#v3world');

          const toggleControls=(show)=>controlsPanel.classList.toggle('open',show);
          controlsBtn.addEventListener('click',e=>{e.stopPropagation();toggleControls(!controlsPanel.classList.contains('open'))});
          controlsClose.addEventListener('click',e=>{e.stopPropagation();toggleControls(false)});

          const scene=new T.Scene();
          scene.background=new T.Color(0x79b4d6);
          scene.fog=new T.Fog(0x8eb8c9,65,155);

          const cam=new T.PerspectiveCamera(72,16/9,.1,180);
          const ren=ultraPolish3DRenderer(new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'}),T,.98);
          st.appendChild(ren.domElement);
          ren.domElement.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;';

          const hemi=new T.HemisphereLight(0xd5e9f1,0x344633,1.18);scene.add(hemi);
          const sun=new T.DirectionalLight(0xffdfad,1.72);
          sun.position.set(-28,48,24);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
          sun.shadow.camera.left=-42;sun.shadow.camera.right=42;sun.shadow.camera.top=42;sun.shadow.camera.bottom=-42;
          scene.add(sun);
          const moon=new T.DirectionalLight(0x6c83c9,.12);moon.position.set(25,30,-25);scene.add(moon);

          const clampN=(n,a,b)=>Math.max(a,Math.min(b,n));
          function heightAt(x,z){
            let y=Math.round(1.0+Math.sin(x*.19)*1.25+Math.cos(z*.17)*1.0+Math.sin((x+z)*.105)*.65);
            if(Math.hypot(x-9,z-7)<6)y=-1;
            if(x>15&&z<-10)y+=2;
            return clampN(y,-1,5);
          }

          const cube=new T.BoxGeometry(1,1,1);
          const terrainMats=[
            new T.MeshLambertMaterial({color:0x5da247}),
            new T.MeshLambertMaterial({color:0xd6bc7e}),
            new T.MeshLambertMaterial({color:0x777e82})
          ];
          const byType=[[],[],[]];
          for(let x=-32;x<=32;x++)for(let z=-32;z<=32;z++){
            const y=heightAt(x,z);
            const pond=Math.hypot(x-9,z-7)<6;
            const type=pond?1:(y>=4?2:0);
            byType[type].push([x,y,z]);
          }
          const dummy=new T.Object3D(), terrain=[];
          byType.forEach((arr,type)=>{
            const mesh=new T.InstancedMesh(cube,terrainMats[type],arr.length);
            arr.forEach((p,i)=>{dummy.position.set(p[0],p[1],p[2]);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)});
            mesh.instanceMatrix.needsUpdate=true;mesh.receiveShadow=true;scene.add(mesh);terrain.push(mesh);
          });
          const under=new T.Mesh(new T.BoxGeometry(66,4,66),new T.MeshLambertMaterial({color:0x604936}));
          under.position.set(0,-3,0);under.receiveShadow=true;scene.add(under);

          const water=new T.Mesh(new T.PlaneGeometry(11.7,11.7),new T.MeshStandardMaterial({color:0x318ec6,transparent:true,opacity:.74,roughness:.18,metalness:.08}));
          water.rotation.x=-Math.PI/2;water.position.set(9,.03,7);scene.add(water);

          const woodMat=new T.MeshLambertMaterial({color:0x70482d});
          const leafA=new T.MeshLambertMaterial({color:0x32763a}), leafB=new T.MeshLambertMaterial({color:0x4a9147});
          function box(w,h,d,x,y,z,mat,shadow=true){
            const q=new T.Mesh(new T.BoxGeometry(w,h,d),mat);q.position.set(x,y,z);
            q.castShadow=shadow;q.receiveShadow=true;scene.add(q);return q;
          }

          const treeSpots=[[-14,-13],[-19,4],[-11,16],[17,14],[24,2],[18,-17],[-24,-17],[-25,12],[3,-22],[27,-8],[-5,25],[11,21],[-28,-2]];
          treeSpots.forEach(([x,z],idx)=>{
            const y=heightAt(x,z)+.5,g=new T.Group();
            for(let k=0;k<4;k++){const q=new T.Mesh(new T.BoxGeometry(.62,1,.62),woodMat);q.position.y=k+.5;q.castShadow=true;g.add(q)}
            for(let ox=-1;ox<=1;ox++)for(let oz=-1;oz<=1;oz++){
              const q=new T.Mesh(new T.BoxGeometry(1.35,1.15,1.35),idx%2?leafA:leafB);
              q.position.set(ox*.82,4+(Math.abs(ox)+Math.abs(oz)===0?.55:0),oz*.82);q.castShadow=true;g.add(q);
            }
            g.position.set(x,y,z);scene.add(g);
          });

          const plank=new T.MeshLambertMaterial({color:0x845a35}),darkWood=new T.MeshLambertMaterial({color:0x4d3327});
          const glass=new T.MeshPhongMaterial({color:0x83d8ef,transparent:true,opacity:.62,shininess:90});
          box(8,.35,7,-6,heightAt(-6,4)+1.0,4,plank);
          box(8,3,.35,-6,3.3,.7,plank);box(.35,3,7,-10,3.3,4,plank);box(.35,3,7,-2,3.3,4,plank);
          box(3.05,3,.35,-8.5,3.3,7.3,plank);box(3.05,3,.35,-3.5,3.3,7.3,plank);
          box(9,.45,8,-6,5.1,4,darkWood);box(1.3,1.2,.08,-7.3,3.4,.48,glass,false);box(1.3,1.2,.08,-4.7,3.4,.48,glass,false);
          const sign=box(3,1,.18,-6,2.5,7.55,darkWood,false);sign.userData.interact='OUTPOST';
          const lantern=new T.PointLight(0xffb45d,2.2,12);lantern.position.set(-6,4.1,4);scene.add(lantern);

          const camp=new T.Group();
          for(let i=0;i<4;i++){let q=new T.Mesh(new T.CylinderGeometry(.12,.12,1.5,6),woodMat);q.rotation.z=Math.PI/2;q.rotation.y=i*Math.PI/4;camp.add(q)}
          const flame=new T.Mesh(new T.OctahedronGeometry(.5),new T.MeshBasicMaterial({color:0xff9b38}));flame.position.y=.62;camp.add(flame);
          camp.position.set(-1,heightAt(-1,-2)+.65,-2);scene.add(camp);
          const fireLight=new T.PointLight(0xff6e2c,3,13);fireLight.position.copy(camp.position);fireLight.position.y+=1;scene.add(fireLight);
          box(3,.35,.55,-3,heightAt(-3,-4)+.7,-4,woodMat);box(3,.35,.55,1,heightAt(1,-4)+.7,-4,woodMat);

          const ruinMat=new T.MeshLambertMaterial({color:0x737b80});
          const crystalMat=new T.MeshPhongMaterial({color:0x65e8ff,emissive:0x174b60,shininess:130});
          const crystals=[];
          for(let i=0;i<12;i++){
            const a=i/12*Math.PI*2,r=4.4,x=20+Math.cos(a)*r,z=-19+Math.sin(a)*r,y=heightAt(x,z)+1;
            box(.85,1.2+(i%3),.85,x,y+(i%3)*.45,z,ruinMat);
            const cr=new T.Mesh(new T.OctahedronGeometry(.42+(i%3)*.13),crystalMat);
            cr.position.set(x,y+2+(i%3)*.7,z);cr.castShadow=true;scene.add(cr);crystals.push(cr);
          }
          box(4,.75,4,20,heightAt(20,-19)+.7,-19,ruinMat);
          const core=new T.Mesh(new T.OctahedronGeometry(1.1),new T.MeshPhongMaterial({color:0xa66cff,emissive:0x421b75,shininess:140}));
          core.position.set(20,heightAt(20,-19)+2.8,-19);scene.add(core);
          const coreLight=new T.PointLight(0xa46cff,3,15);coreLight.position.copy(core.position);scene.add(coreLight);

          for(let y=0;y<4;y++)for(let x=-2;x<=2;x++){
            if(y<3&&Math.abs(x)<1.2)continue;
            box(1.15,1.05,1.2,-21+x,heightAt(-21+x,-7)+1+y,-7,ruinMat);
          }
          const caveGlow=new T.PointLight(0x6388ff,1.7,10);caveGlow.position.set(-21,2,-8);scene.add(caveGlow);

          const flowerCols=[0xff6f9e,0xffe56c,0x8bd6ff,0xca91ff];
          for(let i=0;i<80;i++){
            let x=-29+Math.random()*58,z=-29+Math.random()*58;if(Math.hypot(x-9,z-7)<7)continue;
            let q=new T.Mesh(new T.BoxGeometry(.12,.38,.12),new T.MeshLambertMaterial({color:flowerCols[i%4]}));
            q.position.set(x,heightAt(x,z)+.7,z);scene.add(q);
          }
          for(let i=0;i<28;i++){
            let x=-29+Math.random()*58,z=-29+Math.random()*58;
            let q=new T.Mesh(new T.DodecahedronGeometry(.18+Math.random()*.3,0),new T.MeshLambertMaterial({color:0x666c70}));
            q.position.set(x,heightAt(x,z)+.65,z);scene.add(q);
          }

          const animals=[];
          function makeAnimal(x,z,col,name){
            const mat=new T.MeshLambertMaterial({color:col}),g=new T.Group();
            const body=new T.Mesh(new T.BoxGeometry(1.2,.7,.65),mat);body.position.y=.65;g.add(body);
            const head=new T.Mesh(new T.BoxGeometry(.52,.52,.52),mat);head.position.set(.72,.87,0);g.add(head);
            for(let i=0;i<4;i++){let leg=new T.Mesh(new T.BoxGeometry(.15,.52,.15),mat);leg.position.set(i<2?-.35:.35,.18,i%2?-.22:.22);g.add(leg)}
            g.position.set(x,heightAt(x,z)+.5,z);g.userData={baseX:x,baseZ:z,phase:Math.random()*6,name};scene.add(g);animals.push(g);
          }
          makeAnimal(3,14,0xeee1c7,'SHEEP');makeAnimal(-15,9,0xc68a62,'DEER');makeAnimal(13,-4,0xe9d8b7,'SHEEP');makeAnimal(-2,-15,0xb87755,'FOX');

          const clouds=[];
          for(let i=0;i<11;i++){
            let g=new T.Group();
            for(let j=0;j<5;j++){let q=new T.Mesh(new T.BoxGeometry(3.2,1.2,1.9),new T.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:.83}));q.position.set(j*2.1,Math.sin(j)*.25,0);g.add(q)}
            g.position.set(-58+i*12,18+(i%4)*3,-35+(i%5)*18);scene.add(g);clouds.push(g);
          }
          const stars=new T.Points(new T.BufferGeometry(),new T.PointsMaterial({color:0xffffff,size:.34,transparent:true,opacity:0}));
          let starPos=[];for(let i=0;i<320;i++){let aa=Math.random()*Math.PI*2,rr=70+Math.random()*65;starPos.push(Math.cos(aa)*rr,20+Math.random()*65,Math.sin(aa)*rr)}
          stars.geometry.setAttribute('position',new T.Float32BufferAttribute(starPos,3));scene.add(stars);
          const fireflies=[];for(let i=0;i<22;i++){let q=new T.Mesh(new T.SphereGeometry(.055,5,4),new T.MeshBasicMaterial({color:0xffef8a}));q.position.set(-15+Math.random()*30,2+Math.random()*4,-15+Math.random()*30);scene.add(q);fireflies.push(q)}


          const trailMat=new T.MeshStandardMaterial({color:0x73563c,roughness:1});
          for(let i=0;i<24;i++){
            const t=i/23,x=-4+(24*t),z=3+(-22*t),y=heightAt(x,z)+.53;
            const tile=new T.Mesh(new T.BoxGeometry(1.6,.08,1.45),trailMat);
            tile.position.set(x,y,z);tile.rotation.y=Math.sin(i*.8)*.12;tile.receiveShadow=true;scene.add(tile);
          }

          const bridge=new T.Group();
          for(let i=-4;i<=4;i++){let p=new T.Mesh(new T.BoxGeometry(1.15,.22,3.4),plank);p.position.set(i*1.12,0,0);p.castShadow=true;bridge.add(p)}
          for(const z of [-1.55,1.55]){let rail=new T.Mesh(new T.BoxGeometry(10.5,.16,.16),darkWood);rail.position.set(0,1,z);bridge.add(rail);
            for(let x=-5;x<=5;x+=2){let post=new T.Mesh(new T.BoxGeometry(.14,1.6,.14),darkWood);post.position.set(x,.45,z);bridge.add(post)}}
          bridge.position.set(9,heightAt(9,7)+1.2,7);scene.add(bridge);

          const towerG=new T.Group();
          for(const x of [-1.6,1.6])for(const z of [-1.6,1.6]){let leg=new T.Mesh(new T.BoxGeometry(.3,6,.3),darkWood);leg.position.set(x,3,z);towerG.add(leg)}
          let deck=new T.Mesh(new T.BoxGeometry(4.2,.35,4.2),plank);deck.position.y=5.7;towerG.add(deck);
          let roof2=new T.Mesh(new T.ConeGeometry(3.2,1.5,4),darkWood);roof2.position.y=7.4;roof2.rotation.y=Math.PI/4;towerG.add(roof2);
          towerG.position.set(-13,heightAt(-13,1)+.5,1);scene.add(towerG);

          const metalMat=new T.MeshStandardMaterial({color:0x5e6468,roughness:.65,metalness:.45});
          box(7,.4,5,14,heightAt(14,17)+.7,17,darkWood);
          for(const [x,z] of [[12,15],[16,15],[12,19],[16,19]])box(.35,3,.35,x,heightAt(x,z)+1.8,z,darkWood);
          for(let i=0;i<5;i++){let ore=new T.Mesh(new T.DodecahedronGeometry(.35+i*.03,0),new T.MeshStandardMaterial({color:i%2?0x7aa8bb:0x8c735b,roughness:.7,metalness:.25}));ore.position.set(11+i*1.2,heightAt(11+i*1.2,20)+.8,20);scene.add(ore)}
          const cart=new T.Group(),cartBody=new T.Mesh(new T.BoxGeometry(2,1,1.3),metalMat);cartBody.position.y=.8;cart.add(cartBody);
          for(const x of [-.7,.7])for(const z of [-.55,.55]){let wh=new T.Mesh(new T.CylinderGeometry(.25,.25,.18,8),new T.MeshStandardMaterial({color:0x17191b,roughness:1}));wh.rotation.z=Math.PI/2;wh.position.set(x,.25,z);cart.add(wh)}
          cart.position.set(15,heightAt(15,13)+.5,13);scene.add(cart);

          const reedMat=new T.MeshLambertMaterial({color:0x52763b}),lilyMat=new T.MeshLambertMaterial({color:0x4d8a48});
          for(let i=0;i<35;i++){let a=Math.random()*Math.PI*2,r=3.4+Math.random()*2.3,x=9+Math.cos(a)*r,z=7+Math.sin(a)*r;
            let reed=new T.Mesh(new T.BoxGeometry(.08,.9+Math.random()*.8,.08),reedMat);reed.position.set(x,heightAt(x,z)+.75,z);scene.add(reed)}
          for(let i=0;i<12;i++){let pad=new T.Mesh(new T.CylinderGeometry(.3+.15*Math.random(),.3+.15*Math.random(),.04,10),lilyMat);pad.position.set(7+Math.random()*4,.08,5+Math.random()*4);scene.add(pad)}

          const landmarkPositions=[[-24,18,'WEST RIDGE'],[25,9,'OLD MINE'],[-8,-25,'FROST PASS']];
          landmarkPositions.forEach(([x,z,label])=>{let post=box(.25,2,.25,x,heightAt(x,z)+1.4,z,darkWood);let board=box(2.8,.75,.2,x,heightAt(x,z)+2.1,z,darkWood,false);board.userData.interact=label});

          const butterflies=[];
          for(let i=0;i<18;i++){let b=new T.Mesh(new T.BoxGeometry(.18,.04,.3),new T.MeshBasicMaterial({color:flowerCols[i%4]}));b.position.set(-20+Math.random()*40,2+Math.random()*3,-20+Math.random()*40);b.userData.phase=Math.random()*7;scene.add(b);butterflies.push(b)}
          const birds=[];
          for(let i=0;i<8;i++){let g=new T.Group(),m=new T.MeshBasicMaterial({color:0x26333a});
            let l=new T.Mesh(new T.BoxGeometry(.8,.04,.16),m),r=new T.Mesh(new T.BoxGeometry(.8,.04,.16),m);l.position.x=-.38;r.position.x=.38;g.add(l,r);
            g.position.set(-30+i*8,14+(i%3)*3,-15+i*4);g.userData.phase=i;scene.add(g);birds.push(g)}

          const weatherGeo=new T.BufferGeometry(),weatherCount=260,weatherPos=new Float32Array(weatherCount*3);
          for(let i=0;i<weatherCount;i++){weatherPos[i*3]=(Math.random()-.5)*70;weatherPos[i*3+1]=Math.random()*30;weatherPos[i*3+2]=(Math.random()-.5)*70}
          weatherGeo.setAttribute('position',new T.BufferAttribute(weatherPos,3));
          const weather=new T.Points(weatherGeo,new T.PointsMaterial({color:0xbdd8e6,size:.07,transparent:true,opacity:0}));scene.add(weather);
          let weatherMode='CLEAR',weatherTimer=0;

          const discoveries=[
            {name:'OLD MINE',p:new T.Vector3(15,0,17),seen:false},
            {name:'WATCHTOWER',p:new T.Vector3(-13,0,1),seen:false},
            {name:'CRYSTAL RUINS',p:new T.Vector3(20,0,-19),seen:false},
            {name:'CAVE ARCH',p:new T.Vector3(-21,0,-7),seen:false}
          ];
          let discovered=0;


          const collectibles=[],pickupMat=new T.MeshStandardMaterial({color:0xffd45c,emissive:0x6a4200,roughness:.25,metalness:.5});
          [[-9,11],[4,-10],[17,15],[-19,-5],[24,-17],[-12,22]].forEach(([x,z],i)=>{
            let q=new T.Mesh(new T.IcosahedronGeometry(.38,0),pickupMat);q.position.set(x,heightAt(x,z)+1.25,z);q.userData={taken:false,phase:i};scene.add(q);collectibles.push(q)
          });
          let relics=0;
          const supplyCaches=[];
          [[-15,7],[11,18],[-22,-11]].forEach(([x,z])=>{
            let c=new T.Mesh(new T.BoxGeometry(1.25,.8,.9),new T.MeshStandardMaterial({color:0x5e4630,roughness:.85}));
            c.position.set(x,heightAt(x,z)+.9,z);c.castShadow=true;c.userData.open=false;scene.add(c);supplyCaches.push(c)
          });
          const beaconMat=new T.MeshBasicMaterial({color:0x6de9ff,transparent:true,opacity:.55}),beacons=[];
          [[-13,1],[15,17],[20,-19],[-21,-7]].forEach(([x,z])=>{
            let b=new T.Mesh(new T.CylinderGeometry(.06,.25,5,8,1,true),beaconMat);b.position.set(x,heightAt(x,z)+3,z);scene.add(b);beacons.push(b)
          });

          const placed=[],ray=new T.Raycaster();
          const placeMats=[
            new T.MeshLambertMaterial({color:0x5da247}),new T.MeshLambertMaterial({color:0x8a6344}),
            new T.MeshLambertMaterial({color:0x777e82}),new T.MeshLambertMaterial({color:0xd6bc7e}),
            new T.MeshLambertMaterial({color:0x845a35})
          ];
          let yaw=0,pitch=-.12,targetYaw=0,targetPitch=-.12,lookSensitivity=.0042,velY=0,onGround=false,health=100,stamina=100,selected=0,inventory=[30,18,24,12,16],dayTime=8,day=1,questDone=false;
          const names=['GRASS','DIRT','STONE','SAND','WOOD'],keys={};
          cam.position.set(0,heightAt(0,10)+2.2,10);

          function renderHotbar(){hotbar.innerHTML=names.map((n,i)=>`<div class="${i===selected?'sel':''}"><kbd>${i+1}</kbd><b>${n}</b><small>${inventory[i]}</small></div>`).join('')}
          function say(s){toast.textContent=s;toast.classList.add('show');clearTimeout(say.t);say.t=setTimeout(()=>toast.classList.remove('show'),1500)}
          function respawn(){cam.position.set(0,heightAt(0,10)+2.2,10);targetYaw=yaw;targetPitch=pitch;velY=0;health=100;say('RESPAWNED AT OUTPOST')}
          function addPlaced(p,type){
            const q=new T.Mesh(cube,placeMats[type]);q.position.copy(p).round();q.castShadow=q.receiveShadow=true;q.userData.type=type;scene.add(q);placed.push(q);return q;
          }
          function mine(){
            ray.setFromCamera(new T.Vector2(0,0),cam);const hit=ray.intersectObjects(placed,false)[0];
            if(hit&&hit.distance<6){const type=hit.object.userData.type||0;scene.remove(hit.object);placed.splice(placed.indexOf(hit.object),1);inventory[type]++;renderHotbar();say('+1 '+names[type])}
            else say('Placed blocks can be mined');
          }
          function place(){
            if(inventory[selected]<=0)return;
            ray.setFromCamera(new T.Vector2(0,0),cam);
            const all=[...terrain,...placed],hit=ray.intersectObjects(all,false)[0];
            if(!hit||hit.distance>7)return;
            const p=hit.point.clone().add(hit.face.normal.clone().multiplyScalar(.51)).round();
            if(p.distanceTo(cam.position)<1.4)return;
            addPlaced(p,selected);inventory[selected]--;renderHotbar();
          }
          function interact(){
            if(cam.position.distanceTo(core.position)<5&&!questDone){
              questDone=true;questEl.textContent='QUEST COMPLETE • Crystal signal restored';
              if(typeof score==='number')score+=500;
              core.material.color.set(0xffd66d);core.material.emissive.set(0x75430f);say('CRYSTAL CORE ACTIVATED • +500');
            }else if(cam.position.distanceTo(sign.position)<5)say('OUTPOST 07 • WILDLANDS RESEARCH CAMP');
          }

          function keyDown(e){
            keys[e.code]=true;
            if(/^Digit[1-5]$/.test(e.code)){selected=Number(e.code.slice(-1))-1;renderHotbar()}
            if(e.code==='KeyR')respawn();if(e.code==='KeyF')interact();if(e.code==='BracketLeft'){lookSensitivity=Math.max(.0018,lookSensitivity-.0005);say('LOOK SPEED '+Math.round(lookSensitivity*10000))}if(e.code==='BracketRight'){lookSensitivity=Math.min(.008,lookSensitivity+.0005);say('LOOK SPEED '+Math.round(lookSensitivity*10000))}
            if(e.code==='Space'&&onGround){velY=.18;onGround=false}
            if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
          }
          function keyUp(e){keys[e.code]=false}
          let draggingLook=false,lastPX=0,lastPY=0;
          function applyLook(dx,dy){
            targetYaw-=dx*lookSensitivity;
            targetPitch=clampN(targetPitch-dy*lookSensitivity,-1.28,1.28);
          }
          function mouseMove(e){
            if(document.pointerLockElement===ren.domElement){applyLook(e.movementX||0,e.movementY||0);return}
            if(draggingLook){applyLook(e.clientX-lastPX,e.clientY-lastPY);lastPX=e.clientX;lastPY=e.clientY}
          }
          function mouseDown(e){
            lastPX=e.clientX;lastPY=e.clientY;
            if(document.pointerLockElement!==ren.domElement){
              draggingLook=true;
              try{const q=ren.domElement.requestPointerLock?.();if(q?.catch)q.catch(()=>{})}catch(_){}
              return;
            }
            if(e.button===0)mine();if(e.button===2)place();
          }
          function mouseUp(e){
            draggingLook=false;
            if(document.pointerLockElement===ren.domElement){if(e.button===0)mine();if(e.button===2)place()}
          }
          addEventListener('keydown',keyDown);addEventListener('keyup',keyUp);addEventListener('mousemove',mouseMove);addEventListener('mouseup',mouseUp);
          ren.domElement.addEventListener('mousedown',mouseDown);ren.domElement.oncontextmenu=e=>e.preventDefault();
          renderHotbar();

          function updateMap(){
            mx.clearRect(0,0,150,150);mx.fillStyle='#102319';mx.fillRect(0,0,150,150);
            mx.strokeStyle='#315d3b';for(let i=0;i<=150;i+=15){mx.beginPath();mx.moveTo(i,0);mx.lineTo(i,150);mx.stroke();mx.beginPath();mx.moveTo(0,i);mx.lineTo(150,i);mx.stroke()}
            const dot=(x,z,col,r=3)=>{mx.fillStyle=col;mx.beginPath();mx.arc(75+x*2.05,75+z*2.05,r,0,Math.PI*2);mx.fill()};
            dot(9,7,'#3bb5e9',10);dot(20,-19,'#b36cff',5);dot(-6,4,'#ffba65',5);dot(-21,-7,'#7187ff',4);
            animals.forEach(q=>dot(q.position.x,q.position.z,'#eee0b9',2));dot(cam.position.x,cam.position.z,'#fff',4);
          }

          function resize(){
            const w=Math.max(480,st.clientWidth),hh=Math.max(520,st.clientHeight);
            ren.setSize(w,hh,false);cam.aspect=w/hh;cam.updateProjectionMatrix();
          }
          resize();
          cam.rotation.order='YXZ';cam.rotation.y=yaw;cam.rotation.x=pitch;
          try{ren.render(scene,cam)}catch(err){
            console.error('Voxel render error',err);
            st.insertAdjacentHTML('beforeend',`<div style="position:absolute;z-index:50;inset:20px;background:#250b0be8;color:#fff;padding:20px;font:14px monospace">VOXEL RENDER ERROR<br><br>${String(err.message||err)}</div>`);
            return;
          }

          function loop(){
            if(stopped)return;raf=requestAnimationFrame(loop);resize();
            yaw+=(targetYaw-yaw)*.38;pitch+=(targetPitch-pitch)*.38;
            yaw+=(targetYaw-yaw)*.42;pitch+=(targetPitch-pitch)*.42;
            cam.rotation.order='YXZ';cam.rotation.y=yaw;cam.rotation.x=pitch;
            const f=new T.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)),r=new T.Vector3(Math.cos(yaw),0,-Math.sin(yaw)),mv=new T.Vector3();
            if(keys.KeyW)mv.add(f);if(keys.KeyS)mv.sub(f);if(keys.KeyD)mv.add(r);if(keys.KeyA)mv.sub(r);
            const moving=mv.lengthSq()>0,sprinting=!!keys.ShiftLeft&&stamina>1;
            const speed=sprinting?0.14:0.085;if(moving)cam.position.add(mv.normalize().multiplyScalar(speed));
            stamina=clampN(stamina+(sprinting&&moving?-.42:.20),0,100);
            const gy=heightAt(cam.position.x,cam.position.z)+2.0;velY-=.009;cam.position.y+=velY;
            if(cam.position.y<=gy){cam.position.y=gy;velY=0;onGround=true}
            cam.position.x=clampN(cam.position.x,-31,31);cam.position.z=clampN(cam.position.z,-31,31);

            const now=performance.now()*.001;dayTime+=.0015;if(dayTime>=24){dayTime=0;day++}
            const phase=(dayTime-6)/24*Math.PI*2,daylight=clampN(Math.sin(phase)*.72+.35,.08,1);
            sun.position.set(Math.cos(phase)*55,Math.max(6,Math.sin(phase)*55),Math.sin(phase)*30);
            sun.intensity=.25+daylight*2.15;hemi.intensity=.4+daylight*1.45;moon.intensity=(1-daylight)*.8;
            scene.background.setHSL(.57,.55,.12+daylight*.50);scene.fog.color.copy(scene.background);stars.material.opacity=clampN(1-daylight*1.45,0,.9);
            water.material.opacity=.69+Math.sin(now*1.5)*.035;flame.scale.setScalar(.85+Math.sin(now*10)*.15);fireLight.intensity=2.5+Math.sin(now*9)*.45;lantern.intensity=daylight<.45?2.5:.75;
            crystals.forEach((q,i)=>q.rotation.y+=.006+i*.00025);core.rotation.y+=.009;core.position.y=heightAt(20,-19)+2.8+Math.sin(now*1.7)*.14;
            clouds.forEach((q,i)=>{q.position.x+=.008+i*.0001;if(q.position.x>65)q.position.x=-65});
            fireflies.forEach((q,i)=>{q.visible=daylight<.55;q.position.y+=Math.sin(now*2+i)*.0015});
            animals.forEach(q=>{q.position.x=q.userData.baseX+Math.sin(now*.33+q.userData.phase)*2;q.position.z=q.userData.baseZ+Math.cos(now*.28+q.userData.phase)*1.6;q.position.y=heightAt(q.position.x,q.position.z)+.5});

            const dr=Math.hypot(cam.position.x-20,cam.position.z+19),dp=Math.hypot(cam.position.x-9,cam.position.z-7);
            biomeEl.textContent=dr<8?'CRYSTAL RUINS':dp<7?'MIRROR POND':cam.position.x<-16?'STONE CAVES':Math.hypot(cam.position.x+6,cam.position.z-4)<8?'MEADOW OUTPOST':'WILDLANDS';
            clock.textContent=`DAY ${day} • ${String(Math.floor(dayTime)).padStart(2,'0')}:${String(Math.floor((dayTime%1)*60)).padStart(2,'0')}`;
            hpEl.style.width=health+'%';stamEl.style.width=stamina+'%';updateMap();

            butterflies.forEach((b,i)=>{let t=performance.now()*.001+b.userData.phase;b.position.y+=Math.sin(t*3+i)*.003;b.rotation.y=t});
            birds.forEach((b,i)=>{let t=performance.now()*.00018+i;b.position.x+=Math.cos(t+i)*.006;b.position.z+=Math.sin(t*.8+i)*.006;b.rotation.y=-t});
            weatherTimer+=.016;
            if(weatherTimer>28){weatherTimer=0;weatherMode=weatherMode==='CLEAR'?(Math.random()>.55?'DRIZZLE':'MIST'):'CLEAR'}
            weather.material.opacity=weatherMode==='DRIZZLE'?.32:0;
            if(weatherMode==='DRIZZLE'){let a=weather.geometry.attributes.position.array;for(let i=0;i<weatherCount;i++){a[i*3+1]-=.18;if(a[i*3+1]<0)a[i*3+1]=30}weather.geometry.attributes.position.needsUpdate=true}
            discoveries.forEach(d=>{if(!d.seen&&Math.hypot(cam.position.x-d.p.x,cam.position.z-d.p.z)<6){d.seen=true;discovered++;say('DISCOVERED • '+d.name);try{NitroArcade.xp?.add?.(15,'Discovery')}catch(e){}}});
            collectibles.forEach((q,i)=>{if(q.userData.taken)return;q.rotation.y+=.025;q.position.y+=Math.sin(performance.now()*.003+i)*.002;if(cam.position.distanceTo(q.position)<1.6){q.userData.taken=true;q.visible=false;relics++;say('ANCIENT RELIC '+relics+'/6');try{NitroArcade.xp?.add?.(10,'Relic')}catch(e){}}});
            supplyCaches.forEach(c=>{if(!c.userData.open&&cam.position.distanceTo(c.position)<2){c.userData.open=true;c.material.color.setHex(0x8b704d);stamina=Math.min(100,stamina+35);inventory[0]+=3;inventory[2]+=2;renderHotbar();say('SUPPLY CACHE • +BLOCKS +STAMINA')}});
            beacons.forEach((b,i)=>{b.material.opacity=.32+Math.sin(performance.now()*.003+i)*.18});
            if(worldEl)worldEl.textContent=`${weatherMode} • X ${cam.position.x|0} Z ${cam.position.z|0} • DISC ${discovered}/4 • RELICS ${relics}/6`;

            ren.render(scene,cam);
          }

          activeNativeCleanup=()=>{
            stopped=true;cancelAnimationFrame(raf);document.exitPointerLock?.();
            removeEventListener('keydown',keyDown);removeEventListener('keyup',keyUp);removeEventListener('mousemove',mouseMove);
            ren.domElement.removeEventListener('mousedown',mouseDown);ren.dispose();
          };
          say('WORLD LOADED • CLICK TO LOOK AROUND');
          loop();
        }

        async function startStadiumStrike3D(host,game){
          stopNativeGame();let stop=false;
          host.innerHTML=`<div class="three3d-shell"><div class="three3d-bar"><b>STADIUM STRIKE 3D</b><span id="fscore">BLUE 0 — 0 RED</span></div><div id="fstage" class="three3d-stage"><div class="three3d-hud">WASD / arrows • SPACE shoot</div></div><div class="three3d-help">First to 5 goals wins. Dribble into range and shoot toward the red goal.</div></div>`;
          let T;try{T=await ultraLoadThree()}catch(e){host.querySelector('#fstage').innerHTML='<p style="color:white;padding:25px">3D engine could not load.</p>';return}
          const st=host.querySelector('#fstage'),scoreEl=host.querySelector('#fscore'),sc=new T.Scene();sc.background=new T.Color(0x101b28);const cam=new T.PerspectiveCamera(55,16/9,.1,100);cam.position.set(0,15,18);cam.lookAt(0,0,0);
          const ren=ultraPolish3DRenderer(new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'}),T,1.12);st.appendChild(ren.domElement);st.insertAdjacentHTML('beforeend','<div class="ultra3d-badge">NIGHT CUP • FIRST TO 5</div>');sc.add(new T.HemisphereLight(0xdff3ff,0x17321f,2.1));const stadiumSun=new T.DirectionalLight(0xffffff,2.3);stadiumSun.position.set(-12,28,16);stadiumSun.castShadow=true;stadiumSun.shadow.mapSize.set(1024,1024);stadiumSun.shadow.camera.left=-22;stadiumSun.shadow.camera.right=22;stadiumSun.shadow.camera.top=30;stadiumSun.shadow.camera.bottom=-30;sc.add(stadiumSun);
          const field=new T.Mesh(new T.PlaneGeometry(18,28),new T.MeshLambertMaterial({color:0x28733d}));field.rotation.x=-Math.PI/2;field.receiveShadow=true;sc.add(field);
          for(let z=-12;z<=12;z+=4){let stripe=new T.Mesh(new T.PlaneGeometry(17.8,2),new T.MeshBasicMaterial({color:(Math.round(z/4)%2)?0x2d7d43:0x347f48,transparent:true,opacity:.38}));stripe.rotation.x=-Math.PI/2;stripe.position.set(0,.012,z);sc.add(stripe)}
          const lineMat=new T.MeshBasicMaterial({color:0xf2f2e8});let mid=new T.Mesh(new T.PlaneGeometry(17.5,.08),lineMat);mid.rotation.x=-Math.PI/2;mid.position.y=.025;sc.add(mid);
          let circle=new T.Mesh(new T.RingGeometry(2.2,2.28,48),lineMat);circle.rotation.x=-Math.PI/2;circle.position.y=.03;sc.add(circle);
          const standMat=new T.MeshLambertMaterial({color:0x303846});for(const x of [-11,11]){for(let k=0;k<4;k++){let s=new T.Mesh(new T.BoxGeometry(3,2+k*.7,30),standMat);s.position.set(x+(x<0?-k*.7:k*.7),1+k*.35,0);sc.add(s)}}
          const crowdColors=[0xffd85c,0x63b7ff,0xff6f7d,0xffffff];for(let i=0;i<110;i++){let side=i%2?-10.1:10.1,z=-13+Math.random()*26,y=2+Math.random()*3.3;let fan=new T.Mesh(new T.BoxGeometry(.25,.35,.25),new T.MeshLambertMaterial({color:crowdColors[i%4]}));fan.position.set(side,y,z);sc.add(fan)}
          for(const x of [-9,9])for(const z of [-12,12]){let pole=new T.Mesh(new T.CylinderGeometry(.08,.12,8,6),new T.MeshLambertMaterial({color:0x777f88}));pole.position.set(x,4,z);sc.add(pole);let light=new T.PointLight(0xeaf4ff,1.4,24);light.position.set(x,8,z);sc.add(light)}
          const board=new T.Mesh(new T.BoxGeometry(5,1.8,.25),new T.MeshLambertMaterial({color:0x11151b}));board.position.set(0,6,15);sc.add(board);
          function footballer(color){
            const g=new T.Group(),mat=new T.MeshStandardMaterial({color,roughness:.72,metalness:.02});
            const body=new T.Mesh(new T.CylinderGeometry(.48,.55,1.05,12),mat);body.position.y=.92;body.castShadow=true;g.add(body);
            const head=new T.Mesh(new T.SphereGeometry(.31,14,10),new T.MeshStandardMaterial({color:0xd9a27f,roughness:.8}));head.position.y=1.72;head.castShadow=true;g.add(head);
            const legMat=new T.MeshStandardMaterial({color:0x202733,roughness:.8});
            for(const x of [-.2,.2]){const leg=new T.Mesh(new T.BoxGeometry(.18,.58,.2),legMat);leg.position.set(x,.3,0);leg.castShadow=true;g.add(leg)}
            return g;
          }
          const p=footballer(0x58b9ee);p.position.set(0,0,-8);sc.add(p);
          const cpu=footballer(0xe46161);cpu.position.set(0,0,7);sc.add(cpu);
          const ball=new T.Mesh(new T.SphereGeometry(.42,24,18),new T.MeshStandardMaterial({color:0xffffff,roughness:.62,metalness:.02}));ball.position.set(0,.45,0);ball.castShadow=true;sc.add(ball);
          const mate1=footballer(0x58b9ee),mate2=footballer(0x58b9ee),red2=footballer(0xe46161);mate1.position.set(-5,0,-2);mate2.position.set(5,0,3);red2.position.set(-5,0,4);sc.add(mate1,mate2,red2);
          const ballShadow=new T.Mesh(new T.CircleGeometry(.48,20),new T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.3}));ballShadow.rotation.x=-Math.PI/2;ballShadow.position.y=.035;sc.add(ballShadow);
          const adMat=new T.MeshBasicMaterial({color:0x1d89c9});for(let z=-10;z<=10;z+=4){let a=new T.Mesh(new T.BoxGeometry(.18,.75,3),adMat);a.position.set(-9.15,.4,z);sc.add(a);let b=a.clone();b.position.x=9.15;sc.add(b)}

          const goalMat=new T.MeshLambertMaterial({color:0xffffff});for(const z of [-13.6,13.6]){for(const x of [-2.6,2.6]){let q=new T.Mesh(new T.BoxGeometry(.2,2.3,.2),goalMat);q.position.set(x,1.15,z);sc.add(q)}let q=new T.Mesh(new T.BoxGeometry(5.4,.2,.2),goalMat);q.position.set(0,2.3,z);sc.add(q)}
          let bv=new T.Vector3(),blue=0,red=0;const keys={};const kd=e=>{keys[e.code]=true;if(e.code==='Space'&&p.position.distanceTo(ball.position)<1.6)bv.add(new T.Vector3(0,0,.48))},ku=e=>keys[e.code]=false;addEventListener('keydown',kd);addEventListener('keyup',ku);
          function reset(){ball.position.set(0,.45,0);bv.set(0,0,0);p.position.set(0,0,-8);cpu.position.set(0,0,7);scoreEl.textContent=`BLUE ${blue} — ${red} RED`}
          function loop(){if(stop)return;ren.setSize(st.clientWidth,st.clientHeight,false);cam.aspect=st.clientWidth/st.clientHeight;cam.updateProjectionMatrix();let v=new T.Vector3((keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0),0,(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0));if(v.lengthSq())p.position.add(v.normalize().multiplyScalar(.11));p.position.x=Math.max(-8.2,Math.min(8.2,p.position.x));p.position.z=Math.max(-13,Math.min(13,p.position.z));let c=ball.position.clone().sub(cpu.position).setY(0);if(c.length()>.7)cpu.position.add(c.normalize().multiplyScalar(.065));if(p.position.distanceTo(ball.position)<1.15)bv.add(ball.position.clone().sub(p.position).setY(0).normalize().multiplyScalar(.018));if(cpu.position.distanceTo(ball.position)<1.15)bv.add(ball.position.clone().sub(cpu.position).setY(0).normalize().multiplyScalar(.02));ball.position.add(bv);bv.multiplyScalar(.975);if(Math.abs(ball.position.x)>8.5){ball.position.x=Math.sign(ball.position.x)*8.5;bv.x*=-.7}if(ball.position.z>14){if(Math.abs(ball.position.x)<2.7){blue++;try{NitroArcade.flash('#65c8ff');NitroArcade.confetti(28)}catch(e){}}reset()}if(ball.position.z<-14){if(Math.abs(ball.position.x)<2.7){red++;try{NitroArcade.flash('#ff6b72')}catch(e){}}reset()}if(blue>=5||red>=5){scoreEl.textContent=(blue>=5?'BLUE':'RED')+' WINS — restarting';blue=red=0}ren.render(sc,cam);requestAnimationFrame(loop)}
          window.addEventListener('error',window.__nitroStadiumError=function stadiumError(ev){
            if(stop)return;
            const msg=String(ev?.error?.message||ev?.message||'Unknown renderer error');
            console.error('[Stadium Strike]',ev?.error||ev);
            if(st&&!st.querySelector('.stadium-error'))st.insertAdjacentHTML('beforeend',`<div class="stadium-error" style="position:absolute;inset:15px;z-index:20;padding:18px;border-radius:12px;background:#160b0bee;color:#fff;border:1px solid #ff7373"><b>STADIUM RENDER ERROR</b><br><small>${msg.replace(/[<>]/g,'')}</small></div>`);
          });
          activeNativeCleanup=()=>{stop=true;removeEventListener('keydown',kd);removeEventListener('keyup',ku);if(window.__nitroStadiumError)removeEventListener('error',window.__nitroStadiumError);ren.dispose()};loop();
        }


        async function startSkyPilot3D(host,game){
          stopNativeGame(); let stopped=false;
          host.innerHTML=`<div class="three3d-shell">
            <div class="three3d-bar"><b>SKY PILOT 3D — INTERNATIONAL AIRPORT</b><small style="opacity:.6;margin-left:8px">DETAILED AIRPORT</small><span id="flyMission">MISSION: TAXI • TAKE OFF • COURSE • RETURN</span></div>
            <div class="three3d-stage" id="flyStage">
              <div class="three3d-hud" id="flyHud">SPD 0 • ALT 0 • RINGS 0/8</div>
              <div class="fly-status" id="flyStatus">ENERGY 100%<br>TARGETS 0/10</div><div class="fly-cross"></div>
            </div>
            <div class="three3d-help">W/S throttle • ↑/↓ pitch • ←/→ roll • A/D yaw • SPACE energy pulse • R reset<br>Start at the terminal apron, taxi past the gates, line up on Runway 27, take off, clear the course, then return to the airport.</div>
          </div>`;
          let T;try{T=await ultraLoadThree()}catch(e){host.querySelector('#flyStage').innerHTML='<p style="padding:25px;color:white">Could not load the 3D engine. Check your internet connection.</p>';return}
          const stage=host.querySelector('#flyStage'),hud=host.querySelector('#flyHud'),status=host.querySelector('#flyStatus'),mission=host.querySelector('#flyMission');
          const scene=new T.Scene();scene.background=new T.Color(0x73b8eb);scene.fog=new T.Fog(0x91c9ef,150,720);
          const cam=new T.PerspectiveCamera(66,16/9,.1,1200),ren=ultraPolish3DRenderer(new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'}),T,1.08);stage.appendChild(ren.domElement);
          scene.add(new T.HemisphereLight(0xf2fbff,0x52643c,2.15));const sun=new T.DirectionalLight(0xfff1d0,2.6);sun.position.set(80,130,45);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-120;sun.shadow.camera.right=120;sun.shadow.camera.top=120;sun.shadow.camera.bottom=-120;scene.add(sun);
          const skyGeo=new T.SphereGeometry(850,24,16),skyMat=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{top:{value:new T.Color(0x3b8bd4)},bottom:{value:new T.Color(0xcbeaff)}},vertexShader:'varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec3 vP;uniform vec3 top;uniform vec3 bottom;void main(){float h=clamp(normalize(vP).y*.5+.5,0.0,1.0);gl_FragColor=vec4(mix(bottom,top,pow(h,0.7)),1.0);}'});scene.add(new T.Mesh(skyGeo,skyMat));

          const ground=new T.Mesh(new T.PlaneGeometry(1200,1200),new T.MeshLambertMaterial({color:0x4c8846}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
          const runway=new T.Mesh(new T.PlaneGeometry(20,210),new T.MeshLambertMaterial({color:0x353a3d}));runway.rotation.x=-Math.PI/2;runway.receiveShadow=true;runway.position.set(0,.025,28);scene.add(runway);
          const white=new T.MeshBasicMaterial({color:0xf5f1d7});
          for(let z=-68;z<125;z+=14){let s=new T.Mesh(new T.PlaneGeometry(.75,7),white);s.rotation.x=-Math.PI/2;s.position.set(0,.04,z);scene.add(s)}
          for(const x of [-9.1,9.1]){let edge=new T.Mesh(new T.PlaneGeometry(.25,205),white);edge.rotation.x=-Math.PI/2;edge.position.set(x,.04,28);scene.add(edge)}
          const buildingMat=new T.MeshLambertMaterial({color:0x8797a0}),glass=new T.MeshLambertMaterial({color:0x4e829e});
          [[-28,4,45,15,8,20],[30,3,55,18,6,14],[-34,5,85,12,10,12]].forEach(a=>{let b=new T.Mesh(new T.BoxGeometry(a[3],a[4],a[5]),buildingMat);b.position.set(a[0],a[4]/2,a[2]);scene.add(b);let w=new T.Mesh(new T.BoxGeometry(a[3]*.7,a[4]*.35,.15),glass);w.position.set(a[0],a[4]*.6,a[2]-a[5]/2-.08);scene.add(w)});

          const hillMat=new T.MeshLambertMaterial({color:0x66765e});
          for(let i=0;i<55;i++){let r=9+Math.random()*23,hh=15+Math.random()*65,m=new T.Mesh(new T.ConeGeometry(r,hh,6),hillMat);let a=Math.random()*Math.PI*2,d=190+Math.random()*330;m.position.set(Math.cos(a)*d,hh/2,Math.sin(a)*d);scene.add(m)}
          const trunkMat=new T.MeshLambertMaterial({color:0x6f5036}),treeMat=new T.MeshLambertMaterial({color:0x2d6d38});
          for(let i=0;i<70;i++){let x=(Math.random()-.5)*300,z=(Math.random()-.5)*340;if(Math.abs(x)<18&&z>-85&&z<140)continue;let tr=new T.Mesh(new T.CylinderGeometry(.3,.4,2.5,6),trunkMat);tr.position.set(x,1.25,z);scene.add(tr);let crown=new T.Mesh(new T.ConeGeometry(2,5,7),treeMat);crown.position.set(x,4,z);scene.add(crown)}
          const cloudMat=new T.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:.78});
          for(let i=0;i<20;i++){let g=new T.Group();for(let j=0;j<4;j++){let c=new T.Mesh(new T.SphereGeometry(4+Math.random()*3,10,8),cloudMat);c.position.set(j*5,Math.random()*2,Math.random()*3);g.add(c)}g.position.set((Math.random()-.5)*430,45+Math.random()*65,(Math.random()-.5)*430);scene.add(g)}

          const water=new T.Mesh(new T.PlaneGeometry(300,180),new T.MeshLambertMaterial({color:0x3f94c5,transparent:true,opacity:.86}));water.rotation.x=-Math.PI/2;water.position.set(190,.01,-100);scene.add(water);
          const hangarMat=new T.MeshLambertMaterial({color:0xb7bec5}),roofMat=new T.MeshLambertMaterial({color:0x52616e});
          [[-35,0,75],[-35,0,45],[34,0,70]].forEach(([x,y,z])=>{let b=new T.Mesh(new T.BoxGeometry(18,7,14),hangarMat);b.position.set(x,3.5,z);scene.add(b);let r=new T.Mesh(new T.BoxGeometry(19,.6,15),roofMat);r.position.set(x,7.2,z);scene.add(r)});
          for(let i=0;i<20;i++){let l=new T.Mesh(new T.SphereGeometry(.18,6,5),new T.MeshBasicMaterial({color:i%2?0x66baff:0xfff1a8}));l.position.set(i%2?-9.5:9.5,.18,-70+Math.floor(i/2)*20);scene.add(l)}
          for(const x of [-16,16]){let mast=new T.Mesh(new T.CylinderGeometry(.08,.1,5,6),new T.MeshLambertMaterial({color:0xe5e5e5}));mast.position.set(x,2.5,118);scene.add(mast);let sock=new T.Mesh(new T.ConeGeometry(.45,2,8),new T.MeshLambertMaterial({color:0xff6a45}));sock.rotation.z=-Math.PI/2;sock.position.set(x+1,4.6,118);scene.add(sock)}
          const tower=new T.Mesh(new T.CylinderGeometry(2.2,2.8,9,8),new T.MeshLambertMaterial({color:0xd2d6d8}));tower.position.set(27,4.5,105);scene.add(tower);let top=new T.Mesh(new T.CylinderGeometry(3,2.4,2.2,8),new T.MeshLambertMaterial({color:0x38576c}));top.position.set(27,10,105);scene.add(top);


          const asphalt=new T.MeshStandardMaterial({color:0x454b50,roughness:.94}),
                concrete=new T.MeshStandardMaterial({color:0x8b9296,roughness:.9}),
                terminalMat=new T.MeshStandardMaterial({color:0xc4cbd0,roughness:.62,metalness:.08}),
                terminalGlass=new T.MeshStandardMaterial({color:0x38718d,roughness:.18,metalness:.12,transparent:true,opacity:.78}),
                yellowLine=new T.MeshBasicMaterial({color:0xffd84b}),
                redLine=new T.MeshBasicMaterial({color:0xe95353}),
                lampGlow=new T.MeshBasicMaterial({color:0xe9f7ff}),
                serviceWhite=new T.MeshStandardMaterial({color:0xe8ecee,roughness:.7}),
                serviceYellow=new T.MeshStandardMaterial({color:0xf1b82d,roughness:.65});

          const apron=new T.Mesh(new T.PlaneGeometry(150,105),concrete);apron.rotation.x=-Math.PI/2;apron.position.set(-52,.032,74);apron.receiveShadow=true;scene.add(apron);
          const taxi=new T.Mesh(new T.PlaneGeometry(18,150),asphalt);taxi.rotation.x=-Math.PI/2;taxi.position.set(-15,.038,45);taxi.receiveShadow=true;scene.add(taxi);
          const taxiLink=new T.Mesh(new T.PlaneGeometry(54,18),asphalt);taxiLink.rotation.x=-Math.PI/2;taxiLink.position.set(-2,.04,-26);taxiLink.receiveShadow=true;scene.add(taxiLink);
          for(let z=-25;z<118;z+=5){let q=new T.Mesh(new T.PlaneGeometry(.28,3.3),yellowLine);q.rotation.x=-Math.PI/2;q.position.set(-15,.052,z);scene.add(q)}
          for(let x=-23;x<21;x+=5){let q=new T.Mesh(new T.PlaneGeometry(3.2,.28),yellowLine);q.rotation.x=-Math.PI/2;q.position.set(x,.052,-26);scene.add(q)}

          const terminal=new T.Group();
          const mainTerminal=new T.Mesh(new T.BoxGeometry(74,10,18),terminalMat);mainTerminal.position.set(-55,5,101);mainTerminal.castShadow=true;mainTerminal.receiveShadow=true;terminal.add(mainTerminal);
          const glassFront=new T.Mesh(new T.BoxGeometry(68,5,.28),terminalGlass);glassFront.position.set(-55,5.5,91.85);terminal.add(glassFront);
          const roof=new T.Mesh(new T.BoxGeometry(78,.7,20),new T.MeshStandardMaterial({color:0x5d6870,roughness:.5,metalness:.25}));roof.position.set(-55,10.3,101);roof.castShadow=true;terminal.add(roof);
          for(let x=-86;x<-23;x+=5){let m=new T.Mesh(new T.BoxGeometry(.18,5,.35),terminalMat);m.position.set(x,5.5,91.65);terminal.add(m)}
          for(let x=-80;x<-28;x+=13){let ac=new T.Mesh(new T.BoxGeometry(5,1.2,3),new T.MeshStandardMaterial({color:0x6f777b,roughness:.75}));ac.position.set(x,11.1,102);terminal.add(ac)}
          scene.add(terminal);

          for(let g=0;g<4;g++){
            const gx=-80+g*17;
            let bridge=new T.Mesh(new T.BoxGeometry(3,3,14),terminalMat);bridge.position.set(gx,4.4,84);bridge.castShadow=true;scene.add(bridge);
            let bridgeGlass=new T.Mesh(new T.BoxGeometry(2.5,2.1,12.5),terminalGlass);bridgeGlass.position.set(gx,4.5,84);scene.add(bridgeGlass);
            let stand=new T.Mesh(new T.RingGeometry(8.5,8.75,36,1,0,Math.PI),yellowLine);stand.rotation.x=-Math.PI/2;stand.rotation.z=Math.PI;stand.position.set(gx,.055,68);scene.add(stand);
            for(let z=66;z<78;z+=3){let lead=new T.Mesh(new T.PlaneGeometry(.2,2),yellowLine);lead.rotation.x=-Math.PI/2;lead.position.set(gx,.056,z);scene.add(lead)}
          }

          const radarPole=new T.Mesh(new T.CylinderGeometry(.12,.12,3,8),serviceWhite);radarPole.position.set(27,12.4,105);scene.add(radarPole);
          const radar=new T.Mesh(new T.BoxGeometry(5,.25,.55),serviceWhite);radar.position.set(27,14,105);scene.add(radar);

          for(const [x,z] of [[-100,75],[-87,48],[-66,47],[-45,47],[-24,50],[18,72],[42,90]]){
            let pole=new T.Mesh(new T.CylinderGeometry(.09,.13,10,7),new T.MeshStandardMaterial({color:0x7a858c,roughness:.6,metalness:.35}));pole.position.set(x,5,z);scene.add(pole);
            let bar=new T.Mesh(new T.BoxGeometry(4,.2,.25),serviceWhite);bar.position.set(x,10,z);scene.add(bar);
            for(const dx of [-1.5,0,1.5]){let bulb=new T.Mesh(new T.SphereGeometry(.13,6,5),lampGlow);bulb.position.set(x+dx,9.9,z-.15);scene.add(bulb)}
          }

          function airportPlane(x,z,rot=0,color=0x4d8dcc){
            let g=new T.Group(),whiteBody=new T.MeshStandardMaterial({color:0xe8ecef,roughness:.45,metalness:.08}),stripe=new T.MeshStandardMaterial({color,roughness:.5});
            let fus=new T.Mesh(new T.CylinderGeometry(.55,.7,8,12),whiteBody);fus.rotation.x=Math.PI/2;g.add(fus);
            let nose=new T.Mesh(new T.ConeGeometry(.56,1.5,12),stripe);nose.rotation.x=Math.PI/2;nose.position.z=-4.7;g.add(nose);
            let wings=new T.Mesh(new T.BoxGeometry(9,.13,1.4),whiteBody);g.add(wings);
            let tail=new T.Mesh(new T.BoxGeometry(3.2,.12,.7),stripe);tail.position.z=3.2;g.add(tail);
            let fin=new T.Mesh(new T.BoxGeometry(.14,1.7,1),stripe);fin.position.set(0,.85,3.2);g.add(fin);
            g.position.set(x,1,z);g.rotation.y=rot;g.traverse(o=>{if(o.isMesh)o.castShadow=true});scene.add(g);return g
          }
          airportPlane(-80,67,0,0x3579bd);airportPlane(-46,67,0,0xe55f45);airportPlane(-29,67,0,0x4ba36b);

          function vehicle(x,z,mat=serviceYellow,sx=2.5,sz=4){
            let g=new T.Group(),body=new T.Mesh(new T.BoxGeometry(sx,1.2,sz),mat);body.position.y=.9;body.castShadow=true;g.add(body);
            const tyre=new T.MeshStandardMaterial({color:0x17191b,roughness:.95});
            for(const dx of [-sx*.42,sx*.42])for(const dz of [-sz*.3,sz*.3]){let w=new T.Mesh(new T.CylinderGeometry(.28,.28,.18,8),tyre);w.rotation.z=Math.PI/2;w.position.set(dx,.35,dz);g.add(w)}
            g.position.set(x,0,z);scene.add(g);return g
          }
          vehicle(-91,57);vehicle(-70,58,serviceWhite,2.2,3.4);vehicle(-52,54,serviceYellow,2.4,5);vehicle(-34,53,serviceWhite,2.3,4);
          for(let i=0;i<5;i++)vehicle(-98+i*4,88,serviceYellow,1.4,2.3);

          const road=new T.Mesh(new T.PlaneGeometry(110,12),asphalt);road.rotation.x=-Math.PI/2;road.position.set(-55,.035,119);scene.add(road);
          const parking=new T.Mesh(new T.PlaneGeometry(95,55),asphalt);parking.rotation.x=-Math.PI/2;parking.position.set(-58,.034,153);scene.add(parking);
          for(let x=-98;x<-18;x+=7)for(let z=134;z<174;z+=10){let stripe=new T.Mesh(new T.PlaneGeometry(.12,7),white);stripe.rotation.x=-Math.PI/2;stripe.position.set(x,.047,z);scene.add(stripe)}
          for(let i=0;i<28;i++){let car=new T.Mesh(new T.BoxGeometry(2.1,.9,4),new T.MeshStandardMaterial({color:new T.Color().setHSL(Math.random(),.45,.45),roughness:.65}));car.position.set(-94+(i%10)*8,.5,137+Math.floor(i/10)*11);car.castShadow=true;scene.add(car)}

          for(const z of [-75,128])for(let x=-7;x<=7;x+=2){let bar=new T.Mesh(new T.PlaneGeometry(1.15,7),white);bar.rotation.x=-Math.PI/2;bar.position.set(x,.055,z);scene.add(bar)}
          for(const z of [-45,-35,91,101])for(const x of [-5,5]){let mark=new T.Mesh(new T.PlaneGeometry(2,9),white);mark.rotation.x=-Math.PI/2;mark.position.set(x,.055,z);scene.add(mark)}
          for(const x of [-13,-11,-9,-7]){let papi=new T.Mesh(new T.BoxGeometry(.5,.25,.5),new T.MeshBasicMaterial({color:x<-10?0xffffff:0xff4242}));papi.position.set(x,.25,-52);scene.add(papi)}
          const signMat=new T.MeshBasicMaterial({color:0x151515});
          [['A',-24,7],['B',-24,48],['27',-12,-72]].forEach(([txt,x,z],i)=>{let s=new T.Mesh(new T.BoxGeometry(3,1,.25),signMat);s.position.set(x,.55,z);scene.add(s);let glow=new T.Mesh(new T.BoxGeometry(2.4,.45,.27),new T.MeshBasicMaterial({color:i===2?0xe94b4b:0xf3d44f}));glow.position.set(x,.58,z-.02);scene.add(glow)});

          const fenceMat=new T.MeshStandardMaterial({color:0x778087,roughness:.65,metalness:.4});
          for(let z=-100;z<190;z+=8)for(const x of [-120,70]){let post=new T.Mesh(new T.CylinderGeometry(.05,.05,2.4,5),fenceMat);post.position.set(x,1.2,z);scene.add(post)}

          const plane=new T.Group(),bodyMat=new T.MeshLambertMaterial({color:0xe8e9e5}),accent=new T.MeshLambertMaterial({color:0x3189c0}),dark=new T.MeshLambertMaterial({color:0x26343c});
          const fus=new T.Mesh(new T.CylinderGeometry(.55,.82,6.2,14),bodyMat);fus.rotation.x=Math.PI/2;plane.add(fus);
          const nose=new T.Mesh(new T.ConeGeometry(.56,1.65,14),accent);nose.rotation.x=Math.PI/2;nose.position.z=-3.9;plane.add(nose);
          const wing=new T.Mesh(new T.BoxGeometry(9,.16,1.35),bodyMat);wing.position.z=-.25;plane.add(wing);
          const tailWing=new T.Mesh(new T.BoxGeometry(3.4,.13,.7),accent);tailWing.position.z=2.65;plane.add(tailWing);
          const fin=new T.Mesh(new T.BoxGeometry(.15,1.55,1),accent);fin.position.set(0,.75,2.65);plane.add(fin);
          const cockpit=new T.Mesh(new T.SphereGeometry(.72,12,8),dark);cockpit.scale.set(.75,.5,1.3);cockpit.position.set(0,.55,-1.75);plane.add(cockpit);
          for(const x of [-.58,.58]){let wheel=new T.Mesh(new T.TorusGeometry(.22,.08,7,10),dark);wheel.rotation.y=Math.PI/2;wheel.position.set(x,-.72,.35);plane.add(wheel)}
          plane.position.set(-55,1.15,57);plane.rotation.y=-Math.PI/2;plane.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});scene.add(plane);

          const ringPositions=[[0,18,-25],[38,28,-72],[85,39,-115],[125,52,-65],[110,67,18],[55,52,72],[-18,36,48],[-48,22,-2]];
          const rings=ringPositions.map((p,i)=>{let m=new T.Mesh(new T.TorusGeometry(7,.65,10,30),new T.MeshLambertMaterial({color:i===0?0xffd85c:0x67c9ef}));m.position.set(...p);m.rotation.y=(i%3-1)*.25;scene.add(m);return m});

          const targets=[],targetMat=new T.MeshLambertMaterial({color:0xff6d72,emissive:0x551115});
          [[-55,24,-55],[60,35,-40],[105,48,-95],[145,58,5],[95,72,65],[25,55,95],[-55,42,70],[-95,30,15],[-70,50,-105],[20,70,-145]].forEach((p,i)=>{
            let g=new T.Group(),core=new T.Mesh(new T.OctahedronGeometry(2.3),targetMat),ring=new T.Mesh(new T.TorusGeometry(3.5,.25,8,20),new T.MeshBasicMaterial({color:0xffd75c}));ring.rotation.x=Math.PI/2;g.add(core,ring);g.position.set(...p);g.userData.alive=true;scene.add(g);targets.push(g)
          });

          const pulses=[],pulseGeo=new T.SphereGeometry(.18,6,6),pulseMat=new T.MeshBasicMaterial({color:0xffef75});
          let ringIndex=0,hits=0,energy=100,throttle=.02,speed=0,pitch=0,yaw=-Math.PI/2,roll=0,airborne=false,lastShot=0;const keys={};
          const kd=e=>{keys[e.code]=true;if(e.code==='KeyR')reset();if(e.code==='Space'){shoot();e.preventDefault()}if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault()},ku=e=>keys[e.code]=false;
          addEventListener('keydown',kd);addEventListener('keyup',ku);

          function forwardVec(){return new T.Vector3(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)).normalize()}
          function shoot(){
            const now=performance.now();if(now-lastShot<180||energy<3)return;lastShot=now;energy-=3;
            const dir=forwardVec(),m=new T.Mesh(pulseGeo,pulseMat);m.position.copy(plane.position).add(dir.clone().multiplyScalar(4));scene.add(m);pulses.push({m,dir,life:0})
          }
          function reset(){
            plane.position.set(-55,1.15,57);pitch=0;yaw=-Math.PI/2;roll=0;speed=0;throttle=.05;airborne=false;ringIndex=0;hits=0;energy=100;
            rings.forEach((r,i)=>{r.visible=true;r.material.color.setHex(i===0?0xffd85c:0x67c9ef)});
            targets.forEach(t=>{t.visible=true;t.userData.alive=true});pulses.splice(0).forEach(p=>scene.remove(p.m));mission.textContent='MISSION: TAXI • TAKE OFF • COURSE • RETURN'
          }
          function loop(){
            if(stopped)return;
            const w=stage.clientWidth,hh=stage.clientHeight;ren.setSize(w,hh,false);cam.aspect=w/hh;cam.updateProjectionMatrix();
            if(keys.KeyW)throttle=Math.min(1,throttle+.006);if(keys.KeyS)throttle=Math.max(0,throttle-.006);
            speed+=(throttle*1.15-speed)*.018;
            if(keys.ArrowUp)pitch=Math.min(.55,pitch+.012);if(keys.ArrowDown)pitch=Math.max(-.5,pitch-.012);
            if(keys.ArrowLeft)roll=Math.min(.8,roll+.018);else if(keys.ArrowRight)roll=Math.max(-.8,roll-.018);else roll*=.94;
            if(keys.KeyA)yaw+=.012;if(keys.KeyD)yaw-=.012;yaw+=roll*.006*Math.max(.2,speed);pitch*=.996;
            const forward=forwardVec();if(speed>.23){plane.position.addScaledVector(forward,speed*.72);if(plane.position.y>1.16||pitch>.06)airborne=true}
            if(airborne){plane.position.y+=Math.max(-.07,(speed-.32)*.045);if(speed<.28)plane.position.y-=.055}
            if(plane.position.y<=1.15){plane.position.y=1.15;airborne=false;pitch=Math.max(-.05,pitch);roll*=.75}
            plane.rotation.order='YXZ';plane.rotation.y=yaw;plane.rotation.x=-pitch;plane.rotation.z=roll;

            if(ringIndex<rings.length&&plane.position.distanceTo(rings[ringIndex].position)<8.2){rings[ringIndex].visible=false;ringIndex++;if(ringIndex<rings.length){rings[ringIndex].material.color.setHex(0xffd85c);mission.textContent='NEXT RING '+(ringIndex+1)}else mission.textContent='RINGS CLEARED — TAG ALL DRONES & RETURN'}

            for(let i=pulses.length-1;i>=0;i--){let p=pulses[i];p.m.position.addScaledVector(p.dir,3.2);p.life++;
              let hit=false;for(const t of targets)if(t.userData.alive&&p.m.position.distanceTo(t.position)<3.2){t.userData.alive=false;t.visible=false;hits++;hit=true;mission.textContent=`DRONE TAGGED — ${hits}/10`;break}
              if(hit||p.life>130){scene.remove(p.m);pulses.splice(i,1)}
            }
            energy=Math.min(100,energy+.035);
            targets.forEach((t,i)=>{if(t.userData.alive){t.rotation.y+=.012;t.position.y+=Math.sin(performance.now()*.0015+i)*.006}});

            if(ringIndex===8&&hits===10&&!airborne&&Math.abs(plane.position.x)<9&&plane.position.z>-80&&plane.position.z<135){mission.textContent='MISSION COMPLETE — PERFECT LANDING';try{awardPrizes(5,'International Airport')}catch(e){}}

            if(!scene.userData.deluxe){
              scene.userData.deluxe=true;
              const ocean=new T.Mesh(new T.PlaneGeometry(900,900),new T.MeshPhongMaterial({color:0x235f83,transparent:true,opacity:.72,shininess:90}));ocean.rotation.x=-Math.PI/2;ocean.position.set(0,-1.2,-230);scene.add(ocean);scene.userData.ocean=ocean;
              scene.userData.clouds=[];for(let i=0;i<16;i++){let g=new T.Group();for(let j=0;j<4;j++){let q=new T.Mesh(new T.SphereGeometry(3+Math.random()*2,8,6),new T.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:.82}));q.position.x=j*3;g.add(q)}g.position.set(-90+Math.random()*180,18+Math.random()*22,-180+Math.random()*300);scene.add(g);scene.userData.clouds.push(g)}
              scene.userData.city=[];for(let i=0;i<55;i++){let b=new T.Mesh(new T.BoxGeometry(2+Math.random()*4,3+Math.random()*14,2+Math.random()*4),new T.MeshLambertMaterial({color:0x3d4653}));b.position.set((Math.random()>.5?1:-1)*(35+Math.random()*55),b.geometry.parameters.height/2,-40+Math.random()*150);scene.add(b);scene.userData.city.push(b)}
              for(let z=-65;z<115;z+=10)for(const x of [-6.8,6.8]){let l=new T.PointLight(0x9bd7ff,.45,8);l.position.set(x,.3,z);scene.add(l)}
            }
            scene.userData.clouds.forEach((g,i)=>{g.position.x+=.012+i*.0004;if(g.position.x>110)g.position.x=-110});
            if(scene.userData.ocean)scene.userData.ocean.material.opacity=.69+Math.sin(performance.now()*.001)*.035;
            const desired=plane.position.clone().add(forward.clone().multiplyScalar(-15)).add(new T.Vector3(0,6.5,0));cam.position.lerp(desired,.08);cam.lookAt(plane.position.clone().add(forward.clone().multiplyScalar(9)));
            const alt=Math.max(0,plane.position.y-1.15);hud.textContent=`SPD ${Math.round(speed*210)} • ALT ${Math.round(alt*10)} • THR ${Math.round(throttle*100)}% • RINGS ${ringIndex}/8`;status.innerHTML=`ENERGY ${Math.round(energy)}%<br>TARGETS ${hits}/10`;
            ren.render(scene,cam);requestAnimationFrame(loop)
          }
          activeNativeCleanup=()=>{stopped=true;removeEventListener('keydown',kd);removeEventListener('keyup',ku);ren.dispose()};loop();
        }


        async function startBrickMaze95(host,game){
          stopNativeGame(); let stopped=false, started=false, won=false;
          host.innerHTML=`<div class="bm95-shell">
            <div style="display:flex;justify-content:space-between;gap:10px;padding:5px 2px 9px"><b>BRICK MAZE 95</b><span id="bmObjective">FIND 6 SOUVENIRS</span></div>
            <div class="bm95-stage" id="bmStage">
              <div class="bm95-hud" id="bmHud">SOUVENIRS 0/6<br>TIME 0:00</div>
              <div class="bm95-map"><canvas id="bmMap" width="130" height="130"></canvas></div>
              <div class="bm95-msg" id="bmMsg"></div>
              <div class="bm95-start" id="bmStart"><div><div style="font-size:58px">▥</div><h2 style="margin:8px">BRICK MAZE 95</h2>
                <p style="max-width:520px;color:#bbb">A randomly generated old-school brick labyrinth. Find all six lost souvenirs while the maze creatures wander the halls.</p>
                <button class="bm95-btn" id="bmBegin">ENTER MAZE</button></div></div>
            </div>
            <div class="bm95-help">WASD / Arrow Keys = move & turn • Q/E = strafe • Shift = run • M = hide/show minimap • Collect all souvenirs and reach the EXIT.</div>
          </div>`;
          let T; try{T=await ultraLoadThree()}catch(e){host.querySelector('#bmStage').innerHTML='<p style="padding:25px;color:white">Could not load the 3D engine. Check your internet connection.</p>';return}

          const stage=host.querySelector('#bmStage'), hud=host.querySelector('#bmHud'), msg=host.querySelector('#bmMsg'),
                objective=host.querySelector('#bmObjective'), mapWrap=host.querySelector('.bm95-map'),
                map=host.querySelector('#bmMap'), mx=map.getContext('2d');
          const scene=new T.Scene(); scene.background=new T.Color(0x101010); scene.fog=new T.Fog(0x171717,7,31);
          const cam=new T.PerspectiveCamera(72,16/9,.08,70), ren=ultraPolish3DRenderer(new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'}),T,1.02); stage.appendChild(ren.domElement);
          scene.add(new T.HemisphereLight(0xc8c2a9,0x261b14,1.55));
          const lamp=new T.PointLight(0xffd8a0,3.1,22);lamp.castShadow=true;lamp.shadow.mapSize.set(512,512);scene.add(lamp);const mazeFill=new T.DirectionalLight(0xb9c9ff,.38);mazeFill.position.set(20,30,-10);scene.add(mazeFill);
          const ceilingMat=new T.MeshLambertMaterial({color:0x59534a}),signMat=new T.MeshBasicMaterial({color:0x49ff79});
          for(let i=0;i<12;i++){let fixture=new T.Mesh(new T.BoxGeometry(1.8,.12,.45),new T.MeshBasicMaterial({color:i%3===0?0xffd3a0:0xd9e7c7}));fixture.position.set((i%4-1.5)*5,3.15,-12+Math.floor(i/4)*10);scene.add(fixture)}
          for(let i=0;i<5;i++){let sign=new T.Mesh(new T.BoxGeometry(1.8,.7,.08),signMat);sign.position.set(-10+i*5,2.1,-15+i*7);sign.rotation.y=(i%2)*Math.PI/2;scene.add(sign)}
          const propColors=[0xb8a07a,0x6f876f,0x8b667b];for(let i=0;i<14;i++){let prop=new T.Mesh(new T.BoxGeometry(.5+Math.random(),.6+Math.random()*1.4,.5+Math.random()),new T.MeshLambertMaterial({color:propColors[i%3]}));prop.position.set(-14+Math.random()*28,.5,-14+Math.random()*28);scene.add(prop)}

          const N=13, grid=Array.from({length:N},()=>Array(N).fill(1));
          const dirs=[[2,0],[-2,0],[0,2],[0,-2]];
          function carve(x,z){
            grid[z][x]=0;
            const shuffled=dirs.slice().sort(()=>Math.random()-.5);
            for(const [dx,dz] of shuffled){
              const nx=x+dx,nz=z+dz;
              if(nx>0&&nz>0&&nx<N-1&&nz<N-1&&grid[nz][nx]===1){
                grid[z+dz/2][x+dx/2]=0; carve(nx,nz);
              }
            }
          }
          carve(1,1);
          for(let i=0;i<10;i++){let x=1+Math.floor(Math.random()*(N-2)),z=1+Math.floor(Math.random()*(N-2));if(grid[z][x]&&((grid[z][x-1]===0&&grid[z][x+1]===0)||(grid[z-1][x]===0&&grid[z+1][x]===0)))grid[z][x]=0}
          grid[N-2][N-2]=0;

          function brickTexture(){
            const c=document.createElement('canvas');c.width=128;c.height=128;const x=c.getContext('2d');
            x.fillStyle='#5c2b28';x.fillRect(0,0,128,128);
            // Fine masonry texture, highlights and surface noise (deterministic).
            for(let yy=0;yy<128;yy+=2)for(let xx=0;xx<128;xx+=2){const n=(xx*37+yy*83+xx*yy*7)%19;x.fillStyle=n<6?'#ffffff0b':'#00000010';x.fillRect(xx,yy,2,2)}
            for(let y=0;y<128;y+=16){for(let xx=0;xx<128;xx+=32){let off=(y/16)%2?16:0;x.fillStyle=((xx+y)/16)%3?'#9b3023':'#81241c';x.fillRect((xx+off)%128+1,y+1,29,13)}}
            x.strokeStyle='#301915';x.lineWidth=2;for(let y=0;y<=128;y+=16){x.beginPath();x.moveTo(0,y);x.lineTo(128,y);x.stroke()}
            for(let y=0;y<128;y+=16){x.strokeStyle='#ffcfaa24';x.lineWidth=1;x.beginPath();x.moveTo(0,y+2);x.lineTo(128,y+2);x.stroke()}
            const tex=new T.CanvasTexture(c);tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(1.2,1.2);tex.magFilter=T.NearestFilter;return tex
          }
          const brick=brickTexture(), wallMat=new T.MeshLambertMaterial({map:brick}), floorMat=new T.MeshLambertMaterial({color:0x6a4b35}), ceilMat=new T.MeshLambertMaterial({color:0xb9b9b2});
          const floor=new T.Mesh(new T.PlaneGeometry(N*4,N*4),floorMat);floor.rotation.x=-Math.PI/2;floor.position.set((N-1)*2,0,(N-1)*2);floor.receiveShadow=true;scene.add(floor);
          const ceiling=new T.Mesh(new T.PlaneGeometry(N*4,N*4),ceilMat);ceiling.rotation.x=Math.PI/2;ceiling.position.set((N-1)*2,3.7,(N-1)*2);ceiling.receiveShadow=true;scene.add(ceiling);
          const wallGeo=new T.BoxGeometry(4,3.7,4);
          for(let z=0;z<N;z++)for(let x=0;x<N;x++)if(grid[z][x]){
            let w=new T.Mesh(wallGeo,wallMat);w.position.set(x*4,1.85,z*4);w.castShadow=true;w.receiveShadow=true;scene.add(w);
          }

          const open=[];
          for(let z=1;z<N-1;z++)for(let x=1;x<N-1;x++)if(!grid[z][x]&&!(x===1&&z===1))open.push([x,z]);
          open.sort(()=>Math.random()-.5);

          const souvenirDefs=[['ARCADE TOKEN',0xffd84a],['TINY TROPHY',0x5bc0ff],['GLASS STAR',0xc98cff],['TOY ROCKET',0xff6f61],['PIXEL CUBE',0x67e38b],['GOLD KEYCHAIN',0xffb92e]];
          const souvenirs=[];
          souvenirDefs.forEach((d,i)=>{
            const [x,z]=open[i],g=new T.Group(),core=new T.Mesh(new T.OctahedronGeometry(.48),new T.MeshLambertMaterial({color:d[1],emissive:d[1],emissiveIntensity:.22})),
            halo=new T.Mesh(new T.TorusGeometry(.72,.06,6,14),new T.MeshBasicMaterial({color:d[1]}));halo.rotation.x=Math.PI/2;g.add(core,halo);g.position.set(x*4,1.05,z*4);g.userData={name:d[0],taken:false,base:1.05};scene.add(g);souvenirs.push(g)
          });

          const pipeMat=new T.MeshLambertMaterial({color:0x62686a}),warnMat=new T.MeshBasicMaterial({color:0xd6a43a});
          for(let i=0;i<18;i++){let pipe=new T.Mesh(new T.CylinderGeometry(.08,.08,3.2,7),pipeMat);pipe.rotation.z=Math.PI/2;pipe.position.set(2+Math.random()*44,3.25,2+Math.random()*44);scene.add(pipe)}
          for(let i=0;i<10;i++){let panel=new T.Mesh(new T.BoxGeometry(.75,.5,.08),warnMat);panel.position.set(2+Math.random()*44,1.6,2+Math.random()*44);panel.rotation.y=(i%2)*Math.PI/2;scene.add(panel)}
          for(let i=0;i<35;i++){let stain=new T.Mesh(new T.CircleGeometry(.2+Math.random()*.7,8),new T.MeshBasicMaterial({color:0x33261e,transparent:true,opacity:.25}));stain.rotation.x=-Math.PI/2;stain.position.set(Math.random()*48,.012,Math.random()*48);scene.add(stain)}
          stage.insertAdjacentHTML('beforeend','<div class="ultra3d-badge">PROCEDURAL MAZE • 6 RELICS • 3 CREATURES</div>');
          const exit=new T.Group(),door=new T.Mesh(new T.BoxGeometry(1.8,2.7,.18),new T.MeshLambertMaterial({color:0x2f8f55,emissive:0x0b321b})),
                sign=new T.Mesh(new T.BoxGeometry(2.3,.45,.2),new T.MeshLambertMaterial({color:0x78ff9f,emissive:0x205d30}));
          exit.add(door,sign);sign.position.y=1.75;exit.position.set((N-2)*4,1.35,(N-2)*4);scene.add(exit);

          const enemyCells=open.slice(12,15), enemies=[];
          enemyCells.forEach((p,i)=>{
            const g=new T.Group(),body=new T.Mesh(new T.SphereGeometry(.62,7,6),new T.MeshLambertMaterial({color:[0x314d25,0x51345c,0x294e55][i]})),
                  eye1=new T.Mesh(new T.SphereGeometry(.09,5,4),new T.MeshBasicMaterial({color:0xffff88})),eye2=eye1.clone();
            eye1.position.set(-.2,.12,-.57);eye2.position.set(.2,.12,-.57);g.add(body,eye1,eye2);g.position.set(p[0]*4,.72,p[1]*4);scene.add(g);
            enemies.push({g,dir:new T.Vector3(),cool:0,spawn:g.position.clone()})
          });

          let px=4,pz=4,yaw=Math.PI,got=0,startTime=0,flashTimer=0,mapShown=true;const keys={};
          cam.position.set(px,1.55,pz);
          const walkable=(x,z)=>{let gx=Math.round(x/4),gz=Math.round(z/4);if(gx<0||gz<0||gx>=N||gz>=N)return false;return grid[gz][gx]===0};
          function canMove(x,z){const r=.48;return walkable(x-r,z-r)&&walkable(x+r,z-r)&&walkable(x-r,z+r)&&walkable(x+r,z+r)}
          function say(t){msg.textContent=t;msg.classList.add('show');clearTimeout(flashTimer);flashTimer=setTimeout(()=>msg.classList.remove('show'),1400)}
          function resetPlayer(){px=4;pz=4;yaw=Math.PI;cam.position.set(px,1.55,pz);say('A CREATURE SENT YOU BACK TO THE ENTRANCE!')}
          const kd=e=>{keys[e.code]=true;if(e.code==='KeyM'){mapShown=!mapShown;mapWrap.style.display=mapShown?'block':'none'}if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault()},ku=e=>keys[e.code]=false;
          addEventListener('keydown',kd);addEventListener('keyup',ku);

          function drawMap(){
            mx.fillStyle='#080808';mx.fillRect(0,0,130,130);const s=130/N;
            for(let z=0;z<N;z++)for(let x=0;x<N;x++){mx.fillStyle=grid[z][x]?'#6f2019':'#2a251f';mx.fillRect(x*s,z*s,s+1,s+1)}
            souvenirs.forEach(q=>{if(!q.userData.taken){mx.fillStyle='#ffe56c';mx.fillRect((q.position.x/4)*s+2,(q.position.z/4)*s+2,4,4)}});
            mx.fillStyle='#59ff89';mx.fillRect((N-2)*s+1,(N-2)*s+1,6,6);
            mx.fillStyle='#67cfff';mx.beginPath();mx.arc((px/4)*s,(pz/4)*s,3,0,Math.PI*2);mx.fill()
          }
          function chooseEnemyDir(e){
            const gx=Math.round(e.g.position.x/4),gz=Math.round(e.g.position.z/4),opts=[];
            [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dz])=>{if(gx+dx>=0&&gz+dz>=0&&gx+dx<N&&gz+dz<N&&!grid[gz+dz][gx+dx])opts.push(new T.Vector3(dx,0,dz))});
            if(opts.length)e.dir.copy(opts[Math.floor(Math.random()*opts.length)]);e.cool=1.2+Math.random()*1.8
          }
          function loop(now){
            if(stopped||!started)return;
            const w=stage.clientWidth,hh=stage.clientHeight;ren.setSize(w,hh,false);cam.aspect=w/hh;cam.updateProjectionMatrix();
            const run=keys.ShiftLeft||keys.ShiftRight,spd=run?.115:.075;
            if(keys.ArrowLeft)yaw+=.035;if(keys.ArrowRight)yaw-=.035;
            const f=new T.Vector3(Math.sin(yaw),0,Math.cos(yaw)),r=new T.Vector3(f.z,0,-f.x),move=new T.Vector3();
            if(keys.KeyW||keys.ArrowUp)move.add(f);if(keys.KeyS||keys.ArrowDown)move.sub(f);if(keys.KeyQ)move.sub(r);if(keys.KeyE)move.add(r);
            if(move.lengthSq()){move.normalize().multiplyScalar(spd);let nx=px+move.x,nz=pz+move.z;if(canMove(nx,pz))px=nx;if(canMove(px,nz))pz=nz}
            cam.position.set(px,1.55,pz);cam.rotation.order='YXZ';cam.rotation.y=yaw;lamp.position.set(px,2.5,pz);

            souvenirs.forEach((q,i)=>{if(!q.userData.taken){q.rotation.y+=.025;q.position.y=q.userData.base+Math.sin(now*.003+i)*.12;if(cam.position.distanceTo(q.position)<1.25){q.userData.taken=true;q.visible=false;got++;say('FOUND: '+q.userData.name);objective.textContent=got<6?`FIND ${6-got} MORE SOUVENIR${6-got===1?'':'S'}`:'FIND THE GREEN EXIT'}}});

            enemies.forEach(e=>{
              e.cool-=.016;if(e.cool<=0)chooseEnemyDir(e);
              let np=e.g.position.clone().addScaledVector(e.dir,.035);if(walkable(np.x,np.z))e.g.position.copy(np);else chooseEnemyDir(e);
              e.g.rotation.y=Math.atan2(e.dir.x,e.dir.z);
              if(cam.position.distanceTo(e.g.position)<1.05){e.g.position.copy(e.spawn);resetPlayer()}
            });

            if(got===6&&cam.position.distanceTo(exit.position)<1.6&&!won){
              won=true;objective.textContent='MAZE COMPLETE!';say('ALL SOUVENIRS RECOVERED!');
              try{awardPrizes(4,'Voxel Frontier')}catch(e){}
              setTimeout(()=>{host.querySelector('#bmStart').classList.remove('hide');host.querySelector('#bmStart').innerHTML=`<div><h1>MAZE COMPLETE</h1><p>You recovered all 6 souvenirs.</p><button class="bm95-btn" id="bmAgain">NEW RANDOM MAZE</button></div>`;host.querySelector('#bmAgain').onclick=()=>startBrickMaze95(host,game)},800)
            }
            const sec=Math.floor((performance.now()-startTime)/1000);hud.innerHTML=`SOUVENIRS ${got}/6<br>TIME ${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}<br>RUN ${run?'ON':'OFF'}`;
            drawMap();ren.render(scene,cam);requestAnimationFrame(loop)
          }
          host.querySelector('#bmBegin').onclick=()=>{started=true;startTime=performance.now();host.querySelector('#bmStart').classList.add('hide');requestAnimationFrame(loop)};
          activeNativeCleanup=()=>{stopped=true;started=false;removeEventListener('keydown',kd);removeEventListener('keyup',ku);ren.dispose()}
        }

        let activeNativeCleanup = null;

        function stopNativeGame() {
            if (activeNativeCleanup) {
                activeNativeCleanup();
                activeNativeCleanup = null;
            }
        }

        function startCrazySnake(host) {
            stopNativeGame();

            host.innerHTML = `
                <div class="native-game-shell">
                    <div class="native-game-toolbar">
                        <span>CRAZYSNAKE • ARROW KEYS / WASD</span>
                        <span>Score <b id="snakeScore">0</b></span>
                    </div>
                    <div class="native-game-canvas-wrap">
                        <canvas id="snakeCanvas" class="native-game-canvas" width="960" height="540" tabindex="0"></canvas>
                        <div class="native-overlay" id="snakeOverlay">
                            <div class="native-overlay-card">
                                <h3>GAME OVER</h3>
                                <p id="snakeFinal">Score 0</p>
                                <button class="btn btn-primary" id="snakeAgain">Play Again</button>
                            </div>
                        </div>
                    </div>
                    <div class="native-controls">
                        <button class="btn" id="snakeRestart">↻ Restart</button>
                        <button class="btn" id="snakePause">Ⅱ Pause</button>
                    </div>
                </div>
            `;

            const canvas = host.querySelector('#snakeCanvas');
            const ctx = canvas.getContext('2d');
            const scoreEl = host.querySelector('#snakeScore');
            const overlay = host.querySelector('#snakeOverlay');
            const finalEl = host.querySelector('#snakeFinal');
            const restartBtn = host.querySelector('#snakeRestart');
            const pauseBtn = host.querySelector('#snakePause');
            const againBtn = host.querySelector('#snakeAgain');

            const CELL = 30, COLS = 32, ROWS = 18;
            let snake, dir, nextDir, food, score, paused, dead;
            let timer;

            function placeFood() {
                do {
                    food = { x: Math.floor(Math.random()*COLS), y: Math.floor(Math.random()*ROWS) };
                } while (snake.some(s => s.x === food.x && s.y === food.y));
            }

            function reset() {
                snake = [{x:15,y:9},{x:14,y:9},{x:13,y:9},{x:12,y:9}];
                dir = {x:1,y:0};
                nextDir = {x:1,y:0};
                score = 0;
                paused = false;
                dead = false;
                scoreEl.textContent = '0';
                pauseBtn.textContent = 'Ⅱ Pause';
                overlay.classList.remove('show');
                placeFood();
                draw();
                canvas.focus();
            }

            function draw() {
                ctx.fillStyle = '#000';
                ctx.fillRect(0,0,960,540);

                ctx.fillStyle = 'rgba(96,145,150,.12)';
                ctx.beginPath();
                ctx.arc(120,120,44,0,Math.PI*2);
                ctx.fill();

                ctx.fillStyle = '#c98e57';
                ctx.beginPath();
                ctx.arc(food.x*CELL+15, food.y*CELL+15, 7, 0, Math.PI*2);
                ctx.fill();

                snake.forEach((s,i) => {
                    ctx.fillStyle = i === 0 ? '#88b9bd' : '#547c7f';
                    ctx.beginPath();
                    ctx.roundRect(s.x*CELL+5,s.y*CELL+5,20,20,6);
                    ctx.fill();
                });
            }

            function tick() {
                if (paused || dead) return;

                dir = nextDir;
                const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
                const crash = head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
                    snake.some(s => s.x === head.x && s.y === head.y);

                if (crash) {
                    dead = true;
                    finalEl.textContent = 'Score ' + score;
                    overlay.classList.add('show');
                    return;
                }

                snake.unshift(head);

                if (head.x === food.x && head.y === food.y) {
                    score += 10;
                    scoreEl.textContent = score;
                    placeFood();
                } else {
                    snake.pop();
                }

                draw();
            }

            function setDir(x,y) {
                if (x === -dir.x && y === -dir.y) return;
                nextDir = {x,y};
            }

            function togglePause() {
                if (dead) return;
                paused = !paused;
                pauseBtn.textContent = paused ? '▶ Resume' : 'Ⅱ Pause';
                canvas.focus();
            }

            function keydown(e) {
                const k = e.key.toLowerCase();
                if (['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d',' '].includes(k)) e.preventDefault();
                if (k === 'arrowup' || k === 'w') setDir(0,-1);
                if (k === 'arrowdown' || k === 's') setDir(0,1);
                if (k === 'arrowleft' || k === 'a') setDir(-1,0);
                if (k === 'arrowright' || k === 'd') setDir(1,0);
                if (k === ' ') togglePause();
            }

            canvas.addEventListener('keydown', keydown);
            restartBtn.addEventListener('click', reset);
            pauseBtn.addEventListener('click', togglePause);
            againBtn.addEventListener('click', reset);

            reset();
            timer = setInterval(tick, 110);

            activeNativeCleanup = () => {
                clearInterval(timer);
                canvas.removeEventListener('keydown', keydown);
            };
        }

        function startBrickBreaker(host) {
            stopNativeGame();

            host.innerHTML = `
                <div class="native-game-shell">
                    <div class="native-game-toolbar">
                        <span>BRICK BREAKER • ← → / A D</span>
                        <span>Score <b id="brickScore">0</b> • Lives <b id="brickLives">3</b></span>
                    </div>
                    <div class="native-game-canvas-wrap">
                        <canvas id="brickCanvas" class="native-game-canvas" width="960" height="540" tabindex="0"></canvas>
                        <div class="native-overlay" id="brickOverlay">
                            <div class="native-overlay-card">
                                <h3 id="brickTitle">GAME OVER</h3>
                                <p id="brickFinal">Score 0</p>
                                <button class="btn btn-primary" id="brickAgain">Play Again</button>
                            </div>
                        </div>
                    </div>
                    <div class="native-controls">
                        <button class="btn" id="brickRestart">↻ Restart</button>
                        <button class="btn" id="brickPause">Ⅱ Pause</button>
                    </div>
                </div>
            `;

            const canvas = host.querySelector('#brickCanvas');
            const ctx = canvas.getContext('2d');
            const scoreEl = host.querySelector('#brickScore');
            const livesEl = host.querySelector('#brickLives');
            const overlay = host.querySelector('#brickOverlay');
            const titleEl = host.querySelector('#brickTitle');
            const finalEl = host.querySelector('#brickFinal');
            const restartBtn = host.querySelector('#brickRestart');
            const pauseBtn = host.querySelector('#brickPause');
            const againBtn = host.querySelector('#brickAgain');

            let raf, last = performance.now();
            let left=false, right=false, paused=false, over=false;
            let score=0, lives=3;
            const paddle={x:390,y:500,w:180,h:12,speed:560};
            const ball={x:480,y:465,r:8,vx:250,vy:-290};
            let bricks=[];

            function makeBricks(){
                bricks=[];
                const cols=10, rows=5, gap=10, totalW=820;
                const bw=(totalW-gap*(cols-1))/cols, bh=24;
                const sx=(960-totalW)/2, sy=72;
                for(let r=0;r<rows;r++){
                    for(let c=0;c<cols;c++){
                        bricks.push({x:sx+c*(bw+gap),y:sy+r*(bh+gap),w:bw,h:bh,alive:true,row:r});
                    }
                }
            }

            function resetBall(){
                ball.x=480; ball.y=465;
                ball.vx=(Math.random()>.5?1:-1)*250;
                ball.vy=-290;
            }

            function reset(){
                score=0; lives=3; paused=false; over=false;
                paddle.x=390;
                scoreEl.textContent='0';
                livesEl.textContent='3';
                pauseBtn.textContent='Ⅱ Pause';
                overlay.classList.remove('show');
                makeBricks();
                resetBall();
                canvas.focus();
            }

            function hit(rect,x,y,r){
                const nx=Math.max(rect.x,Math.min(x,rect.x+rect.w));
                const ny=Math.max(rect.y,Math.min(y,rect.y+rect.h));
                const dx=x-nx,dy=y-ny;
                return dx*dx+dy*dy<=r*r;
            }

            function update(dt){
                if(paused||over) return;

                if(left) paddle.x-=paddle.speed*dt;
                if(right) paddle.x+=paddle.speed*dt;
                paddle.x=Math.max(20,Math.min(760,paddle.x));

                ball.x+=ball.vx*dt;
                ball.y+=ball.vy*dt;

                if(ball.x-ball.r<=0&&ball.vx<0) ball.vx*=-1;
                if(ball.x+ball.r>=960&&ball.vx>0) ball.vx*=-1;
                if(ball.y-ball.r<=0&&ball.vy<0) ball.vy*=-1;

                if(hit(paddle,ball.x,ball.y,ball.r)&&ball.vy>0){
                    const rel=(ball.x-(paddle.x+paddle.w/2))/(paddle.w/2);
                    ball.vx=rel*390;
                    ball.vy=-Math.abs(ball.vy);
                    ball.y=paddle.y-ball.r-1;
                }

                for(const b of bricks){
                    if(!b.alive) continue;
                    if(hit(b,ball.x,ball.y,ball.r)){
                        b.alive=false;
                        score+=100;
                        scoreEl.textContent=score;
                        ball.vy*=-1;
                        break;
                    }
                }

                if(ball.y-ball.r>540){
                    lives--;
                    livesEl.textContent=lives;
                    if(lives<=0){
                        over=true;
                        titleEl.textContent='GAME OVER';
                        finalEl.textContent='Score '+score;
                        overlay.classList.add('show');
                    } else {
                        resetBall();
                    }
                }

                if(bricks.every(b=>!b.alive)){
                    over=true;
                    titleEl.textContent='CLEARED';
                    finalEl.textContent='Score '+score;
                    overlay.classList.add('show');
                }
            }

            function draw(){
                ctx.fillStyle='#000';
                ctx.fillRect(0,0,960,540);

                const shades=['#66899f','#5b7c92','#527086','#496579','#41596b'];
                bricks.forEach(b=>{
                    if(!b.alive) return;
                    ctx.fillStyle=shades[b.row];
                    ctx.beginPath();
                    ctx.roundRect(b.x,b.y,b.w,b.h,5);
                    ctx.fill();
                });

                ctx.fillStyle='#d6dde2';
                ctx.beginPath();
                ctx.roundRect(paddle.x,paddle.y,paddle.w,paddle.h,6);
                ctx.fill();

                ctx.fillStyle='#d79a5f';
                ctx.beginPath();
                ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);
                ctx.fill();
            }

            function loop(now){
                const dt=Math.min((now-last)/1000,.03);
                last=now;
                update(dt);
                draw();
                raf=requestAnimationFrame(loop);
            }

            function keydown(e){
                const k=e.key.toLowerCase();
                if(['arrowleft','arrowright','a','d',' '].includes(k)) e.preventDefault();
                if(k==='arrowleft'||k==='a') left=true;
                if(k==='arrowright'||k==='d') right=true;
                if(k===' ') togglePause();
            }

            function keyup(e){
                const k=e.key.toLowerCase();
                if(k==='arrowleft'||k==='a') left=false;
                if(k==='arrowright'||k==='d') right=false;
            }

            function togglePause(){
                if(over) return;
                paused=!paused;
                pauseBtn.textContent=paused?'▶ Resume':'Ⅱ Pause';
                canvas.focus();
            }

            canvas.addEventListener('keydown',keydown);
            canvas.addEventListener('keyup',keyup);
            restartBtn.addEventListener('click',reset);
            pauseBtn.addEventListener('click',togglePause);
            againBtn.addEventListener('click',reset);

            reset();
            raf=requestAnimationFrame(loop);

            activeNativeCleanup=()=>{
                cancelAnimationFrame(raf);
                canvas.removeEventListener('keydown',keydown);
                canvas.removeEventListener('keyup',keyup);
            };
        }


        function startHackerChallenge(host) {
            stopNativeGame();

            host.innerHTML = `
                <div class="challenge-shell">
                    <div class="challenge-panel">
                        <div class="challenge-kicker">NITROARCADE CHALLENGE</div>
                        <div class="challenge-title">ARE YOU A HACKER?</div>
                        <div class="challenge-sub">Beat ten trials to unlock the Ruffle library.</div>

                        <div class="challenge-progress">
                            <div class="challenge-step active" id="hackStep1">1 • 50 Clicks</div>
                            <div class="challenge-step" id="hackStep2">2 • Green Reflex</div>
                            <div class="challenge-step" id="hackStep3">3 • Guess 1–20</div>
                        </div>

                        <div class="challenge-stage" id="hackStage"></div>
                    </div>
                </div>
            `;

            const stage = host.querySelector('#hackStage');
            const steps = [
                host.querySelector('#hackStep1'),
                host.querySelector('#hackStep2'),
                host.querySelector('#hackStep3')
            ];

            let cancelled = false;
            let timers = [];

            function clearTimers() {
                timers.forEach(id => {
                    clearTimeout(id);
                    clearInterval(id);
                });
                timers = [];
            }

            function setStep(n) {
                steps.forEach((el, i) => {
                    el.classList.remove('active');
                    if (i < n - 1) el.classList.add('done');
                });
                steps[n - 1].classList.add('active');
            }

            function stageOne() {
                clearTimers();
                setStep(1);

                let clicks = 0;
                let start = null;
                let clock = null;

                stage.innerHTML = `
                    <div class="challenge-stage-inner">
                        <h3>Trial 1: Click Speed</h3>
                        <p>Get 50 clicks before 60 seconds runs out.</p>
                        <div class="challenge-statline">
                            <span>Clicks <strong id="hackClicks">0 / 50</strong></span>
                            <span>Time <strong id="hackTime">60.0s</strong></span>
                        </div>
                        <button class="challenge-big-btn" id="hackClickBtn">CLICK</button>
                        <div class="challenge-result" id="hackClickResult"></div>
                    </div>
                `;

                const btn = stage.querySelector('#hackClickBtn');
                const clicksEl = stage.querySelector('#hackClicks');
                const timeEl = stage.querySelector('#hackTime');
                const result = stage.querySelector('#hackClickResult');

                btn.onclick = () => {
                    if (!start) {
                        start = performance.now();
                        clock = setInterval(() => {
                            const left = Math.max(0, 60 - (performance.now() - start) / 1000);
                            timeEl.textContent = left.toFixed(1) + 's';

                            if (left <= 0) {
                                clearInterval(clock);
                                btn.disabled = true;
                                result.textContent = 'Time ran out. Try again.';
                                timers.push(setTimeout(() => !cancelled && stageOne(), 900));
                            }
                        }, 100);
                        timers.push(clock);
                    }

                    clicks++;
                    clicksEl.textContent = clicks + ' / 50';

                    if (clicks >= 50) {
                        clearInterval(clock);
                        const elapsed = (performance.now() - start) / 1000;
                        btn.disabled = true;
                        result.textContent = 'Passed in ' + elapsed.toFixed(2) + ' seconds.';
                        timers.push(setTimeout(() => !cancelled && stageTwo(), 650));
                    }
                };
            }

            function stageTwo() {
                clearTimers();
                setStep(2);

                stage.innerHTML = `
                    <div class="challenge-stage-inner">
                        <h3>Trial 2: Reflex</h3>
                        <p>Wait for green. Click it in under 600 ms. Clicking early restarts the trial.</p>
                        <div class="challenge-statline">
                            <span>Target <strong>&lt; 600 ms</strong></span>
                        </div>
                        <div class="green-target-wrap" id="greenWrap">
                            <button class="green-target" id="greenTarget" aria-label="Green target"></button>
                        </div>
                        <div class="challenge-result" id="greenResult">Get ready...</div>
                    </div>
                `;

                const wrap = stage.querySelector('#greenWrap');
                const target = stage.querySelector('#greenTarget');
                const result = stage.querySelector('#greenResult');

                let greenAt = 0;
                let shown = false;

                const showTimer = setTimeout(() => {
                    shown = true;
                    greenAt = performance.now();
                    target.classList.add('show');
                    result.textContent = 'GO!';
                }, 1200 + Math.random() * 2200);
                timers.push(showTimer);

                wrap.onclick = () => {
                    if (!shown) {
                        clearTimers();
                        result.textContent = 'Too early. Restarting...';
                        timers.push(setTimeout(() => !cancelled && stageTwo(), 800));
                    }
                };

                target.onclick = (e) => {
                    e.stopPropagation();
                    if (!shown) return;

                    const ms = performance.now() - greenAt;
                    target.classList.remove('show');

                    if (ms < 600) {
                        result.textContent = 'Passed: ' + Math.round(ms) + ' ms.';
                        timers.push(setTimeout(() => !cancelled && stageThree(), 650));
                    } else {
                        result.textContent = Math.round(ms) + ' ms — too slow.';
                        timers.push(setTimeout(() => !cancelled && stageTwo(), 850));
                    }
                };
            }

            function stageThree() {
                clearTimers();
                setStep(3);

                const secret = Math.floor(Math.random() * 20) + 1;
                let tries = 5;

                stage.innerHTML = `
                    <div class="challenge-stage-inner">
                        <h3>Trial 3: Guess The Number</h3>
                        <p>I'm thinking of a number from 1 to 20. You have 5 tries.</p>
                        <div class="challenge-statline">
                            <span>Tries left <strong id="guessTries">5</strong></span>
                        </div>
                        <div class="guess-row">
                            <input id="guessInput" type="number" min="1" max="20" placeholder="1–20">
                            <button class="btn btn-primary" id="guessBtn">Guess</button>
                        </div>
                        <div class="challenge-result" id="guessResult"></div>
                    </div>
                `;

                const input = stage.querySelector('#guessInput');
                const btn = stage.querySelector('#guessBtn');
                const triesEl = stage.querySelector('#guessTries');
                const result = stage.querySelector('#guessResult');

                function submitGuess() {
                    const value = Number(input.value);

                    if (!Number.isInteger(value) || value < 1 || value > 20) {
                        result.textContent = 'Enter a whole number from 1 to 20.';
                        return;
                    }

                    tries--;
                    triesEl.textContent = tries;

                    if (value === secret) {
                        steps[2].classList.remove('active');
                        steps[2].classList.add('done');

                        unlockWindosill();
                        stage.innerHTML = `
                            <div class="challenge-stage-inner">
                                <h3>ACCESS GRANTED</h3>
                                <div class="challenge-final-score">3 / 3</div>
                                <p>You cleared every NitroArcade challenge.</p>
                                <div class="secret-unlock">
                                    <div class="challenge-kicker">SECRET ARCADE UNLOCKED</div>
                                    <h3>FLASH GAMES</h3>
                                    <p>You unlocked a whole arcade, including Windosill!</p>
                                    <button class="challenge-big-btn" id="enterWindosill">ENTER FLASH GAMES</button>
                                </div>
                                <button class="btn" id="hackAgain" style="margin-top:12px">PLAY CHALLENGE AGAIN</button>
                            </div>
                        `;
                        stage.querySelector('#enterWindosill').onclick = openFlashArcade;
                        stage.querySelector('#hackAgain').onclick = stageOne;
                        return;
                    }

                    if (tries <= 0) {
                        result.textContent = 'No tries left. The number was ' + secret + '. Restarting...';
                        btn.disabled = true;
                        input.disabled = true;
                        timers.push(setTimeout(() => !cancelled && stageThree(), 1000));
                        return;
                    }

                    result.textContent = value < secret ? 'Higher.' : 'Lower.';
                    input.value = '';
                    input.focus();
                }

                btn.onclick = submitGuess;
                input.onkeydown = e => {
                    if (e.key === 'Enter') submitGuess();
                };
                input.focus();
            }

            stageOne();

            


            activeNativeCleanup = () => {
                cancelled = true;
                clearTimers();
            };
        }


        function startMegaGame(host,game){
            stopNativeGame();
            let dead=false,raf=0,timers=[],listeners=[];
            const later=(f,m)=>{const x=setTimeout(()=>!dead&&f(),m);timers.push(x);return x};
            const every=(f,m)=>{const x=setInterval(()=>!dead&&f(),m);timers.push(x);return x};
            const on=(o,e,f)=>{o.addEventListener(e,f);listeners.push(()=>o.removeEventListener(e,f))};
            host.innerHTML=`<div class="mega-shell"><div class="mega-panel"><div class="mega-head"><div><div class="mega-kicker">NITROARCADE ORIGINAL</div><div class="mega-title">${game.name}</div></div><div class="mega-help" id="megaHelp"></div></div><div id="megaBody"></div></div></div>`;
            const body=host.querySelector('#megaBody'),help=host.querySelector('#megaHelp');
            function replay(){startMegaGame(host,game)}
            function finish(title,msg){body.innerHTML=`<div class="mega-ui"><div class="mega-center"><h2>${title}</h2><p style="color:var(--muted);margin:10px 0 16px">${msg}</p><button class="mega-btn primary" id="replay">PLAY AGAIN</button></div></div>`;body.querySelector('#replay').onclick=replay}
            function canvasGame(instructions,setup){
                help.textContent=instructions;body.innerHTML=`<canvas class="mega-canvas" width="900" height="506"></canvas>`;const c=body.querySelector('canvas'),x=c.getContext('2d');setup(c,x);
            }
            const keys={}; const kd=e=>keys[e.key.toLowerCase()]=true, ku=e=>keys[e.key.toLowerCase()]=false; on(window,'keydown',kd);on(window,'keyup',ku);

            if(game.engine==='pong'){
                canvasGame('W/S or ↑/↓ • First to 7', (c,x)=>{
                    let py=203,cy=203,bx=450,by=253,vx=5,vy=3.4,ps=0,cs=0;
                    function reset(d=1){bx=450;by=253;vx=5*d;vy=(Math.random()*4-2)||2}
                    function loop(){
                        if(dead)return;
                        if(keys['w']||keys['arrowup'])py-=6;if(keys['s']||keys['arrowdown'])py+=6;py=Math.max(0,Math.min(406,py));
                        cy+=Math.sign(by-(cy+50))*3.8;cy=Math.max(0,Math.min(406,cy));
                        bx+=vx;by+=vy;if(by<8||by>498)vy*=-1;
                        if(bx<45&&by>py&&by<py+100&&vx<0)vx*=-1.05;
                        if(bx>835&&by>cy&&by<cy+100&&vx>0)vx*=-1.05;
                        if(bx<0){cs++;reset(1)}if(bx>900){ps++;reset(-1)}
                        x.fillStyle='#020304';x.fillRect(0,0,900,506);x.strokeStyle='#243038';x.setLineDash([8,10]);x.beginPath();x.moveTo(450,0);x.lineTo(450,506);x.stroke();x.setLineDash([]);
                        x.fillStyle='#dfe8ed';x.fillRect(25,py,14,100);x.fillRect(861,cy,14,100);x.fillStyle='#6cc5ef';x.beginPath();x.arc(bx,by,9,0,Math.PI*2);x.fill();
                        x.font='26px sans-serif';x.fillStyle='#82929b';x.fillText(ps,410,35);x.fillText(cs,475,35);
                        if(ps>=7)return finish('YOU WIN','Pong champion.');if(cs>=7)return finish('CPU WINS','Try another match.');raf=requestAnimationFrame(loop)
                    }loop();
                });
            } else if(game.engine==='shooter'){
                canvasGame('A/D or ←/→ • Space to shoot', (c,x)=>{
                    let px=430,shots=[],enemies=[],score=0,cool=0;
                    for(let r=0;r<4;r++)for(let col=0;col<9;col++)enemies.push({x:120+col*75,y:60+r*45,alive:true});
                    function loop(){
                        if(dead)return;if(keys['a']||keys['arrowleft'])px-=5;if(keys['d']||keys['arrowright'])px+=5;px=Math.max(10,Math.min(850,px));
                        if(keys[' ']&&cool<=0){shots.push({x:px+20,y:450});cool=12}cool--;
                        shots.forEach(s=>s.y-=8);shots=shots.filter(s=>s.y>-10);
                        shots.forEach(s=>enemies.forEach(e=>{if(e.alive&&s.x>e.x&&s.x<e.x+35&&s.y>e.y&&s.y<e.y+25){e.alive=false;s.y=-99;score++}}));
                        x.fillStyle='#020304';x.fillRect(0,0,900,506);x.fillStyle='#6cc5ef';x.fillRect(px,465,50,16);x.fillStyle='#e5edf2';shots.forEach(s=>x.fillRect(s.x,s.y,4,12));
                        x.fillStyle='#d59b59';enemies.forEach(e=>{if(e.alive)x.fillRect(e.x,e.y,35,24)});x.fillStyle='#82929b';x.font='16px sans-serif';x.fillText('Targets '+score+'/36',18,25);
                        if(score===36)return finish('SECTOR CLEAR','All targets destroyed.');raf=requestAnimationFrame(loop)
                    }loop();
                });
            } else if(game.engine==='flappy'){
                canvasGame('Space / click to flap', (c,x)=>{
                    let y=250,vy=0,pipes=[],score=0,frame=0;
                    const flap=()=>vy=-7;on(c,'click',flap);on(window,'keydown',e=>{if(e.code==='Space')flap()});
                    function loop(){if(dead)return;frame++;vy+=.38;y+=vy;if(frame%95===0)pipes.push({x:900,g:100+Math.random()*260,passed:false});pipes.forEach(p=>p.x-=4);pipes=pipes.filter(p=>p.x>-70);
                        for(const p of pipes){if(!p.passed&&p.x<170){p.passed=true;score++}if(160>p.x&&140<p.x+55&&(y-13<p.g-70||y+13>p.g+70))return finish('CRASHED','Score: '+score)}
                        if(y<0||y>506)return finish('CRASHED','Score: '+score);
                        x.fillStyle='#020304';x.fillRect(0,0,900,506);x.fillStyle='#344a55';pipes.forEach(p=>{x.fillRect(p.x,0,55,p.g-70);x.fillRect(p.x,p.g+70,55,506)});x.fillStyle='#6cc5ef';x.beginPath();x.arc(150,y,13,0,Math.PI*2);x.fill();x.fillStyle='#82929b';x.font='18px sans-serif';x.fillText('Score '+score,18,26);raf=requestAnimationFrame(loop)
                    }loop();
                });
            } else if(game.engine==='maze'){
                canvasGame('Arrow keys • Reach the cyan exit', (c,x)=>{
                    const map=["###############","#S#     #     #","# # ### # ### #","# # #   # #   #","#   # ### # # #","### #     # # #","#   ##### # # #","# #       #   #","# ########### #","#            E#","###############"];
                    let px=1,py=1;const kh=e=>{let nx=px,ny=py;if(e.key==='ArrowLeft')nx--;if(e.key==='ArrowRight')nx++;if(e.key==='ArrowUp')ny--;if(e.key==='ArrowDown')ny++;if(map[ny]?.[nx]&&map[ny][nx]!=='#'){px=nx;py=ny;if(map[py][px]==='E')finish('ESCAPED','Maze complete.')}};on(window,'keydown',kh);
                    function draw(){if(dead)return;x.fillStyle='#020304';x.fillRect(0,0,900,506);const s=42,ox=135,oy=22;for(let r=0;r<map.length;r++)for(let q=0;q<map[r].length;q++){if(map[r][q]==='#'){x.fillStyle='#243038';x.fillRect(ox+q*s,oy+r*s,s-2,s-2)}if(map[r][q]==='E'){x.fillStyle='#6cc5ef';x.fillRect(ox+q*s,oy+r*s,s-2,s-2)}}x.fillStyle='#e1a15e';x.beginPath();x.arc(ox+px*s+s/2,oy+py*s+s/2,12,0,Math.PI*2);x.fill();raf=requestAnimationFrame(draw)}draw();
                });
            } else if(game.engine==='connect4'){
                help.textContent='You vs CPU • Get 4 in a row';let board=Array.from({length:6},()=>Array(7).fill(0)),over=false;
                const win=(p)=>{for(let r=0;r<6;r++)for(let c=0;c<7;c++)for(const [dr,dc] of [[0,1],[1,0],[1,1],[1,-1]])if([0,1,2,3].every(k=>board[r+dr*k]?.[c+dc*k]===p))return true;return false};
                function drop(col,p){for(let r=5;r>=0;r--)if(!board[r][col]){board[r][col]=p;return true}return false}
                function render(){body.innerHTML=`<div class="mega-ui"><div class="mega-center"><h2>Connect Four</h2><div class="mega-grid" style="grid-template-columns:repeat(7,54px)">${board.flatMap((row,r)=>row.map((v,c)=>`<button class="c4cell ${v?'p'+v:''}" data-c="${c}"></button>`)).join('')}</div></div></div>`;body.querySelectorAll('.c4cell').forEach(b=>b.onclick=()=>{if(over||!drop(+b.dataset.c,1))return;if(win(1)){over=true;return finish('YOU WIN','Four connected.')}let choices=[0,1,2,3,4,5,6].filter(c=>board[0][c]===0);if(!choices.length)return finish('DRAW','Board filled.');drop(choices[Math.floor(Math.random()*choices.length)],2);if(win(2)){over=true;return finish('CPU WINS','Try again.')}render()})}render();
            } else if(game.engine==='tictac'){
                help.textContent='You are X • CPU is O';let b=Array(9).fill(''),over=false;const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];const won=p=>wins.some(w=>w.every(i=>b[i]===p));
                function render(){body.innerHTML=`<div class="mega-ui"><div class="mega-center"><h2>Tic-Tac-Toe</h2><div class="mega-grid" style="grid-template-columns:repeat(3,90px)">${b.map((v,i)=>`<button class="ttcell" data-i="${i}">${v}</button>`).join('')}</div></div></div>`;body.querySelectorAll('.ttcell').forEach(c=>c.onclick=()=>{let i=+c.dataset.i;if(over||b[i])return;b[i]='X';if(won('X'))return finish('YOU WIN','Three in a row.');let free=b.map((v,i)=>v?'':i).filter(v=>v!=='');if(!free.length)return finish('DRAW','No spaces left.');let ci=free[Math.floor(Math.random()*free.length)];b[ci]='O';if(won('O'))return finish('CPU WINS','Try again.');render()})}render();
            } else if(game.engine==='whack'){
                help.textContent='Hit 20 orbs before time runs out';let hits=0,time=25;body.innerHTML=`<div class="mega-ui" id="arena" style="position:relative"><div style="position:absolute;top:12px;left:14px;color:var(--muted)">Hits <b id="wh">${hits}/20</b> • Time <b id="wt">${time}</b></div></div>`;const a=body.querySelector('#arena'),o=document.createElement('button');o.className='moving-dot';a.appendChild(o);const move=()=>{const r=a.getBoundingClientRect();o.style.left=(20+Math.random()*Math.max(20,r.width-90))+'px';o.style.top=(50+Math.random()*Math.max(20,r.height-120))+'px'};o.onclick=()=>{hits++;a.querySelector('#wh').textContent=hits+'/20';if(hits>=20)return finish('ORB MASTER','20 hits!');move()};move();every(()=>{time--;let e=a.querySelector('#wt');if(e)e.textContent=time;if(time<=0)finish('TIME','You hit '+hits+' orbs.')},1000);
            } else if(game.engine==='jumper'){
                canvasGame('A/D or ←/→ • Bounce upward', (c,x)=>{
                    let px=440,py=420,vy=-9,score=0,plats=[{x:390,y:470},{x:180,y:380},{x:520,y:300},{x:300,y:215},{x:650,y:135},{x:430,y:55}];
                    function loop(){if(dead)return;if(keys['a']||keys['arrowleft'])px-=5;if(keys['d']||keys['arrowright'])px+=5;px=Math.max(0,Math.min(875,px));vy+=.35;py+=vy;for(const p of plats)if(vy>0&&py+20>=p.y&&py+20<=p.y+12&&px+25>p.x&&px<p.x+110){vy=-9;score++}if(py>520)return finish('FELL','Bounces: '+score);if(score>=10)return finish('SUMMIT','10 clean bounces.');
                        x.fillStyle='#020304';x.fillRect(0,0,900,506);x.fillStyle='#344a55';plats.forEach(p=>x.fillRect(p.x,p.y,110,10));x.fillStyle='#6cc5ef';x.fillRect(px,py,25,25);x.fillStyle='#82929b';x.fillText('Bounces '+score,15,25);raf=requestAnimationFrame(loop)}loop();
                });
            } else if(game.engine==='racer'||game.engine==='lane'){
                canvasGame('A/D or ←/→ • Avoid traffic', (c,x)=>{
                    let lane=1,obs=[],score=0,frame=0;const change=e=>{if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')lane=Math.max(0,lane-1);if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')lane=Math.min(2,lane+1)};on(window,'keydown',change);
                    function loop(){if(dead)return;frame++;if(frame%55===0)obs.push({lane:Math.floor(Math.random()*3),y:-70});obs.forEach(o=>o.y+=6);obs=obs.filter(o=>{if(o.y>506){score++;return false}return true});if(obs.some(o=>o.lane===lane&&o.y>390&&o.y<485))return finish('CRASH','Distance: '+score);
                        x.fillStyle='#020304';x.fillRect(0,0,900,506);x.fillStyle='#202b31';x.fillRect(250,0,400,506);x.strokeStyle='#60727d';x.setLineDash([20,20]);for(let l=1;l<3;l++){x.beginPath();x.moveTo(250+l*133,0);x.lineTo(250+l*133,506);x.stroke()}x.setLineDash([]);x.fillStyle='#6cc5ef';x.fillRect(285+lane*133,420,62,70);x.fillStyle='#d65f5f';obs.forEach(o=>x.fillRect(285+o.lane*133,o.y,62,70));x.fillStyle='#82929b';x.fillText('Distance '+score,15,25);if(score>=25)return finish('FINISH','Clean run.');raf=requestAnimationFrame(loop)}loop();
                });
            } else if(game.engine==='mines'){
                help.textContent='Find all safe cells • 8 mines';const N=8,M=8,mines=new Set();while(mines.size<M)mines.add(Math.floor(Math.random()*N*N));let open=new Set(),lost=false;
                const count=i=>{let r=Math.floor(i/N),c=i%N,n=0;for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){let rr=r+dr,cc=c+dc,j=rr*N+cc;if(rr>=0&&rr<N&&cc>=0&&cc<N&&mines.has(j))n++}return n};
                function render(){body.innerHTML=`<div class="mega-ui"><div class="mega-center"><h2>Mine Grid</h2><div class="mega-grid" style="grid-template-columns:repeat(8,42px)">${Array.from({length:64},(_,i)=>`<button class="minecell ${open.has(i)?'open':''}" data-i="${i}">${open.has(i)?(mines.has(i)?'✹':(count(i)||'')):''}</button>`).join('')}</div></div></div>`;body.querySelectorAll('.minecell').forEach(b=>b.onclick=()=>{let i=+b.dataset.i;if(open.has(i))return;open.add(i);if(mines.has(i)){mines.forEach(m=>open.add(m));render();return later(()=>finish('BOOM','Mine hit.'),500)}if(open.size>=64-M)return finish('CLEARED','All safe cells found.');render()})}render();
            } else if(game.engine==='snake2'){
                canvasGame('Arrow keys • Eat 15 orbs', (c,x)=>{
                    let s=[{x:10,y:10}],d={x:1,y:0},food={x:20,y:10},score=0,last=0;const kh=e=>{const m={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[e.key];if(m)d={x:m[0],y:m[1]}};on(window,'keydown',kh);
                    function loop(t){if(dead)return;if(t-last>90){last=t;let h={x:s[0].x+d.x,y:s[0].y+d.y};if(h.x<0||h.x>=30||h.y<0||h.y>=16||s.some(q=>q.x===h.x&&q.y===h.y))return finish('GAME OVER','Score: '+score);s.unshift(h);if(h.x===food.x&&h.y===food.y){score++;food={x:Math.floor(Math.random()*30),y:Math.floor(Math.random()*16)}}else s.pop();if(score>=15)return finish('SNAKE MASTER','15 orbs eaten.')}x.fillStyle='#020304';x.fillRect(0,0,900,506);x.fillStyle='#6cc5ef';s.forEach(q=>x.fillRect(q.x*30,q.y*30+13,27,27));x.fillStyle='#e1a15e';x.beginPath();x.arc(food.x*30+14,food.y*30+27,10,0,Math.PI*2);x.fill();raf=requestAnimationFrame(loop)}raf=requestAnimationFrame(loop);
                });
            } else if(game.engine==='stack'){
                canvasGame('Space / click to drop blocks', (c,x)=>{
                    let blocks=[{x:350,y:470,w:200}],moving={x:0,y:430,w:200,dir:1},score=0;const drop=()=>{let base=blocks[blocks.length-1],left=Math.max(moving.x,base.x),right=Math.min(moving.x+moving.w,base.x+base.w);if(right<=left)return finish('MISSED','Stack height: '+score);moving.x=left;moving.w=right-left;blocks.push({...moving});score++;if(score>=12)return finish('TOWER COMPLETE','12 blocks stacked.');moving={x:0,y:430-score*36,w:moving.w,dir:1}};on(c,'click',drop);on(window,'keydown',e=>{if(e.code==='Space')drop()});
                    function loop(){if(dead)return;moving.x+=4*moving.dir;if(moving.x<0||moving.x+moving.w>900)moving.dir*=-1;x.fillStyle='#020304';x.fillRect(0,0,900,506);x.fillStyle='#344a55';blocks.forEach((b,i)=>x.fillRect(b.x,b.y-i*36,b.w,30));x.fillStyle='#6cc5ef';x.fillRect(moving.x,moving.y,moving.w,30);raf=requestAnimationFrame(loop)}loop();
                });
            } else if(game.engine==='laserdodge'){
                canvasGame('Move with WASD / arrows • Survive 20 seconds', (c,x)=>{
                    let px=450,py=253,lasers=[],time=20,frame=0;every(()=>time--,1000);
                    function loop(){if(dead)return;frame++;if(keys['a']||keys['arrowleft'])px-=5;if(keys['d']||keys['arrowright'])px+=5;if(keys['w']||keys['arrowup'])py-=5;if(keys['s']||keys['arrowdown'])py+=5;px=Math.max(12,Math.min(888,px));py=Math.max(12,Math.min(494,py));if(frame%55===0)lasers.push({vertical:Math.random()>.5,pos:Math.random()*850,t:0});lasers.forEach(l=>l.t++);lasers=lasers.filter(l=>l.t<75);if(lasers.some(l=>l.t>35&&l.t<48&&(l.vertical?Math.abs(px-l.pos)<14:Math.abs(py-l.pos)<14)))return finish('ZAPPED','Try again.');if(time<=0)return finish('SURVIVED','20 seconds clear.');
                        x.fillStyle='#020304';x.fillRect(0,0,900,506);lasers.forEach(l=>{x.strokeStyle=l.t>35&&l.t<48?'#d85e5e':'#4a2d2d';x.lineWidth=l.t>35&&l.t<48?8:2;x.beginPath();if(l.vertical){x.moveTo(l.pos,0);x.lineTo(l.pos,506)}else{x.moveTo(0,l.pos);x.lineTo(900,l.pos)}x.stroke()});x.fillStyle='#6cc5ef';x.beginPath();x.arc(px,py,11,0,Math.PI*2);x.fill();x.fillStyle='#82929b';x.fillText('Time '+time,15,25);raf=requestAnimationFrame(loop)}loop();
                });
            } else if(game.engine==='orbit'){
                canvasGame('←/→ rotate shield • Block 20 incoming orbs', (c,x)=>{
                    let ang=0,orbs=[],score=0,frame=0;
                    function loop(){if(dead)return;frame++;if(keys['arrowleft']||keys['a'])ang-=.06;if(keys['arrowright']||keys['d'])ang+=.06;if(frame%45===0){let a=Math.random()*Math.PI*2;orbs.push({a,r:430})}orbs.forEach(o=>o.r-=3.2);for(let i=orbs.length-1;i>=0;i--){let o=orbs[i],diff=Math.atan2(Math.sin(o.a-ang),Math.cos(o.a-ang));if(o.r<105&&Math.abs(diff)<.42){orbs.splice(i,1);score++;continue}if(o.r<25)return finish('CORE HIT','Blocked '+score+' orbs.')}if(score>=20)return finish('ORBIT SECURE','20 blocks.');
                        x.fillStyle='#020304';x.fillRect(0,0,900,506);let cx=450,cy=253;x.strokeStyle='#26353d';x.beginPath();x.arc(cx,cy,100,0,Math.PI*2);x.stroke();x.strokeStyle='#6cc5ef';x.lineWidth=10;x.beginPath();x.arc(cx,cy,100,ang-.42,ang+.42);x.stroke();x.fillStyle='#e1a15e';orbs.forEach(o=>{x.beginPath();x.arc(cx+Math.cos(o.a)*o.r,cy+Math.sin(o.a)*o.r,8,0,Math.PI*2);x.fill()});x.fillStyle='#82929b';x.fillText('Blocked '+score+'/20',15,25);raf=requestAnimationFrame(loop)}loop();
                });
            } else if(game.engine==='colorswitch'){
                help.textContent='Match the word to the displayed color';let score=0,round=0,colors=[['BLUE','#4aa3df'],['ORANGE','#e3a34b'],['GREEN','#5ec27a'],['PURPLE','#c46fd6']];
                function next(){if(round>=12)return finish('COMPLETE','Score '+score+'/12');let target=colors[Math.floor(Math.random()*4)],opts=[...colors].sort(()=>Math.random()-.5);body.innerHTML=`<div class="mega-ui"><div class="mega-center"><h2 style="color:${target[1]}">MATCH THIS COLOR</h2><div class="mega-row">${opts.map(o=>`<button class="mega-btn" data-n="${o[0]}">${o[0]}</button>`).join('')}</div><p style="color:var(--muted);margin-top:12px">Round ${round+1}/12</p></div></div>`;body.querySelectorAll('.mega-btn').forEach(b=>b.onclick=()=>{if(b.dataset.n===target[0])score++;round++;next()})}next();
            } else if(game.engine==='gravity'){
                canvasGame('Space flips gravity • Reach 20 gates', (c,x)=>{
                    let y=250,vy=0,g=.35,obs=[],score=0,frame=0;const flip=()=>g*=-1;on(c,'click',flip);on(window,'keydown',e=>{if(e.code==='Space')flip()});
                    function loop(){if(dead)return;frame++;vy+=g;y+=vy;if(y<15||y>491){y=Math.max(15,Math.min(491,y));vy=0}if(frame%85===0)obs.push({x:900,gap:100+Math.random()*300,passed:false});obs.forEach(o=>o.x-=4.5);obs=obs.filter(o=>o.x>-60);for(const o of obs){if(!o.passed&&o.x<160){o.passed=true;score++}if(o.x<170&&o.x+45>140&&Math.abs(y-o.gap)>75)return finish('CRASH','Gates '+score)}if(score>=20)return finish('GRAVITY MASTER','20 gates.');
                        x.fillStyle='#020304';x.fillRect(0,0,900,506);x.fillStyle='#344a55';obs.forEach(o=>{x.fillRect(o.x,0,45,o.gap-75);x.fillRect(o.x,o.gap+75,45,506)});x.fillStyle='#6cc5ef';x.fillRect(140,y-12,24,24);x.fillStyle='#82929b';x.fillText('Gates '+score+'/20',15,25);raf=requestAnimationFrame(loop)}loop();
                });
            } else if(game.engine==='slide'){
                help.textContent='Arrange 1–8 in order';let arr=[1,2,3,4,5,6,7,8,0];for(let k=0;k<80;k++){let z=arr.indexOf(0),r=Math.floor(z/3),c=z%3,m=[];if(r)m.push(z-3);if(r<2)m.push(z+3);if(c)m.push(z-1);if(c<2)m.push(z+1);let j=m[Math.floor(Math.random()*m.length)];[arr[z],arr[j]]=[arr[j],arr[z]]}
                function render(){body.innerHTML=`<div class="mega-ui"><div class="mega-center"><h2>Tile Slide</h2><div class="mega-grid" style="grid-template-columns:repeat(3,74px)">${arr.map((v,i)=>`<button class="slidecell ${v===0?'empty':''}" data-i="${i}">${v||''}</button>`).join('')}</div></div></div>`;body.querySelectorAll('.slidecell').forEach(b=>b.onclick=()=>{let i=+b.dataset.i,z=arr.indexOf(0),r=Math.floor(i/3),c=i%3,zr=Math.floor(z/3),zc=z%3;if(Math.abs(r-zr)+Math.abs(c-zc)!==1)return;[arr[i],arr[z]]=[arr[z],arr[i]];if(arr.join(',')==='1,2,3,4,5,6,7,8,0')return finish('SOLVED','Puzzle complete.');render()})}render();
            } else if(game.engine==='scramble'){
                help.textContent='Unscramble 8 arcade words';const words=['ARCADE','PIXEL','LASER','ROCKET','SIGNAL','VECTOR','ORBIT','TURBO','SCREEN','SCORE'];let round=0,score=0;
                function next(){if(round>=8)return finish('WORD MASTER','Score '+score+'/8');let w=words[Math.floor(Math.random()*words.length)],s=w.split('').sort(()=>Math.random()-.5).join('');if(s===w)s=w.slice(1)+w[0];body.innerHTML=`<div class="mega-ui"><div class="mega-center"><h2>Word Scramble</h2><div class="scramble-word">${s}</div><div class="mega-row"><input class="mega-input" id="wi"><button class="mega-btn primary" id="wb">SUBMIT</button></div><p style="color:var(--muted);margin-top:10px">Round ${round+1}/8</p></div></div>`;let inp=body.querySelector('#wi');const go=()=>{if(inp.value.trim().toUpperCase()===w)score++;round++;next()};body.querySelector('#wb').onclick=go;inp.onkeydown=e=>{if(e.key==='Enter')go()};inp.focus()}next();
            } else if(game.engine==='pairs'){
                help.textContent='Match all 8 pairs';let vals=[1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8].sort(()=>Math.random()-.5),open=[],matched=new Set(),lock=false;
                function render(){body.innerHTML=`<div class="mega-ui"><div class="mega-center"><h2>Memory Pairs</h2><div class="mega-grid" style="grid-template-columns:repeat(4,70px)">${vals.map((v,i)=>`<button class="paircell ${matched.has(i)||open.includes(i)?'open':''}" data-i="${i}">${matched.has(i)||open.includes(i)?v:'?'}</button>`).join('')}</div></div></div>`;body.querySelectorAll('.paircell').forEach(b=>b.onclick=()=>{let i=+b.dataset.i;if(lock||matched.has(i)||open.includes(i))return;open.push(i);render();if(open.length===2){lock=true;let[a,z]=open;if(vals[a]===vals[z]){matched.add(a);matched.add(z);open=[];lock=false;if(matched.size===16)return finish('ALL MATCHED','Perfect memory.');render()}else later(()=>{open=[];lock=false;render()},650)}})}render();
            }

            activeNativeCleanup=()=>{dead=true;timers.forEach(id=>{clearTimeout(id);clearInterval(id)});if(raf)cancelAnimationFrame(raf);listeners.forEach(f=>{try{f()}catch(e){}})};
        }


        function startUltraGame(host,game){
            stopNativeGame();
            let dead=false,raf=0,timers=[],listeners=[];
            const later=(f,m)=>{const id=setTimeout(()=>!dead&&f(),m);timers.push(id);return id};
            const every=(f,m)=>{const id=setInterval(()=>!dead&&f(),m);timers.push(id);return id};
            const on=(o,e,f)=>{o.addEventListener(e,f);listeners.push(()=>o.removeEventListener(e,f))};
            host.innerHTML=`<div class="ultra-shell"><div class="ultra-panel"><div class="ultra-head"><div><div class="ultra-kicker">NITROARCADE ORIGINAL</div><div class="ultra-title">${game.name}</div></div><div class="ultra-help" id="uhelp"></div></div><div id="ubody"></div></div></div>`;
            const body=host.querySelector('#ubody'),help=host.querySelector('#uhelp');
            function finish(t,m){body.innerHTML=`<div class="ultra-ui"><div class="ultra-center"><h2>${t}</h2><p style="color:var(--muted);margin:10px 0 16px">${m}</p><button class="ultra-btn primary" id="uagain">PLAY AGAIN</button></div></div>`;body.querySelector('#uagain').onclick=()=>startUltraGame(host,game)}
            function canvas(setup){body.innerHTML='<canvas class="ultra-canvas" width="900" height="506"></canvas>';let c=body.querySelector('canvas');setup(c,c.getContext('2d'))}
            const keys={};on(window,'keydown',e=>keys[e.key.toLowerCase()]=true);on(window,'keyup',e=>keys[e.key.toLowerCase()]=false);

            if(game.engine==='catch'||game.engine==='avoid'){
                help.textContent='A/D or ←/→';
                canvas((c,x)=>{let px=430,objs=[],score=0,frame=0;
                    function loop(){if(dead)return;frame++;if(keys['a']||keys['arrowleft'])px-=6;if(keys['d']||keys['arrowright'])px+=6;px=Math.max(10,Math.min(830,px));if(frame%42===0)objs.push({x:Math.random()*860,y:-30});objs.forEach(o=>o.y+=game.speed);for(let i=objs.length-1;i>=0;i--){let o=objs[i];if(o.y>420&&o.y<490&&o.x+26>px&&o.x<px+60){objs.splice(i,1);if(game.engine==='avoid')return finish('CRASH','Score '+score);score++;if(score>=game.goal)return finish('COMPLETE','Score '+score)}else if(o.y>520){objs.splice(i,1);if(game.engine==='avoid'){score++;if(score>=game.goal)return finish('SURVIVED','Dodged '+score)}}}
                    x.fillStyle='#020304';x.fillRect(0,0,900,506);x.fillStyle='#6cc5ef';x.fillRect(px,455,60,18);x.fillStyle=game.engine==='avoid'?'#d85e5e':'#e1a15e';objs.forEach(o=>{x.beginPath();x.arc(o.x,o.y,13,0,Math.PI*2);x.fill()});x.fillStyle='#82929b';x.font='16px sans-serif';x.fillText('Score '+score+'/'+game.goal,15,25);raf=requestAnimationFrame(loop)}loop();
                });
            } else if(game.engine==='breakout'){
                help.textContent='Move paddle with A/D or arrows';
                canvas((c,x)=>{let px=380,bx=450,by=350,vx=4.2,vy=-4.2,br=[];for(let r=0;r<game.rows;r++)for(let q=0;q<10;q++)br.push({x:75+q*76,y:50+r*34,alive:true});
                    function loop(){if(dead)return;if(keys['a']||keys['arrowleft'])px-=6;if(keys['d']||keys['arrowright'])px+=6;px=Math.max(0,Math.min(740,px));bx+=vx;by+=vy;if(bx<8||bx>892)vx*=-1;if(by<8)vy*=-1;if(by>440&&by<470&&bx>px&&bx<px+160&&vy>0)vy*=-1;for(const b of br)if(b.alive&&bx>b.x&&bx<b.x+66&&by>b.y&&by<b.y+24){b.alive=false;vy*=-1;break}if(by>520)return finish('BALL LOST','Try again.');if(br.every(b=>!b.alive))return finish('CLEARED','All bricks destroyed.');
                    x.fillStyle='#020304';x.fillRect(0,0,900,506);x.fillStyle='#344a55';br.forEach(b=>{if(b.alive)x.fillRect(b.x,b.y,66,24)});x.fillStyle='#dfe8ed';x.fillRect(px,465,160,14);x.fillStyle='#6cc5ef';x.beginPath();x.arc(bx,by,9,0,Math.PI*2);x.fill();raf=requestAnimationFrame(loop)}loop();
                });
            } else if(game.engine==='simon'){
                help.textContent='Repeat the sequence';
                const seq=Array.from({length:game.length},()=>Math.floor(Math.random()*4));let p=0,showing=true,i=0;
                body.innerHTML=`<div class="ultra-ui"><div class="ultra-center"><h2>Watch the signal</h2><p id="smsg" style="color:var(--muted)">Memorize...</p><div class="seq-grid">${[0,1,2,3].map(n=>`<button class="seq-pad seq${n}" data-i="${n}"></button>`).join('')}</div></div></div>`;
                const pads=[...body.querySelectorAll('.seq-pad')];function show(){if(i>=seq.length){showing=false;body.querySelector('#smsg').textContent='Your turn';return}let q=pads[seq[i]];q.classList.add('flash');later(()=>q.classList.remove('flash'),300);i++;later(show,580)}later(show,600);
                pads.forEach(q=>q.onclick=()=>{if(showing)return;if(+q.dataset.i!==seq[p])return finish('WRONG SIGNAL','Sequence missed.');p++;if(p===seq.length)finish('PERFECT','Sequence complete.')});
            } else if(game.engine==='aim'){
                help.textContent='Click every target';
                let hits=0;body.innerHTML='<div class="ultra-ui" id="aimarena" style="position:relative"></div>';let a=body.querySelector('#aimarena'),t=document.createElement('button');t.style.cssText=`position:absolute;width:${game.size}px;height:${game.size}px;border-radius:50%;border:0;background:#6cc5ef;cursor:pointer`;a.appendChild(t);
                const move=()=>{let r=a.getBoundingClientRect();t.style.left=(10+Math.random()*Math.max(20,r.width-game.size-20))+'px';t.style.top=(10+Math.random()*Math.max(20,r.height-game.size-20))+'px'};t.onclick=()=>{hits++;if(hits>=game.hits)return finish('BULLSEYE','Hits '+hits);move()};move();
            } else if(game.engine==='anagram'){
                const words=['ARCADE','PIXEL','LASER','ROCKET','SIGNAL','VECTOR','ORBIT','TURBO','SCREEN','SCORE','PLAYER','BUTTON'];let r=0,score=0;
                function next(){if(r>=game.rounds)return finish('DONE','Score '+score+'/'+game.rounds);let w=words[Math.floor(Math.random()*words.length)],s=w.split('').sort(()=>Math.random()-.5).join('');if(s===w)s=w.slice(1)+w[0];body.innerHTML=`<div class="ultra-ui"><div class="ultra-center"><h2>Unscramble</h2><div class="ultra-big">${s}</div><div class="ultra-row"><input class="ultra-input" id="ain"><button class="ultra-btn primary" id="ab">SUBMIT</button></div><div class="ultra-stat">Round ${r+1}/${game.rounds}</div></div></div>`;let inp=body.querySelector('#ain');const go=()=>{if(inp.value.trim().toUpperCase()===w)score++;r++;next()};body.querySelector('#ab').onclick=go;inp.onkeydown=e=>{if(e.key==='Enter')go()};inp.focus()}next();
            } else if(game.engine==='math2'){
                let r=0,score=0,ans=0;
                function next(){if(r>=game.rounds)return finish('MATH COMPLETE','Score '+score+'/'+game.rounds);let a=2+Math.floor(Math.random()*18),b=2+Math.floor(Math.random()*12),op=game.mode;if(op==='mixed')op=['add','sub','mul'][Math.floor(Math.random()*3)];let q='';if(op==='add'){ans=a+b;q=`${a} + ${b}`}if(op==='sub'){let hi=Math.max(a,b),lo=Math.min(a,b);ans=hi-lo;q=`${hi} − ${lo}`}if(op==='mul'){a=2+Math.floor(Math.random()*10);b=2+Math.floor(Math.random()*10);ans=a*b;q=`${a} × ${b}`}body.innerHTML=`<div class="ultra-ui"><div class="ultra-center"><h2>${q}</h2><div class="ultra-row"><input class="ultra-input" type="number" id="min"><button class="ultra-btn primary" id="mb">ENTER</button></div><div class="ultra-stat">Round ${r+1}/${game.rounds}</div></div></div>`;let inp=body.querySelector('#min');const go=()=>{if(+inp.value===ans)score++;r++;next()};body.querySelector('#mb').onclick=go;inp.onkeydown=e=>{if(e.key==='Enter')go()};inp.focus()}next();
            } else if(game.engine==='path'){
                const n=game.size;let pos=0,goal=n*n-1,blocked=new Set();while(blocked.size<Math.floor(n*n*.18)){let z=Math.floor(Math.random()*n*n);if(z!==0&&z!==goal)blocked.add(z)}
                function render(){body.innerHTML=`<div class="ultra-ui"><div class="ultra-center"><h2>Reach the goal</h2><p style="color:var(--muted)">Move one square at a time. Avoid dark blocked cells.</p><div class="path-grid" style="grid-template-columns:repeat(${n},48px)">${Array.from({length:n*n},(_,i)=>`<button class="path-cell ${i===pos?'active':''} ${i===goal?'goal':''}" data-i="${i}" ${blocked.has(i)?'disabled':''}>${i===goal?'★':''}</button>`).join('')}</div></div></div>`;body.querySelectorAll('.path-cell:not(:disabled)').forEach(b=>b.onclick=()=>{let i=+b.dataset.i,r=Math.floor(i/n),c=i%n,pr=Math.floor(pos/n),pc=pos%n;if(Math.abs(r-pr)+Math.abs(c-pc)!==1)return;pos=i;if(pos===goal)return finish('PATH FOUND','Goal reached.');render()})}render();
            } else if(game.engine==='rhythm'){
                const interval=60000/game.bpm;let beat=0,hits=0,start=performance.now()+1200;help.textContent=`Tap on the beat • ${game.bpm} BPM`;
                body.innerHTML=`<div class="ultra-ui"><div class="ultra-center"><h2>Follow the pulse</h2><div class="ultra-big" id="pulse">●</div><button class="ultra-btn primary" id="tap">TAP</button><div class="ultra-stat" id="rstat">0 / ${game.beats}</div></div></div>`;
                const pulse=body.querySelector('#pulse');function tick(){if(beat>=game.beats)return later(()=>finish('RHYTHM COMPLETE','Accurate taps '+hits+'/'+game.beats),500);pulse.style.transform='scale(1.5)';later(()=>pulse.style.transform='scale(1)',140);beat++;later(tick,interval)}later(tick,1200);
                body.querySelector('#tap').onclick=()=>{let now=performance.now(),nearest=start+Math.round((now-start)/interval)*interval;if(Math.abs(now-nearest)<180)hits++;body.querySelector('#rstat').textContent=hits+' accurate taps'};
            } else if(game.engine==='lane2'){
                help.textContent='A/D or ←/→ • Avoid traffic';
                canvas((c,x)=>{let lane=1,obs=[],score=0,frame=0,lock=false;const move=e=>{if(lock)return;if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')lane=Math.max(0,lane-1);if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')lane=Math.min(2,lane+1);lock=true;later(()=>lock=false,100)};on(window,'keydown',move);
                    function loop(){if(dead)return;frame++;if(frame%Math.max(28,65-game.speed*5)===0)obs.push({lane:Math.floor(Math.random()*3),y:-70});obs.forEach(o=>o.y+=game.speed);for(let i=obs.length-1;i>=0;i--){let o=obs[i];if(o.lane===lane&&o.y>385&&o.y<485)return finish('CRASH','Distance '+score);if(o.y>520){obs.splice(i,1);score++;if(score>=game.goal)return finish('FINISH','Distance '+score)}}x.fillStyle='#020304';x.fillRect(0,0,900,506);x.fillStyle='#202b31';x.fillRect(250,0,400,506);x.strokeStyle='#60727d';x.setLineDash([20,20]);for(let l=1;l<3;l++){x.beginPath();x.moveTo(250+l*133,0);x.lineTo(250+l*133,506);x.stroke()}x.setLineDash([]);x.fillStyle='#6cc5ef';x.fillRect(285+lane*133,420,62,70);x.fillStyle='#d65f5f';obs.forEach(o=>x.fillRect(285+o.lane*133,o.y,62,70));x.fillStyle='#82929b';x.fillText('Distance '+score+'/'+game.goal,15,25);raf=requestAnimationFrame(loop)}loop();
                });
            }

            activeNativeCleanup=()=>{dead=true;timers.forEach(id=>{clearTimeout(id);clearInterval(id)});if(raf)cancelAnimationFrame(raf);listeners.forEach(f=>{try{f()}catch(e){}})};
        }



        function startVisualizer(host,game){
            stopNativeGame();
            let dead=false,raf=0;
            host.innerHTML=`<div class="premium-shell"><div class="premium-panel">
                <div class="premium-head"><div><div class="challenge-kicker">NITROARCADE VISUALIZER</div>
                <div class="premium-title">${game.name}</div></div>
                <div class="premium-help">Move your mouse to influence the scene</div></div>
                <canvas class="premium-canvas" width="900" height="506"></canvas></div></div>`;
            const c=host.querySelector('canvas'),x=c.getContext('2d');
            let mx=450,my=253,t=0;
            const move=e=>{const r=c.getBoundingClientRect();mx=(e.clientX-r.left)*900/r.width;my=(e.clientY-r.top)*506/r.height};
            c.addEventListener('pointermove',move);

            function loop(){
                if(dead)return;t+=.016;
                x.fillStyle='#020405';x.fillRect(0,0,900,506);

                if(game.visualizer==='cube'){
                    const cx=450,cy=250,size=115;
                    const verts=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
                    const ay=t+(mx/900-.5)*2, ax=.55+(my/506-.5);
                    const pts=verts.map(([a,b,d])=>{
                        let X=a*Math.cos(ay)-d*Math.sin(ay),Z=a*Math.sin(ay)+d*Math.cos(ay);
                        let Y=b*Math.cos(ax)-Z*Math.sin(ax);Z=b*Math.sin(ax)+Z*Math.cos(ax);
                        let s=310/(Z*45+360);return [cx+X*size*s,cy+Y*size*s];
                    });
                    const edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
                    x.strokeStyle='#6cc5ef';x.lineWidth=2;
                    edges.forEach(([a,b])=>{x.beginPath();x.moveTo(...pts[a]);x.lineTo(...pts[b]);x.stroke()});
                } else if(game.visualizer==='orbit'){
                    for(let ring=0;ring<6;ring++){
                        x.strokeStyle=`rgba(108,197,239,${.12+ring*.05})`;x.beginPath();
                        x.ellipse(450,253,110+ring*48,35+ring*17,(mx/900-.5)*.7,0,Math.PI*2);x.stroke();
                        let a=t*(1+ring*.13)+ring;
                        let px=450+Math.cos(a)*(110+ring*48),py=253+Math.sin(a)*(35+ring*17);
                        x.fillStyle=ring%2?'#7896a4':'#6cc5ef';x.beginPath();x.arc(px,py,5+ring*.7,0,Math.PI*2);x.fill();
                    }
                    x.fillStyle='#d9edf5';x.beginPath();x.arc(450,253,13,0,Math.PI*2);x.fill();
                } else {
                    const bars=42,w=14,gap=6,total=bars*(w+gap),start=(900-total)/2;
                    for(let i=0;i<bars;i++){
                        let h=35+Math.abs(Math.sin(t*3+i*.42+mx/180))*180*(.45+my/700);
                        x.fillStyle=i%5===0?'#6cc5ef':'#365867';
                        x.fillRect(start+i*(w+gap),253-h/2,w,h);
                    }
                    x.strokeStyle='rgba(108,197,239,.18)';
                    for(let j=0;j<8;j++){x.beginPath();x.moveTo(0,80+j*50);x.lineTo(900,80+j*50);x.stroke()}
                }
                raf=requestAnimationFrame(loop);
            }
            loop();
            activeNativeCleanup=()=>{dead=true;c.removeEventListener('pointermove',move);if(raf)cancelAnimationFrame(raf)};
        }

        function startPremiumGame(host,game){
            stopNativeGame();let dead=false,raf=0,timers=[],listeners=[];
            const on=(o,e,f)=>{o.addEventListener(e,f);listeners.push(()=>o.removeEventListener(e,f))};
            host.innerHTML=`<div class="premium-shell"><div class="premium-panel"><div class="premium-head"><div><div class="challenge-kicker">NITROARCADE ORIGINAL</div><div class="premium-title">${game.name}</div></div><div class="premium-help" id="phelp"></div></div><div id="pbody"></div></div></div>`;
            const body=host.querySelector('#pbody'),help=host.querySelector('#phelp');
            const finish=(title,msg,prize=1)=>{awardPrizes(prize,game.name);body.innerHTML=`<div class="premium-ui"><div><h2>${title}</h2><p style="color:var(--muted);margin:10px 0 16px">${msg}</p><button class="btn primary" id="pagain">PLAY AGAIN</button></div></div>`;body.querySelector('#pagain').onclick=()=>startPremiumGame(host,game)};
            const canvas=(fn)=>{body.innerHTML='<canvas class="premium-canvas" width="900" height="506"></canvas>';let c=body.querySelector('canvas');fn(c,c.getContext('2d'))};

            if(game.engine==='golf'){
                help.textContent='Drag backwards from the ball to aim • Release to shoot';
                canvas((c,x)=>{let holes=[{ball:[120,390],cup:[770,105],walls:[[310,80,30,280],[530,150,30,300]]},{ball:[110,120],cup:[790,390],walls:[[250,220,400,28],[430,60,28,160]]},{ball:[100,400],cup:[800,100],walls:[[180,300,520,25],[680,110,25,215]]}],hi=0,ball={},vx=0,vy=0,strokes=0,drag=null;
                    const load=()=>{let h=holes[hi];ball={x:h.ball[0],y:h.ball[1]};vx=vy=0;strokes=0};load();
                    on(c,'pointerdown',e=>{if(Math.hypot(vx,vy)>.2)return;let r=c.getBoundingClientRect(),mx=(e.clientX-r.left)*900/r.width,my=(e.clientY-r.top)*506/r.height;if(Math.hypot(mx-ball.x,my-ball.y)<35)drag={x:mx,y:my}});
                    on(c,'pointermove',e=>{if(!drag)return;let r=c.getBoundingClientRect();drag.ex=(e.clientX-r.left)*900/r.width;drag.ey=(e.clientY-r.top)*506/r.height});
                    on(c,'pointerup',()=>{if(!drag)return;let ex=drag.ex??drag.x,ey=drag.ey??drag.y;vx=Math.max(-12,Math.min(12,(drag.x-ex)*.09));vy=Math.max(-12,Math.min(12,(drag.y-ey)*.09));strokes++;drag=null});
                    function loop(){if(dead)return;let h=holes[hi];ball.x+=vx;ball.y+=vy;vx*=.985;vy*=.985;if(Math.abs(vx)<.03)vx=0;if(Math.abs(vy)<.03)vy=0;if(ball.x<12||ball.x>888){vx*=-.82;ball.x=Math.max(12,Math.min(888,ball.x))}if(ball.y<12||ball.y>494){vy*=-.82;ball.y=Math.max(12,Math.min(494,ball.y))}
                        h.walls.forEach(w=>{let [wx,wy,ww,wh]=w;if(ball.x+10>wx&&ball.x-10<wx+ww&&ball.y+10>wy&&ball.y-10<wy+wh){let dl=Math.abs(ball.x-(wx-10)),dr=Math.abs(ball.x-(wx+ww+10)),dt=Math.abs(ball.y-(wy-10)),db=Math.abs(ball.y-(wy+wh+10));if(Math.min(dl,dr)<Math.min(dt,db))vx*=-.85;else vy*=-.85;ball.x+=vx*2;ball.y+=vy*2}});
                        if(Math.hypot(ball.x-h.cup[0],ball.y-h.cup[1])<15&&Math.hypot(vx,vy)<3){hi++;if(hi>=holes.length)return finish('COURSE COMPLETE',`3 holes cleared. Final hole: ${strokes} strokes.`,5);load()}
                        x.fillStyle='#07100c';x.fillRect(0,0,900,506);x.fillStyle='#13261b';for(let q=0;q<18;q++)x.fillRect(q*55,0,27,506);x.fillStyle='#33434a';h.walls.forEach(w=>x.fillRect(...w));x.fillStyle='#050708';x.beginPath();x.arc(h.cup[0],h.cup[1],13,0,Math.PI*2);x.fill();x.strokeStyle='#e1a15e';x.beginPath();x.moveTo(h.cup[0],h.cup[1]);x.lineTo(h.cup[0],h.cup[1]-48);x.stroke();x.fillStyle='#e8eef1';x.beginPath();x.arc(ball.x,ball.y,10,0,Math.PI*2);x.fill();if(drag){x.strokeStyle='#6cc5ef';x.beginPath();x.moveTo(ball.x,ball.y);x.lineTo(drag.ex??drag.x,drag.ey??drag.y);x.stroke()}x.fillStyle='#a7b4bb';x.font='16px sans-serif';x.fillText(`Hole ${hi+1}/3 • Strokes ${strokes}`,15,26);raf=requestAnimationFrame(loop)}loop();
                });
            } else if(game.engine==='blockgrid'){
                help.textContent='Choose a shape, then click the grid to place it • Clear rows/columns';
                let board=Array.from({length:8},()=>Array(8).fill(0)),score=0,selected=0;
                const shapes=[[[0,0],[1,0],[2,0]],[[0,0],[0,1],[1,1]],[[0,0],[1,0],[0,1],[1,1]],[[0,0],[0,1],[0,2]],[[0,0],[1,0],[1,1]]];
                function render(){body.innerHTML=`<div class="premium-ui"><div><h2>Score ${score}</h2><div class="block-board">${board.flatMap((row,r)=>row.map((v,c)=>`<button class="block-cell ${v?'on':''}" data-r="${r}" data-c="${c}"></button>`)).join('')}</div><div class="block-shapes">${shapes.slice(0,3).map((s,i)=>`<button class="shape-btn" data-s="${i}">${i===0?'▰▰▰':i===1?'▰<br>▰▰':'▰▰<br>▰▰'}</button>`).join('')}</div><p style="color:var(--muted);margin-top:10px">Selected shape ${selected+1}</p></div></div>`;body.querySelectorAll('.shape-btn').forEach(b=>b.onclick=()=>{selected=+b.dataset.s;render()});body.querySelectorAll('.block-cell').forEach(cell=>cell.onclick=()=>place(+cell.dataset.r,+cell.dataset.c))}
                function place(r,c){let s=shapes[selected];if(!s.every(([dx,dy])=>r+dy<8&&c+dx<8&&!board[r+dy][c+dx]))return;s.forEach(([dx,dy])=>board[r+dy][c+dx]=1);score+=s.length;let rows=[],cols=[];for(let i=0;i<8;i++){if(board[i].every(Boolean))rows.push(i);if(board.every(row=>row[i]))cols.push(i)}rows.forEach(r=>board[r].fill(0));cols.forEach(c=>board.forEach(row=>row[c]=0));score+=(rows.length+cols.length)*20;selected=Math.floor(Math.random()*3);if(score>=150)return finish('BLOCK MASTER',`Score ${score}`,4);render()}render();
            } else if(game.engine==='merge'){
                help.textContent='Move with mouse • Click to drop • Merge matching baby animals';
                canvas((c,x)=>{const animals=['🐣','🐰','🐱','🐶','🐼','🦊','🦁'];let objs=[],dropX=450,next=0,score=0,cool=false;
                    on(c,'pointermove',e=>{let r=c.getBoundingClientRect();dropX=Math.max(40,Math.min(860,(e.clientX-r.left)*900/r.width))});
                    on(c,'pointerdown',()=>{if(cool)return;objs.push({x:dropX,y:35,vx:0,vy:0,r:24+next*3,l:next});next=Math.random()<.7?0:1;cool=true;setTimeout(()=>cool=false,250)});
                    function loop(){if(dead)return;for(let o of objs){o.vy+=.24;o.x+=o.vx;o.y+=o.vy;if(o.y+o.r>490){o.y=490-o.r;o.vy*=-.25;o.vx*=.9}if(o.x-o.r<20||o.x+o.r>880){o.vx*=-.5;o.x=Math.max(20+o.r,Math.min(880-o.r,o.x))}}
                        outer:for(let i=0;i<objs.length;i++)for(let j=i+1;j<objs.length;j++){let a=objs[i],b=objs[j],d=Math.hypot(a.x-b.x,a.y-b.y),min=a.r+b.r;if(d<min){if(a.l===b.l&&a.l<animals.length-1){let nl=a.l+1,n={x:(a.x+b.x)/2,y:(a.y+b.y)/2,vx:0,vy:-2,r:24+nl*3,l:nl};objs.splice(j,1);objs.splice(i,1,n);score+=(nl+1)*10;break outer}else{let nx=(a.x-b.x)/(d||1),ny=(a.y-b.y)/(d||1),push=(min-d)*.5;a.x+=nx*push;b.x-=nx*push;a.y+=ny*push;b.y-=ny*push}}}
                        if(objs.some(o=>o.y-o.r<55&&Math.abs(o.vy)<.5)&&objs.length>8)return finish('BOX FULL',`Merge score ${score}`,Math.max(1,Math.floor(score/100)));
                        x.fillStyle='#020304';x.fillRect(0,0,900,506);x.strokeStyle='#34444c';x.strokeRect(20,55,860,435);x.font='34px "Segoe UI Emoji",sans-serif';x.textAlign='center';objs.forEach(o=>{x.beginPath();x.fillStyle='#17232a';x.arc(o.x,o.y,o.r,0,Math.PI*2);x.fill();x.fillText(animals[o.l],o.x,o.y+12)});x.textAlign='left';x.fillStyle='#82929b';x.font='16px sans-serif';x.fillText('Score '+score,15,25);x.textAlign='center';x.fillText('Next '+animals[next],dropX,28);x.textAlign='left';raf=requestAnimationFrame(loop)}loop();
                });
            } else if(game.engine==='balllab'){
                help.textContent='Click to launch balls • Hit all 5 targets';
                canvas((c,x)=>{let balls=[],targets=[{x:760,y:90,hit:false},{x:670,y:190,hit:false},{x:790,y:300,hit:false},{x:590,y:390,hit:false},{x:430,y:130,hit:false}],aim={x:600,y:200};
                    on(c,'pointermove',e=>{let r=c.getBoundingClientRect();aim.x=(e.clientX-r.left)*900/r.width;aim.y=(e.clientY-r.top)*506/r.height});
                    on(c,'pointerdown',()=>{let dx=aim.x-100,dy=aim.y-400,d=Math.hypot(dx,dy)||1;balls.push({x:100,y:400,vx:dx/d*10,vy:dy/d*10})});
                    function loop(){if(dead)return;for(let b of balls){b.vy+=.25;b.x+=b.vx;b.y+=b.vy;if(b.x<10||b.x>890)b.vx*=-.82;if(b.y<10||b.y>496)b.vy*=-.82;b.x=Math.max(10,Math.min(890,b.x));b.y=Math.max(10,Math.min(496,b.y));targets.forEach(t=>{if(!t.hit&&Math.hypot(b.x-t.x,b.y-t.y)<28)t.hit=true})}balls=balls.filter(b=>Math.abs(b.vx)+Math.abs(b.vy)>.25);if(targets.every(t=>t.hit))return finish('PHYSICS MASTER','All five targets hit.',5);
                        x.fillStyle='#020304';x.fillRect(0,0,900,506);x.fillStyle='#26353c';x.fillRect(300,310,180,18);x.fillRect(520,230,160,18);x.fillStyle='#e1a15e';targets.forEach(t=>{if(!t.hit){x.beginPath();x.arc(t.x,t.y,18,0,Math.PI*2);x.fill()}});x.fillStyle='#6cc5ef';balls.forEach(b=>{x.beginPath();x.arc(b.x,b.y,10,0,Math.PI*2);x.fill()});x.strokeStyle='#5c7784';x.beginPath();x.moveTo(100,400);x.lineTo(aim.x,aim.y);x.stroke();x.fillStyle='#82929b';x.fillText('Targets '+targets.filter(t=>t.hit).length+'/5',15,25);raf=requestAnimationFrame(loop)}loop();
                });
            }
            activeNativeCleanup=()=>{dead=true;timers.forEach(clearTimeout);if(raf)cancelAnimationFrame(raf);listeners.forEach(f=>{try{f()}catch(e){}})};
        }

        function startNitroTechQuiz(host,game){
            stopNativeGame();
            const bank=[
              ['What does CPU stand for?',['Central Processing Unit','Computer Power Utility','Central Program User','Core Processing Upload'],0,'CPU means Central Processing Unit.'],
              ['Which language primarily styles web pages?',['Python','CSS','SQL','C++'],1,'CSS controls the visual presentation of web pages.'],
              ['What does RAM mainly provide?',['Temporary working memory','Permanent file storage','Internet access','Graphics output'],0,'RAM holds data and programs currently being used.'],
              ['Which technology gives a web page its basic structure?',['HTML','Bluetooth','PNG','BIOS'],0,'HTML describes page structure and content.'],
              ['Which device is normally used for long-term storage?',['SSD','RAM','CPU cache','Register'],0,'An SSD keeps data when power is off.'],
              ['What is phishing?',['A trick to steal sensitive information','A CPU cooling method','Video compression','A Wi-Fi booster'],0,'Phishing uses deceptive messages or sites to obtain sensitive information.'],
              ['What is an algorithm?',['A step-by-step procedure','A type of monitor','A network cable','A file extension'],0,'An algorithm is a defined sequence of steps for a task or problem.'],
              ['Which is an operating system?',['Linux','HTML','JPEG','USB'],0,'Linux is an operating-system family.'],
              ['What does URL stand for?',['Uniform Resource Locator','Universal Router Link','User Resource Login','Unified Runtime Language'],0,'URL means Uniform Resource Locator.'],
              ['Which component commonly renders 3D graphics?',['GPU','Keyboard','SSD','Router'],0,'GPUs are designed for highly parallel graphics processing.'],
              ['Machine learning mainly involves what?',['Learning patterns from data','Physically repairing computers','Connecting displays','Formatting passwords'],0,'Machine-learning models learn patterns from data.'],
              ['Binary uses which digits?',['0 and 1','1 and 2','0 and 9','2 and 8'],0,'Binary is base 2 and uses 0 and 1.'],
              ['Which is a database query language?',['SQL','CSS','SVG','MP3'],0,'SQL is widely used with relational databases.'],
              ['What does DNS help find?',['An IP address for a domain','Battery percentage','CPU temperature','Screen resolution'],0,'DNS resolves domain names to network information such as IP addresses.'],
              ['JavaScript in a browser is commonly used for what?',['Interactive page behavior','Cooling the CPU','Replacing the monitor','Charging a battery'],0,'JavaScript commonly provides logic and interaction on web pages.']
            ];
            let qs=bank.slice().sort(()=>Math.random()-.5).slice(0,10),idx=0,score=0,locked=false;
            host.innerHTML='<div class="techq"><div class="techq-panel" id="techqPanel"></div></div>';
            const panel=host.querySelector('#techqPanel');
            function draw(){
              locked=false; const q=qs[idx];
              panel.innerHTML=`<div class="techq-top"><div><div class="techq-kicker">NITROARCADE // TECH QUIZ</div><b>QUESTION ${idx+1} / ${qs.length}</b></div><div class="techq-score">SCORE ${score}</div></div><div class="techq-progress"><i style="width:${(idx/qs.length)*100}%"></i></div><div class="techq-question">${q[0]}</div><div class="techq-options"></div><div class="techq-feedback" id="tqFeed">Choose the best answer.</div><button class="techq-next" id="tqNext" hidden>${idx===qs.length-1?'RESULTS':'NEXT QUESTION'} →</button>`;
              const opts=panel.querySelector('.techq-options');
              q[1].forEach((label,n)=>{const b=document.createElement('button');b.className='techq-option';b.textContent=label;b.onclick=()=>answer(n,b);opts.appendChild(b)});
              panel.querySelector('#tqNext').onclick=()=>{idx++;if(idx>=qs.length)finish();else draw()};
            }
            function answer(n,b){if(locked)return;locked=true;const q=qs[idx],buttons=[...panel.querySelectorAll('.techq-option')];buttons[q[2]].classList.add('good');if(n===q[2]){score+=100;b.classList.add('good')}else b.classList.add('bad');buttons.forEach(x=>x.disabled=true);panel.querySelector('#tqFeed').textContent=(n===q[2]?'✓ +100 — ':'✕ ')+q[3];panel.querySelector('#tqNext').hidden=false}
            function finish(){const pct=Math.round(score/(qs.length*100)*100);try{if(score>=800&&window.NitroArcade?.game?.win)window.NitroArcade.game.win(score,{coins:Math.max(1,Math.floor(score/200))})}catch(e){}panel.innerHTML=`<div class="techq-result"><div class="techq-kicker">QUIZ COMPLETE</div><strong>${pct}%</strong><h2>${score} / ${qs.length*100} POINTS</h2><p>${pct>=80?'Excellent tech knowledge.':pct>=60?'Solid run — a few topics left to master.':'Good start — try another randomized round.'}</p><button class="techq-next" id="tqAgain">PLAY AGAIN</button></div>`;panel.querySelector('#tqAgain').onclick=()=>startNitroTechQuiz(host,game)}
            activeNativeCleanup=()=>{}; draw();
        }

        function returnToDashboard() {
            cleanupPlayer();
            gameView.style.display = 'none';
            dashboardView.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function toggleFullscreen() {
            const target = playerContainer;

            if (!document.fullscreenElement) {
                if (target.requestFullscreen) {
                    target.requestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        }

        function scrollToFeatured() {
            document.getElementById('featuredSection').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        function openLogin() {
            loginModal.style.display = 'flex';
        }

        function closeLogin() {
            loginModal.style.display = 'none';
        }

        async function handleLogin() {
            return window.NitroOnline?.login();
        }

        function openAbout() {
            aboutModal.style.display = 'flex';
        }

        function closeAbout() {
            aboutModal.style.display = 'none';
        }


        function toggleThemeMenu() {
            document.getElementById('themeMenu').classList.toggle('show');
        }

        function setTheme(theme) {
            const themes = ['light', 'blue', 'ruffle', 'neon', 'sunset', 'matrix'];

            for (const name of themes) {
                document.body.classList.remove('theme-' + name);
            }

            if (themes.includes(theme)) {
                document.body.classList.add('theme-' + theme);
            }

            localStorage.setItem('crazyarcade-theme', theme);

            const buttons = document.querySelectorAll('.theme-option');
            for (const button of buttons) {
                if (button.dataset.theme === theme) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            }

            document.getElementById('themeButton').textContent = '✦ Style';
            document.getElementById('themeMenu').classList.remove('show');
        }

        const savedTheme = localStorage.getItem('crazyarcade-theme') || 'dark';
        setTheme(savedTheme);

        document.addEventListener('click', (e) => {
            const picker = document.querySelector('.theme-picker');
            if (picker && !picker.contains(e.target)) {
                document.getElementById('themeMenu').classList.remove('show');
            }
        });


        addMegaGameCards();
        addUltraGameCards();
        addNovaGameCards();
        addSpecialOriginalCards();
        document.querySelectorAll('#gameGrid .game-card[data-arcade-part="big"]').forEach(card=>{
          if(!card.querySelector('.big-game-badge')){
            const badge=document.createElement('div');badge.className='big-game-badge';badge.textContent='BIG GAME';
            badge.style.cssText='position:absolute;right:10px;top:10px;z-index:3;padding:5px 8px;border-radius:999px;background:var(--accent);color:#071018;font:900 9px Inter,sans-serif;letter-spacing:1px';
            card.style.position='relative';card.appendChild(badge);
          }
        });
        setTimeout(()=>showArcadePart('small'),0);
        const ultraPartSearch=document.getElementById('gameSearch');
        if(ultraPartSearch)ultraPartSearch.addEventListener('input',()=>setTimeout(()=>{
          document.querySelectorAll('#gameGrid .game-card').forEach(card=>{
            const cp=card.dataset.arcadePart||(card.dataset.gameId==='hackerchallenge'?'challenge':'small');
            if(cp!==currentArcadePart)card.style.display='none';
          });
        },0));
        addPremiumCards();
        upgradeSmallGameCards();
        addCustomArtToEveryGame();
        setTimeout(addCustomArtToEveryGame, 0);
        setTimeout(addCustomArtToEveryGame, 120);
        updatePrizeCounter();
        document.getElementById('aboutBack')?.addEventListener('click', closeAboutPage);

        const aboutNavButton=document.getElementById('aboutBtn');
        if(aboutNavButton){
            const cleanAbout=aboutNavButton.cloneNode(true);
            aboutNavButton.replaceWith(cleanAbout);
            cleanAbout.addEventListener('click',openAboutPage);
        }

        featureHackerCard();

        document.querySelectorAll('[data-removed-game-id="windosill"]').forEach(el=>el.remove());

        updateFavoriteUI();
        updatePlayCounts();
        renderRecent();
        filterGames();

        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) closeLogin();
        });

        aboutModal.addEventListener('click', (e) => {
            if (e.target === aboutModal) closeAbout();
        });
    

        
        const ULTRA_THEMES=['dark','light','blue','ruffle','neon','sunset','matrix'];
        function applyUltraTheme(theme){
            if(!ULTRA_THEMES.includes(theme)) theme='dark';
            ULTRA_THEMES.forEach(t=>document.body.classList.remove('theme-'+t));
            if(theme!=='dark') document.body.classList.add('theme-'+theme);
            localStorage.setItem('ultraarcade-theme',theme);
            localStorage.setItem('crazyarcade-theme',theme);
            document.querySelectorAll('.theme-option').forEach(btn=>{
                btn.classList.toggle('active',btn.dataset.theme===theme);
            });
            const menu=document.getElementById('themeMenu');
            if(menu) menu.classList.remove('show');
        }
        document.querySelectorAll('.theme-option').forEach(btn=>{
            btn.onclick=(e)=>{
                e.preventDefault();
                e.stopPropagation();
                applyUltraTheme(btn.dataset.theme);
            };
        });
        const savedUltraTheme=localStorage.getItem('ultraarcade-theme')||localStorage.getItem('crazyarcade-theme')||'dark';
        applyUltraTheme(savedUltraTheme);



        
        const ULTRA_MUSIC_KEY='ultraarcade-bgm-enabled';
        function ultraBgmEl(){ return document.getElementById('ultraBgm'); }
        function updateUltraBgmUI(){
            const a=ultraBgmEl(), on=!!a && !a.paused;
            const label=document.getElementById('musicLabel');
            const btn=document.getElementById('musicToggle');
            if(label) label.textContent=on?'BGM ON':'BGM OFF';
            if(btn) btn.classList.toggle('on',on);
        }
        async function toggleUltraBgm(){
            const a=ultraBgmEl();
            if(!a){ showToast?.('BGM file not found'); return; }
            a.loop=true; a.volume=.32;
            if(a.paused){
                try{
                    await a.play();
                    localStorage.setItem(ULTRA_MUSIC_KEY,'1');
                }catch(err){
                    localStorage.setItem(ULTRA_MUSIC_KEY,'0');
                    if(typeof showToast==='function') showToast('Click BGM again to start music');
                }
            }else{
                a.pause();
                localStorage.setItem(ULTRA_MUSIC_KEY,'0');
            }
            updateUltraBgmUI();
        }
        document.addEventListener('DOMContentLoaded',()=>{
            const a=ultraBgmEl();
            if(a){ a.loop=true; a.volume=.32; a.addEventListener('play',updateUltraBgmUI); a.addEventListener('pause',updateUltraBgmUI); }
            updateUltraBgmUI();
            if(localStorage.getItem(ULTRA_MUSIC_KEY)==='1'){
                const resume=async()=>{
                    try{ await a?.play(); }catch(e){}
                    updateUltraBgmUI();
                    document.removeEventListener('pointerdown',resume);
                    document.removeEventListener('keydown',resume);
                };
                document.addEventListener('pointerdown',resume,{once:true});
                document.addEventListener('keydown',resume,{once:true});
            }
        });


        document.addEventListener('DOMContentLoaded',()=>{
            setupToyShop();
            if(typeof updatePrizeCounter==='function') updatePrizeCounter();
        });


        function forceCloseToyShop(e){
            if(e){ e.preventDefault(); e.stopPropagation(); }
            const shop=document.getElementById('toyShop');
            if(!shop) return false;
            shop.classList.remove('show','active','open');
            shop.style.cssText += ';display:none !important;visibility:hidden !important;pointer-events:none !important;';
            document.body.style.overflow='';
            return false;
        }
        document.addEventListener('keydown',function(e){
            if(e.key==='Escape') forceCloseToyShop(e);
        });

