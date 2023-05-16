export const validatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
  await chrome.runtime.sendMessage({ code: "request_token" });
  /* localStorage.setItem("user-data", JSON.stringify(response)) */
};
