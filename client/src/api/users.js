const handleResponse = async (res) => {
  const data = await res.json();

  if (!res.ok) {
    const errorMsg =
      data?.error || `HTTP ${res.status}: Something went wroong.`;

    throw new Error(errorMsg);
  }

  return data;
};

// GET users
export const getUsers = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/`, {
        credentials: "include",
    });

    return handleResponse(response);
}

// Update user

// get user
export const getUser = async (userId) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        credentials: "include",
    });

    return handleResponse(response);
}