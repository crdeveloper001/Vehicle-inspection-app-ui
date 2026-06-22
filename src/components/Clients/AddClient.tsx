import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Stack,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import { InputAdornment } from '@mui/material';
import { useClients } from '../../hooks/UseClients/UseClients';
import { ClientType } from '../../interfaces/Clients';

type CreateClientPayload = Omit<ClientType, '_id' | '__v' | 'createdOn'>;

const initialFormState: CreateClientPayload = {
  name: '',
  lastname: '',
  phone: '',
  email: '',
  whatsappNumberLink: '',
  IsRegistered: false,
  CurrentReports: [],
  hasAccount: false,
};

const AddClient = () => {
  const { createClient, loading, error } = useClients();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<CreateClientPayload>(initialFormState);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleOpen = () => {
    setSubmitError(null);
    setSuccessMessage(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setValues(initialFormState);
    setSubmitError(null);
    setSuccessMessage(null);
  };

  const handleChange = (field: keyof CreateClientPayload, value: string | boolean) => {
    setValues(prev => {
      const nextValues = { ...prev, [field]: value } as CreateClientPayload;
      if (field === 'phone' && typeof value === 'string') {
        nextValues.whatsappNumberLink = value ? `https://wa.me/506${value}` : '';
      }
      return nextValues;
    });
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setSuccessMessage(null);

    if (!values.name.trim() || !values.lastname.trim() || !values.phone.trim() || !values.email.trim()) {
      setSubmitError('Name, lastname, phone, and email are required.');
      return;
    }

    const createdClient = await createClient(values);

    if (!createdClient) {
      setSubmitError(error ?? 'Unable to create client.');
      return;
    }

    setSuccessMessage('Client created successfully.');
    setValues(initialFormState);
    setOpen(false);
  };

  return (
    <>
      <Snackbar open={loading} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="info" sx={{ width: '100%' }}>
          Creating client...
        </Alert>
      </Snackbar>
      <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen} sx={{ mb: 2 }}>
        Add Client
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'primary.light', color: 'primary.contrastText', px: 2 }}>
          Add New Client
          <IconButton
            aria-label="close"
            onClick={handleClose}
            size="small"
            sx={{ ml: 2 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1, minHeight: 240 }}>
            {submitError && <Alert severity="error">{submitError}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            <TextField
              label="First Name"
              value={values.name}
              onChange={event => handleChange('name', event.target.value)}
              InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon /></InputAdornment>) }}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={values.lastname}
              onChange={event => handleChange('lastname', event.target.value)}
              InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircleIcon /></InputAdornment>) }}
              fullWidth
            />
            <TextField
              label="Phone"
              value={values.phone}
              onChange={event => handleChange('phone', event.target.value)}
              InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneIcon /></InputAdornment>) }}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={values.email}
              onChange={event => handleChange('email', event.target.value)}
              InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon /></InputAdornment>) }}
              fullWidth
            />
            <TextField
              label="WhatsApp Link"
              value={values.whatsappNumberLink}
              InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><LinkIcon /></InputAdornment>) }}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={values.IsRegistered}
                  onChange={event => handleChange('IsRegistered', event.target.checked)}
                />
              }
              label={<><VerifiedUserIcon sx={{ mr: 1 }} fontSize="small"/> Registered</>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={values.hasAccount}
                  onChange={event => handleChange('hasAccount', event.target.checked)}
                />
              }
              label={<><AccountCircleIcon sx={{ mr: 1 }} fontSize="small"/> Has Account</>}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={loading} startIcon={<CancelIcon />}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading} startIcon={loading ? undefined : <SaveIcon />}>
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddClient;
