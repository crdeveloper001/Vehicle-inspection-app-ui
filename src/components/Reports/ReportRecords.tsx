import { useEffect, useState } from 'react';
import {
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    useTheme,
    Stack
    , TextField
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import RefreshIcon from '@mui/icons-material/Refresh';
import { PurchaseReport } from '../../interfaces/PurchaseReport';
import useReports from '../../hooks/UseReports/UseReports';
import CreateNewReport from './CreateNewReport';

// initial empty list; real data loaded from API via useReports
const mockReports: PurchaseReport[] = [];

const ReportRecords = () => {
    const theme = useTheme();
    const [reports, setReports] = useState<PurchaseReport[]>(mockReports);
    const [search, setSearch] = useState<string>('');
    const { getAllInspections } = useReports();

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getAllInspections();
                if (!mounted) return;
                // map InspectionRecord shape to PurchaseReport if necessary
                setReports(
                    (data as any[]).map((r) => ({
                        _id: r._id,
                        clientName: r.clientName,
                        plate: r.plate,
                        createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
                        conclusion: r.conclusion,
                    }))
                );
            } catch (e) {
                // keep silent; show no records
            }
        })();
        return () => {
            mounted = false;
        };
    }, [getAllInspections]);

    const filteredReports = reports.filter((report) => {
        const query = search.trim().toLowerCase();
        if (!query) return true;

        return [
            report._id,
            report.clientName,
            report.plate,
            report.conclusion,
        ]
            .filter(Boolean)
            .some((field) => field?.toString().toLowerCase().includes(query));
    });

    const formatDate = (value?: string | Date) => {
        if (!value) return '-';
        const date = typeof value === 'string' ? new Date(value) : value;
        return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
    };

    const handleRefresh = async () => {
        try {
            const data = await getAllInspections();
            setReports(
                (data as any[]).map((r) => ({
                    _id: r._id,
                    clientName: r.clientName,
                    plate: r.plate,
                    createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
                    conclusion: r.conclusion,
                }))
            );
        } catch (e) {
            // keep previous state on error
        }
    };

    return (
        <Paper
            sx={{
                minHeight: '80vh',
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Reportes Registrados
                    <IconButton color="primary" onClick={handleRefresh} aria-label="refresh clients">
                        <RefreshIcon />
                    </IconButton>
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <TextField
                        size="small"
                        placeholder="Buscar cliente..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                   <CreateNewReport onSave={(newReport) => setReports((prev) => [...prev, newReport])} />
                </Stack>
            </Stack>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Placa</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Conclusión</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredReports.map((report) => (
                            <TableRow key={report._id}>
                                <TableCell>{report._id}</TableCell>
                                <TableCell>{report.clientName || 'N/A'}</TableCell>
                                <TableCell>{report.plate || 'N/A'}</TableCell>
                                <TableCell>{formatDate(report.createdAt)}</TableCell>
                                <TableCell>{report.conclusion || 'Pendiente'}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Descargar Reporte">
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                // Open secured/dynamic API endpoint that returns the PDF
                                                if (!report._id) return; // ensure id exists
                                                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'https://vehicle-inspection-app-server.onrender.com';
                                                const url = `${API_BASE_URL}/api/inspections/${encodeURIComponent(String(report._id))}/pdf`;
                                                window.open(url, '_blank', 'noopener,noreferrer');
                                            }}
                                        >
                                            <DownloadIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Compartir informe">
                                        <IconButton
                                            size="small"
                                            onClick={async () => {
                                                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'https://vehicle-inspection-app-server.onrender.com';
                                                const url = `${API_BASE_URL}/api/inspections/${encodeURIComponent(String(report._id))}/pdf`;
                                                if ((navigator as any).share) {
                                                    try {
                                                        await (navigator as any).share({ title: 'Informe', url });
                                                    } catch (e) {
                                                        // ignore
                                                    }
                                                } else if (navigator.clipboard) {
                                                    try {
                                                        await navigator.clipboard.writeText(url);
                                                        alert('Enlace copiado al portapapeles');
                                                    } catch (e) {
                                                        alert(url);
                                                    }
                                                } else {
                                                    alert(url);
                                                }
                                            }}
                                        >
                                            <ShareIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar informe">
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                const ok = window.confirm('¿Eliminar este informe? Esta acción no se puede deshacer.');
                                                if (!ok) return;
                                                setReports((prev) => prev.filter((r) => r._id !== report._id));
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" color="error" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default ReportRecords;
