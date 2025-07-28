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
  height: 700px;
  width: 1000px; /* 可以根据需要调整最大宽度 */
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
  const [activeTab, setActiveTab] = useState('query');
  const [apiEndpoint, setApiEndpoint] = useState('/langchain/api/v1/chat/ollama/stream/v3');
  const [showWelcome, setShowWelcome] = useState(true);
  const abortControllerRef = useRef(null);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    const existingSessionId = localStorage.getItem('chatSessionId');
    if (existingSessionId) {
      setSessionId(existingSessionId);
    } else {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      localStorage.setItem('chatSessionId', newSessionId);
    }
  }, []);

  // load chat history
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



  const handleWelcomeLinkClick = (href, text, topic) => {
    setSelectedTopic(href.substring(1));
    setActiveTab(topic);
    let endpoint;
    if (topic === 'query') {
      endpoint = '/langchain/api/v1/chat/ollama/stream/v2';
    } else {
      endpoint = '/langchain/api/v1/chat/ollama/stream/v3';
    }
    setApiEndpoint(endpoint);
    setInputMessage(text)
  };

  const handleSendMessage = async (text, endpointOverride = null) => {
    setShowWelcome(false);
    if (!sessionId || !text.trim()) return;

    const userMessage = { role: 'user', content: text };

    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [userMessage];
      }
      return [...prev, userMessage];
    });

    const aiMessagePlaceholder = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, aiMessagePlaceholder]);

    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      let accumulatedResponse = "";
      const endpoint = endpointOverride || apiEndpoint;
      console.log('Sending message to endpoint:', endpoint);

      await sendMessage(
        text,
        sessionId,
        endpoint,
        (chunk) => {
          console.log('chunk', chunk);
          const cleanedChunk = chunk.replace(/data:/g, '').replace(/\n\n/g, '');
          if (cleanedChunk === '[DONE]') {
            return;
          }
          if (cleanedChunk) {
            try {
              accumulatedResponse += cleanedChunk;
            } catch (e) {
              accumulatedResponse += cleanedChunk;
            }

            setMessages(prev => {
              const newMessages = [...prev];
              if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
                newMessages[newMessages.length - 1].content = accumulatedResponse;
              }
              return newMessages;
            });
          }
        },
        abortControllerRef.current
      );
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
          newMessages[newMessages.length - 1].content = 'Sorry, an error occurred while processing your request. Please try again later.';
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setMessages(prev => {
        if (prev.length > 0 && prev[prev.length - 1].role === 'assistant' && prev[prev.length - 1].content === '') {
          return prev.slice(0, -1);
        }
        return prev;
      });
    }
  };

  const handleRetryMessage = async (messageContent) => {
    await handleSendMessage(messageContent);
  };

  const handleRefresh = () => {
    if (isLoading) {
      abortControllerRef.current?.abort();
    }
    setMessages([]);
    setShowWelcome(true);
    setSelectedTopic('');
    setIsLoading(false);
  };

  const handleTabChange = (tab) => {
    if (isLoading) {
      abortControllerRef.current?.abort();
      setIsLoading(false);
    }
    setActiveTab(tab);
    setMessages([]);
    setShowWelcome(true);
    setSelectedTopic('');
    const endpoint = tab === 'business' ? '/langchain/api/v1/chat/ollama/stream/v3' : '/langchain/api/v1/chat/ollama/stream/v2';
    setApiEndpoint(endpoint);
  };

  return (
    <ChatContainer>
      <Header title="Conversation with AI Chatbot" onRefresh={handleRefresh} />
      <ChatHistory
        messages={messages}
        onRetry={handleRetryMessage}
        onWelcomeLinkClick={handleWelcomeLinkClick}
        showWelcome={showWelcome}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onStopGeneration={handleStopGeneration}
        setInputMessage={setInputMessage}
        inputMessage={inputMessage}
      />
    </ChatContainer>
  );
};

export default Chat;
