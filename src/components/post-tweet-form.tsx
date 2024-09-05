import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 1px solid ${(props) => props.theme.hoverColor};
  padding: 20px;
  font-size: 19px;
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
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

// button 컴포넌트로 만들기(과제)
const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.3s ease;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);

    // Textarea 높이 조절
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = "auto";
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 textarea 높이 조정
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = "auto";
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 파일 배열을 받아오는데, 하나의 파일만 받아왔을 때 게시함
    // 1MB 미만의 파일만 업로드 할 수 있도록 함
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0].size >= 1 * 1024 * 1024) {
        alert("이미지 크기는 1MB를 넘어갈 수 없습니다.");
        return;
      }
      setFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // 트윗 추가
    e.preventDefault();
    const user = auth.currentUser; // 로그인 유저 정보
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;
    try {
      setLoading(true);
      // 새로운 Document 생성(Firebase)
      // tweets 컬렉션에 두번째 인자를 Doc로 추가
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      // 파일 첨부된 경우
      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, { photo: url });
      }
      // // 유저 아바타가 있는 경우
      // try {
      //   const locationRef = ref(storage, `avatars/${user?.uid}`);
      //   if (locationRef) {
      //     const avatarUrl = await getDownloadURL(locationRef);
      //     await updateDoc(doc, { avatar: avatarUrl });
      //   }
      // } catch {
      //   // do nothing
      // }

      setTweet("");
      setFile(null);
      if (textAreaRef.current) {
        textAreaRef.current.style.height = "auto";
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        ref={textAreaRef}
        required
        rows={1}
        maxLength={180}
        onChange={handleChange}
        value={tweet}
        placeholder="무슨 일이 일어나고 있나요?"
      />
      <AttachFileButton htmlFor="file">{file ? "사진 추가됨✅" : "사진 추가"}</AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "게시중..." : "게시하기"}
      />
    </Form>
  );
}
