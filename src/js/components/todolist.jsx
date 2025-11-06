import React, { useState, useEffect } from 'react';

const API_URL = "https://playground.4geeks.com/apis/fake/todos/user/felix-oliveros";

// --- Componente Principal ---
const Todolist = () => {
    const [inputValue, setInputValue] = useState("");
    
    // Estado para la lista de tareas.
    const [tasks, setTasks] = useState([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // --- Cargar datos ---
    useEffect(() => {
        loadTasks();
    }, []);

    useEffect(() => {
            if (isInitialLoad) {
            setIsInitialLoad(false);
            return;
        }
        updateApiTasks();

    }, [tasks, isInitialLoad]);

    // Funcion carga
    const loadTasks = async () => {
        try {
            const response = await fetch(API_URL);
            
            if (response.ok) {
                const apiTasks = await response.json();
                const tasksWithColors = apiTasks.map(task => ({
                    ...task,
                    color: getRandomColor()
                }));
                setTasks(tasksWithColors);
            } else if (response.status === 404) {
                await createUser();
            } else {
                console.error("Error al cargar datos:", response.status);
            }
        } catch (error) {
            console.error("Error en loadTasks:", error);
        }
    };

    //crear el usuario
    const createUser = async () => {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([])
            });
            if (response.ok) {
                setTasks([]);
            }
        } catch (error) {
            console.error("Error en createUser:", error);
        }
    };

    const updateApiTasks = async () => {
        const tasksToSync = tasks.map(({ label, done }) => ({ label, done }));

        try {
            await fetch(API_URL, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tasksToSync)
            });
        } catch (error) {
            console.error("Error en updateApiTasks:", error);
        }
    };
    
    // Funcion Enter
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            const newTask = {
                label: inputValue.trim(),
                done: false,
                color: getRandomColor()
            };
            
            setTasks([...tasks, newTask]);
            
            setInputValue("");
        }
    };

    // Clic borrar
    const handleDelete = (indexToDelete) => {
        const newTasks = tasks.filter((_, index) => index !== indexToDelete);
        setTasks(newTasks);
    };

    //Generador de color
    const getRandomColor = () => {
        const hue = Math.floor(Math.random() * 360); 
        return `hsl(${hue}, 100%, 92%)`; 
    };

    return (
        <div className="notepad-container">
            <h1 className="notepad-title">Tareas por Hacer</h1>
            
            {/* Entrada */}
            <input 
                type="text"
                placeholder="¿Qué necesitas hacer?"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />

            {/* Lista de Tareas */}
            <ul>
                {tasks.length === 0 ? (
                    <li className="empty-message">No hay tareas, añadir tareas</li>
                ) : (
                    tasks.map((task, index) => (
                        <li 
                            key={index} 
                            className="task-item" 
                            style={{ backgroundColor: task.color }}
                        >
                            {task.label}
                            {/* Ícono de borrado*/}
                            <span 
                                className="delete-icon" 
                                onClick={() => handleDelete(index)}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </span>
                        </li>
                    ))
                )}
            </ul>
            <div className="task-counter">{tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'}</div>
        </div>
    );
};

export default Todolist;