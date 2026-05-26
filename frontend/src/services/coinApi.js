const BASE_URL = import.meta.env.VITE_SERVER;

export const getTop250Coins = async () => {
  try {
    const response = await fetch(`${BASE_URL}/db/getTop250`);

    const data = await response.json();

    return data.show;
  } catch (error) {
    console.error(error);
  }
};
