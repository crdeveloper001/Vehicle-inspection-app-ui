import { useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import Sidebar from '../components/Sidebar/SideBar';
import ThemeToggle from '../components/themeToggle/ThemeToggle';
import ReportsRecords from '../components/Reports/ReportRecords';

export default function ReportsView() {
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <Box display="flex"
            sx={{
                flex: 1,
                backgroundColor: theme.palette.background.default,
                minHeight: '100vh',
            }}>
            <Sidebar
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <Box
                sx={{
                    flex: 1,
                    backgroundColor: theme.palette.background.default,
                    minHeight: '100vh',
                    p: 2,
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Box display="flex" alignItems="center">
                        <IconButton
                            onClick={() => setMobileOpen(true)}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            <MenuIcon sx={{ color: theme.palette.text.primary }} />
                        </IconButton>

                        <Typography color={theme.palette.text.primary} ml={1}>
                            Modulo de reportes
                        </Typography>
                    </Box>

                    <ThemeToggle />
                </Box>

                <ReportsRecords />

            </Box>
        </Box>
    );
}
