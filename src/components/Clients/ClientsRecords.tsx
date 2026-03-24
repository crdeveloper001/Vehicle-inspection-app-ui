//import 
import React, { useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Paper,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme,
    Stack
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AddIcon from '@mui/icons-material/Add';


interface Client {
    id: number;
    name: string;
    lastname: string;
    phoneNumber: string;
    email: string;
}

const ClientsRecords = () => {
    const theme = useTheme();
    const [search, setSearch] = useState('');

    // MOCK DATA (luego lo conectas a tu API)
    const [clients] = useState<Client[]>([
        { id: 1, name: 'Claudio Josue', lastname: 'Gonzalez Hernandez', phoneNumber: '87987690', email: 'claudiogh33@gail.com' },
        { id: 2, name: 'Maria', lastname: 'Lopez', phoneNumber: '77777777', email: 'maria@mail.com' },
        { id: 3, name: 'Carlos', lastname: 'Ramirez', phoneNumber: '66666666', email: 'carlos@mail.com' },
        { id: 4, name: 'Ana', lastname: 'Martinez', phoneNumber: '55555555', email: 'ana@mail.com' },
        { id: 5, name: 'Diego', lastname: 'Vargas', phoneNumber: '44444444', email: 'diego@mail.com' },
        { id: 6, name: 'Sofia', lastname: 'Gonzalez', phoneNumber: '33333333', email: 'sofia@mail.com' },
        { id: 7, name: 'Pedro', lastname: 'Suarez', phoneNumber: '22222222', email: 'pedro@mail.com' },
        { id: 8, name: 'Lucia', lastname: 'Fernandez', phoneNumber: '11111111', email: 'lucia@mail.com' },
        { id: 9, name: 'Miguel', lastname: 'Herrera', phoneNumber: '99999999', email: 'miguel@mail.com' },
        { id: 10, name: 'Valeria', lastname: 'Rojas', phoneNumber: '10101010', email: 'valeria@mail.com' },
        { id: 11, name: 'Fernando', lastname: 'Castro', phoneNumber: '12121212', email: 'fernando@mail.com' },
        { id: 12, name: 'Gabriela', lastname: 'Muñoz', phoneNumber: '13131313', email: 'gabriela@mail.com' },
        { id: 13, name: 'Javier', lastname: 'Núñez', phoneNumber: '14141414', email: 'javier@mail.com' },
        { id: 14, name: 'Paola', lastname: 'Díaz', phoneNumber: '15151515', email: 'paola@mail.com' },
        { id: 15, name: 'Andrés', lastname: 'Paredes', phoneNumber: '16161616', email: 'andres@mail.com' },
        { id: 16, name: 'Camila', lastname: 'Riviera', phoneNumber: '17171717', email: 'camila@mail.com' },
        { id: 17, name: 'Hector', lastname: 'Luna', phoneNumber: '18181818', email: 'hector@mail.com' },
        { id: 18, name: 'Natalia', lastname: 'Suárez', phoneNumber: '19191919', email: 'natalia@mail.com' },
        { id: 19, name: 'Ricardo', lastname: 'Cruz', phoneNumber: '20202020', email: 'ricardo@mail.com' },
        { id: 20, name: 'Mónica', lastname: 'Pérez', phoneNumber: '21212121', email: 'monica@mail.com' },
    ]);

    const filteredClients = clients.filter(c =>
        `${c.name} ${c.lastname}`.toLowerCase().includes(search.toLowerCase())
    );

    const handleWhatsApp = (phone: string) => {
        const url = `https://wa.me/506${phone}`;
        window.open(url, '_blank');
    };


    return (
        <>

            {/* MAIN WINDOW */}
            <Paper
                sx={{
                    minHeight: "80vh",
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    p: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5">Clientes Registrados</Typography>
                    <Stack direction="row" spacing={1}>
                        <TextField
                            size="small"
                            placeholder="Buscar cliente..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => alert('Agregar cliente')}>
                            Agregar Cliente
                        </Button>
                    </Stack>
                </Stack>
                <TableContainer sx={{
                    maxHeight: 800, // 👈 altura límite
                    overflow: 'auto'
                }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre Completo</TableCell>
                                <TableCell>Teléfono</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell align="center">Whatsapp Directo</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredClients.map(client => (
                                <TableRow key={client.id}>
                                    <TableCell>{client.name} {client.lastname}</TableCell>
                                    <TableCell>{client.phoneNumber}</TableCell>
                                    <TableCell>{client.email}</TableCell>
                                    <TableCell align="center">
                                        <IconButton color="success" onClick={() => handleWhatsApp(client.phoneNumber)}>
                                            <WhatsAppIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button variant="outlined" size="small" onClick={() => alert(`Editar cliente ${client.id}`)}>
                                            Editar
                                        </Button>
                                        <Button variant="outlined" size="small" onClick={() => alert(`Eliminar cliente ${client.id}`)} sx={{ ml: 1 }}>
                                            Eliminar
                                        </Button>
                                        <Button variant="outlined" size="small" onClick={() => alert(`Ver detalles cliente ${client.id}`)} sx={{ ml: 1 }}>
                                            Detalles
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

        </>
    );
}

export default ClientsRecords;