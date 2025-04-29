import axios from 'axios';

// 后端 API 的基础 URL，根据您的实际情况修改
const API_BASE_URL = 'http://localhost:8080/api';

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

// 发送消息并接收流式响应 (使用GET请求)
export const sendMessage = async (message, sessionId, onChunkReceived) => {
  try {
    // 使用 axios 发送GET请求并接收流式响应
    const response = await apiClient.get('/chat', {
      params: { message, sessionId },
      responseType: 'text',
      onDownloadProgress: (progressEvent) => {
        // 处理流式数据
        const chunk = progressEvent.currentTarget.response;
        if (chunk && progressEvent.loaded > progressEvent.total) {
          // 只处理新增的数据
          const newData = chunk.substring(progressEvent.loaded - progressEvent.total);
          onChunkReceived(newData);
        } else if (chunk) {
          onChunkReceived(chunk);
        }
      }
    });
    
    return response.data;
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