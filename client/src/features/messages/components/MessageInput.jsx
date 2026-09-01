import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const MessageInput = () => {
  return (
    <div className="border-t border-border p-4">
      <InputGroup className="mx-auto p-7">
        <InputGroupInput placeholder="Add Message..." />
      </InputGroup>
    </div>
  );
};

export default MessageInput;
