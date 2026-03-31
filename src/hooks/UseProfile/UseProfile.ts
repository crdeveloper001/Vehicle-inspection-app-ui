import { useState } from "react";
import type User from "../../interfaces/User";

interface UseProfileReturn {
    editMode: boolean;
    formData: User;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleEdit: () => void;
    handleSave: () => void;
    handleReport: () => void;
    setEditMode: (mode: boolean) => void;
    setFormData: (data: User) => void;
}

export const useProfile = (
    initialUser: User,
    onSave?: (data: User) => void
): UseProfileReturn => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [formData, setFormData] = useState<User>({
        _id: initialUser._id || "",
        name: initialUser.name || "",
        lastName: initialUser.lastName || "",
        email: initialUser.email || "",
        phone: initialUser.phone || "",
        userType: initialUser.userType || "",
        password: initialUser.password || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        alert(
            "Please contact administrator to report any issues with your profile or the application itself. Dev email: crdevelopers506@gmail.com"
        );
    };

    return {
        editMode,
        formData,
        handleChange,
        handleEdit,
        handleSave,
        handleReport,
        setEditMode,
        setFormData,
    };
};
