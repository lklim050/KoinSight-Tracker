const BASE_URL = import.meta.env.VITE_SERVER;

export const getTop250Coins = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/db/getTop250`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    return data.show;
  } catch (error) {
    console.error(error);
  }
};
