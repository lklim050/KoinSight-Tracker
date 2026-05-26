const BASE_URL = `${import.meta.env.VITE_SERVER}`;

// not in use, replaced by DB top 250 coins
export const fetchAssets = async () => {
  try {
    const response = await fetch(`${BASE_URL}/assets/read`);
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

export const fetchTransactions = async (
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMTQwOTY4MGFiNjkxZTU3NDFlN2E0ZSIsImlhdCI6MTc3OTgwNTc1OSwiZXhwIjoxNzgwNDEwNTU5fQ.HvA2UJS0rsDRcnbmFikmKXCn76mf7bTsyxp5nGd_koE",
) => {
  try {
    const response = await fetch(`${BASE_URL}/transactions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
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

export const fetchMyAssets = async (
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMTQwOTY4MGFiNjkxZTU3NDFlN2E0ZSIsImlhdCI6MTc3OTgwNTc1OSwiZXhwIjoxNzgwNDEwNTU5fQ.HvA2UJS0rsDRcnbmFikmKXCn76mf7bTsyxp5nGd_koE",
) => {
  try {
    const response = await fetch(`${BASE_URL}/assets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

export default BASE_URL;
