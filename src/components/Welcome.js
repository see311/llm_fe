import React, { useState } from 'react';
import styled from 'styled-components';

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-grow: 1;
  padding: 40px 20px;
  width: 100%;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 30px;
  border-bottom: 2px solid #e0e0e0;
  width: 100%;
  justify-content: flex-start;
`;

const Tab = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  color: ${props => (props.active ? '#4a7dff' : '#666')};
  border-bottom: ${props => (props.active ? '2px solid #4a7dff' : 'none')};
  margin-bottom: -2px;
  font-weight: 600;
`;

const QuestionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 1200px;
`;

const QuestionCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
  color: #333;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: left;

  &:hover {
    border-color: #4a7dff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
  }
`;

const Welcome = ({ onWelcomeLinkClick, activeTab }) => {

  const welcomeOptions = {
    'business': [
      { href: '#question-1', text: 'What is SSDR?' },
      { href: '#question-2', text: 'what kind of data is onboarded in SSDR?' },
      { href: '#question-3', text: 'What approval is required for my scheduler report in SSDR?' },
      { href: '#question-4', text: 'Where I can find my scheduled report in SSDR?' },
      { href: '#question-5', text: 'How to build a query in SSDR?' },
      { href: '#question-6', text: 'How to run query and extract result in SSDR?' },
      { href: '#question-7', text: 'How to save & load queries for future reuse in SSDR?' },
      { href: '#question-8', text: 'What is UDF in SSDR?' },
      { href: '#question-9', text: 'How to use Query Helper in SSDR?' },
    ],
    'query': [
      { href: '#question-10', text: 'How to query recent 30 days live status trade?' },
      { href: '#question-11', text: 'How to query all live trade against counterparty CITI/LDN?' },
      { href: '#question-12', text: 'Please give me all the Live trades belongs to Singapore entity.' },
      { href: '#question-14', text: 'How to query all the live trades booked in portfolio PB_EQ_DBUS_CLIENT' },
      { href: '#question-16', text: 'How to get all the trade events for trade 481817492?' }
    ]
  };

  const handleWelcomeLinkClick = (href, text) => {
    const topic = activeTab; // 'business' or 'query'
    onWelcomeLinkClick(href, text, topic);
  };

  return (
    <WelcomeContainer>
      {activeTab === 'business' ? (
        <QuestionsGrid>
          {welcomeOptions.business.map((option, index) => (
            <QuestionCard key={index} onClick={() => handleWelcomeLinkClick(option.href, option.text)}>
              {option.text}
            </QuestionCard>
          ))}
        </QuestionsGrid>
      ) : (
        <QuestionsGrid>
          {welcomeOptions.query.map((option, index) => (
            <QuestionCard key={index} onClick={() => handleWelcomeLinkClick(option.href, option.text)}>
              {option.text}
            </QuestionCard>
          ))}
        </QuestionsGrid>
      )}
    </WelcomeContainer>
  );
};

export default Welcome;
