const BASE_URL = import.meta.env.VITE_SERVER;

export const createTransaction = async (transactionData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/transactions`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(transactionData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Transaction failed");
    }
    return data;
  } catch (error) {
    console.error("Create Transaction Error:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getTransactions = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

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
