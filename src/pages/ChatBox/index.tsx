import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatProps } from './types';
import MessageItem from './MessageItem';
import './index.css';

const ChatBox: React.FC<ChatProps> = ({
  onSendMessage,
  placeholder = "请输入您的问题...",
  maxHeight = "600px",
  className = ""
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '您好！我是AI助手，有什么可以帮助您的吗？',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 自动调整输入框高度
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 添加加载消息
      const loadingMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '',
        role: 'assistant',
        timestamp: new Date(),
        isLoading: true
      };
      setMessages(prev => [...prev, loadingMessage]);

      // 调用外部API或默认响应
      const response = onSendMessage 
        ? await onSendMessage(userMessage.content)
        : `收到您的消息："${userMessage.content}"，这是一个默认回复。`;

      // 移除加载消息并添加实际回复
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        const aiMessage: Message = {
          id: Date.now().toString(),
          content: response,
          role: 'assistant',
          timestamp: new Date()
        };
        return [...filtered, aiMessage];
      });

    } catch (error) {
      console.error('发送消息失败:', error);
      // 移除加载消息并添加错误消息
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: '抱歉，发生了错误，请稍后重试。',
          role: 'assistant',
          timestamp: new Date()
        };
        return [...filtered, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      content: '聊天记录已清空。有什么可以帮助您的吗？',
      role: 'assistant',
      timestamp: new Date()
    }]);
  };

  return (
    <div className={`chat-box ${className}`} style={{ maxHeight }}>
      {/* 聊天头部 */}
      <div className="chat-header">
        <h3>AI助手</h3>
        <button 
          className="clear-btn"
          onClick={clearChat}
          title="清空聊天记录"
        >
          🗑️
        </button>
      </div>

      {/* 消息列表 */}
      <div className="messages-container">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className="message-input"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="send-button"
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;