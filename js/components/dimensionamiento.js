function initDimensionamientoModule() {
    console.log('🔄 Inicializando módulo de dimensionamiento...');
    const dimensionamiento = document.getElementById('dimensionamiento-content');
    if (!dimensionamiento) {
        console.error('Contenedor dimensionamiento no encontrado');
        return;
    }

    // Limpiar contenedor
    dimensionamiento.innerHTML = '';

    dimensionamiento.innerHTML = `
        <div x-data="dimensionamientoModule()" class="cuaderno p-4 max-w-full mx-auto font-mono">
            <!-- MODO Y HEADER -->
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold text-gray-800">📐 Predimensionamiento del Muro</h2>
                <button @click="toggleMode" class="px-4 py-1 text-sm font-semibold rounded-full"
                    :class="mode === 'edit' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'">
                    <i class="fas" :class="mode === 'edit' ? 'fa-edit' : 'fa-eye'"></i>
                    <span x-text="mode === 'edit' ? 'Modo edición' : 'Modo vista'"></span>
                </button>
            </div>

            <!-- ENTRADAS Y SALIDAS -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                <!-- DATOS: VERIFICACIONES -->
                <section class="p-4 bg-slate-50 bg-opacity-0 border border-slate-300 rounded shadow-inner col-span-1">
                    <div class="flex items-center justify-between cursor-pointer select-none mb-2"
                        @click="showgraficoverificacion = !showgraficoverificacion">
                        <h3 class="text-lg font-semibold text-blue-800 flex items-center"><i
                                class='fas fa-flask mr-2 text-yellow-500'></i>VERIFICACIONES</h3>
                        <span class="text-xs text-gray-500" x-text="showgraficoverificacion ? 'Ocultar' : 'Mostrar'"></span>
                    </div>
                    <div class="space-y-4" x-show="showgraficoverificacion">

                        <!-- UBICACION -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-2">
                            <span class="w-1/4 text-gray-700">UBICACION</span>
                            <span class="w-1/6 text-gray-500"></span>
                            <select
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                x-model="datosdim.C92">
                                <option value="" disabled>Seleccione...</option>
                                <option value="5.25">EXTREMO INTERIOR</option>
                                <option value="2.18">EN EL CENTRO</option>
                                <option value="0.45">EXTREMO EXTERIOR</option>
                            </select>
                            <span class="w-1/6 text-gray-500"></span>
                        </div>

                        <!-- ¿CONSIDERAR Pp? -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-2">
                            <span class="w-1/4 text-gray-700">¿CONSIDERAR Pp?</span>
                            <span class="w-1/6 text-gray-500"></span>
                            <select
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                x-model="datosdim.C93">
                                <option value="" disabled>Seleccione...</option>
                                <option value="desde">DESDE 0.00</option>
                                <option value="DESDECIMEN">DESDE LA CIMEN</option>
                                <option value="DESDEELKEY">DESDE ELKEY</option>
                                <option value="CORTADOENLACIM">CORTADO EN LA CIM</option>
                                <option value="CORTADOENELKEY">CORTADO EN EL KEY</option>
                                <option value="no">no</option>
                            </select>
                            <span class="w-1/6 text-gray-500"></span>
                        </div>

                        <!-- La Pa desde -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-2">
                            <span class="w-1/4 text-gray-700">La Pa desde</span>
                            <span class="w-1/6 text-gray-500"></span>
                            <select
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                x-model="datosdim.C94">
                                <option value="" disabled>Seleccione...</option>
                                <option value="solopantalla">Solo pantalla</option>
                                <option value="Pantallazapata">Pantalla+zapata</option>
                                <option value="pantallazapatatalud">Pantalla+zapata+talud</option>
                                <option value="Pantallazapatataludkey">Pantalla+zapata+talud+key</option>
                                <option value="Pantallazapatakey">Pantalla+zapata+key</option>
                            </select>
                            <span class="w-1/6 text-gray-500"></span>
                        </div>

                        <!-- ¿CONSIDERAR LA Pav? -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-2">
                            <span class="w-1/4 text-gray-700">¿CONSIDERAR LA Pav?</span>
                            <span class="w-1/6 text-gray-500"></span>
                            <select
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                x-model="datosdim.C95">
                                <option value="" disabled>Seleccione...</option>
                                <option value="SI">SI</option>
                                <option value="NO">NO</option>
                            </select>
                            <span class="w-1/6 text-gray-500"></span>
                        </div>
                        
                        <!-- ¿CONSIDERAR COHESION? -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-2">
                            <span class="w-1/4 text-gray-700">¿CONSIDERAR COHESION?</span>
                            <span class="w-1/6 text-gray-500"></span>
                            <select
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                x-model="datosdim.C96">
                                <option value="" disabled>Seleccione...</option>
                                <option value="SI">SI</option>
                                <option value="NO">NO</option>
                            </select>
                            <span class="w-1/6 text-gray-500"></span>
                        </div>
                    </div>
                    <div class="flex gap-4 mt-4">
                        <button 
                            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50" 
                            id="calcularval" 
                            x-on:click="calcularTodo()"
                            :disabled="isCalculating || !predimData"
                            :class="{ 'opacity-50 cursor-not-allowed': isCalculating || !predimData }">
                            <span x-show="!isCalculating">Calcular</span>
                            <span x-show="isCalculating">Calculando...</span>
                        </button>
                        
                        <div x-show="resultados && Object.keys(resultados).length > 0" class="flex items-center text-green-600">
                            <i class="fas fa-check-circle mr-2"></i>
                            <span>Dimensionamiento completado</span>
                        </div>
                    </div>
                    <!-- Mostrar errores si los hay -->
                    <div x-show="errors && errors.length > 0" class="mt-4 p-3 bg-red-100 border border-red-400 rounded">
                        <h4 class="font-bold text-red-800">Errores encontrados:</h4>
                        <ul class="list-disc ml-5 text-red-700">
                            <template x-for="error in errors">
                                <li x-text="error"></li>
                            </template>
                        </ul>
                    </div>
                </section>
            
                <!-- PREDIMENSIONAMIENTO: GRAFICO AMPLIADO -->
                <section
                    class="row-span-2 md:col-span-2 p-8 bg-slate-50 bg-opacity-0 border border-slate-300 rounded shadow-inner flex flex-col items-center justify-center">
                    <h3 class="text-lg font-semibold text-blue-800 mb-3 flex items-center"><i
                            class='fas fa-chart-bar mr-2 text-blue-400'></i>Gráfico</h3>
                    <div class="image-container" style="position: relative; width: 100%; max-width: 800px; margin: 0 auto;">

                        <style>
                            .measurement-input {
                                border: 1px solid #ccc;
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
                                background: rgba(255, 252, 252, 0.8);
                                box-shadow: 0 0 5px rgba(255, 251, 251, 0.3);
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
                        <img class="w-full h-600" src="js/assets/verificacion.png" alt="Imagen" />

                        <!-- Inputs posicionados absolutamente sobre la imagen -->
                        <input type="number" x-model.number="datosdim.C74" step="0.001"
                            class="measurement-input" style="position: absolute; top: 10%; left: 48%;">

                        <input type="number" x-model.number="datosdim.E74" disabled step="0.001"
                            class="measurement-input-result" style="position: absolute; top: 12%; left: 85%;">

                        <input type="number" x-model.number="datosdim.E79" disabled step="0.001"
                            class="measurement-input-result" style="position: absolute; top: 40%; left: 85%;">

                        <input type="number" x-model.number="datosdim.A83" step="0.001"
                            class="measurement-input" style="position: absolute; top: 53%; left: 25%;">

                        <input type="number" x-model.number="datosdim.A88" disabled step="0.001"
                            class="measurement-input-result" style="position: absolute; top: 81%; left: 20%;">

                        <input type="number" x-model.number="datosdim.A89" step="0.001"
                            class="measurement-input" style="position: absolute; top: 86%; left: 20%;">

                        <input type="number" x-model.number="datosdim.D88" disabled step="0.001"
                            class="measurement-input-result" style="position: absolute; top: 81%; left: 66%;">

                        <input type="number" x-model.number="datosdim.B88" disabled step="0.001"
                            class="measurement-input-result" style="position: absolute; top: 81%; left: 42%;">

                        <input type="number" x-model.number="datosdim.B90" disabled step="0.001"
                            class="measurement-input-result" style="position: absolute; top: 92%; left: 42%;">

                        <input type="number" x-model.number="datosdim.D89" step="0.001"
                            class="measurement-input" style="position: absolute; top: 86%; left: 66%;">

                        <input type="number" x-model.number="datosdim.F86" step="0.001"
                            class="measurement-input" style="position: absolute; top: 70%; left: 96%;">

                        <input type="number" x-model.number="datosdim.E86" disabled step="0.001"
                            class="measurement-input-result" style="position: absolute; top: 70%; left: 85%;">

                        <!--parte diente-->
                        <input type="number" x-model.number="datosdim.F91" disabled step="0.001"
                            class="measurement-input-result" style="position: absolute; top: 11%; left: 8%;">

                        <input type="number" x-model.number="datosdim.G93" disabled step="0.001"
                            class="measurement-input-result" style="position: absolute; top: 20%; left: 25%;">

                        <input type="number" x-model.number="datosdim.G94" step="0.001"
                            class="measurement-input" style="position: absolute; top: 25%; left: 25%;">

                        <input type="number" x-model.number="datosdim.F95" step="0.001"
                            class="measurement-input" style="position: absolute; top: 33%; left: 10%;">
                    </div>
                </section>

                <!-- RESULTADOS -->
                <section class="p-4 bg-slate-100 bg-opacity-0 border border-slate-300 rounded shadow-inner mt-2">
                    <h3 class="text-lg font-semibold text-blue-800 mb-3 flex items-center"><i
                            class='fas fa-check-circle mr-2 text-green-600'></i>Resultados</h3>
                    <!-- Tabla de Impulsión -->
                    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold">
                                <tr>
                                    <th rowspan="2" class="px-6 py-3 text-center"></th>
                                    <th rowspan="2" class="px-6 py-3 text-center">SIN SISMO</th>
                                    <th rowspan="2" class="px-6 py-3 text-center">CON SISMO</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-100 text-sm text-gray-800">
                                <template x-for="(accesorio, idx) in verfsismo.accesorios" :key="idx">
                                    <tr class="hover:bg-gray-50 transition-all duration-200">
                                        <td class="px-6 py-3 text-center" x-text="accesorio.tipo"></td>
                                        <td class="px-6 py-3 text-center" x-text="accesorio.cantidad.toFixed(3)"></td>
                                        <td class="px-6 py-3 text-center" x-text="accesorio.leq.toFixed(3)"></td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    `;

    Alpine.data('dimensionamientoModule', () => ({
        mode: 'edit',
        showgraficoverificacion: true,
        predimData: null,
        datosdim: {},
        resultados: {},
        errors: [],
        isCalculating: false,
        lastInputHash: '',

        datosdim: {
            // Verificaciones (pueden ser 'string' para selects o checkboxes)
            C92: '2.18',
            C93: 'desde', // Controla qué fila de datapredimTable se usa
            C94: 'pantallazapatatalud', // Controla qué fila de paTable se usa
            C95: 'SI', // Para cálculos condicionales (e.g., sismo)
            C96: 'SI', // Para cálculos condicionales (e.g., sismo)

            // Gráfico y Cálculos (ajustar tipos según tus inputs HTML)
            C74: 0.2, E74: 0.64, E79: 6.65, E86: 0.74, F86: 0.75,
            D88: 2.71, D89: 3, B88: 0.9, B90: 5.70,
            A88: 1.73, A89: 1.8, A82: 0.54, A83: 0.7,

            // Diente (ajustar tipos según tus inputs HTML)
            F91: 0.9, G93: 0.74, G94: 1, F95: 0.2,
        },

        verfsismo: {
            // Esto parece más una lista de ítems para mostrar que inputs directos de cálculo.
            // Si los valores 'cantidad' o 'leq' deben ser editables, se usaría x-model en el HTML.
            accesorios: [
                { tipo: 'FSV', cantidad: 0, leq: 0 },
                { tipo: 'FSD', cantidad: 0, leq: 0 },
                { tipo: '1/3B', cantidad: 0, leq: 0 },
                { tipo: 'Qadm', cantidad: 0, leq: 0 },
                { tipo: 'Qadm', cantidad: 0, leq: 0 },
            ],
        },

        init() {
            console.log('🔄 Inicializando dimensionamiento module...');
            this.loadSavedData();
            this.configurarEventos();
            this.setupEventListeners();
        },

        loadSavedData() {
            // Cargar datos guardados si existen
            const systemData = this.getSystemData();
            if (systemData) {
                // Cargar datos de predimensionamiento
                if (systemData.predimensionamiento && systemData.predimensionamiento.isCalculated) {
                    this.predimData = {
                        inputValues: systemData.predimensionamiento.inputValues || {},
                        resultados: systemData.predimensionamiento.resultados || {}
                    };
                    console.log('📊 Datos de predimensionamiento cargados en dimensionamiento');
                }

                // Cargar datos de dimensionamiento
                if (systemData.dimensionamiento) {
                    this.datosdim = systemData.dimensionamiento.inputValues || {};
                    this.resultados = systemData.dimensionamiento.resultados || {};
                    this.errors = systemData.dimensionamiento.errors || [];
                    console.log('📊 Datos de dimensionamiento cargados');
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
            // Escucha el evento de predimensionamiento
            document.addEventListener('predimensionamiento-updated', (event) => {
                console.log('📨 Recibiendo datos de predimensionamiento:', event.detail);

                if (event.detail && event.detail.isCalculated) {
                    this.predimData = {
                        inputValues: { ...event.detail.inputValues },
                        resultados: { ...event.detail.resultados }
                    };

                    console.log('✅ Datos de predimensionamiento actualizados en dimensionamiento');

                    // Auto-calcular dimensionamiento si ya hay datos
                    if (Object.keys(this.datosdim).length > 0) {
                        this.calcularTodo();
                    }
                }
            });

            // Escuchar datos listos de predimensionamiento
            document.addEventListener('predimensionamiento-data-ready', (event) => {
                console.log('📨 Datos de predimensionamiento listos para usar:', event.detail);

                if (event.detail.predimensionamientoData) {
                    this.predimData = {
                        inputValues: event.detail.predimensionamientoData.inputValues || {},
                        resultados: event.detail.predimensionamientoData.resultados || {}
                    };
                }
            });
        },

        /**
         * Valida un número y devuelve su valor flotante. Si es inválido,
         * agrega un error y devuelve un valor por defecto.
         * @param {*} value - El valor a validar.
         * @param {string} id - El ID para el mensaje de error.
         * @param {string} label - La etiqueta para el mensaje de error.
         * @param {number} defaultValue - El valor por defecto si la validación falla.
         * @returns {number} El valor numérico validado o el valor por defecto.
         */
        validateAndGetNumber(value, id, label, defaultValue) {
            const num = parseFloat(value);
            if (isNaN(num)) {
                this.addError(`validation_${id}`, `${label} debe ser un número válido.`);
                return defaultValue;
            }
            if (num < 0) {
                this.addError(`validation_${id}`, `${label} no puede ser negativo.`);
                return defaultValue;
            }
            this.removeError(`validation_${id}`);
            return num;
        },

        calcularTodo() {
            this.clearErrors(); // Limpiar errores al inicio de cada cálculo

            if (!this.predimData || !this.predimData.inputValues) {
                this.addError('calculo_general', 'No se han recibido datos de predimensionamiento.');
                this.sendDatadimensionamiento(); // Asegurarse de enviar incluso con errores
                return;
            }

            const datapredim = this.predimData.inputValues;
            const datosdim = this.datosdim; // Acceder directamente a datosdim
            // Crear un hash solo de los datos que realmente influyen en el cálculo
            const currentInputHash = JSON.stringify({ datapredim, datosdim });

            // Si los inputs no han cambiado, y no hay errores previos, podemos saltar el recálculo
            if (this.lastInputHash === currentInputHash && !this.hasErrors) {
                // console.log('Inputs sin cambios, saltando recálculo.');
                return;
            }

            this.lastInputHash = currentInputHash;

            try {
                // --- Validaciones de entradas críticas antes de los cálculos ---
                const B12 = this.validateAndGetNumber(datapredim.B12, 'B12', 'Ángulo de fricción interna (B12)', 26.90);
                const B20 = this.validateAndGetNumber(datapredim.B20, 'B20', 'Ángulo de inclinación del muro (B20)', 12);
                const B18 = this.validateAndGetNumber(datapredim.B18, 'B18', 'Altura del muro (B18)', 6.4);
                const B11 = this.validateAndGetNumber(datapredim.B11, 'B11', 'Peso específico del suelo (B11)', 1.83);
                const B25 = this.validateAndGetNumber(datapredim.B25, 'B25', 'Sobrecarga (B25)', 0.4);
                const B13 = this.validateAndGetNumber(datapredim.B13, 'B13', 'Cohesión (B13)', 0.05);
                const B19 = this.validateAndGetNumber(datapredim.B19, 'B19', 'Profundidad de cimentación (B19)', 1.0);
                const B21 = this.validateAndGetNumber(datapredim.B21, 'B21', 'Altura total (B21)', datapredim.B18 + datapredim.B19);

                const F86 = this.validateAndGetNumber(datosdim.F86, 'F86', 'F86', 0.75);
                const D89 = this.validateAndGetNumber(datosdim.D89, 'D89', 'D89', 3);
                const G94 = this.validateAndGetNumber(datosdim.G94, 'G94', 'G94', 1);
                const G93 = this.validateAndGetNumber(datosdim.G93, 'G93', 'G93', 0.74);
                const C95 = datosdim.C95; // 'SI' / 'NO'
                const C96 = datosdim.C96; // 'SI' / 'NO'
                const C93_select = datosdim.C93; // Valor del select para datapredimTable
                const C94_select = datosdim.C94; // Valor del select para paTable

                // Cálculos de Ángulos y Constantes de Empuje
                const D12_rad = (B12 * Math.PI) / 180;
                const D20_rad = (B20 * Math.PI) / 180; // Ángulo de inclinación del muro en radianes

                const cosd = Math.cos(D20_rad);
                const cosPhi2 = Math.cos(D12_rad) ** 2;
                const cosd2 = cosd ** 2;

                const sqrt_cosd2_minus_cosPhi2 = Math.sqrt(Math.max(0, cosd2 - cosPhi2)); // Evitar NaN si cosPhi2 > cosd2

                const term1_num = cosd - sqrt_cosd2_minus_cosPhi2;
                const term1_den = cosd + sqrt_cosd2_minus_cosPhi2;
                const B99 = (term1_num / term1_den) * cosd; // Ka de Coulomb si se aplica

                const term2_num = cosd + sqrt_cosd2_minus_cosPhi2;
                const term2_den = cosd - sqrt_cosd2_minus_cosPhi2;
                const B100 = (term2_num / term2_den) * cosd; // Kp de Coulomb si se aplica (o similar)
                const B101 = 1 - Math.sin(D12_rad); // Kp de Coulomb si se aplica (o similar)

                const B98 = B25 / B11; // H equivalente de la sobrecarga
                const E74_calc = D89 * Math.atan(D20_rad); // E74 del gráfico (asumiendo que es B20 en radianes)
                const E79_calc = B21 - F86; // Altura del muro por encima de la zapata - altura de la llave
                const B112 = (C96 === "SI") ? 2 * B13 * Math.sqrt(B100) : 0; // Contribución de la cohesión al empuje pasivo

                // --- Variables Intermedias (Tabla tipo Excel, renombradas para claridad) ---
                // Estos valores deberían ser resultados de alguna tabla de datos que se genere o importe
                // Por el momento, los calculamos como en el original, pero idealmente serían de una fuente de datos
                const tablaDesde = {
                    // Columna 1 (M)
                    'desde': (B19 + G94) * B112 / 2, // M78 corregido si aplica
                    'DESDECIMEN': (F86 + G94) * B112 / 2, // M79 corregido si aplica
                    'DESDEELKEY': G94 * B112 / 2, // M80 corregido si aplica
                    'CORTADOENLACIM': (B100 * B11 * (B19) + B112 * (B19 + G94)) * (B19 + G94) / 2, // Ajuste con Q81, S81, G93, F86
                    'CORTADOENELKEY': (B100 * B11 * (B19) + B112 * (G94)) * G94 / 2, // Ajuste con R82, S82, G94
                    'no': 0,
                };

                const O_values = {
                    'desde': G94 + B19,
                    'DESDECIMEN': G94 + F86,
                    'DESDEELKEY': G94,
                    'CORTADOENLACIM': G94, // O81
                    'CORTADOENELKEY': G94, // O82
                    'no': 0,
                };
                const N_values = {
                    'desde': B112 * O_values.desde,
                    'DESDECIMEN': B112 * O_values.DESDECIMEN,
                    'DESDEELKEY': B112 * O_values.DESDEELKEY,
                    'CORTADOENLACIM': B112 * O_values.CORTADOENLACIM,
                    'CORTADOENELKEY': B112 * O_values.CORTADOENELKEY,
                    'no': 0,
                };
                const P_values = {
                    'desde': B19 - F86,
                    'DESDECIMEN': 0,
                    'DESDEELKEY': 0,
                    'CORTADOENLACIM': 0,
                    'CORTADOENELKEY': 0,
                    'no': 0,
                };
                const Q_values = {
                    'desde': (P_values.desde) * B100 * B11,
                    'DESDECIMEN': 0,
                    'DESDEELKEY': 0,
                    'CORTADOENLACIM': (P_values.desde) * B100 * B11, // Q81
                    'CORTADOENELKEY': 0, // Q82
                    'no': 0,
                };
                const R_values = {
                    'desde': (B19) * B100 * B11,
                    'DESDECIMEN': (F86) * B100 * B11,
                    'DESDEELKEY': 0,
                    'CORTADOENLACIM': (B19) * B100 * B11, // R81
                    'CORTADOENELKEY': (B19) * B100 * B11, // R82
                    'no': 0,
                };
                const S_values = {
                    'desde': (B19 + G94) * B100 * B11,
                    'DESDECIMEN': (G94 + F86) * B100 * B11,
                    'DESDEELKEY': (G94) * B100 * B11,
                    'CORTADOENLACIM': (B19 + G94) * B100 * B11, // S81
                    'CORTADOENELKEY': (B19 + G94) * B100 * B11, // S82
                    'no': 0,
                };
                const T_values = {
                    'desde': (B19 + G94) / 3,
                    'DESDECIMEN': (F86 + G94) / 3,
                    'DESDEELKEY': G94 / 3,
                    'CORTADOENLACIM': (F86 + G94) * (S_values.CORTADOENLACIM + 2 * Q_values.CORTADOENLACIM) / (S_values.CORTADOENLACIM + Q_values.CORTADOENLACIM) / 3,
                    'CORTADOENELKEY': (G94) * (S_values.CORTADOENELKEY + 2 * R_values.CORTADOENELKEY) / (S_values.CORTADOENELKEY + R_values.CORTADOENELKEY) / 3,
                    'no': 0,
                };

                // Reconstrucción de `datapredimTable` con los valores intermedios (M, N, O, P, Q, R, S, T)
                // Se asume que M78 a M83, y N78 a T83 son de una tabla con 8 columnas como la original.
                const datapredimTable = {
                    'desde': [tablaDesde.desde, N_values.desde, O_values.desde, P_values.desde, Q_values.desde, R_values.desde, S_values.desde, T_values.desde],
                    'DESDECIMEN': [tablaDesde.DESDECIMEN, N_values.DESDECIMEN, O_values.DESDECIMEN, P_values.DESDECIMEN, Q_values.DESDECIMEN, R_values.DESDECIMEN, S_values.DESDECIMEN, T_values.DESDECIMEN],
                    'DESDEELKEY': [tablaDesde.DESDEELKEY, N_values.DESDEELKEY, O_values.DESDEELKEY, P_values.DESDEELKEY, Q_values.DESDEELKEY, R_values.DESDEELKEY, S_values.DESDEELKEY, T_values.DESDEELKEY],
                    'CORTADOENLACIM': [tablaDesde.CORTADOENLACIM, N_values.CORTADOENLACIM, O_values.CORTADOENLACIM, P_values.CORTADOENLACIM, Q_values.CORTADOENLACIM, R_values.CORTADOENLACIM, S_values.CORTADOENLACIM, T_values.CORTADOENLACIM],
                    'CORTADOENELKEY': [tablaDesde.CORTADOENELKEY, N_values.CORTADOENELKEY, O_values.CORTADOENELKEY, P_values.CORTADOENELKEY, Q_values.CORTADOENELKEY, R_values.CORTADOENELKEY, S_values.CORTADOENELKEY, T_values.CORTADOENELKEY],
                    'no': [tablaDesde.no, N_values.no, O_values.no, P_values.no, Q_values.no, R_values.no, S_values.no, T_values.no],
                };


                // --- Alturas Activas y Brazos (Tabla paTable) ---
                const N86_calc = E79_calc;
                const N87_calc = E79_calc + F86;
                const N88_calc = F86 + E79_calc + E74_calc; // Asumo E74_calc
                const N89_calc = E74_calc + E79_calc + F86 + G94;
                const N90_calc = G94 + F86 + E79_calc;

                const O86_calc = N86_calc / 3 + F86;
                const O87_calc = N87_calc / 3;
                const O88_calc = N88_calc / 3;
                const O89_calc = (N89_calc / 3 <= G94) ? G94 - N89_calc / 3 : N89_calc / 3 - G94;
                const O90_calc = (N90_calc / 3 <= G94) ? G94 - N90_calc / 3 : N90_calc / 3 - G94;

                const paTable = {
                    'solopantalla': [N86_calc, O86_calc],
                    'Pantallazapata': [N87_calc, O87_calc],
                    'pantallazapatatalud': [N88_calc, O88_calc],
                    'Pantallazapatataludkey': [N89_calc, O89_calc],
                    'Pantallazapatakey': [N90_calc, O90_calc],
                };

                // Función genérica para buscar valores en tablas por selección
                const buscarValorEnTabla = (tabla, valorSelect, columnaIndex, defaultVal = 0) => {
                    const fila = tabla[valorSelect];
                    if (!fila) {
                        this.addError(`select_value_${valorSelect}`, `Valor de selección inválido: ${valorSelect}`);
                        return defaultVal;
                    }
                    const valorBuscado = fila[columnaIndex - 1];
                    if (typeof valorBuscado === 'undefined' || isNaN(valorBuscado)) {
                        this.addError(`column_value_${valorSelect}_${columnaIndex}`, `Valor de columna no encontrado o inválido en ${valorSelect} (col: ${columnaIndex})`);
                        return defaultVal;
                    }
                    return valorBuscado;
                };

                // Cálculo de Empuje Pasivo del Suelo
                const B103 = buscarValorEnTabla(datapredimTable, C93_select, 2);
                const B104 = 0; // Asumiendo que sigue siendo 0 por la fórmula original
                const B105 = buscarValorEnTabla(datapredimTable, C93_select, 4);
                const B106 = buscarValorEnTabla(datapredimTable, C93_select, 5);
                const B107 = buscarValorEnTabla(datapredimTable, C93_select, 6);
                const B108 = buscarValorEnTabla(datapredimTable, C93_select, 1);
                const B109 = 0; // Asumiendo que sigue siendo 0
                const B110 = B108;
                const B113 = buscarValorEnTabla(datapredimTable, C93_select, 2);
                const B114 = (C96 === "SI") ? B113 * Math.sin(0) : 0; // Math.sin(0) es 0, por lo que B114 siempre es 0
                const B115 = B113;

                // Cálculo de Empuje Activo del Suelo
                const B119_val = buscarValorEnTabla(paTable, C94_select, 1);
                const B120_val = 0; // Asumiendo 0
                const B121_val = B11 * B99 * B119_val;
                const B122_val = B99 * B11 * (B119_val - F86);
                const B123_val = B121_val * B119_val / 2;
                const B124_val = (C95 === "SI") ? B123_val * Math.sin(D20_rad) : 0;
                const B125_val = B123_val * Math.cos(D20_rad);

                const B127_val = (C96 === "SI") ? 2 * B13 * Math.sqrt(B99) : 0;
                const B128_val = B127_val * B119_val / 2;
                const B129_val = (C95 === "SI") ? B128_val * Math.sin(D20_rad) : 0;
                const B130_val = -B128_val * Math.cos(D20_rad);

                // Cálculo de Empuje de Sobrecarga
                const B133_val = B25 * B99;
                const B134_val = B133_val;
                const B135_val = B134_val;
                const B136_val = B134_val * B119_val;
                const B137_val = (C95 === "SI") ? B136_val * Math.sin(D20_rad) : 0;
                const B138_val = B136_val * Math.cos(D20_rad);

                // Cálculos Sísmicos
                const C144_val = datapredim.B29 / 2; // Asumiendo B29 es una variable de datapredim
                const C145_val = datapredim.B29 * C144_val; // Asumo B29
                const C147_val = Math.tan(C144_val / (1 - C145_val)); // Esto podría dar NaN si (1 - C145_val) es 0 o negativo
                const B147_val = C147_val * (180 / Math.PI);
                const B148_val = B12;
                const B149_val = 0; // Asumo 0
                const B150_val = 0; // Asumo 0
                const B151_val = B20; // Asumo B20

                const C148_rad = (B148_val) * (Math.PI / 180);
                const C149_rad = (B149_val) * (Math.PI / 180);
                const C150_rad = (B150_val) * (Math.PI / 180);
                const C151_rad = 0; // Asumo 0
                const C152_val = 0; // Asumo 0

                const U157 = Math.sin(C150_rad + C148_rad);
                const U158 = Math.sin(C148_rad - C147_val - C151_rad);
                const U159 = Math.cos(C150_rad + C149_rad + C147_val);
                const U160 = Math.cos(C151_rad - C149_rad);
                const U161 = Math.sqrt(Math.max(0, U157 * U158 / (U159 * U160))); // Max(0) para evitar raíces negativas
                const B152_val = (1 + U161) ** 2;

                const T157_val = Math.cos(C148_rad - C147_val - C149_rad);
                const T158_val = Math.cos(C147_val) * Math.cos(C149_rad) ** 3 * Math.cos(C149_rad + C150_rad + C147_val);

                const C153_val = T157_val * T157_val / (B152_val * T158_val);
                const B154_val = B11;
                const B155_val = E79_calc;
                const B156_val = C145_val;
                const C157_val = 0.5 * B154_val * (1 - B156_val) * C153_val * B155_val * B155_val;
                const B158_val = B99;
                const C159_val = 0.5 * B154_val * B158_val * B155_val * B155_val;
                const C160_val = C157_val - C159_val;
                const C162_val = (B155_val / 3 * C159_val + B155_val * 0.6 * C160_val) / C157_val;
                const C163_val = C160_val * C162_val;

                const E172 = buscarValorEnTabla(paTable, C94_select, 2);
                const E175 = (buscarValorEnTabla(datapredimTable, C93_select, 2)) / 3;

                // Actualizar resultados de forma inmutable y eficiente
                Object.assign(this.resultados, {
                    datapredim, datosdim, // Incluir los datos de entrada usados en el resultado para trazabilidad
                    E74: E74_calc, B98, B99, B100, B101, B112, E79: E79_calc,
                    // Empuje pasivo del suelo
                    B103, B104, B105, B106, B107, B108, B109, B110, B113, B114, B115,
                    // Empuje activo del suelo
                    B119: B119_val, B120: B120_val, B121: B121_val, B122: B122_val, B123: B123_val,
                    B124: B124_val, B125: B125_val, B127: B127_val, B128: B128_val, B129: B129_val, B130: B130_val,
                    // Empuje de sobrecarga
                    B133: B133_val, B134: B134_val, B135: B135_val, B136: B136_val, B137: B137_val, B138: B138_val,
                    // Carga sísmica
                    C144: C144_val, C145: C145_val, C147: C147_val, B147: B147_val, B148: B148_val,
                    B149: B149_val, B150: B150_val, B151: B151_val, C148: C148_rad, C149: C149_rad,
                    C150: C150_rad, C151: C151_rad, C152: C152_val, U157, U158, U159, U160, U161,
                    B152: B152_val, T157: T157_val, T158: T158_val, C153: C153_val, B154: B154_val,
                    B155: B155_val, B156: B156_val, C157: C157_val, B158: B158_val, C159: C159_val,
                    C160: C160_val, C162: C162_val, C163: C163_val, E172, E175,
                    // ...otros resultados si los hay
                });

                this.sendDatadimensionamiento(); // Enviar datos después de un cálculo exitoso

            } catch (error) {
                this.addError('calculo_general', 'Error crítico en el cálculo: ' + error.message);
                console.error('Error en calcularTodo:', error);
                this.sendDatadimensionamiento(); // Enviar incluso con error para notificar
            }
        },

        addError(id, message) {
            if (!this.errors.find(e => e.id === id)) {
                this.errors.push({ id, message });
            }
        },

        removeError(id) {
            this.errors = this.errors.filter(e => e.id !== id);
        },

        clearErrors() {
            this.errors = [];
        },

        sendDatadimensionamiento() {
            const data = {
                inputValues: JSON.parse(JSON.stringify(this.datosdim)),
                predimData: this.predimData ? JSON.parse(JSON.stringify(this.predimData)) : null,
                resultados: JSON.parse(JSON.stringify(this.resultados)),
                errors: [...this.errors],
                isCalculated: this.errors.length === 0 && Object.keys(this.resultados).length > 0
            };

            console.log('📤 Enviando datos de dimensionamiento:', data);

            try {
                document.dispatchEvent(new CustomEvent('dimensionamiento-updated', {
                    detail: data,
                    bubbles: true
                }));
            } catch (error) {
                console.error('❌ Error enviando datos de dimensionamiento:', error);
            }
        },

        toggleMode() {
            this.mode = this.mode === 'edit' ? 'view' : 'edit';
        },

        formatValue(value, decimals = 2) {
            if (value === null || value === undefined || value === '') return '-';
            if (typeof value !== 'number') return value;
            return value.toFixed(decimals);
        },

        formatDisplayValue(value, type, decimals) {
            if (type === 'checkbox') {
                return value ? '✓ Activo' : '✗ Inactivo';
            }
            return this.formatValue(value, decimals);
        },

        get hasErrors() {
            return this.errors.length > 0;
        }
    }));
}

document.addEventListener('DOMContentLoaded', initDimensionamientoModule);

