function initdimensionamientoModule() {
    const dimensionamiento = document.getElementById('dimensionamiento-content');
    if (!dimensionamiento) {
        console.error('Contenedor dimensionamiento no encontrado');
        return;
    }

    dimensionamiento.innerHTML = `
        <div x-data="dimensionamientoModule()" class="cuaderno p-4 max-w-full mx-auto font-mono">
            <!-- MODO Y HEADER -->
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold text-gray-800">📐 Predimensionamiento del Muro</h2>
                <button @click="toggleMode"
                    class="px-4 py-1 text-sm font-semibold rounded-full"
                    :class="mode === 'edit' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'">
                    <i class="fas" :class="mode === 'edit' ? 'fa-edit' : 'fa-eye'"></i>
                    <span x-text="mode === 'edit' ? 'Modo edición' : 'Modo vista'"></span>
                </button>
            </div>

            <!-- ENTRADAS Y SALIDAS -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                <!-- DATOS: VERIFICACIONES -->
                <section class="p-4 bg-slate-50 bg-opacity-0 border border-slate-300 rounded shadow-inner col-span-1">
                    <div class="flex items-center justify-between cursor-pointer select-none mb-2" @click="showgraficoverificacion = !showgraficoverificacion">
                        <h3 class="text-lg font-semibold text-blue-800 flex items-center"><i class='fas fa-flask mr-2 text-yellow-500'></i>VERIFICACIONES</h3>
                        <span class="text-xs text-gray-500" x-text="showgraficoverificacion ? 'Ocultar' : 'Mostrar'"></span>
                    </div>
                    <div class="space-y-4" x-show="showgraficoverificacion">
                        <template x-for="input in inputSections.graficoverificacion" :key="input.id">
                            <div class="flex text-xs px-6 items-center space-x-2 mb-2">
                                <label class="w-1/4 text-gray-700 font-medium text-sm" x-text="input.label"></label>
                                <span class="w-1/6 text-gray-500 text-sm" x-text="input.symbol"></span>
                                
                                <template x-if="mode === 'edit'">
                                    <div class="w-1/4">
                                        <!-- Select Input -->
                                        <template x-if="input.type === 'select'">
                                            <select 
                                                class="input-field w-full text-sm px-2 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                x-model="inputValues.graficoverificacion[input.id]"
                                                @change="handleInputChange('graficoverificacion', input.id, $event.target.value)">
                                                <option value="" disabled>Seleccione...</option>
                                                <template x-for="opt in input.options" :key="opt.value || opt">
                                                    <option :value="opt.value || opt" x-text="opt.label || opt"></option>
                                                </template>
                                            </select>
                                        </template>

                                        <!-- Text/Number Input -->
                                        <template x-if="input.type === 'text' || input.type === 'number'">
                                            <input 
                                                :type="input.type"
                                                class="input-field w-full text-xs px-2 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                :placeholder="input.placeholder || ''"
                                                x-model="inputValues.graficoverificacion[input.id]"
                                                @input="handleInputChange('graficoverificacion', input.id, $event.target.value)"
                                                @blur="validateInput('graficoverificacion', input.id, input)">
                                        </template>
                                    </div>
                                </template>

                                <template x-if="mode === 'view'">
                                    <span class="w-1/4 text-gray-800 text-sm font-medium" 
                                        x-text="formatDisplayValue(inputValues.graficoverificacion[input.id], input.type)">
                                    </span>
                                </template>

                                <span class="w-1/6 text-gray-500 text-sm" x-text="input.unit || ''"></span>
                            </div>
                        </template>
                    </div>
                    <button class="bg-gray-800 text-gray-50" id="calcularval" @click="calcularval()">Calcular</button>
                </section>

                <!-- PREDIMENSIONAMIENTO: GRAFICO AMPLIADO -->
                <section class="row-span-2 md:col-span-2 p-8 bg-slate-50 bg-opacity-0 border border-slate-300 rounded shadow-inner flex flex-col items-center justify-center">
                    <h3 class="text-lg font-semibold text-blue-800 mb-3 flex items-center"><i class='fas fa-chart-bar mr-2 text-blue-400'></i>Gráfico</h3>
                    <div class="image-container"
                        style="position: relative; width: 100%; max-width: 800px; margin: 0 auto;">
                        
                        <style>
                            .measurement-input {
                                background: rgba(0, 0, 0, 0.8);
                                border: 1px solid #ccc;
                                padding: 4px 8px;
                                font-size: 12px;
                                width: 80px;
                                border-radius: 4px;
                                transition: all 0.3s ease;
                                color: aliceblue;
                            }
                            .measurement-input-result {
                                background: rgba(253, 14, 14, 0.8);
                                border: 1px solid #ccc;
                                padding: 4px 8px;
                                font-size: 12px;
                                width: 80px;
                                border-radius: 4px;
                                transition: all 0.3s ease;
                                color: aliceblue;
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
                        <img class="w-full h-600" src="js/assets/verificacion.png"
                            alt="Imagen" />

                        <!-- Inputs posicionados absolutamente sobre la imagen -->
                        <input type="number" x-model.number="inputValues.graficoverificacion.C74" step="0.001" class="measurement-input"
                            style="position: absolute; top: 10%; left: 48%;">

                        <input type="number" x-model.number="inputValues.graficoverificacion.E74" disabled step="0.001" class="measurement-input-result"
                            style="position: absolute; top: 12%; left: 85%;">

                        <input type="number" x-model.number="inputValues.graficoverificacion.E79" disabled step="0.001" class="measurement-input-result"
                            style="position: absolute; top: 40%; left: 85%;">

                        <input type="number" x-model.number="inputValues.graficoverificacion.A83" step="0.001" class="measurement-input"
                            style="position: absolute; top: 53%; left: 25%;">

                        <input type="number" x-model.number="inputValues.graficoverificacion.A88" disabled step="0.001" class="measurement-input-result"
                            style="position: absolute; top: 81%; left: 20%;">

                        <input type="number" x-model.number="inputValues.graficoverificacion.A89" step="0.001" class="measurement-input"
                            style="position: absolute; top: 86%; left: 20%;">

                        <input type="number" x-model.number="inputValues.graficoverificacion.D88" disabled step="0.001" class="measurement-input-result"
                            style="position: absolute; top: 81%; left: 66%;">

                        <input type="number" x-model.number="inputValues.graficoverificacion.B88" disabled step="0.001" class="measurement-input-result"
                            style="position: absolute; top: 81%; left: 42%;">

                        <input type="number" x-model.number="inputValues.graficoverificacion.B90" disabled step="0.001" class="measurement-input-result"
                            style="position: absolute; top: 92%; left: 42%;">

                        <input type="number" x-model.number="inputValues.graficoverificacion.D89" step="0.001" class="measurement-input"
                            style="position: absolute; top: 86%; left: 66%;">

                        <input type="number" x-model.number="inputValues.graficoverificacion.F86" step="0.001" class="measurement-input"
                            style="position: absolute; top: 70%; left: 96%;">

                        <input type="number" x-model.number="inputValues.graficoverificacion.E86" disabled step="0.001" class="measurement-input-result"
                            style="position: absolute; top: 70%; left: 85%;">
                        
                        <!--parte diente-->
                        <input type="number" x-model.number="inputValues.graficoverificacion.F91" disabled step="0.001" class="measurement-input-result"
                            style="position: absolute; top: 11%; left: 8%;">

                        <input type="number" x-model.number="inputValues.graficoverificacion.G93" disabled step="0.001" class="measurement-input-result"
                            style="position: absolute; top: 20%; left: 25%;">

                        <input type="number" x-model.number="inputValues.graficoverificacion.G94" step="0.001" class="measurement-input"
                            style="position: absolute; top: 25%; left: 25%;">
                        
                        <input type="number" x-model.number="inputValues.graficoverificacion.F95" step="0.001" class="measurement-input"
                            style="position: absolute; top: 33%; left: 10%;">
                    </div>
                </section>

                 <!-- RESULTADOS -->
                <section class="p-4 bg-slate-100 bg-opacity-0 border border-slate-300 rounded shadow-inner mt-2">
                    <h3 class="text-lg font-semibold text-blue-800 mb-3 flex items-center"><i class='fas fa-check-circle mr-2 text-green-600'></i>Resultados</h3>
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
        inputSections: {
            graficoverificacion: [
                {
                    id: 'C92',
                    label: 'UBICACION',
                    symbol: '',
                    type: 'select',
                    options: [
                        { value: '5.25', label: 'EXTREMO INTERIOR' },
                        { value: '2.18', label: 'EN EL CENTRO' },
                        { value: '0.45', label: 'EXTREMO EXTERIOR' },
                    ],
                    unit: '',
                },
                {
                    id: 'C93',
                    label: '¿CONSIDERAR Pp?',
                    symbol: '',
                    type: 'select',
                    options: [
                        { value: 'desde', label: 'DESDE 0.00' },
                        { value: 'DESDECIMEN', label: 'DESDE LA CIMEN' },
                        { value: 'DESDEELKEY', label: 'DESDE ELKEY' },
                        { value: 'CORTADOENLACIM', label: 'CORTADO EN LA CIM' },
                        { value: 'CORTADOENELKEY', label: 'CORTADO EN EL KEY' },
                        { value: 'no', label: 'NO' },
                    ],
                    unit: '',
                },
                {
                    id: 'C94',
                    label: 'La Pa desde',
                    symbol: '',
                    type: 'select',
                    options: [
                        { value: 'solopantalla', label: 'Solo pantalla' },
                        { value: 'Pantallazapata', label: 'Pantalla+zapata' },
                        { value: 'pantallazapatatalud', label: 'Pantalla+zapata+talud' },
                        { value: 'Pantallazapatataludkey', label: 'Pantalla+zapata+talud+key' },
                        { value: 'Pantallazapatakey', label: 'Pantalla+zapata+key' },
                    ],
                    unit: '',
                },
                {
                    id: 'C95',
                    label: '¿CONSIDERAR LA Pav?',
                    symbol: '',
                    type: 'select',
                    options: [
                        { value: 'SI', label: 'SI' },
                        { value: 'NO', label: 'NO' },
                    ],
                    unit: '',
                },
                {
                    id: 'C96',
                    label: '¿CONSIDERAR COHESION?',
                    symbol: '',
                    type: 'select',
                    options: [
                        { value: 'SI', label: 'SI' },
                        { value: 'NO', label: 'NO' },
                    ],
                    unit: '',
                },
            ],
        },

        inputValues: {
            graficoverificacion: {
                //verificaciones
                C92: '2.18',
                C93: 'desde',
                C94: 'pantallazapatatalud',
                C95: 'SI',
                C96: 'SI',
                //grafico calculate
                C74: 0.2,
                E74: 0.64,
                E79: 6.65,
                E86: 0.74,
                F86: 0.75,
                D88: 2.71,
                D89: 3,
                B88: 0.9,
                B90: 5.70,
                A88: 1.73,
                A89: 1.8,
                A82: 0.54,
                A83: 0.7,
                //diente
                F91: 0.9,
                G93: 0.74,
                G94: 1,
                F95: 0.2,
            }
        },

        verfsismo: {
            accesorios: [
                { tipo: 'FSV', cantidad: 0, leq: 0 },
                { tipo: 'FSD', cantidad: 0, leq: 0 },
                { tipo: '1/3B', cantidad: 0, leq: 0 },
                { tipo: 'Qadm', cantidad: 0, leq: 0 },
                { tipo: 'Qadm', cantidad: 0, leq: 0 },
            ],
        },

        resultados: {},

        errors: [],

        lastInputHash: '',

        init() {
            //console.log('Sistema de Muros de Contención inicializado');
            this.predimData = null;
            this.configurarEventos();
            this.sendDatadimensionamiento();
        },

        configurarEventos() {
            document.addEventListener('predimensionamiento-updated', (event) => {
                if (event.detail) {
                    this.predimData = {
                        inputValues: { ...event.detail.inputValues },
                        resultados: { ...event.detail.resultados },
                        errors: [...event.detail.errors]
                    };
                    this.calcularval();
                }
            });
        },

        calcularval() {
            try {
                if (!this.predimData || !this.predimData.inputValues) {
                    this.addError('calculo_general', 'No se han recibido datos de predimensionamiento');
                    this.sendDatadimensionamiento();
                    return;
                }
                const { materiales, geometria, cargas, valpredim } = this.predimData.inputValues;
                const { graficoverificacion } = this.inputValues;
                // Hash para evitar cálculos innecesarios
                const inputHash = JSON.stringify({ materiales, geometria, cargas, valpredim, graficoverificacion });
                // Eliminamos el return para que siempre se envíen los datos
                this.lastInputHash = inputHash;

                // --- Cálculos principales ---
                const D12 = (materiales.B12 * Math.PI) / 180;
                const D20 = (geometria.B20 * Math.PI) / 180;
                const E74 = graficoverificacion.D89 * Math.atan(D20);
                let cosd = Math.cos(D20);
                let cosPhi2 = Math.pow(Math.cos(D12), 2);
                let cosd2 = Math.pow(Math.cos(D20), 2);
                let result1_firstPart = cosd - Math.pow(cosd2 - cosPhi2, 0.5);
                let result1_secondPart = cosd + Math.pow(cosd2 - cosPhi2, 0.5);
                let result2_firstPart = cosd + Math.pow(cosd2 - cosPhi2, 0.5);
                let result2_secondPart = cosd - Math.pow(cosd2 - cosPhi2, 0.5);
                let B98 = cargas.B25 / materiales.B11;
                let B99 = (cosd * result1_firstPart) / result1_secondPart;
                let B100 = (cosd * result2_firstPart) / result2_secondPart;
                let B101 = 1 - Math.sin(parseFloat(D12));
                let E79 = geometria.B21 - graficoverificacion.F86;
                let B112 = (graficoverificacion.C96 === "SI") ? 2 * materiales.B13 * Math.pow(B100, 0.5) : 0;

                // --- Variables intermedias ---
                const O78 = graficoverificacion.G94 + geometria.B19;
                const O79 = graficoverificacion.G94 + graficoverificacion.F86;
                const O80 = graficoverificacion.G94;
                const O81 = O80;
                const O82 = O80;
                const O83 = 0;

                const N78 = B112 * O78;
                const N79 = B112 * O79;
                const N80 = B112 * O80;
                const N81 = B112 * O81;
                const N82 = B112 * O82;
                const N83 = 0;

                const P78 = geometria.B19 - graficoverificacion.F86;
                const P79 = 0;
                const P80 = 0;
                const P81 = 0;
                const P82 = 0;
                const P83 = 0;

                const Q78 = (P78) * B100 * materiales.B11;
                const Q79 = 0;
                const Q80 = 0;
                const Q81 = Q78;
                const Q82 = 0;
                const Q83 = 0;

                const R78 = (geometria.B19) * B100 * materiales.B11;
                const R79 = (graficoverificacion.F86) * B100 * materiales.B11;
                const R80 = 0;
                const R81 = R78;
                const R82 = R78;
                const R83 = 0;

                const S78 = (geometria.B19 + graficoverificacion.G94) * B100 * materiales.B11;
                const S79 = (graficoverificacion.G94 + graficoverificacion.F86) * B100 * materiales.B11;
                const S80 = (graficoverificacion.G94) * B100 * materiales.B11;
                const S81 = S78;
                const S82 = S78;
                const S83 = 0;
                // --- Resultados de tabla ---
                const T78 = (geometria.B19 + graficoverificacion.G94) / 3;
                const T79 = (graficoverificacion.F86 + graficoverificacion.G94) / 3;
                const T80 = graficoverificacion.G94 / 3;
                const T81 = (graficoverificacion.F86 + graficoverificacion.G94) * (S81 + 2 * Q81) / (S81 + Q81) / 3;
                const T82 = (graficoverificacion.G94) * (S82 + 2 * R82) / (S82 + R82) / 3;
                const T83 = 0;

                const M78 = (geometria.B19 + graficoverificacion.G94) * S78 / 2;
                const M79 = (graficoverificacion.F86 + graficoverificacion.G94) * S79 / 2;
                const M80 = graficoverificacion.G94 * S80 / 2;
                const M81 = (Q81 + S81) * (graficoverificacion.G93 + graficoverificacion.F86) / 2;
                const M82 = (R82 + S82) * graficoverificacion.G94 / 2;
                const M83 = 0;

                const cargasTable = {
                    'desde': [M78, N78, O78, P78, Q78, R78, S78, T78],
                    'DESDECIMEN': [M79, N79, O79, P79, Q79, R79, S79, T79],
                    'DESDEELKEY': [M80, N80, O80, P80, Q80, R80, S80, T80],
                    'CORTADOENLACIM': [M81, N81, O81, P81, Q81, R81, S81, T81],
                    'CORTADOENELKEY': [M82, N82, O82, P82, Q82, R82, S82, T82],
                    'no': [M83, N83, O83, P83, Q83, R83, S83, T83]
                };

                //---Pa-----
                //---Altura Activa
                const N86 = graficoverificacion.E79;
                const N87 = graficoverificacion.E79 + graficoverificacion.F86;
                const N88 = graficoverificacion.F86 + graficoverificacion.E79 + graficoverificacion.E74;
                const N89 = graficoverificacion.E74 + graficoverificacion.E79 + graficoverificacion.F86 + graficoverificacion.G94;
                const N90 = graficoverificacion.G94 + graficoverificacion.F86 + graficoverificacion.E79;
                //---Brazo
                const O86 = N86 / 3 + graficoverificacion.F86;
                const O87 = N87 / 3;
                const O88 = N88 / 3;
                const O89 = (N89 / 3 <= graficoverificacion.G94) ? graficoverificacion.G94 - N89 / 3 : N89 / 3 - graficoverificacion.G94;;
                const O90 = (N90 / 3 <= graficoverificacion.G94) ? graficoverificacion.G94 - N90 / 3 : N90 / 3 - graficoverificacion.G94;

                const paTable = {
                    'solopantalla': [N86, O86],
                    'Pantallazapata': [N87, O87],
                    'pantallazapatatalud': [N88, O88],
                    'Pantallazapatataludkey': [N89, O89],
                    'Pantallazapatakey': [N90, O90],
                };
                // Simular valor del select y columna deseada
                function buscarValorDesdeSelect(valorSelect, columnaIndex) {
                    const fila = cargasTable[valorSelect];
                    if (!fila) {
                        console.warn("Valor del select no válido");
                        return null;
                    }

                    // columnaIndex empieza en 1 como en Excel, así que restamos 1 para el array JS
                    const valorBuscado = fila[columnaIndex - 1];
                    //console.log(`Resultado en la columna ${columnaIndex}:`, valorBuscado);
                    return valorBuscado;
                }
                // Simular valor del select y columna deseada
                function buscarValorPaSelect(valorSelect, columnaIndex) {
                    const fila = paTable[valorSelect];
                    if (!fila) {
                        console.warn("Valor del select no válido");
                        return null;
                    }

                    // columnaIndex empieza en 1 como en Excel, así que restamos 1 para el array JS
                    const valorBuscado = fila[columnaIndex - 1];
                    //console.log(`Resultado en la columna ${columnaIndex}:`, valorBuscado);
                    return valorBuscado;
                }

                // Ejemplo de uso C93: "desde"
                const B103 = buscarValorDesdeSelect(graficoverificacion.C93, 2); // accede al tercer valor de la fila de 'DESDE ELKEY'
                const B104 = 0;
                const B105 = buscarValorDesdeSelect(graficoverificacion.C93, 4);
                const B106 = buscarValorDesdeSelect(graficoverificacion.C93, 5);
                const B107 = buscarValorDesdeSelect(graficoverificacion.C93, 6);
                const B108 = buscarValorDesdeSelect(graficoverificacion.C93, 1);
                const B109 = 0;
                const B110 = B108;
                const B113 = buscarValorDesdeSelect(graficoverificacion.C93, 2);
                const B114 = 0;//(graficoverificacion.C96 === "SI") ? B113 * Math.sin(0) : 0;
                const B115 = B113;

                //---- Empuje activo del suelo ----
                const B119 = buscarValorPaSelect(graficoverificacion.C94, 1);
                const B120 = 0;
                const B121 = materiales.B11 * B99 * (B119);
                const B122 = B99 * materiales.B11 * (B119 - graficoverificacion.F86);
                const B123 = B121 * B119 / 2;
                const B124 = (graficoverificacion.C95 === "SI") ? B123 * Math.sin(D20) : 0;
                const B125 = B123 * Math.cos(D20);

                const B127 = (graficoverificacion.C96 === "SI") ? 2 * materiales.B13 * Math.pow(B99, 0.5) : 0;
                const B128 = B127 * B119 / 2;
                const B129 = (graficoverificacion.C95 === "SI") ? B128 * Math.sin(D20) : 0;
                const B130 = -B128 * Math.cos(D20);

                //---- Empuje de sobrecarga
                const B133 = cargas.B25 * B99;
                const B134 = B133;
                const B135 = B134;
                const B136 = B134 * B119;
                const B137 = (graficoverificacion.C95 === "SI") ? B136 * Math.sin(D20) : 0;;
                const B138 = B136 * Math.cos(D20);

                //----- 2. CARGAS SISMICOS
                const C144 = cargas.B29 / 2//cargas.B29 * zonas;
                const C145 = cargas.B29 * C144;
                //------ table
                // Valor simulado de la celda C147 grados:> valor * (180 / Math.PI), radianes:>valor * (Math.PI / 180)
                const C147 = Math.tan(C144 / (1 - C145));
                const B147 = C147 * (180 / Math.PI);
                const B148 = materiales.B12;
                const B149 = 0;
                const B150 = 0;
                const B151 = geometria.B20;
                //const C147 = Math.tan(C144 / (1 - C145));
                const C148 = (B148) * (Math.PI / 180);
                const C149 = (B149) * (Math.PI / 180);
                const C150 = (B150) * (Math.PI / 180);
                const C151 = 0;
                const C152 = 0;

                const U157 = Math.sin(C150 + C148);
                const U158 = Math.sin(C148 - C147 - C151);
                const U159 = Math.cos(C150 + C149 + C147);
                const U160 = Math.cos(C151 - C149);
                const U161 = Math.pow(U157 * U158 / (U159 * U160), 0.5);
                const B152 = Math.pow(1 + U161, 2);

                const T157 = Math.cos(C148 - C147 - C149);
                const T158 = Math.cos(C147) * Math.cos(C149) * Math.cos(C149) * Math.cos(C149 + C150 + C147);

                //--- --------------------- -- -- -- -- -- --
                const C153 = T157 * T157 / (B152 * T158);
                const B154 = materiales.B11;
                const B155 = graficoverificacion.E79;
                const B156 = C145;
                const C157 = 0.5 * B154 * (1 - B156) * C153 * B155 * B155;
                const B158 = B99;
                const C159 = 0.5 * B154 * B158 * B155 * B155;
                const C160 = C157 - C159;
                const C162 = (B155 / 3 * C159 + B155 * 0.6 * C160) / C157;
                const C163 = C160 * C162;

                const E172 = buscarValorPaSelect(graficoverificacion.C94, 2);
                const E175 = (buscarValorDesdeSelect(graficoverificacion.C93, 2)) / 3;
                // --- Captura de todos los valores relevantes ---
                //  const { materiales, geometria, cargas, valpredim } = this.predimData.inputValues;
                // const { graficoverificacion } = this.inputValues;
                this.resultados = {
                    materiales, geometria, cargas, valpredim, graficoverificacion,
                    E74: E74,
                    B98, B99, B100, B101, B112, E79,
                    O78, O79, O80, O81, O82, O83,
                    N78, N79, N80, N81, N82, N83,
                    P78, Q78, Q81, R78, R79, R81, R82,
                    S78, S79, S80, S81, S82,
                    T78, T79, T80, T81, T82,
                    //Empuje pasivo del suelo
                    B103, B104, B105, B106, B107, B108, B109, B110, B113, B114, B115,
                    //Empuje activo del suelo
                    B119, B120, B121, B122, B123, B124, B125, B127, B128, B129, B130,
                    //Empuje de sobrecarga
                    B133, B134, B135, B136, B137, B138,
                    //carga sismica
                    C144, C145, C147, B147, B148, B149, B150, B151, C148, C149, C150, C151, C152,
                    U157, U158, U159, U160, U161, B152, T157, T158,
                    C153, B154, B155, B156, C157, B158, C159, C160, C162, C163, E172, E175,
                };
                this.clearErrors();
                this.sendDatadimensionamiento();
            } catch (error) {
                this.addError('calculo_general', 'Error en el cálculo: ' + error.message);
                this.sendDatadimensionamiento();
            }
        },

        handleInputChange(section, id, value) {
            this.inputValues[section][id] = value;
            this.calcularval();
        },

        validateInput(section, id, inputConfig) {
            const value = this.inputValues[section][id];
            if (inputConfig.type === 'number' && (isNaN(value) || value === '')) {
                this.addError(`${section}_${id}`, `${inputConfig.label} debe ser un número válido`);
                return false;
            }
            if (inputConfig.type === 'number' && value < 0) {
                this.addError(`${section}_${id}`, `${inputConfig.label} no puede ser negativo`);
                return false;
            }
            this.removeError(`${section}_${id}`);
            return true;
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
                inputValues: { ...this.inputValues },
                resultados: { ...this.resultados },
                errors: [...this.errors]
            };
            //console.log(data)
            document.dispatchEvent(new CustomEvent('dimensionamiento-updated', { detail: data }));
        },

        toggleMode() {
            this.mode = this.mode === 'edit' ? 'view' : 'edit';
        },

        formatValue(value) {
            if (value === null || value === undefined || value === '') return '-';
            return typeof value === 'number' ? value.toFixed(2) : value;
        },

        formatDisplayValue(value, type) {
            if (type === 'checkbox') {
                return value ? '✓ Activo' : '✗ Inactivo';
            }
            return this.formatValue(value);
        },

        get hasErrors() {
            return this.errors.length > 0;
        }
    }));
}

document.addEventListener('DOMContentLoaded', initdimensionamientoModule);

