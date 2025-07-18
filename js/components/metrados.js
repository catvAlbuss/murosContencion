const TableConfig = {
    colors: {
        hierarchyLevels: {
            0: '#800080', // Purple for top-level
            1: '#FF0000', // Red for children
            2: '#0000FF', // Blue for grandchildren
            3: '#008000', // Green for 4th gen with 5th gen
            4: '#000000'  // Black for deeper levels
        }
    },
    utils: {
        getHierarchyColor: function (node, depth) {
            // Si es de 5ta generación, revisa si tiene hijos
            if (depth === 4) {
                if (node.children && node.children.length > 0) {
                    // Si tiene hijos, colorear al padre de verde
                    return TableConfig.colors.hierarchyLevels[3];
                } else {
                    // Si no tiene hijos, colorear de negro
                    return TableConfig.colors.hierarchyLevels[4];
                }
            }

            // Para la 4ta generación, revisa si tiene hijos en la 5ta
            if (depth === 3) {
                if (node.children && node.children.some(child => child.children && child.children.length > 0)) {
                    // Si tiene hijos en la 5ta, colorear de verde
                    return TableConfig.colors.hierarchyLevels[3];
                } else {
                    // Si no tiene hijos en la 5ta, colorear de negro
                    return TableConfig.colors.hierarchyLevels[4];
                }
            }

            // Para los demás niveles, usar color por defecto
            return TableConfig.colors.hierarchyLevels[depth] || TableConfig.colors.hierarchyLevels[4];
        },
        calculateItemDepth: function (item) {
            return (item.match(/\./g) || []).length;
        }
    }
};

const unidadValues = {
    "": "",
    "Und": "Unidad",
    "pto": "Punto",
    "kg": "Kilogramos",
    "m": "metros",
    "m1": "metros cc",
    "m2": "metros cuadrado",
    "m3": "metros cúbicos",
    "GBL": "global"
};

const fieldsToHighlight = {
    //Und: ["elesimil", "nveces", "longitud", "area"],
    Und: ["elesimil", "nveces"],
    kg: ["elesimil", "largo", "ancho", "alto", "nveces", "volumen"],
    m: ["elesimil", "largo", "ancho", "alto", "nveces"],
    m1: ["elesimil", "largo", "ancho", "alto"],
    m2: ["elesimil", "largo", "ancho", "alto", "nveces"],
    pto: ["nveces"],
    //m3: ["largo", "ancho", "alto", "nveces"],
    m3: ["elesimil", "largo", "ancho", "alto", "nveces"],
    GBL: ["elesimil", "nveces"],
};

const TableCalculator = {
    calculateByUnidad: function (data) {
        const unidad = data.unidad;
        const elesimil = parseFloat(data.elesimil) || 1;
        const largo = parseFloat(data.largo) || 0;
        const ancho = parseFloat(data.ancho) || 0;
        const alto = parseFloat(data.alto) || 0;
        const nveces = parseFloat(data.nveces) || 1;
        const longitud = parseFloat(data.longitud) || 0;
        const area = parseFloat(data.area) || 0;
        const volumen = parseFloat(data.volumen) || 0;

        switch (unidad) {
            case "Und":
            case "GBL":
                return this.calculateUnidad(elesimil, nveces);

            case "kg":
                return this.calculateKilogramos(elesimil, largo, ancho, alto, nveces, volumen);

            case "m":
                return this.calculateMetros(elesimil, largo, ancho, alto, nveces);

            case "m1":
                return this.calculateMetros1(elesimil, largo, ancho, alto);

            case "m2":
                return this.calculateMetrosCuadrados(elesimil, largo, ancho, alto, nveces);

            case "pto":
                return this.calculatePuntos(nveces);

            case "m3":
                return this.calculateMetrosCubicos(elesimil, largo, ancho, alto, nveces);

            default:
                return {
                    unidadCalculado: 0,
                    longitud: 0,
                    area: 0,
                    volumen: 0,
                    kg: 0,
                    displayValue: "0.00"
                };
        }
    },

    calculateUnidad: function (elesimil, nveces) {
        const result = elesimil * nveces;
        return {
            unidadCalculado: result,
            longitud: 0,
            area: 0,
            volumen: 0,
            kg: 0,
            displayValue: result.toFixed(2)
        };
    },

    calculateKilogramos: function (elesimil, largo, ancho, alto, nveces, volumen) {
        const dimensionSum = largo + ancho + alto;
        const longitud = elesimil * dimensionSum * nveces;
        const kg = longitud * volumen;

        return {
            unidadCalculado: kg,
            longitud: longitud,
            area: 0,
            volumen: 0,
            kg: kg,
            displayValue: kg.toFixed(2)
        };
    },

    calculateMetros: function (elesimil, largo, ancho, alto, nveces) {
        const dimensionSum = largo + ancho + alto;
        const longitud = elesimil * dimensionSum * nveces;

        return {
            unidadCalculado: longitud,
            longitud: longitud,
            area: 0,
            volumen: 0,
            kg: 0,
            displayValue: longitud.toFixed(2)
        };
    },

    calculateMetros1: function (elesimil, largo, ancho, alto) {
        const dimensionSum = largo + ancho;
        const longitud = elesimil * dimensionSum * alto;

        return {
            unidadCalculado: longitud,
            longitud: longitud,
            area: 0,
            volumen: 0,
            kg: 0,
            displayValue: longitud.toFixed(2)
        };
    },

    calculateMetrosCuadrados: function (elesimil, largo, ancho, alto, nveces) {
        const area = elesimil * largo * ancho * alto * nveces;

        return {
            unidadCalculado: area,
            longitud: 0,
            area: area,
            volumen: 0,
            kg: 0,
            displayValue: area.toFixed(2)
        };
    },

    calculatePuntos: function (nveces) {
        return {
            unidadCalculado: nveces,
            longitud: 0,
            area: 0,
            volumen: 0,
            kg: 0,
            displayValue: nveces.toFixed(2)
        };
    },

    calculateMetrosCubicos: function (elesimil, largo, ancho, alto, nveces) {
        const volumen = elesimil * largo * ancho * alto * nveces;

        return {
            unidadCalculado: volumen,
            longitud: 0,
            area: 0,
            volumen: volumen,
            kg: 0,
            displayValue: volumen.toFixed(2)
        };
    },

    // Función mejorada para calcular totales jerárquicos
    calculateHierarchicalTotals: function (rows) {
        rows.forEach(row => {
            this.calculateRowTotal(row);
        });
    },

    calculateRowTotal: function (row) {
        const data = row.getData();
        const children = row.getTreeChildren();

        if (children && children.length > 0) {
            // Calcular totales de hijos recursivamente
            this.calculateHierarchicalTotals(children);

            // Sumar totales de hijos
            const childrenTotal = children.reduce((sum, childRow) => {
                const childData = childRow.getData();
                return sum + (parseFloat(childData.total) || 0);
            }, 0);

            // Calcular total propio si tiene datos
            let ownTotal = 0;
            if (data.unidad && this.hasCalculableData(data)) {
                const calculation = this.calculateByUnidad(data);
                ownTotal = calculation.unidadCalculado;

                // Actualizar campos calculados
                row.update({
                    unidadcalculado: calculation.displayValue,
                    longitud: calculation.longitud > 0 ? calculation.longitud.toFixed(2) : "",
                    area: calculation.area > 0 ? calculation.area.toFixed(2) : "",
                    volumen: calculation.volumen > 0 ? calculation.volumen.toFixed(2) : "",
                    kg: calculation.kg > 0 ? calculation.kg.toFixed(2) : ""
                });
            }

            const finalTotal = ownTotal + childrenTotal;
            row.update({
                total: finalTotal.toFixed(2),
                totalnieto: finalTotal.toFixed(2)
            });

        } else {
            // Fila hoja: calcular solo su propio total
            if (data.unidad && this.hasCalculableData(data)) {
                const calculation = this.calculateByUnidad(data);

                row.update({
                    unidadcalculado: calculation.displayValue,
                    longitud: calculation.longitud > 0 ? calculation.longitud.toFixed(2) : "",
                    area: calculation.area > 0 ? calculation.area.toFixed(2) : "",
                    volumen: calculation.volumen > 0 ? calculation.volumen.toFixed(2) : "",
                    kg: calculation.kg > 0 ? calculation.kg.toFixed(2) : "",
                    total: calculation.displayValue,
                    totalnieto: calculation.displayValue
                });
            } else {
                row.update({
                    unidadcalculado: "0.00",
                    longitud: "",
                    area: "",
                    volumen: "",
                    kg: "",
                    total: "0.00",
                    totalnieto: "0.00"
                });
            }
        }
    },

    hasCalculableData: function (data) {
        const requiredFields = fieldsToHighlight[data.unidad];
        if (!requiredFields) return false;

        return requiredFields.some(field => {
            const value = parseFloat(data[field]);
            return !isNaN(value) && value > 0;
        });
    }
};

