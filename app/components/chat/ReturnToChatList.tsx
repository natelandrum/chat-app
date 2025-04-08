"use client";

import { usePathname } from 'next/navigation';

import Link from 'next/link';
import { Typography } from "@mui/material";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default function ReturnToChatList() {
  const pathname = usePathname();
  const [isHomePage, setIsHomePage] = useState(false);

  useEffect(() => {
    setIsHomePage(pathname === "/");
  }, [pathname]);

    return (
      <div className={clsx("absolute hover:scale-110 left-0 top-24 p-4 w-fit", {
        hidden: isHomePage
      })}>
        <Link href="/" className="flex items-center space-x-2">
          <ArrowBackIosNew />
          <Typography variant="h6">Back to Chat List</Typography>
        </Link>
      </div>
    );
}
