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

import RefreshIcon from '@mui/icons-material/Refresh';

interface QuoteType {
    id: string;
    quoteNumber: string;
    clientName: string;
    vehicle: string;
    total: string;
    status: string;
}

const mockQuotes: QuoteType[] = [
    {
        id: '1',
        quoteNumber: 'Q-2026-001',
        clientName: 'Juan Pérez',
        vehicle: 'Toyota Corolla 2019',
        total: '₡450,000',
        status: 'Pendiente',
    },
    {
        id: '2',
        quoteNumber: 'Q-2026-002',
        clientName: 'María Gómez',
        vehicle: 'Honda Civic 2020',
        total: '₡530,000',
        status: 'Aceptada',
    },
];

const QuotesRecordView = () => {
    const theme = useTheme();
    const [search, setSearch] = useState('');
    const [quotes, setQuotes] = useState<QuoteType[]>(mockQuotes);

    const filteredQuotes = quotes.filter((quote) =>
        `${quote.quoteNumber} ${quote.clientName} ${quote.vehicle} ${quote.status}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const handleRefresh = () => {
        setQuotes(mockQuotes);
    };

    return (
        <Paper
            sx={{
                minHeight: '80vh',
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">
                    Cotizaciones Registradas
                    <IconButton color="primary" onClick={handleRefresh} aria-label="refresh quotes">
                        <RefreshIcon />
                    </IconButton>
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                        size="small"
                        placeholder="Buscar cotización..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button variant="contained" size="small">
                        Nueva cotización
                    </Button>
                </Stack>
            </Stack>

            {filteredQuotes.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 4, color: theme.palette.text.secondary }}>
                    No hay datos para mostrar
                </Typography>
            ) : (
                <TableContainer sx={{ maxHeight: 800, overflow: 'auto' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Número de cotización</TableCell>
                                <TableCell>Cliente</TableCell>
                                <TableCell>Vehículo</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredQuotes.map((quote) => (
                                <TableRow key={quote.id}>
                                    <TableCell>{quote.quoteNumber}</TableCell>
                                    <TableCell>{quote.clientName}</TableCell>
                                    <TableCell>{quote.vehicle}</TableCell>
                                    <TableCell>{quote.total}</TableCell>
                                    <TableCell>{quote.status}</TableCell>
                                    <TableCell align="right">
                                        <Button variant="outlined" size="small">
                                            Ver
                                        </Button>
                                        <Button variant="outlined" size="small" sx={{ ml: 1 }}>
                                            Editar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
};

export default QuotesRecordView;