const unidadesvolumen = {
    "0.222": "6 mm",
    "0.395": "8 mm",
    "0.56": "3/8' ",
    "0.888": "12 mm",
    "0.994": "1/2' ",
    "1.552": "5/8' ",
    "2.235": "3/4' ",
    "3.973": "1' ",
    "7.907": "1 1/8' ",
};

const listaNormativas = [
    {
        item: "ESTRUCTURAS", children: [
            {
                item: "MOVIMIENTO DE TIERRAS", children: [
                    {
                        item: "NIVELACIÓN DE TERRENO", children: [
                            { item: "NIVELACIÓN" },
                            { item: "NIVELADO APISONADO" },
                        ]
                    },
                    {
                        item: "EXCAVACIONES", children: [
                            { item: "EXCAVACIONES MASIVAS" },
                            { item: "EXCAVACIONES SIMPLES" },
                        ]
                    },
                    { item: "CORTES" },
                    {
                        item: "RELLENOS", children: [
                            { item: "RELLENO CON MATERIAL PROPIO" },
                            { item: "RELLENOS CON MATERIAL DE PRÉSTAMO" },
                        ]
                    },
                    { item: "NIVELACIÓN INTERIOR Y APISONADO" },
                    { item: "ELIMINACIÓN DE MATERIAL EXCEDENTE" },
                    {
                        item: "TABLAESTACADO O ENTIBADO", children: [
                            { item: "TABLAESTACADO PARA EXCAVACIONES, ESTRUCTURAS, POZOS,CÁMARAS SUBTERRÁNEAS, ETC" },
                            { item: "TABLAESTACADO PARA EXCAVACIONES DE ZANJAS" },
                        ]
                    },
                ]
            },
            {
                item: "OBRAS DE CONCRETO SIMPLE", children: [
                    { item: "CIMIENTOS CORRIDOS" },
                    {
                        item: "SUB ZAPATAS O FALSA ZAPATA", children: [
                            { item: "PARA EL CONCRETO" },
                            { item: "PARA EL ENCOFRADO Y DESENCOFRADO" },
                        ]
                    },
                    { item: "SOLADOS" },
                    { item: "BASES DE CONCRETO" },
                    { item: "ESTRUCTURAS DE SOSTENIMIENTO DE EXCAVACIONES" },
                    { item: "SOBRECIMIENTOS" },
                    { item: "GRADAS" },
                    { item: "RAMPAS" },
                    { item: "FALSOPISO" },
                ]
            },
            {
                item: "OBRAS DE CONCRETO ARMADO", children: [
                    {
                        item: "CIMIENTOS REFORZADOS", children: [
                            { item: "PARA EL CONCRETO" },
                            { item: "PARA EL ENCOFRADO Y DESENCOFRADO" },
                            { item: "PARA LA ARMADURA DE ACERO" },
                        ]
                    },
                    { item: "ZAPATAS" },
                    { item: "VIGAS DE CIMENTACIÓN" },
                    { item: "LOSAS DE CIMENTACIÓN" },
                    { item: "SOBRECIMIENTOS REFORZADOS" },
                    { item: "MUROS REFORZADOS" },
                    { item: "COLUMNAS" },
                    { item: "VIGAS" },
                    { item: "LOSAS" },
                    { item: "ESCALERAS" },
                    { item: "CAJA DE ASCENSORES Y SIMILARES" },
                    { item: "CISTERNAS SUBTERRÁNEAS" },
                    { item: "TANQUES ELEVADOS" },
                    { item: "PILOTES" },
                    { item: "CAISSONES" },
                    { item: "ESTRUCTURAS DE CONCRETO PRETENSADO O POSTENSADO" },
                    { item: "ESTRUCTURAS PREFABRICADAS" },
                ]
            },
            {
                item: "ESTRUCTURAS METÁLICAS", children: [
                    {
                        item: "COLUMNAS O PILARES", children: [
                            { item: "PARA ARMADO" },
                            { item: "PARA MONTAJE" },
                        ]
                    },
                    { item: "VIGAS" },
                    { item: "VIGUETAS" },
                    { item: "TIJERALES Y RETICULADOS" },
                    { item: "CORREAS" },
                    { item: "COBERTURAS" },
                    { item: "ELEMENTOS PARA AGUAS PLUVIALES" },
                ]
            },
            {
                item: "ESTRUCTURA DE MADERA", children: [
                    { item: "COLUMNAS O PILARES" },
                    { item: "VIGAS" },
                    { item: "TIJERALES Y RETICULADOS" },
                    { item: "CORREAS" },
                    { item: "COBERTURAS" },
                    { item: "PILOTES DE MADERA" },
                ]
            },
            {
                item: "VARIOS", children: [
                    { item: "JUNTAS" },
                ]
            },
        ]
    }
];

