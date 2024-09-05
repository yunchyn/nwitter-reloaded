import { createUserWithEmailAndPassword, updateProfile, User } from "firebase/auth";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Error, Form, Input, StyledLink, Switcher, Title, Wrapper } from "../components/auth-components";
// import GithubButton from "../components/github-btn";
import { doc, setDoc } from "firebase/firestore";

interface IFormInput {
  name: string;
  email: string;
  password: string;
}

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const createUserDocument = async (user: User) => {
    const userDocRef = doc(db, "users", user.uid);
    const displayId = user.email?.split("@")[0]; // 이메일의 @ 앞부분을 id로 설정
    try {
      await setDoc(userDocRef, {
        displayId,
        displayName: user.displayName || "Anonymous",
        email: user.email || "",
      });
    } catch (error) {
      console.error("Error creating user document:", error);
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { name, email, password } = data;
    setError("");
    if (isLoading) return;
    try {
      setLoading(true);
      // 계정생성 -> name 설정 -> Home으로 리다이렉트
      const credentials = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credentials.user, { displayName: name });
      // 유저 정보 doc 생성
      await createUserDocument(credentials.user);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title className="create-account">회원 가입</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("name", { required: true })}
          placeholder="이름"
          type="text"
        />
        {errors.name && <Error>{errors.name.message}</Error>}

        <Input
          {...register("email", { required: true })}
          placeholder="이메일"
          type="email"
        />
        {errors.email && <Error>{errors.email.message}</Error>}

        <Input
          {...register("password", { required: true })}
          placeholder="비밀번호"
          type="password"
        />
        {errors.password && <Error>{errors.password.message}</Error>}

        <Input
          type="submit"
          value={isLoading ? "로딩중..." : "가입하기"}
        />
      </Form>
      {error && <Error>{error}</Error>}
      <Switcher>
        이미 계정이 있으세요? <StyledLink to="/login">로그인하기</StyledLink>
      </Switcher>
      {/* <GithubButton /> */}
    </Wrapper>
  );
}
