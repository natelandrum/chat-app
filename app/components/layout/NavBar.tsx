import Link from "next/link";
import SignOutButton from "@/components/auth/SignOutButton";
import Image from "next/image";
import { auth } from "@/auth";
import { Typography } from "@mui/material";
import OpenNewChatModal from "@/components/chat/OpenNewChatModal";
import NewChatModal from "../chat/NewChatModal";
import ReturnToChatList from "../chat/ReturnToChatList";

export default async function NavBar() {
    const session = await auth();
    return (
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <Link href="/">
          <div className=" relative flex items-center text-2xl">
            {session ? <ReturnToChatList /> : null}
            <Image
              src="/logo.png"
              alt="Chat App logo"
              width={80}
              height={80}
              priority
              style={{
                height: "auto",
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                letterSpacing: ".2rem",
                marginLeft: "10px",
              }}
            >
              Chat App
            </Typography>
          </div>
        </Link>
        {session ? (
          <div className="relative">
            <SignOutButton />
            <OpenNewChatModal />
            <NewChatModal />
          </div>
        ) : null}
      </div>
    );
}