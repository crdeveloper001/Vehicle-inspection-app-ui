import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Stack,
} from "@mui/material";

import type User from "../../interfaces/User";
import { useProfile } from "../../hooks/UseProfile/UseProfile";

interface MyProfileProps {
    user: User;
    onSave?: (data: User) => void;
}

const MyProfileEditor: React.FC<MyProfileProps> = ({ user, onSave }) => {
    const {
        editMode,
        formData,
        handleChange,
        handleEdit,
        handleSave,
        handleReport,
    } = useProfile(user, onSave);

    return (

        <Paper sx={{ p: 4, maxWidth: "auto", margin: "auto" }}>
            <Typography variant="h5" mb={3}>
                My Profile
            </Typography>

            <Stack spacing={2}>
                <TextField
                    label="username ID"
                    name="id"
                    value={formData._id}
                    disabled
                    fullWidth
                />
                <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editMode}
                    fullWidth
                />

                <TextField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!editMode}
                    fullWidth
                />

                <TextField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editMode}
                    fullWidth
                />

                <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editMode}
                    fullWidth
                />

                <TextField
                    label="User Type"
                    name="userType"
                    value={formData.userType}
                    disabled
                    fullWidth
                />
                
            </Stack>

            <Box mt={4} display="flex" justifyContent="space-between">
                {!editMode ? (
                    <Button variant="contained" onClick={handleEdit}>
                        Edit
                    </Button>
                ) : (
                    <Button variant="contained" color="success" onClick={handleSave}>
                        Save
                    </Button>
                )}

                <Button variant="outlined" color="error" onClick={handleReport}>
                    Report Problem
                </Button>
            </Box>
        </Paper>
    );
};

export default MyProfileEditor;