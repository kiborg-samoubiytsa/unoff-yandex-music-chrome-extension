export const durationToMinutes = (duration: number) => {
  const parsedDuration = new Date(duration);
  const minutes = parsedDuration.getMinutes();
  const hours = parsedDuration.getHours();
  const seconds = parsedDuration.getSeconds();

  if (duration < 0) {
    return "0:00";
  } else if (seconds >= 10) {
    return `${minutes + (hours - 3) * 60}:${seconds}`;
  } else if (seconds < 10) {
    return `${minutes + (hours - 3) * 60}:0${seconds}`;
  }
};
