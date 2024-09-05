import { Link } from "react-router-dom";
import styled from "styled-components";

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px;
`;
export const Title = styled.h1`
  font-size: 42px;
  &.create-account {
    font-size: 30px;
    margin-top: 30px;
  }
`;
export const Form = styled.form`
  margin-top: 50px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;
export const Input = styled.input`
  background-color: ${(props) => props.theme.inputColor};
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  &[type="submit"] {
    background-color: ${(props) => props.theme.themeColor};
    color: white;
    cursor: pointer;
    font-weight: bold;
    transition: opacity 0.3s ease;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export const Switcher = styled.span`
  margin-top: 10px;
  font-size: 15px;
  a {
    color: #1d9bf0;
  }
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: #1d9bf0;
  &:hover {
    text-decoration-line: underline;
  }
`;
