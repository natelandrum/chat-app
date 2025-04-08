import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
export default function Loading() {
  return (
    <Box className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <CircularProgress />
    </Box>
  );
}