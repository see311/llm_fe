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
      { href: '#question-1', text: 'What are my total fails?' },
      { href: '#question-2', text: 'What is exposure to Firm TEST COMPANY falling to settle open transactions including repos?' },
      { href: '#question-3', text: 'What are my Open Exceptions for Equity Trades today?' },
      { href: '#question-4', text: 'Give me a list of all Open SWIFT Verification from IPE.' },
      { href: '#question-5', text: 'What are my depot realignment opportunities for IBM?' },
      { href: '#question-6', text: 'How many unmatched Transactions we have today?' },
      { href: '#question-7', text: 'What\'s the projected positions for security US45920014 across depots as of 06/29/2023?' },
      { href: '#question-8', text: 'What will be my position at DTC #229 if the trade X123 is not settled today?' },
      { href: '#question-9', text: 'What is my Total Margin Call Value and explain margin call and drivers.' },
    ],
    'query': [
      { href: '#question-10', text: 'Generate a SQL query to find all users in the \'sales\' department.' },
      { href: '#question-11', text: 'Create a SQL statement to get the top 5 products by sales amount.' },
      { href: '#question-12', text: 'Write a SQL query to list all employees hired in the last year.' },
      { href: '#question-13', text: 'Provide a SQL query to calculate the average salary for each department.' },
      { href: '#question-14', text: 'Generate a SQL statement to find duplicate emails in the customers table.' },
      { href: '#question-15', text: 'Write a SQL query to get the total number of orders for each customer.' },
      { href: '#question-16', text: 'Create a SQL query to find all products with a stock level below 10.' },
      { href: '#question-17', text: 'Generate a SQL statement to get the monthly sales report for the current year.' },
      { href: '#question-18', text: 'Write a SQL query to find the names of all employees who are also managers.' },
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
