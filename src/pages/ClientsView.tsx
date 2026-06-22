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
import ClientsRecords from '../components/Clients/ClientsRecords';

export default function ClientsView() {
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);


    return (

        //first layer
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
                            Modulo de clientes
                        </Typography>
                    </Box>

                    {/* DERECHA */}
                    <ThemeToggle />
                </Box>

                {/* MAIN WINDOW */}

                <ClientsRecords />

            </Box>
        </Box>
    );
}