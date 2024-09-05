import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import {
  formatTimestamp,
  getCachedUserAvatar,
  getCachedUserName,
  setCachedUserAvatar,
  setCachedUserName,
} from "./utilities";
import { SubmitBtn } from "./tweet-components";

const Wrapper = styled.div`
  display: flex;
  gap: 15px;
  padding: 15px;
  border: 1px solid ${(props) => props.theme.hoverColor};
`;

const AvatarContainer = styled.div`
  width: 45px;
  height: 45px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #1d9bf0;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 35px;
    fill: white;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Column = styled.div`
  flex: 1;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

const Username = styled.span`
  font-weight: 700;
  font-size: 16px;
`;

const Timestamp = styled.span`
  font-size: 15px;
  color: ${(props) => props.theme.borderColor};
`;

const Payload = styled.p`
  margin: 10px 0;
  font-size: 15px;
`;

const Photo = styled.img`
  width: 100%;
  border-radius: 10px;
  margin-top: 10px;
  max-width: 500px;
`;

const ButtonList = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 5px;
`;

const ButtonIcon = styled.div`
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

const EditTextArea = styled.textarea`
  border: 1px solid ${(props) => props.theme.hoverColor};
  border-radius: 5px;
  margin-top: 10px;
  padding: 15px;
  font-size: 15px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColor};
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
    "Helvetica Neue", sans-serif;
  overflow: hidden;
  min-height: 80px;
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 9px 12px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const EditButtonList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: right;
  margin-top: 10px;
  gap: 5px;
`;

export default function Tweet({ photo, tweet, userId, id, createdAt }: ITweet) {
  const user = auth.currentUser;
  const [username, setUsername] = useState<string>(getCachedUserName(userId));
  const [avatar, setAvatar] = useState<string | null>(null);
  const [displayId, setDisplayId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweet);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    const check = confirm("트윗을 삭제하시겠습니까?");
    if (!check || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 과제: Edit 버튼(자신이 생성한 트윗 수정 기능)
  const onEdit = async () => {
    if (user?.uid !== userId) return;
    setIsEditing(true);
  };

  const onCancelEdit = () => {
    setIsEditing(false);
    setNewTweet(tweet);
    setNewPhoto(null);
  };

  const onSubmitEdit = async () => {
    if (loading || user === null || newTweet === "" || newTweet.length > 180) return;
    try {
      setLoading(true);
      const tweetDocRef = doc(db, "tweets", id);
      // 텍스트 업데이트
      await updateDoc(tweetDocRef, { tweet: newTweet });
      // 사진 업데이트
      if (newPhoto) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        // 이전 사진이 있는 경우 삭제
        if (photo) {
          const oldPhotoRef = ref(storage, `tweets/${user.uid}/${id}`);
          await deleteObject(oldPhotoRef);
        }
        const uploadResult = await uploadBytes(photoRef, newPhoto);
        const newPhotoURL = await getDownloadURL(uploadResult.ref);
        await updateDoc(tweetDocRef, { photo: newPhotoURL });
      }

      setIsEditing(false);
      setNewPhoto(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // 닉네임 로딩 지연 문제 -> 캐싱
  useEffect(() => {
    const userDocRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const name = doc.data().displayName || "Anonymous";
        setUsername(name);
        setDisplayId(doc.data().displayId);
        setCachedUserName(userId, name); // 이름 캐시 업데이트

        // 아바타 설정 및 캐싱
        const cachedAvatar = getCachedUserAvatar(userId);
        if (cachedAvatar) {
          setAvatar(cachedAvatar);
        } else {
          const fetchAvatar = async () => {
            try {
              const avatarRef = ref(storage, `avatars/${userId}`);
              const avatarUrl = await getDownloadURL(avatarRef);
              setAvatar(avatarUrl);
              setCachedUserAvatar(userId, avatarUrl); // 아바타 캐시 업데이트
            } catch {
              setAvatar(null);
            }
          };
          fetchAvatar();
        }
      }
    });

    return () => {
      unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
    };
  }, [userId]);

  return (
    <Wrapper>
      <AvatarContainer>
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
      </AvatarContainer>
      <Column>
        <Header>
          <Username>{username}</Username>
          {displayId != null ? <Timestamp>@{displayId}</Timestamp> : ""}
          {createdAt && <Timestamp>{formatTimestamp(createdAt)}</Timestamp>}
        </Header>
        {isEditing ? (
          <>
            <EditTextArea
              value={newTweet}
              onChange={(e) => setNewTweet(e.target.value)}
              maxLength={180}
            />
            {photo && <Photo src={photo} />}
            <EditButtonList>
              <AttachFileButton htmlFor="edit">{newPhoto ? "사진 추가됨✅" : "사진 추가"}</AttachFileButton>
              <AttachFileInput
                type="file"
                accept="image/*"
                id="edit"
                onChange={(e) => setNewPhoto(e.target.files ? e.target.files[0] : null)}
              />
              <SubmitBtn
                onClick={onSubmitEdit}
                disabled={loading}
              >
                {loading ? "업데이트 중..." : "저장하기"}
              </SubmitBtn>
            </EditButtonList>
          </>
        ) : (
          <>
            <Payload>{tweet}</Payload>
            {photo && <Photo src={photo} />}
          </>
        )}
        {user?.uid === userId && (
          <ButtonList>
            <ButtonIcon onClick={onDelete}>
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
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </ButtonIcon>
            <ButtonIcon onClick={onEdit}>
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
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </ButtonIcon>
            {isEditing ? (
              <ButtonIcon onClick={onCancelEdit}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </ButtonIcon>
            ) : (
              ""
            )}
          </ButtonList>
        )}
      </Column>
    </Wrapper>
  );
}
