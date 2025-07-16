export const playMatchSound = () => {
  const audio = new Audio('/sounds/match.mp3');
  audio.play().catch(() => {
    // 忽略用户未进行交互时的自动播放错误
  });
};

export const playFlipSound = () => {
  const audio = new Audio('/sounds/flip.mp3');
  audio.play().catch(() => {
    // 忽略用户未进行交互时的自动播放错误
  });
};

export const playSuccessSound = () => {
  const audio = new Audio('/sounds/success.mp3');
  audio.play().catch(() => {
    // 忽略用户未进行交互时的自动播放错误
  });
}; 