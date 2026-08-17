export interface PausableVerseAudio {
  pause: () => void;
}

let activePlayer: PausableVerseAudio | null = null;
let interruptedPlayers = new WeakSet<PausableVerseAudio>();

export function activateVerseAudio(player: PausableVerseAudio) {
  if (activePlayer && activePlayer !== player) {
    activePlayer.pause();
    interruptedPlayers.add(activePlayer);
  }
  activePlayer = player;
}

export function shouldRestartVerseAudio(player: PausableVerseAudio) {
  const shouldRestart = interruptedPlayers.has(player);
  interruptedPlayers.delete(player);
  return shouldRestart;
}

export function stopVerseAudio(player: PausableVerseAudio) {
  player.pause();
  interruptedPlayers.delete(player);
  if (activePlayer === player) {
    activePlayer = null;
  }
}

export function releaseVerseAudio(player: PausableVerseAudio) {
  interruptedPlayers.delete(player);
  if (activePlayer === player) {
    activePlayer = null;
  }
}

export function resetVerseAudioSessionForTests() {
  activePlayer = null;
  interruptedPlayers = new WeakSet<PausableVerseAudio>();
}
