"use client";

import { Box } from "@mui/material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { setNewChatModalOpen } from "@/lib/redux/chat/chatSlice";
import { useDispatch } from "react-redux";

export default function OpenNewChatModal() {
    const dispatch = useDispatch();
    return (
      <div className="absolute right-0 top-2 md:top-24 p-2 md:p-4">
        <Box
          sx={{
            position: "relative",
            border: "2px solid #fff",
            borderRadius: "5px",
            borderTopRightRadius: "10px",
            width: "25px",
            height: "25px",
            color: "#fff",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.2)",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              borderTopRightRadius: "10px",
              top: -3,
              right: -3,
              width: "14px",
              height: "14px",
              backgroundColor: {
                xs: "#1E2939",
                md: "black",
              },
              zIndex: 1,
            },
          }}
        >
          <CreateOutlinedIcon
            fontSize="medium"
            sx={{
              position: "absolute",
              transform: "translate(10%, -25%)",
              cursor: "pointer",
              zIndex: 2,
            }}
            onClick={() => dispatch(setNewChatModalOpen(true))}
          />
        </Box>
      </div>
    );
}