function initPredimensionamientoModule() {
    const predimensionamiento = document.getElementById('predimensionamiento-content');
    if (!predimensionamiento) {
        console.error('Contenedor Predimensionamiento no encontrado');
        return;
    }

    predimensionamiento.innerHTML = `
        <div x-data="predimensionamientoModule()" class="cuaderno p-4 max-w-full mx-auto font-mono">
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
                <!-- DATOS: Materiales -->
                <section class="p-4 bg-slate-50 bg-opacity-0 border border-slate-300 rounded shadow-inner col-span-1">
                    <div class="flex items-center justify-between cursor-pointer select-none mb-2" @click="showMateriales = !showMateriales">
                        <h3 class="text-lg font-semibold text-blue-800 flex items-center"><i class='fas fa-flask mr-2 text-yellow-500'></i>Materiales</h3>
                        <span class="text-xs text-gray-500" x-text="showMateriales ? 'Ocultar' : 'Mostrar'"></span>
                    </div>
                    <div class="space-y-4" x-show="showMateriales">
                        <template x-for="input in inputSections.materiales" :key="input.id">
                            <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                                <span class="w-1/4 text-gray-700" x-text="input.label"></span>
                                <span class="w-1/6 text-gray-500" x-text="input.symbol"></span>
                                <template x-if="mode === 'edit'">
                                    <div class="w-1/4">
                                        <input 
                                            :type="input.type || 'number'"
                                            class="input-field w-full text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                                            :placeholder="input.placeholder || ''"
                                            x-model.number="inputValues.materiales[input.id]"
                                            @input="handleInputChange('materiales', input.id, $event.target.value)"
                                            @blur="validateInput('materiales', input.id, input)">
                                    </div>
                                </template>
                                <template x-if="mode === 'view'">
                                    <span class="w-1/4 text-gray-800 text-base font-medium" x-text="formatValue(inputValues.materiales[input.id])"></span>
                                </template>
                                <span class="w-1/6 text-gray-500" x-text="input.unit"></span>
                            </div>
                        </template>
                    </div>

                    <div class="flex items-center justify-between cursor-pointer select-none mt-4 mb-2" @click="showGeometria = !showGeometria">
                        <h3 class="text-lg font-semibold text-blue-800 flex items-center"><i class='fas fa-ruler-combined mr-2 text-blue-500'></i>Geometría</h3>
                        <span class="text-xs text-gray-500" x-text="showGeometria ? 'Ocultar' : 'Mostrar'"></span>
                    </div>
                    <div class="space-y-4" x-show="showGeometria">
                        <template x-for="input in inputSections.geometria" :key="input.id">
                            <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                                <span class="w-1/4 text-gray-700" x-text="input.label"></span>
                                <span class="w-1/6 text-gray-500" x-text="input.symbol"></span>
                                <template x-if="mode === 'edit'">
                                    <div class="w-1/4">
                                        <input 
                                            :type="input.type || 'number'"
                                            class="input-field w-full text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                                            :placeholder="input.placeholder || ''"
                                            x-model.number="inputValues.geometria[input.id]"
                                            @input="handleInputChange('geometria', input.id, $event.target.value)"
                                            @blur="validateInput('geometria', input.id, input)">
                                    </div>
                                </template>
                                <template x-if="mode === 'view'">
                                    <span class="w-1/4 text-gray-800 text-base font-medium" x-text="formatValue(inputValues.geometria[input.id])"></span>
                                </template>
                                <span class="w-1/6 text-gray-500" x-text="input.unit"></span>
                            </div>
                        </template>
                    </div>

                    <div class="flex items-center justify-between cursor-pointer select-none mt-4 mb-2" @click="showCargas = !showCargas">
                        <h3 class="text-lg font-semibold text-blue-800 flex items-center"><i class='fas fa-weight-hanging mr-2 text-red-500'></i>Cargas</h3>
                        <span class="text-xs text-gray-500" x-text="showCargas ? 'Ocultar' : 'Mostrar'"></span>
                    </div>
                    <div class="space-y-4" x-show="showCargas">
                        <template x-for="input in inputSections.cargas" :key="input.id">
                            <div class="flex text-xs px-6 items-center space-x-2 mb-2">
                                <label class="w-1/4 text-gray-700 font-medium text-sm" x-text="input.label"></label>
                                <span class="w-1/6 text-gray-500 text-sm" x-text="input.symbol"></span>
                                
                                <template x-if="mode === 'edit'">
                                    <div class="w-1/4">
                                        <!-- Select Input -->
                                        <template x-if="input.type === 'select'">
                                            <select 
                                                class="input-field w-full text-sm px-2 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                x-model="inputValues.cargas[input.id]"
                                                @change="handleInputChange('cargas', input.id, $event.target.value)">
                                                <option value="" disabled>Seleccione...</option>
                                                <template x-for="opt in input.options" :key="opt.value || opt">
                                                    <option :value="opt.value || opt" x-text="opt.label || opt"></option>
                                                </template>
                                            </select>
                                        </template>

                                        <!-- Checkbox Input -->
                                        <template x-if="input.type === 'checkbox'">
                                            <div class="flex items-center">
                                                <input 
                                                    type="checkbox"
                                                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    x-model="inputValues.cargas[input.id]"
                                                    @change="handleInputChange('cargas', input.id, $event.target.checked)">
                                                <span class="ml-2 text-xs text-gray-600">Activar</span>
                                            </div>
                                        </template>

                                        <!-- Text/Number Input -->
                                        <template x-if="input.type === 'text' || input.type === 'number'">
                                            <input 
                                                :type="input.type"
                                                class="input-field w-full text-xs px-2 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                :placeholder="input.placeholder || ''"
                                                x-model="inputValues.cargas[input.id]"
                                                @input="handleInputChange('cargas', input.id, $event.target.value)"
                                                @blur="validateInput('cargas', input.id, input)">
                                        </template>
                                    </div>
                                </template>

                                <template x-if="mode === 'view'">
                                    <span class="w-1/4 text-gray-800 text-sm font-medium" 
                                        x-text="formatDisplayValue(inputValues.cargas[input.id], input.type)">
                                    </span>
                                </template>

                                <span class="w-1/6 text-gray-500 text-sm" x-text="input.unit || ''"></span>
                            </div>
                        </template>
                    </div>

                    <div class="flex items-center justify-between cursor-pointer select-none mt-4 mb-2" @click="showCombinacion = !showCombinacion">
                        <h3 class="text-lg font-semibold text-blue-800 flex items-center"><i class='fas fa-layer-group mr-2 text-green-500'></i>Combinación de Cargas</h3>
                        <span class="text-xs text-gray-500" x-text="showCombinacion ? 'Ocultar' : 'Mostrar'"></span>
                    </div>
                    <div class="space-y-4" x-show="showCombinacion">
                        <template x-for="input in inputSections.combinacioncargas" :key="input.id">
                            <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                                <span class="w-1/4 text-gray-700" x-text="input.label"></span>
                                <span class="w-1/6 text-gray-500" x-text="input.symbol"></span>
                                <template x-if="mode === 'edit'">
                                    <div class="w-1/4">
                                        <template x-if="input.type === 'checkbox'">
                                            <div class="flex items-center">
                                                <input 
                                                    type="checkbox"
                                                    class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                    x-model="inputValues.combinacioncargas[input.id]"
                                                    @change="handleInputChange('combinacioncargas', input.id, $event.target.checked)">
                                                <span class="ml-2 text-xs text-gray-600">Activar</span>
                                            </div>
                                        </template>
                                        <template x-if="input.type !== 'checkbox'">
                                            <input 
                                                :type="input.type || 'number'"
                                                class="input-field w-full text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                                                :placeholder="input.placeholder || ''"
                                                x-model.number="inputValues.combinacioncargas[input.id]"
                                                @input="handleInputChange('combinacioncargas', input.id, $event.target.value)"
                                                @blur="validateInput('combinacioncargas', input.id, input)">
                                        </template>
                                    </div>
                                </template>
                                <template x-if="mode === 'view'">
                                    <span class="w-1/4 text-gray-800 text-base font-medium" 
                                        x-text="formatDisplayValue(inputValues.combinacioncargas[input.id], input.type)">
                                    </span>
                                </template>
                                <span class="w-1/6 text-gray-500" x-text="input.unit"></span>
                            </div>
                        </template>
                    </div>

                    <div class="flex items-center justify-between cursor-pointer select-none mt-4 mb-2" @click="showValPredim = !showValPredim">
                        <h3 class="text-base font-semibold text-blue-800 flex items-center"><i class='fas fa-calculator mr-2 text-purple-500'></i>Valores de Predimensionamiento</h3>
                        <span class="text-xs text-gray-500" x-text="showValPredim ? 'Ocultar' : 'Mostrar'"></span>
                    </div>
                    <div class="space-y-4" x-show="showValPredim">
                        <template x-for="input in inputSections.valpredim" :key="input.id">
                            <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                                <span class="w-1/4 text-gray-700" x-text="input.label"></span>
                                <span class="w-1/6 text-gray-500" x-text="input.symbol"></span>
                                <template x-if="mode === 'edit'">
                                    <div class="w-1/4">
                                        <input 
                                            :type="input.type || 'number'"
                                            class="input-field w-full text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
                                            :placeholder="input.placeholder || ''"
                                            x-model.number="inputValues.valpredim[input.id]"
                                            @input="handleInputChange('valpredim', input.id, $event.target.value)"
                                            @blur="validateInput('valpredim', input.id, input)">
                                    </div>
                                </template>
                                <template x-if="mode === 'view'">
                                    <span class="w-1/4 text-gray-800 text-base font-medium" x-text="formatValue(inputValues.valpredim[input.id])"></span>
                                </template>
                                <span class="w-1/6 text-gray-500" x-text="input.unit"></span>
                            </div>
                        </template>
                    </div>
                    <button class="bg-gray-800 text-gray-50" id="calcular" @click="calcular()">Calcular</button>
                </section>

                <!-- PREDIMENSIONAMIENTO: GRAFICO AMPLIADO -->
                <section class="row-span-2 md:col-span-2 p-8 bg-slate-50 bg-opacity-0 border border-slate-300 rounded shadow-inner flex flex-col items-center justify-center">
                    <h3 class="text-lg font-semibold text-blue-800 mb-3 flex items-center"><i class='fas fa-chart-bar mr-2 text-blue-400'></i>Gráfico</h3>
                    <div id="predimsMC"></div>
                </section>

                <!-- RESULTADOS -->
                <section class="p-4 bg-slate-100 bg-opacity-0 border border-slate-300 rounded shadow-inner mt-2">
                    <h3 class="text-lg font-semibold text-blue-800 mb-3 flex items-center"><i class='fas fa-check-circle mr-2 text-green-600'></i>Resultados Geométricos</h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <template x-for="(value, key) in resultados" :key="key">
                            <div class="bg-white p-3 rounded-lg border border-gray-200">
                                <label class="block text-xs text-gray-500 uppercase font-semibold" x-text="key.replaceAll('_', ' ')"></label>
                                <p class="text-gray-900 font-semibold text-lg" x-text="formatValue(value) + ' m'"></p>
                            </div>
                        </template>
                    </div>
                </section>
            </div>
        </div>
    `;

    Alpine.data('predimensionamientoModule', () => ({
        mode: 'edit',
        showMateriales: true,
        showGeometria: false,
        showCargas: false,
        showCombinacion: false,
        showValPredim: false,
        isCalculating: false,
        chartInitialized: false,

        inputSections: {
            materiales: [
                { id: 'B6', label: 'Peso Específico Concreto', symbol: 'γc', type: 'number', placeholder: 'Ej: 2.4', unit: 'Tn/m³', decimals: 2, min: 0, max: 5 },
                { id: 'B7', label: 'Resistencia Concreto', symbol: "f'c", type: 'number', placeholder: 'Ej: 210', unit: 'kg/cm²', decimals: 0, min: 0, max: 1000 },
                { id: 'B8', label: 'Resistencia Acero', symbol: 'fy', type: 'number', placeholder: 'Ej: 4200', unit: 'kg/cm²', decimals: 0, min: 0, max: 10000 },
                { id: 'B10', label: 'Capacidad Portante', symbol: 'σADM', type: 'number', placeholder: 'Ej: 20.0', unit: 'Tn/m²', decimals: 2, min: 0, max: 100 },
                { id: 'B11', label: 'Peso Específico Suelo', symbol: 'γs', type: 'number', placeholder: 'Ej: 1.83', unit: 'Tn/m³', decimals: 2, min: 0, max: 5 },
                { id: 'B12', label: 'Ángulo de Fricción', symbol: 'φ', type: 'number', placeholder: 'Ej: 26.90', unit: '°', decimals: 2, min: 0, max: 90 },
                { id: 'B13', label: 'Cohesión', symbol: 'z', type: 'number', placeholder: 'Ej: 0.05', unit: 'Tn/m²', decimals: 3, min: 0, max: 10 },
                { id: 'B14', label: 'Coeficiente de Poisson', symbol: 'u', type: 'number', placeholder: 'Ej: 0.51', unit: '-', decimals: 3, min: 0, max: 0.5 },
            ],
            geometria: [
                { id: 'B18', label: 'Altura Muro', symbol: 'H', type: 'number', placeholder: 'Ej: 6.40', unit: 'm', decimals: 2, min: 0, max: 50 },
                { id: 'B19', label: 'Profundidad Cimentación', symbol: 'df', type: 'number', placeholder: 'Ej: 1.0', unit: 'm', decimals: 2, min: 0, max: 10 },
                { id: 'B20', label: 'Inclinación Terreno', symbol: 'β', type: 'number', placeholder: 'Ej: 12', unit: '°', decimals: 2, min: 0, max: 90 }
                // Ht eliminado de inputs, será calculado
            ],
            cargas: [
                {
                    id: 'B24',
                    label: 'Teoría Empuje Activo',
                    symbol: 'Ka',
                    type: 'select',
                    options: [
                        { value: 'rankine', label: 'Rankine' },
                        { value: 'coulomb', label: 'Coulomb' },
                        { value: 'terzagui', label: 'Terzagui' }
                    ],
                    unit: ''
                },
                { id: 'B25', label: 'Sobrecarga', symbol: 'q', type: 'number', placeholder: 'Ej: 0.4', unit: 'Tn/m²', decimals: 2, min: 0, max: 50 },
                {
                    id: 'B26',
                    label: 'Tipo Presión',
                    symbol: '',
                    type: 'select',
                    options: [
                        { value: 'rankine', label: 'Rankine' },
                        { value: 'coulomb', label: 'Coulomb' },
                        { value: 'terzagui', label: 'Terzagui' }
                    ],
                    unit: ''
                },
                {
                    id: 'B27',
                    label: 'Presión Sísmica',
                    symbol: '',
                    type: 'select',
                    options: [
                        { value: 'mononobe', label: 'Mononobe-Okabe' },
                        { value: 'wilsons', label: 'Wilson' },
                        { value: 'basico', label: 'Método Básico' }
                    ],
                    unit: ''
                },
                {
                    id: 'B29',
                    label: 'Zona Sísmica',
                    symbol: 'Z',
                    type: 'select',
                    options: [
                        { value: 0.4, label: 'Zona 1 (Z=0.4)' },
                        { value: 0.3, label: 'Zona 2 (Z=0.3)' },
                        { value: 0.15, label: 'Zona 3 (Z=0.15)' }
                    ],
                    unit: ''
                },
                {
                    id: 'B30',
                    label: 'Factor Kv',
                    symbol: 'Kv',
                    type: 'select',
                    options: [
                        { value: 0.3, label: '0.3Kh' },
                        { value: 0.35, label: '0.35Kh' },
                        { value: 0.4, label: '0.4Kh' },
                        { value: 0.45, label: '0.45Kh' },
                        { value: 0.5, label: '0.5Kh' }
                    ],
                    unit: ''
                }
            ],
            combinacioncargas: [
                { id: 'D35', label: 'D+L+H', symbol: '', type: 'checkbox', unit: '' },
                { id: 'D36', label: 'D+H+0.70E', symbol: '', type: 'checkbox', unit: '' },
                { id: 'D37', label: '0.75D+0.75L+0.525E+0.6H', symbol: '', type: 'checkbox', unit: '' },
                { id: 'D39', label: '1.4D+1.7L', symbol: '', type: 'checkbox', unit: '' },
                { id: 'D40', label: '1.25D+1.25H+1.25L+E', symbol: '', type: 'checkbox', unit: '' },
                { id: 'D41', label: '0.9D+0.9H+E', symbol: '', type: 'checkbox', unit: '' },
                { id: 'D42', label: '1.4D+1.7L+1.7H', symbol: '', type: 'checkbox', unit: '' },
                { id: 'D43', label: '0.9D+1.7H', symbol: '', type: 'checkbox', unit: '' },
            ],
            valpredim: [
                { id: 'D45', label: 'Ancho Corona', symbol: 'ac', type: 'number', placeholder: 'Ej: 0.2', unit: 'm', decimals: 2, min: 0, max: 5 },
                { id: 'D47', label: 'Factor Base Pantalla', symbol: 'k1', type: 'number', placeholder: 'Ej: 10', unit: '-', decimals: 0, min: 1, max: 50 },
                { id: 'D49', label: 'Factor Peralte Zapata', symbol: 'k2', type: 'number', placeholder: 'Ej: 10', unit: '-', decimals: 0, min: 1, max: 50 },
                { id: 'D51', label: 'Factor Ancho Zapata', symbol: 'k3', type: 'number', placeholder: 'Ej: 0.7', unit: '-', decimals: 2, min: 0.1, max: 2 },
                { id: 'D53', label: 'Factor Altura Key', symbol: 'k4', type: 'number', placeholder: 'Ej: 10', unit: '-', decimals: 0, min: 1, max: 50 }
            ]
        },

        inputValues: {
            materiales: {
                B6: 2.4, B7: 210, B8: 4200, B10: 20.0, B11: 1.83, B12: 26.90, B13: 0.05, B14: 0.51
            },
            geometria: {
                B18: 6.40, B19: 1.0, B20: 12
            },
            cargas: {
                B24: 'rankine', B25: 0.4, B26: 'rankine', B27: 'mononobe', B29: 0.4, B30: 0.3
            },
            combinacioncargas: {
                D35: false, D36: false, D37: false, D39: false, D40: false, D41: false, D42: false, D43: false
            },
            valpredim: {
                D45: 0.2, D47: 10, D49: 10, D51: 0.7, D53: 10
            }
        },

        resultados: {
            // D12: 0, D20: 0, peso_total_suelo: 0, ka_rankine: 0, presion_activa: 0,
            // empuje_activo: 0, momento_volcamiento: 0, 
            ancho_corona: 0, espesor_base_pantalla: 0,peralte_zapata: 0, ancho_zapata: 0, altura_key: 0, Ht: 0
        },

        resultadosConfig: {
            ancho_corona: { label: 'Ancho Corona', unit: 'm', decimals: 2 },
            espesor_base_pantalla: { label: 'Espesor Base Pantalla', unit: 'm', decimals: 3 },
            peralte_zapata: { label: 'Peralte Zapata', unit: 'm', decimals: 3 },
            ancho_zapata: { label: 'Ancho Zapata', unit: 'm', decimals: 2 },
            altura_key: { label: 'Altura Key', unit: 'm', decimals: 3 },
            Ht: { label: 'Altura Total', unit: 'm', decimals: 2 }
        },

        errors: [],
        svg: null,
        margin: null,
        width: null,
        height: null,
        x: null,
        y: null,
        xAxis: null,
        yAxis: null,
        path: null,

        init() {
            this.calcularDefault();
            this.graficopredimensionamiento();
            this.sendDataPredim();
        },

        calcularDefault() {
            this.isCalculating = true;
            try {
                this.calcularDimensiones();
                this.calcularPresiones();
                this.calcularEmpujes();
                this.clearErrors();
            } catch (error) {
                this.addError('calculo_general', 'Error en el cálculo: ' + error.message);
                console.error('Error en cálculo:', error);
            } finally {
                this.isCalculating = false;
            }
        },

        calcular() {
            if (this.isCalculating) return;

            this.isCalculating = true;

            // Simular tiempo de cálculo
            setTimeout(() => {
                this.calcularDefault();
                this.graficopredimensionamiento();
                this.sendDataPredim();
            }, 500);
        },

        calcularDimensiones() {
            const { materiales, geometria, valpredim } = this.inputValues;

            // Conversiones de ángulos a radianes
            const D12 = (materiales.B12 * Math.PI) / 180;
            const D20 = (geometria.B20 * Math.PI) / 180;

            // Calcular Ht automáticamente
            const H = this.validateNumber(geometria.B18, 6.4);
            const df = this.validateNumber(geometria.B19, 1.0);
            const Ht = H + df;
            this.inputValues.geometria.B21 = Ht;

            // Dimensiones basadas en factores de predimensionamiento
            const ancho_corona = this.validateNumber(valpredim.D45, 0.2);
            const espesor_base_pantalla = H / this.validateNumber(valpredim.D47, 10);
            const peralte_zapata = H / this.validateNumber(valpredim.D49, 10);
            const ancho_zapata = H * this.validateNumber(valpredim.D51, 0.7);
            const altura_key = H / this.validateNumber(valpredim.D53, 10);

            // Actualizar resultados
            this.resultados = {
                // ...this.resultados,
                // D12: D12,
                // D20: D20,
                ancho_corona: ancho_corona,
                espesor_base_pantalla: espesor_base_pantalla,
                peralte_zapata: peralte_zapata,
                ancho_zapata: ancho_zapata,
                altura_key: altura_key,
                Ht: Ht // Guardar Ht en resultados
            };
        },

        calcularPresiones() {
            const { materiales, geometria, cargas } = this.inputValues;

            // Coeficiente de presión activa de Rankine
            const phi_rad = (materiales.B12 * Math.PI) / 180;
            const ka_rankine = Math.tan(Math.PI / 4 - phi_rad / 2) ** 2;

            // Presión activa
            const H = this.validateNumber(geometria.B18, 6.4);
            const gamma_s = this.validateNumber(materiales.B11, 1.83);
            const q = this.validateNumber(cargas.B25, 0.4);

            const presion_activa = (gamma_s * H + q) * ka_rankine;

            this.resultados = {
                ...this.resultados,
                //ka_rankine: ka_rankine,
                //presion_activa: presion_activa
            };
        },

        calcularEmpujes() {
            const { geometria } = this.inputValues;
            const H = this.validateNumber(geometria.B18, 6.4);

            // Empuje activo total
            const empuje_activo = this.resultados.presion_activa * H / 2;

            // Momento de volcamiento
            const momento_volcamiento = empuje_activo * H / 3;

            this.resultados = {
                ...this.resultados,
                //empuje_activo: empuje_activo,
                //momento_volcamiento: momento_volcamiento
            };
        },

        validateNumber(value, defaultValue = 0) {
            const num = parseFloat(value);
            return isNaN(num) ? defaultValue : num;
        },

        calculopuntosmuros(H, e = 10) {
            const H_val = this.validateNumber(H, 6.4);
            const points = [
                { x: 0, y: 0 },
                { x: 0.7 * H_val, y: 0 },
                { x: 0.7 * H_val, y: H_val / 10 },
                { x: (0.7 * H_val / 3) + H_val / 10, y: H_val / 10 },
                { x: (0.7 * H_val / 3) + H_val / 10, y: (H_val / 10) + H_val },
                { x: (0.7 * H_val / 3) + H_val / 10 - 0.3, y: (H_val / 10) + H_val },
                { x: (0.7 * H_val) / 3, y: H_val / 10 },
                { x: 0, y: H_val / 10 },
                { x: 0, y: 0 }
            ];
            return [points];
        },

        graficopredimensionamiento() {
            const margin = { top: 20, right: 20, bottom: 30, left: 40 };
            const width = 600 - margin.left - margin.right;
            const height = 600 - margin.top - margin.bottom;

            this.margin = margin;
            this.width = width;
            this.height = height;
            this.x = d3.scaleLinear().range([0, width]);
            this.y = d3.scaleLinear().range([height, 0]);

            if (!this.svg) {
                this.createChart();
            }
            this.updateChart();
        },

        createChart() {
            const container = d3.select("#predimsMC");
            if (!container.node()) {
                this.addError('chart_error', 'Container #predimsMC not found in DOM');
                return;
            }

            // Limpiar contenido previo
            container.selectAll("*").remove();

            this.svg = container
                .append("svg")
                .attr("width", this.width + this.margin.left + this.margin.right)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
                .append("g")
                .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

            this.xAxis = this.svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0,${this.height})`)
                .style("font-size", "12px");

            this.yAxis = this.svg.append("g")
                .attr("class", "y-axis")
                .style("font-size", "12px");

            this.path = this.svg.append("path")
                .attr("fill", "rgba(70, 130, 180, 0.3)")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2);

            this.chartInitialized = true;
        },

        updateChart() {
            if (!this.svg) return;

            try {
                const { geometria } = this.inputValues;
                const H = this.validateNumber(geometria.B21, 7.4);

                const dataPredims = this.calculopuntosmuros(H);
                const data = dataPredims[0];

                // Calcular el máximo de x y y para escalar igual ambos ejes
                const maxX = d3.max(data, d => d.x);
                const maxY = d3.max(data, d => d.y);
                const maxVal = Math.max(maxX, maxY) * 1.1;

                // Configurar escalas 1:1
                this.x.domain([0, maxVal]);
                this.y.domain([0, maxVal]);

                // Actualizar ejes
                this.xAxis
                    .transition()
                    .duration(500)
                    .call(d3.axisBottom(this.x).tickFormat(d => d.toFixed(1) + "m"));

                this.yAxis
                    .transition()
                    .duration(500)
                    .call(d3.axisLeft(this.y).tickFormat(d => d.toFixed(1) + "m"));

                // Crear línea
                const line = d3.line()
                    .x(d => this.x(d.x))
                    .y(d => this.y(d.y))
                    .curve(d3.curveLinear);

                // Actualizar path
                this.path
                    .datum(data)
                    .transition()
                    .duration(500)
                    .attr("d", line);

                // Actualizar puntos
                const points = this.svg.selectAll(".point")
                    .data(data);

                points.enter()
                    .append("circle")
                    .attr("class", "point")
                    .attr("r", 0)
                    .attr("fill", "steelblue")
                    .attr("stroke", "white")
                    .attr("stroke-width", 2)
                    .transition()
                    .duration(500)
                    .attr("r", 4);

                points
                    .transition()
                    .duration(500)
                    .attr("cx", d => this.x(d.x))
                    .attr("cy", d => this.y(d.y));

                points.exit()
                    .transition()
                    .duration(300)
                    .attr("r", 0)
                    .remove();

                // Agregar etiquetas de dimensiones
                this.svg.selectAll(".dimension-label").remove();

                const labels = this.svg.selectAll(".dimension-label")
                    .data([
                        { x: this.x(0.7 * H / 2), y: this.y(-0.3), text: `${(0.7 * H).toFixed(2)}m` },
                        { x: this.x(-0.5), y: this.y(H / 2), text: `${H.toFixed(2)}m` }
                    ]);

                labels.enter()
                    .append("text")
                    .attr("class", "dimension-label")
                    .attr("text-anchor", "middle")
                    .attr("font-size", "10px")
                    .attr("fill", "#666")
                    .attr("x", d => d.x)
                    .attr("y", d => d.y)
                    .text(d => d.text);

            } catch (error) {
                this.addError('chart_error', `Error en el gráfico: ${error.message}`);
                console.error('Error en gráfico:', error);
            }
        },

        handleInputChange(section, id, value) {
            const inputConfig = this.inputSections[section].find(input => input.id === id);
            if (!inputConfig) return;

            // Procesar valor según tipo
            let processedValue = value;
            if (inputConfig.type === 'number') {
                processedValue = parseFloat(value);
                if (isNaN(processedValue)) processedValue = 0;
            } else if (inputConfig.type === 'checkbox') {
                processedValue = Boolean(value);
            } else if (inputConfig.type === 'select') {
                // Para selects numéricos, convertir a número
                if (inputConfig.options && inputConfig.options[0] && typeof inputConfig.options[0].value === 'number') {
                    processedValue = parseFloat(value);
                }
            }

            this.inputValues[section][id] = processedValue;

            if (this.validateInput(section, id, inputConfig)) {
                this.calcularDefault();
                this.graficopredimensionamiento();
                this.sendDataPredim();
            }
        },

        validateInput(section, id, inputConfig) {
            const value = this.inputValues[section][id];
            const errorId = `${section}_${id}`;

            if (inputConfig.type === 'number') {
                if (isNaN(value) || value === '') {
                    this.addError(errorId, `${inputConfig.label} debe ser un número válido`);
                    return false;
                }

                if (inputConfig.min !== undefined && value < inputConfig.min) {
                    this.addError(errorId, `${inputConfig.label} debe ser mayor o igual a ${inputConfig.min}`);
                    return false;
                }

                if (inputConfig.max !== undefined && value > inputConfig.max) {
                    this.addError(errorId, `${inputConfig.label} debe ser menor o igual a ${inputConfig.max}`);
                    return false;
                }
            }

            if (inputConfig.type === 'select' && (!value || value === '')) {
                this.addError(errorId, `${inputConfig.label} debe ser seleccionado`);
                return false;
            }

            this.removeError(errorId);
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

        sendDataPredim() {
            const data = {
                inputValues: JSON.parse(JSON.stringify(this.inputValues)),
                resultados: JSON.parse(JSON.stringify(this.resultados)),
                errors: [...this.errors],
                isCalculated: true
            };

            try {
                document.dispatchEvent(new CustomEvent('predimensionamiento-updated', {
                    detail: data,
                    bubbles: true
                }));
            } catch (error) {
                console.error('Error enviando datos:', error);
            }
        },

        resetValues() {
            this.inputValues = {
                materiales: {
                    B6: 2.4, B7: 210, B8: 4200, B10: 20.0, B11: 1.83, B12: 26.90, B13: 0.05, B14: 0.51
                },
                geometria: {
                    B18: 6.40, B19: 1.0, B20: 12
                },
                cargas: {
                    B24: 'rankine', B25: 0.4, B26: 'rankine', B27: 'mononobe', B29: 0.4, B30: 0.3
                },
                combinacioncargas: {
                    D35: false, D36: false, D37: false, D39: false, D40: false, D41: false, D42: false, D43: false
                },
                valpredim: {
                    D45: 0.2, D47: 10, D49: 10, D51: 0.7, D53: 10
                }
            };

            this.clearErrors();
            this.calcularDefault();
            this.graficopredimensionamiento();
            this.sendDataPredim();
        },

        toggleMode() {
            this.mode = this.mode === 'edit' ? 'view' : 'edit';
        },

        getInputStep(id) {
            const allInputs = [
                ...this.inputSections.materiales,
                ...this.inputSections.geometria,
                ...this.inputSections.cargas,
                ...this.inputSections.valpredim
            ];

            const input = allInputs.find(inp => inp.id === id);
            if (!input || input.type !== 'number') return 'any';

            return input.decimals === 0 ? '1' : `0.${'0'.repeat(input.decimals - 1)}1`;
        },

        formatValue(value, decimals = 2) {
            if (value === null || value === undefined || value === '') return '-';
            if (typeof value !== 'number') return value;

            return decimals === 0 ? Math.round(value).toString() : value.toFixed(decimals);
        },

        formatDisplayValue(value, type, decimals = 2) {
            if (type === 'checkbox') {
                return value ? '✓ Activo' : '✗ Inactivo';
            }
            if (type === 'select') {
                const allInputs = [
                    ...this.inputSections.materiales,
                    ...this.inputSections.geometria,
                    ...this.inputSections.cargas,
                    ...this.inputSections.valpredim
                ];

                // Buscar el input y la opción correspondiente
                for (const input of allInputs) {
                    if (input.options) {
                        const option = input.options.find(opt =>
                            (opt.value || opt) === value
                        );
                        if (option) {
                            return option.label || option;
                        }
                    }
                }
                return value;
            }
            return this.formatValue(value, decimals);
        },

        get hasErrors() {
            return this.errors.length > 0;
        }
    }));
}

document.addEventListener('DOMContentLoaded', initPredimensionamientoModule);

