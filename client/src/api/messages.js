const handleResponse = async (res) => {
  const data = await res.json();

  if (!res.ok) {
    const errorMsg =
      data?.error || `HTTP ${res.status}: Something went wrong.`;

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
}

export const getRecentMessage = async (conversationId) => {
    
}

// post message
export const createMessage = async (conversationId, formData) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/conversations/${conversationId}/messages`,
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
}