import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import { sendMessage, getChatHistory, generateSessionId } from '../services/api';
import ReactMarkdown from 'react-markdown';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1000px;
  margin: 0 auto;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  padding: 16px;
  background-color: #4a7dff;
  color: white;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
`;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
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
    if (!sessionId) return;

    // 添加用户消息到聊天历史
    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);

    // 创建一个空的 AI 响应消息
    setCurrentResponse('');
    const aiMessage = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, aiMessage]);

    setIsLoading(true);

    try {
      // 处理流式响应
      await sendMessage(message, sessionId, (chunk) => {
        console.log('chunk', chunk);
        // 更新消息列表中的 AI 响应
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content += chunk.replace(/data:/g, '').replace(/\n\n/g, '');
          console.log('newMessages', newMessages);
          return newMessages;
        });
      });
    } catch (error) {
      console.error('Error in chat:', error);
      // 在消息中显示错误
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content = 'Sorry, please try again later.';
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContainer>
      <Header>AI Chat Assistant</Header>
      <ChatHistory messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </ChatContainer>
  );
};

export default Chat;
