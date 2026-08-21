import AnimatedAIChat, { type AnimatedChatMessage } from "@/components/ui/animated-ai-chat";
import { sendChatMessage } from "../action/chatbot";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractAssistantContent(payload: unknown): string | null {
  if (typeof payload === "string") {
    const trimmed = payload.trim();
    if (!trimmed) return null;

    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        const parsed = JSON.parse(trimmed) as unknown;
        const parsedContent = extractAssistantContent(parsed);
        return parsedContent ?? trimmed;
      } catch {
        return trimmed;
      }
    }

    return trimmed;
  }

  if (!isRecord(payload)) return null;

  const completionContent = extractAssistantContent(payload.completion);
  if (completionContent) return completionContent;

  const responseContent = extractAssistantContent(payload.response);
  if (responseContent) return responseContent;

  if (Array.isArray(payload.choices) && payload.choices.length > 0) {
    const firstChoice = payload.choices[0];
    if (isRecord(firstChoice)) {
      const choiceContent =
        extractAssistantContent(firstChoice.message) ??
        extractAssistantContent(firstChoice.delta) ??
        extractAssistantContent(firstChoice.text);
      if (choiceContent) return choiceContent;
    }
  }

  const directContent = extractAssistantContent(payload.content);
  if (directContent) return directContent;

  const messageContent = extractAssistantContent(payload.message);
  if (messageContent) return messageContent;

  return null;
}

function mapHistoryForApi(history: AnimatedChatMessage[]) {
  return history.map(({ role, content }) => ({ role, content }));
}

const ChatBotPage = () => {
  const handleSendMessage = async (prompt: string, history: AnimatedChatMessage[]) => {
    const payload = {
      messages: mapHistoryForApi(history.length > 0 ? history : [{ id: Date.now(), role: "user", content: prompt }]),
    };

    const data = await sendChatMessage(payload);
    const content = extractAssistantContent(data);

    if (content) {
      return content;
    }

    return "Sorry, I'm having trouble responding right now. Please try again later.";
  };

  return <AnimatedAIChat onSendMessage={handleSendMessage} />;
};

export default ChatBotPage;
