import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
  avatar?: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Timeline() {
  const [tweets, setTweet] = useState<ITweet[]>([]);
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(collection(db, "tweets"), orderBy("createdAt", "desc"), limit(25));
      // const snapshot = await getDocs(tweetsQuery);
      // const tweets = snapshot.docs.map((doc) => {
      //   const { tweet, createdAt, userId, username, photo } = doc.data();
      //   return { tweet, createdAt, userId, username, photo, id: doc.id };
      // });

      // onSnapshot: doc이 편집, 수정될 때마다 query를 바로 받아옴
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo, avatar } = doc.data();
          return { tweet, createdAt, userId, username, photo, id: doc.id, avatar };
        });
        setTweet(tweets);
      });
    };
    fetchTweets();
    return () => {
      // 유저가 타임라인을 보고 있을 때만 이벤트를 발생시키기 위해 cleanup을 사용
      // 타임라인에 들어올 때 구독되고 타임라인에서 나가면 unsubscribe 함
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet
          key={tweet.id}
          {...tweet}
        />
      ))}
    </Wrapper>
  );
}
