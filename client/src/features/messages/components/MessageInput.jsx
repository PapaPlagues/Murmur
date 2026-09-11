import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Image, SendHorizontal } from "lucide-react";
import { useState } from "react";

const MessageInput = ({ onSend }) => {
  const [content, setContent] = useState("");

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <div className="flex items-center border-t border-border p-4">
      <InputGroup className="mx-auto p-7">
        <InputGroupInput placeholder="Add Message..." onChange={handleChange} />
      </InputGroup>

      <Button className="ml-2 h-15 w-15" variant="outline" size="icon">
        <Image className="size-8" />
      </Button>
      <Button
        className="ml-2 h-15 w-15"
        variant="outline"
        size="icon"
        onClick={() => onSend(content)}
      >
        <SendHorizontal className="size-8" />
      </Button>
    </div>
  );
};

export default MessageInput;
