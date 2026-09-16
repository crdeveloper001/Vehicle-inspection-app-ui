import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	TextField,
} from '@mui/material';
import { Quote } from '../../hooks/UseQuotes/UseQuotes';
import useQuotes from '../../hooks/UseQuotes/UseQuotes';

interface ViewSelectedQuoteProps {
	open: boolean;
	data: Quote | null;
	onClose: () => void;
}

const formatLabel = (key: string) =>
	key
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/^./, (character) => character.toUpperCase());

const formatValue = (value: unknown) => {
	if (value == null || value === '') return '—';
	if (typeof value === 'object') return JSON.stringify(value, null, 2);
	return String(value);
};

const ViewSelectedQuote = ({ open, data, onClose }: ViewSelectedQuoteProps) => {
	const { downloadQuoteReport, loading } = useQuotes({ autoFetch: false });

	const handleDownloadReport = async () => {
		if (!data?._id) return;

		const report = await downloadQuoteReport(data._id);
		const url = URL.createObjectURL(report);
		const link = document.createElement('a');
		link.href = url;
		link.download = `quote-report-${data._id}.pdf`;
		link.click();
		URL.revokeObjectURL(url);
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
			<DialogTitle>Detalle de cotización</DialogTitle>
			<DialogContent dividers>
				{data && (
					<Grid container spacing={2} sx={{ pt: 1 }}>
						{Object.entries(data).map(([key, value]) => (
							<Grid
								size={{ xs: 12, sm: typeof value === 'object' ? 12 : 6 }}
								key={key}
							>
								<TextField
									fullWidth
									multiline={typeof value === 'object'}
									minRows={typeof value === 'object' ? 3 : undefined}
									label={formatLabel(key)}
									value={formatValue(value)}
									slotProps={{ input: { readOnly: true } }}
								/>
							</Grid>
						))}
					</Grid>
				)}
			</DialogContent>
			<DialogActions>
				<Button
					onClick={handleDownloadReport}
					disabled={!data?._id || loading}
				>
					{loading ? 'Descargando...' : 'Descargar reporte'}
				</Button>
				<Button onClick={onClose}>Cerrar</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ViewSelectedQuote;
