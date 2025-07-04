import React, { useState } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  padding: 15px 20px; /* 调整内边距 */
  background-color: #ffffff; /* 输入区域背景白色 */
  border-top: 1px solid #e0e0e0; /* 顶部边框线 */
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.03); /* 细微的顶部阴影 */
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 12px 18px; /* 调整输入框内边距 */
  border: 1px solid #d1d5db; /* 输入框边框颜色 */
  border-radius: 8px; /* 输入框圆角 */
  font-size: 15px;
  outline: none;
  color: #333;
  background-color: #f9fafb; /* 输入框背景色 */
  
  &::placeholder {
    color: #9ca3af; /* 占位符文字颜色 */
  }

  &:focus {
    border-color: #4353ff; /* 聚焦时边框颜色 */
    background-color: #ffffff;
    box-shadow: 0 0 0 2px rgba(67, 83, 255, 0.2); /* 聚焦时外发光效果 */
  }
`;

const SendButton = styled.button`
  background-color: #4353ff; /* 发送按钮背景色，类似图片中的紫色 */
  color: white;
  border: none;
  border-radius: 8px; /* 发送按钮圆角 */
  margin-left: 10px; /* 与输入框的间距 */
  padding: 0 20px; /* 调整按钮内边距 */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px; /* 按钮文字大小 */
  font-weight: 500;
  height: 48px; /* 按钮高度与输入框统一 */
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #3a49e0; /* 鼠标悬停时颜色加深 */
  }
  
  &:disabled {
    background-color: #c7cdeb; /* 禁用时颜色变浅 */
    cursor: not-allowed;
  }
`;

// 添加加载动画样式
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

// 新增样式组件用于示例问题
const ExamplesContainer = styled.div`
  display: flex;
  justify-content: flex-start; /* 图片中示例问题靠左 */
  padding: 0px 20px 10px; /* 调整内边距，使其在输入框下方 */
  background-color: #ffffff; /* 背景白色，与输入区域一致 */
`;

const ExampleButton = styled.button`
  background-color: #f0f2f5; /* 示例按钮背景色 */
  color: #4353ff; /* 示例按钮文字颜色 */
  border: 1px solid #d1d5db; /* 示例按钮边框 */
  border-radius: 15px; /* 示例按钮圆角 */
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
  background-color: #4353ff; /* 与Submit按钮颜色一致 */
  position: relative;
  
  &:hover {
    background-color: #3a49e0; /* 与Submit按钮悬停颜色一致 */
  }
`;

// 修改 ChatInput 组件
const ChatInput = ({ onSendMessage, isLoading, onStopGeneration }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleExampleClick = (exampleText) => {
    setMessage(exampleText); // 将示例问题填充到输入框
  };

  return (
    <>
      <InputContainer as="form" onSubmit={handleSubmit}>
        <StyledInput
          type="text"
          placeholder="Ask me your question"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading}
        />
        {isLoading ? (
          <StopButton type="button" /*onClick={onStopGeneration}*/>
            <Spinner />
            {/* <StopSquare /> */}
          </StopButton>
        ) : (
          <SendButton type="submit" disabled={!message.trim()}>
            Submit
          </SendButton>
        )}
        {/* <SendButton type="submit" disabled={!message.trim() || isLoading}>
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
