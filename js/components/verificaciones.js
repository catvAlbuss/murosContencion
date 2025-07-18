function initVerificacionesModule() {
    const verificaciones = document.getElementById('verificaciones-content');
    if (!verificaciones) {
        //console.error('Contenedor verificaciones no encontrado');
        return;
    }

    verificaciones.innerHTML = `
        <div x-data="verificacionesModule()" class="cuaderno p-4 max-w-full mx-auto font-mono">
            <!-- ENTRADAS Y SALIDAS -->
            <div class="grid grid-cols-1 md:grid-cols-1 gap-2">
                <!-- DATOS: VERIFICACIONES -->
                <div class="mt-2 p-2 bg-gray-50 border border-gray-300 rounded shadow-sm">
                    <div class="flex items-center justify-between cursor-pointer mb-3" @click="showCombinacioncero = !showCombinacioncero">
                        <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                            <i class='fas fa-table mr-2 text-gray-500'></i>
                            VERIFICACIONES
                        </h3>
                        <span class="text-xs text-gray-500" x-text="showCombinacioncero ? 'Ocultar' : 'Mostrar'"></span>
                    </div>
                    <div x-show="showCombinacioncero" class="overflow-x-auto">
                        <table class="w-full text-sm border-collapse border border-gray-300">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="border border-gray-300 p-2 text-left">COMPONENTE</th>
                                    <th class="border border-gray-300 p-2 text-left">AREA(m²)</th>
                                    <th class="border border-gray-300 p-2 text-left">Fy PESO(Tn)</th>
                                    <th class="border border-gray-300 p-2 text-left">Fx(Tn)</th>
                                    <th class="border border-gray-300 p-2 text-left">Brazo (y)m</th>
                                    <th class="border border-gray-300 p-2 text-left">Brazo (x)m</th>
                                    <th class="border border-gray-300 p-2 text-left">MOMENTO(Tn-m)</th>
                                    <th class="border border-gray-300 p-2 text-left">P Friccion</th>
                                    <th class="border border-gray-300 p-2 text-left">DESCRIPCION</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template x-for="tablecargas in combinacionestable" :key="tablecargas.key || tablecargas.label">
                                    <tr class="hover:bg-gray-50">
                                        <td class="border border-gray-300 p-2" x-text="tablecargas.label"></td>
                                        <td class="border border-gray-300 p-2 text-right" x-text="formatValue(getValue(tablecargas.areaKey))"></td>
                                        <td class="border border-gray-300 p-2 text-right" x-text="formatValue(getValue(tablecargas.pesoKey))"></td>
                                        <td class="border border-gray-300 p-2 text-right" x-text="formatValue(getValue(tablecargas.fxKey))"></td>
                                        <td class="border border-gray-300 p-2 text-right" x-text="formatValue(getValue(tablecargas.brazoYKey))"></td>
                                        <td class="border border-gray-300 p-2 text-right" x-text="formatValue(getValue(tablecargas.brazoXKey))"></td>
                                        <td class="border border-gray-300 p-2 text-right" x-text="formatValue(getValue(tablecargas.momentoKey))"></td>
                                        <td class="border border-gray-300 p-2 text-right" x-text="formatValue(getValue(tablecargas.friccionKey))"></td>
                                        <td class="border border-gray-300 p-2 text-left" x-text="tablecargas.description"></td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <!-- N-->
                            <div class="flex flex-row">
                                <span>N = </span>
                                <span x-text="datosCalculados.C186">2.07 m</span>
                            </div>

                            <!-- Mr -->
                            <div class="flex flex-row">
                                <span>Mr = </span>
                                <span x-text="datosCalculados.G186">2.07 m</span>
                            </div>

                            <!-- AREA DE CONCRETO -->
                            <div class="flex flex-row">
                                <span>AREA DE CONCRETO = </span>
                                <span x-text="datosCalculados.C187 + ' m²'">2.07 m</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-between cursor-pointer mb-3" @click="showCombinacioncargas = !showCombinacioncargas">
                        <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                            <i class='fas fa-table mr-2 text-gray-500'></i>
                            COMBINACION DE CARGAS
                        </h3>
                        <span class="text-xs text-gray-500" x-text="showCombinacioncargas ? 'Ocultar' : 'Mostrar'"></span>
                    </div>
                    <div x-show="showCombinacioncargas" class="overflow-x-auto">
                        <div id="table-combinacion-cargas" class="border border-slate-200 rounded-lg overflow-hidden"></div>
                    </div>

                    <div class="flex items-center justify-between cursor-pointer mb-3" @click="showEstabilidadVolteo = !showEstabilidadVolteo">
                        <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                            <i class='fas fa-table mr-2 text-gray-500'></i>
                            ESTABILIDAD A VOLTEO
                        </h3>
                        <span class="text-xs text-gray-500" x-text="showEstabilidadVolteo ? 'Ocultar' : 'Mostrar'"></span>
                    </div>
                    <div x-show="showEstabilidadVolteo" class="overflow-x-auto">
                        <div id="table-Estabilidad-Volteo" class="border border-slate-200 rounded-lg overflow-hidden"></div>
                    </div>

                    <div class="flex items-center justify-between cursor-pointer mb-3" @click="showEstabilidadDeslizamiento = !showEstabilidadDeslizamiento">
                        <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                            <i class='fas fa-table mr-2 text-gray-500'></i>
                            ESTABILIDAD A DESLIZAMIENTO
                        </h3>
                        <span class="text-xs text-gray-500" x-text="showEstabilidadDeslizamiento ? 'Ocultar' : 'Mostrar'"></span>
                    </div>
                    <div x-show="showEstabilidadDeslizamiento" class="overflow-x-auto">
                        <div id="table-Estabilidad-Deslizamiento" class="border border-slate-200 rounded-lg overflow-hidden"></div>
                    </div>

                    <div class="flex items-center justify-between cursor-pointer mb-3" @click="showpresionesAdmisibles = !showpresionesAdmisibles">
                        <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                            <i class='fas fa-table mr-2 text-gray-500'></i>
                            VERIFICACION DE PRESIONES ADMISIBLES
                        </h3>
                        <span class="text-xs text-gray-500" x-text="showpresionesAdmisibles ? 'Ocultar' : 'Mostrar'"></span>
                    </div>
                    <div x-show="showpresionesAdmisibles" class="overflow-x-auto">
                        <div id="table-Presiones-Admisibles" class="border border-slate-200 rounded-lg overflow-hidden"></div>
                    </div>
                </div>

                <!-- Mostrar errores si existen -->
                <div x-show="hasErrors" class="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                    <h4 class="text-red-800 font-semibold mb-2">Errores encontrados:</h4>
                    <template x-for="error in errors" :key="error.id">
                        <div class="text-red-700 text-sm" x-text="error.message"></div>
                    </template>
                </div>
            </div>
        </div>
    `;

    Alpine.data('verificacionesModule', () => ({
        // Estado de visualización
        showCombinacioncero: true,
        showCombinacioncargas: true,
        showEstabilidadVolteo: false,
        showEstabilidadDeslizamiento: false,
        showpresionesAdmisibles: false,

        // Datos recibidos
        datosDimensionamiento: {},
        datosCargas: {},
        datosVerificaciones: {},
        datosCalculados: {},
        resultados: {},
        errors: [],

        // Datos de combinaciones de cargas (editables)
        combinacionCargas: [
            { id: '1', comb1: 0, comb2: 0.7, comb3: 0.525, comb4: 0, comb5: 1 },
            { id: '2', comb1: 1, comb2: 1, comb3: 1, comb4: 1, comb5: 1 },
            { id: '3', comb1: 1, comb2: 1, comb3: 1, comb4: 1, comb5: 1 },
            { id: '4', comb1: 1, comb2: 0, comb3: 0.75, comb4: 1, comb5: 1 },
            { id: '5', comb1: 0.6, comb2: 0.6, comb3: 0.6, comb4: 1, comb5: 1 },
            { id: '6', comb1: 0.6, comb2: 0.6, comb3: 0.6, comb4: 1, comb5: 1 },
            { id: '7', comb1: 1, comb2: 1, comb3: 0.75, comb4: 1, comb5: 1 },
            { id: '8', comb1: 1, comb2: 0, comb3: 0.75, comb4: 1, comb5: 1 },
            { id: '9', comb1: 0.6, comb2: 0.6, comb3: 0.6, comb4: 1, comb5: 1 },
            { id: '10', comb1: 0.6, comb2: 0.6, comb3: 0.6, comb4: 1, comb5: 1 },
            { id: '11', comb1: 1, comb2: 1, comb3: 0.75, comb4: 1, comb5: 1 },
            { id: '12', comb1: 1, comb2: 1, comb3: 0.75, comb4: 1, comb5: 1 },
            { id: '13', comb1: 1, comb2: 1, comb3: 0.75, comb4: 1, comb5: 1 },
            { id: '14', comb1: 1, comb2: 1, comb3: 0.75, comb4: 1, comb5: 1 },
            { id: '15', comb1: 1, comb2: 1, comb3: 0.75, comb4: 1, comb5: 1 },
        ],

        // Instancias de tablas
        tableInstances: {},
        isCalculating: false,

        init() {
            //console.log('Inicializando verificacionesModule...');
            this.loadSavedData();
            this.configurarEventos();
            this.createTableCombinacionCargas();
            this.createTableEstabilidadVolteo();
            this.createTableEstabilidadDeslizamiento();
            this.createTablePresionesAdmisibles();
        },

        loadSavedData() {
            const systemData = this.getSystemData();
            if (systemData) {
                // Cargar datos de predimensionamiento (si es que cargas los necesita directamente)
                if (systemData.predimensionamiento && systemData.predimensionamiento.isCalculated) {
                    this.predimData = {
                        inputValues: systemData.predimensionamiento.inputValues || {},
                        resultados: systemData.predimensionamiento.resultados || {}
                    };
                    console.log('📊 Datos de predimensionamiento cargados en cargasModule (desde savedData).');
                }

                // AHORA CARGAMOS LOS DATOS DE DIMENSIONAMIENTO
                if (systemData.dimensionamiento && systemData.dimensionamiento.isCalculated) {
                    this.dimensionamientoData = {
                        inputValues: systemData.dimensionamiento.inputValues || {},
                        resultados: systemData.dimensionamiento.resultados || {},
                        isCalculated: systemData.dimensionamiento.isCalculated,
                        errors: systemData.dimensionamiento.errors || []
                    };
                    console.log('📊 Datos de dimensionamiento cargados en cargasModule (desde savedData).');
                    // Al cargar datos guardados, recalculamos por si dependen de dimensionamiento
                    //this.calcularResultados();
                } else if (systemData.dimensionamiento) {
                    // Si dimensionamiento existe pero no está calculado, aún podemos guardar sus inputValues si son relevantes
                    this.dimensionamientoData = {
                        inputValues: systemData.dimensionamiento.inputValues || {},
                        resultados: {}, // Vacío si no calculado
                        isCalculated: false,
                        errors: systemData.dimensionamiento.errors || []
                    };
                }

                // Opcional: cargar resultados propios de 'cargas' si se guardaron en 'systemData.cargas'
                if (systemData.cargas) {
                    this.resultados = systemData.cargas.resultados || {};
                    this.errors = systemData.cargas.errors || [];
                    console.log('📊 Datos de cargas cargados (desde savedData).');
                }
            }
        },

        getSystemData() {
            try {
                const storedData = localStorage.getItem('murosContencionData');
                return storedData ? JSON.parse(storedData) : null;
            } catch (error) {
                console.error('Error cargando datos del sistema:', error);
                return null;
            }
        },

        configurarEventos() {
            document.addEventListener('dimensionamiento-updated', (event) => {
                this.procesarDatosDimensionamiento(event.detail);
            });
            document.addEventListener('cargas-updated', (event) => {
                this.procesarDatosCargas(event.detail);
            });
        },

        procesarDatosDimensionamiento(eventData) {
            //console.log('Datos de dimensionamiento recibidos:', eventData);
            if (eventData && eventData.resultados) {
                this.datosDimensionamiento = {
                    inputValues: eventData.inputValues || {},
                    resultados: eventData.resultados || {},
                    errors: eventData.errors || []
                };
                this.resultados = { ...this.resultados, ...eventData.resultados };
                this.recalcularVerificaciones();
            } else {
                //console.warn('Datos de dimensionamiento no válidos o incompletos');
                this.addError('dimensionamiento', 'Datos de dimensionamiento no válidos o incompletos');
            }
        },

        procesarDatosCargas(eventData) {
            //console.log('Datos de cargas recibidos:', eventData);
            if (eventData && eventData.resultados) {
                this.datosCargas = {
                    inputValues: eventData.inputValues || {},
                    resultados: eventData.resultados || {},
                    errors: eventData.errors || []
                };
                this.resultados = { ...this.resultados, ...eventData.resultados };
                this.recalcularVerificaciones();
            } else {
                console.warn('Datos de cargas no válidos o incompletos');
                this.addError('cargas', 'Datos de cargas no válidos o incompletos');
            }
        },

        calcularVerificaciones() {
            try {
                this.clearErrors();
                //console.log('Iniciando cálculos de verificaciones...');
                //console.log('Datos disponibles:', this.resultados);
                this.calcularComponentes();
                //console.log('Cálculos completados:', this.datosCalculados);
                this.updateAllTables();
                this.enviarDatosVerificaciones();
            } catch (error) {
                console.error('Error en cálculos de verificaciones:', error);
                this.addError('calculo', 'Error en los cálculos de verificaciones: ' + error.message);
            }
        },

        // Define the component configurations
        get combinacionestable() {
            const baseConfig = [
                { key: 'componente1', label: '2', areaKey: 'B171', pesoKey: 'C171', fxKey: 'D171', brazoYKey: 'E171', brazoXKey: 'F171', momentoKey: 'G171', friccionKey: 'H171', description: 'Empuje sismico' },
                { key: 'componente2', label: '3', areaKey: 'B172', pesoKey: 'C172', fxKey: 'D172', brazoYKey: 'E172', brazoXKey: 'F172', momentoKey: 'G172', friccionKey: 'H172', description: 'Empuje ACTIVO' },
                { key: 'componente3', label: '', areaKey: 'B173', pesoKey: 'C173', fxKey: 'D173', brazoYKey: 'E173', brazoXKey: 'F173', momentoKey: 'G173', friccionKey: 'H173', description: 'Emp ACTI COH' },
                { key: 'componente4', label: '5', areaKey: 'B174', pesoKey: 'C174', fxKey: 'D174', brazoYKey: 'E174', brazoXKey: 'F174', momentoKey: 'G174', friccionKey: 'H174', description: 'Empuje s/c' },
                { key: 'componente5', label: '4', areaKey: 'B175', pesoKey: 'C175', fxKey: 'D175', brazoYKey: 'E175', brazoXKey: 'F175', momentoKey: 'G175', friccionKey: 'H175', description: 'EMPUJE PASIVO' },
                { key: 'componente6', label: '', areaKey: 'B176', pesoKey: 'C176', fxKey: 'D176', brazoYKey: 'E176', brazoXKey: 'F176', momentoKey: 'G176', friccionKey: 'H176', description: 'Emp PASI COH' },
                { key: 'componente7', label: '1', areaKey: 'B177', pesoKey: 'C177', fxKey: 'D177', brazoYKey: 'E177', brazoXKey: 'F177', momentoKey: 'G177', friccionKey: 'H177', description: 'CARGA PUNTUA' },
                { key: 'componente8', label: '6', areaKey: 'B178', pesoKey: 'C178', fxKey: 'D178', brazoYKey: 'E178', brazoXKey: 'F178', momentoKey: 'G178', friccionKey: 'H178', description: 'S/C' },
                { key: 'componente9', label: '7', areaKey: 'B179', pesoKey: 'C179', fxKey: 'D179', brazoYKey: 'E179', brazoXKey: 'F179', momentoKey: 'G179', friccionKey: 'H179', description: 'SUELO TALUD' },
                { key: 'componente10', label: '8', areaKey: 'B180', pesoKey: 'C180', fxKey: 'D180', brazoYKey: 'E180', brazoXKey: 'F180', momentoKey: 'G180', friccionKey: 'H180', description: 'SUELO' },
                { key: 'componente11', label: '9', areaKey: 'B181', pesoKey: 'C181', fxKey: 'D181', brazoYKey: 'E181', brazoXKey: 'F181', momentoKey: 'G181', friccionKey: 'H181', description: 'BASE' },
                { key: 'componente12', label: '10', areaKey: 'B182', pesoKey: 'C182', fxKey: 'D182', brazoYKey: 'E182', brazoXKey: 'F182', momentoKey: 'G182', friccionKey: 'H182', description: 'CUÑA' },
                { key: 'componente13', label: '11', areaKey: 'B183', pesoKey: 'C183', fxKey: 'D183', brazoYKey: 'E183', brazoXKey: 'F183', momentoKey: 'G183', friccionKey: 'H183', description: 'PANTALLA' },
                { key: 'componente14', label: '12', areaKey: 'B184', pesoKey: 'C184', fxKey: 'D184', brazoYKey: 'E184', brazoXKey: 'F184', momentoKey: 'G184', friccionKey: 'H184', description: 'DIENTE' },
                { key: 'componente15', label: '', areaKey: 'B185', pesoKey: 'C185', fxKey: 'D185', brazoYKey: 'E185', brazoXKey: 'F185', momentoKey: 'G185', friccionKey: 'H185', description: 'Cof. Cohes' }
            ];

            // Dynamically generate additional components if needed
            const additionalComponents = Array.from({ length: 4 }, (_, i) => ({
                key: `componente${16 + i}`,
                label: '',
                areaKey: `B${185 + i}`,
                pesoKey: `C${185 + i}`,
                fxKey: `D${185 + i}`,
                brazoYKey: `E${185 + i}`,
                brazoXKey: `F${185 + i}`,
                momentoKey: `G${185 + i}`,
                friccionKey: `H${185 + i}`,
                description: `Component ${16 + i}`,
            }));

            return [...baseConfig,];
        },

        // Helper to safely get values from datosCalculados primero, luego resultados
        getValue(key, defaultValue = 0) {
            if (this.datosCalculados && this.datosCalculados[key] !== undefined) {
                return this.datosCalculados[key];
            }
            if (this.resultados && this.resultados[key] !== undefined) {
                return this.resultados[key];
            }
            return defaultValue;
        },

        parseNumericValue(value) {
            if (value === null || value === undefined || value === '') return 0;
            const numValue = parseFloat(value);
            return isNaN(numValue) ? 0 : numValue;
        },

        calcularComponentes() {
            // Initialize calculated data
            // Common calculations for shared values
            const gv = this.getValue('graficoverificacion');
            const materiales = this.getValue('materiales');
            const geometria = this.getValue('geometria');
            const cargas = this.getValue('cargas');
            const c96 = gv?.C96 ?? '';
            const commonValues = {
                B90: gv?.B90 ?? 0,
                //F172: this.getValue('graficoverificacion.A89') + this.getValue('graficoverificacion.B88'),
                F172: (gv?.A89 ?? 0) + (gv?.B88 ?? 0),
                E173: this.getValue('B119') / 2,
                F177: (gv?.C74 ?? 0) / 2 + (gv?.A83 ?? 0) + (gv?.A89 ?? 0),
                F178: (gv?.D89 ?? 0) / 2 + (gv?.B88 ?? 0) + (gv?.A89 ?? 0),
                C178: (cargas?.B25 ?? 0) * (gv?.D89 ?? 0),

                //--
                B179: (gv?.D89 ?? 0) * (gv?.E74 ?? 0),
                F179: 2 * (gv?.D89 ?? 0) / 3 + (gv?.A89 ?? 0) + (gv?.B88 ?? 0),
                //--
                B180: (gv?.D89 ?? 0) * (gv?.E79 ?? 0),
                C180: (gv?.D89 ?? 0) * (gv?.E79 ?? 0) * (materiales?.B11 ?? 0),
                F180: (gv?.D89 ?? 0) / 2 + (gv?.B88 ?? 0) + (gv?.A89 ?? 0),
                G180: ((gv?.D89 ?? 0) * (gv?.E79 ?? 0) * (materiales?.B11 ?? 0)) * ((gv?.D89 ?? 0) / 2 + (gv?.B88 ?? 0) + (gv?.A89 ?? 0)),
                H180: ((gv?.D89 ?? 0) * (gv?.E79 ?? 0) * (materiales?.B11 ?? 0)) * (materiales?.B14 ?? 0),

                //--
                B181: (gv?.B90 ?? 0) * (gv?.F86 ?? 0),
                C181: ((gv?.B90 ?? 0) * (gv?.F86 ?? 0)) * (materiales?.B6 ?? 0),
                F181: (gv?.B90 ?? 0) / 2,
                G181: (((gv?.B90 ?? 0) * (gv?.F86 ?? 0)) * (materiales?.B6 ?? 0)) * ((gv?.B90 ?? 0) / 2),
                H181: (((gv?.B90 ?? 0) * (gv?.F86 ?? 0)) * (materiales?.B6 ?? 0)) * (materiales?.B14 ?? 0),
                //--
                B182: (gv?.A83 ?? 0) * (gv?.E79 ?? 0) * 0.5,
                C182: ((gv?.A83 ?? 0) * (gv?.E79 ?? 0) * 0.5) * (materiales?.B6 ?? 0),
                F182: 2 * (gv?.A83 ?? 0) / 3 + (gv?.A89 ?? 0),
                G182: (((gv?.A83 ?? 0) * (gv?.E79 ?? 0) * 0.5) * (materiales?.B6 ?? 0)) * (2 * (gv?.A83 ?? 0) / 3 + (gv?.A89 ?? 0)),
                H182: (((gv?.A83 ?? 0) * (gv?.E79 ?? 0) * 0.5) * (materiales?.B6 ?? 0)) * (materiales?.B14 ?? 0),
                //--
                B183: (gv?.C74 ?? 0) * (gv?.E79 ?? 0),
                C183: ((gv?.C74 ?? 0) * (gv?.E79 ?? 0)) * (materiales?.B6 ?? 0),
                F183: (gv?.C74 ?? 0) / 2 + (gv?.A83 ?? 0) + (gv?.A89 ?? 0),
                G183: (((gv?.C74 ?? 0) * (gv?.E79 ?? 0)) * (materiales?.B6 ?? 0)) * ((gv?.C74 ?? 0) / 2 + (gv?.A83 ?? 0) + (gv?.A89 ?? 0)),
                H183: ((gv?.F95 ?? 0) + (gv?.F91 ?? 0)) * (gv?.G94 ?? 0) / 2,
                //--
                B184: ((gv?.F95 ?? 0) + (gv?.F91 ?? 0)) * (gv?.G94 ?? 0) / 2,
                C184: (((gv?.F95 ?? 0) + (gv?.F91 ?? 0)) * (gv?.G94 ?? 0) / 2) * (materiales?.B6 ?? 0),
                F184: (gv?.C92 ?? 0),
                G184: ((((gv?.F95 ?? 0) + (gv?.F91 ?? 0)) * (gv?.G94 ?? 0) / 2) * (materiales?.B6 ?? 0)) * (gv?.C92 ?? 0),
                H184: ((((gv?.F95 ?? 0) + (gv?.F91 ?? 0)) * (gv?.G94 ?? 0) / 2) * (materiales?.B6 ?? 0)) * (materiales?.B14 ?? 0),
                //--
                H185: ((gv?.C96 ?? '') === "SI") ? ((materiales?.B13 ?? 0) * (gv?.B90 ?? 0)) : 0,
                //--
            };

            // Component-specific calculations
            const calculations = [
                {
                    areaKey: 'B171', area: 0.00, peso: 0, fx: this.getValue('C160'), brazoY: this.getValue('C162'), brazoX: 0,
                    momento: () => this.datosCalculados.D171 * this.datosCalculados.E171, friccion: () => this.datosCalculados.D171,
                },
                {
                    areaKey: 'B172', area: 0.00, peso: this.getValue('B124'), fx: this.getValue('B125'), brazoY: this.getValue('E172'), brazoX: commonValues.F172,
                    momento: () => this.datosCalculados.E172 * this.datosCalculados.D172 - this.datosCalculados.C172 * this.datosCalculados.F172,
                    friccion: () => this.datosCalculados.D172,
                },
                {
                    areaKey: 'B173', area: 0.00, peso: this.getValue('B129'), fx: this.getValue('B130'), brazoY: commonValues.E173, brazoX: commonValues.F172,
                    momento: () => this.datosCalculados.E173 * this.datosCalculados.D173 - this.datosCalculados.C173 * this.datosCalculados.F173,
                    friccion: () => this.datosCalculados.D173,
                },
                {
                    areaKey: 'B174', area: 0.00, peso: this.getValue('B137'), fx: this.getValue('B138'), brazoY: commonValues.E173, brazoX: commonValues.F172,
                    momento: () => this.datosCalculados.E174 * this.datosCalculados.D174 - this.datosCalculados.C174 * this.datosCalculados.F174,
                    friccion: () => this.datosCalculados.D174,
                },
                {
                    areaKey: 'B175', area: 0.00, peso: 0.00, fx: this.getValue('B110'), brazoY: this.getValue('E175'), brazoX: 0.00,
                    momento: () => this.datosCalculados.D175 * this.datosCalculados.E175, friccion: () => this.datosCalculados.D175,
                },
                {
                    areaKey: 'B176', area: 0.00, peso: 0.00, fx: this.getValue('B115'), brazoY: this.getValue('E175'), brazoX: 0.00,
                    momento: () => this.datosCalculados.D176 * this.datosCalculados.E176, friccion: () => this.datosCalculados.D176,
                },
                {
                    areaKey: 'B177', area: 0.00, peso: 0.00, fx: 0.00, brazoY: 0.00,
                    brazoX: () => commonValues.F177,
                    momento: () => 0 * commonValues.F177,
                    friccion: () => 0 * (materiales?.B14 ?? 0),
                },
                {
                    areaKey: 'B178', area: 0,
                    peso: () => commonValues.C178, fx: 0.00, brazoY: 0.00,
                    brazoX: () => commonValues.F178,
                    momento: () => commonValues.C178 * commonValues.F178,
                    friccion: () => commonValues.C178 * (materiales?.B14 ?? 0)
                },
                {
                    areaKey: 'B179',
                    area: () => commonValues.B179,
                    peso: () => commonValues.B179 * (materiales?.B11 ?? 0),
                    fx: 0.00, brazoY: 0.00,
                    brazoX: () => commonValues.F179,
                    momento: () => commonValues.B179 * (materiales?.B11 ?? 0) * commonValues.F179,
                    friccion: () => (commonValues.B179 * (materiales?.B11 ?? 0)) * (materiales?.B14 ?? 0)
                },
                { areaKey: 'B180', area: () => commonValues.B180, peso: () => commonValues.C180, fx: 0.00, brazoY: 0.00, brazoX: () => commonValues.F180, momento: () => commonValues.G180, friccion: () => commonValues.H180 },
                { areaKey: 'B181', area: () => commonValues.B181, peso: () => commonValues.C181, fx: 0.00, brazoY: 0.00, brazoX: () => commonValues.F181, momento: () => commonValues.G181, friccion: () => commonValues.H181 },
                { areaKey: 'B182', area: () => commonValues.B182, peso: () => commonValues.C182, fx: 0.00, brazoY: 0.00, brazoX: () => commonValues.F182, momento: () => commonValues.G182, friccion: () => commonValues.H182 },
                { areaKey: 'B183', area: () => commonValues.B183, peso: () => commonValues.C183, fx: 0.00, brazoY: 0.00, brazoX: () => commonValues.F183, momento: () => commonValues.G183, friccion: () => commonValues.H183 },
                { areaKey: 'B184', area: () => commonValues.B184, peso: () => commonValues.C184, fx: 0.00, brazoY: 0.00, brazoX: () => commonValues.F184, momento: () => commonValues.G184, friccion: () => commonValues.H184 },
                { areaKey: 'B185', area: 0.00, peso: 0.00, fx: 0.00, brazoY: 0.00, brazoX: 0.00, momento: () => 0.00, friccion: () => commonValues.H185 },
            ];

            const resolve = val => (typeof val === 'function' ? val() : val);

            // Primera pasada: cargar valores base (área, peso, fx, brazoY, brazoX)
            calculations.forEach(calc => {
                const id = calc.areaKey.slice(1);

                this.datosCalculados[calc.areaKey] = resolve(calc.area);
                this.datosCalculados[calc.pesoKey || `C${id}`] = resolve(calc.peso); // <- corregido
                this.datosCalculados[calc.fxKey || `D${id}`] = calc.fx;
                this.datosCalculados[calc.brazoYKey || `E${id}`] = calc.brazoY;
                this.datosCalculados[calc.brazoXKey || `F${id}`] = typeof calc.brazoX === 'function' ? calc.brazoX() : calc.brazoX;
            });

            // Segunda pasada: evaluar momento y fricción cuando datos ya están cargados
            calculations.forEach(calc => {
                const id = calc.areaKey.slice(1);

                this.datosCalculados[calc.momentoKey || `G${id}`] =
                    typeof calc.momento === 'function' ? calc.momento() : calc.momento;

                this.datosCalculados[calc.friccionKey || `H${id}`] =
                    typeof calc.friccion === 'function' ? calc.friccion() : calc.friccion;
            });

            // Cálculo de verificaciones totales
            this.calcularVerificacionesTotal();

            // Sort combinacionestable by momento in descending order
            this.combinacionestable.sort((a, b) => {
                const momentoA = this.datosCalculados[a.momentoKey] || 0;
                const momentoB = this.datosCalculados[b.momentoKey] || 0;
                return momentoB - momentoA;
            });
            this.createTableEstabilidadVolteo();
        },

        calcularVerificacionesTotal() {
            // C186: Suma de toda la columna pesos (C171 a C185)
            let sumaPesos = 0;
            for (let i = 171; i <= 185; i++) {
                sumaPesos += this.datosCalculados[`C${i}`] || 0;
            }

            this.datosCalculados.C186 = this.formatearValor(sumaPesos);

            // G186: Suma de momentos desde la fila 6 hasta la fila 12 (G177 a G183)
            let sumaMomentos = 0;
            for (let i = 177; i <= 183; i++) {
                sumaMomentos += this.datosCalculados[`G${i}`] || 0;
            }
            this.datosCalculados.G186 = this.formatearValor(sumaMomentos);

            // C187: Suma de fricción desde la fila 9 hasta la 12 (H180 a H183)
            let sumaFriccion = 0;
            for (let i = 181; i <= 184; i++) {
                sumaFriccion += this.datosCalculados[`B${i}`] || 0;
            }
            //console.log(sumaFriccion);
            this.datosCalculados.C187 = this.formatearValor(sumaFriccion);
        },

        getBaseColumns() {
            return [
                { title: "D+L+(Hó0.6H)", field: "comb1", editor: "number", headerSort: false, cssClass: "text-center" },
                { title: "D+(Hó0.6H)+0.70E", field: "comb2", editor: "number", headerSort: false, cssClass: "text-center" },
                { title: "0.75D+0.75L+0.525E+0.6H", field: "comb3", editor: "number", headerSort: false, cssClass: "text-center" },
                { title: "D+L+H", field: "comb4", editor: "number", headerSort: false, cssClass: "text-center" },
                { title: "D+L+H+E", field: "comb5", editor: "number", headerSort: false, cssClass: "text-center font-semibold text-blue-600" },
            ];
        },

        createTableCombinacionCargas() {
            const container = document.getElementById("table-combinacion-cargas");
            if (!container) {
                console.error("Contenedor 'table-combinacion-cargas' no encontrado");
                return;
            }

            if (this.tableInstances['combinacion-cargas']) {
                this.tableInstances['combinacion-cargas'].destroy();
                delete this.tableInstances['combinacion-cargas'];
            }

            if (typeof Tabulator === 'undefined') {
                console.error('Tabulator no está definido. Asegúrese de incluir la biblioteca Tabulator.');
                return;
            }

            this.tableInstances['combinacion-cargas'] = new Tabulator(container, {
                data: this.combinacionCargas,
                layout: "fitColumns",
                responsiveLayout: "hide",
                pagination: false,
                columns: this.getBaseColumns(),
                cssClass: "tabulator-modern",
                spreadsheet: true,
                spreadsheetRows: 17,
                spreadsheetColumns: 40,
                editTriggerEvent: "dblclick",
                editorEmptyValue: undefined,
                selectable: true,
                selectableRange: true,
                selectableRangeColumns: true,
                clipboard: true,
                clipboardCopyStyled: false,
                clipboardCopyConfig: { rowHeaders: false, columnHeaders: false },
                clipboardCopyRowRange: "range",
                clipboardPasteParser: "range",
                clipboardPasteAction: "range",
                cellEdited: (cell) => {
                    const rowData = cell.getRow().getData();
                    const field = cell.getField();
                    const value = cell.getValue();
                    const rowIndex = this.combinacionCargas.findIndex(row => row.id === rowData.id);
                    if (rowIndex !== -1) {
                        this.combinacionCargas[rowIndex][field] = this.parseNumericValue(value);
                        //console.log(`Combinación de cargas actualizada: ${field} = ${value} en fila ${rowData.id}`);
                        // Al editar la tabla de combinaciones, recalcular todo el flujo
                        this.recalcularVerificaciones();
                    }
                },
            });
        },

        createTableEstabilidadVolteo() {
            this.crearTablaResultados(
                'table-Estabilidad-Volteo',
                'estabilidad-volteo',
                'momentos',
                'Estabilidad a Volteo'
            );
        },

        createTableEstabilidadDeslizamiento() {
            this.crearTablaResultados(
                'table-Estabilidad-Deslizamiento',
                'estabilidad-deslizamiento',
                'fricciones',
                'Estabilidad a Deslizamiento'
            );
        },

        createTablePresionesAdmisibles() {
            this.crearTablaResultados(
                'table-Presiones-Admisibles',
                'presiones-admisibles',
                'pesos',
                'Presiones Admisibles'
            );
        },

        crearTablaResultados(containerId, tableKey, dataKey, tableName) {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`Contenedor '${containerId}' no encontrado`);
                return;
            }

            if (this.tableInstances[tableKey]) {
                this.tableInstances[tableKey].destroy();
            }

            if (typeof Tabulator === 'undefined') {
                console.error('Tabulator no está definido. Asegúrese de incluir la biblioteca Tabulator.');
                return;
            }

            const tableData = this.generarDatosTabla(dataKey);

            this.tableInstances[tableKey] = new Tabulator(container, {
                data: tableData,
                layout: "fitColumns",
                responsiveLayout: "hide",
                pagination: false,
                columns: [
                    { title: "Componente", field: "description", cssClass: "text-left font-medium" },
                    { title: "COMB1", field: "comb1", cssClass: "text-center" },
                    { title: "COMB2", field: "comb2", cssClass: "text-center" },
                    { title: "COMB3", field: "comb3", cssClass: "text-center" },
                    { title: "COMB4", field: "comb4", cssClass: "text-center" },
                    { title: "COMB5", field: "comb5", cssClass: "text-center font-semibold text-blue-600" },
                ],
                cssClass: "tabulator-modern",
            });

            //console.log(`Tabla ${tableName} creada con datos:`, tableData);
        },

        generarDatosTabla(dataKey) {
            const componentes = this.obtenerComponentes();
            // Mapear la clave de datos a la clave real de cada componente
            // momentos -> Gxxx, fricciones -> Hxxx, pesos -> Cxxx
            let keyPrefix = '';
            if (dataKey === 'momentos') keyPrefix = 'G';
            else if (dataKey === 'fricciones') keyPrefix = 'H';
            else if (dataKey === 'pesos') keyPrefix = 'C';

            // Generar filas normales
            const filas = componentes.map((componente, index) => {
                let compKey = componente.key;
                if (keyPrefix) {
                    compKey = keyPrefix + componente.key.substring(1);
                }
                const baseValue = this.getValue(compKey, 0);
                const row = {
                    id: `comp${index + 1}`,
                    description: componente.description,
                };
                ['comb1', 'comb2', 'comb3', 'comb4', 'comb5'].forEach(combId => {
                    const coeficiente = this.obtenerCoeficienteCombinacion(combId, index);
                    const resultado = baseValue * coeficiente;
                    row[combId] = this.formatearValor(resultado);
                });
                return row;
            });

            // Si es la tabla de momentos (volteo), agregar filas estáticas
            if (dataKey === 'momentos' || dataKey === 'fricciones' || dataKey === 'pesos') {
                // Índices para Mr/Rr (EMPUJE PASIVO a Cof. Cohes)
                const idxRrStart = componentes.findIndex(f => f.description === 'EMPUJE PASIVO');
                const idxRrEnd = componentes.findIndex(f => f.description === 'Cof. Cohes');
                // Índices para Mv/Rv (Empuje sismico a Empuje s/c)
                const idxRvStart = componentes.findIndex(f => f.description === 'Empuje sismico');
                const idxRvEnd = componentes.findIndex(f => f.description === 'Empuje s/c');
                const combs = ['comb1', 'comb2', 'comb3', 'comb4', 'comb5'];

                // Declarar filaMrMv fuera del bloque condicional
                let filaMrMv = {};

                // Para momentos (volteo)
                if (dataKey === 'momentos') {
                    const Mr = {}, Mv = {};
                    combs.forEach(combId => {
                        let sumaMr = 0, sumaMv = 0;
                        for (let i = idxRrStart; i <= idxRrEnd; i++) sumaMr += parseFloat(filas[i][combId].replace(/,/g, '')) || 0;
                        for (let i = idxRvStart; i <= idxRvEnd; i++) sumaMv += parseFloat(filas[i][combId].replace(/,/g, '')) || 0;
                        Mr[combId] = sumaMr;
                        Mv[combId] = sumaMv;
                    });
                    const filaMr = { id: 'filaMr', description: 'Mr=' };
                    const filaMv = { id: 'filaMv', description: 'Mv=' };
                    const filaFSV = { id: 'filaFSV', description: 'FSV=' };
                    filaMrMv = { id: 'filaMrMv', description: 'Mr-Mv=' };
                    combs.forEach(combId => {
                        filaMr[combId] = this.formatearValor(Mr[combId]);
                        filaMv[combId] = this.formatearValor(Mv[combId]);
                        filaFSV[combId] = this.formatearValor(Mv[combId] !== 0 ? Mr[combId] / Mv[combId] : 0);
                        filaMrMv[combId] = this.formatearValor(Mr[combId] - Mv[combId]);
                    });
                    filas.push(filaMr, filaMv, filaFSV, filaMrMv);
                    //console.log('filaMrMv calculado en momentos:', filaMrMv);
                }

                // Para fricciones (deslizamiento)
                if (dataKey === 'fricciones') {
                    const Rr = {}, Rv = {};
                    combs.forEach(combId => {
                        let sumaRr = 0, sumaRv = 0;
                        for (let i = idxRrStart; i <= idxRrEnd; i++) sumaRr += parseFloat(filas[i][combId].replace(/,/g, '')) || 0;
                        for (let i = idxRvStart; i <= idxRvEnd; i++) sumaRv += parseFloat(filas[i][combId].replace(/,/g, '')) || 0;
                        Rr[combId] = sumaRr;
                        Rv[combId] = sumaRv;
                    });
                    const filaRr = { id: 'filaRr', description: 'Rr=' };
                    const filaRv = { id: 'filaRv', description: 'Rv=' };
                    const filaFSD = { id: 'filaFSD', description: 'FSD=' };
                    combs.forEach(combId => {
                        filaRr[combId] = this.formatearValor(Rr[combId]);
                        filaRv[combId] = this.formatearValor(Rv[combId]);
                        filaFSD[combId] = this.formatearValor(Rv[combId] !== 0 ? Rr[combId] / Rv[combId] : 0);
                    });
                    filas.push(filaRr, filaRv, filaFSD);
                }

                // Para presiones admisibles
                if (dataKey === 'pesos') {
                    const Rv = {};
                    combs.forEach(combId => {
                        let sumaRv = 0;
                        for (let i = idxRrStart; i <= idxRrEnd; i++) sumaRv += parseFloat(filas[i][combId].replace(/,/g, '')) || 0;
                        Rv[combId] = sumaRv;
                    });

                    // Obtener Mr-Mv de la tabla volteo - múltiples intentos
                    let MrMvVolteo = {};

                    // Método 1: Desde tableInstances
                    if (this.tableInstances && this.tableInstances['estabilidad-volteo']) {
                        const datosVolteo = this.tableInstances['estabilidad-volteo'].getData();
                        const filaMrMvVolteo = datosVolteo.find(row => row.id === 'filaMrMv');
                        if (filaMrMvVolteo) {
                            MrMvVolteo = { ...filaMrMvVolteo };
                            //console.log('filaMrMv obtenido de volteo (método 1):', MrMvVolteo);
                        }
                    }

                    // Método 2: Regenerar datos de momentos si no se encontraron
                    if (!MrMvVolteo.comb1) {
                        //console.log('Regenerando datos de momentos para obtener Mr-Mv...');
                        const datosMomentos = this.generarDatosTabla('momentos');
                        const filaMrMvMomentos = datosMomentos.find(row => row.id === 'filaMrMv');
                        if (filaMrMvMomentos) {
                            MrMvVolteo = { ...filaMrMvMomentos };
                            //console.log('filaMrMv obtenido regenerando momentos:', MrMvVolteo);
                        }
                    }

                    // Método 3: Calcular directamente si aún no se tiene
                    if (!MrMvVolteo.comb1) {
                        //console.log('Calculando Mr-Mv directamente...');
                        //console.log('Índices - RrStart:', idxRrStart, 'RrEnd:', idxRrEnd, 'RvStart:', idxRvStart, 'RvEnd:', idxRvEnd);

                        // Verificar que los índices sean válidos
                        if (idxRrStart === -1 || idxRrEnd === -1 || idxRvStart === -1 || idxRvEnd === -1) {
                            //console.error('Índices no válidos para el cálculo de Mr-Mv');
                            // Usar valores por defecto o buscar de otra manera
                            MrMvVolteo = { id: 'filaMrMv', description: 'Mr-Mv=' };
                            combs.forEach(combId => {
                                MrMvVolteo[combId] = '0.00';
                            });
                        } else {
                            const Mr = {}, Mv = {};
                            combs.forEach(combId => {
                                let sumaMr = 0, sumaMv = 0;

                                // Calcular Mr (momentos resistentes)
                                for (let i = idxRrStart; i <= idxRrEnd; i++) {
                                    if (filas[i]) {
                                        const valor = parseFloat(filas[i][combId].replace(/,/g, '')) || 0;
                                        sumaMr += valor;
                                        //console.log(`Mr[${combId}] += ${valor} (fila ${i})`);
                                    }
                                }

                                // Calcular Mv (momentos volcantes)
                                for (let i = idxRvStart; i <= idxRvEnd; i++) {
                                    if (filas[i]) {
                                        const valor = parseFloat(filas[i][combId].replace(/,/g, '')) || 0;
                                        sumaMv += valor;
                                        //console.log(`Mv[${combId}] += ${valor} (fila ${i})`);
                                    }
                                }

                                Mr[combId] = sumaMr;
                                Mv[combId] = sumaMv;
                                //console.log(`${combId}: Mr=${sumaMr}, Mv=${sumaMv}, Mr-Mv=${sumaMr - sumaMv}`);
                            });

                            MrMvVolteo = { id: 'filaMrMv', description: 'Mr-Mv=' };
                            combs.forEach(combId => {
                                MrMvVolteo[combId] = this.formatearValor(Mr[combId] - Mv[combId]);
                            });
                            //console.log('filaMrMv calculado directamente:', MrMvVolteo);
                        }
                    }

                    // B y e
                    const gv = this.getValue('graficoverificacion');
                    const B = gv?.B90 ?? 0;

                    // Crear filas para presiones admisibles
                    const filaRv = { id: 'filaRv', description: 'Rv=' };
                    const filaE = { id: 'filaE', description: 'e=' };
                    const filaB = { id: 'filaB', description: 'B=' };
                    const filaL3 = { id: 'filaL3', description: 'L/3=' };
                    const fila2L3 = { id: 'fila2L3', description: '2L/3=' };
                    const filaS1 = { id: 'filaS1', description: 's1=' };
                    const filaS2 = { id: 'filaS2', description: 's2=' };

                    combs.forEach(combId => {
                        const rv = Rv[combId];
                        // Usar los valores de MrMvVolteo para calcular e
                        const mrmv = MrMvVolteo[combId] ? parseFloat(MrMvVolteo[combId].replace(/,/g, '')) : 0;
                        //console.log(`Combinación ${combId}: rv=${rv}, mrmv=${mrmv}`);

                        const e = rv !== 0 ? mrmv / rv : 0;
                        filaRv[combId] = this.formatearValor(rv);
                        filaE[combId] = this.formatearValor(e);
                        filaB[combId] = this.formatearValor(B);
                        filaL3[combId] = this.formatearValor(B / 3);
                        fila2L3[combId] = this.formatearValor(2 * B / 3);

                        // s1 = (4*B-6*e)*Rv/(B*B)
                        const s1 = B !== 0 ? ((4 * B - 6 * e) * rv) / (B * B) : 0;
                        // s2 = (-2*B+6*e)*Rv/(B*B)
                        const s2 = B !== 0 ? ((-2 * B + 6 * e) * rv) / (B * B) : 0;
                        filaS1[combId] = this.formatearValor(s1);
                        filaS2[combId] = this.formatearValor(s2);
                    });

                    filas.push(filaRv, filaE, filaB, filaL3, fila2L3, filaS1, filaS2);
                }
            }
            return filas;
        },

        obtenerComponentes() {
            return [
                { key: 'G171', description: 'Empuje sismico' },
                { key: 'G172', description: 'Empuje ACTIVO' },
                { key: 'G173', description: 'Emp ACTI COH' },
                { key: 'G174', description: 'Empuje s/c' },
                { key: 'G175', description: 'EMPUJE PASIVO' },
                { key: 'G176', description: 'Emp PASI COH' },
                { key: 'G177', description: 'CARGA PUNTUA' },
                { key: 'G178', description: 'S/C' },
                { key: 'G179', description: 'SUELO TALUD' },
                { key: 'G180', description: 'SUELO' },
                { key: 'G181', description: 'BASE' },
                { key: 'G182', description: 'CUÑA' },
                { key: 'G183', description: 'PANTALLA' },
                { key: 'G184', description: 'DIENTE' },
                { key: 'G185', description: 'Cof. Cohes' },
            ];
        },

        obtenerCoeficienteCombinacion(combId, rowIndex) {
            if (rowIndex >= this.combinacionCargas.length) {
                return 0;
            }

            const combinacion = this.combinacionCargas[rowIndex];
            return parseFloat(combinacion[combId]) || 0;
        },

        actualizarTablasResultados() {
            if (!this.datosVerificaciones.momentos) {
                //console.log('No hay datos de verificación disponibles');
                return;
            }

            //console.log('Actualizando tablas de resultados...');

            if (this.tableInstances['estabilidad-volteo']) {
                const datosVolteo = this.generarDatosTabla('momentos');
                this.tableInstances['estabilidad-volteo'].setData(datosVolteo);
            }

            if (this.tableInstances['estabilidad-deslizamiento']) {
                // Usar 'fricciones' para la tabla de deslizamiento y multiplicar por coeficientes
                const datosDeslizamiento = this.generarDatosTabla('fricciones');
                //console.log('Datos de deslizamiento:', datosDeslizamiento);
                this.tableInstances['estabilidad-deslizamiento'].setData(datosDeslizamiento);
            }

            if (this.tableInstances['presiones-admisibles']) {
                const datosPresiones = this.generarDatosTabla('pesos');
                this.tableInstances['presiones-admisibles'].setData(datosPresiones);
            }
        },

        updateAllTables() {
            this.actualizarTablasResultados();
        },

        recalcularVerificaciones() {
            if (this.isCalculating) return;

            try {
                this.isCalculating = true;
                this.clearErrors();

                //console.log('Recalculando verificaciones...');

                if (!this.datosDimensionamiento.resultados || !this.datosCargas.resultados) {
                    //console.log('Esperando datos completos...');
                    return;
                }

                // Primero calcular componentes, luego extraer datos de verificación
                this.calcularComponentes();
                this.extraerDatosVerificacion();
                this.actualizarTablasResultados();
                this.enviarDatosVerificaciones();

            } catch (error) {
                console.error('Error en recálculo de verificaciones:', error);
                this.addError('calculo', 'Error en recálculo: ' + error.message);
            } finally {
                this.isCalculating = false;
            }
        },

        extraerDatosVerificacion() {
            //console.log('Extrayendo datos de verificación...');

            this.datosVerificaciones = {
                fx: {
                    D171: this.getValue('D171', 0),
                    D172: this.getValue('D172', 0),
                    D173: this.getValue('D173', 0),
                    D174: this.getValue('D174', 0),
                    D175: this.getValue('D175', 0),
                    D176: this.getValue('D176', 0),
                    D177: this.getValue('D177', 0),
                    D178: this.getValue('D178', 0),
                    D179: this.getValue('D179', 0),
                    D180: this.getValue('D180', 0),
                    D181: this.getValue('D181', 0),
                    D182: this.getValue('D182', 0),
                    D183: this.getValue('D183', 0),
                    D184: this.getValue('D184', 0),
                    D185: this.getValue('D185', 0),
                },
                momentos: {
                    G171: this.getValue('G171', 0),
                    G172: this.getValue('G172', 0),
                    G173: this.getValue('G173', 0),
                    G174: this.getValue('G174', 0),
                    G175: this.getValue('G175', 0),
                    G176: this.getValue('G176', 0),
                    G177: this.getValue('G177', 0),
                    G178: this.getValue('G178', 0),
                    G179: this.getValue('G179', 0),
                    G180: this.getValue('G180', 0),
                    G181: this.getValue('G181', 0),
                    G182: this.getValue('G182', 0),
                    G183: this.getValue('G183', 0),
                    G184: this.getValue('G184', 0),
                    G185: this.getValue('G185', 0),
                },
                fricciones: {
                    H171: this.getValue('H171', 0),
                    H172: this.getValue('H172', 0),
                    H173: this.getValue('H173', 0),
                    H174: this.getValue('H174', 0),
                    H175: this.getValue('H175', 0),
                    H176: this.getValue('H176', 0),
                    H177: this.getValue('H177', 0),
                    H178: this.getValue('H178', 0),
                    H179: this.getValue('H179', 0),
                    H180: this.getValue('H180', 0),
                    H181: this.getValue('H181', 0),
                    H182: this.getValue('H182', 0),
                    H183: this.getValue('H183', 0),
                    H184: this.getValue('H184', 0),
                    H185: this.getValue('H185', 0),
                },
                pesos: {
                    C171: this.getValue('C171', 0),
                    C172: this.getValue('C172', 0),
                    C173: this.getValue('C173', 0),
                    C174: this.getValue('C174', 0),
                    C175: this.getValue('C175', 0),
                    C176: this.getValue('C176', 0),
                    C177: this.getValue('C177', 0),
                    C178: this.getValue('C178', 0),
                    C179: this.getValue('C179', 0),
                    C180: this.getValue('C180', 0),
                    C181: this.getValue('C181', 0),
                    C182: this.getValue('C182', 0),
                    C183: this.getValue('C183', 0),
                    C184: this.getValue('C184', 0),
                    C185: this.getValue('C185', 0),
                }
            };

            //console.log('Datos de verificación extraídos:', this.datosVerificaciones);
        },

        enviarDatosVerificaciones() {
            const data = {
                inputValues: {
                    combinacionCargas: this.combinacionCargas
                },
                datosDimensionamiento: this.datosDimensionamiento,
                datosCargas: this.datosCargas,
                datosVerificaciones: this.datosVerificaciones,
                datosCalculados: this.datosCalculados,
                resultados: this.resultados,
                errors: this.errors
            };

            //console.log('Enviando datos de verificaciones:', data);
            document.dispatchEvent(new CustomEvent('verificaciones-updated', { detail: data }));
        },

        addError(id, message) {
            if (!this.errors.find(e => e.id === id)) {
                this.errors.push({ id, message });
                console.error(`Error añadido: ${id} - ${message}`);
            }
        },

        clearErrors() {
            this.errors = [];
        },

        formatearValor(valor) {
            if (valor === null || valor === undefined || valor === '') {
                return '0.00';
            }
            if (typeof valor === 'number') {
                return isNaN(valor) ? '0.00' : valor.toFixed(2);
            }
            return valor.toString();
        },

        formatValue(value) {
            if (value === null || value === undefined || value === '') return '-';
            if (typeof value === 'number') {
                return isNaN(value) ? '-' : value.toFixed(2);
            }
            return value;
        },

        get hasErrors() {
            return this.errors.length > 0;
        },
    }));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVerificacionesModule);
} else {
    initVerificacionesModule();
}