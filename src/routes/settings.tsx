import React from "react";

import styled from "styled-components";
import { useThemeContext } from "../App";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  border: 1px solid ${(props) => props.theme.hoverColor};
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: bold;
`;

const ToggleList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

const ToggleButton = styled.button`
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 15px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;
  transition: opacity 0.3s ease;
  &:hover {
    opacity: 0.8;
  }
  &.light {
    background-color: white;
    color: black;
    border: 1px solid rgba(82, 82, 82, 0.5);
  }
  &.dark {
    background-color: black;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
`;

const Settings: React.FC = () => {
  const { setLightTheme, setDarkTheme } = useThemeContext();

  return (
    <Wrapper>
      <Title>설정</Title>
      <ToggleList>
        <ToggleButton
          className="light"
          onClick={setLightTheme}
        >
          기본
        </ToggleButton>
        <ToggleButton
          className="dark"
          onClick={setDarkTheme}
        >
          어둡게
        </ToggleButton>
      </ToggleList>
    </Wrapper>
  );
};

export default Settings;
