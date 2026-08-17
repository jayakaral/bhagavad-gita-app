export interface PausableVerseAudio {
  pause: () => void;
}

let activePlayer: PausableVerseAudio | null = null;

export function activateVerseAudio(player: PausableVerseAudio) {
  if (activePlayer && activePlayer !== player) {
    activePlayer.pause();
  }
  activePlayer = player;
}

export function stopVerseAudio(player: PausableVerseAudio) {
  player.pause();
  if (activePlayer === player) {
    activePlayer = null;
  }
}

export function releaseVerseAudio(player: PausableVerseAudio) {
  if (activePlayer === player) {
    activePlayer = null;
  }
}

export function resetVerseAudioSessionForTests() {
  activePlayer = null;
}
