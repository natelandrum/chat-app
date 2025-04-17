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
      <div className="flex flex-col md:flex-row justify-between items-center p-4 md:p-4 bg-gray-800 text-white">
        <Link href="/">
          <div className="relative w-full flex justify-center md:justify-center items-center text-xl md:text-2xl mb-3 md:mb-0">
            <div className="absolute left-0 top-0 md:relative md:left-auto md:top-auto">
              {session ? <ReturnToChatList /> : null}
            </div>
            <Image
              src="/logo.png"
              alt="Chat App logo"
              width={60}
              height={60}
              priority
              style={{
                height: "auto",
              }}
              className="w-[50px] h-[50px] md:w-[80px] md:h-[80px]"
            />
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                letterSpacing: ".2rem",
                marginLeft: "10px",
                fontSize: { xs: "1.5rem", md: "2.125rem" },
              }}
            >
              Chat App
            </Typography>
          </div>
        </Link>
        {session ? (
          <div className="relative flex w-full mt-2 md:mt-0">
            <SignOutButton />
            <OpenNewChatModal />
            <NewChatModal />
          </div>
        ) : null}
      </div>
    );
}