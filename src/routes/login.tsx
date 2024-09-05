import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { auth } from "../firebase";
import { Error, Input, Switcher, Title, Wrapper, Form, StyledLink } from "../components/auth-components";
// import GithubButton from "../components/github-btn";

interface IFormInput {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async ({ email, password }) => {
    setError("");
    if (isLoading) return;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
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
      <Title>지금 일어나고 있는 일을 확인하세요.</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("email", { required: true })}
          placeholder="이메일"
          type="email"
          required
        />
        {errors.email && <Error>{errors.email.message}</Error>}

        <Input
          {...register("password", { required: true })}
          placeholder="비밀번호"
          type="password"
          required
        />
        {errors.password && <Error>{errors.password.message}</Error>}

        <Input
          type="submit"
          value={isLoading ? "로딩중..." : "로그인"}
        />
      </Form>
      {error && <Error>{error}</Error>}
      <Switcher>
        계정이 없으세요? <StyledLink to="/create-account">트위터에 가입하세요.</StyledLink>
      </Switcher>
      <Switcher>
        비밀번호를 잊으셨나요? <StyledLink to="/change-password">비밀번호 변경</StyledLink>
      </Switcher>
      {/* <GithubButton /> */}
    </Wrapper>
  );
}
