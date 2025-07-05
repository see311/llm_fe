import axios from 'axios';

const API_BASE_URL = 'http://localhost:12001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const sendMessage = async (message, sessionId, endpoint, onChunkReceived) => {
  let receivedLength = 0;
  const controller = new AbortController(); //

  try {
    const response = await apiClient.post(endpoint, { message, sessionId }, { ///langchain/api/v1/chat/ollama/stream/v2   /rag/chat/stream/v4
      responseType: 'text',
      signal: controller.signal, //
      onDownloadProgress: (progressEvent) => {
        const chunk = progressEvent.event.target.responseText;

        if (chunk.length > receivedLength) {
          const newData = chunk.slice(receivedLength);
          receivedLength = chunk.length;
          //
          if (newData.includes('DONE')) {
            controller.abort(); //
            onChunkReceived(newData.replace('[DONE]', '')); //
            return;
          }
          onChunkReceived(newData);
        }
      }
    });
    return response.data;
  } catch (error) {
    if (error.name === 'CanceledError') {
      console.log('Request finished（Recieved DONE）');
    } else {
      console.error('Error sending message:', error);
      throw error;
    }
  }
};

//
export const getChatHistory = async (sessionId) => {
  try {
    const response = await apiClient.get(`/history?sessionId=${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};
