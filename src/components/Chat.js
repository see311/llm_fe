import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatHistory from './ChatHistory'; // 确保路径正确
import ChatInput from './ChatInput';
import { sendMessage, getChatHistory, generateSessionId } from '../services/api';
import ReactMarkdown from 'react-markdown';
// 移除 logo 导入
// import logo from '../assets/standard-chartered-logo.png';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1000px; /* 可以根据需要调整最大宽度 */
  margin: 0 auto;
  background-color: #f7f8fc; /* 整体背景色，类似图片中的浅灰色 */
  color: #333; /* 默认文字颜色 */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; /* 更现代的字体 */
`;

const Header = styled.div`
  padding: 0 20px; /* 恢复左右内边距 */
  background: linear-gradient(to right, #009efd, #2af598);
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  /* 移除 justify-content: space-between; 因为现在只有一个元素 */
  height: 60px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #e0e0e0;
`;

// 移除 SCLogo 组件

// 移除 LogoContainer 组件

// 移除 TextContainer 组件

const HeaderTitle = styled.span`
  /* 标题文字样式 */
  font-size: 22px; /* 增大字体大小，从18px改为22px */
`;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [currentResponse, setCurrentResponse] = useState(''); // currentResponse 似乎未被使用，可以考虑移除
  const [sessionId, setSessionId] = useState('');

  // 初始化会话ID
  useEffect(() => {
    // 从localStorage获取现有的sessionId，如果没有则生成一个新的
    const existingSessionId = localStorage.getItem('chatSessionId');
    if (existingSessionId) {
      setSessionId(existingSessionId);
    } else {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      localStorage.setItem('chatSessionId', newSessionId);
    }
  }, []);

  // 加载聊天历史
  // useEffect(() => {
  //   if (!sessionId) return;

  //   const loadChatHistory = async () => {
  //     try {
  //       const history = await getChatHistory(sessionId);
  //       if (history && history.length > 0) {
  //         setMessages(history);
  //       }
  //     } catch (error) {
  //       console.error('Failed to load chat history:', error);
  //     }
  //   };

  //   loadChatHistory();
  // }, [sessionId]);

  const handleSendMessage = async (message) => {
    if (!sessionId || !message.trim()) return; // 增加对 message 空值的判断

    // 添加用户消息到聊天历史
    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);

    // 创建一个空的 AI 响应消息
    // setCurrentResponse(''); // currentResponse 似乎未被使用
    const aiMessagePlaceholder = { role: 'assistant', content: '' }; // 使用更明确的变量名
    setMessages(prev => [...prev, aiMessagePlaceholder]);

    setIsLoading(true);

    try {
      // 处理流式响应
      let accumulatedResponse = ""; // 用于累积流式响应片段
      await sendMessage(message, sessionId, (chunk) => {
        // 清理 chunk 数据
        console.log('chunk', chunk);
        const cleanedChunk = chunk.replace(/data:/g, '').replace(/\n\n/g, '');
        if (cleanedChunk === '[DONE]') { // 检查流结束标记
          return;
        }
        if (cleanedChunk) {
          try {
            // 尝试解析JSON，如果后端发送的是JSON对象片段
            // const parsedChunk = JSON.parse(cleanedChunk);
            // accumulatedResponse += parsedChunk.text || ''; // 假设有用 .text 字段
            // 如果后端直接发送文本片段：
            accumulatedResponse += cleanedChunk;
          } catch (e) {
            // 如果不是JSON，或者解析失败，直接累加文本
            accumulatedResponse += cleanedChunk;
          }
        }
        
        setMessages(prev => {
          const newMessages = [...prev];
          // 确保最后一个消息是助手的占位符或部分响应
          if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
            newMessages[newMessages.length - 1].content = accumulatedResponse;
          }
          return newMessages;
        });
      });
    } catch (error) {
      console.error('Error in chat:', error);
      // 在消息中显示错误
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
          newMessages[newMessages.length - 1].content = 'Sorry, an error occurred while processing your request. Please try again later.'; // 修改错误信息为英文
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryMessage = async (messageContent) => {
    // 直接调用 handleSendMessage 来重新发送消息
    await handleSendMessage(messageContent);
  };

  return (
    <ChatContainer>
      <Header>
        {/* 将Chatbot替换为Standard Chatered */}
        <HeaderTitle>Standard Chatered</HeaderTitle>
      </Header>
      <ChatHistory messages={messages} onRetry={handleRetryMessage} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </ChatContainer>
  );
};

export default Chat;
