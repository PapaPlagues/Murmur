const handleResponse = async (res) => {
  const data = await res.json();

  if (!res.ok) {
    const errorMsg =
      data?.message || `HTTP ${res.status}: Something went wrong.`;

    throw new Error(errorMsg);
  }

  return data;
};

// POST conversation
export const createConversation = async (formData) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/conversations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    },
  );

  return handleResponse(response);
};

// get conversations
export const getConversations = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/conversations`,
    {
      credentials: "include",
    },
  );

  return handleResponse(response);
};

// get conversation
export const getConversation = async (conversationId) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/conversations/${conversationId}`,
    {
      credentials: "include",
    },
  );

  return handleResponse(response);
};
