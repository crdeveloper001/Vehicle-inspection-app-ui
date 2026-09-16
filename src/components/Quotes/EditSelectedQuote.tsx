import { useEffect, useState } from 'react';
import {
	Alert,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	MenuItem,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { Quote } from '../../hooks/UseQuotes/UseQuotes';
import useQuotes from '../../hooks/UseQuotes/UseQuotes';

interface EditSelectedQuoteProps {
	open: boolean;
	data: Quote | null;
	onClose: () => void;
	onSaved?: (quote: Quote) => void;
}

const formatLabel = (key: string) =>
	key
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/^./, (character) => character.toUpperCase());

const isComplex = (value: unknown) => typeof value === 'object' && value !== null;

const displayValue = (value: unknown) => {
	if (value == null) return '';
	return String(value);
};

const parseValue = (value: string, original: unknown): unknown => {
	if (typeof original === 'number') return value === '' ? undefined : Number(value);
	if (typeof original === 'boolean') return value === 'true';
	return value;
};

const normalizedPath = (path: string) => path.toLowerCase().replace(/[^a-z0-9]/g, '');

const isGeneratedField = (path: string) => {
	const name = normalizedPath(path);
	return (
		name === 'id' ||
		name.endsWith('id') ||
		name.includes('createdat') ||
		name.includes('updatedat') ||
		name === 'date' ||
		name.endsWith('date') ||
		name.includes('timestamp')
	);
};

const isAutomaticDetail = (path: string) => {
	const name = normalizedPath(path);
	return (
		(name.includes('client') || name.includes('customer') || name.includes('vehicle') || name.includes('car')) &&
		!name.includes('comment') &&
		!name.includes('spare')
	);
};

const isDiagnosticText = (path: string) => {
	const name = normalizedPath(path);
	return (
		(name.includes('diagnostic') || name.includes('diagnosis')) &&
		(name.includes('comment') || name.includes('spare') || name.includes('part'))
	);
};

const getFields = (value: unknown, path = ''): Array<{ path: string; value: unknown }> => {
	if (!isComplex(value)) return [{ path, value }];
	return Object.entries(value).flatMap(([key, child]) =>
		getFields(child, path ? `${path}.${key}` : key),
	);
};

const setNestedValue = (target: Record<string, unknown>, path: string, value: unknown) => {
	const parts = path.split('.');
	let current: Record<string, unknown> | unknown[] = target;
	parts.forEach((part, index) => {
		if (index === parts.length - 1) {
			if (Array.isArray(current)) current[Number(part)] = value;
			else current[part] = value;
			return;
		}
		const next = /^\d+$/.test(parts[index + 1]);
		if (Array.isArray(current)) {
			current[Number(part)] ??= next ? [] : {};
			current = current[Number(part)] as Record<string, unknown> | unknown[];
		} else {
			current[part] ??= next ? [] : {};
			current = current[part] as Record<string, unknown> | unknown[];
		}
	});
};

const EditSelectedQuote = ({
	open,
	data,
	onClose,
	onSaved,
}: EditSelectedQuoteProps) => {
	const { updateQuote, loading, error } = useQuotes({ autoFetch: false });
	const [form, setForm] = useState<Record<string, string>>({});
	const [formError, setFormError] = useState<string | null>(null);

	useEffect(() => {
		if (!data) {
			setForm({});
			return;
		}
		setForm(
			Object.fromEntries(
				getFields(data).map(({ path, value }) => [path, displayValue(value)]),
			),
		);
		setFormError(null);
	}, [data]);

	const handleChange = (key: string, value: string) => {
		setForm((current) => ({ ...current, [key]: value }));
		setFormError(null);
	};

	const handleSubmit = async () => {
		if (!data?._id) return;
		try {
			const payloadData = structuredClone(data) as unknown as Record<string, unknown>;
			delete payloadData._id;
			delete payloadData.createdAt;
			delete payloadData.updatedAt;
			getFields(payloadData).forEach(({ path, value }) => {
				setNestedValue(payloadData, path, parseValue(form[path] ?? '', value));
			});
			const payload = payloadData as Partial<Quote>;
			const saved = await updateQuote(data._id, payload);
			onSaved?.(saved);
			onClose();
		} catch (submissionError) {
			setFormError(
				submissionError instanceof Error ? submissionError.message : 'No se pudo guardar la cotización',
			);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			maxWidth="md"
			slotProps={{
				paper: {
					sx: {
						borderRadius: 3,
						bgcolor: 'background.paper',
						color: 'text.primary',
					},
				},
			}}
		>
			<DialogTitle sx={{ px: { xs: 3, sm: 4 }, pt: 3 }}>
				<Typography variant="overline" color="primary" fontWeight={700}>
					Cotizaciones
				</Typography>
				<Typography variant="h5" fontWeight={700}>Editar cotización</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
					Actualiza los datos y guarda los cambios cuando termines.
				</Typography>
			</DialogTitle>
			<DialogContent
				dividers
				sx={{
					px: { xs: 3, sm: 4 },
					py: 3,
					bgcolor: 'background.default',
					borderColor: 'divider',
				}}
			>
				<Stack spacing={2}>
					{(formError || error) && <Alert severity="error">{formError || error}</Alert>}
					{data && (
						<Grid container spacing={2}>
							{getFields(data).map(({ path, value: original }) => {
								const readOnly = isGeneratedField(path) || isAutomaticDetail(path);
								const isBoolean = typeof original === 'boolean';
								const multiline = isDiagnosticText(path);
								return (
									<Grid size={{ xs: 12, sm: multiline ? 12 : 6 }} key={path}>
										<TextField
											fullWidth
											select={isBoolean}
											multiline={multiline}
											minRows={multiline ? 4 : undefined}
											maxRows={multiline ? 10 : undefined}
											label={path.split('.').map(formatLabel).join(' / ')}
											value={form[path] ?? ''}
											onChange={(event) => handleChange(path, event.target.value)}
											disabled={readOnly || loading}
											helperText={readOnly ? 'Generado automáticamente' : multiline ? 'Añade cada detalle en una línea separada.' : undefined}
										>
											{isBoolean && <MenuItem value="true">Sí</MenuItem>}
											{isBoolean && <MenuItem value="false">No</MenuItem>}
										</TextField>
									</Grid>
								);
							})}
						</Grid>
					)}
				</Stack>
			</DialogContent>
			<DialogActions sx={{ px: { xs: 3, sm: 4 }, py: 2.5, gap: 1 }}>
				<Button onClick={onClose} disabled={loading} color="inherit">Cancelar</Button>
				<Button onClick={handleSubmit} variant="contained" disabled={!data?._id || loading} sx={{ borderRadius: 2, px: 3 }}>
					{loading ? 'Guardando...' : 'Guardar cambios'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EditSelectedQuote;
