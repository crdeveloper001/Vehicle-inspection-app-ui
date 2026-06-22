import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ClientType } from '../../interfaces/Clients';
import { useClients } from '../../hooks/UseClients/UseClients';

type Props = {
    open: boolean;
    onClose: () => void;
    client: ClientType | null;
    onSave: (client: ClientType) => void;
};

const EditSelectedClient: React.FC<Props> = ({ open, onClose, client, onSave }) => {
    const { updateClient } = useClients();
    const [form, setForm] = useState<ClientType | null>(null);

    useEffect(() => {
        setForm(client ? { ...client } : null);
    }, [client, open]);

    if (!form) return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Edit Client
                <IconButton aria-label="close" onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>No client selected.</DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );

    const handleChange = (key: keyof ClientType) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setForm(prev => prev ? ({ ...prev, [key]: value } as ClientType) : prev);
    };

    const handleSave = async () => {
        // basic normalization for whatsapp link if empty
        const updated = { ...form } as ClientType;
        if (!updated.whatsappNumberLink) {
            updated.whatsappNumberLink = `https://wa.me/506${updated.phone}`;
        }
        const id = (updated as any).id ?? (updated as any)._id ?? '';
        await updateClient(id, updated as any);
        onSave(updated);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Edit Client
                <IconButton aria-label="close" onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="First Name"
                        value={form.name}
                        onChange={handleChange('name')}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon /></InputAdornment>) }}
                        fullWidth
                    />
                    <TextField
                        label="Last Name"
                        value={form.lastname}
                        onChange={handleChange('lastname')}
                        // @ts-ignore - suppress deprecated InputProps hint until MUI upgrade is handled
                        InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircleIcon /></InputAdornment>) }}
                        fullWidth
                    />
                    <TextField
                        label="Phone"
                        value={form.phone}
                        onChange={handleChange('phone')}
                        // @ts-ignore - suppress deprecated InputProps hint until MUI upgrade is handled
                        InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneIcon /></InputAdornment>) }}
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        value={form.email}
                        onChange={handleChange('email')}
                        // @ts-ignore - suppress deprecated InputProps hint until MUI upgrade is handled
                        InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon /></InputAdornment>) }}
                        fullWidth
                    />
                    <TextField
                        label="WhatsApp Link"
                        value={form.whatsappNumberLink || `https://wa.me/506${form.phone}`}
                        onChange={handleChange('whatsappNumberLink')}
                        // @ts-ignore - suppress deprecated InputProps hint until MUI upgrade is handled
                        InputProps={{ startAdornment: (<InputAdornment position="start"><LinkIcon /></InputAdornment>) }}
                        fullWidth
                    />
                    <TextField
                        label="Registered"
                        value={form.IsRegistered ? 'Yes' : 'No'}
                        onChange={(e) => setForm(prev => prev ? ({ ...prev, IsRegistered: e.target.value.toLowerCase() === 'yes' } as ClientType) : prev)}
                        // @ts-ignore - suppress deprecated InputProps hint until MUI upgrade is handled
                        InputProps={{ startAdornment: (<InputAdornment position="start"><VerifiedUserIcon /></InputAdornment>) }}
                        fullWidth
                    />
                    <TextField
                        label="Has Account"
                        value={form.hasAccount ? 'Yes' : 'No'}
                        onChange={(e) => setForm(prev => prev ? ({ ...prev, hasAccount: e.target.value.toLowerCase() === 'yes' } as ClientType) : prev)}
                        // @ts-ignore - suppress deprecated InputProps hint until MUI upgrade is handled
                        InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircleIcon /></InputAdornment>) }}
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditSelectedClient;
