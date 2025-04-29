import React from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.isUser ? '#4a7dff' : '#10a37f'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
`;

const MessageContent = styled.div`
  background-color: ${props => props.isUser ? '#f0f4ff' : '#f7f7f8'};
  padding: 12px 16px;
  border-radius: 8px;
  max-width: 80%;
  white-space: pre-wrap;
`;

const ChatMessage = ({ message, isUser }) => {
  return (
    <MessageContainer>
      <Avatar isUser={isUser}>
        {isUser ? 'User' : 'AI'}
      </Avatar>
      <MessageContent isUser={isUser}>
        {message}
      </MessageContent>
    </MessageContainer>
  );
};

export default ChatMessage;