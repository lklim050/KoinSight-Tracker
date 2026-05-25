const BASE_URL = import.meta.env.VITE_SERVER;

export const fetchCoins = async () => {
  try {
    const response = await fetch(`${BASE_URL}/assets`);

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);

    return [];
  }
};
