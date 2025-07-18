// ===== SISTEMA DE IMPORTACIÓN Y GESTIÓN DE COMPONENTES =====

// Importar todos los módulos necesarios
const COMPONENT_SCRIPTS = [
    './js/components/predimensionamiento.js',
    './js/components/dimensionamiento.js',
    './js/components/cargas.js',
    //'./js/components/verificaciones.js',
    // '.js/components/esquemaCargas.js',
    // '.js/components/analisisEstructural.js',
    // '.js/components/designoConcretoArmado.js',
    // '.js/components/dibujo.js',
    // '.js/components/metrados.js'
];

// Función para cargar scripts de forma asíncrona
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            console.log(`✅ Script cargado: ${src}`);
            resolve();
        };
        script.onerror = () => {
            console.error(`❌ Error cargando script: ${src}`);
            reject(new Error(`Failed to load script: ${src}`));
        };
        document.head.appendChild(script);
    });
}

// Función para cargar todos los componentes
async function loadAllComponents() {
    console.log('🔄 Cargando componentes del sistema...');

    try {
        // Cargar scripts en paralelo
        await Promise.all(COMPONENT_SCRIPTS.map(script => loadScript(script)));
        console.log('✅ Todos los componentes cargados exitosamente');
        return true;
    } catch (error) {
        console.error('❌ Error cargando componentes:', error);
        return false;
    }
}

// ===== CONFIGURACIÓN DE ALPINE.JS =====

