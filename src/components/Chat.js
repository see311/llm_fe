import React, { useState, useEffect, useRef } from 'react';
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
  const [sessionId, setSessionId] = useState('');
  const abortControllerRef = useRef(null); // 添加 AbortController 引用

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
    if (!sessionId || !message.trim()) return;

    // 添加用户消息到聊天历史
    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);

    // 创建一个空的 AI 响应消息
    const aiMessagePlaceholder = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, aiMessagePlaceholder]);

    setIsLoading(true);
    
    // 创建新的 AbortController
    abortControllerRef.current = new AbortController();

    try {
      // 处理流式响应
      let accumulatedResponse = "";
      await sendMessage(
        message, 
        sessionId, 
        (chunk) => {
          // 清理 chunk 数据
        console.log('chunk', chunk);
        const cleanedChunk = chunk.replace(/data:/g, '').replace(/\n\n/g, '');
        if (cleanedChunk === '[DONE]') { // 检查流结束标记
          return;
        }
          if (cleanedChunk) {
            try {
              // 尝试解析JSON，如果后端发送的是JSON对象
              //const parsedChunk = JSON.parse(chunk);
              //accumulatedResponse += parsedChunk.text || parsedChunk.content || '';
	      // 如果后端直接发送文本片段：
              accumulatedResponse += cleanedChunk;
            } catch (e) {
              // 如果不是JSON，直接累加文本
              accumulatedResponse += cleanedChunk;
            }
            
            // 更新消息显示
            setMessages(prev => {
              const newMessages = [...prev];
              if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
                newMessages[newMessages.length - 1].content = accumulatedResponse;
              }
              return newMessages;
            });
          }
        },
        abortControllerRef.current.signal // 传递中断信号
      );
    } catch (error) {
      console.error('Error in chat:', error);
      // 在消息中显示错误
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
          newMessages[newMessages.length - 1].content = 'Sorry, an error occurred while processing your request. Please try again later.';
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null; // 清除引用
    }
  };

  // 添加停止生成的处理函数
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      // 移除最后一条AI的空白消息
      setMessages(prev => {
        if (prev.length > 0 && prev[prev.length - 1].role === 'assistant' && prev[prev.length - 1].content === '') {
          return prev.slice(0, -1);
        }
        return prev;
      });
    }
  };

  const handleRetryMessage = async (messageContent) => {
    // 直接调用 handleSendMessage 来重新发送消息
    await handleSendMessage(messageContent);
  };

  return (
    <ChatContainer>
      <Header>
        <HeaderTitle>Standard Chatered</HeaderTitle>
      </Header>
      <ChatHistory messages={messages} onRetry={handleRetryMessage} />
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
        onStopGeneration={handleStopGeneration} // 添加停止生成的回调
      />
    </ChatContainer>
  );
};

export default Chat;
