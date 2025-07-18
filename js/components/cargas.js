function initCargasModule() {
    const cargas = document.getElementById('cargas-content');
    if (!cargas) {
        console.error('Contenedor cargas no encontrado');
        return;
    }

    cargas.innerHTML = `
        <div x-data="cargasModule()" class="cuaderno p-4 max-w-full mx-auto font-mono">

            <!-- ERRORES -->
            <div x-show="hasErrors" class="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                <h4 class="font-semibold text-red-800 mb-2">Errores encontrados:</h4>
                <ul class="text-sm text-red-700">
                    <template x-for="error in errors" :key="error.id">
                        <li x-text="error.message"></li>
                    </template>
                </ul>
            </div>
            <div class="p-4 bg-slate-50 bg-transparent rounded shadow-sm">
                <div class="flex items-center justify-between cursor-pointer mb-3" @click="showCargasEmpuje = !showCargasEmpuje">
                    <h3 class="text-lg font-semibold text-blue-800 flex items-center">
                        📐 CARGAS DE EMPUJE
                    </h3>
                    <span class="text-xs text-gray-950" x-text="showCargasEmpuje ? 'Ocultar' : 'Mostrar'"></span>
                </div>
                <!-- LAYOUT PRINCIPAL -->
                <div x-show="showCargasEmpuje" class="grid grid-cols-1 lg:grid-cols-2 gap-6">              
                    <!-- RESULTADOS DE CÁLCULO -->
                    <section class="space-y-4">
                        <!-- PARÁMETROS BASE -->
                        <div class="p-4 bg-slate-50 bg-transparent border border-slate-300 rounded shadow-sm">
                            <div class="flex items-center justify-between cursor-pointer mb-3" @click="showParametros = !showParametros">
                                <h3 class="text-lg font-semibold text-blue-800 flex items-center">
                                    <i class='fas fa-calculator mr-2 text-blue-500'></i>
                                    Parámetros Base
                                </h3>
                                <span class="text-xs text-gray-500" x-text="showParametros ? 'Ocultar' : 'Mostrar'"></span>
                            </div>
                            <div x-show="showParametros" class="space-y-2">
                                <div class="grid grid-cols-4 gap-2 text-sm font-medium text-gray-600 border-b pb-2">
                                    <span>Parámetro</span>
                                    <span>Símbolo</span>
                                    <span>Valor</span>
                                    <span>Unidad</span>
                                </div>
                                <template x-for="param in parametrosBase" :key="param.key">
                                    <div class="grid grid-cols-4 gap-2 text-sm py-1 hover:bg-gray-50">
                                        <span class="text-gray-700" x-text="param.label"></span>
                                        <span class="text-gray-500 font-mono" x-text="param.symbol"></span>
                                        <span class="font-medium" x-text="getParameterValue(param.key)"></span>
                                        <span class="text-gray-500" x-text="param.unit"></span>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <!-- EMPUJE PASIVO DEL SUELO -->
                        <div class="p-4 bg-green-50 bg-transparent border border-green-300 rounded shadow-sm">
                            <div class="flex items-center justify-between cursor-pointer mb-3" @click="showEmpujePasivo = !showEmpujePasivo">
                                <h3 class="text-lg font-semibold text-green-800 flex items-center">
                                    <i class='fas fa-arrow-left mr-2 text-green-500'></i>
                                    Empuje Pasivo del Suelo
                                </h3>
                                <span class="text-xs text-gray-500" x-text="showEmpujePasivo ? 'Ocultar' : 'Mostrar'"></span>
                            </div>
                            <div x-show="showEmpujePasivo" class="space-y-2">
                                <div class="grid grid-cols-4 gap-2 text-sm font-medium text-gray-600 border-b pb-2">
                                    <span>Parámetro</span>
                                    <span>Símbolo</span>
                                    <span>Valor</span>
                                    <span>Unidad</span>
                                </div>
                                <template x-for="param in empujePasivoParams" :key="param.key">
                                    <div class="grid grid-cols-4 gap-2 text-sm py-1 hover:bg-green-50">
                                        <span class="text-gray-700" x-text="param.label"></span>
                                        <span class="text-gray-500 font-mono" x-text="param.symbol"></span>
                                        <span class="font-medium" x-text="getParameterValue(param.key, param.unit)"></span>
                                        <span class="text-gray-500" x-text="param.unit"></span>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <!-- EMPUJE ACTIVO DEL SUELO -->
                        <div class="p-4 bg-orange-50 bg-transparent border border-orange-300 rounded shadow-sm">
                            <div class="flex items-center justify-between cursor-pointer mb-3" @click="showEmpujeActivo = !showEmpujeActivo">
                                <h3 class="text-lg font-semibold text-orange-800 flex items-center">
                                    <i class='fas fa-arrow-right mr-2 text-orange-500'></i>
                                    Empuje Activo del Suelo
                                </h3>
                                <span class="text-xs text-gray-500" x-text="showEmpujeActivo ? 'Ocultar' : 'Mostrar'"></span>
                            </div>
                            <div x-show="showEmpujeActivo" class="space-y-2">
                                <div class="grid grid-cols-4 gap-2 text-sm font-medium text-gray-600 border-b pb-2">
                                    <span>Parámetro</span>
                                    <span>Símbolo</span>
                                    <span>Valor</span>
                                    <span>Unidad</span>
                                </div>
                                <template x-for="param in empujeActivoParams" :key="param.key">
                                    <div class="grid grid-cols-4 gap-2 text-sm py-1 hover:bg-orange-50">
                                        <span class="text-gray-700" x-text="param.label"></span>
                                        <span class="text-gray-500 font-mono" x-text="param.symbol"></span>
                                        <span class="font-medium" x-text="getParameterValue(param.key, param.unit)"></span>
                                        <span class="text-gray-500" x-text="param.unit"></span>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <!-- EMPUJE DE SOBRECARGA -->
                        <div class="p-4 bg-purple-50 bg-transparent border border-purple-300 rounded shadow-sm">
                            <div class="flex items-center justify-between cursor-pointer mb-3" @click="showEmpujeSobrecarga = !showEmpujeSobrecarga">
                                <h3 class="text-lg font-semibold text-purple-800 flex items-center">
                                    <i class='fas fa-weight-hanging mr-2 text-purple-500'></i>
                                    Empuje de Sobrecarga
                                </h3>
                                <span class="text-xs text-gray-500" x-text="showEmpujeSobrecarga ? 'Ocultar' : 'Mostrar'"></span>
                            </div>
                            <div x-show="showEmpujeSobrecarga" class="space-y-2">
                                <div class="grid grid-cols-4 gap-2 text-sm font-medium text-gray-600 border-b pb-2">
                                    <span>Parámetro</span>
                                    <span>Símbolo</span>
                                    <span>Valor</span>
                                    <span>Unidad</span>
                                </div>
                                <template x-for="param in empujeSobrecargaParams" :key="param.key">
                                    <div class="grid grid-cols-4 gap-2 text-sm py-1 hover:bg-purple-50">
                                        <span class="text-gray-700" x-text="param.label"></span>
                                        <span class="text-gray-500 font-mono" x-text="param.symbol"></span>
                                        <span class="font-medium" x-text="getParameterValue(param.key, param.unit)"></span>
                                        <span class="text-gray-500" x-text="param.unit"></span>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </section>

                    <!-- VISUALIZACIÓN GRÁFICA -->
                    <section class="p-6 bg-slate-50 bg-transparent border border-slate-300 rounded shadow-sm">
                        <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                            <i class='fas fa-chart-bar mr-2 text-blue-400'></i>
                            Diagrama de Empujes
                        </h3>
                        <div class="bg-white p-4 rounded border min-h-96 flex items-center justify-center">
                           <div class="image-container"
                        style="position: relative; width: 100%; max-width: 800px; margin: 0 auto;">
                        
                        <style>
                            .measurement-input {
                                padding: 4px 8px;
                                font-size: 12px;
                                width: 80px;
                                border-radius: 4px;
                                transition: all 0.3s ease;
                                color: rgba(27, 27, 27, 0.8);
                            }
                            .measurement-input-result {
                                padding: 4px 8px;
                                font-size: 12px;
                                width: 80px;
                                border-radius: 4px;
                                transition: all 0.3s ease;
                                color: rgba(27, 27, 27, 0.8);
                            }

                            .measurement-input:focus {
                                background: rgba(27, 27, 27, 0.8);
                                box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
                                transform: scale(1.05);
                            }

                            .image-container {
                                margin-bottom: 20px;
                            }

                            /* Modo oscuro */
                            .dark .measurement-input {
                                background: rgba(55, 65, 81, 0.8);
                                border-color: #4B5563;
                                color: white;
                            }

                            .dark .measurement-input:focus {
                                background: rgb(55, 65, 81);
                            }
                        </style>
                        <img class="w-full h-600" src="js/assets/cargas.png"
                            alt="Imagen" />

                        <!-- Inputs posicionados absolutamente sobre la imagen -->
                        <input type="number" :value="getValue('B110')" disabled step="0.001" class="measurement-input-result"
                            style="width: 60px; position: absolute; top: 65%; left: 2%;">

                        <input type="number" :value="getValue('B138')" disabled step="0.001" class="measurement-input-result"
                            style="width:60px; position: absolute; top: 50%; left: 40%;">
                            
                        <input type="number" :value="getValue('B125')" disabled step="0.001" class="measurement-input-result"
                            style="width:60px; position: absolute; top: 52%; left: 51%;">

                        <input type="number" :value="getValue('C163')" disabled step="0.001" class="measurement-input-result"
                            style="width:60px; position: absolute; top: 52%; left: 78%;">
                    </div>
                        </div>
                    </section>
                </div>
            </div>

            <div class="p-4 bg-slate-50 bg-transparent rounded shadow-sm">
                <div class="flex items-center justify-between cursor-pointer mb-3" @click="showCargaSismico = !showCargaSismico">
                    <h3 class="text-lg font-semibold text-blue-800 flex items-center">
                        📐 CARGAS SISMICOS
                    </h3>
                    <span class="text-xs text-gray-950" x-text="showCargaSismico ? 'Ocultar' : 'Mostrar'"></span>
                </div>
                <!-- LAYOUT PRINCIPAL -->
                <div x-show="showCargaSismico" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <section class="space-y-4">
                        <!-- PARÁMETROS BASE -->
                        <div class="grid grid-cols-4 gap-2 text-sm font-medium text-gray-600 border-b pb-2">
                            <span>Parámetro</span>
                            <span>Símbolo</span>
                            <span>Valor</span>
                            <span>Unidad</span>
                        </div>
                        <template x-for="param in cargaSismicos" :key="param.key">
                            <div class="grid grid-cols-4 gap-2 text-sm py-1 hover:bg-gray-50">
                                <span class="text-gray-700" x-text="param.label"></span>
                                <span class="text-gray-500 font-mono" x-text="param.symbol"></span>
                                <span class="font-medium" x-text="getParameterValue(param.key)"></span>
                                <span class="text-gray-500" x-text="param.unit"></span>
                            </div>
                        </template>
                    </section>
                    <section class="space-y-4">
                        <table class="w-full text-sm border-collapse border border-gray-300">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="border border-gray-300 p-2 text-left">Símbolo</th>
                                    <th class="border border-gray-300 p-2 text-right">°</th>
                                    <th class="border border-gray-300 p-2 text-right">RAD</th>
                                    <th class="border border-gray-300 p-2 text-left">Descripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template x-for="item in cargasisicatable" :key="item.label">
                                    <tr class="hover:bg-gray-50">
                                        <td class="border p-2 font-mono text-center" x-text="item.label"></td>
                                        <td class="border p-2 text-right" x-text="formatValue(getValue(item.gradosKey))"></td>
                                        <td class="border p-2 text-right" x-text="formatValue(getValue(item.radianesKey))"></td>
                                        <td class="border p-2 text-gray-700 italic" x-text="item.description || '-'"></td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </section>
                </div>
            </div>
        </div>
    `;

    Alpine.data('cargasModule', () => ({
        // Estado de visualización
        showCargasEmpuje: true,
        showCargaSismico: true,
        showParametros: true,
        showEmpujePasivo: false,
        showEmpujeActivo: false,
        showEmpujeSobrecarga: false,
        showTablaDetallada: false,

        // Datos recibidos de otros módulos
        // Ahora 'dimensionamientoData' almacenará los datos completos del módulo dimensionamiento
        predimData: null,          // Datos de predimensionamiento (todavía relevantes si los usa cargas)
        dimensionamientoData: null, // NUEVO: Para almacenar los datos de dimensionamiento
        resultados: {},            // Resultados propios del módulo de cargas
        errors: [],

        // Control de cambios
        lastInputHash: '',

        // Configuración de parámetros a mostrar (se mantiene igual)
        parametrosBase: [
            { key: 'B98', label: 'Altura de sobrecarga', symbol: 'hs', unit: 'm' },
            { key: 'B99', label: 'Coeficiente activo', symbol: 'ka', unit: '-' },
            { key: 'B100', label: 'Coeficiente pasivo', symbol: 'kp', unit: '-' },
            { key: 'B101', label: 'Coeficiente reposo', symbol: 'ko', unit: '-' },
        ],

        empujePasivoParams: [
            { key: 'B103', label: 'Empuje cohesivo superior', symbol: 'h', unit: '' },
            { key: 'B104', label: 'Presion cota cero', symbol: 'Smin', unit: '' },
            { key: 'B105', label: 'Presion maxima en la pantalla del muro', symbol: 'Samx_pantalla', unit: '' },
            { key: 'B106', label: '', symbol: 'Samx_cimen', unit: '' },
            { key: 'B107', label: 'Presion cota final del muro', symbol: 'Smax', unit: '' },
            { key: 'B108', label: 'Empuje del terreno', symbol: 'P', unit: '' },
            { key: 'B109', label: 'Empuje vertical del terreno', symbol: 'Pv', unit: '' },
            { key: 'B110', label: 'Empuje horizaontal del terreno', symbol: 'Ph', unit: '' },
            { key: 'B112', label: '', symbol: 'Smax', unit: '' },
            { key: 'B113', label: '', symbol: 'P', unit: '' },
            { key: 'B114', label: '', symbol: 'Pv', unit: '' },
            { key: 'B115', label: '', symbol: 'Ph', unit: '' },
        ],

        empujeActivoParams: [
            { key: 'B119', label: '', symbol: 'H', unit: '' },
            { key: 'B120', label: 'presion cota cero', symbol: 'Smin', unit: '' },
            { key: 'B121', label: 'presion cota final del muro', symbol: 'Smax', unit: '' },
            { key: 'B122', label: 'presion maxima en la pantalla del muro', symbol: 'Smax_pantalla', unit: '' },
            { key: 'B123', label: 'Empuje del terreno', symbol: 'P', unit: '' },
            { key: 'B124', label: 'empuje vertical del terreno', symbol: 'Pv', unit: '' },
            { key: 'B125', label: 'empuje horizaontal del terreno', symbol: 'Ph', unit: '' },
            { key: 'B127', label: '', symbol: 'Smax', unit: '' },
            { key: 'B128', label: '', symbol: 'P', unit: '' },
            { key: 'B129', label: '', symbol: 'Pv', unit: '' },
            { key: 'B130', label: '', symbol: 'Ph', unit: '' },
        ],

        empujeSobrecargaParams: [
            { key: 'B133', label: 'presion cota cero', symbol: 'Smin', unit: '' },
            { key: 'B134', label: 'presion cota final del muro', symbol: 'Smax', unit: '' },
            { key: 'B135', label: 'presion maxima en la pantalla del muro', symbol: 'Smax_pantalla', unit: '' },
            { key: 'B136', label: 'Empuje del terreno', symbol: 'P', unit: '' },
            { key: 'B137', label: 'empuje vertical del terreno', symbol: 'Pv', unit: '' },
            { key: 'B138', label: 'empuje horizaontal del terreno', symbol: 'Ph', unit: '' }
        ],

        cargaSismicos: [
            { key: 'C144', label: '', symbol: 'Kh', unit: '' },
            { key: 'C145', label: '', symbol: 'Kh', unit: '' },
            { key: 'C153', label: '', symbol: 'Kae', unit: '' },
            { key: 'B154', label: '', symbol: 'gs', unit: '' },
            { key: 'B155', label: '', symbol: 'H', unit: '' },
            { key: 'B156', label: '', symbol: 'Kv', unit: '' },
            { key: 'C157', label: '', symbol: 'Eae', unit: 'Tn' },
            { key: 'B158', label: '', symbol: 'Kah', unit: '' },
            { key: 'C159', label: '', symbol: 'Ea', unit: 'Tn' },
            { key: 'C160', label: '', symbol: 'DEae', unit: 'Tn' },
            { key: 'C162', label: '', symbol: 'Brazo', unit: 'm' },
            { key: 'C163', label: '', symbol: 'Mae', unit: 'Tn-m' },
        ],

        get cargasisicatable() {
            return [
                { label: 'Θ=', gradosKey: 'B147', radianesKey: 'C147', description: '' },
                { label: 'Ø=', gradosKey: 'B148', radianesKey: 'C148', description: 'SUELO' },
                { label: 'BETA', gradosKey: 'B149', radianesKey: 'C149', description: 'ANGULO VASTAGO' },
                { label: 'd=', gradosKey: 'B150', radianesKey: 'C150', description: 'ANGULO DE FRICCION' },
                { label: 'I=', gradosKey: 'B151', radianesKey: 'C151', description: 'ANGULO DEL TALUD' },
                { label: 'y=', gradosKey: 'B152', radianesKey: '', description: '' }
            ];
        },

        // Refactorizado para ser más conciso y claro en el orden de búsqueda
        getValue(key) {
            // 1. Buscar en resultados propios del módulo de cargas
            if (this.resultados[key] !== undefined) {
                return this.resultados[key];
            }
            // 2. Buscar en resultados del módulo de dimensionamiento
            if (this.dimensionamientoData?.resultados?.[key] !== undefined) {
                return this.dimensionamientoData.resultados[key];
            }
            // 3. Buscar en resultados del módulo de predimensionamiento
            if (this.predimData?.resultados?.[key] !== undefined) {
                return this.predimData.resultados[key];
            }
            return null;
        },

        init() {
            this.loadSavedData();
            this.configurarEventos();
            this.inicializarValoresDefecto();
        },

        loadSavedData() {
            const systemData = this.getSystemData();
            console.log(systemData);
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
                    this.calcularResultados();
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
            // Escucha el evento 'dimensionamiento-updated' para reaccionar a cambios
            document.addEventListener('dimensionamiento-updated', (event) => {
                console.log('✅ Evento "dimensionamiento-updated" recibido en cargasModule.', event.detail);
                this.procesarDatosDimensionamiento(event.detail);
            });

            // Escucha sus propios cambios para reactividad interna o para persistencia/debug
            document.addEventListener('cargas-updated', (event) => {
                if (event.detail && event.detail.resultados) {
                    // Actualiza los resultados internos si 'cargas' se actualiza a sí mismo (ej. desde un input)
                    this.resultados = { ...event.detail.resultados };
                    // Opcional: si 'cargas' también tiene inputs, actualizaría 'inputValues' aquí
                }
            });
        },

        procesarDatosDimensionamiento(eventData) {
            console.log('⚙️ Procesando datos de dimensionamiento en cargasModule...');
            try {
                // Asegúrate de que eventData.detail contenga la estructura esperada del módulo 'dimensionamiento'
                if (!eventData || !eventData.resultados || !eventData.inputValues) {
                    console.warn('Datos de dimensionamiento incompletos o inválidos recibidos.', eventData);
                    this.addError('datos_dimensionamiento_invalidos', 'Datos de dimensionamiento incompletos.');
                    this.dimensionamientoData = null; // Limpiar datos si son inválidos
                    return;
                }

                // Almacenar los datos completos del módulo de dimensionamiento
                this.dimensionamientoData = {
                    inputValues: eventData.inputValues || {},
                    resultados: eventData.resultados || {},
                    isCalculated: eventData.isCalculated || false,
                    errors: Array.isArray(eventData.errors) ? eventData.errors : []
                };

                // Aquí puedes también actualizar predimData si el evento de dimensionamiento lo trae
                // y si cargas aún lo necesita separadamente.
                if (eventData.predimData) {
                    this.predimData = {
                        inputValues: eventData.predimData.inputValues || {},
                        resultados: eventData.predimData.resultados || {},
                        errors: Array.isArray(eventData.predimData.errors) ? eventData.predimData.errors : []
                    };
                }

                console.log('✅ Datos de dimensionamiento actualizados en cargasModule.');
                // Recalcular los resultados de cargas cuando se actualiza dimensionamiento
                this.calcularResultados();
            } catch (error) {
                console.error('Error al procesar datos de dimensionamiento en cargasModule:', error);
                this.addError('procesamiento_datos_dimensionamiento', 'Error procesando datos de dimensionamiento: ' + error.message);
            }
        },

        inicializarValoresDefecto() {
            // Valores por defecto para testing o inicialización si no hay datos guardados
            // Solo para resultados propios de Cargas, no para datos recibidos
            this.resultados = {
                // Empuje activo
                empuje_activo_terreno: 87.5,
                empuje_activo_vertical: 15.2,
                empuje_activo_horizontal: 85.1,
                presion_activa_min: 12.5,
                presion_activa_max: 45.8,
                brazo_empuje_activo: 1.67,

                // Empuje sobrecarga
                empuje_sobrecarga_terreno: 32.1,
                empuje_sobrecarga_vertical: 5.8,
                empuje_sobrecarga_horizontal: 31.6,
                presion_sobrecarga_min: 8.2,
                presion_sobrecarga_max: 8.2,
                brazo_empuje_sobrecarga: 2.0,

                // Totales (estos se recalcularán en calcularEmpujes)
                empuje_pasivo_total: 749.5,
                empuje_activo_total: 87.5,
                empuje_sobrecarga_total: 32.1,
                empuje_resultante: 629.9
            };
        },

        calcularResultados() {
            console.log('⚙️ Iniciando cálculo de resultados en cargasModule...');
            this.clearErrors();

            // 1. Validar que tenemos datos de dimensionamiento (que a su vez contiene predimensionamiento)
            if (!this.dimensionamientoData || !this.dimensionamientoData.isCalculated) {
                this.addError('dimensionamiento_no_calculado', 'El módulo de dimensionamiento no ha sido calculado o sus datos no son válidos.');
                console.warn('❌ Cálculo de cargas abortado: dimensionamiento no disponible o no calculado.');
                return;
            }

            // 2. Obtener el valor B98 (ahora con tu mejorado `getValue`)
            const b98 = this.getValue('B98'); // Esto buscará en resultados de cargas, luego dimensionamiento, luego predim

            if (b98 === null || typeof b98 !== 'number' || isNaN(b98) || b98 <= 0) {
                this.addError('b98_invalido', 'El valor B98 (altura de sobrecarga) es inválido o no se encontró. Es un dato crítico.');
                console.error('❌ Cálculo de cargas abortado: B98 inválido.');
                return;
            }

            console.log(`✅ B98 (${b98}) obtenido correctamente para el cálculo de cargas.`);

            // 3. Realizar los cálculos específicos de empujes
            this.calcularEmpujes();

            // 4. Propagar los resultados de cargas para que otros módulos los puedan consumir
            this.sendDataCargas();

            if (!this.hasErrors) {
                console.log('✅ Cálculos de cargas completados sin errores.');
            } else {
                console.warn('⚠️ Cálculos de cargas completados con errores.');
            }
        },

        calcularEmpujes() {
            try {
                const b98 = parseFloat(this.getValue('B98')); // Usamos getValue
                const ka = parseFloat(this.getValue('B99')); // Ejemplo: Coeficiente activo
                const kp = parseFloat(this.getValue('B100')); // Ejemplo: Coeficiente pasivo
                const gammaSuelo = parseFloat(this.getValue('gs')); // Ejemplo: Peso específico del suelo (asumiendo que 'gs' viene de predim o dim)
                const H = parseFloat(this.getValue('H')); // Ejemplo: Altura del muro (asumiendo que 'H' viene de predim o dim)

                // Validaciones para los nuevos parámetros usados en el cálculo
                if (isNaN(b98) || b98 <= 0) { this.addError('calc_b98_invalido', 'B98 no válido para empujes.'); return; }
                if (isNaN(ka) || ka <= 0) { this.addError('calc_ka_invalido', 'Coeficiente activo (B99) no válido.'); return; }
                if (isNaN(kp) || kp <= 0) { this.addError('calc_kp_invalido', 'Coeficiente pasivo (B100) no válido.'); return; }
                if (isNaN(gammaSuelo) || gammaSuelo <= 0) { this.addError('calc_gamma_invalido', 'Peso específico del suelo (gs) no válido.'); return; }
                if (isNaN(H) || H <= 0) { this.addError('calc_H_invalido', 'Altura del muro (H) no válida.'); return; }


                // ***************************************************************
                // ** Reemplaza estos cálculos con tus fórmulas ingenieriles reales **
                // ***************************************************************

                // Empuje de sobrecarga: q_s = b98 * gamma_suelo
                const q_s = b98 * gammaSuelo; // Presión de sobrecarga equivalente

                // Presiones activas y empujes
                // Asumiendo que 'H' es la altura total del muro desde dimensionamiento
                this.resultados.presion_activa_min = ka * q_s; // Presión en la superficie
                this.resultados.presion_activa_max = ka * (gammaSuelo * H + q_s); // Presión en la base

                this.resultados.empuje_activo_terreno = 0.5 * ka * gammaSuelo * H * H; // Triángulo de presión
                this.resultados.empuje_sobrecarga_terreno = ka * q_s * H; // Rectángulo de presión por sobrecarga

                this.resultados.empuje_activo_horizontal = this.resultados.empuje_activo_terreno; // Simplificado
                this.resultados.empuje_sobrecarga_horizontal = this.resultados.empuje_sobrecarga_terreno; // Simplificado

                // Brazo de palanca (desde la base)
                this.resultados.brazo_empuje_activo = H / 3;
                this.resultados.brazo_empuje_sobrecarga = H / 2;

                // Totales (asumiendo que solo estos dos contribuyen al empuje activo total)
                this.resultados.empuje_activo_total = this.resultados.empuje_activo_terreno + this.resultados.empuje_sobrecarga_terreno;
                this.resultados.empuje_sobrecarga_total = this.resultados.empuje_sobrecarga_terreno; // Mantener para claridad si es un sub-total

                // Empuje Pasivo (asumiendo que proviene de cálculos en otro lado, o lo calculas aquí)
                // Para fines de este ejemplo, asumiremos que empuje_pasivo_total se trae o se calcula aquí.
                // Si kp es el coeficiente pasivo para calcularlo aquí:
                // this.resultados.empuje_pasivo_total = 0.5 * kp * gammaSuelo * H * H;
                // Si el valor viene de dimensionamiento, usa:
                // const empujePasivoDeDimensionamiento = this.getValue('empuje_pasivo_calculado_en_dimensionamiento');
                // if (empujePasivoDeDimensionamiento !== null) {
                //     this.resultados.empuje_pasivo_total = empujePasivoDeDimensionamiento;
                // } else {
                //     this.addError('empuje_pasivo_faltante', 'Empuje pasivo total no disponible.');
                // }


                // Ejemplo de valores para los que no hay una fórmula directa en este snippet:
                this.resultados.empuje_activo_vertical = this.resultados.empuje_activo_total * Math.sin(0); // Si hay ángulo de fricción en la pared
                this.resultados.empuje_sobrecarga_vertical = this.resultados.empuje_sobrecarga_total * Math.sin(0);

                // Recalcular empuje resultante
                // Si 'empuje_pasivo_total' es un valor fijo de inicializarValoresDefecto o viene de otro módulo:
                const empujePasivo = this.getValue('empuje_pasivo_total') || 0; // Usar el valor existente o 0
                this.resultados.empuje_resultante = empujePasivo - this.resultados.empuje_activo_total;

                console.log('✅ Empujes calculados y resultados actualizados.');

            } catch (error) {
                console.error('Error en cálculo de empujes:', error);
                this.addError('calculo_empujes_fallido', 'Error calculando empujes: ' + error.message);
            }
        },

        // Configuración de todos los resultados para la tabla detallada
        get todosLosResultados() {
            const allParams = [
                ...this.parametrosBase,
                ...this.empujePasivoParams,
                ...this.empujeActivoParams,
                ...this.empujeSobrecargaParams,
                // Agrega parámetros de carga sísmica si quieres mostrarlos aquí también
                // ...this.cargaSismicos,
                // ...this.cargasisicatable // Esto es un getter, necesitarías procesarlo
            ];

            // Añadir los resultados totales calculados
            const totalResults = [
                { key: 'empuje_pasivo_total', label: 'Empuje Pasivo Total', symbol: 'Ep_total', unit: 'kN/m', description: 'Suma de todos los empujes pasivos' },
                { key: 'empuje_activo_total', label: 'Empuje Activo Total', symbol: 'Ea_total', unit: 'kN/m', description: 'Suma de todos los empujes activos' },
                { key: 'empuje_sobrecarga_total', label: 'Empuje Sobrecarga Total', symbol: 'Es_total', unit: 'kN/m', description: 'Suma de todos los empujes de sobrecarga' },
                { key: 'empuje_resultante', label: 'Empuje Resultante', symbol: 'E_result', unit: 'kN/m', description: 'Empuje neto sobre el muro' }
            ];

            // Mapear todos los parámetros y resultados para la visualización
            return [
                ...allParams.map(p => ({
                    key: p.key,
                    label: p.label,
                    symbol: p.symbol,
                    unit: p.unit,
                    description: this.getDescripcion(p.key) // Obtener la descripción centralizada
                })),
                ...totalResults
            ].map(item => ({
                ...item,
                value: this.getValue(item.key) // Usa getValue para obtener el valor
            }));
        },


        getB98Value() {
            // Este método ahora es redundante si usas `getValue('B98')` directamente.
            // `getValue` ya busca en `predimData.resultados` que es de donde esperas `B98`.
            // Lo mantengo por compatibilidad, pero considera removerlo y usar `this.getValue(key)` siempre.
            return this.getValue('B98'); // Re-dirigimos a la función más genérica
        },

        getParameterValue(key, unit) {
            const value = this.getValue(key);
            if (value === null || value === undefined) {
                return '-';
            }
            return this.formatValue(value) + (unit ? ' ' + unit : '');
        },

        getDescripcion(key) {
            const descripciones = {
                'B98': 'Altura equivalente de sobrecarga del terreno',
                'B99': 'Coeficiente de empuje activo de Rankine',
                'B100': 'Coeficiente de empuje pasivo de Rankine',
                'B101': 'Coeficiente de empuje en reposo',
                'B103': 'Empuje cohesivo superior del terreno',
                'B104': 'Presión en cota cero del empuje pasivo',
                'B105': 'Presión máxima en pantalla del muro (empuje pasivo)',
                'B106': 'Presión máxima en cimiento (empuje pasivo)',
                'B107': 'Presión en cota final del muro (empuje pasivo)',
                'B108': 'Empuje total del terreno (pasivo)',
                'B109': 'Componente vertical del empuje del terreno (pasivo)',
                'B110': 'Componente horizontal del empuje del terreno (pasivo)',
                'B112': 'Presión máxima en cota final del muro (empuje pasivo)',
                'B113': 'Empuje total del terreno (pasivo)',
                'B114': 'Componente vertical del empuje del terreno (pasivo)',
                'B115': 'Componente horizontal del empuje del terreno (pasivo)',
                'B119': 'Altura total de cálculo (empuje activo)',
                'B120': 'Presión en cota cero (empuje activo)',
                'B121': 'Presión en cota final del muro (empuje activo)',
                'B122': 'Presión máxima en pantalla del muro (empuje activo)',
                'B123': 'Empuje total del terreno (activo)',
                'B124': 'Componente vertical del empuje del terreno (activo)',
                'B125': 'Componente horizontal del empuje del terreno (activo)',
                'B127': 'Presión máxima en cota final del muro (empuje activo)',
                'B128': 'Empuje total del terreno (activo)',
                'B129': 'Componente vertical del empuje del terreno (activo)',
                'B130': 'Componente horizontal del empuje del terreno (activo)',
                'B133': 'Presión en cota cero (empuje sobrecarga)',
                'B134': 'Presión en cota final del muro (empuje sobrecarga)',
                'B135': 'Presión máxima en pantalla del muro (empuje sobrecarga)',
                'B136': 'Empuje total del terreno (sobrecarga)',
                'B137': 'Componente vertical del empuje del terreno (sobrecarga)',
                'B138': 'Componente horizontal del empuje del terreno (sobrecarga)',
                // Descripciones para Cargas Sísmicas
                'C144': 'Coeficiente sísmico horizontal Kh',
                'C145': 'Coeficiente sísmico vertical Kv',
                'C153': 'Coeficiente de empuje activo sísmico Kae',
                'B154': 'Peso específico del suelo gs',
                'B155': 'Altura del muro H',
                'B156': 'Coeficiente Kv (sísmico vertical)',
                'C157': 'Empuje sísmico Eae',
                'B158': 'Coeficiente sísmico horizontal Kah',
                'C159': 'Empuje activo Ea',
                'C160': 'Incremento de empuje sísmico DEae',
                'C162': 'Brazo de palanca sísmico',
                'C163': 'Momento por empuje sísmico Mae',
                // Agrega descripciones para tus resultados calculados directamente en `resultados`
                'empuje_activo_terreno': 'Empuje activo total del terreno (calculado)',
                'empuje_activo_vertical': 'Componente vertical del empuje activo (calculado)',
                'empuje_activo_horizontal': 'Componente horizontal del empuje activo (calculado)',
                'presion_activa_min': 'Presión activa mínima en la superficie (calculada)',
                'presion_activa_max': 'Presión activa máxima en la base (calculada)',
                'brazo_empuje_activo': 'Brazo de palanca del empuje activo (calculado)',
                'empuje_sobrecarga_terreno': 'Empuje de sobrecarga del terreno (calculado)',
                'empuje_sobrecarga_vertical': 'Componente vertical del empuje de sobrecarga (calculado)',
                'empuje_sobrecarga_horizontal': 'Componente horizontal del empuje de sobrecarga (calculado)',
                'presion_sobrecarga_min': 'Presión de sobrecarga mínima (calculada)',
                'presion_sobrecarga_max': 'Presión de sobrecarga máxima (calculada)',
                'brazo_empuje_sobrecarga': 'Brazo de palanca del empuje de sobrecarga (calculado)',
                'empuje_pasivo_total': 'Empuje pasivo total (calculado o recibido)',
                'empuje_activo_total': 'Empuje activo total (calculado)',
                'empuje_resultante': 'Empuje resultante neto (calculado)'
            };
            return descripciones[key] || 'Parámetro no especificado';
        },

        addError(id, message) {
            if (!this.errors.find(e => e.id === id)) {
                this.errors.push({ id, message, timestamp: new Date().toISOString() });
            }
        },

        clearErrors() {
            this.errors = [];
        },

        sendDataCargas() {
            const data = {
                inputValues: {}, // Si el módulo 'cargas' tiene inputs propios, los pondrías aquí
                resultados: { ...this.resultados },
                errors: [...this.errors],
                isCalculated: this.errors.length === 0 // Un indicador si el cálculo fue exitoso
            };

            document.dispatchEvent(new CustomEvent('cargas-data-ready', { detail: data }));
            console.log('📤 Evento "cargas-data-ready" disparado con los resultados actuales.');
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

        // Métodos para validación y consistencia
        validarDatos() {
            const errores = [];

            // Validar que dimensionamiento esté calculado
            if (!this.dimensionamientoData || !this.dimensionamientoData.isCalculated) {
                errores.push('El módulo de Dimensionamiento debe estar calculado para proceder con Cargas.');
            }

            // Validar B98
            const b98 = this.getValue('B98');
            if (b98 === null || typeof b98 !== 'number' || isNaN(b98) || b98 <= 0) {
                errores.push('B98 (altura de sobrecarga) debe ser un número válido mayor que 0.');
            }

            // Validar coeficientes (usando getValue para mayor flexibilidad)
            const ka = this.getValue('B99');
            if (ka === null || typeof ka !== 'number' || isNaN(ka) || ka <= 0 || ka >= 1) {
                errores.push('Coeficiente activo (B99) debe ser un número entre 0 y 1.');
            }

            const kp = this.getValue('B100');
            if (kp === null || typeof kp !== 'number' || isNaN(kp) || kp <= 1) {
                errores.push('Coeficiente pasivo (B100) debe ser un número mayor que 1.');
            }

            // Validar si los principales empujes tienen valores numéricos esperados
            if (typeof this.resultados.empuje_activo_total !== 'number' || isNaN(this.resultados.empuje_activo_total)) {
                errores.push('Empuje activo total no es un número válido.');
            }
            if (typeof this.resultados.empuje_pasivo_total !== 'number' || isNaN(this.resultados.empuje_pasivo_total)) {
                errores.push('Empuje pasivo total no es un número válido.');
            }


            // Aquí agregarías más validaciones específicas de tus cálculos de cargas.
            // Por ejemplo, que el empuje resultante tenga sentido, etc.

            return errores;
        },

        // Método para exportar datos
        exportarDatos() {
            const datos = {
                timestamp: new Date().toISOString(),
                modulo: 'cargas_empuje',
                // Incluimos todos los datos de los que dependemos y nuestros resultados
                predimensionamiento: this.predimData,
                dimensionamiento: this.dimensionamientoData, // Aseguramos que se exporten los datos de dimensionamiento
                resultados: this.resultados,
                errores: this.errors
            };
            return JSON.stringify(datos, null, 2);
        },

        // Método para debug
        mostrarDebugInfo() {
            console.group('Debug Info - Cargas de Empuje');
            console.log('Datos de predimensionamiento (predimData):', this.predimData);
            console.log('Datos de dimensionamiento (dimensionamientoData):', this.dimensionamientoData);
            console.log('Resultados propios de Cargas (resultados):', this.resultados);
            console.log('Errores actuales:', this.errors);
            console.log('Valor de B98 (usando getValue):', this.getValue('B98'));
            console.log('Validaciones pendientes:', this.validarDatos());
            console.groupEnd();
        }
    }));
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initCargasModule);