function initMetradosModule() {
    const metrado = document.getElementById('metrado-content');
    if (!metrado) {
        console.error('Metrado container not found');
        return;
    }

    metrado.innerHTML = `
        <div x-data="metradoModule()" class="cuaderno max-w-full mx-auto">
            <!-- HEADER -->
            <div class="flex justify-between items-center mb-6 p-4">
                <h2 class="text-3xl font-bold text-gray-800 flex items-center">
                    <i class="fas fa-calculator mr-3 text-blue-500"></i>
                    Metrados
                </h2>
                <div class="flex items-center space-x-4">
                    <button @click="toggleMode"
                        class="px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200"
                        :class="mode === 'edit' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-green-100 text-green-800 border border-green-300'">
                        <i class="fas" :class="mode === 'edit' ? 'fa-edit' : 'fa-eye'"></i>
                        <span x-text="mode === 'edit' ? 'Modo Edición' : 'Modo Vista'"></span>
                    </button>
                    <button @click="exportData" class="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                        <i class="fas fa-download mr-2"></i>
                        Exportar
                    </button>
                </div>
            </div>

            <!-- ERROR MESSAGES -->
            <div x-show="hasErrors" class="mb-4">
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div class="flex">
                        <i class="fas fa-exclamation-triangle text-red-400 mr-3 mt-0.5"></i>
                        <div>
                            <h3 class="text-sm font-medium text-red-800">Se encontraron errores:</h3>
                            <ul class="mt-2 text-sm text-red-700 list-disc list-inside">
                                <template x-for="error in errors" :key="error.id">
                                    <li x-text="error.message"></li>
                                </template>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TABLA PRINCIPAL -->
            <section class="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
             <div class="w-full text-sm">
                    <div id="metrados-table" class="w-full"></div>
                </div>
            </section>
        </div>
    `;

    // Initialize Alpine.js data
    Alpine.data('metradoModule', () => ({
        mode: 'edit',
        errors: [],
        table: null,
        data: [],
        tableBuilt: false,

        init() {
            this.loadInitialData();
            this.initializeTable();
        },

        initializeTable() {
            const tableElement = document.getElementById('metrados-table');
            if (!tableElement) return;

            // Create table with initial data
            this.table = new Tabulator(tableElement, {
                movableRows: true,
                height: "500px",
                data: this.data,
                layout: "fitColumns",
                dataTree: true,
                dataTreeStartExpanded: true,
                dataTreeChildField: "children",
                columnHeaderVertAlign: "bottom",
                movableRowsConnectedTables: false,
                movableRowsReceiver: "add",
                movableRowsSender: "delete",
                columns: [
                    {
                        title: "ITEM",
                        field: "item",
                        width: 100,
                        formatter: function (cell) {
                            const rowData = cell.getData();
                            // Si es una fila de descripción, siempre será negro
                            if (rowData.isDescriptionRow) {
                                return `<span style="color: #000000;">${cell.getValue()}</span>`;
                            }
                            const item = rowData.item || "";  // Asegurarse de que 'item' no sea null o undefined
                            const depth = (item.match(/\./g) || []).length;  // Si item es null, usa una cadena vacía
                            const color = TableConfig.utils.getHierarchyColor(rowData, depth);
                            const isBold = rowData.descripcion && rowData.descripcion !== "Descripcion";
                            return `<span style="color: ${color}; font-weight: ${isBold ? 'bold' : 'normal'};">${cell.getValue()}</span>`;
                        }
                    },
                    {
                        title: "DESCRIPCIÓN",
                        field: "descripcion",
                        width: 250,
                        editor: "list",
                        editorParams: (cell) => {
                            const rowData = cell.getData(); // Datos de la fila actual

                            // Calcular la profundidad actual de la jerarquía
                            const depth = rowData.item ? rowData.item.split('.').length : 1;

                            // Generar opciones basadas en la jerarquía
                            const generateOptionsByHierarchy = (list, targetDepth, currentDepth = 1) => {
                                const options = [];
                                list.forEach((item) => {
                                    // Comparar la profundidad actual con la profundidad objetivo
                                    if (currentDepth === targetDepth) {
                                        options.push(item.item); // Agregar solo elementos del nivel actual
                                    }
                                    // Si hay hijos, procesarlos recursivamente
                                    if (item.children) {
                                        options.push(
                                            ...generateOptionsByHierarchy(item.children, targetDepth, currentDepth + 1)
                                        );
                                    }
                                });
                                return options;
                            };

                            // Generar las opciones para la profundidad actual
                            const options = generateOptionsByHierarchy(listaNormativas, depth);

                            return {
                                values: options, // Opciones filtradas por jerarquía
                                autocomplete: true, // Activar autocompletado
                                allowEmpty: true, // Permitir celdas vacías
                                listOnEmpty: true, // Mostrar todos los valores si la entrada está vacía
                                valuesLookup: true, // Lookup de valores dinámicos
                                freetext: true, // Permitir texto libre (no limitado a valores de la lista)
                                multiselect: false, // Desactivar multiselección
                                placeholderLoading: "Cargando opciones...", // Placeholder personalizado
                            };
                        },
                        formatter: function (cell) {
                            const rowData = cell.getData();
                            // Si es una fila de descripción, siempre será negro
                            if (rowData.isDescriptionRow) {
                                return `<span style="color: #000000;">${cell.getValue()}</span>`;
                            }
                            const depth = (rowData.item.match(/\./g) || []).length;
                            const color = TableConfig.utils.getHierarchyColor(rowData, depth);
                            const isBold = rowData.descripcion && rowData.descripcion !== "Descripcion";

                            return `<span style="color: ${color}; font-weight: ${isBold ? 'bold' : 'normal'};">${cell.getValue()}</span>`;
                        }
                    },
                    {
                        title: "Und.", field: "unidad", editor: "list", hozAlign: "center", headerVertical: true,
                        editorParams: { values: unidadValues, autocomplete: true, allowEmpty: true, listOnEmpty: true },
                        cellEdited: function (cell) {
                            const row = cell.getRow();
                            formatRow(row); // Actualizar la fila cuando cambia la unidad
                            calculateRowTotal(row); // Recalcular el total
                        }
                    },
                    {
                        title: "Elem. Simil.", field: "elesimil", editor: "number", hozAlign: "center", headerVertical: true,
                        cellEdited: function (cell) {
                            const row = cell.getRow();
                            calculateRowTotal(row); // Recalcular el total
                        }
                    },
                    {
                        title: "DIMENSIONES",
                        columns: [
                            { title: "Largo", field: "largo", editor: "number", hozAlign: "center", headerVertical: true, cellEdited: onEdit },
                            { title: "Ancho", field: "ancho", editor: "number", hozAlign: "center", headerVertical: true, cellEdited: onEdit },
                            { title: "Alto", field: "alto", editor: "number", hozAlign: "center", headerVertical: true, cellEdited: onEdit }
                        ]
                    },
                    {
                        title: "Nº de Veces", field: "nveces", editor: "number", hozAlign: "center", headerVertical: true, cellEdited: onEdit
                    },
                    {
                        title: "METRADO",
                        columns: [
                            { title: "Lon", field: "longitud", editor: "number", hozAlign: "center", headerVertical: true, cellEdited: onEdit },
                            { title: "Área", field: "area", editor: "number", hozAlign: "center", headerVertical: true, cellEdited: onEdit },
                            {
                                title: "Vol.", field: "volumen", editor: "list", hozAlign: "center", formatter: "money", headerVertical: true, editorParams: { values: unidadesvolumen, autocomplete: true, allowEmpty: true, listOnEmpty: true },
                                cellEdited: function (cell) {
                                    const row = cell.getRow();
                                    formatRow(row); // Actualizar la fila cuando cambia la unidad
                                    calculateRowTotal(row); // Recalcular el total
                                }
                            },
                            { title: "Kg.", field: "kg", editor: "number", hozAlign: "center", headerVertical: true },
                            { title: "Undc.", field: "unidadcalculado", hozAlign: "center", formatter: "money", headerVertical: true }
                        ]
                    },
                    {
                        title: "Total", field: "totalnieto", hozAlign: "center", formatter: "money"
                    },
                    {
                        title: "",
                        formatter: function () {
                            return `<button class="add-row">➕</button> <button class="add-row-descript">➕</button> <button class="delete-row">🗑️</button>`;
                        },
                        width: 100,
                        cellClick: function (e, cell) {
                            const row = cell.getRow();
                            const action = e.target.className;

                            if (action === "add-row") {
                                try {
                                    const parentData = row.getData();
                                    const children = row.getTreeChildren();

                                    // Obtener el siguiente número en orden
                                    const nextItem = getNextNumber(children, parentData.item);

                                    // Validar el orden jerárquico
                                    if (!validateHierarchicalOrder(nextItem)) {
                                        console.error('Error: Orden jerárquico inválido');
                                        return;
                                    }

                                    // Crear la nueva fila
                                    const newRow = {
                                        id: Date.now(),
                                        item: nextItem,
                                        descripcion: "Nueva Fila",
                                        unidad: "",
                                        total: 0,
                                        children: []
                                    };

                                    // Insertar la nueva fila manteniendo el orden
                                    row.addTreeChild(newRow);

                                    // Reordenar los hijos después de insertar
                                    const sortedChildren = children
                                        .map(child => child.getData())
                                        .sort((a, b) => {
                                            if (!a.item) return 1;
                                            if (!b.item) return -1;
                                            return a.item.localeCompare(b.item);
                                        });

                                    // Actualizar el orden en la tabla
                                    children.forEach((child, index) => {
                                        if (sortedChildren[index]) {
                                            child.update(sortedChildren[index]);
                                        }
                                    });

                                } catch (error) {
                                    console.error('Error al agregar fila:', error);
                                }

                            } else if (action === "add-row-descript") {
                                // Crear fila descriptiva (sin afectar numeración)
                                const newRow = {
                                    id: Date.now(),
                                    item: "",
                                    descripcion: "Descripcion",
                                    unidad: "",
                                    total: 0,
                                    isDescriptionRow: true,
                                    children: []
                                };
                                row.addTreeChild(newRow);

                            } else if (action === "delete-row") {
                                const deletedRow = row.getData();

                                if (deletedRow.item && !deletedRow.isDescriptionRow) {
                                    const parent = row.getTreeParent();
                                    if (parent) {
                                        // Obtener y reordenar hermanos numerados
                                        const siblings = parent.getTreeChildren()
                                            .filter(child => {
                                                const childData = child.getData();
                                                return childData.item && !childData.isDescriptionRow;
                                            });

                                        // Eliminar la fila actual
                                        row.delete();

                                        // Renumerar los hermanos restantes
                                        siblings.forEach((sibling, index) => {
                                            if (sibling.getData().id !== deletedRow.id) {
                                                const baseItem = deletedRow.item.split('.').slice(0, -1).join('.');
                                                const newNumber = (index + 1).toString().padStart(2, '0');
                                                sibling.update({
                                                    item: `${baseItem}.${newNumber}`
                                                });
                                            }
                                        });
                                    }
                                } else {
                                    row.delete();
                                }
                            }
                        }
                    },
                ],
                rowFormatter: function (row) {
                    formatRow(row);
                },
                cellEdited: function (cell) {
                    const row = cell.getRow();
                    const editableFields = ["nveces", "longitud", "area", "elesimil", "largo", "ancho", "alto"];

                    if (editableFields.includes(cell.getField())) {
                        try {
                            // Recalcular los valores de la fila actual
                            const data = row.getData();
                            const calculations = TableCalculator.calculateUnidadCalculado(data);
                            row.update({
                                unidadcalculado: calculations.unidadCalculado
                            });

                            // Actualizar los totales jerárquicos
                            table.getRootRows().forEach(rootRow =>
                                TableCalculator.calculateHierarchicalTotals([rootRow])
                            );
                        } catch (error) {
                            console.error("Error al editar celda:", error);
                        }
                    }
                },
                dataTreeRowExpanded: function (row) {
                    TableCalculator.calculateHierarchicalTotals([row]);
                },
                dataTreeRowCollapsed: function () {
                    table.getRootRows().forEach(rootRow =>
                        TableCalculator.calculateHierarchicalTotals([rootRow])
                    );
                },
            });
            // Evento para manejar la edición de una celda
            this.table.on("cellEdited", function (cell) {
                const row = cell.getRow();

                // Encontrar la fila raíz (padre más alto)
                let rootRow = row;
                while (rootRow.getTreeParent()) {
                    rootRow = rootRow.getTreeParent();
                }

                // Actualizar totales desde la raíz
                updateHierarchicalTotals(rootRow);
            });

            // Evento para manejar la carga inicial de datos
            this.table.on("dataLoaded", () => {
                recalculateTableTotals(this.table);
            });

        },

        loadInitialData() {
            // Load sample data
            this.data = [
                {
                    "id": 1,
                    "item": "02",
                    "descripcion": "ESTRUCTURAS",
                    "unidad": null,
                    "elesimil": null,
                    "largo": null,
                    "ancho": null,
                    "alto": null,
                    "nveces": null,
                    "longitud": null,
                    "area": null,
                    "volumen": null,
                    "kg": null,
                    "unidadcalculado": null,
                    "totalnieto": "0.00",
                    "isDescriptionRow": false,
                    "children": []
                }
            ];

            if (this.table) {
                this.table.setData(this.data);
                this.recalculateAll();
            }
        },

        exportData() {
            if (this.table) {
                descrgarExcelMetrados(this.table.getData())
                //this.table.download("xlsx", "metrados.xlsx");
            }
        },

        toggleMode() {
            this.mode = this.mode === 'edit' ? 'view' : 'edit';
            if (this.table) {
                this.table.setEditable(this.mode === 'edit');
            }
        },

        formatValue(value, decimals = 2) {
            return MetradosUtils.formatValue(value, decimals);
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
        }
    }));
}

