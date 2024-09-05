import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export function formatTimestamp(createdAt: number) {
  const now = Date.now();
  const diffInMs = now - createdAt;
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  //   const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) {
    return `${diffInMinutes}분`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간`;
  } else {
    const date = new Date(createdAt);
    const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1
    const day = date.getDate();
    return `${month}월 ${day}일`;
  }
}

// 닉네임 캐싱

export const getCachedUserName = (userId: string): string => {
  const cachedName = localStorage.getItem(`username-${userId}`);
  return cachedName || "Anonymous";
};

export const setCachedUserName = (userId: string, name: string) => {
  localStorage.setItem(`username-${userId}`, name);
};

export const getUserNameById = async (userId: string): Promise<string> => {
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    return userData?.displayName || "Anonymous"; // 닉네임이 없는 경우 "Anonymous" 반환
  } else {
    return "no exists"; // 사용자 문서가 없는 경우
  }
};

// 아바타 캐싱

export const getCachedUserAvatar = (userId: string): string | null => {
  return localStorage.getItem(`avatar-${userId}`);
};

// 유저 아바타 캐시 저장
export const setCachedUserAvatar = (userId: string, avatarUrl: string) => {
  localStorage.setItem(`avatar-${userId}`, avatarUrl);
};

export const preloadImage = (url: string) => {
  const img = new Image();
  img.src = url;
};
