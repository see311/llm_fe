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

// 发送消息并接收流式响应
export const sendMessage = async (message, sessionId, onChunkReceived) => {
  try {
    // 使用 axios 发送请求并接收流式响应
    const response = await apiClient.post('/chat', { message, sessionId }, {
      responseType: 'text', // 改为text而不是stream
      onDownloadProgress: (progressEvent) => {
        // 处理流式数据
        const chunk = progressEvent.currentTarget.response;
        if (chunk) {
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