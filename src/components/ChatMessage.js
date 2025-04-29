import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

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
  
  /* Markdown样式 */
  & pre {
    background-color: #f1f1f1;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
  }
  
  & code {
    background-color: #f1f1f1;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: monospace;
  }
  
  & blockquote {
    border-left: 4px solid #ddd;
    padding-left: 10px;
    margin-left: 0;
    color: #666;
  }
  
  & img {
    max-width: 100%;
  }
  
  & table {
    border-collapse: collapse;
    width: 100%;
  }
  
  & th, & td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  & th {
    background-color: #f2f2f2;
  }
`;

const ChatMessage = ({ message, isUser }) => {
  return (
    <MessageContainer>
      <Avatar isUser={isUser}>
        {isUser ? 'User' : 'AI'}
      </Avatar>
      <MessageContent isUser={isUser}>
        {isUser ? (
          message
        ) : (
          <ReactMarkdown>
            {message}
          </ReactMarkdown>
        )}
      </MessageContent>
    </MessageContainer>
  );
};

export default ChatMessage;