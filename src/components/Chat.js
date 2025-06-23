import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ChatHistory from './ChatHistory'; // 确保路径正确
import ChatInput from './ChatInput';
import Header from './Header'; // 导入新的 Header 组件
import { sendMessage, getChatHistory, generateSessionId } from '../services/api';
import ReactMarkdown from 'react-markdown';

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

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('/langchain/api/v1/chat/ollama/stream/v3'); // 默认v3
  const [showWelcome, setShowWelcome] = useState(true);
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



  const handleWelcomeLinkClick = (href, text, shouldResetView = false, topic) => {
    setSelectedTopic(href.substring(1));
    let endpoint;
    if (topic === 'query') {
      endpoint = '/langchain/api/v1/chat/ollama/stream/v2';
    } else {
      endpoint = '/langchain/api/v1/chat/ollama/stream/v3';
    }
    setApiEndpoint(endpoint);
    handleSendMessage(text, shouldResetView, endpoint);
  };

  const handleSendMessage = async (text, shouldResetView = false, endpointOverride = null) => {
    setShowWelcome(false);
    if (!sessionId || !text.trim()) return;

    const userMessage = { role: 'user', content: text };

    setMessages(prev => {
      // 如果这是第一条用户消息，则替换掉初始的欢迎消息
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [userMessage];
      }
      return [...prev, userMessage];
    });

    // 创建一个空的 AI 响应消息
    const aiMessagePlaceholder = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, aiMessagePlaceholder]);

    setIsLoading(true);
    
    // 创建新的 AbortController
    abortControllerRef.current = new AbortController();

    try {
      // 处理流式响应
      let accumulatedResponse = "";
      const endpoint = endpointOverride || apiEndpoint;
      console.log('Sending message to endpoint:', endpoint);

      await sendMessage(
        message, 
        sessionId, 
        endpoint,
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
      <Header title="Standard Chartered" onRefresh={() => window.location.reload()} />
      <ChatHistory messages={messages} onRetry={handleRetryMessage} onWelcomeLinkClick={handleWelcomeLinkClick} showWelcome={showWelcome} selectedTopic={selectedTopic} />
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
        onStopGeneration={handleStopGeneration} // 添加停止生成的回调
      />
    </ChatContainer>
  );
};

export default Chat;
