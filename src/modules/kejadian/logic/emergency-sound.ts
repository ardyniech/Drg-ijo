let audioCtx: AudioContext | null = null;
let isMuted = false;

export function playEmergencyChime() {
  if (isMuted || typeof window === "undefined") return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    // Dual tone alert: 880Hz (A5) then 659Hz (E5)
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(659, now + 0.15);
    osc.frequency.setValueAtTime(880, now + 0.3);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  } catch {
    // AudioContext blocked by autoplay policy
  }
}

export function setEmergencyMuted(muted: boolean) {
  isMuted = muted;
}

export function getEmergencyMuted(): boolean {
  return isMuted;
}
