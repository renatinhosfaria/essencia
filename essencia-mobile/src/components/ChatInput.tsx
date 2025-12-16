import { useScaledFont } from "@/hooks/useScaledFont";
import { Send } from "@tamagui/lucide-icons";
import { useState } from "react";
import { Button, Input, XStack } from "tamagui";

interface ChatInputProps {
  onSend: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onTyping,
  disabled,
  placeholder = "Digite sua mensagem...",
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textSize = useScaledFont(3);

  const handleChangeText = (text: string) => {
    setMessage(text);

    // Notificar typing
    const nowTyping = text.length > 0;
    if (nowTyping !== isTyping) {
      setIsTyping(nowTyping);
      onTyping?.(nowTyping);
    }
  };

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setMessage("");
    setIsTyping(false);
    onTyping?.(false);
  };

  return (
    <XStack
      ai="center"
      gap="$2"
      p="$3"
      bg="white"
      borderTopWidth={1}
      borderTopColor="$borderColor"
    >
      <Input
        f={1}
        size="$4"
        placeholder={placeholder}
        value={message}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSend}
        disabled={disabled}
        fontSize={textSize}
        bg="$background"
        borderColor="$borderColor"
        focusStyle={{
          borderColor: "$primary",
        }}
        multiline
        maxHeight={100}
      />
      <Button
        size="$4"
        circular
        bg={message.trim() ? "$primary" : "$backgroundHover"}
        disabled={disabled || !message.trim()}
        onPress={handleSend}
        pressStyle={{ scale: 0.95 }}
        animation="quick"
      >
        <Send size={20} color={message.trim() ? "white" : "$color"} />
      </Button>
    </XStack>
  );
}
