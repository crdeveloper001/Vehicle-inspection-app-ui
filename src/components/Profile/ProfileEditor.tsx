import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    InputAdornment,
} from "@mui/material";
import {
    Person,
    Email,
    Phone,
    Badge,
    Lock,
    CheckCircle,
    NewReleases,
} from "@mui/icons-material";

import type User from "../../interfaces/User";
import { useProfile } from "../../hooks/UseProfile/UseProfile";
import { useState } from "react";

interface MyProfileProps {
    user: User;
    onSave?: (data: User) => void;
}

const MyProfileEditor: React.FC<MyProfileProps> = ({ user, onSave }) => {
    const {
        editMode,
        formData,
        loading,
        error,
        handleChange,
        handleEdit,
        handleSave,
        handleReport,
        setFormData,
        setLogOut
    } = useProfile(user, onSave);

    const [showSuccess, setShowSuccess] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(!user.IsPasswordChanged);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handlePasswordChange = () => {
        if (!newPassword || !confirmPassword) {
            setPasswordError("Both fields are required");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }
        if (newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            return;
        }

        setFormData({
            ...formData,
            password: newPassword,
            IsPasswordChanged: true,
        });
        setShowPasswordModal(false);
    };

    const handleCancelPassword = () => {
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");
        setShowPasswordModal(false);
    };

    const handleSaveWithModal = async () => {
        await handleSave();
        setShowSuccess(true);
    };

    return (
        <>
            <Paper sx={{ p: 4, maxWidth: "auto", margin: "auto" }}>
                <Typography variant="h5" mb={3}>
                    My Profile
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Stack spacing={2}>
                    <TextField
                        label="username ID"
                        name="id"
                        value={formData._id}
                        disabled
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Badge />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!editMode}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!editMode}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!editMode}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Phone />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>

                <Stack mt={3} spacing={2}>
                    <TextField
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!editMode}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        label="User Type"
                        name="userType"
                        value={formData.userType}
                        disabled
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Badge />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Profile New?"
                        name="userType"
                        value={formData.IsProfileNew ? "Yes" : "No"}
                        disabled
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <NewReleases />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Current Password Changed?"
                        name="userType"
                        value={formData.IsPasswordChanged ? "Yes" : "No"}
                        disabled
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CheckCircle />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>

                <Box mt={4} display="flex" justifyContent="space-between">
                    {!editMode ? (
                        <Button variant="contained" onClick={handleEdit}>
                            Edit
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleSaveWithModal}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    )}

                    <Button variant="outlined" color="error" onClick={handleReport}>
                        Report Problem
                    </Button>
                </Box>
            </Paper>

            <Dialog open={showPasswordModal} onClose={() => {}}>
                <DialogTitle>Set New Password</DialogTitle>
                <DialogContent sx={{ minWidth: 400, mt: 2 }}>
                    <Typography variant="body2" mb={2}>
                        Please create a new password for your account
                    </Typography>
                    {passwordError && <Alert severity="error" sx={{ mb: 2 }}>{passwordError}</Alert>}
                    <TextField
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelPassword} variant="outlined" color="error">
                        Cancel
                    </Button>
                    <Button onClick={handlePasswordChange} variant="contained" color="success">
                        Set Password
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showSuccess} onClose={() => setShowSuccess(false)}>
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <Typography>Profile updated successfully! The system will log out automatically after you close this message. Please log in again with your updated credentials.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setShowSuccess(false);
                        setLogOut();
                    }} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default MyProfileEditor;