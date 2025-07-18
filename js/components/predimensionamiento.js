function initPredimensionamientoModule() {
    console.log('🔄 Inicializando módulo de Predimensionamiento...');

    const container = document.getElementById('predimensionamiento-content');
    if (!container) {
        console.error('❌ Contenedor predimensionamiento-content no encontrado');
        return false;
    }

    // Limpiar contenedor
    container.innerHTML = '';

    // Insertar HTML del módulo
    container.innerHTML = `
         <div x-data="predimensionamientoModule()" class="cuaderno p-4 max-w-full mx-auto font-mono">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold text-gray-800">📐 Predimensionamiento del Muro</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                <section class="p-4 bg-slate-50 bg-opacity-0 border border-slate-300 rounded shadow-inner col-span-1">
                    <!-- Propiedades del Concreto -->
                    <div class="flex items-center justify-between cursor-pointer select-none mb-2"
                        @click="showMateriales = !showMateriales">
                        <h3 class="text-lg font-semibold text-blue-800 flex items-center">
                            <i class='fas fa-flask mr-2 text-yellow-500'></i>Propiedades del Concreto
                        </h3>
                        <span class="text-xs text-gray-500" x-text="showMateriales ? 'Ocultar' : 'Mostrar'"></span>
                    </div>
                    <div class="space-y-4" x-show="showMateriales" x-transition:enter.duration.300ms
                        x-transition:leave.duration.200ms>
                        <h4 class="text-sm font-semibold text-gray-700 mt-4 mb-2 px-6">Concreto</h4>

                        <!-- Peso Específico Concreto -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">Peso Específico Concreto</span>
                            <span class="w-1/6 text-gray-500">γc</span>
                            <input type="number"
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 2.4" x-model.number="datosinput.B6">
                            <span class="w-1/6 text-gray-500">Tn/m³</span>
                        </div>

                        <!-- Resistencia a compresion del Concreto -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">Resistencia a compresion del Concreto</span>
                            <span class="w-1/6 text-gray-500">f'c</span>
                            <input type="number"
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 210" x-model.number="datosinput.B7">
                            <span class="w-1/6 text-gray-500">kg/cm²</span>
                        </div>

                        <!-- Esfuerzo de fluencia del Acero -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">Esfuerzo de fluencia del Acero</span>
                            <span class="w-1/6 text-gray-500">fy</span>
                            <input type="number"
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 4200" x-model.number="datosinput.B8">
                            <span class="w-1/6 text-gray-500">kg/cm²</span>
                        </div>

                        <h4 class="text-sm font-semibold text-gray-700 mt-4 mb-2 px-6">Suelos</h4>

                        <!-- Capacidad Portante del suelo -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">Capacidad Portante del suelo</span>
                            <span class="w-1/6 text-gray-500">σADM</span>
                            <input type="number"
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 20.0" x-model.number="datosinput.B10">
                            <span class="w-1/6 text-gray-500">Tn/m²</span>
                        </div>

                        <!-- Peso Específico Suelo -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">Peso Específico Suelo</span>
                            <span class="w-1/6 text-gray-500">γs</span>
                            <input type="number"
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 1.83" x-model.number="datosinput.B11">
                            <span class="w-1/6 text-gray-500">Tn/m³</span>
                        </div>

                        <!-- Ángulo de Fricción -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">Ángulo de Fricción</span>
                            <span class="w-1/6 text-gray-500">φ</span>
                            <input type="number"
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 26.90" x-model.number="datosinput.B12">
                            <span class="w-1/6 text-gray-500">°</span>
                        </div>

                        <!-- Cohesión -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">Cohesión</span>
                            <span class="w-1/6 text-gray-500">c</span>
                            <input type="number"
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 0.05" x-model.number="datosinput.B13">
                            <span class="w-1/6 text-gray-500">Tn/m²</span>
                        </div>

                        <!-- Coeficiente deflexion del suelo -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">Coeficiente deflexion del suelo</span>
                            <span class="w-1/6 text-gray-500">u</span>
                            <input type="number"
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 0.51" x-model.number="datosinput.B14">
                            <span class="w-1/6 text-gray-500">-</span>
                        </div>
                    </div>

                    <!-- Geometría -->
                    <div class="flex items-center justify-between cursor-pointer select-none mt-4 mb-2"
                        @click="showGeometria = !showGeometria">
                        <h3 class="text-lg font-semibold text-blue-800 flex items-center">
                            <i class='fas fa-cube mr-2 text-green-500'></i>Geometría
                        </h3>
                        <span class="text-xs text-gray-500" x-text="showGeometria ? 'Ocultar' : 'Mostrar'"></span>
                    </div>
                    <div class="space-y-4" x-show="showGeometria" x-transition:enter.duration.300ms
                        x-transition:leave.duration.200ms>

                        <!-- Altura Muro -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">Altura Muro</span>
                            <span class="w-1/6 text-gray-500">H</span>
                            <input type="number"
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 6.40" x-model.number="datosinput.B18">
                            <span class="w-1/6 text-gray-500">m</span>
                        </div>

                        <!-- Profundidad Cimentación -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">Profundidad Cimentación</span>
                            <span class="w-1/6 text-gray-500">df</span>
                            <input type="number"
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 1.0" x-model.number="datosinput.B19">
                            <span class="w-1/6 text-gray-500">m</span>
                        </div>

                        <!-- Inclinación Terreno -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">Inclinación Terreno</span>
                            <span class="w-1/6 text-gray-500">β</span>
                            <input type="number"
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 12" x-model.number="datosinput.B20">
                            <span class="w-1/6 text-gray-500">°</span>
                        </div>
                    </div>

                    <!-- Cargas -->
                    <div class="flex items-center justify-between cursor-pointer select-none mt-4 mb-2"
                        @click="showCargas = !showCargas">
                        <h3 class="text-lg font-semibold text-blue-800 flex items-center">
                            <i class='fas fa-weight-hanging mr-2 text-red-500'></i>Cargas
                        </h3>
                        <span class="text-xs text-gray-500" x-text="showCargas ? 'Ocultar' : 'Mostrar'"></span>
                    </div>
                    <div class="space-y-4" x-show="showCargas" x-transition:enter.duration.300ms
                        x-transition:leave.duration.200ms>
                        <h4 class="text-sm font-semibold text-gray-700 mt-4 mb-2 px-6">Empuje Activo</h4>

                        <!-- Teoría Empuje Activo -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-2">
                            <span class="w-1/4 text-gray-700">Teoría Empuje Activo</span>
                            <span class="w-1/6 text-gray-500">Ka</span>
                            <select
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                x-model="datosinput.B24">
                                <option value="" disabled>Seleccione...</option>
                                <option value="rankine">Rankine</option>
                                <option value="coulomb">Coulomb</option>
                                <option value="terzagui">Terzagui</option>
                            </select>
                            <span class="w-1/6 text-gray-500"></span>
                        </div>

                        <!-- Sobrecarga -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-2">
                            <span class="w-1/4 text-gray-700">Sobrecarga</span>
                            <span class="w-1/6 text-gray-500">q</span>
                            <input type="number"
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 0.4" x-model.number="datosinput.B25">
                            <span class="w-1/6 text-gray-500">Tn/m²</span>
                        </div>

                        <!-- Tipo Presión -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-2">
                            <span class="w-1/4 text-gray-700">Tipo Presión</span>
                            <span class="w-1/6 text-gray-500"></span>
                            <select
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                x-model="datosinput.B26">
                                <option value="" disabled>Seleccione...</option>
                                <option value="rankine">Rankine</option>
                                <option value="coulomb">Coulomb</option>
                                <option value="terzagui">Terzagui</option>
                            </select>
                            <span class="w-1/6 text-gray-500"></span>
                        </div>

                        <h4 class="text-sm font-semibold text-gray-700 mt-4 mb-2 px-6">Presión Sísmica</h4>

                        <!-- Presión Sísmica -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-2">
                            <span class="w-1/4 text-gray-700">Presión Sísmica</span>
                            <span class="w-1/6 text-gray-500"></span>
                            <select
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                x-model="datosinput.B27">
                                <option value="" disabled>Seleccione...</option>
                                <option value="mononobe">Mononobe-Okabe</option>
                                <option value="wilsons">Wilson</option>
                                <option value="basico">Método Básico</option>
                            </select>
                            <span class="w-1/6 text-gray-500"></span>
                        </div>

                        <!-- Zona Sísmica -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-2">
                            <span class="w-1/4 text-gray-700">Zona Sísmica</span>
                            <span class="w-1/6 text-gray-500">Z</span>
                            <select
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                x-model.number="datosinput.B29">
                                <option value="" disabled>Seleccione...</option>
                                <option value="0.4">Zona 1 (Z=0.4)</option>
                                <option value="0.3">Zona 2 (Z=0.3)</option>
                                <option value="0.15">Zona 3 (Z=0.15)</option>
                            </select>
                            <span class="w-1/6 text-gray-500"></span>
                        </div>

                        <!-- Factor Kv -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-2">
                            <span class="w-1/4 text-gray-700">Factor Kv</span>
                            <span class="w-1/6 text-gray-500">Kv</span>
                            <select
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                x-model.number="datosinput.B30">
                                <option value="" disabled>Seleccione...</option>
                                <option value="0.3">0.3Kh</option>
                                <option value="0.35">0.35Kh</option>
                                <option value="0.4">0.4Kh</option>
                                <option value="0.45">0.45Kh</option>
                                <option value="0.5">0.5Kh</option>
                            </select>
                            <span class="w-1/6 text-gray-500"></span>
                        </div>

                        <!-- Altura de tabiqueue -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-2">
                            <span class="w-1/4 text-gray-700">Altura de tabiqueue</span>
                            <span class="w-1/6 text-gray-500">Ht</span>
                            <input type="number"
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 0.4" x-model.number="datosinput.B31">
                            <span class="w-1/6 text-gray-500">m</span>
                        </div>
                    </div>

                    <!-- Combinación de Cargas -->
                    <div class="flex items-center justify-between cursor-pointer select-none mt-4 mb-2"
                        @click="showCombinacion = !showCombinacion">
                        <h3 class="text-lg font-semibold text-blue-800 flex items-center">
                            <i class='fas fa-layer-group mr-2 text-green-500'></i>Combinación de Cargas
                        </h3>
                        <span class="text-xs text-gray-500" x-text="showCombinacion ? 'Ocultar' : 'Mostrar'"></span>
                    </div>
                    <div class="space-y-4" x-show="showCombinacion" x-transition:enter.duration.300ms
                        x-transition:leave.duration.200ms>
                        <h4 class="text-sm font-semibold text-gray-700 mt-4 mb-2 px-6">Estabilidad</h4>

                        <!-- D+L+H -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">D+L+H</span>
                            <span class="w-1/6 text-gray-500"></span>
                            <div class="w-1/4 flex items-center">
                                <input type="checkbox"
                                    class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    x-model="datosinput.D35">
                                <span class="ml-2 text-xs text-gray-600">Activar</span>
                            </div>
                            <span class="w-1/6 text-gray-500"></span>
                        </div>

                        <!-- D+H+0.70E -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">D+H+0.70E</span>
                            <span class="w-1/6 text-gray-500"></span>
                            <div class="w-1/4 flex items-center">
                                <input type="checkbox"
                                    class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    x-model="datosinput.D36">
                                <span class="ml-2 text-xs text-gray-600">Activar</span>
                            </div>
                            <span class="w-1/6 text-gray-500"></span>
                        </div>

                        <!-- 0.75D+0.75L+0.525E+0.6H -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">0.75D+0.75L+0.525E+0.6H</span>
                            <span class="w-1/6 text-gray-500"></span>
                            <div class="w-1/4 flex items-center">
                                <input type="checkbox"
                                    class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    x-model="datosinput.D37">
                                <span class="ml-2 text-xs text-gray-600">Activar</span>
                            </div>
                            <span class="w-1/6 text-gray-500"></span>
                        </div>

                        <h4 class="text-sm font-semibold text-gray-700 mt-4 mb-2 px-6">Resistencia Última</h4>

                        <!-- 1.4D+1.7L -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">1.4D+1.7L</span>
                            <span class="w-1/6 text-gray-500"></span>
                            <div class="w-1/4 flex items-center">
                                <input type="checkbox"
                                    class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    x-model="datosinput.D39">
                                <span class="ml-2 text-xs text-gray-600">Activar</span>
                            </div>
                            <span class="w-1/6 text-gray-500"></span>
                        </div>

                        <!-- 1.25D+1.25H+1.25L+E -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">1.25D+1.25H+1.25L+E</span>
                            <span class="w-1/6 text-gray-500"></span>
                            <div class="w-1/4 flex items-center">
                                <input type="checkbox"
                                    class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    x-model="datosinput.D40">
                                <span class="ml-2 text-xs text-gray-600">Activar</span>
                            </div>
                            <span class="w-1/6 text-gray-500"></span>
                        </div>

                        <!-- 0.9D+0.9H+E -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">0.9D+0.9H+E</span>
                            <span class="w-1/6 text-gray-500"></span>
                            <div class="w-1/4 flex items-center">
                                <input type="checkbox"
                                    class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    x-model="datosinput.D41">
                                <span class="ml-2 text-xs text-gray-600">Activar</span>
                            </div>
                            <span class="w-1/6 text-gray-500"></span>
                        </div>

                        <!-- 1.4D+1.7L+1.7H -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">1.4D+1.7L+1.7H</span>
                            <span class="w-1/6 text-gray-500"></span>
                            <div class="w-1/4 flex items-center">
                                <input type="checkbox"
                                    class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    x-model="datosinput.D42">
                                <span class="ml-2 text-xs text-gray-600">Activar</span>
                            </div>
                            <span class="w-1/6 text-gray-500"></span>
                        </div>

                        <!-- 0.9D+1.7H -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">0.9D+1.7H</span>
                            <span class="w-1/6 text-gray-500"></span>
                            <div class="w-1/4 flex items-center">
                                <input type="checkbox"
                                    class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    x-model="datosinput.D43">
                                <span class="ml-2 text-xs text-gray-600">Activar</span>
                            </div>
                            <span class="w-1/6 text-gray-500"></span>
                        </div>
                    </div>

                    <!-- Valores de Predimensionamiento -->
                    <div class="flex items-center justify-between cursor-pointer select-none mt-4 mb-2"
                        @click="showValPredim = !showValPredim">
                        <h3 class="text-base font-semibold text-blue-800 flex items-center">
                            <i class='fas fa-calculator mr-2 text-purple-500'></i>Valores de Predimensionamiento
                        </h3>
                        <span class="text-xs text-gray-500" x-text="showValPredim ? 'Ocultar' : 'Mostrar'"></span>
                    </div>
                    <div class="space-y-4" x-show="showValPredim" x-transition:enter.duration.300ms
                        x-transition:leave.duration.200ms>

                       <!-- Ancho Corona -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">Ancho Corona</span>
                            <span class="w-1/6 text-gray-500">ac</span>
                            
                            <input type="number"
                                min="0.10"
                                max="0.30"
                                step="0.01"
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded 
                                    focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 0.20"
                                x-model.number="datosinput.D45"
                                @input="
                                    if ($event.target.value < 0.10) {
                                        datosinput.D45 = 0.10;
                                    } else if ($event.target.value > 0.30) {
                                        datosinput.D45 = 0.30;
                                    }
                                ">
                            <span class="w-1/6 text-gray-500">m</span>
                        </div>

                        <!-- factor de división para garganta pantalla -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">factor de división para garganta pantalla</span>
                            <span class="w-1/6 text-gray-500">K</span>
                            <input type="number"
                                min="10"
                                max="12"
                                step="0.1"
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded 
                                    focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 10.5"
                                x-model.number="datosinput.D47"
                                @input="
                                    if ($event.target.value < 10) {
                                        datosinput.D47 = 10;
                                    } else if ($event.target.value > 12) {
                                        datosinput.D47 = 12;
                                    }
                                "
                            >
                            <span class="w-1/6 text-gray-500"></span>
                        </div>

                        <!-- factor de división para garganta de zapata -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">factor de división para garganta de zapata</span>
                            <span class="w-1/6 text-gray-500">K</span>
                            <input type="number"
                                min="10"
                                max="12"
                                step="0.1"
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded 
                                    focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 11"
                                x-model.number="datosinput.D49"
                                @input="
                                    if ($event.target.value < 10) {
                                        datosinput.D49 = 10;
                                    } else if ($event.target.value > 12) {
                                        datosinput.D49 = 12;
                                    }
                                "
                            >
                            <span class="w-1/6 text-gray-500"></span>
                        </div>


                        <!-- factor multiplicador para nacho de basa -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">factor multiplicador para nacho de basa</span>
                            <span class="w-1/6 text-gray-500">K</span>
                            <input type="number"
                                min="0.40"
                                max="0.70"
                                step="0.01"
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded 
                                    focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 0.20"
                                x-model.number="datosinput.D51"
                                @input="
                                    if ($event.target.value < 0.40) {
                                        datosinput.D51 = 0.40;
                                    } else if ($event.target.value > 0.70) {
                                        datosinput.D51 = 0.70;
                                    }">
                            <span class="w-1/6 text-gray-500"></span>
                        </div>

                        <!-- altura del key -->
                        <div class="flex text-xs px-6 items-center space-x-2 mb-1">
                            <span class="w-1/4 text-gray-700">altura del key</span>
                            <span class="w-1/6 text-gray-500">K</span>
                            <input type="number"
                                class="w-1/4 text-xs px-1 py-1 border border-gray-300 rounded focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 2.4" x-model.number="datosinput.D53">
                            <span class="w-1/6 text-gray-500"></span>
                        </div>
                    </div>
                    <div class="mt-4">
                        <div class="flex gap-4 mt-4">
                            <button 
                                id="calculate-button" 
                                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50" 
                                x-on:click="calcular()"
                                :disabled="isCalculating"
                                :class="{ 'opacity-50 cursor-not-allowed': isCalculating }">
                                <span x-show="!isCalculating">Calcular</span>
                                <span x-show="isCalculating">Calculando...</span>
                            </button>

                            <div x-show="resultados && Object.keys(resultados).length > 0" class="flex items-center text-green-600">
                                <i class="fas fa-check-circle mr-2"></i>
                                <span>Cálculos completados</span>
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
                    </div>
                </section>
                <section
                    class="md:col-span-2 p-8  bg-slate-50 bg-opacity-0 border border-slate-300 rounded shadow-inner flex flex-col items-center ">
                    <div class="">
                        <h3 class="text-lg font-semibold text-blue-800 mb-3 flex items-center"><i
                                class='fas fa-check-circle mr-2 text-green-600'></i>Resultados Geométricos</h3>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <template x-for="(value, key) in resultados" :key="key">
                                <div class="bg-white p-3 rounded-lg border border-gray-200">
                                    <label class="block text-xs text-gray-500 uppercase font-semibold"
                                        x-text="resultadosConfig[key] ? resultadosConfig[key].label : key.replaceAll('_', ' ')"></label>
                                    <p class="text-gray-900 font-semibold text-lg"
                                        x-text="formatValue(value, resultadosConfig[key] ? resultadosConfig[key].decimals : 2) + ' ' + (resultadosConfig[key] ? resultadosConfig[key].unit : 'm')">
                                    </p>
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="p-8 justify-center">
                        <h3 class="text-lg font-semibold text-blue-800 mb-3 flex items-center"><i
                                class='fas fa-chart-bar mr-2 text-blue-400'></i>Gráfico</h3>
                        <div id="predimsMC"></div>
                    </div>
                    <div class="">
                        <h3 class="text-lg font-semibold text-blue-800 mb-3 flex items-center"><i
                                class='fas fa-chart-bar mr-2 text-blue-400'></i>Imagen de Referencia</h3>
                        <img class="w-full h-600" src="js/assets/predim-preview.png" alt="Imagen" />
                    </div>
                </section>
            </div>
        </div>
    `;

    Alpine.data('predimensionamientoModule', () => ({
        // Estados de la UI
        mode: 'edit',
        showMateriales: true,
        showSuelos: false,
        showGeometria: false,
        showCargas: false,
        showCombinacion: false,
        showValPredim: false,
        isCalculating: false,
        chartInitialized: false,

        // Datos de entrada con valores por defecto
        datosinput: {
            B6: 2.4, B7: 210, B8: 4200, B10: 20.0, B11: 1.83, B12: 26.90, B13: 0.05, B14: 0.51,
            B18: 6.40, B19: 1.0, B20: 12, B21: 0, // B21 se calculará
            B24: 'rankine', B25: 0.4, B26: 'rankine', B27: 'mononobe', B29: 0.4, B30: 0.3, B31: 0.4,
            D35: false, D36: false, D37: false, D39: false, D40: false, D41: false, D42: false, D43: false,
            D45: 0.2, D47: 10, D49: 10, D51: 0.7, D53: 10
        },

        // Resultados de los cálculos
        resultados: {
            ancho_corona: 0, espesor_base_pantalla: 0, peralte_zapata: 0, ancho_zapata: 0, altura_key: 0, Ht: 0
        },

        // Configuración de visualización de resultados
        resultadosConfig: {
            ancho_corona: { label: 'Ancho Corona', unit: 'm', decimals: 2 },
            espesor_base_pantalla: { label: 'Espesor Base Pantalla', unit: 'm', decimals: 3 },
            peralte_zapata: { label: 'Peralte Zapata', unit: 'm', decimals: 3 },
            ancho_zapata: { label: 'Ancho Zapata', unit: 'm', decimals: 2 },
            altura_key: { label: 'Altura Key', unit: 'm', decimals: 3 },
            Ht: { label: 'Altura Total', unit: 'm', decimals: 2 },
        },

        errors: [],

        // La inicialización no realiza cálculos, solo prepara el estado inicial
        init() {
            console.log('🔄 Inicializando predimensionamiento module...');
            this.loadSavedData();
            this.graficopredimensionamiento();
            this.setupEventListeners();
        },

        loadSavedData() {
            // Cargar datos guardados si existen
            const systemData = this.getSystemData();
            if (systemData && systemData.predimensionamiento) {
                this.datosinput = systemData.predimensionamiento.inputValues || {};
                this.resultados = systemData.predimensionamiento.resultados || {};
                this.errors = systemData.predimensionamiento.errors || [];
                console.log('📊 Datos de predimensionamiento cargados');
            }
            this.graficopredimensionamiento();
        },

        getSystemData() {
            // Obtener datos del sistema principal
            try {
                const storedData = localStorage.getItem('murosContencionData');
                return storedData ? JSON.parse(storedData) : null;
            } catch (error) {
                console.error('Error cargando datos del sistema:', error);
                return null;
            }
        },

        setupEventListeners() {
            // Escuchar cambios en los inputs para auto-guardar
            document.addEventListener('input', (e) => {
                if (e.target.closest('#predimensionamiento-content')) {
                    this.handleInputChange(e.target);
                }
            });
        },

        handleInputChange(input) {
            // Guardar cambios en inputs automáticamente
            if (input.name && input.value !== undefined) {
                this.datosinput[input.name] = input.value;
                console.log(`📝 Input actualizado: ${input.name} = ${input.value}`);

                // Resetear estado de cálculo si se cambian los datos
                if (this.resultados && Object.keys(this.resultados).length > 0) {
                    this.resetCalculationState();
                }
            }
        },

        resetCalculationState() {
            this.resultados = {};
            this.errors = [];
            console.log('🔄 Estado de cálculo reseteado');
        },
        // Función principal de cálculo, llamada por el botón
        async calcular() {
            if (this.isCalculating) return;

            this.isCalculating = true;
            this.errors = [];

            console.log('🔄 Iniciando cálculo de predimensionamiento...');

            setTimeout(() => { // Pequeño retraso para UX (mostrar loading si se desea)
                try {
                    this.calcularDimensiones();
                    this.graficopredimensionamiento();
                    this.sendDataPredim(); // Enviar datos después de todos los cálculos
                } catch (error) {
                    this.addError('calculo_general', 'Error en el cálculo: ' + error.message);
                    console.error('Error en cálculo:', error);
                } finally {
                    this.isCalculating = false;
                }
            }, 100); // Reducir el tiempo de espera si no es estrictamente necesario
        },

        // Valida y devuelve un número, usando un valor por defecto si es inválido
        validateNumber(value, defaultValue) {
            const num = parseFloat(value);
            if (isNaN(num)) {
                // Opcional: podrías agregar un error específico aquí si quieres notificar al usuario
                // this.addError(`input_${defaultValue}`, `Valor inválido, usando por defecto ${defaultValue}`);
                return defaultValue;
            }
            return num;
        },

        calcularDimensiones() {
            const H = this.validateNumber(this.datosinput.B18, 6.4);
            const df = this.validateNumber(this.datosinput.B19, 1.0);
            const Ht = H + df;
            this.datosinput.B21 = Ht; // Actualiza Ht en datosinput

            const ancho_corona = this.validateNumber(this.datosinput.D45, 0.2);
            const espesor_base_pantalla = H / this.validateNumber(this.datosinput.D47, 10);
            const peralte_zapata = H / this.validateNumber(this.datosinput.D49, 10);
            const ancho_zapata = H * this.validateNumber(this.datosinput.D51, 0.7);
            const altura_key = H / this.validateNumber(this.datosinput.D53, 10);

            Object.assign(this.resultados, {
                ancho_corona: ancho_corona,
                espesor_base_pantalla: espesor_base_pantalla,
                peralte_zapata: peralte_zapata,
                ancho_zapata: ancho_zapata,
                altura_key: altura_key,
                Ht: Ht
            });
        },

        calculopuntosmuros(H, e = 10) {
            const H_val = this.validateNumber(H, 6.4);

            const muro = [
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

            const suelo = [
                { x: ((0.7 * H_val / 3) + H_val / 10), y: (H_val / 10) + H_val },
                { x: ((0.7 * H_val / 3) + H_val / 10) + 2, y: ((H_val / 10) + H_val) + (this.datosinput.B20 / 10) }
            ];

            const sueloDelante = [
                { x: ((0.7 * H_val) / 3) + 0.15, y: (H_val / 10) + (H_val / 2) },
                { x: ((0.7 * H_val) / 3) - 2, y: (H_val / 10) + (H_val / 2) }
            ];

            return { muro, suelo, sueloDelante };
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
            const H = this.datosinput.B18 || 6.4;
            const { muro, suelo, sueloDelante } = this.calculopuntosmuros(H);

            const allPoints = [...muro, ...suelo, ...sueloDelante];

            const xExtent = d3.extent(allPoints, d => d.x);
            const yExtent = d3.extent(allPoints, d => d.y);

            const width = this.width;
            const height = this.height;

            const xRange = xExtent[1] - xExtent[0];
            const yRange = yExtent[1] - yExtent[0];

            const scaleX = width / xRange;
            const scaleY = height / yRange;
            const scale = Math.min(scaleX, scaleY);

            const newXRange = width / scale;
            const newYRange = height / scale;

            const xMid = (xExtent[0] + xExtent[1]) / 2;
            const yMid = (yExtent[0] + yExtent[1]) / 2;

            const newXDomain = [xMid - newXRange / 2, xMid + newXRange / 2];
            const newYDomain = [yMid - newYRange / 2, yMid + newYRange / 2];

            this.x.domain(newXDomain).nice();
            this.y.domain(newYDomain).nice();

            const line = d3.line()
                .x(d => this.x(d.x))
                .y(d => this.y(d.y));

            this.xAxis.call(d3.axisBottom(this.x).ticks(Math.round(newXRange)));
            this.yAxis.call(d3.axisLeft(this.y).ticks(Math.round(newYRange)));

            this.svg.selectAll(".path-muro").data([muro])
                .join("path")
                .attr("class", "path-muro")
                .attr("d", line)
                .attr("fill", "rgba(70, 130, 180, 0.3)")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2);

            this.svg.selectAll(".path-suelo").data([suelo])
                .join("path")
                .attr("class", "path-suelo")
                .attr("d", line)
                .attr("fill", "none")
                .attr("stroke", "gray")
                .attr("stroke-width", 5)
                .attr("stroke-dasharray", "5,5");

            this.svg.selectAll(".path-sueloDelante").data([sueloDelante])
                .join("path")
                .attr("class", "path-sueloDelante")
                .attr("d", line)
                .attr("fill", "none")
                .attr("stroke", "brown")
                .attr("stroke-width", 5)
                .attr("stroke-dasharray", "5,5");
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

        // Envía tanto los datos de entrada actuales (por defecto o modificados) como los resultados
        sendDataPredim() {
            const data = {
                inputValues: JSON.parse(JSON.stringify(this.datosinput)),
                resultados: JSON.parse(JSON.stringify(this.resultados)),
                errors: [...this.errors],
                isCalculated: this.errors.length === 0 && Object.keys(this.resultados).length > 0
            };

            console.log('📤 Enviando datos de predimensionamiento:', data);

            try {
                document.dispatchEvent(new CustomEvent('predimensionamiento-updated', {
                    detail: data,
                    bubbles: true
                }));
            } catch (error) {
                console.error('❌ Error enviando datos:', error);
            }
        },

        toggleMode() {
            this.mode = this.mode === 'edit' ? 'view' : 'edit';
        },

        // Simplificado: se asume que los inputs son tipo 'number' y se busca 'decimals'
        getInputStep(id) {
            const defaultDecimals = 2; // O un valor que prefieras
            const inputConfig = this.resultadosConfig[id]; // Reutilizamos resultadosConfig para tener los decimals
            if (inputConfig && typeof inputConfig.decimals === 'number') {
                return inputConfig.decimals === 0 ? '1' : `0.${'0'.repeat(inputConfig.decimals - 1)}1`;
            }
            // Para inputs no en resultadosConfig o sin decimals, usa un paso genérico
            return `0.${'0'.repeat(defaultDecimals - 1)}1`;
        },

        formatValue(value, decimals = 2) {
            if (value === null || value === undefined || value === '') return '-';
            if (typeof value !== 'number') return value;

            if (decimals === 0) {
                return Math.round(value).toString();
            }

            return value.toFixed(decimals);
        },

        get hasErrors() {
            return this.errors.length > 0;
        }
    }));
}

document.addEventListener('DOMContentLoaded', initPredimensionamientoModule);