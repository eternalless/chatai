export type Message = {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    isLoading?: boolean;
  }
  
  export type ChatProps = {
    onSendMessage?: (message: string) => Promise<string>;
    placeholder?: string;
    maxHeight?: string;
    className?: string;
  }