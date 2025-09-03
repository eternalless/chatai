export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    isLoading?: boolean;
  }
  
  export interface ChatProps {
    onSendMessage?: (message: string) => Promise<string>;
    placeholder?: string;
    maxHeight?: string;
    className?: string;
  }