import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";

const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 4fr;
  height: 100%;
  padding: 50px 0px;
  width: 700px;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  width: 180px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const MenuItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 30px;
  transition: background-color 0.3s ease;
  cursor: pointer;
  margin-top: 7px;
  p {
    color: ${(props) => props.theme.textColor};
    font-size: 19px;
    margin-left: 10px;
    user-select: none;
  }
  &:hover {
    background-color: ${(props) => props.theme.hoverColor};
  }
  /* @media (max-width: 750px) {
    p {
      display: none;
    }
  } */
`;

const MenuIcon = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  svg {
    width: 31px;
    color: ${(props) => props.theme.textColor};
  }
  &.log-out {
    svg {
      fill: #1d9bf0;
    }
  }
`;

export default function Layout() {
  const navigate = useNavigate();
  const onLogOut = async () => {
    const LogOutConfirm = confirm("로그아웃 하시겠습니까?");
    if (LogOutConfirm) {
      await auth.signOut();
      navigate("/login");
    }
  };
  return (
    <Wrapper>
      <Menu>
        <StyledLink to="/">
          <MenuItem>
            <MenuIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
                  clipRule="evenodd"
                />
              </svg>
            </MenuIcon>
            <p>홈</p>
          </MenuItem>
        </StyledLink>
        <StyledLink to="/profile">
          <MenuItem>
            <MenuIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
              </svg>
            </MenuIcon>
            <p>프로필</p>
          </MenuItem>
        </StyledLink>
        <StyledLink to="/settings">
          <MenuItem>
            <MenuIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                />
              </svg>
            </MenuIcon>
            <p>설정</p>
          </MenuItem>
        </StyledLink>
        <MenuItem onClick={onLogOut}>
          <MenuIcon className="log-out">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 19 10Z"
                clipRule="evenodd"
              />
            </svg>
          </MenuIcon>
          <p>로그아웃</p>
        </MenuItem>
      </Menu>
      <Outlet />
    </Wrapper>
  );
}
