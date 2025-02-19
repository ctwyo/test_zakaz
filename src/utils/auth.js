export const getAccessToken = async () => {
  let accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    const res = await fetch("/api/refresh", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();

    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      return data.accessToken;
    } else {
      localStorage.removeItem("accessToken");
      return null;
    }
  }

  return accessToken;
};
