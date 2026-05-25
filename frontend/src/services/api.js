const BASE_URL = `${import.meta.env.VITE_SERVER}`;

export const fetchAssets = async () => {
  try {
    const response = await fetch(`${BASE_URL}/db/getTop250`);
    if (!response.ok) {
      throw new Error("Failed to fetch assets");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching assets:", error);
    throw error;
  }
};

export const fetchTransactions = async () => {
  try {
    const response = await fetch(`${BASE_URL}/transactions/seed`);
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export default BASE_URL;
