import axios from "axios";

export const removeFromFavorite = async (trackId: string | number) => {
  const userData = JSON.parse(localStorage.getItem("user-data") || "");
  console.log(trackId);
  await axios.post(
    `https://zvuk-ponosa.glitch.me/api/tracks/favorite/remove/uid=${userData.uid}/token=${userData.token}/track-ids=${trackId}`
  );
};
