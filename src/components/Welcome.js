import React, { useState } from 'react';
import styled from 'styled-components';

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* 从顶部开始对齐 */
  flex-grow: 1;
  padding: 40px 20px;
  width: 100%;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 30px;
  border-bottom: 2px solid #e0e0e0;
  width: 100%;
  justify-content: flex-start; /* 左对齐 */
`;

const Tab = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  color: ${props => (props.active ? '#4a7dff' : '#666')};
  border-bottom: ${props => (props.active ? '2px solid #4a7dff' : 'none')};
  margin-bottom: -2px; /* 与父元素的border-bottom重合 */
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
  height: 120px; /* 固定高度 */
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  text-align: left; /* 文本左对齐 */

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
        { href: '#question-10', text: 'How to query recent 30 days Murex live status trade ?' },
        { href: '#question-11', text: 'How to query all live trade against counterparty QNBFINANSYA/IST?' },
        { href: '#question-12', text: 'How to query recent 3 days Murex live status trade data?' },
        { href: '#question-14', text: 'How to query recent 3 days Commodity Asset Class trade?' },
        { href: '#question-15', text: 'How to query recent 3 days Credit Asset Class trades?' }
      ]
  };

  const handleWelcomeLinkClick = (href, text) => {
    const topic = activeTab; // 'business' or 'query'
    onWelcomeLinkClick(href, text, false, topic);
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
