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
    Stack,
    Alert,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';

import RefreshIcon from '@mui/icons-material/Refresh';
import useQuotes, { Quote } from '../../hooks/UseQuotes/UseQuotes';
import ViewSelectedQuote from './ViewSelectedQuote';
import EditSelectedQuote from './EditSelectedQuote';

const QuotesRecordView = () => {
    const theme = useTheme();
    const [search, setSearch] = useState('');
    const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
    const [quoteToEdit, setQuoteToEdit] = useState<Quote | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [diagnosticName, setDiagnosticName] = useState('');
    const [technician, setTechnician] = useState('');
    const [comments, setComments] = useState('');
    const [total, setTotal] = useState('');
    const { quotes, loading, error, fetchQuotes, fetchQuote, createQuote, deleteQuote } = useQuotes();

    const handleCreate = async () => {
        if (!diagnosticName.trim()) return;

        await createQuote({
            DiagnosticName: [diagnosticName.trim()],
            DiagnosticTechinician: technician.trim() || undefined,
            DiagnosticComments: comments.trim() ? [comments.trim()] : undefined,
            DiagnosticTotal: total === '' ? undefined : Number(total),
        });
        setDiagnosticName('');
        setTechnician('');
        setComments('');
        setTotal('');
        setCreateOpen(false);
    };

    const filteredQuotes = (Array.isArray(quotes) ? quotes : []).filter((quote) =>
        `${quote._id ?? ''} ${quote.DiagnosticName.join(' ')} ${quote.DiagnosticTechinician ?? ''} ${quote.DiagnosticComments?.join(' ') ?? ''}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

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
                    <IconButton color="primary" onClick={() => void fetchQuotes()} aria-label="refresh quotes">
                        <RefreshIcon />
                    </IconButton>
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                    <Button variant="contained" onClick={() => setCreateOpen(true)}>
                        Nueva cotización
                    </Button>
                    <TextField
                        size="small"
                        placeholder="Buscar cotización..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Stack>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {loading && <CircularProgress size={24} sx={{ display: 'block', mx: 'auto', mb: 2 }} />}

            {filteredQuotes.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 4, color: theme.palette.text.secondary }}>
                    No hay datos para mostrar
                </Typography>
            ) : (
                <TableContainer sx={{ maxHeight: 800, overflow: 'auto' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Cliente</TableCell>
                                <TableCell>Vehículo</TableCell>
                                <TableCell>Modelo</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Estado</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredQuotes.map((quote) => (
                                <TableRow key={quote._id}>
                                    <TableCell>{quote._id ?? '—'}</TableCell>
                                    <TableCell>{String(quote.ClientDetails?.[0]?.name ?? '—')}</TableCell>
                                    <TableCell>{String(quote.VehicleDetails?.[0]?.VehicleName ?? '—')}</TableCell>
                                    <TableCell>{String(quote.VehicleDetails?.[0]?.VehicleModel ?? '—')}</TableCell>
                                    <TableCell>{quote.DiagnosticTotal == null ? '—' : `₡${quote.DiagnosticTotal.toLocaleString()}`}</TableCell>
                                    <TableCell>{quote.DiagnosticValid ? 'Aceptada' : 'Pendiente'}</TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            disabled={!quote._id || loading}
                                            onClick={async () => {
                                                if (quote._id) setSelectedQuote(await fetchQuote(quote._id));
                                            }}
                                        >
                                            Ver
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            disabled={!quote._id || loading}
                                            onClick={() => setQuoteToEdit(quote)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            disabled={!quote._id || loading}
                                            onClick={() => {
                                                if (quote._id && window.confirm('¿Eliminar esta cotización?')) {
                                                    void deleteQuote(quote._id);
                                                }
                                            }}
                                        >
                                            Eliminar
                                        </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <ViewSelectedQuote
                open={Boolean(selectedQuote)}
                data={selectedQuote}
                onClose={() => setSelectedQuote(null)}
            />

            <EditSelectedQuote
                open={Boolean(quoteToEdit)}
                data={quoteToEdit}
                onClose={() => setQuoteToEdit(null)}
                onSaved={() => {
                    setQuoteToEdit(null);
                    void fetchQuotes();
                }}
            />

            <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Nueva cotización</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        <TextField
                            label="Diagnóstico"
                            value={diagnosticName}
                            onChange={(e) => setDiagnosticName(e.target.value)}
                            required
                            autoFocus
                        />
                        <TextField
                            label="Técnico"
                            value={technician}
                            onChange={(e) => setTechnician(e.target.value)}
                        />
                        <TextField
                            label="Comentarios"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            multiline
                            minRows={2}
                        />
                        <TextField
                            label="Total"
                            type="number"
                            value={total}
                            onChange={(e) => setTotal(e.target.value)}
                            slotProps={{ htmlInput: { min: 0 } }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateOpen(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={() => void handleCreate()} disabled={!diagnosticName.trim() || loading}>
                        Crear
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default QuotesRecordView;
