export const playBuzzer = async () => {
  const playOnce = () => {
    return new Promise<void>((resolve, reject) => {
      const audio = new Audio("/buzzer.mp3");
      audio
        .play()
        .then(() => {
          audio.onended = () => resolve();
        })
        .catch((err) => {
          console.error("Audio play failed:", err);
          resolve();
        });
    });
  };

  // Play it 3 times sequentially
  for (let i = 0; i < 3; i++) {
    await playOnce();
  }
};
