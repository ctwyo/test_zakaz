"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // для редиректа
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import Script from "next/script";
import { useUser } from "@/app/components/UserContext";

const AuthPage = () => {
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const router = useRouter();
  const { user, setUser } = useUser() || {};

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ✅ 3. Если токенов нет — запрашиваем данные из Telegram
        if (!window.Telegram || !window.Telegram.WebApp) {
          setAccessDenied(true);
          return;
        }

        const initData = window.Telegram.WebApp.initData;
        if (!initData) {
          setAccessDenied(true);
          return;
        }

        // ✅ 4. Последний вариант — запрос к MongoDB
        const verifyRes = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData }),
        });

        const result = await verifyRes.json();
        console.log(`RESULT ${JSON.stringify(result)}`);
        if (result.success) {
          setUser(result.user);
        } else {
          setAccessDenied(true);
        }
      } catch {
        setAccessDenied(true);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    if (user) {
      router.push("/");
    }
  }, []);

  // useEffect(() => {
  //   if (user) {
  //     router.push("/"); // Редиректим на главную страницу, когда пользователь успешно авторизован
  //   }
  // }, [user, router]);

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js?56"
        strategy="beforeInteractive"
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Paper
          sx={{
            padding: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : accessDenied ? (
            <Typography variant="h6" color="error">
              ❌ Доступ запрещён
            </Typography>
          ) : (
            <Typography variant="h6">🔄 Перенаправление...</Typography>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default AuthPage;
