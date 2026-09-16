const handleResponse = async (res) => {
  const data = await res.json();

  if (!res.ok) {
    const errorMsg = data?.error || `HTTP ${res.status}: Something went wrong.`;

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
};

// Update user
export const updateUser = async (formData) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });

  return handleResponse(response);
};

// Update avatar
export const updateAvatar = async (file) => {
  const formData = new FormData();

  formData.append("avatar", file);

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/users/me/avatar`, {
      method: "PATCH",
      credentials: "include",
      body: formData,
    }
  );

  return handleResponse(response);
}

// get user
export const getUser = async (userId) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/users/${userId}`,
    {
      credentials: "include",
    },
  );

  return handleResponse(response);
};

// update user online status
export const sendHeartbeat = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/users/heartbeat`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  return handleResponse(response);
}