// main.js - Configuración del sistema principal
document.addEventListener('alpine:init', () => {
    Alpine.data('mainSystem', () => ({
        // Estado del sistema
        //activeTab: 'predimensionamiento',
        activeTab: 'concretoArmado',
        systemData: {
            predimensionamiento: {
                materiales: {},
                dimensiones: {},
                resultados: {}
            },
            dimensionamiento: {
                datos: {},
                resultados: {}
            },
            cargas: {
                parametros: {},
                calculos: {}
            },
            verificaciones: {
                datos: {},
                resultados: {}
            },
            esquemacargas: {
                datos: {},
                resultados: {}
            },
            presionsuelo: {
                parametros: {},
                calculos: {}
            },
            analisisEstructuras: {
                cargas: {},
                analisis: {}
            },
            concretoArmado: {
                parametros: {},
                diseño: {}
            }
        },

        // Configuración de tabs con descripciones mejoradas
        tabs: [
            {
                id: 'predimensionamiento',
                name: 'PREDIMENSIONAMIENTO',
                icon: 'fa-ruler-combined',
                description: 'Cálculo inicial de dimensiones'
            },
            {
                id: 'dimensionamiento',
                name: 'DIMENSIONAMIENTO',
                icon: 'fa-check-double',
                description: 'Verificación de estabilidad'
            },
            {
                id: 'cargas',
                name: 'CARGAS',
                icon: 'fa-check-double',
                description: 'Verificación de estabilidad'
            },
            {
                id: 'verificaciones',
                name: 'VERIFICACIONES',
                icon: 'fa-compress-arrows-alt',
                description: 'Análisis de presiones'
            },
            {
                id: 'esquemacargas',
                name: 'ESQUEMA DE CARGAS',
                icon: 'fa-compress-arrows-alt',
                description: 'Esquema de cargas'
            },
            {
                id: 'analisisEstructuras',
                name: 'ANALISIS ESTRUCTURAL',
                icon: 'fa-calculator',
                description: 'Cálculos estructurales'
            },
            {
                id: 'concretoArmado',
                name: 'DISEÑO',
                icon: 'fa-drafting-compass',
                description: 'Diseño del refuerzo'
            },
            {
                id: 'dibujo',
                name: 'DIBUJO',
                icon: 'fa-drafting-compass',
                description: 'Diseño del refuerzo'
            },
            {
                id: 'metrado',
                name: 'METRADO',
                icon: 'fa-drafting-compass',
                description: 'Diseño del refuerzo'
            }
        ],

        // Inicialización mejorada
        init() {
            console.log('Sistema de Muros de Contención inicializado');
            this.setupEventListeners();
            this.initializeModules();
            this.loadStoredData();
        },

        // Carga datos almacenados
        loadStoredData() {
            const storedData = localStorage.getItem('murosContencionData');
            if (storedData) {
                this.systemData = JSON.parse(storedData);
            }
        },

        // Guarda datos automáticamente
        saveData() {
            localStorage.setItem('murosContencionData', JSON.stringify(this.systemData));
        },

        // Cambiar de tab con persistencia de datos
        changeTab(tabId) {
            //console.log(tabId);
            this.activeTab = tabId;
            this.saveData();
            document.dispatchEvent(new CustomEvent('tab-changed', {
                detail: {
                    currentTab: tabId,
                    allData: this.systemData,
                    timestamp: new Date().toISOString()
                }
            }));
        },

        // Manejador de actualizaciones de datos mejorado
        handleTabDataUpdate(tabId, data) {
            this.systemData[tabId] = {
                ...this.systemData[tabId],
                ...data
            };
            this.saveData();
            this.notifyDataChange(tabId);
        },

        // Notifica cambios a otros módulos
        notifyDataChange(tabId) {
            document.dispatchEvent(new CustomEvent('data-updated', {
                detail: {
                    source: tabId,
                    data: this.systemData
                }
            }));
        },

        // Exportar datos del sistema
        exportSystemData() {
            const exportData = {
                ...this.systemData,
                metadata: {
                    exportDate: new Date().toISOString(),
                    version: '1.0'
                }
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `muro-contencion-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    }));
});

// Utilidades globales del sistema
window.DesagueSystem = {
    // Crear tabla básica
    createTable(columns, data = []) {
        return {
            columns: columns,
            data: data,
            mode: 'view' // view | edit
        };
    },

    // Validar datos de tabla
    validateTableData(table) {
        return table && Array.isArray(table.columns) && Array.isArray(table.data);
    },

    // Formatear datos para exportación
    formatForExport(data) {
        return JSON.stringify(data, null, 2);
    },

    // Generar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};