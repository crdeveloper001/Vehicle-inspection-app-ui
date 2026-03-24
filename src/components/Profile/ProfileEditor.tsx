import { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Stack,
} from "@mui/material";

import type User from "../../interfaces/User";

interface MyProfileProps {
    user: User;
    onSave?: (data: User) => void;
}

const MyProfileEditor: React.FC<MyProfileProps> = ({ user, onSave }) => {

    const [editMode, setEditMode] = useState<boolean>(false);
    const [formData, setFormData] = useState<User>({
        name: user.name || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        userType: user.userType || "",
        password: user.password || "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = () => setEditMode(true);

    const handleSave = () => {
        setEditMode(false);
        onSave?.(formData);
    };

    const handleReport = () => {
        alert("Please contact administrator to report any issues with your profile or the application itself. Dev email: crdevelopers506@gmail.com");
    };

    return (

        <Paper sx={{ p: 4, maxWidth: "auto", margin: "auto" }}>
            <Typography variant="h5" mb={3}>
                My Profile
            </Typography>

            <Stack spacing={2}>
                <TextField
                    label="Name"
                    name="username"
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
                <TextField
                    type="password"
                    label="Password"
                    name="password"
                    value={formData.password}
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