// Función para colorear y deshabilitar celdas según la unidad seleccionada
function formatRow(row) {
    const data = row.getData();
    const unidad = data.unidad;

    // Limpiar celdas previamente coloreadas/deshabilitadas
    row.getCells().forEach(cell => {
        cell.getElement().style.backgroundColor = "";
        cell.getColumn().getDefinition().editor = "number"; // Rehabilitar editor
    });

    if (fieldsToHighlight[unidad]) {
        // Colorear y habilitar celdas relevantes
        fieldsToHighlight[unidad].forEach(field => {
            const cell = row.getCell(field);
            if (cell) {
                cell.getElement().style.backgroundColor = "yellow";
            }
        });

        // Deshabilitar celdas no relevantes
        row.getCells().forEach(cell => {
            const field = cell.getColumn().getField();
            if (!fieldsToHighlight[unidad].includes(field)) {
                cell.getColumn().getDefinition().editor = false; // Deshabilitar editor
            }
        });
    }
}

// Función genérica para manejar cambios en celdas
function onEdit(cell) {
    const row = cell.getRow();
    calculateRowTotal(row); // Recalcular el total
}

function calculateDescriptiveTotal(row) {
    const data = row.getData();
    if (!data.unidad) {
        row.update({
            total: "0.00",
            totalnieto: "0.00",
            unidadcalculado: "0.00"
        });
        return;
    }

    let total = 0;
    switch (data.unidad) {
        case "Und":
        case "GBL":
            total = (parseFloat(data.nveces) || 0) * (parseFloat(data.elesimil) || 0);
            break;
        // ...otros casos para filas descriptivas...
    }

    row.update({
        total: total.toFixed(2),
        totalnieto: total.toFixed(2),
        unidadcalculado: total.toFixed(2)
    });
}
// Función para recalcular los totales de toda la tabla
function recalculateTableTotals(table) {
    table.getRows().forEach(row => {
        if (!row.getTreeParent()) {
            // Inicia el cálculo desde las filas raíz
            updateHierarchicalTotals(row);
        }
    });
}
// Función para formatear número a dos dígitos
function formatTwoDigits(num) {
    return num.toString().padStart(2, '0');
}
// Función para verificar si una fila debe ser numerada
function shouldNumberRow(rowData) {
    return rowData.item !== null &&
        rowData.item !== undefined &&
        rowData.item !== "";
}
// Función para obtener el siguiente índice disponible
function getNextIndex(siblings, currentIndex) {
    let numberedSiblings = siblings.filter(sibling =>
        shouldNumberRow(sibling.getData())
    );
    return numberedSiblings.length > 0 ? numberedSiblings.length + 1 : 1;
}
// Función para actualizar la numeración después de mover una fila
function updateRowNumbers(table, movedRow) {
    const parentRow = movedRow.getTreeParent();
    let siblings;

    if (parentRow) {
        siblings = parentRow.getTreeChildren();
    } else {
        siblings = table.getRows().filter(row => !row.getTreeParent());
    }

    // Ordenar hermanos por su posición actual en la tabla
    const sortedSiblings = siblings.sort((a, b) => {
        return a.getPosition(true) - b.getPosition(true);
    });

    // Contador para filas numeradas
    let numberedIndex = 1;

    // Actualizar numeración solo para filas que deben ser numeradas
    sortedSiblings.forEach((row) => {
        const rowData = row.getData();

        // Solo actualizar si la fila debe ser numerada
        if (shouldNumberRow(rowData)) {
            const currentPrefix = parentRow ? parentRow.getData().item : '';
            let newItem;

            if (parentRow) {
                // Si tiene padre, agregar el nuevo índice al prefijo existente
                newItem = `${currentPrefix}.${formatTwoDigits(numberedIndex)}`;
            } else {
                // Si es raíz, solo usar el nuevo índice formateado
                newItem = formatTwoDigits(numberedIndex);
            }

            // Actualizar el item de la fila actual
            row.update({ item: newItem }, true);
            numberedIndex++;
        }

        // Siempre actualizar los hijos, independientemente de si la fila actual es numerada
        updateChildrenNumbers(row);
    });

    // Forzar la actualización de la tabla después de todos los cambios
    table.redraw(true);
}
// Función para actualizar recursivamente la numeración de los hijos
function updateChildrenNumbers(parentRow) {
    const children = parentRow.getTreeChildren();
    if (!children || children.length === 0) return;

    let numberedIndex = 1;

    children.forEach((childRow) => {
        const childData = childRow.getData();

        // Solo actualizar si la fila hijo debe ser numerada
        if (shouldNumberRow(childData)) {
            const parentItem = parentRow.getData().item;
            // Solo agregar numeración si el padre tiene item
            if (shouldNumberRow(parentRow.getData())) {
                const newItem = `${parentItem}.${formatTwoDigits(numberedIndex)}`;
                childRow.update({ item: newItem }, true);
                numberedIndex++;
            }
        }

        // Actualizar recursivamente los hijos del hijo
        updateChildrenNumbers(childRow);
    });
}
// Función de cálculo base para las filas hoja
function calculateRowTotal(row) {
    const data = row.getData();
    let unidadcalculado = 0, longitud = 0, volumen = 0, total = 0, kg = 0, area = 0;

    if (data.item && /^\d/.test(data.item)) {
        switch (data.unidad) {
            case "Und":
            case "GBL":
                unidadcalculado = (parseFloat(data.nveces) || 0) * (parseFloat(data.elesimil) || 0);
                row.update({
                    unidadcalculado: unidadcalculado.toFixed(2),
                    longitud: "",
                    area: "",
                    largo: "",
                    ancho: "",
                    alto: "",
                    volumen: "",
                    kg: ""
                });
                total = unidadcalculado;
                break;
            case "kg":
                longitud = (parseFloat(data.elesimil) || 1) *
                    ((parseFloat(data.largo) || 0) +
                        (parseFloat(data.ancho) || 0) +
                        (parseFloat(data.alto) || 0)) *
                    (parseFloat(data.nveces) || 1);

                if (data.volumen && longitud) {
                    kg = longitud * (parseFloat(data.volumen) || 1);
                }

                row.update({
                    longitud: longitud.toFixed(2),
                    kg: kg.toFixed(2),
                    //unidadcalculado: kg.toFixed(2),
                    area: ""
                });

                total = kg;
                break;
            case "m":
                longitud = (parseFloat(data.elesimil) || 1) *
                    ((parseFloat(data.largo) || 0) + (parseFloat(data.ancho) || 0) + (parseFloat(data.alto) || 0)) *
                    (parseFloat(data.nveces) || 1);
                row.update({
                    longitud: longitud.toFixed(2),
                    unidadcalculado: "",
                    volumen: "",
                    kg: "",
                    area: ""
                });
                total = longitud;
                break;
            case "m1":
                longitud = (parseFloat(data.elesimil) || 1) *
                    ((parseFloat(data.largo) || 0) + (parseFloat(data.ancho) || 0)) *
                    (parseFloat(data.alto) || 1);
                row.update({
                    longitud: longitud.toFixed(2),
                    nveces: "",
                    unidadcalculado: "",
                    volumen: "",
                    kg: "",
                    area: ""
                });
                total = longitud;
                break;
            case "m2":
                area = (parseFloat(data.elesimil) || 1) *
                    (parseFloat(data.largo) || 1) *
                    (parseFloat(data.ancho) || 1) *
                    (parseFloat(data.alto) || 1) *
                    (parseFloat(data.nveces) || 1);
                row.update({
                    area: area.toFixed(2),
                    unidadcalculado: "",
                    volumen: "",
                    longitud: "",
                    kg: ""
                });
                total = area;
                break;
            case "m3":
                volumen = (parseFloat(data.elesimil) || 1) *
                    (parseFloat(data.largo) || 1) *
                    (parseFloat(data.ancho) || 1) *
                    (parseFloat(data.alto) || 1) *
                    (parseFloat(data.nveces) || 1);
                row.update({
                    volumen: volumen.toFixed(2),
                    unidadcalculado: "",
                    kg: ""
                });
                total = volumen;
                break;
            default:
                row.update({
                    unidadcalculado: "",
                    longitud: "",
                    volumen: ""
                });
        }

        row.update({ total: total.toFixed(2) });
    }
}
// Function to calculate descriptive children total
function calculateDescriptiveChildrenTotal(row) {
    const children = row.getTreeChildren();
    let descriptiveTotal = 0;

    children.forEach(child => {
        const childData = child.getData();
        if (!childData.item) {
            let unidadcalculado = 0, longitud = 0, volumen = 0, total = 0, kg = 0, area = 0;
            switch (childData.unidad) {
                case "Und":
                case "GBL":
                    unidadcalculado = (parseFloat(childData.nveces) || 0) * (parseFloat(childData.elesimil) || 0);
                    child.update({
                        unidadcalculado: unidadcalculado.toFixed(2),
                        longitud: "",
                        area: "",
                        largo: "",
                        ancho: "",
                        alto: "",
                        volumen: "",
                        kg: ""
                    });
                    total = unidadcalculado;
                    break;
                case "kg":
                    // Corregido: usando childData en lugar de data
                    longitud = (parseFloat(childData.elesimil) || 1) *
                        ((parseFloat(childData.largo) || 0) +
                            (parseFloat(childData.ancho) || 0) +
                            (parseFloat(childData.alto) || 0)) *
                        (parseFloat(childData.nveces) || 1);

                    if (childData.volumen && longitud) {
                        kg = longitud * (parseFloat(childData.volumen) || 1);
                    }

                    child.update({
                        longitud: longitud.toFixed(2),
                        kg: kg.toFixed(2),
                        //unidadcalculado: kg.toFixed(2),
                        area: ""
                    });

                    total = kg;
                    break;
                case "m":
                    longitud = (parseFloat(childData.elesimil) || 1) *
                        ((parseFloat(childData.largo) || 0) + (parseFloat(childData.ancho) || 0) + (parseFloat(childData.alto) || 0)) *
                        (parseFloat(childData.nveces) || 1);
                    child.update({
                        longitud: longitud.toFixed(2),
                        unidadcalculado: "",
                        volumen: "",
                        kg: "",
                        area: ""
                    });
                    total = longitud;
                    break;
                case "m1":
                    longitud = (parseFloat(childData.elesimil) || 1) *
                        ((parseFloat(childData.largo) || 0) + (parseFloat(childData.ancho) || 0)) *
                        (parseFloat(childData.alto) || 1);
                    child.update({
                        longitud: longitud.toFixed(2),
                        nveces: "",
                        unidadcalculado: "",
                        volumen: "",
                        kg: "",
                        area: ""
                    });
                    total = longitud;
                    break;
                case "m2":
                    area = (parseFloat(childData.elesimil) || 1) *
                        (parseFloat(childData.largo) || 1) *
                        (parseFloat(childData.ancho) || 1) *
                        (parseFloat(childData.alto) || 1) *
                        (parseFloat(childData.nveces) || 1);
                    child.update({
                        area: area.toFixed(2),
                        unidadcalculado: "",
                        volumen: "",
                        longitud: "",
                        kg: ""
                    });
                    total = area;
                    break;
                case "m3":
                    volumen = (parseFloat(childData.elesimil) || 1) *
                        (parseFloat(childData.largo) || 1) *
                        (parseFloat(childData.ancho) || 1) *
                        (parseFloat(childData.alto) || 1) *
                        (parseFloat(childData.nveces) || 1);
                    child.update({
                        volumen: volumen.toFixed(2),
                        unidadcalculado: "",
                        kg: ""
                    });
                    total = volumen;
                    break;
                default:
                    child.update({
                        unidadcalculado: "",
                        longitud: "",
                        volumen: ""
                    });
            }

            child.update({ total: total.toFixed(2) });
            descriptiveTotal += total;
        }
    });

    return descriptiveTotal;
}
// Main function to update hierarchical totals
function updateHierarchicalTotals(row) {
    calculateRowTotal(row);
    const descriptiveTotal = calculateDescriptiveChildrenTotal(row);
    const rowTotal = parseFloat(row.getData().total) || 0;
    const finalTotal = rowTotal + descriptiveTotal;

    row.update({
        totalnieto: finalTotal.toFixed(2)
    });

    const children = row.getTreeChildren();
    children.forEach(child => {
        if (child.getData().item && /^\d/.test(child.getData().item)) {
            updateHierarchicalTotals(child);
        }
    });
}

