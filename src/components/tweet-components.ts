import styled from "styled-components";

// 버튼
export const SubmitBtn = styled.button`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 9px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  width: 100%;
  cursor: pointer;
  transition: opacity 0.3s ease;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export const ButtonList = styled.div`
  display: flex;
  flex-direction: row;
`;

export const ButtonIcon = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 27px;
  width: 27px;
  border-radius: 50%;
  padding: 4px;
  svg {
    color: ${(props) => props.theme.borderColor};
  }
  &:hover {
    svg {
      color: #1d9bf0;
    }
    background-color: #1d9cf056;
  }
`;
