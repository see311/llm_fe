import React from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { publish } from "src/lib/MassageCenter/messageCenter";

const HeaderContainer = styled.div`
  padding: 0 20px;
  background: linear-gradient(to right, #009efd, #2af598);
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #e0e0e0;
`;

const HeaderTitle = styled.span`
  font-size: 18px;
`;

const RefreshButton = styled.button`
  background-color: transparent;
  border: 1px solid #ffffff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
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
