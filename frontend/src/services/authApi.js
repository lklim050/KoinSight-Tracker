const BASE_URL = `${import.meta.env.VITE_SERVER}/auth`;

export const loginUser = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  } catch (error) {
    console.error("Login Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

export const signupUser = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    return data;
  } catch (error) {
    console.error("Signup Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};
