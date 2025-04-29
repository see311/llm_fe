import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSend } from 'react-icons/fi';

const InputContainer = styled.div`
  display: flex;
  padding: 12px;
  background-color: #fff;
  border-top: 1px solid #e5e5e5;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  
  &:focus {
    border-color: #4a7dff;
  }
`;

const SendButton = styled.button`
  background-color: #4a7dff;
  color: white;
  border: none;
  border-radius: 8px;
  margin-left: 8px;
  padding: 0 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #3a6ae8;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <InputContainer as="form" onSubmit={handleSubmit}>
      <StyledInput
        type="text"
        placeholder="Enter message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isLoading}
      />
      <SendButton type="submit" disabled={!message.trim() || isLoading}>
        <FiSend size={20} />
      </SendButton>
    </InputContainer>
  );
};

export default ChatInput;