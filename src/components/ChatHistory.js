import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import ChatMessage from './ChatMessage';

const HistoryContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const ChatHistory = ({ messages }) => {
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
      <div ref={messagesEndRef} />
    </HistoryContainer>
  );
};

export default ChatHistory;