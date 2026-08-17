import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  activateVerseAudio,
  resetVerseAudioSessionForTests,
  stopVerseAudio,
} from "../lib/verse-audio-session";

describe("verse audio session", () => {
  beforeEach(() => {
    resetVerseAudioSessionForTests();
  });

  it("pauses the active narration before a different narration starts", () => {
    const sanskritPlayer = { pause: vi.fn() };
    const translationPlayer = { pause: vi.fn() };

    activateVerseAudio(sanskritPlayer);
    activateVerseAudio(translationPlayer);

    expect(sanskritPlayer.pause).toHaveBeenCalledTimes(1);
    expect(translationPlayer.pause).not.toHaveBeenCalled();
  });

  it("clears a player after it is paused so it is not paused again", () => {
    const player = { pause: vi.fn() };
    const nextPlayer = { pause: vi.fn() };

    activateVerseAudio(player);
    stopVerseAudio(player);
    activateVerseAudio(nextPlayer);

    expect(player.pause).toHaveBeenCalledTimes(1);
  });
});
