import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Image, SendHorizontal, X } from "lucide-react";
import { useState } from "react";

const MessageInput = ({ onSend }) => {
  const [content, setContent] = useState("");
  const [fileImage, setFileImage] = useState(null);

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    setFileImage(e.target.files[0] || null);
  };

  const removeImage = () => {
    setFileImage(null);
  };

  const handleSend = async () => {
    if (!content.trim() && !fileImage) return;

    await onSend(content, fileImage);

    setContent("");
    setFileImage(null);
  };

  return (
    <div className="border-t border-border p-4">
      {fileImage && (
        <div className="mb-3 flex items-center gap-3">
          <div className="relative">
            <img
              src={URL.createObjectURL(fileImage)}
              alt="Preview"
              className="h-20 w-20 rounded-md object-cover"
            />

            <button
              type="button"
              onClick={removeImage}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-background shadow hover:bg-muted"
              aria-label="Remove image"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center">
        <InputGroup className="mx-auto p-7">
          <InputGroupInput
            placeholder="Add Message..."
            value={content}
            onChange={handleChange}
          />
        </InputGroup>

        <label
          htmlFor="image"
          className="ml-2 flex h-15 w-15 cursor-pointer items-center justify-center rounded-md border hover:bg-muted"
        >
          <Image className="size-8" />

          <input
            id="image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>

        <Button
          className="ml-2 h-15 w-15"
          variant="outline"
          size="icon"
          onClick={handleSend}
        >
          <SendHorizontal className="size-8" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
