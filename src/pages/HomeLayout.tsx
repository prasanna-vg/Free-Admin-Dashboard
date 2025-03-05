import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Sidebar } from '../components';

const HomeLayout = () => {
  return (
    <Box display="flex" height="100vh" bgcolor="background.default">
      {/* <LandingV2 />
       */}
       <Sidebar></Sidebar>
      <Box flexGrow={1} bgcolor="background.default" overflow="auto" marginLeft={"220px"} marginTop={"50px"} marginBottom={"50px"}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default HomeLayout;