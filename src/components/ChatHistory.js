import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import Welcome from './Welcome';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { FaRedo } from 'react-icons/fa'; // 导入刷新图标
// 导入头像图片
import userAvatar from '../assets/user-avatar.png';
import aiAvatar from '../assets/ai-avatar.png';

const HistoryContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  background-color: #f7f8fc; /* 聊天区域背景色与整体一致 */
`;

const TopicHeaderContainer = styled.div`
  display: flex;
  margin-bottom: 30px;
  border-bottom: 2px solid #e0e0e0;
  width: 100%;
  justify-content: flex-start; /* 左对齐 */
`;

const TopicHeader = styled.div`
  padding: 10px 20px;
  color: #4a7dff;
  border-bottom: 2px solid #4a7dff;
  margin-bottom: -2px; /* 与父元素的border-bottom重合 */
  font-weight: 600;
`;

const MessageWrapper = styled.div`
  display: flex;
  margin-bottom: 15px;
  max-width: 80%; /* 消息不会占据全部宽度，更美观 */
  
  /* 根据角色决定消息是在左边还是右边 */
  align-self: ${props => (props.role === 'user' ? 'flex-end' : 'flex-start')};
  align-items: center; /* 垂直居中对齐气泡和可能的按钮 */

  /* 新消息淡入动画 */
  animation: fadeIn 0.3s ease-out;
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// 取消注释并修改头像组件样式
const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* 防止头像被压缩 */
  overflow: hidden; /* 确保图片不会溢出圆形边界 */

  /* AI头像在气泡左边，用户头像在气泡右边 */
  margin-right: ${props => (props.role === 'assistant' ? '10px' : '0')};
  margin-left: ${props => (props.role === 'user' ? '10px' : '0')};
  
  /* 控制头像和气泡的顺序 */
  order: ${props => (props.role === 'user' ? 1 : 0)}; 
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 确保图片填充整个区域 */
  }
`;

const MessageBubble = styled.div`
  padding: 10px 15px;
  border-radius: 18px; /* 气泡圆角 */
  background-color: ${props => (props.role === 'user' ? '#e9eafd' : '#ffffff')}; /* 用户消息浅紫色，AI消息白色 */
  color: ${props => (props.role === 'user' ? '#4353ff' : '#333333')}; /* 用户消息文字颜色，AI消息文字颜色 */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  word-wrap: break-word;
  line-height: 1.6;
  max-width: 75%; /* 限制消息气泡最大宽度 */

  /* 移除默认的 p 标签边距，以便更好地控制间距 */
  p {
    margin: 0;
  }
  
  /* 为Markdown中的链接、代码块等元素添加更匹配图片风格的样式 */
  a {
    color: ${props => (props.role === 'user' ? '#4353ff' : '#007bff')};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  code {
    background-color: ${props => (props.role === 'user' ? 'rgba(67, 83, 255, 0.1)' : 'rgba(0,0,0,0.04)')};
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-size: 0.9em;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  }

  pre {
    background-color: ${props => (props.role === 'user' ? 'rgba(67, 83, 255, 0.05)' : 'rgba(0,0,0,0.02)')};
    padding: 0.8em;
    border-radius: 6px;
    overflow-x: auto;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  
  pre code {
    background-color: transparent;
    padding: 0;
    font-size: 0.85em;
  }
`;

const RetryButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0; /* 移除默认内边距 */
  margin: 0 8px; /* 在用户消息气泡左侧添加间距 */
  display: inline-flex; /* 使按钮和图标良好对齐 */
  align-items: center;
  justify-content: center;
  color: #888; /* 图标的默认颜色 */
  font-size: 0.9em; /* 控制图标大小 */

  &:hover {
    color: #4a7dff; /* 鼠标悬停时高亮颜色 */
  }
`;



const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 30px;
  border-bottom: 2px solid #e0e0e0;
  width: 100%;
  justify-content: flex-start; /* 左对齐 */
`;

const Tab = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  font-size: 17px;
  color: ${props => (props.isActive ? '#4a7dff' : '#666')};
  border-bottom: 2px solid ${props => (props.isActive ? '#4a7dff' : 'transparent')};
  margin-bottom: -2px; /* 与父元素的border-bottom重合 */
  font-weight: ${props => (props.isActive ? '600' : '500')};
  transition: all 0.3s ease;

  &:hover {
    color: #4a7dff;
  }
`;

const ChatHistory = ({ messages, onRetry, onWelcomeLinkClick, showWelcome, activeTab, onTabChange }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTabClick = (tab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <HistoryContainer>
      <TabsContainer>
      <Tab isActive={activeTab === 'query'} onClick={() => handleTabClick('query')}>
          SSDR Query
        </Tab>
        <Tab isActive={activeTab === 'business'} onClick={() => handleTabClick('business')}>
          SSDR Knowledge
        </Tab>
      </TabsContainer>

      {showWelcome ? (
        <Welcome onWelcomeLinkClick={onWelcomeLinkClick} activeTab={activeTab} onTabChange={onTabChange} />
      ) : (
        messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg.content}
            isUser={msg.role === 'user'}
            onRetry={onRetry}
            onWelcomeLinkClick={onWelcomeLinkClick}
          />
        ))
      )}
      <div ref={endOfMessagesRef} />
    </HistoryContainer>
  );
};

export default ChatHistory;
