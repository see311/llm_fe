import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import ChatMessage from './ChatMessage';

const HistoryContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

// 添加打字动画效果
const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  margin-left: 52px;
  
  span {
    height: 8px;
    width: 8px;
    background-color: #10a37f;
    border-radius: 50%;
    display: inline-block;
    margin-right: 4px;
    opacity: 0.6;
    
    &:nth-child(1) {
      animation: pulse 1s infinite 0s;
    }
    
    &:nth-child(2) {
      animation: pulse 1s infinite 0.2s;
    }
    
    &:nth-child(3) {
      animation: pulse 1s infinite 0.4s;
    }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 0.6; }
  }
`;

const ChatHistory = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);
  
  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <HistoryContainer>
      {messages.map((msg, index) => (
        <ChatMessage
          key={index}
          message={msg.content}
          isUser={msg.role === 'user'}
        />
      ))}
      {isLoading && (
        <TypingIndicator>
          <span></span>
          <span></span>
          <span></span>
        </TypingIndicator>
      )}
      <div ref={messagesEndRef} />
    </HistoryContainer>
  );
};

export default ChatHistory;