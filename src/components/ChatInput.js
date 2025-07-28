import React, { useState } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  padding: 15px 20px;
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.03);
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 12px 18px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  color: #333;
  background-color: #f9fafb;
  
  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #4353ff;
    background-color: #ffffff;
    box-shadow: 0 0 0 2px rgba(67, 83, 255, 0.2);
  }
`;

const SendButton = styled.button`
  background-color: #4353ff;
  color: white;
  border: none;
  border-radius: 8px;
  margin-left: 10px;
  padding: 0 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 500;
  height: 48px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #3a49e0;
  }
  
  &:disabled {
    background-color: #c7cdeb;
    cursor: not-allowed;
  }
`;

const Spinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid white;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ExamplesContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 0px 20px 10px;
  background-color: #ffffff;
`;

const ExampleButton = styled.button`
  background-color: #f0f2f5;
  color: #4353ff;
  border: 1px solid #d1d5db;
  border-radius: 15px;
  padding: 6px 12px;
  margin-right: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  &:hover {
    background-color: #e9eafd;
    border-color: #adb5bd;
  }
`;

// 添加方块样式组件
const StopSquare = styled.div`
  width: 12px;
  height: 12px;
  background-color: white;
  position: absolute;
`;

// 修改 StopButton 样式
const StopButton = styled(SendButton)`
  background-color: #4353ff;
  position: relative;
  
  &:hover {
    background-color: #3a49e0;
  }
`;

// 修改 ChatInput 组件
const ChatInput = ({ onSendMessage, isLoading, onStopGeneration, inputMessage, setInputMessage }) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <>
      <InputContainer as="form" onSubmit={handleSubmit}>
        <StyledInput
          type="text"
          placeholder="Ask me your question"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={isLoading}
        />
        {isLoading ? (
          <div style={{ display: 'flex' }}>
            <StopButton type="button">
              <Spinner />
            </StopButton>
            <StopButton type="button" onClick={onStopGeneration}>
              <StopSquare />
            </StopButton>
          </div>
        ) : (
          <SendButton type="submit" disabled={!inputMessage.trim()}>
            Submit
          </SendButton>
        )}
        {/* <SendButton type="submit" disabled={!inputMessage.trim() || isLoading}>
            Submit
        </SendButton> */}
      </InputContainer>
      {/* <ExamplesContainer>
        <ExampleButton onClick={() => handleExampleClick('Hello')}>Hello</ExampleButton>
        <ExampleButton onClick={() => handleExampleClick('Who are you?')}>Who are you?</ExampleButton>
        <ExampleButton onClick={() => handleExampleClick('What is SSDR?')}>What is SSDR?</ExampleButton>
      </ExamplesContainer> */}
    </>
  );
};

export default ChatInput;
