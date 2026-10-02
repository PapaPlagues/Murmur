const handleResponse = async (res) => {
  const data = await res.json();

  if (!res.ok) {
    const errorMsg =
      data?.error ||
      data?.message ||
      `HTTP ${res.status}: Something went wrong.`;

    const error = new Error(errorMsg);
    error.status = res.status;
    throw error;
  }

  return data;
};

// POST login
export const login = async (formData) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });

  return handleResponse(response);
};

export const guestLogin = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/guest`, {
    method: "POST",
    credentials: "include",
  });

  return handleResponse(response);
};

// GET user
export const getCurrentUser = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
    credentials: "include",
  });

  return handleResponse(response);
};

// Logout user
export const logout = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  return handleResponse(response);
};
