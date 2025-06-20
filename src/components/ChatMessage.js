import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import aiAvatar from '../assets/ai-avatar.png';
import userAvatar from '../assets/user-avatar.png';

const MessageContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 12px;
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

const ChatMessage = ({ message, isUser, onWelcomeLinkClick }) => {
  const messageContent = isUser ? (
    message
  ) : (
    <ReactMarkdown
      allowDangerousHtml
      components={{
        a: ({ node, ...props }) => {
          if (props.href === '#ssdr-basic' || props.href === '#ssdr-sql') {
            return <a {...props} onClick={(e) => {
              e.preventDefault();
              onWelcomeLinkClick(props.href);
            }} style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline', display: 'block', marginBottom: '8px' }} />;
          }
          return <a {...props} target="_blank" rel="noopener noreferrer" />;
        }
      }}
    >
      {message}
    </ReactMarkdown>
  );

  return (
    <MessageContainer isUser={isUser}>
      {isUser ? (
        <>
          <MessageContent isUser={isUser}>{messageContent}</MessageContent>
          <Avatar src={userAvatar} alt="User" />
        </>
      ) : (
        <>
          <Avatar src={aiAvatar} alt="AI" />
          <MessageContent isUser={isUser}>{messageContent}</MessageContent>
        </>
      )}
    </MessageContainer>
  );
};

export default ChatMessage;
