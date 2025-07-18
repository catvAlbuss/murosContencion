function initdibujoModule() {
    const dibujo = document.getElementById('dibujo-content');
    if (!dibujo) {
        console.error('Contenedor dibujo no encontrado');
        return;
    }

    dibujo.innerHTML = `
        <div x-data="dibujoModule()" class="cuaderno p-4 max-w-full mx-auto font-mono">
            <div class="max-w-full mx-auto">
                <div class="cuaderno bg-white rounded-lg shadow-lg overflow-hidden">
                    <!-- Contenido principal -->
                    <div class="">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <h3 class="text-center text-gray-950"><strong>DISTRIBUCION DEL REFUERZO</strong></h3>
                                <div id="graficoFinal" class="border border-gray-300 rounded-lg shadow-md overflow-hidden"></div>
                            </div>

                            <div>
                                <h3 class="text-center text-gray-950"><strong>DIAGRAMA DE MOMENTOS FLECTORES</strong></h3>
                                <div id="DiagramaMomentosFlectores" class="border border-gray-300 rounded-lg shadow-md overflow-hidden"></div>
                            </div>

                            <div>
                                <h3 class="text-center text-gray-950"><strong>DIAGRAMA DE FUERZAS CORTANTES</strong></h3>
                                <div id="DiagramaFuerzaCortante" class="border border-gray-300 rounded-lg shadow-md overflow-hidden"></div>
                            </div>
                        </div>
                    </div>
                </div>       
            </div>         
        </div>
    `;

    Alpine.data('dibujoModule', () => ({
        errors: [],
        Data: {
            inputHd: 1,
            basem: 3.60,
            b1graf: 2,
            hzgraf: 1,
            inputh: 8.5,
            epgraf: 0.15,
            egraf: 0.2,
            b2graf: 1.25,
            considerar: 'si',
            acertrans: 0.71,
            valor1: 1,
            acertransName: '3/8',
            asverftrans: 25,
            dentelloncorr: 0.8,
            mupant: 50,
            mupun: 50,
            mutal: 50,
            mukey: 50,
            //cortantes
            vupant: 50,
            vupun: 50,
            vutal: 50,
            vukey: 50
        },

        init() {
            this.graficoMC();
            this.graficoMomentosFlectores();
            this.graficoFuerzasCortante();
        },

        graficoMC() {
            const {
                inputHd, basem, b1graf, hzgraf, inputh,
                epgraf, egraf, b2graf, considerar, acertrans, valor1, acertransName, asverftrans
            } = this.Data;
            const self = this; // Guardamos el contexto de Alpine
            let colorMode = "light";
            let svgElement, xAxisElement, yAxisElement, pathElement, pointElements;
            let xScale, yScale; // Declare scales globally

            const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

            function handleColorModeChange(event) {
                colorMode = event.matches ? "dark" : "light";
                if (svgElement) refreshGraph(); // Actualizar el gráfico si ya existe
            }

            darkModeQuery.addListener(handleColorModeChange);
            handleColorModeChange(darkModeQuery);

            const chartMargin = { top: 20, right: 20, bottom: 30, left: 40 };
            const chartWidth = 600 - chartMargin.left - chartMargin.right;
            const chartHeight = 600 - chartMargin.top - chartMargin.bottom;

            function initializeGraph() {
                // Eliminar cualquier gráfico existente antes de crear uno nuevo
                d3.select("#graficoFinal svg").remove();

                // Crear nuevo gráfico
                svgElement = d3
                    .select("#graficoFinal")
                    .append("svg")
                    .attr("width", chartWidth + chartMargin.left + chartMargin.right)
                    .attr("height", chartHeight + chartMargin.top + chartMargin.bottom)
                    .append("g")
                    .attr("transform", `translate(${chartMargin.left},${chartMargin.top})`);

                xScale = d3.scaleLinear().range([0, chartWidth]);
                yScale = d3.scaleLinear().range([chartHeight, 0]);

                xAxisElement = svgElement.append("g").attr("transform", `translate(0,${chartHeight})`).attr("class", "x-axis");

                yAxisElement = svgElement.append("g").attr("class", "y-axis");

                pathElement = svgElement.append("path").attr("fill", "none").attr("stroke-width", 1.5);

                refreshGraph();
            }

            function refreshGraph() {
                const graphData = self.puntosMurosCon(
                    inputHd, basem, b1graf, hzgraf, inputh,
                    epgraf, egraf, b2graf, considerar,
                    acertrans, valor1, acertransName, asverftrans
                );

                // Calcular el dominio global para todos los datasets
                const allPoints = graphData.flat(); // Combina todos los arrays en uno solo
                xScale.domain([0, d3.max(allPoints, (d) => d.x) * 1.8]);
                yScale.domain([0, d3.max(allPoints, (d) => d.y) * 1.1]);

                // Actualiza los ejes
                xAxisElement.call(d3.axisBottom(xScale));
                yAxisElement.call(d3.axisLeft(yScale));

                // Elimina cualquier gráfico previo
                svgElement.selectAll(".graph-line").remove(); // Remover caminos anteriores
                svgElement.selectAll(".acero-circle").remove(); // Remueve círculos anteriores si los hubiera

                graphData.forEach((dataPoints, index) => {
                    const lineGenerator = d3
                        .line()
                        .x((d) => xScale(d.x))
                        .y((d) => yScale(d.y));

                    // Crear un nuevo path para cada conjunto de datos
                    svgElement
                        .append("path")
                        .datum(dataPoints)
                        .attr("class", "graph-line") // Añadir clase para identificar
                        .attr("fill", "none")
                        .attr("stroke", "steelblue") // Podrías cambiar este color dinámicamente si quieres
                        .attr("stroke-width", 1.5)
                        .attr("d", lineGenerator);

                    // Agregar puntos para cada gráfico
                    svgElement
                        .selectAll(`.data-point-${index}`)
                        .data(dataPoints)
                        .enter()
                        .append("circle")
                        .attr("class", `data-point-${index}`) // Usamos clases únicas por gráfico
                        .attr("r", 3)
                        .attr("cx", (d) => xScale(d.x))
                        .attr("cy", (d) => yScale(d.y))
                        .attr("fill", "steelblue"); // Podrías cambiar esto dinámicamente también
                });

                // =========================== CÍRCULOS DE ACERO ===========================
                const radio = acertrans; // Radio en pulgadas
                const dataEnd = graphData[5];
                // 1. Círculos de acero - primer conjunto
                const cantidadAcero1 = (basem * 100 - 15) / asverftrans;
                const distanciaEntreCirculos1 = asverftrans / 10.5;

                for (let i = 0; i < cantidadAcero1; i++) {
                    svgElement
                        .append("circle")
                        .attr("class", "acero-circle")
                        .attr("cx", xScale(12.5 + i * distanciaEntreCirculos1)) // Usar escala para X
                        .attr("cy", yScale(10 + 1.5)) // Usar escala para Y
                        .attr("r", radio)
                        .attr("fill", "purple")
                        .attr("stroke", "purple")
                        .attr("stroke-width", 1);
                }

                // 2. Círculos de acero - segundo conjunto
                const cantidadAcero2 = (basem * 100 - 15) / asverftrans;
                const distanciaEntreCirculos2 = asverftrans / 10.5;
                for (let i = 0; i < cantidadAcero2; i++) {
                    svgElement
                        .append("circle")
                        .attr("class", "acero-circle")
                        .attr("cx", xScale(12.5 + i * distanciaEntreCirculos2))
                        .attr("cy", yScale(dataEnd[4].puntov5y + 0.5))
                        .attr("r", radio)
                        .attr("fill", "green")
                        .attr("stroke", "green")
                        .attr("stroke-width", 1);
                }

                // 3. Círculos de acero - tercer conjunto
                const distanciaizq = dataEnd[1].puntoh3y - dataEnd[2].puntoh1y;
                const cantidadAcero3 = distanciaizq / (asverftrans / 10.5);
                const distanciaEntreCirculos3 = asverftrans / 10.5;
                for (let i = 0; i < cantidadAcero3; i++) {
                    svgElement
                        .append("circle")
                        .attr("class", "acero-circle")
                        .attr("cx", xScale(dataEnd[0].puntoh3x + 0.5))
                        .attr("cy", yScale(2 + i * distanciaEntreCirculos3))
                        .attr("r", radio)
                        .attr("fill", "blue")
                        .attr("stroke", "blue")
                        .attr("stroke-width", 1);
                }

                // 4. Círculos de acero - cuarto conjunto (coordenadas dinámicas)
                const distanciaizqarriba = parseFloat(dataEnd[7].puntoh9y) - parseFloat(dataEnd[4].puntov5y);
                const cantidadAcero4 = distanciaizqarriba / (asverftrans / 10.5);
                const distanciaEntreCirculos4 = asverftrans / 10.5;
                const puntoInicioX = dataEnd[0].puntoh3x + 0.5;
                const puntoLlegadaX = dataEnd[5].puntoh6x;
                for (let i = 0; i < cantidadAcero4; i++) {
                    svgElement
                        .append("circle")
                        .attr("class", "acero-circle")
                        .attr("cx", xScale(puntoInicioX + (puntoLlegadaX - puntoInicioX) * (i / cantidadAcero4)))
                        .attr("cy", yScale(+0.5 + dataEnd[1].puntoh3y + i * distanciaEntreCirculos4))
                        .attr("r", radio)
                        .attr("fill", "yellow")
                        .attr("stroke", "yellow")
                        .attr("stroke-width", 1);
                }

                // 5. Círculos de acero - quinto conjunto
                const distancia = dataEnd[7].puntoh9y - dataEnd[6].puntoh6y;
                const cantidadAcero5 = distancia / (asverftrans / 10.5);
                const distanciaEntreCirculos5 = asverftrans / 10.5;
                for (let i = 0; i < cantidadAcero5; i++) {
                    svgElement
                        .append("circle")
                        .attr("class", "acero-circle")
                        .attr("cx", xScale(dataEnd[5].puntoh6x))
                        .attr("cy", yScale(dataEnd[6].puntoh6y + 0.5 + i * distanciaEntreCirculos5))
                        .attr("r", radio)
                        .attr("fill", "red")
                        .attr("stroke", "red")
                        .attr("stroke-width", 1);
                }
                // Cambiar colores de fondo y líneas según el modo
                const bgColor = colorMode === "dark" ? "#1b1e23" : "#1b1e23";
                const textColor = colorMode === "dark" ? "#1b1e23" : "#1b1e23";
                const graphColor = colorMode === "dark" ? "lightsteelblue" : "steelblue";

                d3.select("body").style("background-color", bgColor);
                svgElement.style("color", textColor);
                xAxisElement.style("color", textColor);
                yAxisElement.style("color", textColor);
            }

            initializeGraph(); // Inicializar el gráfico solo una vez
        },

        puntosMurosCon(
            inputHd,
            basem,
            b1graf,
            hzgraf,
            inputh,
            epgraf,
            egraf,
            b2graf,
            considerar,
            acertrans,
            valor1,
            acertransName,
            asverftrans
        ) {
            // Datos de los puntos en X
            var basevastago = (epgraf + egraf) * 10;
            var punto1x = 10;
            var punto2x = 10 + b2graf * 10;
            var punto3x = considerar == "si" ? 10 + b2graf * 10 : 10;
            var punto4x = considerar == "si" ? 10 + b2graf * 10 + basevastago : 10 + basevastago;
            var punto5x = considerar == "si" ? 10 + b2graf * 10 + basevastago : 10;
            var punto6x = 10 + basem * 10;
            var punto7x = 10 + basem * 10;
            var punto8x = 10 + b2graf * 10 + basevastago;
            var punto9x = 10 + b2graf * 10 + basevastago;
            var punto10x = 10 + b2graf * 10 + basevastago - egraf * 10;
            var punto11x = 10 + b2graf * 10;
            var punto12x = 10;
            var punto13x = 10;

            //Datos de los4puntos en 4
            var punto1y = 10;
            var punto2y = 10;
            var punto3y = considerar == "si" ? 10 - inputHd * 10 : 10;
            var punto4y = considerar == "si" ? 10 - inputHd * 10 : 10;
            var punto5y = (considerar = "si") ? 10 : 10;
            var punto6y = 10;
            var punto7y = 10 + hzgraf * 10;
            var punto8y = 10 + hzgraf * 10;
            var punto9y = 10 + hzgraf * 10 + inputh * 10;
            var punto10y = 10 + hzgraf * 10 + inputh * 10;
            var punto11y = 10 + hzgraf * 10;
            var punto12y = 10 + hzgraf * 10;
            var punto13y = 10;

            // var DataGrafMurosFinal = [8.5, 10, 360, 10, 360, 140, 125, 140, 125, 350, 105, 350, 85, 140, 8.5, 140, 8.5, 10];
            var points = [
                { x: punto1x, y: punto1y },
                { x: punto2x, y: punto2y },
                { x: punto3x, y: punto3y },
                { x: punto4x, y: punto4y },
                { x: punto5x, y: punto5y },
                { x: punto6x, y: punto6y },
                { x: punto7x, y: punto7y },
                { x: punto8x, y: punto8y },
                { x: punto9x, y: punto9y },
                { x: punto10x, y: punto10y },
                { x: punto11x, y: punto11y },
                { x: punto12x, y: punto12y },
                { x: punto13x, y: punto13y },
            ];

            //data para vigas de forma horizontal
            var puntov1x = 10 + 2;
            var puntov2x = 10 + 2;
            var puntov3x = 10 + basem * 10 - 2;
            var puntov4x = 10 + basem * 10 - 2;

            var puntov5x = 10 + 3;
            var puntov6x = 10 + 3;
            var puntov7x = 10 + basem * 10 - 3;
            var puntov8x = 10 + basem * 10 - 3;

            var puntov1y = 10 + 3;
            var puntov2y = 10 + 1;
            var puntov3y = 10 + 1;
            var puntov4y = 10 + 3;

            var puntov5y = 10 + hzgraf * 10 - 2;
            var puntov6y = 10 + hzgraf * 10 - 1;
            var puntov7y = 10 + hzgraf * 10 - 1;
            var puntov8y = 10 + hzgraf * 10 - 2;

            var vigasbasedebajo = [
                { x: puntov1x, y: puntov1y },
                { x: puntov2x, y: puntov2y },
                { x: puntov3x, y: puntov3y },
                { x: puntov4x, y: puntov4y },
            ];

            var vigasbasearriba = [
                { x: puntov5x, y: puntov5y },
                { x: puntov6x, y: puntov6y },
                { x: puntov7x, y: puntov7y },
                { x: puntov8x, y: puntov8y },
            ];

            //data para vigas de forma vertical
            var puntoh1x = considerar == "si" ? 10 + b2graf * 10 + 1.5 : 10 + b2graf * 10 + 1.5;
            var puntoh2x = considerar == "si" ? 10 + b2graf * 10 + 1 : 10 + b2graf * 10 + 1;
            var puntoh3x = considerar == "si" ? 10 + b2graf * 10 + 1 : 10 + b2graf * 10 + 1;
            var puntoh4x = 10 + b2graf * 10 + 0.5 + epgraf * 10;
            var puntoh5x = 10 + b2graf * 10 + 0.5 + 0.5 + epgraf * 10;

            var puntoh6x = considerar == "si" ? 10 + b2graf * 10 + basevastago - 1 : 10 + b2graf * 10 + basevastago - 1.5;
            var puntoh7x = considerar == "si" ? 10 + b2graf * 10 + basevastago - 0.5 : 10 + b2graf * 10 + basevastago - 0.5;
            var puntoh8x = considerar == "si" ? 10 + b2graf * 10 + basevastago - 0.5 : 10 + b2graf * 10 + basevastago - 0.5;
            var puntoh9x = considerar == "si" ? 10 + b2graf * 10 + basevastago - 1 : 10 + b2graf * 10 + basevastago - 10 - 1.5;

            var puntoh1y = considerar == "si" ? 10 - inputHd * 10 + 2.5 : 1 + 2.5;
            var puntoh2y = considerar == "si" ? 10 - inputHd * 10 + 2.5 : 1 + 2.5;
            var puntoh3y = considerar == "si" ? 10 + hzgraf * 10 - 0.5 : 10 + hzgraf * 10 - 0.5;
            var puntoh4y = 10 + hzgraf * 10 + inputh * 10 - 2.5;
            var puntoh5y = 10 + hzgraf * 10 + inputh * 10 - 2.5;

            var puntoh6y = considerar == "si" ? 10 - inputHd * 10 + 1.5 : 10 + 1.5;
            var puntoh7y = considerar == "si" ? 10 - inputHd * 10 + 1.5 : 10 + 1.5;
            var puntoh8y = considerar == "si" ? 10 + hzgraf * 10 + inputh * 10 - 2 : 10 + hzgraf * 10 + inputh * 10 - 2;
            var puntoh9y = considerar == "si" ? 10 + hzgraf * 10 + inputh * 10 - 2 : 10 + hzgraf * 10 + inputh * 10 - 2;

            var vigasVerticalesDATAiz = [
                { x: puntoh1x, y: puntoh1y },
                { x: puntoh2x, y: puntoh2y },
                { x: puntoh3x, y: puntoh3y },
                { x: puntoh4x, y: puntoh4y },
                { x: puntoh5x, y: puntoh5y },
            ];
            var vigasVerticalesDATAder = [
                { x: puntoh6x, y: puntoh6y },
                { x: puntoh7x, y: puntoh7y },
                { x: puntoh8x, y: puntoh8y },
                { x: puntoh9x, y: puntoh9y },
            ];
            var datosAcer = [
                { puntoh3x: puntoh3x },
                { puntoh3y: puntoh3y },
                { puntoh1y: puntoh1y },
                { puntov5x: puntov5x },
                { puntov5y: puntov5y },
                { puntoh6x: puntoh6x },
                { puntoh6y: puntoh6y },
                { puntoh9y: parseFloat(puntoh9y) },
            ];
            //return [points, vigasbasedebajo, vigasbasearriba, vigasVerticalesDATAiz, vigasVerticalesDATAder];
            return [points, vigasbasedebajo, vigasbasearriba, vigasVerticalesDATAiz, vigasVerticalesDATAder, datosAcer];
        },

        graficoMomentosFlectores() {
            const {
                inputHd, basem, b1graf, hzgraf, inputh,
                epgraf, egraf, b2graf, dentelloncorr, mupant, mupun, mutal, mukey
            } = this.Data;

            const self = this; // Guardamos el contexto de Alpine
            let colorModepre = "light";
            let svgElement, xAxisElement, yAxisElement;
            let xScale, yScale; // Declare scales globally

            const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

            function handleColorModeChangepre(event) {
                colorModepre = event.matches ? "dark" : "light";
                if (svgElement) refreshGraphpre(); // Actualizar el gráfico si ya existe
            }

            darkModeQuery.addListener(handleColorModeChangepre);
            handleColorModeChangepre(darkModeQuery);

            const chartMargin = { top: 20, right: 20, bottom: 30, left: 40 };
            const chartWidth = 600 - chartMargin.left - chartMargin.right;
            const chartHeight = 600 - chartMargin.top - chartMargin.bottom;

            function initializeGraphpre() {
                // Eliminar cualquier gráfico existente antes de crear uno nuevo
                d3.select("#DiagramaMomentosFlectores svg").remove();

                // Crear nuevo gráfico
                svgElement = d3
                    .select("#DiagramaMomentosFlectores")
                    .append("svg")
                    .attr("width", chartWidth + chartMargin.left + chartMargin.right)
                    .attr("height", chartHeight + chartMargin.top + chartMargin.bottom)
                    .append("g")
                    .attr("transform", `translate(${chartMargin.left},${chartMargin.top})`);

                xScale = d3.scaleLinear().range([0, chartWidth]);
                yScale = d3.scaleLinear().range([chartHeight, 0]);

                xAxisElement = svgElement.append("g").attr("transform", `translate(0,${chartHeight})`).attr("class", "x-axis");

                yAxisElement = svgElement.append("g").attr("class", "y-axis");

                refreshGraphpre();
            }

            function addDimensions(data, Mupan, Mupun, Mutal, MuKey) {
                //return [diente, base1, base2, triangulo];
                console.log(data);
                const pantalla = data[3];
                const punta = data[1];
                const talon = data[2];
                const dentellon = data[0];

                //Añadir etiquetas para base y altura en cada gráfico Triangulo
                svgElement
                    .append("text")
                    .attr("x", xScale(pantalla[0].x) + 0.5) // Ajuste de posición
                    .attr("y", yScale(pantalla[0].y)) // Ajuste de posición
                    .attr("fill", "red")
                    .attr("font-size", "12px")
                    .text(`${Mupan}`); // Etiqueta para la base
                //BASE 1
                // Cotas para "base 1"
                svgElement
                    .append("text")
                    .attr("x", xScale(punta[2].x - 0.5))
                    .attr("y", yScale(punta[2].y))
                    .attr("fill", "yellow")
                    .attr("font-size", "11px")
                    .text(`${Mupun}`);
                //BASE 2
                svgElement
                    .append("text")
                    .attr("x", xScale(talon[3].x))
                    .attr("y", yScale(talon[3].y))
                    .attr("fill", "orange")
                    .attr("font-size", "11px")
                    .text(`${Mutal}`);
                //DENTELLON
                svgElement
                    .append("text")
                    .attr("x", xScale(dentellon[2].x))
                    .attr("y", yScale(dentellon[2].y))
                    .attr("fill", "orange")
                    .attr("font-size", "11px")
                    .text(`${MuKey}`);
            }

            function refreshGraphpre() {
                const graphData = self.puntosCargasActuantes(
                    inputh,
                    b1graf,
                    hzgraf,
                    egraf,
                    epgraf,
                    b2graf,
                    dentelloncorr,
                    mupant,
                    mupun,
                    mutal,
                    mukey
                );
                //trinangulo
                var Mupan = parseFloat(mupant).toFixed(2);
                // //base 1
                var Mupun = parseFloat(mupun).toFixed(2);
                // //base 2
                var Mutal = parseFloat(mutal).toFixed(2);
                // //dentellon
                var MuKey = parseFloat(mukey).toFixed(2);

                // Calcular el dominio global para todos los datasets
                const allPoints = graphData.flat(); // Combina todos los arrays en uno solo
                xScale.domain([0, d3.max(allPoints, (d) => d.x) * 1.1]);
                yScale.domain([0, d3.max(allPoints, (d) => d.y) * 1.1]);

                // Actualiza los ejes
                xAxisElement.call(d3.axisBottom(xScale));
                yAxisElement.call(d3.axisLeft(yScale));

                // Elimina cualquier gráfico previo
                svgElement.selectAll(".graph-line").remove(); // Remover caminos anteriores
                svgElement.selectAll(".acero-circle").remove(); // Remueve círculos anteriores si los hubiera

                graphData.forEach((dataPoints, index) => {
                    const lineGenerator = d3
                        .line()
                        .x((d) => xScale(d.x))
                        .y((d) => yScale(d.y));

                    // Crear un nuevo path para cada conjunto de datos
                    svgElement
                        .append("path")
                        .datum(dataPoints)
                        .attr("class", "graph-line") // Añadir clase para identificar
                        .attr("fill", "none")
                        .attr("stroke", "steelblue") // Color dinámico
                        .attr("stroke-width", 1.5)
                        .attr("d", lineGenerator);

                    // Agregar puntos para cada gráfico
                    svgElement
                        .selectAll(`.data-point-${index}`)
                        .data(dataPoints)
                        .enter()
                        .append("circle")
                        .attr("class", `data-point-${index}`) // Usamos clases únicas por gráfico
                        .attr("r", 3)
                        .attr("cx", (d) => xScale(d.x))
                        .attr("cy", (d) => yScale(d.y))
                        .attr("fill", "steelblue"); // Color dinámico
                });

                // Cambiar colores de fondo y líneas según el modo
                const bgColor = colorModepre === "dark" ? "#1b1e23" : "#1b1e23";
                const textColor = colorModepre === "dark" ? "#1b1e23" : "#1b1e23";

                d3.select("body").style("background-color", bgColor);
                svgElement.style("color", textColor);
                xAxisElement.style("color", textColor);
                yAxisElement.style("color", textColor);

                addDimensions(graphData, Mupan, Mupun, Mutal, MuKey);
            }

            initializeGraphpre(); // Inicializar el gráfico solo una vez
        },

        graficoFuerzasCortante() {
            const {
                inputHd, basem, b1graf, hzgraf, inputh,
                epgraf, egraf, b2graf, dentelloncorr, vupant, vupun, vutal, vukey
            } = this.Data;

            const self = this;

            let colorModepre = "light";
            let svgElement, xAxisElement, yAxisElement;
            let xScale, yScale; // Declare scales globally

            const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

            function handleColorModeChangepre(event) {
                colorModepre = event.matches ? "dark" : "light";
                if (svgElement) refreshGraphpre(); // Actualizar el gráfico si ya existe
            }

            darkModeQuery.addListener(handleColorModeChangepre);
            handleColorModeChangepre(darkModeQuery);

            const chartMargin = { top: 20, right: 20, bottom: 30, left: 40 };
            const chartWidth = 600 - chartMargin.left - chartMargin.right;
            const chartHeight = 600 - chartMargin.top - chartMargin.bottom;

            function initializeGraphpre() {
                // Eliminar cualquier gráfico existente antes de crear uno nuevo
                d3.select("#DiagramaFuerzaCortante svg").remove();

                // Crear nuevo gráfico
                svgElement = d3
                    .select("#DiagramaFuerzaCortante")
                    .append("svg")
                    .attr("width", chartWidth + chartMargin.left + chartMargin.right)
                    .attr("height", chartHeight + chartMargin.top + chartMargin.bottom)
                    .append("g")
                    .attr("transform", `translate(${chartMargin.left},${chartMargin.top})`);

                xScale = d3.scaleLinear().range([0, chartWidth]);
                yScale = d3.scaleLinear().range([chartHeight, 0]);

                xAxisElement = svgElement.append("g").attr("transform", `translate(0,${chartHeight})`).attr("class", "x-axis");

                yAxisElement = svgElement.append("g").attr("class", "y-axis");

                refreshGraphpre();
            }

            function addDimensions(data, VUpan, VUpun, Vutal, VUKey) {
                //return [diente, base1, base2, triangulo];
                console.log(data);
                const pantalla = data[3];
                const punta = data[1];
                const talon = data[2];
                const dentellon = data[0];

                //Añadir etiquetas para base y altura en cada gráfico Triangulo
                svgElement
                    .append("text")
                    .attr("x", xScale(pantalla[0].x) + 0.5) // Ajuste de posición
                    .attr("y", yScale(pantalla[0].y)) // Ajuste de posición
                    .attr("fill", "red")
                    .attr("font-size", "12px")
                    .text(`${VUpan}`); // Etiqueta para la base
                //BASE 1
                // Cotas para "base 1"
                svgElement
                    .append("text")
                    .attr("x", xScale(punta[2].x - 0.5))
                    .attr("y", yScale(punta[2].y))
                    .attr("fill", "yellow")
                    .attr("font-size", "11px")
                    .text(`${VUpun}`);
                //BASE 2
                svgElement
                    .append("text")
                    .attr("x", xScale(talon[3].x))
                    .attr("y", yScale(talon[3].y))
                    .attr("fill", "orange")
                    .attr("font-size", "11px")
                    .text(`${Vutal}`);
                //DENTELLON
                svgElement
                    .append("text")
                    .attr("x", xScale(dentellon[2].x))
                    .attr("y", yScale(dentellon[2].y))
                    .attr("fill", "orange")
                    .attr("font-size", "11px")
                    .text(`${VUKey}`);
            }

            function refreshGraphpre() {
                const graphData = self.puntosCargasActuantes(
                    inputh,
                    b1graf,
                    hzgraf,
                    egraf,
                    epgraf,
                    b2graf,
                    dentelloncorr,
                    vupant,
                    vupun,
                    vutal,
                    vukey
                );
                //trinangulo
                var VUpan = parseFloat(vupant).toFixed(2);
                // //base 1
                var VUpun = parseFloat(vupun).toFixed(2);
                // //base 2
                var Vutal = parseFloat(vutal).toFixed(2);
                // //dentellon
                var VUKey = parseFloat(vukey).toFixed(2);

                // Calcular el dominio global para todos los datasets
                const allPoints = graphData.flat(); // Combina todos los arrays en uno solo
                xScale.domain([0, d3.max(allPoints, (d) => d.x) * 1.1]);
                yScale.domain([0, d3.max(allPoints, (d) => d.y) * 1.1]);

                // Actualiza los ejes
                xAxisElement.call(d3.axisBottom(xScale));
                yAxisElement.call(d3.axisLeft(yScale));

                // Elimina cualquier gráfico previo
                svgElement.selectAll(".graph-line").remove(); // Remover caminos anteriores
                svgElement.selectAll(".acero-circle").remove(); // Remueve círculos anteriores si los hubiera

                graphData.forEach((dataPoints, index) => {
                    const lineGenerator = d3
                        .line()
                        .x((d) => xScale(d.x))
                        .y((d) => yScale(d.y));

                    // Crear un nuevo path para cada conjunto de datos
                    svgElement
                        .append("path")
                        .datum(dataPoints)
                        .attr("class", "graph-line") // Añadir clase para identificar
                        .attr("fill", "none")
                        .attr("stroke", "steelblue") // Color dinámico
                        .attr("stroke-width", 1.5)
                        .attr("d", lineGenerator);

                    // Agregar puntos para cada gráfico
                    svgElement
                        .selectAll(`.data-point-${index}`)
                        .data(dataPoints)
                        .enter()
                        .append("circle")
                        .attr("class", `data-point-${index}`) // Usamos clases únicas por gráfico
                        .attr("r", 3)
                        .attr("cx", (d) => xScale(d.x))
                        .attr("cy", (d) => yScale(d.y))
                        .attr("fill", "steelblue"); // Color dinámico
                });

                // Cambiar colores de fondo y líneas según el modo
                const bgColor = colorModepre === "dark" ? "#1b1e23" : "#1b1e23";
                const textColor = colorModepre === "dark" ? "#1b1e23" : "#1b1e23";

                d3.select("body").style("background-color", bgColor);
                svgElement.style("color", textColor);
                xAxisElement.style("color", textColor);
                yAxisElement.style("color", textColor);

                addDimensions(graphData, VUpan, VUpun, Vutal, VUKey);
            }

            initializeGraphpre(); // Inicializar el gráfico solo una vez
        },

        puntosCargasActuantes(
            inputh,
            b1graf,
            hzgraf,
            egraf,
            epgraf,
            b2graf,
            dentelloncorr,
            deae,
            maxpanq2,
            maxpanq1,
            maxpunq2,
            maxpunq1,
            maxtalonq2,
            maxtalonq1,
            maxkeyq2,
            maxkeyq1
        ) {
            const wallHeight = inputh;
            const baseHeight = hzgraf;
            const wallWidth = egraf;
            var middle = wallWidth + epgraf;
            var baseTotal = b2graf + middle + b1graf;

            //diente dentellon
            const aling = baseTotal + 2;
            const diente1x = b2graf + aling;
            const diente2x = b2graf + aling;
            const diente3x = b2graf + (epgraf + egraf) + aling;
            const diente4x = b2graf + (epgraf + egraf) + aling;
            const diente5x = aling + b2graf;

            const diente1y = aling;
            const diente2y = dentelloncorr + aling;
            const diente3y = dentelloncorr + aling;
            const diente4y = aling;
            const diente5y = aling;

            const diente = [
                { x: diente1x, y: diente1y },
                { x: diente2x, y: diente2y },
                { x: diente3x, y: diente3y },
                { x: diente4x, y: diente4y },
                { x: diente5x, y: diente5y },
            ];

            const puntopre1x = 0;
            const puntopre2x = b2graf;
            const puntopre1y = 0;
            const puntopre2y = 0;

            const puntopre3y = parseFloat(hzgraf);
            const puntopre3x = b2graf + (epgraf + egraf);
            const puntopre4x = baseTotal;
            const puntopre5y = parseFloat(hzgraf);

            const base1 = [
                { x: puntopre1x, y: puntopre1y },
                { x: puntopre2x, y: puntopre2y },
                { x: puntopre2x, y: puntopre3y },
                { x: puntopre1x, y: puntopre3y },
                { x: puntopre1x, y: puntopre1y },
            ];

            const base2 = [
                { x: puntopre3x, y: puntopre1y },
                { x: puntopre4x, y: puntopre1y },
                { x: puntopre4x, y: puntopre5y },
                { x: puntopre3x, y: puntopre5y },
                { x: puntopre3x, y: puntopre1y },
            ];

            const puntopre6x = baseTotal - b1graf;
            const puntopre7x = baseTotal - b1graf;
            const puntopre8x = baseTotal - b1graf - egraf;
            const puntopre9x = baseTotal - b1graf - egraf - hzgraf;

            const puntopre6y = parseFloat(hzgraf) + 0.5;
            const puntopre7y = parseFloat(inputh) + 0.5;
            const puntopre8y = parseFloat(inputh) + 0.5;
            const puntopre9y = parseFloat(hzgraf) + 0.5;

            const triangulo = [
                { x: puntopre6x, y: puntopre6y },
                { x: puntopre7x, y: puntopre7y },
                { x: puntopre8x, y: puntopre8y },
                { x: puntopre9x, y: puntopre9y },
                { x: puntopre6x, y: puntopre6y },
            ];

            return [diente, base1, base2, triangulo];
        }
    }));
}

// Verificar que Konva esté disponible
if (typeof Konva === 'undefined') {
    console.error('Konva.js no está cargado. Por favor, incluye la librería Konva.js');
} else {
    document.addEventListener('DOMContentLoaded', initdibujoModule);
}