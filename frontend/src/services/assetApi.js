const BASE_URL = import.meta.env.VITE_SERVER;

export const getMyAssets = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/assets`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch assets");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching assets:", error);
    throw error;
  }
};

export const getMyPortfolio = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/assets/all`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch assets");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching assets:", error);
    throw error;
  }
};
