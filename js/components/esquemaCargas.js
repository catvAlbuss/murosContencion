function initesquemacargasModule() {
    const esquemacargas = document.getElementById('esquemacargas-content');
    if (!esquemacargas) {
        console.error('Contenedor esquemacargas no encontrado');
        return;
    }

    esquemacargas.innerHTML = `
        <div x-data="esquemacargasModule()" class="cuaderno p-4 max-w-full mx-auto font-mono">
            <!-- ENTRADAS Y SALIDAS -->
            <div class="grid grid-cols-1 md:grid-cols-1 gap-2">
                <!-- DATOS: CARGAS ACTUANTES -->
                <div class="mt-2 p-2 bg-gray-50 border border-gray-300 rounded shadow-sm">
                   
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

    Alpine.data('esquemacargasModule', () => ({

        datosCalculados: {},
        datosVerificaciones: {},
        resultados: {},
        resultadosVerf: {},
        errors: [],

        init() {
            this.configurarEventos();
        },

        configurarEventos() {
            document.addEventListener('verificaciones-updated', (event) => {
                this.procesarDatosVerificaciones(event.detail);
            });
            document.addEventListener('dimensionamiento-updated', (event) => {
                this.procesarDatosDimensionamiento(event.detail);
            });
        },

        procesarDatosVerificaciones(eventData) {
            //console.log('Datos de dimensionamiento recibidos:', eventData);
            if (eventData && eventData.resultados) {
                this.datosCalculados = eventData.datosCalculados;
                this.resultadosVerf = eventData.resultados;
                this.datosVerificaciones = eventData.datosVerificaciones;
                this.verificacionVolteo();
            } else {
                //console.warn('Datos de dimensionamiento no válidos o incompletos');
                this.addError('dimensionamiento', 'Datos de Verificaciones no válidos o incompletos');
            }
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
                //this.recalcularVerificaciones();
            } else {
                //console.warn('Datos de dimensionamiento no válidos o incompletos');
                this.addError('dimensionamiento', 'Datos de dimensionamiento no válidos o incompletos');
            }
        },

        verificacionVolteo() {
            const data = this.datosCalculados;
            const resultado = this.resultados;
            const verificaciones = this.resultadosVerf;
            const dtVerf = this.datosVerificaciones;
            //graficoverificacion
            const J132 = 0;
            const B15 = 1.3 * verificaciones.materiales.B10;
            //-- 3.1 VERIFICACION POR VOLTEO --
            //-- Col B
            const B190 = J132 * (verificaciones.graficoverificacion.B90 - verificaciones.graficoverificacion.D89)
            const B191 = data.B189 + B190;
            //--Col E
            const E189 = resultado.B125 * verificaciones.geometria.B21 / 3;
            const E190 = resultado.B138 * verificaciones.geometria.B21 / 2;
            const E191 = E189 + E190;
            const E192 = E191 + dtVerf.momentos.G171;
            //-- Col B
            const B193 = ((B191) / E191);
            const B194 = (B191) / E192;

            //-- Col C
            const C193 = (B193 < 1.2) ? "NO" : "OK";
            const C194 = (B194 < 1.2) ? "NO" : "OK";

            //-- 3.2 VERIFICACION POR DESLIZAMIENTO --
            //--Col-B
            const B196 = parseFloat(data.C186);
            const B197 = 0;
            const B198 = B196 + B197;
            //--Col-E
            const E196 = B198 * verificaciones.materiales.B14;
            const E197 = resultado.B125 + resultado.B138;
            const E198 = 0;
            const E199 = resultado.C160;
            const E200 = E197 + E199;

            const B201 = (E196 + dtVerf.fx.D175) / E197;
            const B202 = (E196 + dtVerf.fx.D175) / E200;
            const C201 = (B201 < 1.5) ? "NO" : "OK";
            const C202 = (B202 < 1.5) ? "NO" : "OK";

            //--3.3 VERIFICACION POR ESFUERZOS DEL TERRENO--
            const B205 = B198;
            const B206 = B191;
            const B207 = E191;
            const B208 = B206 - B207;

            const C205 = B198;
            const C206 = B191;
            const C207 = E192;
            const C208 = C206 - C207;
            //--NUCLEO CENTRAL
            const B210 = (B208) / B205;
            const B211 = verificaciones.graficoverificacion.B90 / 3;
            const B212 = B211 * 2;
            const B213 = (B210 >= B211 && B210 <= B212) ? "SI" : "NO";

            const C210 = (C208) / C205;
            const C211 = B211;
            const C212 = C211 * 2;
            const C213 = (C210 >= C211 && C210 <= C212) ? "SI" : "NO";

            //--ESFUERZOS EN LOS EXTREMOS DE LA CIMENTACION
            const B215 = (4 * verificaciones.graficoverificacion.B90 - 6 * B210) * B205 / (verificaciones.graficoverificacion.B90 * verificaciones.graficoverificacion.B90);
            const B216 = (-2 * verificaciones.graficoverificacion.B90 + 6 * B210) * B205 / (verificaciones.graficoverificacion.B90 * verificaciones.graficoverificacion.B90);
            const C215 = (B215 < verificaciones.materiales.B10) ? "SI" : "NO";
            const C216 = (B216 < verificaciones.materiales.B10) ? "SI" : "NO";
            //--ESFUERZOS EN LOS EXTREMOS DE LA CIMENTACION
            const B218 = (4 * verificaciones.graficoverificacion.B90 - 6 * C210) * C205 / (verificaciones.graficoverificacion.B90 * verificaciones.graficoverificacion.B90);
            const B219 = (-2 * verificaciones.graficoverificacion.B90 + 6 * C210) * C205 / (verificaciones.graficoverificacion.B90 * verificaciones.graficoverificacion.B90);
            const C218 = (B218 < B15) ? "SI" : "NO";
            const C219 = (B219 < B15) ? "SI" : "NO";
        },

        get verificacionDeslizamiento() { },
        get verificacionEzfuerzoTerreno() { },

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
    document.addEventListener('DOMContentLoaded', initesquemacargasModule);
} else {
    initesquemacargasModule();
}