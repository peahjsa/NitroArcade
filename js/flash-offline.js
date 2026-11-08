
(function () {
  "use strict";

  const ROOT = "FlashGames/bytes/";
  const loaded = new Set();

  function decodeBase64(base64) {
    const clean = base64.replace(/^data:.*?;base64,/, "").replace(/\s/g, "");
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
  }

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.onload = resolve;
      script.onerror = () => reject(new Error("Cannot load " + url));
      document.head.appendChild(script);
    });
  }

  function findBytes(game) {
    const registry = window.NitroFlashBytes || {};

    const candidates = [
      registry[game.id],
      registry[game.file],
      registry[game.file.replace(/\.js$/, "")],
      window[game.id]
    ];

    for (const value of candidates) {
      if (typeof value === "string") {
        return decodeBase64(value);
      }

      if (value instanceof Uint8Array) {
        return value;
      }

      if (value instanceof ArrayBuffer) {
        return new Uint8Array(value);
      }
    }

    throw new Error(
      "Byte data not registered for " + game.title
    );
  }

  async function launch(gameId, container) {
    const game = window.NitroFlashGames.find(g => g.id === gameId);

    if (!game) throw new Error("Unknown Flash game: " + gameId);
    if (!container) throw new Error("Missing Flash player container");

    if (!loaded.has(game.id)) {
      await loadScript(ROOT + encodeURIComponent(game.file));
      loaded.add(game.id);
    }

    const bytes = findBytes(game);

    if (!window.RufflePlayer) {
      throw new Error("Local Ruffle is not loaded");
    }

    const ruffle = window.RufflePlayer.newest();
    const player = ruffle.createPlayer();

    player.style.width = "100%";
    player.style.height = "100%";

    container.replaceChildren(player);

    await player.load({ data: bytes });

    return player;
  }

  window.NitroOfflineFlash = {
    launch,
    decodeBase64
  };
})();
