import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Stack,
  TextField,
  InputAdornment,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ClientType } from '../../interfaces/Clients';

type Props = {
  open: boolean;
  onClose: () => void;
  client: ClientType | null;
};

const ViewClientsDetails: React.FC<Props> = ({ open, onClose, client }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Client Details
        <IconButton aria-label="close" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {!client ? (
          <Typography>No client selected.</Typography>
        ) : (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="First Name"
              value={client.name}
              InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><PersonIcon /></InputAdornment>) }}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={client.lastname}
              InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><AccountCircleIcon /></InputAdornment>) }}
              fullWidth
            />
            <TextField
              label="Phone"
              value={client.phone}
              InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><PhoneIcon /></InputAdornment>) }}
              fullWidth
            />
            <TextField
              label="Email"
              value={client.email}
              InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><EmailIcon /></InputAdornment>) }}
              fullWidth
            />
            <TextField
              label="WhatsApp Link"
              value={client.whatsappNumberLink || `https://wa.me/506${client.phone}`}
              InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><LinkIcon /></InputAdornment>) }}
              fullWidth
            />
            <TextField
              label="Registered"
              value={client.IsRegistered ? 'Yes' : 'No'}
              InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><VerifiedUserIcon /></InputAdornment>) }}
              fullWidth
            />
            <TextField
              label="Has Account"
              value={client.hasAccount ? 'Yes' : 'No'}
              InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><AccountCircleIcon /></InputAdornment>) }}
              fullWidth
            />
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewClientsDetails;