// Agregar función de validación de orden jerárquico
function validateHierarchicalOrder(item) {
    const parts = item.split('.');
    return parts.every((part, index) => {
        // Verificar que cada parte sea un número de dos dígitos
        return /^\d{2}$/.test(part) &&
            // Verificar que el número esté en el rango correcto
            parseInt(part) > 0 &&
            parseInt(part) <= 99;
    });
}

// Función para obtener el siguiente número disponible en orden
function getNextNumber(children, parentItem = '') {
    // Filtrar solo las filas numeradas y ordenarlas
    const numeratedItems = children
        .filter(child => {
            const data = child.getData();
            return data.item && !data.isDescriptionRow;
        })
        .map(child => child.getData().item)
        .sort((a, b) => {
            const partsA = a.split('.');
            const partsB = b.split('.');
            // Comparar cada nivel de la jerarquía
            for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
                const numA = parseInt(partsA[i] || '0');
                const numB = parseInt(partsB[i] || '0');
                if (numA !== numB) return numA - numB;
            }
            return 0;
        });

    // Si no hay items numerados, empezar desde 01
    if (numeratedItems.length === 0) {
        return `${parentItem}${parentItem ? '.' : ''}01`;
    }

    // Obtener el último número usado en este nivel
    const lastItem = numeratedItems[numeratedItems.length - 1];
    const lastNumber = parseInt(lastItem.split('.').pop());

    // Generar el siguiente número
    const nextNumber = (lastNumber + 1).toString().padStart(2, '0');
    return `${parentItem}${parentItem ? '.' : ''}${nextNumber}`;
}

// Función para ordenar los datos del árbol
function sortTreeData(data) {
    // Función para comparar números de item
    function compareItems(a, b) {
        if (!a.item) return 1;  // Items sin numeración van al final
        if (!b.item) return -1;

        const partsA = a.item.split('.');
        const partsB = b.item.split('.');

        // Comparar cada nivel numérico
        for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
            // Si un número no existe en algún nivel, ese item va primero
            if (!partsA[i]) return -1;
            if (!partsB[i]) return 1;

            // Convertir a números para comparación
            const numA = parseInt(partsA[i]);
            const numB = parseInt(partsB[i]);

            if (numA !== numB) {
                return numA - numB;
            }
        }
        return 0;
    }

    // Función recursiva para ordenar el árbol
    function sortRecursive(items) {
        // Separar items numerados y descriptivos
        const numberedItems = items.filter(item => item.item && !item.isDescriptionRow);
        const descriptiveItems = items.filter(item => !item.item || item.isDescriptionRow);

        // Ordenar items numerados
        numberedItems.sort(compareItems);

        // Procesar hijos recursivamente
        const allItems = [...numberedItems, ...descriptiveItems].map(item => {
            if (item.children && item.children.length > 0) {
                return {
                    ...item,
                    children: sortRecursive(item.children)
                };
            }
            return item;
        });

        return allItems;
    }

    // Validar y ordenar el árbol completo
    function validateAndOrderTree(items) {
        let lastItem = '';
        let isValid = true;

        function validateItem(item) {
            if (!item.item || item.isDescriptionRow) return true;

            // Verificar formato XX.XX.XX
            const isValidFormat = /^(\d{2}\.)*\d{2}$/.test(item.item);

            // Verificar orden secuencial
            if (lastItem && item.item) {
                const isValidOrder = item.item > lastItem;
                if (!isValidOrder) {
                    console.warn(`Orden incorrecto detectado: ${lastItem} -> ${item.item}`);
                    isValid = false;
                }
            }

            lastItem = item.item;
            return isValidFormat;
        }

        // Validar estructura recursivamente
        function validateStructure(items) {
            items.forEach(item => {
                if (!validateItem(item)) {
                    console.warn(`Item inválido detectado:`, item);
                    isValid = false;
                }
                if (item.children && item.children.length > 0) {
                    validateStructure(item.children);
                }
            });
        }

        validateStructure(items);
        return isValid;
    }

    // Ordenar los datos
    const sortedData = sortRecursive(data);

    // Validar la estructura
    if (!validateAndOrderTree(sortedData)) {
        console.warn('Se detectaron inconsistencias en la numeración de items');
    }

    return sortedData;
}

