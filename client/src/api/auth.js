const handleResponse = async (res) => {
  const data = await res.json();

  if (!res.ok) {
    const errorMsg =
      data?.message || `HTTP ${res.status}: Something went wrong.`;

    throw new Error(errorMsg);
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
