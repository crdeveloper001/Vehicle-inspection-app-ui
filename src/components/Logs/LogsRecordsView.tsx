import { useMemo, useState } from 'react';

type LogRecord = {
    id: number;
    date: string;
    level: string;
    source: string;
    message: string;
};

const mockRecords: LogRecord[] = [
    {
        id: 1,
        date: '2026-06-22 08:14',
        level: 'INFO',
        source: 'AuthService',
        message: 'Usuario autenticado correctamente.',
    },
    {
        id: 2,
        date: '2026-06-22 09:05',
        level: 'WARN',
        source: 'InspectionService',
        message: 'Vehículo sin historial completo.',
    },
    {
        id: 3,
        date: '2026-06-22 10:32',
        level: 'ERROR',
        source: 'ApiGateway',
        message: 'Fallo al cargar datos de inspección.',
    },
    {
        id: 4,
        date: '2026-06-22 11:47',
        level: 'DEBUG',
        source: 'ReportGenerator',
        message: 'Generando reporte mensual de inspecciones.',
    },
];

const LogsRecordsView = () => {
    const [searchText, setSearchText] = useState('');
    const [records, setRecords] = useState<LogRecord[]>(mockRecords);

    const filteredRecords = useMemo(
        () =>
            records.filter((record) => {
                const searchValue = searchText.toLowerCase();
                return (
                    record.date.toLowerCase().includes(searchValue) ||
                    record.level.toLowerCase().includes(searchValue) ||
                    record.source.toLowerCase().includes(searchValue) ||
                    record.message.toLowerCase().includes(searchValue)
                );
            }),
        [records, searchText]
    );

    const handleDelete = (id: number) => {
        setRecords((current) => current.filter((record) => record.id !== id));
    };

    const handleView = (record: LogRecord) => {
        window.alert(`Registro ${record.id}\n${record.date} - ${record.level} - ${record.source}\n${record.message}`);
    };

    return (
        <div style={{ padding: '16px' }}>
            <h2>Logs Records</h2>
            <p>Este componente muestra los registros de logs disponibles.</p>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Buscar logs..."
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button
                    type="button"
                    onClick={() => setSearchText('')}
                    style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #999', background: '#f5f5f5' }}
                >
                    Limpiar
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Fecha</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Nivel</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Origen</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Mensaje</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
                                    No se encontraron registros.
                                </td>
                            </tr>
                        ) : (
                            filteredRecords.map((record) => (
                                <tr key={record.id}>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{record.date}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{record.level}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{record.source}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{record.message}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                                        <button
                                            type="button"
                                            onClick={() => handleView(record)}
                                            style={{ marginRight: '8px', padding: '6px 10px', borderRadius: '4px', border: '1px solid #007bff', background: '#fff', color: '#007bff' }}
                                        >
                                            Ver
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(record.id)}
                                            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #dc3545', background: '#fff', color: '#dc3545' }}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LogsRecordsView;
