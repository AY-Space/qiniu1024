"use client";

import {
  Button,
  Card,
  Container,
  FormControl,
  FormLabel,
  Input,
  Snackbar,
  Stack,
  Typography,
} from "@mui/joy";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { sleep } from "../utils";
import Link from "next/link";

export default function SignInPage() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await (async () => {
      setSubmitting(true);
      const result = await signIn("credentials", {
        ...credentials,
        redirect: false,
      });
      if (result?.ok) {
        setSuccess(true);
        await sleep(1000);
        location.replace("/video");
      } else {
        setError(!result?.ok);
      }
      setSubmitting(false);
    })();
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - var(--volo-app-bar-height))",
      }}
    >
      <Card
        sx={{
          p: 5,
          width: 0o600,
        }}
      >
        <Stack
          spacing={4}
          sx={{
            width: 1,
          }}
          component="form"
          alignItems="center"
          onSubmit={handleSubmit}
        >
          <Stack alignItems="center" spacing={1}>
            <Typography level="h4">登录 Volo</Typography>
          </Stack>
          <Stack
            spacing={3}
            sx={{
              width: 1,
              maxWidth: 0o450,
            }}
          >
            <FormControl>
              <FormLabel>邮箱</FormLabel>
              <Input
                fullWidth
                required
                value={credentials.email}
                onChange={(event) => {
                  setCredentials({
                    ...credentials,
                    email: event.target.value,
                  });
                }}
                error={error}
              />
            </FormControl>
            <FormControl>
              <FormLabel>密码</FormLabel>
              <Input
                type="password"
                autoComplete="current-password"
                fullWidth
                required
                value={credentials.password}
                onChange={(event) => {
                  setCredentials({
                    ...credentials,
                    password: event.target.value,
                  });
                }}
                error={error}
              />
            </FormControl>
          </Stack>

          <Link href="/signup">新来乍到？点击注册！</Link>

          <Button
            type="submit"
            sx={{
              width: 0o160,
            }}
            variant="soft"
            loading={submitting}
          >
            登录
          </Button>
        </Stack>
      </Card>
      <Snackbar
        variant="solid"
        color="success"
        autoHideDuration={1600}
        open={success}
        onClose={() => setSuccess(false)}
      >
        登录成功
      </Snackbar>
      <Snackbar
        variant="solid"
        color="danger"
        autoHideDuration={1600}
        open={error}
        onClose={() => setError(false)}
      >
        登录失败，请检查输入内容或网络环境
      </Snackbar>
    </Container>
  );
}
