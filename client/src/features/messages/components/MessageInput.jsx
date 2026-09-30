import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Image, LoaderCircle, SendHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MessageInput = ({ onSend }) => {
  const [content, setContent] = useState("");
  const [fileImage, setFileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const imagePreviewRef = useRef(null);

  useEffect(() => () => {
    if (imagePreviewRef.current) {
      URL.revokeObjectURL(imagePreviewRef.current);
    }
  }, []);

  const handleChange = (e) => {
    setContent(e.target.value);
    setSendError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const handleImageChange = (e) => {
    const nextFile = e.target.files[0] || null;
    if (imagePreviewRef.current) {
      URL.revokeObjectURL(imagePreviewRef.current);
    }
    imagePreviewRef.current = nextFile ? URL.createObjectURL(nextFile) : null;
    setFileImage(nextFile);
    setImagePreview(imagePreviewRef.current);
    setSendError("");
  };

  const removeImage = () => {
    if (imagePreviewRef.current) {
      URL.revokeObjectURL(imagePreviewRef.current);
      imagePreviewRef.current = null;
    }
    setFileImage(null);
    setImagePreview(null);
  };

  const handleSend = async () => {
    if (isSending || (!content.trim() && !fileImage)) return;

    setIsSending(true);
    setSendError("");

    try {
      await onSend(content, fileImage);
      setContent("");
      setFileImage(null);
      if (imagePreviewRef.current) {
        URL.revokeObjectURL(imagePreviewRef.current);
        imagePreviewRef.current = null;
      }
      setImagePreview(null);
    } catch (error) {
      setSendError(error.message || "Message could not be sent. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="border-t border-border p-4">
      {sendError && (
        <p role="alert" className="mb-3 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {sendError}
        </p>
      )}
      {fileImage && (
        <div className="mb-3 flex items-center gap-3">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-20 w-20 rounded-md object-cover"
            />

            <button
              type="button"
              onClick={removeImage}
              disabled={isSending}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-background shadow hover:bg-muted"
              aria-label="Remove image"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center">
        <InputGroup className="mx-auto p-2">
          <InputGroupInput
            placeholder="Add Message..."
            aria-label="Message"
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isSending}
          />
        </InputGroup>

        <label
          className={`ml-2 flex size-10 shrink-0 items-center justify-center rounded-md border border-border hover:bg-muted focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${isSending ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
          title="Attach image"
        >
          <input
            id="message-image"
            type="file"
            accept="image/*"
            className="sr-only"
            aria-label="Attach an image"
            onChange={handleImageChange}
            disabled={isSending}
          />
          <Image aria-hidden="true" className="size-5" />
        </label>

        <Button
          className="ml-2 size-10 shrink-0"
          variant="outline"
          size="icon"
          onClick={handleSend}
          disabled={isSending || (!content.trim() && !fileImage)}
          aria-label={isSending ? "Sending message" : "Send message"}
          title={isSending ? "Sending message" : "Send message"}
        >
          {isSending ? (
            <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
          ) : (
            <SendHorizontal aria-hidden="true" className="size-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
