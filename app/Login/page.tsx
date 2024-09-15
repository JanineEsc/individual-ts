'use client'

import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";




const login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  // Denna funktion används för att logga in en användare med e-post och lösenord.

  const handleLogin = async () => {
    try {
      const auth = getAuth() // hämtar autentiseringsinstansen från firebase som används för att hantera inloggning
      await signInWithEmailAndPassword(auth, email, password) // signIngWithEmailAndPassword är en firebase-funktion som loggar in en användare med e-post och lösenord
      
      setError("")
      console.log("Login suceeded")

      router.push("/") //navigate to homepage
      
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An error occured")
      }
      console.log("Login failed", error)
    }
  } 



  return (

    <>
    <Container maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          mt: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
          <LockOutlined />
        </Avatar>
        <Typography variant="h5">Login</Typography>
        <Box component="form" onSubmit={(error) => {error.preventDefault(), handleLogin()}}sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
          >
            Login
          </Button>
          {error && <Typography color="error">{error}</Typography>}
          <Grid container justifyContent={"flex-end"}>
            <Grid item>
              <Link href="Register"> Don't have a account? Register here</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  </>
  )
}
export default login