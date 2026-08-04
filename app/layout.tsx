import type { Metadata } from "next";
import "./globals.css";
import "./dark-mode.css";

export const metadata: Metadata = {
  title: "갯벌로그 | 부산 바다 관찰 도감",
  description: "사진으로 기록하는 모바일 중심 갯벌 생물 관찰 도감입니다.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
