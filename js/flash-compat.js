
(function () {
  "use strict";

  const loadedScripts = new Map();

  function loadScript(path) {
    if (loadedScripts.has(path)) return loadedScripts.get(path);

    const promise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = path;
      script.onload = resolve;
      script.onerror = () => reject(new Error("Missing file: " + path));
      document.head.appendChild(script);
    });

    loadedScripts.set(path, promise);
    return promise;
  }

  function decodeBase64(value) {
    const clean = value
      .replace(/^data:.*?;base64,/, "")
      .replace(/\s/g, "");

    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
  }

  async function play(game, container) {
    if (!game || !container) {
      throw new Error("Game or player container is missing");
    }

    await loadScript("FlashGames/bytes/" + game.file);

    const registry = window.NitroFlashBytes || {};
    const value =
      registry[game.id] ||
      registry[game.file] ||
      registry[game.file.replace(/\.js$/, "")];

    if (!value) {
      throw new Error("Base64 data not found for " + game.title);
    }

    const bytes = typeof value === "string"
      ? decodeBase64(value)
      : value;

    if (!window.RufflePlayer) {
      throw new Error("Ruffle is not loaded");
    }

    const player = window.RufflePlayer.newest().createPlayer();

    player.style.width = "100%";
    player.style.height = "100%";

    container.replaceChildren(player);

    await player.load({ data: bytes });

    return player;
  }

  window.NitroFlashCompat = {
    play,
    decodeBase64
  };
})();
