import { useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    useTheme,
    Grid,
    Item
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import Sidebar from '../components/Sidebar/SideBar';
import ThemeToggle from '../components/themeToggle/ThemeToggle';
import MyProfileEditor from '../components/Profile/ProfileEditor';
import type User from '../interfaces/User';

export default function MyProfileView() {
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);

    const storedUser = sessionStorage.getItem("user");

    const userSessionData: User | null = storedUser
        ? JSON.parse(storedUser)
        : null;
    return (
        <>


            <Box display="flex"
                sx={{
                    flex: 1,
                    backgroundColor: theme.palette.background.default,
                    minHeight: "100vh",
                }}>
                <Sidebar
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                />

                <Box
                    sx={{
                        flex: 1,
                        backgroundColor: theme.palette.background.default,
                        minHeight: "100vh",
                        p: 2,
                    }}
                >

                    {/* TOP MOBILE */}
                    {/*third layer */}
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                    >
                        {/* IZQUIERDA */}
                        <Box display="flex" alignItems="center">
                            <IconButton
                                onClick={() => setMobileOpen(true)}
                                sx={{ display: { xs: "block", md: "none" } }}
                            >
                                <MenuIcon sx={{ color: theme.palette.text.primary }} />
                            </IconButton>

                            <Typography color={theme.palette.text.primary} ml={1}>
                                My Profile
                            </Typography>
                        </Box>

                        {/* DERECHA */}
                        <ThemeToggle />
                    </Box>

                    {/* MAIN WINDOW */}
                    
                    <MyProfileEditor user={userSessionData} />

                </Box>
            </Box>
        </>
    )


}