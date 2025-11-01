import { useEffect, useState } from "react";

const SAMPLE_TASKS = [
    { id: 1, title: "Finish AI model report", status: "pending", durationMins: 90, createdAt: Date.now() - 86400000 },
    { id: 2, title: "Study Math (Tue 7:30)", status: "priority", durationMins: 60, createdAt: Date.now() - 3600000 },
    { id: 3, title: "Implement login flow", status: "inprogress", durationMins: 120, createdAt: Date.now() - 7200000 },
    { id: 4, title: "Submit assignment (Classroom)", status: "completed", durationMins: 45, createdAt: Date.now() - 172800000 },
];

export function useTasks(isLoggedIn) {
    const [tasks, setTasks] = useState(() => {
        try {
            const raw = localStorage.getItem("awm_tasks_v1");
            return raw ? JSON.parse(raw) : SAMPLE_TASKS;
        } catch {
            return SAMPLE_TASKS;
        }
    });

    useEffect(() => {
        if (isLoggedIn) {
            localStorage.setItem("awm_tasks_v1", JSON.stringify(tasks));
        }
    }, [tasks, isLoggedIn]);

    return { tasks, setTasks };
}
