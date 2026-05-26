const BASE_URL = `${import.meta.env.VITE_SERVER}`;

// export const fetchAssets = async () => {
//   try {
//     const response = await fetch(`${BASE_URL}/assets`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch assets");
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching assets:", error);
//     throw error;
//   }
// };

export const fetchTransactions = async (
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMTUwNWM0ZTg4MWFkZjQ3ODlhZDczNyIsImlhdCI6MTc3OTc2MjkzNCwiZXhwIjoxNzgwMzY3NzM0fQ.gKbDTfJgwArWTtVX09LXwSu3b5n2b8zj5cHiyiESeVY",
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

export const fetchMyAssets = async () => {
  try {
    const response = await fetch(`${BASE_URL}/transactions/myAssets`);
    if (!response.ok) throw new Error("Failed to fetch assets");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching assets:", error);
    throw error;
  }
};

export default BASE_URL;
