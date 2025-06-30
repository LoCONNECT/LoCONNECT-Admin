import Header from "@/features/Header";
import NotPc from "@/features/NotPc";
import Template from "@/layouts/Template";
import "@/styles/globals.css";
import axios from "axios";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Modal } from "antd";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import { useUserStore } from "@/store/useAdminStore";

export default function App({ Component, pageProps }: AppProps) {
  const [notPc, setNotPc] = useState(false);
  const router = useRouter();

  const loadUserProfile = useUserStore((state) => state.loadUserProfile);

  // 새로고침 시 토큰 기반으로 유저 정보 갱신
  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const isLoginPage = router.pathname === "/login";

  const token = Cookies.get("accessToken");

  // useEffect(() => {
  //   if (!token) router.push("/login");

  //   const handleResize = () => {
  //     if (window.innerWidth <= 1200) {
  //       setNotPc(true);
  //     } else {
  //       setNotPc(false);
  //     }
  //   };

  //   // 초기 width 확인
  //   handleResize();

  //   // resize 이벤트 리스너 추가
  //   window.addEventListener("resize", handleResize);

  //   // 컴포넌트 언마운트 시 이벤트 리스너 제거
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  // useEffect(() => {
  //   const checkAdmin = async () => {
  //     try {
  //       const res = await axios.get("http://15.164.52.122/auth/getRole", {
  //         withCredentials: true,
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       const role = res.data;

  //       console.log(role);

  //       if (role !== "admin") {
  //         Modal.error({
  //           centered: true,
  //           title: "접근이 제한되었습니다",
  //           content: "이 페이지는 관리자만 접근할 수 있습니다.",
  //           onOk: () => {
  //             Cookies.remove("accessToken");
  //             window.location.href = "http://13.125.95.215";
  //           },
  //           maskStyle: {
  //             backgroundColor: "#ffffff",
  //           },
  //           bodyStyle: {
  //             backgroundColor: "#ffffff",
  //           },
  //         });
  //       }
  //     } catch (error) {
  //       console.error("유저 정보 요청 실패:", error);
  //     }
  //   };

  //   if (token) checkAdmin();
  // }, [token]);

  return (
    <>
      <Head>
        <title>관리자</title>
      </Head>

      {notPc ? (
        <NotPc />
      ) : (
        <>
          <ThemeProvider theme={theme}>
            {/* 로그인 페이지가 아닐 때만 Header, Template 렌더 */}
            {!isLoginPage && <Header />}
            {!isLoginPage ? (
              <Template>
                <Component {...pageProps} />
              </Template>
            ) : (
              <Component {...pageProps} />
            )}
          </ThemeProvider>
        </>
      )}
    </>
  );
}
