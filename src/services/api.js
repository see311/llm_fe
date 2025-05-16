import axios from 'axios';

// 后端 API 的基础 URL，根据您的实际情况修改
const API_BASE_URL = 'http://localhost:8081';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 生成唯一的会话ID
export const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// 发送消息并接收流式响应
export const sendMessage = async (message, sessionId, onChunkReceived) => {
  try {
    const response = await fetch(`${API_BASE_URL}/langchain/api/v1/chat/ollama/stream/v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, sessionId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("ReadableStream not supported in this browser.");
    }

    // 获取reader来读取流
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    // 读取数据流
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      // 解码二进制数据为文本
      const chunk = decoder.decode(value, { stream: true });
      
      // 处理SSE格式的数据
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.substring(5).trim();
          if (data === '[DONE]') {
            return; // 流结束
          }
          onChunkReceived(data);
        }
      }
    }
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// 获取聊天历史
export const getChatHistory = async (sessionId) => {
  try {
    const response = await apiClient.get(`/history?sessionId=${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};
