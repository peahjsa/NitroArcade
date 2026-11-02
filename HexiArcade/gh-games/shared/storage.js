// localStorage can throw (private mode, blocked storage), so never let that break a game.
const PREFIX = 'gh-arcade:';
export function loadJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(PREFIX + key);
        return raw === null ? fallback : JSON.parse(raw);
    }
    catch {
        return fallback;
    }
}
export function saveJSON(key, value) {
    try {
        localStorage.setItem(PREFIX + key, JSON.stringify(value));
    }
    catch {
        /* storage unavailable; ignore */
    }
}
export function getHighScore(game) {
    return loadJSON(`${game}:highscore`, 0);
}
/** Saves the score if it beats the stored best. Returns true when a new record was set. */
export function submitHighScore(game, score) {
    if (score <= getHighScore(game))
        return false;
    saveJSON(`${game}:highscore`, score);
    return true;
}
