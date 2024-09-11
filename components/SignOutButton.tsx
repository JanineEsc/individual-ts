'use client'

import { Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/config"


const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    

    try {
      await signOut(auth);
      console.log("Signed out");
      router.push("/"); // Redirect to home page after sign-out
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
};

export default SignOutButton;