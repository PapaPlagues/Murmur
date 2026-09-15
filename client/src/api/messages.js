const handleResponse = async (res) => {
  const data = await res.json();

  if (!res.ok) {
    const errorMsg = data?.error || `HTTP ${res.status}: Something went wrong.`;

    throw new Error(errorMsg);
  }

  return data;
};

// get messages
export const getMessages = async (conversationId) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/conversations/${conversationId}/messages`,
    {
      credentials: "include",
    },
  );

  return handleResponse(response);
};

// post message
export const createMessage = async (conversationId, { content, fileImage }) => {
  const formData = new FormData();

  if (content?.trim()) {
    formData.append("content", content.trim());
  }

  if (fileImage) {
    formData.append("image", fileImage);
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );

  return handleResponse(response);
};