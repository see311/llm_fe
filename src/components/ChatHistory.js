import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import Welcome from './Welcome';
import styled from 'styled-components';

const HistoryContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  background-color: #f7f8fc;
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 30px;
  border-bottom: 2px solid #e0e0e0;
  width: 100%;
  justify-content: flex-start;
`;

const Tab = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  font-size: 17px;
  color: ${props => (props.isActive ? '#4a7dff' : '#666')};
  border-bottom: 2px solid ${props => (props.isActive ? '#4a7dff' : 'transparent')};
  margin-bottom: -2px;
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
          Data Query
        </Tab>
        <Tab isActive={activeTab === 'business'} onClick={() => handleTabClick('business')}>
          Basic Knowledge
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
