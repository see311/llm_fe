import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  padding: 0 20px;
  background: linear-gradient(to right, #009efd, #2af598);
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 将元素分布在两端 */
  height: 60px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #e0e0e0;
`;

const HeaderTitle = styled.span`
  /* 标题文字样式 */
  font-size: 22px; /* 增大字体大小，从18px改为22px */
`;

const RefreshButton = styled.button`
  background-color: transparent;
  border: 1px solid #ffffff;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #ffffff;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Header = ({ title, onRefresh }) => {
  return (
    <HeaderContainer>
      <HeaderTitle>{title}</HeaderTitle>
      <RefreshButton onClick={onRefresh}>
        &#x21bb; {/* Refresh icon */}
      </RefreshButton>
    </HeaderContainer>
  );
};

export default Header;
