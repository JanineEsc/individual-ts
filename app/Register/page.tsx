'use client'


import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,

}from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import React, { useState } from "react";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {  addDoc, collection, getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth } from '@/firebase/config'



const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  
 
  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      const db = getFirestore()
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: name,
        email: email
      })

      setSuccess(true)
      setError("")
      
      console.log("Registration succesful", user.uid)

      router.push("/Login") 

    } catch (error) { 
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An error occured")
      }
      setSuccess(false) 
      console.log("Registration failed", error)
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
        <Typography variant="h5">Register</Typography>
        <Box component="form" onSubmit={(e) => {e.preventDefault(), handleRegister()} }sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            type="submit" 
          >
            Register
          </Button>
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success">Registration successful</Typography>}
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/Login">Already have an account? Login</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  </>
  );
};

export default Register;



