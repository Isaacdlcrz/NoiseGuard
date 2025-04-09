import './App.css';
import BarChart from './components/BarChart';
import { useState, useEffect } from 'react';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const API_BASE = 'http://localhost:8080/api/samples';

const App = () => {
    const [currentMeasurement, setCurrentMeasurement] = useState<number[]>([]);
    const [measurementNames, setMeasurementNames] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [newFilename, setNewFilename] = useState<string>('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingValue, setEditingValue] = useState<string>('');
    const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);
    const [snackOpen, setSnackOpen] = useState<boolean>(false);
    const [snackMessage, setSnackMessage] = useState<string>('');

    useEffect(() => {
        const fetchNames = async () => {
            try {
                const namesResponse = await fetch(`${API_BASE}`);
                const namesJson = await namesResponse.json();
                console.log("Response from /samples:", namesJson);
                const namesData: string[] = namesJson.samples;
                setMeasurementNames(namesData);
            } catch (error) {
                console.error('Error fetching measurement names:', error);
            }
        };

        fetchNames();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedFile) return;

            try {
                const dataResponse = await fetch(`${API_BASE}?filename=${encodeURIComponent(selectedFile)}`);
                const dataJson = await dataResponse.json();
                setCurrentMeasurement(dataJson.data);
            } catch (error) {
                console.error('Error fetching measurement data:', error);
            }
        };

        fetchData();
    }, [selectedFile]);

    const handleCreateSample = async () => {
        if (!newFilename.trim()) return;
        try {
            const response = await fetch(`${API_BASE}?filename=${encodeURIComponent(newFilename)}&times=5`, {
                method: 'POST'
            });
            const result = await response.json();

            if (!response.ok) {
                setSnackMessage(result.error || 'Error creating sample');
                setSnackOpen(true);
                return;
            }

            setSnackMessage('Sample created successfully');
            setSnackOpen(true);
            setMeasurementNames((prev) => [...prev, newFilename]);
            setNewFilename('');
        } catch (err) {
            console.error(err);
            setSnackMessage('Unexpected error');
            setSnackOpen(true);
        }
    };

    const handleUpdateSample = async (index: number) => {
        const oldfilename = measurementNames[index];
        const newfilename = editingValue;
        try {
            const response = await fetch(`${API_BASE}?oldfilename=${encodeURIComponent(oldfilename)}&newfilename=${encodeURIComponent(newfilename)}`, {
                method: 'PUT'
            });
            const result = await response.json();

            if (!response.ok) {
                setSnackMessage(result.error || 'Error updating sample');
                setSnackOpen(true);
                return;
            }

            const updated = [...measurementNames];
            updated[index] = newfilename;
            setMeasurementNames(updated);
            setSnackMessage('Sample updated');
            setSnackOpen(true);
            setEditingIndex(null);
            setEditingValue('');
            if (selectedFile === oldfilename) {
                setSelectedFile(newfilename);
            }
        } catch (err) {
            console.error(err);
            setSnackMessage('Unexpected error');
            setSnackOpen(true);
        }
    };

    const handleDeleteSample = async (index: number) => {
        const filename = measurementNames[index];
        try {
            const response = await fetch(`${API_BASE}?filename=${encodeURIComponent(filename)}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (!response.ok) {
                setSnackMessage(result.error || 'Error deleting sample');
                setSnackOpen(true);
                return;
            }

            const updated = measurementNames.filter((_, i) => i !== index);
            setMeasurementNames(updated);
            setSnackMessage('Sample deleted');
            setSnackOpen(true);
            setConfirmDeleteIndex(null);
            if (selectedFile === filename) {
                setSelectedFile(null);
                setCurrentMeasurement([]);
            }
        } catch (err) {
            console.error(err);
            setSnackMessage('Unexpected error');
            setSnackOpen(true);
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            height: '100vh',
            width: '100vw'
        }}>
            <Box sx={{
                width: '300px',
                backgroundColor: 'primary.main',
                color: 'white',
                p: 2
            }}>
                <h2>Historial Mediciones</h2>
                <TextField
                    label="Nuevo nombre"
                    className="custom-textfield"
                    placeholder="Escribe el nombre de la medición"
                    value={newFilename}
                    onChange={(e) => setNewFilename(e.target.value)}
                    size="small"
                    sx={{ mb: 1, width: '100%' }}
                />
                <Button variant="contained" onClick={handleCreateSample} fullWidth>Crear medición</Button>
                <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                    {measurementNames.map((name, index) => (
                        <li
                            key={index}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textDecoration: selectedFile === name ? 'underline' : 'none' }}
                            onClick={() => setSelectedFile(name)}
                        >
                            {editingIndex === index ? (
                                <>
                                    <TextField
                                        value={editingValue}
                                        onChange={(e) => setEditingValue(e.target.value)}
                                        size="small"
                                        className="custom-textfield"
                                        variant="outlined"
                                        sx={{ flexGrow: 1, mr: 1 }}
                                        onClick={(e) => e.stopPropagation()}
                                        slotProps={{ inputLabel: { shrink: true } }}
                                        placeholder="Nuevo nombre"
                                    />
                                    <IconButton onClick={(e) => { e.stopPropagation(); handleUpdateSample(index); }}>
                                        <CheckIcon sx={{ color: 'white' }} />
                                    </IconButton>
                                    <IconButton onClick={(e) => { e.stopPropagation(); setEditingIndex(null); setConfirmDeleteIndex(null); }}>
                                        <CloseIcon sx={{ color: 'white' }} />
                                    </IconButton>
                                </>
                            ) : (
                                <>
                                    <span>{name}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        {confirmDeleteIndex === index ? (
                                            <>
                                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteSample(index); }}>
                                                    <CheckIcon fontSize="small" sx={{ color: 'white' }} />
                                                </IconButton>
                                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); setConfirmDeleteIndex(null); }}>
                                                    <CloseIcon fontSize="small" sx={{ color: 'white' }} />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <>
                                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); setEditingIndex(index); setEditingValue(name); setConfirmDeleteIndex(null); }}>
                                                    <EditIcon fontSize="small" sx={{ color: 'white' }} />
                                                </IconButton>
                                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); setConfirmDeleteIndex(index); setEditingIndex(null); }}>
                                                    <DeleteIcon fontSize="small" sx={{ color: 'white' }} />
                                                </IconButton>
                                            </>
                                        )}
                                    </span>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </Box>

            <Box sx={{
                flexGrow: 1,
                backgroundColor: 'grey.100',
                p: 2,
                borderLeft: 1,
                borderColor: 'lightgray'
            }}>
                {!selectedFile ? (
                    <h1 style={{ color: '#777', textAlign: 'center', marginTop: '20%' }}>Selecciona una medición para ver detalles</h1>
                ) : (
                    <h1 style={{ color: '#333', marginBottom: '1rem' }}>{`Medición: ${selectedFile}`}</h1>
                )}

                {selectedFile && (
                    <>
                        <div>
                            {currentMeasurement.map((value, index) => (
                                <span key={index}>{value} ,</span>
                            ))}
                        </div>
                        <BarChart dataValues={currentMeasurement} />
                    </>
                )}
            </Box>

            <Snackbar
                open={snackOpen}
                autoHideDuration={3000}
                onClose={() => setSnackOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="info" onClose={() => setSnackOpen(false)} sx={{ width: '100%' }}>
                    {snackMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default App;
