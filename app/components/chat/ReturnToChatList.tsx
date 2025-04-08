import Link from 'next/link';
import { Typography } from "@mui/material";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";

export default function ReturnToChatList() {

    return (
      <div className="absolute hover:scale-110 left-0 top-24 p-4 w-fit">
        <Link href="/" className="flex items-center space-x-2">
          <ArrowBackIosNew />
          <Typography variant="h6">Back to Chat List</Typography>
        </Link>
      </div>
    );
}