document.addEventListener('alpine:init', () => {
    Alpine.data('mainSystem', () => ({
        activeTab: 'predimensionamiento',
        predimensionamientoCalculado: false,
        dimensionamientoCalculado: false,
        isInitialized: false,
        loadingComponents: false,

        systemData: {
            predimensionamiento: {
                materiales: {},
                dimensiones: {},
                resultados: {},
                inputValues: {},
                errors: [],
                isCalculated: false
            },
            dimensionamiento: {
                datos: {},
                resultados: {},
                inputValues: {},
                errors: [],
                isCalculated: false
            },
            cargas: {
                parametros: {},
                calculos: {},
                resultados: {}
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
            },
            dibujo: {
                parametros: {},
                diseño: {}
            },
            metrado: {
                parametros: {},
                diseño: {}
            }
        },

        tabs: [
            {
                id: 'predimensionamiento',
                name: 'PREDIMENSIONAMIENTO',
                icon: 'fa-ruler-combined',
                description: 'Cálculo inicial de dimensiones',
                requiredState: null,
                dependsOn: null,
                initFunction: 'initPredimensionamientoModule',
                container: 'predimensionamiento-content'
            },
            {
                id: 'dimensionamiento',
                name: 'DIMENSIONAMIENTO',
                icon: 'fa-check-double',
                description: 'Verificación de dimensiones',
                requiredState: 'predimensionamientoCalculado',
                dependsOn: 'predimensionamiento',
                initFunction: 'initDimensionamientoModule',
                container: 'dimensionamiento-content'
            },
            {
                id: 'cargas',
                name: 'CARGAS',
                icon: 'fa-weight-hanging',
                description: 'Análisis de cargas',
                requiredState: 'dimensionamientoCalculado',
                dependsOn: 'dimensionamiento',
                initFunction: 'initCargasModule',
                container: 'cargas-content'
            },
            {
                id: 'verificaciones',
                name: 'VERIFICACIONES',
                icon: 'fa-compress-arrows-alt',
                description: 'Verificaciones de estabilidad',
                requiredState: 'dimensionamientoCalculado',
                dependsOn: 'dimensionamiento',
                initFunction: 'initVerificacionesModule',
                container: 'verificaciones-content'
            },
            {
                id: 'esquemacargas',
                name: 'ESQUEMA DE CARGAS',
                icon: 'fa-project-diagram',
                description: 'Esquema de cargas',
                requiredState: 'dimensionamientoCalculado',
                dependsOn: 'dimensionamiento',
                initFunction: 'initEsquemaCargasModule',
                container: 'esquemacargas-content'
            },
            {
                id: 'analisisEstructuras',
                name: 'ANÁLISIS ESTRUCTURAL',
                icon: 'fa-calculator',
                description: 'Análisis estructural',
                requiredState: 'dimensionamientoCalculado',
                dependsOn: 'dimensionamiento',
                initFunction: 'initAnalisisEstructuralModule',
                container: 'analisisEstructuras-content'
            },
            {
                id: 'concretoArmado',
                name: 'DISEÑO CONCRETO',
                icon: 'fa-drafting-compass',
                description: 'Diseño de concreto armado',
                requiredState: 'dimensionamientoCalculado',
                dependsOn: 'dimensionamiento',
                initFunction: 'initDesignoConcretoArmadoModule',
                container: 'concretoArmado-content'
            },
            {
                id: 'dibujo',
                name: 'DIBUJO',
                icon: 'fa-draw-polygon',
                description: 'Planos y dibujos',
                requiredState: 'dimensionamientoCalculado',
                dependsOn: 'dimensionamiento',
                initFunction: 'initDibujoModule',
                container: 'dibujo-content'
            },
            {
                id: 'metrado',
                name: 'METRADO',
                icon: 'fa-list-ol',
                description: 'Metrado de materiales',
                requiredState: 'dimensionamientoCalculado',
                dependsOn: 'dimensionamiento',
                initFunction: 'initMetradoModule',
                container: 'metrado-content'
            }
        ],

        // ===== INICIALIZACIÓN =====
        async init() {
            console.log('🚀 Iniciando Sistema de Muros de Contención...');

            // Cargar datos almacenados
            await this.loadStoredData();

            // Configurar event listeners
            this.setupEventListeners();

            // Cargar componentes
            await this.loadComponents();

            // Inicializar componente actual
            await this.initializeCurrentTab();

            this.isInitialized = true;
            console.log('✅ Sistema completamente inicializado');
        },

        // ===== GESTIÓN DE COMPONENTES =====
        async loadComponents() {
            if (this.loadingComponents) return;

            this.loadingComponents = true;
            console.log('🔄 Cargando componentes...');

            try {
                const success = await loadAllComponents();
                if (success) {
                    console.log('✅ Componentes cargados exitosamente');
                } else {
                    throw new Error('Error cargando componentes');
                }
            } catch (error) {
                console.error('❌ Error en carga de componentes:', error);
                this.showError('Error al cargar los componentes del sistema');
            } finally {
                this.loadingComponents = false;
            }
        },

        async initializeCurrentTab() {
            const currentTab = this.tabs.find(t => t.id === this.activeTab);
            if (currentTab) {
                await this.initializeTab(currentTab);
            }
        },

        async initializeTab(tab) {
            console.log(`🔄 Inicializando tab: ${tab.name}`);

            try {
                // Verificar si el contenedor existe
                const container = document.getElementById(tab.container);
                if (!container) {
                    console.error(`❌ Contenedor no encontrado: ${tab.container}`);
                    return false;
                }

                // Ejecutar función de inicialización
                if (typeof window[tab.initFunction] === 'function') {
                    await window[tab.initFunction]();
                    console.log(`✅ Tab inicializado: ${tab.name}`);
                    return true;
                } else {
                    console.error(`❌ Función no encontrada: ${tab.initFunction}`);
                    return false;
                }
            } catch (error) {
                console.error(`❌ Error inicializando ${tab.name}:`, error);
                return false;
            }
        },

        // ===== CAMBIO DE PESTAÑAS =====
        async changeTab(tabId) {
            console.log(`🔄 Cambiando a tab: ${tabId}`);

            const targetTab = this.tabs.find(t => t.id === tabId);
            if (!targetTab) {
                console.error(`❌ Tab no encontrado: ${tabId}`);
                return;
            }

            // Verificar restricciones de acceso
            const accessCheck = this.canAccessTab(targetTab);
            if (!accessCheck.allowed) {
                this.showAccessDenied(targetTab, accessCheck.missingRequirement);
                return;
            }

            // Cambiar tab activo
            this.activeTab = tabId;

            // Inicializar tab si es necesario
            await this.initializeTab(targetTab);

            // Guardar estado
            this.saveData();

            console.log(`✅ Tab cambiado exitosamente a: ${tabId}`);
        },

        // ===== VERIFICACIÓN DE ACCESO MEJORADA =====
        canAccessTab(tab) {
            // Siempre permitir acceso a predimensionamiento
            if (tab.id === 'predimensionamiento') {
                return { allowed: true };
            }

            // Para dimensionamiento, verificar predimensionamiento
            if (tab.id === 'dimensionamiento') {
                if (!this.predimensionamientoCalculado) {
                    return {
                        allowed: false,
                        missingRequirement: 'predimensionamiento',
                        message: 'Primero debes completar el PREDIMENSIONAMIENTO antes de acceder al dimensionamiento.'
                    };
                }
                return { allowed: true };
            }

            // Para el resto de tabs, verificar dimensionamiento
            if (tab.requiredState === 'dimensionamientoCalculado') {
                if (!this.predimensionamientoCalculado) {
                    return {
                        allowed: false,
                        missingRequirement: 'predimensionamiento',
                        message: 'Primero debes completar el PREDIMENSIONAMIENTO.'
                    };
                }

                if (!this.dimensionamientoCalculado) {
                    return {
                        allowed: false,
                        missingRequirement: 'dimensionamiento',
                        message: 'Primero debes completar el DIMENSIONAMIENTO antes de acceder a esta sección.'
                    };
                }

                return { allowed: true };
            }

            return { allowed: true };
        },

        showAccessDenied(tab, missingRequirement) {
            let message = '';
            let redirectTab = 'predimensionamiento';

            if (missingRequirement === 'predimensionamiento') {
                message = 'Primero debes configurar y calcular el PREDIMENSIONAMIENTO antes de acceder a esta sección.';
                redirectTab = 'predimensionamiento';
            } else if (missingRequirement === 'dimensionamiento') {
                message = 'Primero debes completar el DIMENSIONAMIENTO antes de acceder a esta sección.';
                redirectTab = 'dimensionamiento';
            }

            console.log(`⚠️ Acceso denegado a ${tab.name}: ${message}`);

            Swal.fire({
                icon: 'warning',
                title: 'Acceso Restringido',
                text: message,
                confirmButtonText: 'Ir a la sección requerida',
                showCancelButton: true,
                cancelButtonText: 'Entendido',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#6c757d'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.changeTab(redirectTab);
                }
            });
        },

        // ===== MANEJO DE DATOS =====
        async loadStoredData() {
            try {
                const storedData = localStorage.getItem('murosContencionData');
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    this.systemData = { ...this.systemData, ...parsedData };

                    // Actualizar estados calculados
                    this.updateCalculationStates();

                    console.log('💾 Datos cargados desde localStorage');
                }
            } catch (error) {
                console.error('❌ Error cargando datos:', error);
            }
        },

        saveData() {
            try {
                localStorage.setItem('murosContencionData', JSON.stringify(this.systemData));
                console.log('💾 Datos guardados en localStorage');
            } catch (error) {
                console.error('❌ Error guardando datos:', error);
            }
        },

        updateCalculationStates() {
            this.predimensionamientoCalculado = this.hasValidResults('predimensionamiento');
            this.dimensionamientoCalculado = this.hasValidResults('dimensionamiento');

            console.log(`📊 Estados actualizados - Predim: ${this.predimensionamientoCalculado}, Dim: ${this.dimensionamientoCalculado}`);
        },

        hasValidResults(moduleName) {
            const moduleData = this.systemData[moduleName];
            return moduleData &&
                moduleData.resultados &&
                Object.keys(moduleData.resultados).length > 0 &&
                moduleData.isCalculated === true &&
                !(moduleData.errors && moduleData.errors.length > 0);
        },

        // ===== MANEJO DE ACTUALIZACIONES DE DATOS =====
        handleDataUpdate(moduleName, data) {
            console.log(`📊 Actualizando datos de ${moduleName}:`, data);

            // Actualizar datos del módulo
            this.systemData[moduleName] = {
                ...this.systemData[moduleName],
                ...data
            };

            // Actualizar estados
            this.updateCalculationStates();

            // Guardar datos
            this.saveData();

            // Mostrar notificaciones si es necesario
            this.showCalculationNotifications(moduleName, data);

            // Notificar a otros componentes
            this.notifyDataChange(moduleName, data);

            // Propagar datos a módulos dependientes
            this.propagateDataToDependent(moduleName);
        },

        // ===== PROPAGACIÓN DE DATOS A MÓDULOS DEPENDIENTES =====
        propagateDataToDependent(sourceModule) {
            console.log(sourceModule);
            // Si predimensionamiento se actualiza, enviar datos a dimensionamiento
            if (sourceModule === 'predimensionamiento' && this.predimensionamientoCalculado) {
                console.log('🔄 Propagando datos de predimensionamiento a dimensionamiento');

                // Disparar evento específico para dimensionamiento
                document.dispatchEvent(new CustomEvent('predimensionamiento-data-ready', {
                    detail: {
                        predimensionamientoData: this.systemData.predimensionamiento,
                        timestamp: new Date().toISOString()
                    }
                }));
            }

            // Si dimensionamiento se actualiza, enviar datos a otros módulos
            if (sourceModule === 'dimensionamiento' && this.dimensionamientoCalculado) {
                console.log('🔄 Propagando datos de dimensionamiento a otros módulos');

                // Disparar evento para todos los módulos que dependen de dimensionamiento
                document.dispatchEvent(new CustomEvent('dimensionamiento-data-ready', {
                    detail: {
                        predimensionamientoData: this.systemData.predimensionamiento,
                        dimensionamientoData: this.systemData.dimensionamiento,
                        timestamp: new Date().toISOString()
                    }
                }));
            }
        },

        showCalculationNotifications(moduleName, data) {
            if (moduleName === 'predimensionamiento' && data.isCalculated) {
                if (this.predimensionamientoCalculado) {
                    Swal.fire({
                        icon: 'success',
                        title: '✅ Predimensionamiento Completado',
                        text: '¡Excelente! Ahora puedes continuar con el dimensionamiento.',
                        confirmButtonText: 'Continuar al Dimensionamiento',
                        showCancelButton: true,
                        cancelButtonText: 'Quedarme aquí',
                        timer: 5000,
                        timerProgressBar: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.changeTab('dimensionamiento');
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '❌ Error en Predimensionamiento',
                        text: 'Hay errores en los cálculos. Por favor, revisa los datos.',
                        confirmButtonText: 'Revisar'
                    });
                }
            }

            if (moduleName === 'dimensionamiento' && data.isCalculated) {
                if (this.dimensionamientoCalculado) {
                    Swal.fire({
                        icon: 'success',
                        title: '✅ Dimensionamiento Completado',
                        text: '¡Perfecto! Ahora puedes acceder a todas las secciones del sistema.',
                        confirmButtonText: 'Explorar Secciones',
                        timer: 5000,
                        timerProgressBar: true
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '❌ Error en Dimensionamiento',
                        text: 'Hay errores en los cálculos. Por favor, revisa los datos.',
                        confirmButtonText: 'Revisar'
                    });
                }
            }
        },

        // ===== EVENT LISTENERS =====
        setupEventListeners() {
            console.log('🎧 Configurando event listeners...');

            // Listener para predimensionamiento
            document.addEventListener('predimensionamiento-updated', (event) => {
                this.handleDataUpdate('predimensionamiento', event.detail);
            });

            // Listener para dimensionamiento
            document.addEventListener('dimensionamiento-updated', (event) => {
                this.handleDataUpdate('dimensionamiento', event.detail);
            });

            // Listeners para otros módulos
            ['cargas', 'verificaciones', 'esquemacargas', 'analisisEstructuras', 'concretoArmado', 'dibujo', 'metrado'].forEach(moduleName => {
                document.addEventListener(`${moduleName}-updated`, (event) => {
                    this.handleDataUpdate(moduleName, event.detail);
                });
            });

            console.log('✅ Event listeners configurados');
        },

        notifyDataChange(moduleName, data) {
            document.dispatchEvent(new CustomEvent('system-data-updated', {
                detail: {
                    source: moduleName,
                    data: data,
                    allSystemData: this.systemData,
                    calculationStates: {
                        predimensionamientoCalculado: this.predimensionamientoCalculado,
                        dimensionamientoCalculado: this.dimensionamientoCalculado
                    },
                    timestamp: new Date().toISOString()
                }
            }));
        },

        // ===== UTILIDADES =====
        showError(message) {
            console.error(`❌ Error: ${message}`);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
                confirmButtonText: 'Entendido'
            });
        },

        showSuccess(message) {
            console.log(`✅ Éxito: ${message}`);
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: message,
                confirmButtonText: 'Continuar'
            });
        },

        // ===== UTILIDADES DE ESTADO =====
        getTabStatus(tabId) {
            const tab = this.tabs.find(t => t.id === tabId);
            if (!tab) return 'unknown';

            const accessCheck = this.canAccessTab(tab);
            if (!accessCheck.allowed) return 'locked';

            const moduleData = this.systemData[tabId];
            if (moduleData && moduleData.isCalculated) return 'completed';

            return 'available';
        },

        // ===== FUNCIONES DE ADMINISTRACIÓN =====
        exportData() {
            const exportData = {
                systemData: this.systemData,
                states: {
                    predimensionamientoCalculado: this.predimensionamientoCalculado,
                    dimensionamientoCalculado: this.dimensionamientoCalculado
                },
                metadata: {
                    exportDate: new Date().toISOString(),
                    version: '1.0'
                }
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `muro-contencion-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        },

        resetSystem() {
            Swal.fire({
                title: '¿Estás seguro?',
                text: 'Esta acción eliminará todos los datos calculados.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, resetear',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Resetear datos
                    this.systemData = {
                        predimensionamiento: { materiales: {}, dimensiones: {}, resultados: {}, inputValues: {}, errors: [], isCalculated: false },
                        dimensionamiento: { datos: {}, resultados: {}, inputValues: {}, errors: [], isCalculated: false },
                        cargas: { parametros: {}, calculos: {}, resultados: {} },
                        verificaciones: { datos: {}, resultados: {} },
                        esquemacargas: { datos: {}, resultados: {} },
                        presionsuelo: { parametros: {}, calculos: {} },
                        analisisEstructuras: { cargas: {}, analisis: {} },
                        concretoArmado: { parametros: {}, diseño: {} },
                        dibujo: { parametros: {}, diseño: {} },
                        metrado: { parametros: {}, diseño: {} }
                    };

                    this.predimensionamientoCalculado = false;
                    this.dimensionamientoCalculado = false;
                    this.activeTab = 'predimensionamiento';

                    localStorage.removeItem('murosContencionData');

                    this.showSuccess('Sistema reseteado exitosamente');

                    // Reinicializar
                    this.initializeCurrentTab();
                }
            });
        }
    }));
});

// ===== INICIALIZACIÓN DEL SISTEMA =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🌟 DOM cargado, iniciando sistema...');

    // Esperar a que Alpine.js esté listo
    document.addEventListener('alpine:initialized', () => {
        console.log('✅ Alpine.js inicializado, sistema listo');
    });
});