function descrgarExcelMetrados(data) {
    console.log(data)
    const dataresumen = ((data));

    const nombre_proyecto = "document.getElementById('nombre_proyecto').value";
    const cui = "document.getElementById('cui').value";
    const codigo_modular = "document.getElementById('codigo_modular').value";
    const codigo_local = "document.getElementById('codigo_local').value";
    const unidad_ejecutora = "document.getElementById('unidad_ejecutora').value";
    const fecha = "document.getElementById('fecha').value";
    const especialidad = "document.getElementById('especialidad').value";
    const modulo = "document.getElementById('modulo').value";
    const localidad = "document.getElementById('localidad').value";

    //Inicio de documento
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Metrado');

    // Estilos generales
    const borderStyle = {
        top: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } },
    };

    const headerStyle = {
        font: { name: 'Arial', size: 10, bold: true },
        alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
        border: borderStyle,
    };

    const bodyStyle = {
        font: { name: 'Arial', size: 10 },
        alignment: { horizontal: 'left', vertical: 'middle' },
        border: borderStyle,
    };

    const bodysStyle = {
        font: { name: 'Arial', size: 10 },
        alignment: { horizontal: 'center', vertical: 'middle' },
        border: borderStyle,
    };

    const bodyStylenumb = {
        font: { name: 'Arial', size: 10 },
        alignment: { horizontal: 'right', vertical: 'middle' },
        border: borderStyle,
    };

    // Modificar el estilo del título para incluir borde completo
    const titleStyle = {
        font: { name: 'Arial', size: 12, bold: true },
        alignment: { horizontal: 'center', vertical: 'middle' },
        border: borderStyle,
        fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF' }
        }
    };

    // Modificar el estilo de descripción para el contenido sin bordes
    const descriptionContentStyle = {
        font: { name: 'Arial', size: 10 },
        alignment: { vertical: 'middle', horizontal: 'left' },
        fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF' }
        },
        border: null // Aseguramos que no haya bordes
    };

    // Modificar el estilo para la sección de descripción completa
    const descriptionContainerStyle = {
        font: { name: 'Arial', size: 10 },
        alignment: { vertical: 'middle', horizontal: 'left' },
        fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF' }
        },
        border: {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
        }
    };

    // Ancho de columnas
    worksheet.columns = [
        { width: 4 },  // A
        { width: 4 },  // B
        { width: 15 },  // C
        { width: 50 }, // D
        { width: 6 },  // E
        { width: 6 },  // F
        { width: 8 },  // G
        { width: 8 },  // H
        { width: 8 },  // I
        { width: 12 }, // J
        { width: 8 },  // K
        { width: 8 },  // L
        { width: 8 },  // M
        { width: 8 },  // N
        { width: 8 },  // O
        { width: 8 },  // P
        { width: 4 },  // Q
    ];

    // Imagen en base64 (Reemplaza esto con tu imagen convertida a base64)
    const base64Image = 'data:image/jpeg;base64,';
    // Agregar la imagen al workbook
    const imageId1 = workbook.addImage({
        base64: base64Image,
        extension: 'png',
    });

    // Ajustar la imagen al rango C2:P2
    worksheet.addImage(imageId1, {
        tl: { col: 2, row: 1 }, // Columna y fila (C2 equivale a col: 2 y row: 1 en ExcelJS)
        br: { col: 16, row: 2 }, // P2 equivale a col: 16 y row: 2
    });

    // Ajustar la altura de la fila 2 para que acomode correctamente la imagen
    worksheet.getRow(2).height = 100; // Altura en puntos (puedes ajustar según sea necesario)

    // Título principal
    worksheet.mergeCells('C3:P3');
    worksheet.getCell('C3').value = 'METRADO DE ESTRUCTURAS';
    worksheet.getCell('C3').style = titleStyle;

    //INICIO DE DESCRIPCION
    // Crear un borde exterior para toda la sección de descripción
    worksheet.getCell('C5:P11').style = descriptionContainerStyle;

    // Aplicar estilos individuales sin bordes
    for (let row = 5; row <= 11; row++) {
        for (let col = 3; col <= 16; col++) {
            worksheet.getCell(row, col).style = descriptionContentStyle;
        }
    }

    // Información del proyecto con salto de línea
    worksheet.mergeCells('C5:C6');
    worksheet.getCell('C5').value = 'Proyecto:';
    worksheet.getCell('C5').style = {
        ...descriptionContentStyle,
        alignment: { vertical: 'middle', horizontal: 'left' }
    };

    // Función mejorada para formatear el texto del proyecto
    function formatearTextoProyecto(texto) {
        // Dividir el texto en palabras
        const palabras = texto.split(' ');
        const mitad = Math.ceil(palabras.length / 2);

        // Unir las palabras en dos líneas
        const primeraLinea = palabras.slice(0, mitad).join(' ');
        const segundaLinea = palabras.slice(mitad).join(' ');

        return `${primeraLinea}\n${segundaLinea}`;
    }

    // Estilo específico para el nombre del proyecto
    const projectNameStyle = {
        font: { name: 'Arial', size: 10 },
        alignment: {
            vertical: 'middle',
            horizontal: 'left',
            wrapText: true
        },
        fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF' }
        },
        border: null
    };

    // Para la hoja principal
    worksheet.mergeCells('D5:P6');
    const cellD5 = worksheet.getCell('D5');
    cellD5.value = `"${formatearTextoProyecto(nombre_proyecto)}"`;
    cellD5.style = projectNameStyle;
    worksheet.getRow(5).height = 30; // Aumentar altura de la primera fila
    worksheet.getRow(6).height = 30; // Aumentar altura de la segunda fila

    // Información del propietario
    worksheet.mergeCells('C7');
    worksheet.getCell('C7').value = 'Propietario:';
    worksheet.getCell('C7').style = descriptionContentStyle;

    worksheet.mergeCells('D7');
    worksheet.getCell('D7').value = `${unidad_ejecutora}`;
    worksheet.getCell('D7').style = descriptionContentStyle;

    // Información del hecho por
    worksheet.mergeCells('L7');
    worksheet.getCell('L7').value = 'Hecho por:';
    worksheet.getCell('L7').style = descriptionContentStyle;

    worksheet.mergeCells('M7:P7');
    worksheet.getCell('M7').value = '';
    worksheet.getCell('M7').style = descriptionContentStyle;

    // Información del revisado por
    worksheet.mergeCells('L8');
    worksheet.getCell('L8').value = 'Revisado por:';
    worksheet.getCell('L8').style = descriptionContentStyle;

    worksheet.mergeCells('M8:P8');
    worksheet.getCell('M8').value = '';
    worksheet.getCell('M8').style = descriptionContentStyle;

    // Información de la fecha
    worksheet.mergeCells('C8');
    worksheet.getCell('C8').value = 'Fecha:';
    worksheet.getCell('C8').style = descriptionContentStyle;

    worksheet.mergeCells('D8');
    worksheet.getCell('D8').value = formatearFecha(fecha);
    worksheet.getCell('D8').style = {
        ...descriptionContentStyle,
        alignment: { vertical: 'middle', horizontal: 'left' }
    };

    // Información de la especialidad
    worksheet.mergeCells('C9');
    worksheet.getCell('C9').value = 'Especialidad:';
    worksheet.getCell('C9').style = descriptionContentStyle;

    worksheet.mergeCells('D9');
    worksheet.getCell('D9').value = `${especialidad}`;
    worksheet.getCell('D9').style = descriptionContentStyle;

    // Información del módulo
    worksheet.mergeCells('C10');
    worksheet.getCell('C10').value = 'Modulo:';
    worksheet.getCell('C10').style = descriptionContentStyle;

    worksheet.mergeCells('D10');
    worksheet.getCell('D10').value = `${modulo}`;
    worksheet.getCell('D10').style = descriptionContentStyle;

    worksheet.addRow([]); // Espacio vacío

    // Encabezado de la tabla (modificado para evitar fusiones redundantes)
    worksheet.mergeCells('C14:C15'); // ITEM
    worksheet.mergeCells('D14:D15'); // DESCRIPCIÓN
    worksheet.mergeCells('E14:E15'); // Und
    worksheet.mergeCells('F14:F15'); // Simb
    worksheet.mergeCells('G14:I14'); // DIMENSIONES
    worksheet.mergeCells('J14:J15'); // Elem. Simil.
    worksheet.mergeCells('K14:O14'); // METRADO
    worksheet.mergeCells('P14:P15'); // TOTAL

    worksheet.getCell('C14').value = 'ITEM';
    worksheet.getCell('D14').value = 'DESCRIPCIÓN';
    worksheet.getCell('E14').value = 'Und';
    worksheet.getCell('F14').value = 'Elem. Simil.';
    worksheet.getCell('G14').value = 'DIMENSIONES';
    worksheet.getCell('J14').value = 'Nº de Veces';
    worksheet.getCell('K14').value = 'METRADO';
    worksheet.getCell('P14').value = 'TOTAL';

    worksheet.getRow(14).eachCell((cell) => (cell.style = headerStyle));

    // Sub-encabezados
    worksheet.getCell('G15').value = 'Largo';
    worksheet.getCell('H15').value = 'Ancho';
    worksheet.getCell('I15').value = 'Alto';
    worksheet.getCell('K15').value = 'Lon.';
    worksheet.getCell('L15').value = 'Área';
    worksheet.getCell('M15').value = 'Vol.';
    worksheet.getCell('N15').value = 'Kg.';
    worksheet.getCell('O15').value = 'Und.';

    worksheet.getRow(15).eachCell((cell) => (cell.style = headerStyle));

    // Contenido de la tabla
    worksheet.addRow([]);

    // Llenado de datos en la tabla
    let currentRow = 17; // Comienza en la fila 16 después del encabezado

    const colorStyles = {
        morado: {
            font: {
                name: 'Arial',
                size: 10,
                bold: true,
                color: { argb: '800080' } // Morado
            }
        },
        rojo: {
            font: {
                name: 'Arial',
                size: 10,
                bold: true,
                color: { argb: 'FF0000' } // Rojo
            }
        },
        azul: {
            font: {
                name: 'Arial',
                size: 10,
                bold: true,
                color: { argb: '0000FF' } // Azul
            }
        },
        verde: {
            font: {
                name: 'Arial',
                size: 10,
                bold: true,
                color: { argb: '008000' } // Verde
            }
        },
        negro: {
            font: {
                name: 'Arial',
                size: 10,
                bold: true,
                color: { argb: '000000' } // Negro
            }
        }
    };

    // Reemplazar la función getColorStyle con esta versión:
    function getColorStyle(item) {
        if (!item || item === '' || item === undefined) {
            return colorStyles.negro;
        }

        // Función auxiliar para verificar si es un par válido (XX)
        const isValidPair = (pair) => {
            return pair && pair.length === 2 && !isNaN(Number(pair));
        };

        // Dividir el item por puntos y contar pares válidos
        const parts = item.split('.');
        let validPairs = 0;

        for (const part of parts) {
            if (isValidPair(part)) {
                validPairs++;
            }
        }

        // Verificar si existe un siguiente nivel con un par válido más
        const hasNextLevel = (itemToCheck) => {
            const base = itemToCheck.split('.').slice(0, -1).join('.') + '.';
            return data.some(item =>
                item.item &&
                item.item.startsWith(base) &&
                item.item.split('.').filter(isValidPair).length > validPairs
            );
        };

        switch (validPairs) {
            case 1: // XX
                return colorStyles.morado;
            case 2: // XX.XX
                return colorStyles.rojo;
            case 3: // XX.XX.XX
                return colorStyles.azul;
            case 4: // XX.XX.XX.XX
                // Si tiene un quinto nivel, usar verde; si no, negro
                return hasNextLevel(item) ? colorStyles.verde : colorStyles.negro;
            case 5: // XX.XX.XX.XX.XX
                return colorStyles.negro;
            default:
                return colorStyles.negro;
        }
    }

    // Modificar la función addRowRecursive para aplicar los colores
    function addRowRecursive(data, level = 0) {
        data.forEach((item) => {
            // Crear una fila para el elemento actual
            worksheet.addRow([
                '', // Columna A
                '', // Columna B
                item.item || '', // ITEM - Columna C
                item.descripcion || '', // DESCRIPCIÓN - Columna D
                item.unidad || '', // Und - Columna E
                item.elesimil || '', // elemn simil - Columna F
                item.largo || '', // Largo - Columna G
                item.ancho || '', // Ancho - Columna H
                item.alto || '', // Alto - Columna I
                item.nveces || '', // Elem. n veces. - Columna J
                item.longitud || '', // Lon. - Columna K
                item.area || '', // Área - Columna L
                item.volumen || '', // Vol. - Columna M
                item.kg || '', // Kg. - Columna N
                //item.unidadcalculado || '', // Und. - Columna O
                item.unidadcalculado = (item.unidadcalculado === 0 || item.unidadcalculado === "0.00" || item.unidadcalculado === "" || item.unidadcalculado === undefined) ? '' : item.unidadcalculado || '',

                item.totalnieto = (item.totalnieto === 0 ||
                    item.totalnieto === "0.00" ||
                    item.totalnieto === "" ||
                    item.totalnieto === undefined) ? '' :
                    item.totalnieto || '',
            ]);

            // Aplicar estilos a la fila actual
            worksheet.getRow(currentRow).eachCell((cell, colNumber) => {
                //cell.style = bodyStyle;

                // Aplicar negrita a las columnas ITEM y DESCRIPCIÓN (C y D)
                if (colNumber === 3 || colNumber === 4) {
                    const colorStyle = getColorStyle(item.item);
                    cell.style = {
                        ...bodyStyle,
                        font: colorStyle.font,
                        border: {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        }
                    };
                }

                if (colNumber === 5) {
                    cell.style = { ...bodysStyle, font: { bold: true } };
                }

                if (colNumber === 6 || colNumber === 7 || colNumber === 8 || colNumber === 9 || colNumber === 10
                    || colNumber === 11 || colNumber === 12 || colNumber === 13 || colNumber === 14 || colNumber === 15
                    || colNumber === 16
                ) {
                    cell.style = { ...bodyStylenumb, font: { bold: true } };
                }

                // Aplicar bordes solo a las columnas C a P
                if (colNumber >= 3 && colNumber <= 16) {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                }
            });

            currentRow++;

            // Si hay hijos (children), llamamos recursivamente a la función
            if (item.children && item.children.length > 0) {
                addRowRecursive(item.children, level + 1);
            }
        });
    }

    // Llamar a la función con los datos iniciales
    addRowRecursive(data);

    // Modificar el aplicador de bordes generales para excluir la sección de descripción
    worksheet.eachRow((row, rowNumber) => {
        if ((rowNumber >= 3 && rowNumber <= 4) || (rowNumber >= 14 && rowNumber <= 15)) {
            row.eachCell((cell) => {
                cell.border = borderStyle;
            });
        }
    });

    // Crear nueva hoja de cálculo "Resumen"
    const resumenSheet = workbook.addWorksheet('Resumen');

    resumenSheet.columns = [
        { width: 4 },  // A
        { width: 4 },  // B
        { width: 15 },  // C
        { width: 90 }, // D
        { width: 6 },  // E
        { width: 8 },  // F
        { width: 12 },  // G
        { width: 4 },  // H
    ];

    // Agregar la imagen al workbook
    const imageId2 = workbook.addImage({
        base64: base64Image,
        extension: 'png',
    });

    // Ajustar la imagen al rango C2:P2
    resumenSheet.addImage(imageId2, {
        tl: { col: 2, row: 1 }, // Columna y fila (C2 equivale a col: 2 y row: 1 en ExcelJS)
        br: { col: 7, row: 2 }, // P2 equivale a col: 16 y row: 2
    });

    // Ajustar la altura de la fila 2 para que acomode correctamente la imagen
    resumenSheet.getRow(2).height = 97; // Altura en puntos (puedes ajustar según sea necesario)

    // Copiar encabezado a la nueva hoja
    resumenSheet.mergeCells('C3:G3');
    resumenSheet.getCell('C3').value = 'RESUMEN DE METRADO DE OBRAS PROVISIONALES';
    resumenSheet.getCell('C3').style = titleStyle;

    // Aplicar el mismo patrón para la sección de descripción
    resumenSheet.getCell('C5:G11').style = descriptionContainerStyle;

    for (let row = 5; row <= 11; row++) {
        for (let col = 3; col <= 7; col++) {
            resumenSheet.getCell(row, col).style = descriptionContentStyle;
        }
    }

    resumenSheet.mergeCells('C5:C6');
    resumenSheet.getCell('C5').value = 'Proyecto:';
    resumenSheet.getCell('C5').style = descriptionContentStyle;

    // Información del proyecto con salto de línea en la hoja resumen
    resumenSheet.mergeCells('D5:G6');
    const cellResumenD5 = resumenSheet.getCell('D5');
    cellResumenD5.value = `"${formatearTextoProyecto(nombre_proyecto)}"`;
    cellResumenD5.style = projectNameStyle;
    resumenSheet.getRow(5).height = 30;
    resumenSheet.getRow(6).height = 30;

    resumenSheet.mergeCells('C7');
    resumenSheet.getCell('C7').value = 'Propietario:';
    resumenSheet.getCell('C7').style = descriptionContentStyle;

    resumenSheet.mergeCells('D7');
    resumenSheet.getCell('D7').value = `${unidad_ejecutora}`;
    resumenSheet.getCell('D7').style = descriptionContentStyle;

    resumenSheet.mergeCells('C8');
    resumenSheet.getCell('C8').value = 'Fecha:';
    resumenSheet.getCell('C8').style = descriptionContentStyle;

    resumenSheet.mergeCells('D8');
    resumenSheet.getCell('D8').value = formatearFecha(fecha);
    resumenSheet.getCell('D8').style = {
        ...descriptionContentStyle,
        alignment: { vertical: 'middle', horizontal: 'left' }
    };

    resumenSheet.mergeCells('C9');
    resumenSheet.getCell('C9').value = 'Especialidad:';
    resumenSheet.getCell('C9').style = descriptionContentStyle;

    resumenSheet.mergeCells('D9');
    resumenSheet.getCell('D9').value = `${especialidad}`;
    resumenSheet.getCell('D9').style = descriptionContentStyle;

    resumenSheet.mergeCells('C10');
    resumenSheet.getCell('C10').value = 'Modulo:';
    resumenSheet.getCell('C10').style = descriptionContentStyle;

    resumenSheet.mergeCells('D10');
    resumenSheet.getCell('D10').value = `${modulo}`;
    resumenSheet.getCell('D10').style = descriptionContentStyle;

    resumenSheet.addRow([]); // Espacio vacío

    // Encabezado de la tabla para "Resumen"
    resumenSheet.mergeCells('C14:C15'); // ITEM
    resumenSheet.mergeCells('D14:D15'); // DESCRIPCIÓN
    resumenSheet.mergeCells('E14:E15'); // Und
    resumenSheet.mergeCells('F14:F15'); // Parcial
    resumenSheet.mergeCells('G14:G15'); // Total

    resumenSheet.getCell('C14').value = 'ITEM';
    resumenSheet.getCell('D14').value = 'DESCRIPCIÓN';
    resumenSheet.getCell('E14').value = 'Und';
    resumenSheet.getCell('F14').value = 'Parcial';
    resumenSheet.getCell('G14').value = 'Total';

    resumenSheet.getRow(14).eachCell((cell) => (cell.style = headerStyle));

    // Llenado de datos en la hoja "Resumen"
    let resumenRow = 16; // Comienza en la fila 16 después del encabezado
    function addRowRecursiveresumen(data, level = 0) {
        data.forEach((item) => {
            resumenSheet.addRow([
                '',
                '',
                item.item || '', // ITEM - Columna C
                item.descripcion || '', // DESCRIPCIÓN - Columna D
                item.unidad || '', // Und - Columna E
                item.parcial || item.totalnieto || '', // Parcial - Columna F
                item.total || '' // Total - Columna G
            ]);

            resumenSheet.getRow(resumenRow).eachCell((cell, colNumber) => {
                //cell.style = bodyStyle;
                // Aplicar negrita a las columnas ITEM y DESCRIPCIÓN (C y D)
                if (colNumber === 3 || colNumber === 4) {
                    const colorStyle = getColorStyle(item.item);
                    cell.style = {
                        ...bodyStyle,
                        font: colorStyle.font,
                        border: {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        }
                    };
                }

                if (colNumber === 5) {
                    cell.style = { ...bodysStyle, font: { bold: true } };
                }

                if (colNumber === 6 || colNumber === 7
                ) {
                    cell.style = { ...bodyStylenumb, font: { bold: true } };
                }

                if (colNumber >= 3 && colNumber <= 7) {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                }
            });

            resumenRow++;

            // Si hay hijos (children), llamamos recursivamente a la función
            if (item.children && item.children.length > 0) {
                addRowRecursive(item.children, level + 1);
            }
        });
    };
    addRowRecursiveresumen(dataresumen);
    // Modificar también los bordes generales en la hoja de resumen
    resumenSheet.eachRow((row, rowNumber) => {
        if ((rowNumber >= 3 && rowNumber <= 4) || (rowNumber >= 14 && rowNumber <= 15)) {
            row.eachCell((cell) => {
                cell.border = borderStyle;
            });
        }
    });

    // Añadir borde exterior para toda la sección de descripción
    const rangeDescription = worksheet.getCell('C5:P11');
    worksheet.getCell('C5:P11').style = {
        border: {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
        }
    };

    // Para la hoja de resumen
    const rangeDescriptionResumen = resumenSheet.getCell('C5:G11');
    resumenSheet.getCell('C5:G11').style = {
        border: {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
        }
    };

    // Crear borde exterior para la sección de descripción usando las esquinas
    const descriptionBorderStyle = {
        font: { name: 'Arial', size: 10 },
        alignment: { vertical: 'middle', horizontal: 'left' },
        fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF' }
        }
    };

    // Aplicar bordes a las esquinas y lados
    // Esquina superior izquierda
    worksheet.getCell('C5').style = {
        ...descriptionBorderStyle,
        border: {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } }
        }
    };

    // Esquina superior derecha
    worksheet.getCell('P5').style = {
        ...descriptionBorderStyle,
        border: {
            top: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
        }
    };

    // Esquina inferior izquierda
    worksheet.getCell('C11').style = {
        ...descriptionBorderStyle,
        border: {
            bottom: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } }
        }
    };

    // Esquina inferior derecha
    worksheet.getCell('P11').style = {
        ...descriptionBorderStyle,
        border: {
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
        }
    };

    // Borde superior
    for (let col = 4; col <= 15; col++) {
        worksheet.getCell(5, col).style = {
            ...descriptionBorderStyle,
            border: {
                top: { style: 'thin', color: { argb: '000000' } }
            }
        };
    }

    // Borde inferior
    for (let col = 4; col <= 15; col++) {
        worksheet.getCell(11, col).style = {
            ...descriptionBorderStyle,
            border: {
                bottom: { style: 'thin', color: { argb: '000000' } }
            }
        };
    }

    // Bordes laterales
    for (let row = 6; row <= 10; row++) {
        // Borde izquierdo
        worksheet.getCell(row, 3).style = {
            ...descriptionBorderStyle,
            border: {
                left: { style: 'thin', color: { argb: '000000' } }
            }
        };

        // Borde derecho
        worksheet.getCell(row, 16).style = {
            ...descriptionBorderStyle,
            border: {
                right: { style: 'thin', color: { argb: '000000' } }
            }
        };
    }

    resumenSheet.getCell('C5').style = {
        ...descriptionBorderStyle,
        border: {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } }
        }
    };

    // Esquina superior derecha
    resumenSheet.getCell('G5').style = {
        ...descriptionBorderStyle,
        border: {
            top: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
        }
    };

    // Esquina inferior izquierda
    resumenSheet.getCell('C11').style = {
        ...descriptionBorderStyle,
        border: {
            bottom: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } }
        }
    };

    // Esquina inferior derecha
    resumenSheet.getCell('G11').style = {
        ...descriptionBorderStyle,
        border: {
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
        }
    };

    // Borde superior
    for (let col = 4; col <= 6; col++) {
        resumenSheet.getCell(5, col).style = {
            ...descriptionBorderStyle,
            border: {
                top: { style: 'thin', color: { argb: '000000' } }
            }
        };
    }

    // Borde inferior
    for (let col = 4; col <= 6; col++) {
        resumenSheet.getCell(11, col).style = {
            ...descriptionBorderStyle,
            border: {
                bottom: { style: 'thin', color: { argb: '000000' } }
            }
        };
    }

    // Bordes laterales
    for (let row = 6; row <= 10; row++) {
        // Borde izquierdo
        resumenSheet.getCell(row, 3).style = {
            ...descriptionBorderStyle,
            border: {
                left: { style: 'thin', color: { argb: '000000' } }
            }
        };

        // Borde derecho
        resumenSheet.getCell(row, 7).style = {
            ...descriptionBorderStyle,
            border: {
                right: { style: 'thin', color: { argb: '000000' } }
            }
        };
    }

    // Función para formatear la fecha
    function formatearFecha(fechaStr) {
        const fecha = new Date(fechaStr);
        const meses = [
            'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
            'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
        ];
        return `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
    }

    // Exportar archivo
    workbook.xlsx.writeBuffer().then(function (data) {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'metrado_instalaciones.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
    });
}
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initMetradosModule);