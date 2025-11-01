export const handleSyncDemo = () => {
    alert("Sync (demo): here you would connect Google Calendar / Classroom / Gmail");
};

export const toggleLogin = (setter) => {
    setter((prev) => !prev);
};
