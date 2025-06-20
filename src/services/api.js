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

// 发送消息并接收流式响应 (使用GET请求)
export const sendMessage = async (message, sessionId, endpoint, onChunkReceived) => {
  let receivedLength = 0;
  const controller = new AbortController(); // 创建中断控制器

  try {
    const response = await apiClient.post(endpoint, { message, sessionId }, { ///langchain/api/v1/chat/ollama/stream/v2   /rag/chat/stream/v4
      responseType: 'text',
      signal: controller.signal, // 绑定中断信号
      onDownloadProgress: (progressEvent) => {
        const chunk = progressEvent.event.target.responseText;

        if (chunk.length > receivedLength) {
          const newData = chunk.slice(receivedLength);
          receivedLength = chunk.length;
          // 检查是否包含终止标记
          if (newData.includes('DONE')) {
            controller.abort(); // 主动中断请求
            onChunkReceived(newData.replace('[DONE]', '')); // 发送剩余数据（可选）
            return;
          }
          onChunkReceived(newData);
        }
      }
    });
    return response.data;
  } catch (error) {
    if (error.name === 'CanceledError') {
      console.log('请求已主动终止（接收到DONE）');
    } else {
      console.error('Error sending message:', error);
      throw error;
    }
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
