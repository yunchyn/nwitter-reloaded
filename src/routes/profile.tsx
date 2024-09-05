import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, doc, getDocs, limit, orderBy, query, updateDoc, where } from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import { ButtonIcon } from "../components/tweet-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 63px;
    fill: white;
  }
`;

const AvatarImg = styled.img`
  height: 100%;
  object-fit: cover;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
  margin-right: 5px;
`;

const NameWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const NameInput = styled.input`
  color: ${(props) => props.theme.textColor};
  font-size: 16px;
  padding: 5px;
  border-radius: 3px;
  border: 1px solid ${(props) => props.theme.hoverColor};
  background-color: transparent;
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

// 닉네임 Edit 기능 (과제)
// 버튼을 생성해서 프로필에서 닉네임을 변경할 수 있음

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [isEditing, setIsEditing] = useState(false); // 닉네임 수정 모드 관리
  const [newName, setNewName] = useState(user?.displayName ?? ""); // 닉네임 상태 관리

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      // 새로운 이미지를 등록하면 덮어쓰기하도록 경로 지정
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, { photoURL: avatarUrl });
    }
  };

  const onNameChange = async () => {
    if (!user || newName === user.displayName) {
      alert("닉네임을 변경해 주세요.");
      return;
    } // 사용자가 변경하지 않은 경우
    try {
      await updateProfile(user, { displayName: newName });
      // doc 업데이트
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { displayName: newName });
      setIsEditing(false); // 수정 완료 후 입력 모드를 종료
    } catch (error) {
      console.error("Failed to update user name:", error);
    }
  };

  const fetchTweets = async () => {
    // Profile 페이지에서는 해당 유저가 작성한 트윗만 보여줌
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo, avatar } = doc.data();
      return { tweet, createdAt, userId, username, photo, id: doc.id, avatar };
    });
    setTweets(tweets);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      <NameWrapper>
        {isEditing ? (
          <>
            <NameInput
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <ButtonIcon onClick={onNameChange}>
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
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </ButtonIcon>
            <ButtonIcon onClick={() => setIsEditing(false)}>
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
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </ButtonIcon>
          </>
        ) : (
          <>
            <Name>{user?.displayName ?? "Anonymous"}</Name>
            <ButtonIcon onClick={() => setIsEditing(true)}>
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
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </ButtonIcon>
          </>
        )}
      </NameWrapper>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            {...tweet}
          />
        ))}
      </Tweets>
    </Wrapper>
  );
}
