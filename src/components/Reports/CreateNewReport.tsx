import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import { PurchaseReport } from '../../interfaces/PurchaseReport';
import useReports from '../../hooks/UseReports/UseReports';

type PurchaseReportFormValues = Omit<PurchaseReport, '_id' | 'createdAt' | 'updatedAt'>;

type CreateNewReportProps = {
  onSave?: (report: PurchaseReportFormValues) => void;
  loading?: boolean;
  error?: string | null;
};

const initialFormState: PurchaseReportFormValues = {
  clientName: '',
  clientLastname: '',
  clientPhone: '',
  make: '',
  model: '',
  year: undefined,
  plate: '',
  vin: '',
  mileage: '',
  engineCondition: '',
  engineNotes: '',
  brakeCondition: '',
  brakeNotes: '',
  suspensionCondition: '',
  suspensionNotes: '',
  body: '',
  interior: '',
  tires: '',
  conclusion: '',
  createdBy: '',
};

const CreateNewReport = ({ onSave, loading = false, error = null }: CreateNewReportProps) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<PurchaseReportFormValues>(initialFormState);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [clientType, setClientType] = useState<'registered' | 'new'>('new');
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [clientSearchError, setClientSearchError] = useState<string | null>(null);
  const [clientSearchLoading, setClientSearchLoading] = useState(false);
  const { createInspectionAndPDF } = useReports();
  const saving = loading || isSaving;

  const handleOpen = () => {
    setSubmitError(null);
    setSuccessMessage(null);
    setClientType('new');
    setClientSearchQuery('');
    setClientSearchError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setValues(initialFormState);
    setSubmitError(null);
    setSuccessMessage(null);
    setClientType('new');
    setClientSearchQuery('');
    setClientSearchError(null);
  };

  const handleClientTypeChange = (type: 'registered' | 'new') => {
    setClientType(type);
    setClientSearchError(null);
    setClientSearchQuery('');

    if (type === 'new') {
      setValues(prev => ({
        ...prev,
        clientName: '',
        clientLastname: '',
        clientPhone: '',
      }));
    }
  };

  const handleSearchClient = async () => {
    setClientSearchError(null);
    setSubmitError(null);

    if (!clientSearchQuery.trim()) {
      setClientSearchError('Please enter a client name or phone to search.');
      return;
    }

    try {
      setClientSearchLoading(true);
      const query = clientSearchQuery.trim();
      const apiBase = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:3000';
      const response = await fetch(
        `${apiBase}/api/clients/search?name=${encodeURIComponent(query)}&phone=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error('Client not found.');
      }

      const clients: Array<Partial<PurchaseReportFormValues>> = await response.json();
      if (!Array.isArray(clients) || clients.length === 0) {
        throw new Error('Client not found.');
      }

      const clientData = clients[0];
      if (!clientData) {
        throw new Error('Client not found.');
      }

      // Accept various possible field names from the API
      const resolvedName =
        (clientData as any).clientName || (clientData as any).firstName || (clientData as any).name || '';
      const resolvedLastname =
        (clientData as any).clientLastname || (clientData as any).lastName || (clientData as any).lastname || '';
      const resolvedPhone =
        (clientData as any).clientPhone || (clientData as any).phone || (clientData as any).phoneNumber || '';

      if (!resolvedName && !resolvedLastname && !resolvedPhone) {
        throw new Error('Client not found.');
      }

      setValues(prev => ({
        ...prev,
        clientName: resolvedName || prev.clientName,
        clientLastname: resolvedLastname || prev.clientLastname,
        clientPhone: resolvedPhone || prev.clientPhone,
      }));
    } catch (searchError: any) {
      setClientSearchError(searchError?.message || 'Failed to retrieve client information.');
    } finally {
      setClientSearchLoading(false);
    }
  };

  const handleChange = (field: keyof PurchaseReportFormValues, value: string | number) => {
    setValues(prev => ({
      ...prev,
      [field]: field === 'year'
        ? typeof value === 'string'
          ? value
            ? Number(value)
            : undefined
          : value
        : value,
    }));
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setSuccessMessage(null);

    if (!values.clientName?.trim() || !values.clientLastname?.trim() || !values.make?.trim() || !values.model?.trim() || !values.plate?.trim()) {
      setSubmitError('Client name, last name, make, model and plate are required.');
      return;
    }

    const payload: PurchaseReportFormValues = {
      ...values,
      year: values.year,
    };

    try {
      setIsSaving(true);
      const pdfBlob = await createInspectionAndPDF(payload);

      if (pdfBlob && pdfBlob.size) {
        const downloadUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${values.plate || 'inspection-report'}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(downloadUrl);
      }

      if (onSave) {
        onSave(payload);
      }

      setSuccessMessage('Report saved and PDF downloaded successfully.');
      setValues(initialFormState);
      setOpen(false);
    } catch (saveError: any) {
      setSubmitError(saveError?.message || 'Failed to save report.');
    } finally {
      setIsSaving(false);
    }
  };

  const carBrands = [
    'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Hyundai', 'Kia',
    'Audi', 'Lexus', 'Subaru', 'Mazda', 'Jeep', 'Dodge', 'Ram', 'GMC', 'Tesla', 'Volvo'
  ];

  return (
    <>
      <Snackbar open={saving} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="info" sx={{ width: '100%' }}>
          Saving report...
        </Alert>
      </Snackbar>
      <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen} sx={{ mb: 2 }}>
        Create New Report
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'primary.light', color: 'primary.contrastText', px: 2 }}>
          New Purchase Report
          <IconButton aria-label="close" onClick={handleClose} size="small" sx={{ ml: 2 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {submitError && <Alert severity="error">{submitError}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}

            <Typography variant="h4">Client Type</Typography>
            <TextField
              select
              label="Client Type"
              value={clientType}
              onChange={event => handleClientTypeChange(event.target.value as 'new' | 'registered')}
              fullWidth
              SelectProps={{ native: true }}
              disabled={saving}
            >
              <option value="new">New Client</option>
              <option value="registered">Registered Client</option>
            </TextField>

            {clientType === 'registered' && (
              <>
                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} alignItems="flex-end">
                  <TextField
                    label="Search client by name or phone"
                    value={clientSearchQuery}
                    onChange={event => setClientSearchQuery(event.target.value)}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    onClick={handleSearchClient}
                    disabled={clientSearchLoading || saving}
                  >
                    {clientSearchLoading ? <CircularProgress size={20} color="inherit" /> : 'Search'}
                  </Button>
                </Stack>
                {clientSearchError && <Alert severity="error">{clientSearchError}</Alert>}
              </>
            )}

            <Typography variant="h4">Client Information</Typography>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <TextField
                label="First Name"
                value={values.clientName}
                onChange={event => handleChange('clientName', event.target.value)}
                fullWidth
              />
              <TextField
                label="Last Name"
                value={values.clientLastname}
                onChange={event => handleChange('clientLastname', event.target.value)}
                fullWidth
              />
            </Stack>
            <TextField
              label="Phone"
              value={values.clientPhone}
              onChange={event => handleChange('clientPhone', event.target.value)}
              fullWidth
            />

            <Typography variant="h4">Vehicle Information</Typography>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>

              <TextField
                select
                label="Make / Marca"
                value={values.make}
                onChange={event => handleChange('make', event.target.value)}
                fullWidth
                SelectProps={{ native: true }}
              >
                <option value="">Select brand</option>
                {carBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </TextField>
              <TextField
                label="Model / Modelo"
                value={values.model}
                onChange={event => handleChange('model', event.target.value)}
                fullWidth
              />
              <TextField
                label="Year / Año"
                type="number"
                value={values.year ?? ''}
                onChange={event => handleChange('year', event.target.value)}
                fullWidth
              />
            </Stack>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <TextField
                label="Plate Number / Placa"
                value={values.plate}
                onChange={event => handleChange('plate', event.target.value)}
                fullWidth
              />
              <TextField
                label="VIN / Numero de Serie"
                value={values.vin}
                onChange={event => handleChange('vin', event.target.value)}
                fullWidth
              />
              <TextField
                label="Mileage / Kilometraje"
                value={values.mileage}
                onChange={event => handleChange('mileage', event.target.value)}
                fullWidth
              />
            </Stack>

            <Typography variant="h4">Engine</Typography>
            <FormControl fullWidth>
              <InputLabel id="engine-condition-label">Condition</InputLabel>
              <Select
                labelId="engine-condition-label"
                value={values.engineCondition}
                label="Condition / Condicion"
                onChange={event => handleChange('engineCondition', event.target.value)}
              >
                <MenuItem value="">Selecionar condicion</MenuItem>
                <MenuItem value="Excellente Estado">Excellente Estado</MenuItem>
                <MenuItem value="Buen Estado">Buen Estado</MenuItem>
                <MenuItem value="Regular">Regular</MenuItem>
                <MenuItem value="Requiere Atencion">Requiere Atencion</MenuItem>
                <MenuItem value="Mala condicion">Mala condicion</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Notes"
              value={values.engineNotes}
              onChange={event => handleChange('engineNotes', event.target.value)}
              multiline
              rows={3}
              fullWidth
            />

            <Typography variant="h4">Brakes</Typography>
            <FormControl fullWidth>
              <InputLabel id="brake-condition-label">Condition</InputLabel>
              <Select
                labelId="brake-condition-label"
                value={values.brakeCondition}
                label="Condition"
                onChange={event => handleChange('brakeCondition', event.target.value)}
              >
                <MenuItem value="">Selecionar condicion</MenuItem>
                <MenuItem value="Excellente Estado">Excellente Estado</MenuItem>
                <MenuItem value="Buen Estado">Buen Estado</MenuItem>
                <MenuItem value="Regular">Regular</MenuItem>
                <MenuItem value="Requiere Atencion">Requiere Atencion</MenuItem>
                <MenuItem value="Mala condicion">Mala condicion</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Notes"
              value={values.brakeNotes}
              onChange={event => handleChange('brakeNotes', event.target.value)}
              multiline
              rows={3}
              fullWidth
            />

            <Typography variant="h4">Suspension</Typography>
           <FormControl fullWidth>
              <InputLabel id="engine-condition-label">Condition</InputLabel>
              <Select
                labelId="engine-condition-label"
                value={values.suspensionCondition}
                label="Condition / Condicion"
                onChange={event => handleChange('suspensionCondition', event.target.value)}
              >
                <MenuItem value="">Selecionar condicion</MenuItem>
                <MenuItem value="Excellente Estado">Excellente Estado</MenuItem>
                <MenuItem value="Buen Estado">Buen Estado</MenuItem>
                <MenuItem value="Regular">Regular</MenuItem>
                <MenuItem value="Requiere Atencion">Requiere Atencion</MenuItem>
                <MenuItem value="Mala condicion">Mala condicion</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Notes"
              value={values.suspensionNotes}
              onChange={event => handleChange('suspensionNotes', event.target.value)}
              multiline
              rows={3}
              fullWidth
            />

            <Typography variant="h4">Other Components</Typography>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <TextField
                label="Car Body / Carroceria"
                value={values.body}
                onChange={event => handleChange('body', event.target.value)}
                fullWidth
              />
              <TextField
                label="Interior"
                value={values.interior}
                onChange={event => handleChange('interior', event.target.value)}
                fullWidth
              />
              <TextField
                label="Tires / Neumaticos"
                value={values.tires}
                onChange={event => handleChange('tires', event.target.value)}
                fullWidth
              />
            </Stack>

            <Typography variant="h4">Report</Typography>
            <TextField
              label="Conclusion"
              value={values.conclusion}
              onChange={event => handleChange('conclusion', event.target.value)}
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              label="Created By"
              value={(() => {
                try {
                  const u = JSON.parse(sessionStorage.getItem('user') || 'null');
                  return u ? `${u.name || ''} | (${u.userType || ''})` : '';
                } catch {
                  return '';
                }
              })()}
              disabled
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={saving} startIcon={<CancelIcon />}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={saving} startIcon={saving ? undefined : <SaveIcon />}>
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Report'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateNewReport;
