const authHeaders = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {};

const handleResponse = async (res) => {
  const data = await res.json();

  if (!res.ok) {
    const errorMsg =
      data?.message || `HTTP ${res.status}: Something went wroong.`;

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
    body: JSON.stringify(formData),
  });

  return handleResponse(response);
};

// GET user
export const getCurrentUser = async (token) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
    headers: authHeaders(token),
  });

  return handleResponse(response);
};
