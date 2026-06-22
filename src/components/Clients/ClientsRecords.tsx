//import 
import { useState } from 'react';
import {
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

import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import RefreshIcon from '@mui/icons-material/Refresh';

import AddClient from './AddClient';
import ViewClientsDetails from './ViewClientsDetails';
import EditSelectedClient from './EditSelectedClient';
import { useClients } from '../../hooks/UseClients/UseClients';
import { ClientType } from '../../interfaces/Clients';

const ClientsRecords = () => {
    const theme = useTheme();
    const [search, setSearch] = useState('');
    const [editOpen, setEditOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const { clients, selectedClient, deleteClient, setSelectedClient, fetchClients } = useClients();

    const filteredClients = clients.filter((c: ClientType) =>
        `${c.name} ${c.lastname}`.toLowerCase().includes(search.toLowerCase())
    );

    const handleWhatsApp = (phone: string) => {
        const url = `https://wa.me/506${phone}`;
        window.open(url, '_blank');
    };

    const handleRefresh = () => {
       
        fetchClients();
    };

    const deleteHandler = (clientId: string) => {
        const confirm = window.confirm("¿Estás seguro de que deseas eliminar este cliente?");
        if (confirm) {
            deleteClient(clientId);
        }
    }

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
                    <Typography variant="h5">Clientes Registrados
                        <IconButton color="primary" onClick={handleRefresh} aria-label="refresh clients">
                            <RefreshIcon />
                        </IconButton>
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <TextField
                            size="small"
                            placeholder="Buscar cliente..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <AddClient />
                    </Stack>
                </Stack>
                {filteredClients.length === 0 ? (
                    <Typography variant="body1" sx={{ textAlign: 'center', py: 4, color: theme.palette.text.secondary }}>
                        No hay datos para mostrar
                    </Typography>
                ) : (
                    <TableContainer sx={{
                        maxHeight: 800, 
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
                                    <TableRow key={client._id}>
                                        <TableCell>{client.name} {client.lastname}</TableCell>
                                        <TableCell>{client.phone}</TableCell>
                                        <TableCell>{client.email}</TableCell>
                                        <TableCell align="center">
                                            <IconButton color="success" onClick={() => handleWhatsApp(client.phone)}>
                                                <WhatsAppIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button variant="outlined" size="small" onClick={() => {
                                                setSelectedClient(client);
                                                setEditOpen(true);
                                            }}>
                                                Editar
                                            </Button>
                                            <Button variant="outlined" size="small" onClick={() => deleteHandler(client._id)} sx={{ ml: 1 }}>
                                                Eliminar
                                            </Button>
                                            <Button variant="outlined" size="small" onClick={() => {
                                                setSelectedClient(client);
                                                setDetailsOpen(true);
                                            }} sx={{ ml: 1 }}>
                                                Detalles
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <EditSelectedClient
                    open={editOpen}
                    client={selectedClient}
                    onClose={() => setEditOpen(false)}
                    onSave={(updatedClient) => {
                        setSelectedClient(updatedClient);
                        setEditOpen(false);
                    }}
                />
                <ViewClientsDetails
                    open={detailsOpen}
                    client={selectedClient}
                    onClose={() => setDetailsOpen(false)}
                />
            </Paper>

        </>
    );
}

export default ClientsRecords;