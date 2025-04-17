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
    <div className={clsx("fixed hover:scale-110 transition-transform left-2 top-20 md:top-30 p-2 md:p-4 lg:text-nowrap", {
      hidden: isHomePage
    })}>
      <Link 
        href="/" 
        className="flex items-center space-x-1 md:space-x-2 bg-gray-700 rounded-lg px-2 py-1 md:py-2 md:px-3 hover:bg-gray-600"
      >
        <ArrowBackIosNew fontSize="small" sx={{ fontSize: { xs: '0.875rem', md: '1.25rem' } }} />
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontSize: { xs: '0.875rem', md: '1.25rem' },
            display: { xs: 'none', lg: 'block' }
          }}
        >
          Back to Chats
        </Typography>
      </Link>
    </div>
  );
}
