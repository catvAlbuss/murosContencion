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

        // Datos recibidos
        predimData: null,
        resultados: {},
        errors: [],

        // Control de cambios
        lastInputHash: '',

        // Configuración de parámetros a mostrar
        parametrosBase: [
            { key: 'B98', label: 'Altura de sobrecarga', symbol: 'hs', unit: 'm' },
            { key: 'B99', label: 'Coeficiente activo', symbol: 'ka', unit: '-' },
            { key: 'B100', label: 'Coeficiente pasivo', symbol: 'kp', unit: '-' },
            { key: 'B101', label: 'Coeficiente reposo', symbol: 'ko', unit: '-' },
            // { key: 'B112', label: 'Cohesión equivalente', symbol: 'c_eq', unit: 'kN/m²' },
            // { key: 'E74', label: 'Desplazamiento talud', symbol: 'Δ', unit: 'm' },
            // { key: 'E79', label: 'Altura efectiva', symbol: 'H_eff', unit: 'm' }
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
                {
                    label: 'Θ=',
                    gradosKey: 'B147',
                    radianesKey: 'C147',
                    description: ''
                },
                {
                    label: 'Ø=',
                    gradosKey: 'B148',
                    radianesKey: 'C148',
                    description: 'SUELO'
                },
                {
                    label: 'BETA',
                    gradosKey: 'B149',
                    radianesKey: 'C149',
                    description: 'ANGULO VASTAGO'
                },
                {
                    label: 'd=',
                    gradosKey: 'B150',
                    radianesKey: 'C150',
                    description: 'ANGULO DE FRICCION'
                },
                {
                    label: 'I=',
                    gradosKey: 'B151',
                    radianesKey: 'C151',
                    description: 'ANGULO DEL TALUD'
                },
                {
                    label: 'y=',
                    gradosKey: 'B152',
                    radianesKey: '',
                    description: ''
                }
            ];
        },

        getValue(key) {
            if (this.resultados[key] !== undefined) return this.resultados[key];
            if (this.predimData?.resultados?.[key] !== undefined) return this.predimData.resultados[key];
            return null;
        },

        init() {
            //console.log('Módulo de Cargas de Empuje inicializado');
            this.configurarEventos();
            this.inicializarValoresDefecto();
        },

        configurarEventos() {
            // Escucha cambios del módulo de dimensionamiento
            document.addEventListener('dimensionamiento-updated', (event) => {
                this.procesarDatosDimensionamiento(event.detail);
            });

            // Escucha sus propios cambios para reactividad
            document.addEventListener('cargas-updated', (event) => {
                if (event.detail && event.detail.resultados) {
                    this.resultados = { ...event.detail.resultados };
                }
            });
        },

        procesarDatosDimensionamiento(eventData) {
            try {
                if (!eventData) {
                    console.warn('No se recibieron datos del dimensionamiento');
                    return;
                }

                // Inicialización segura de objetos
                this.predimData = {
                    inputValues: eventData.inputValues || {},
                    resultados: eventData.resultados || {},
                    errors: Array.isArray(eventData.errors) ? eventData.errors : []
                };

                //console.log('Datos recibidos del dimensionamiento:', this.predimData);
                //console.log('Valor B98:', this.getB98Value());

                this.calcularResultados();
            } catch (error) {
                console.error('Error procesando datos del dimensionamiento:', error);
                this.addError('procesamiento_datos', 'Error procesando datos del dimensionamiento: ' + error.message);
            }
        },

        inicializarValoresDefecto() {
            // Valores por defecto para testing
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

                // Totales
                empuje_pasivo_total: 749.5,
                empuje_activo_total: 87.5,
                empuje_sobrecarga_total: 32.1,
                empuje_resultante: 629.9
            };
        },

        calcularResultados() {
            try {
                this.clearErrors();

                // Verificar que tenemos datos del predimensionamiento
                if (!this.predimData || !this.predimData.resultados) {
                    this.addError('datos_faltantes', 'No se han recibido datos del módulo de predimensionamiento');
                    return;
                }

                // Obtener B98 del predimensionamiento
                const b98 = this.getB98Value();
                if (!b98 || b98 === 0) {
                    this.addError('b98_invalido', 'El valor B98 (altura de sobrecarga) no es válido');
                }

                // Aquí irían los cálculos específicos usando B98 y otros parámetros
                this.calcularEmpujes();
                this.sendDataCargas();

            } catch (error) {
                this.addError('calculo_general', 'Error en el cálculo: ' + error.message);
                console.error('Error en cálculo de cargas:', error);
            }
        },

        calcularEmpujes() {
            try {
                const b98 = parseFloat(this.getB98Value());

                if (isNaN(b98) || b98 <= 0) {
                    //console.warn('B98 no válido para cálculos, usando valores por defecto');
                    return;
                }

                // Ejemplo de cálculos que dependen de B98
                // Estos son cálculos simplificados - reemplazar con fórmulas reales

                // Actualizar empuje de sobrecarga basado en B98
                const factor_sobrecarga = b98 / 2.0; // Factor simplificado
                this.resultados.empuje_sobrecarga_terreno = 32.1 * factor_sobrecarga;
                this.resultados.empuje_sobrecarga_horizontal = 31.6 * factor_sobrecarga;
                this.resultados.empuje_sobrecarga_total = this.resultados.empuje_sobrecarga_terreno;

                // Recalcular empuje resultante
                this.resultados.empuje_resultante =
                    this.resultados.empuje_pasivo_total -
                    this.resultados.empuje_activo_total -
                    this.resultados.empuje_sobrecarga_total;

                //console.log('Empujes calculados con B98 =', b98);

            } catch (error) {
                console.error('Error en cálculo de empujes:', error);
                this.addError('calculo_empujes', 'Error calculando empujes: ' + error.message);
            }
        },

        // Configuración de todos los resultados para la tabla detallada
        get todosLosResultados() {
            return [
                ...this.parametrosBase.map(p => ({ ...p, description: this.getDescripcion(p.key) })),
                ...this.empujePasivoParams.map(p => ({ ...p, description: this.getDescripcion(p.key) })),
                ...this.empujeActivoParams.map(p => ({ ...p, description: this.getDescripcion(p.key) })),
                ...this.empujeSobrecargaParams.map(p => ({ ...p, description: this.getDescripcion(p.key) })),
                {
                    key: 'empuje_pasivo_total',
                    label: 'Empuje Pasivo Total',
                    symbol: 'Ep_total',
                    unit: 'kN/m',
                    description: 'Suma de todos los empujes pasivos'
                },
                {
                    key: 'empuje_activo_total',
                    label: 'Empuje Activo Total',
                    symbol: 'Ea_total',
                    unit: 'kN/m',
                    description: 'Suma de todos los empujes activos'
                },
                {
                    key: 'empuje_sobrecarga_total',
                    label: 'Empuje Sobrecarga Total',
                    symbol: 'Es_total',
                    unit: 'kN/m',
                    description: 'Suma de todos los empujes de sobrecarga'
                },
                {
                    key: 'empuje_resultante',
                    label: 'Empuje Resultante',
                    symbol: 'E_result',
                    unit: 'kN/m',
                    description: 'Empuje neto sobre el muro'
                }
            ];
        },

        // Métodos utilitarios mejorados
        getB98Value() {
            if (this.predimData && this.predimData.resultados && this.predimData.resultados.B98 !== undefined) {
                return this.predimData.resultados.B98;
            }
            if (this.predimData && this.predimData.resultados && this.predimData.resultados.B99 !== undefined) {
                return this.predimData.resultados.B99;
            }
            if (this.predimData && this.predimData.resultados && this.predimData.resultados.B100 !== undefined) {
                return this.predimData.resultados.B100;
            }
            if (this.predimData && this.predimData.resultados && this.predimData.resultados.B101 !== undefined) {
                return this.predimData.resultados.B101;
            }
            if (this.predimData && this.predimData.resultados && this.predimData.resultados.B103 !== undefined) {
                return this.predimData.resultados.B103;
            }
            if (this.predimData && this.predimData.resultados && this.predimData.resultados.B104 !== undefined) {
                return this.predimData.resultados.B104;
            }
            return 0;
        },

        getValue(key) {
            // Primero buscar en resultados propios
            if (this.resultados[key] !== undefined) {
                return this.resultados[key];
            }

            // Luego buscar en datos del predimensionamiento
            if (this.predimData && this.predimData.resultados && this.predimData.resultados[key] !== undefined) {
                return this.predimData.resultados[key];
            }

            return null;
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
                'B112': 'Cohesión equivalente del suelo',
                'E74': 'Desplazamiento horizontal del talud',
                'E79': 'Altura efectiva del muro',
                'N78': 'Empuje pasivo cohesivo en el tercio superior',
                'N79': 'Empuje pasivo cohesivo en el tercio medio',
                'N80': 'Empuje pasivo cohesivo en el tercio inferior',
                'S78': 'Empuje pasivo del terreno en el tercio superior',
                'S79': 'Empuje pasivo del terreno en el tercio medio',
                'S80': 'Empuje pasivo del terreno en el tercio inferior',
                'T78': 'Brazo de palanca para empuje superior',
                'T79': 'Brazo de palanca para empuje medio',
                'T80': 'Brazo de palanca para empuje inferior',
                'empuje_activo_terreno': 'Empuje activo total del terreno',
                'empuje_activo_vertical': 'Componente vertical del empuje activo',
                'empuje_activo_horizontal': 'Componente horizontal del empuje activo',
                'presion_activa_min': 'Presión activa mínima en la superficie',
                'presion_activa_max': 'Presión activa máxima en la base',
                'brazo_empuje_activo': 'Brazo de palanca del empuje activo',
                'empuje_sobrecarga_terreno': 'Empuje de sobrecarga del terreno',
                'empuje_sobrecarga_vertical': 'Componente vertical del empuje de sobrecarga',
                'empuje_sobrecarga_horizontal': 'Componente horizontal del empuje de sobrecarga',
                'presion_sobrecarga_min': 'Presión de sobrecarga mínima',
                'presion_sobrecarga_max': 'Presión de sobrecarga máxima',
                'brazo_empuje_sobrecarga': 'Brazo de palanca del empuje de sobrecarga'
            };
            return descripciones[key] || 'Parámetro calculado';
        },

        addError(id, message) {
            if (!this.errors.find(e => e.id === id)) {
                this.errors.push({ id, message });
            }
        },

        clearErrors() {
            this.errors = [];
        },

        sendDataCargas() {
            const data = {
                inputValues: {},
                resultados: { ...this.resultados },
                errors: [...this.errors]
            };

            // Incluir B98 en los resultados para otros módulos
            if (this.predimData && this.predimData.resultados && this.predimData.resultados.B98 !== undefined) {
                data.resultados.B98 = this.predimData.resultados.B98;
            }

            document.dispatchEvent(new CustomEvent('cargas-updated', { detail: data }));
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

            // Validar B98
            const b98 = this.getB98Value();
            if (!b98 || b98 <= 0) {
                errores.push('B98 (altura de sobrecarga) debe ser mayor que 0');
            }

            // Validar coeficientes
            if (this.resultados.B99 && (this.resultados.B99 <= 0 || this.resultados.B99 >= 1)) {
                errores.push('Coeficiente activo (ka) debe estar entre 0 y 1');
            }

            if (this.resultados.B100 && this.resultados.B100 <= 1) {
                errores.push('Coeficiente pasivo (kp) debe ser mayor que 1');
            }

            // Validar empujes
            if (this.resultados.empuje_pasivo_total && this.resultados.empuje_pasivo_total <= 0) {
                errores.push('Empuje pasivo total debe ser positivo');
            }

            return errores;
        },

        // Método para exportar datos
        exportarDatos() {
            const datos = {
                timestamp: new Date().toISOString(),
                modulo: 'cargas_empuje',
                predimensionamiento: this.predimData,
                resultados: this.resultados,
                errores: this.errors
            };

            return JSON.stringify(datos, null, 2);
        },

        // Método para debug
        mostrarDebugInfo() {
            console.group('Debug Info - Cargas de Empuje');
            //console.log('Datos de predimensionamiento:', this.predimData);
            //console.log('Resultados calculados:', this.resultados);
            //console.log('Errores:', this.errors);
            //console.log('B98 actual:', this.getB98Value());
            //console.log('Validaciones:', this.validarDatos());
            console.groupEnd();
        }
    }));
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initCargasModule);