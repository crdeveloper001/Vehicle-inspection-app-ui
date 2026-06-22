import { useState } from "react";
import type User from "../../interfaces/User";
import profileAPI from "../../API/ProfileAPI";

interface UseProfileReturn {
    editMode: boolean;
    formData: User;
    loading: boolean;
    error: string | null;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleEdit: () => void;
    handleSave: () => Promise<void>;
    handleReport: () => void;
    setEditMode: (mode: boolean) => void;
    setFormData: (data: User) => void;
    setLogOut: () => void;
}

export const useProfile = (
    initialUser: User,
    onSave?: (data: User) => void

): UseProfileReturn => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<User>({
        _id: initialUser._id,
        name: initialUser.name || "",
        lastName: initialUser.lastName || "",
        email: initialUser.email || "",
        phone: initialUser.phone || "",
        userType: initialUser.userType || "",
        password: initialUser.password || "",
        IsProfileNew: initialUser.IsProfileNew || false,
        IsPasswordChanged: initialUser.IsPasswordChanged || false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = () => setEditMode(true);

    const handleSave = async () => {
        const id = formData._id;
        if (!id) {
            setError("Missing user ID");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await profileAPI.updateProfile(id.valueOf(), formData as any);
            setEditMode(false);
            onSave?.(formData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save profile");
        } finally {
            setLoading(false);
        }
    };

    const handleReport = () => {
        alert(
            "Please contact administrator to report any issues with your profile or the application itself. Dev email: crdevelopers506@gmail.com"
        );
    };
    const setLogOut = () => {
        if (formData.IsPasswordChanged) {
            sessionStorage.clear();
            window.location.href = "/";
        } else {
            alert("Please change your password before logging out for security reasons. If you are having trouble changing your password, please contact support at")
        }

    };

    return {
        editMode,
        formData,
        loading,
        error,
        handleChange,
        handleEdit,
        handleSave,
        handleReport,
        setEditMode,
        setFormData,
        setLogOut
    };
};
