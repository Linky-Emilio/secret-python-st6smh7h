let map, directionsService, directionsRenderer, geocoder;
let originAutocomplete, destinationAutocomplete;
let mainRouteRenderer, deviationRenderers = [];
let currentLocation = { lat: -33.4489, lng: -70.6693 }; // Ubicación inicial en Santiago
let totalEarnings = 0; // Ganancias totales
let totalDeviationTime = 0; // Tiempo total de desviación
let currentRoute = null; // Almacena la ruta actual

// Añadir variables globales para el manejo de rutas
let activeOrders = []; // Array para almacenar pedidos activos en orden
let routeRenderers = []; // Array para almacenar los renderizadores de ruta

// Array de ubicaciones de los malls
const storeLocations = [
    { name: "Mall Plaza Vespucio", coords: { lat: -33.5177, lng: -70.5985 }, info: "Av. Vicuña Mackenna Oriente 7110, La Florida" },
    { name: "Mall Plaza Egaña", coords: { lat: -33.4538, lng: -70.5751 }, info: "Av. Larraín 5862, La Reina" },
    { name: "Mall Plaza Oeste", coords: { lat: -33.5171, lng: -70.7166 }, info: "Av. Américo Vespucio 1501, Cerrillos" },
    { name: "Mall Plaza Norte", coords: { lat: -33.3667, lng: -70.6667 }, info: "Av. Américo Vespucio 1737, Huechuraba" },
    { name: "Mall Plaza Tobalaba", coords: { lat: -33.5778, lng: -70.5531 }, info: "Av. Camilo Henríquez 3296, Puente Alto" },
    { name: "Mall Sport", coords: { lat: -33.4164, lng: -70.5751 }, info: "Av. Las Condes 13451, Las Condes" },
    { name: "Costanera Center", coords: { lat: -33.4177, lng: -70.6060 }, info: "Av. Andrés Bello 2425, Providencia" },
    { name: "Mall Alto Las Condes", coords: { lat: -33.4026, lng: -70.5514 }, info: "Av. Kennedy 9001, Las Condes" },
    { name: "Mall Parque Arauco", coords: { lat: -33.4021, lng: -70.5759 }, info: "Av. Kennedy 5413, Las Condes" },
    { name: "Open Kennedy", coords: { lat: -33.4050, lng: -70.5650 }, info: "Av. Kennedy 7898, Las Condes" },
    { name: "Portal La Dehesa", coords: { lat: -33.3850, lng: -70.5150 }, info: "Av. El Rodeo 1350, Lo Barnechea" },
    { name: "Plaza Los Dominicos", coords: { lat: -33.4700, lng: -70.5300 }, info: "Av. Padre Hurtado 1450, Las Condes" },
    { name: "Espacio Urbano La Reina", coords: { lat: -33.4600, lng: -70.5500 }, info: "Av. Príncipe de Gales 9091, La Reina" },
    { name: "Mall Plaza Alameda", coords: { lat: -33.4500, lng: -70.6500 }, info: "Av. Libertador Bernardo O'Higgins 3470, Estación Central" },
    { name: "Factory Outlet Mall", coords: { lat: -33.4800, lng: -70.7000 }, info: "Av. General Velásquez 200, San Bernardo" },
    { name: "Mid Mall Outlet", coords: { lat: -33.5200, lng: -70.7200 }, info: "Av. Presidente Eduardo Frei Montalva 9709, Pudahuel" },
    { name: "Mall Arauco Maipú", coords: { lat: -33.5000, lng: -70.7500 }, info: "Américo Vespucio Sur 399, Maipú" },
    { name: "Mall Paseo Quilín", coords: { lat: -33.4900, lng: -70.5800 }, info: "Av. Américo Vespucio 3200, Macul" },
    { name: "Parque Outlet Easton", coords: { lat: -33.3500, lng: -70.6800 }, info: "Av. Américo Vespucio Norte 1155, Huechuraba" },
    { name: "Oulet San Ignacio", coords: { lat: -33.5500, lng: -70.7800 }, info: "Autopista del Sol Km 38, El Monte" },
    { name: "Plaza Puente Alto", coords: { lat: -33.6000, lng: -70.5500 }, info: "Av. Eyzaguirre 105, Puente Alto" },
    { name: "Mall Portal Ñuñoa", coords: { lat: -33.4600, lng: -70.6000 }, info: "Av. Simón Bolívar 5400, Ñuñoa" },
    { name: "Strip Center La Reina", coords: { lat: -33.4500, lng: -70.5600 }, info: "Av. Echeñique 5800, La Reina" },
    { name: "Mall Vivo Panorámico", coords: { lat: -33.4200, lng: -70.6200 }, info: "Av. Kennedy 9350, Vitacura" },
    { name: "Mall Costanera Lyon", coords: { lat: -33.4300, lng: -70.6300 }, info: "Av. Nueva Providencia 1881, Providencia" },
    { name: "Plaza Las Condes", coords: { lat: -33.3900, lng: -70.5400 }, info: "Av. Padre Hurtado Norte 1480, Las Condes" },
    { name: "Omnium", coords: { lat: -33.4100, lng: -70.5800 }, info: "Av. Apoquindo 6415, Las Condes" },
    { name: "Pueblito Los Dominicos", coords: { lat: -33.4750, lng: -70.5250 }, info: "Av. Padre Hurtado 1490, Las Condes" },
    { name: "Mall Florida Center", coords: { lat: -33.5300, lng: -70.5700 }, info: "Av. Vicuña Mackenna Oriente 6100, La Florida" },
    { name: "Mall Open Plaza Rancagua", coords: { lat: -34.1800, lng: -70.7400 }, info: "Carretera del Cobre 1880, Rancagua" },
    { name: "Mall Plaza Copiapó", coords: { lat: -27.3600, lng: -70.3200 }, info: "Av. Los Carrera 1999, Copiapó" },
    { name: "Mall Portal Temuco", coords: { lat: -38.7300, lng: -72.5900 }, info: "Av. Alemania 01095, Temuco" },
    { name: "Mall Marina Arauco", coords: { lat: -32.9500, lng: -71.5400 }, info: "Av. Marina Arauco 2360, Viña del Mar" },
    { name: "Mall Alto del Sol", coords: { lat: -30.6100, lng: -71.2400 }, info: "Av. Juan Cisternas 1850, La Serena" },
    { name: "Mall Plaza Antofagasta", coords: { lat: -23.6300, lng: -70.4000 }, info: "Av. Balmaceda 2355, Antofagasta" },
    { name: "Mall Plaza Iquique", coords: { lat: -20.2100, lng: -70.1400 }, info: "Av. Arturo Prat Chacón 2951, Iquique" },
    { name: "Mall Vivo Los Trapenses", coords: { lat: -33.3800, lng: -70.4800 }, info: "Camino Los Trapenses 3155, Lo Barnechea" },
    { name: "Mall Portal La Reina", coords: { lat: -33.4600, lng: -70.5500 }, info: "Av. Príncipe de Gales 9091, La Reina" },
    { name: "Mall Plaza Sur", coords: { lat: -33.6200, lng: -70.7300 }, info: "Av. Jorge Alessandri Rodríguez 2005, San Bernardo" },
    { name: "Mall Plaza Oeste", coords: { lat: -33.5171, lng: -70.7166 }, info: "Av. Américo Vespucio 1501, Cerrillos" },
    { name: "Mall Plaza Norte", coords: { lat: -33.3667, lng: -70.6667 }, info: "Av. Américo Vespucio 1737, Huechuraba" },
    { name: "Mall Plaza Tobalaba", coords: { lat: -33.5778, lng: -70.5531 }, info: "Av. Camilo Henríquez 3296, Puente Alto" },
    { name: "Mall Sport", coords: { lat: -33.4164, lng: -70.5751 }, info: "Av. Las Condes 13451, Las Condes" },
    { name: "Costanera Center", coords: { lat: -33.4177, lng: -70.6060 }, info: "Av. Andrés Bello 2425, Providencia" },
    { name: "Mall Alto Las Condes", coords: { lat: -33.4026, lng: -70.5514 }, info: "Av. Kennedy 9001, Las Condes" },
    { name: "Mall Parque Arauco", coords: { lat: -33.4021, lng: -70.5759 }, info: "Av. Kennedy 5413, Las Condes" },
    { name: "Open Kennedy", coords: { lat: -33.4050, lng: -70.5650 }, info: "Av. Kennedy 7898, Las Condes" },
    { name: "Portal La Dehesa", coords: { lat: -33.3850, lng: -70.5150 }, info: "Av. El Rodeo 1350, Lo Barnechea" },
    { name: "Plaza Los Dominicos", coords: { lat: -33.4700, lng: -70.5300 }, info: "Av. Padre Hurtado 1450, Las Condes" },
    { name: "Espacio Urbano La Reina", coords: { lat: -33.4600, lng: -70.5500 }, info: "Av. Príncipe de Gales 9091, La Reina" },
    { name: "Mall Plaza Alameda", coords: { lat: -33.4500, lng: -70.6500 }, info: "Av. Libertador Bernardo O'Higgins 3470, Estación Central" },
    { name: "Factory Outlet Mall", coords: { lat: -33.4800, lng: -70.7000 }, info: "Av. General Velásquez 200, San Bernardo" },
    { name: "Mid Mall Outlet", coords: { lat: -33.5200, lng: -70.7200 }, info: "Av. Presidente Eduardo Frei Montalva 9709, Pudahuel" },
    { name: "Mall Arauco Maipú", coords: { lat: -33.5000, lng: -70.7500 }, info: "Américo Vespucio Sur 399, Maipú" },
    { name: "Mall Paseo Quilín", coords: { lat: -33.4900, lng: -70.5800 }, info: "Av. Américo Vespucio 3200, Macul" },
    { name: "Parque Outlet Easton", coords: { lat: -33.3500, lng: -70.6800 }, info: "Av. Américo Vespucio Norte 1155, Huechuraba" },
    { name: "Oulet San Ignacio", coords: { lat: -33.5500, lng: -70.7800 }, info: "Autopista del Sol Km 38, El Monte" },
    { name: "Plaza Puente Alto", coords: { lat: -33.6000, lng: -70.5500 }, info: "Av. Eyzaguirre 105, Puente Alto" },
    { name: "Mall Portal Ñuñoa", coords: { lat: -33.4600, lng: -70.6000 }, info: "Av. Simón Bolívar 5400, Ñuñoa" },
    { name: "Strip Center La Reina", coords: { lat: -33.4500, lng: -70.5600 }, info: "Av. Echeñique 5800, La Reina" },
    { name: "Mall Vivo Panorámico", coords: { lat: -33.4200, lng: -70.6200 }, info: "Av. Kennedy 9350, Vitacura" },
    { name: "Mall Costanera Lyon", coords: { lat: -33.4300, lng: -70.6300 }, info: "Av. Nueva Providencia 1881, Providencia" },
    { name: "Plaza Las Condes", coords: { lat: -33.3900, lng: -70.5400 }, info: "Av. Padre Hurtado Norte 1480, Las Condes" },
    { name: "Omnium", coords: { lat: -33.4100, lng: -70.5800 }, info: "Av. Apoquindo 6415, Las Condes" },
    { name: "Pueblito Los Dominicos", coords: { lat: -33.4750, lng: -70.5250 }, info: "Av. Padre Hurtado 1490, Las Condes" },
    { name: "Mall Florida Center", coords: { lat: -33.5300, lng: -70.5700 }, info: "Av. Vicuña Mackenna Oriente 6100, La Florida" },
    { name: "Mall Open Plaza Rancagua", coords: { lat: -34.1800, lng: -70.7400 }, info: "Carretera del Cobre 1880, Rancagua" },
    { name: "Mall Plaza Copiapó", coords: { lat: -27.3600, lng: -70.3200 }, info: "Av. Los Carrera 1999, Copiapó" },
    { name: "Mall Portal Temuco", coords: { lat: -38.7300, lng: -72.5900 }, info: "Av. Alemania 01095, Temuco" },
    { name: "Mall Marina Arauco", coords: { lat: -32.9500, lng: -71.5400 }, info: "Av. Marina Arauco 2360, Viña del Mar" },
    { name: "Mall Alto del Sol", coords: { lat: -30.6100, lng: -71.2400 }, info: "Av. Juan Cisternas 1850, La Serena" },
    { name: "Mall Plaza Antofagasta", coords: { lat: -23.6300, lng: -70.4000 }, info: "Av. Balmaceda 2355, Antofagasta" },
    { name: "Mall Plaza Iquique", coords: { lat: -20.2100, lng: -70.1400 }, info: "Av. Arturo Prat Chacón 2951, Iquique" },
    { name: "Mall Vivo Los Trapenses", coords: { lat: -33.3800, lng: -70.4800 }, info: "Camino Los Trapenses 3155, Lo Barnechea" },
    { name: "Mall Portal La Reina", coords: { lat: -33.4600, lng: -70.5500 }, info: "Av. Príncipe de Gales 9091, La Reina" },
    { name: "Mall Plaza Sur", coords: { lat: -33.6200, lng: -70.7300 }, info: "Av. Jorge Alessandri Rodríguez 2005, San Bernardo" },
    { name: "Plaza Tobalaba", coords: { lat: -33.5778, lng: -70.5531 }, info: "Av. Camilo Henríquez 3296, Puente Alto" },
    { name: "Mall Paseo Quilín", coords: { lat: -33.4900, lng: -70.5800 }, info: "Av. Américo Vespucio 3200, Macul" },
    { name: "Mall Plaza Tobalaba 2", coords: { lat: -33.5779, lng: -70.5532 }, info: "Av. Camilo Henríquez 3297, Puente Alto" },
    { name: "Mall Paseo Quilín 2", coords: { lat: -33.4901, lng: -70.5801 }, info: "Av. Américo Vespucio 3201, Macul" }
];

// Array de clientes con direcciones aleatorias en Santiago (MUCHOS MÁS CLIENTES)
const customerLocations = [
    { name: "Cliente 1", coords: { lat: -33.4569, lng: -70.6483 }, info: "Av. Providencia 1234, Providencia" },
    { name: "Cliente 2", coords: { lat: -33.4459, lng: -70.6253 }, info: "Santa Isabel 456, Ñuñoa" },
    { name: "Cliente 3", coords: { lat: -33.4679, lng: -70.6423 }, info: "Av. Irarrázaval 2345, Ñuñoa" },
    { name: "Cliente 4", coords: { lat: -33.4234, lng: -70.6123 }, info: "Los Leones 789, Providencia" },
    { name: "Cliente 5", coords: { lat: -33.4789, lng: -70.5983 }, info: "Av. Macul 1122, Macul" },
    { name: "Cliente 6", coords: { lat: -33.4123, lng: -70.5789 }, info: "Av. Apoquindo 3400, Las Condes" },
    { name: "Cliente 7", coords: { lat: -33.4156, lng: -70.5823 }, info: "Cerro Colorado 5525, Las Condes" },
    { name: "Cliente 8", coords: { lat: -33.5234, lng: -70.5967 }, info: "Walker Martínez 3456, La Florida" },
    { name: "Cliente 9", coords: { lat: -33.5345, lng: -70.5876 }, info: "Av. La Florida 8765, La Florida" },
    { name: "Cliente 10", coords: { lat: -33.5123, lng: -70.7534 }, info: "Av. Pajaritos 4567, Maipú" },
    { name: "Cliente 11", coords: { lat: -33.4321, lng: -70.6345 }, info: "Av. Vitacura 9876, Vitacura" },
    { name: "Cliente 12", coords: { lat: -33.4876, lng: -70.6012 }, info: "Av. Manquehue Sur 2345, Las Condes" },
    { name: "Cliente 13", coords: { lat: -33.5012, lng: -70.7234 }, info: "Av. Camino Rinconada 5678, Maipú" },
    { name: "Cliente 14", coords: { lat: -33.4654, lng: -70.6578 }, info: "Av. Pedro de Valdivia 8901, Providencia" },
    { name: "Cliente 15", coords: { lat: -33.4987, lng: -70.5890 }, info: "Av. Cristóbal Colón 1234, Las Condes" },
    { name: "Cliente 16", coords: { lat: -33.4765, lng: -70.6123 }, info: "Av. Francisco Bilbao 3456, Providencia" },
{ name: "Cliente 17", coords: { lat: -33.4876, lng: -70.6234 }, info: "Av. Las Condes 5678, Las Condes" },
    { name: "Cliente 18", coords: { lat: -33.4987, lng: -70.6345 }, info: "Av. Manquehue Norte 9012, Las Condes" },
    { name: "Cliente 19", coords: { lat: -33.5098, lng: -70.6456 }, info: "Av. Francisco de Aguirre 1234, Providencia" },
    { name: "Cliente 20", coords: { lat: -33.5209, lng: -70.6567 }, info: "Av. Ricardo Lyon 2345, Providencia" },
    { name: "Cliente 21", coords: { lat: -33.5320, lng: -70.6678 }, info: "Av. Eliodoro Yáñez 3456, Providencia" },
    { name: "Cliente 22", coords: { lat: -33.5431, lng: -70.6789 }, info: "Av. Los Leones 4567, Providencia" },
    { name: "Cliente 23", coords: { lat: -33.5542, lng: -70.6890 }, info: "Av. Suecia 5678, Ñuñoa" },
    { name: "Cliente 24", coords: { lat: -33.5653, lng: -70.7001 }, info: "Av. Irarrázaval 6789, Ñuñoa" },
    { name: "Cliente 25", coords: { lat: -33.5764, lng: -70.7112 }, info: "Av. Grecia 7890, Ñuñoa" },
    { name: "Cliente 26", coords: { lat: -33.5875, lng: -70.7223 }, info: "Av. Macul 9012, Macul" },
    { name: "Cliente 27", coords: { lat: -33.5986, lng: -70.7334 }, info: "Av. José Pedro Alessandri 1234, Macul" },
    { name: "Cliente 28", coords: { lat: -33.6097, lng: -70.7445 }, info: "Av. Quilín 2345, Macul" },
    { name: "Cliente 29", coords: { lat: -33.6208, lng: -70.7556 }, info: "Av. Américo Vespucio 3456, Macul" },
    { name: "Cliente 30", coords: { lat: -33.4012, lng: -70.5678 }, info: "Av. Apoquindo 1212, Las Condes" },
    { name: "Cliente 31", coords: { lat: -33.4123, lng: -70.5789 }, info: "Av. Las Condes 2323, Las Condes" },
    { name: "Cliente 32", coords: { lat: -33.4234, lng: -70.5890 }, info: "Av. Manquehue 3434, Las Condes" },
    { name: "Cliente 33", coords: { lat: -33.4345, lng: -70.6001 }, info: "Av. Padre Hurtado 4545, Las Condes" },
    { name: "Cliente 34", coords: { lat: -33.4456, lng: -70.6112 }, info: "Av. Kennedy 5656, Las Condes" },
    { name: "Cliente 35", coords: { lat: -33.4567, lng: -70.6223 }, info: "Av. Vitacura 6767, Vitacura" },
    { name: "Cliente 36", coords: { lat: -33.4678, lng: -70.6334 }, info: "Av. Alonso de Córdova 7878, Vitacura" },
    { name: "Cliente 37", coords: { lat: -33.4789, lng: -70.6445 }, info: "Av. Nueva Costanera 8989, Vitacura" },
    { name: "Cliente 38", coords: { lat: -33.4890, lng: -70.6556 }, info: "Av. San Francisco de Asís 9090, Vitacura" },
    { name: "Cliente 39", coords: { lat: -33.5001, lng: -70.6667 }, info: "Av. El Golf 1212, Las Condes" },
    { name: "Cliente 40", coords: { lat: -33.5112, lng: -70.6778 }, info: "Av. Apoquindo 2323, Las Condes" },
    { name: "Cliente 41", coords: { lat: -33.5223, lng: -70.6889 }, info: "Av. Las Condes 3434, Las Condes" },
    { name: "Cliente 42", coords: { lat: -33.5334, lng: -70.6990 }, info: "Av. Manquehue 4545, Las Condes" },
    { name: "Cliente 43", coords: { lat: -33.5445, lng: -70.7101 }, info: "Av. Padre Hurtado 5656, Las Condes" },
    { name: "Cliente 44", coords: { lat: -33.5556, lng: -70.7212 }, info: "Av. Kennedy 6767, Las Condes" },
    { name: "Cliente 45", coords: { lat: -33.5667, lng: -70.7323 }, info: "Av. Vitacura 7878, Vitacura" },
    { name: "Cliente 46", coords: { lat: -33.5778, lng: -70.7434 }, info: "Av. Alonso de Córdova 8989, Vitacura" },
    { name: "Cliente 47", coords: { lat: -33.5889, lng: -70.7545 }, info: "Av. Nueva Costanera 9090, Vitacura" },
    { name: "Cliente 48", coords: { lat: -33.5990, lng: -70.7656 }, info: "Av. San Francisco de Asís 1212, Vitacura" },
    { name: "Cliente 49", coords: { lat: -33.4113, lng: -70.5780 }, info: "Av. Isidora Goyenechea 2323, Las Condes" },
    { name: "Cliente 50", coords: { lat: -33.4224, lng: -70.5891 }, info: "Av. El Bosque 3434, Las Condes" },
    { name: "Cliente 51", coords: { lat: -33.4335, lng: -70.6002 }, info: "Av. Tobalaba 4545, Peñalolén" },
    { name: "Cliente 52", coords: { lat: -33.4446, lng: -70.6113 }, info: "Av. Grecia 5656, Peñalolén" },
    { name: "Cliente 53", coords: { lat: -33.4557, lng: -70.6224 }, info: "Av. Consistorial 6767, Peñalolén" },
    { name: "Cliente 54", coords: { lat: -33.4668, lng: -70.6335 }, info: "Av. Larraín 7878, La Reina" },
    { name: "Cliente 55", coords: { lat: -33.4779, lng: -70.6446 }, info: "Av. Echeñique 8989, La Reina" },
    { name: "Cliente 56", coords: { lat: -33.4880, lng: -70.6557 }, info: "Av. Príncipe de Gales 9090, La Reina" },
    { name: "Cliente 57", coords: { lat: -33.4991, lng: -70.6668 }, info: "Av. Egaña 1212, La Reina" },
    { name: "Cliente 58", coords: { lat: -33.5102, lng: -70.6779 }, info: "Av. Simón Bolívar 2323, Ñuñoa" },
    { name: "Cliente 59", coords: { lat: -33.5213, lng: -70.6890 }, info: "Av. Irarrázaval 3434, Ñuñoa" },
    { name: "Cliente 60", coords: { lat: -33.5324, lng: -70.7001 }, info: "Av. José Manuel Infante 4545, Ñuñoa" },
    { name: "Cliente 61", coords: { lat: -33.5435, lng: -70.7112 }, info: "Av. Pedro de Valdivia 5656, Providencia" },
    { name: "Cliente 62", coords: { lat: -33.5546, lng: -70.7223 }, info: "Av. Providencia 6767, Providencia" },
    { name: "Cliente 63", coords: { lat: -33.5657, lng: -70.7334 }, info: "Av. Ricardo Lyon 7878, Providencia" },
    { name: "Cliente 64", coords: { lat: -33.5768, lng: -70.7445 }, info: "Av. Suecia 8989, Providencia" },
    { name: "Cliente 65", coords: { lat: -33.5879, lng: -70.7556 }, info: "Av. Eliodoro Yáñez 9090, Providencia" },
    { name: "Cliente 66", coords: { lat: -33.5980, lng: -70.7667 }, info: "Av. Los Leones 1212, Providencia" },
    { name: "Cliente 67", coords: { lat: -33.6091, lng: -70.7778 }, info: "Av. Macul 2323, Macul" },
    { name: "Cliente 68", coords: { lat: -33.6202, lng: -70.7889 }, info: "Av. José Pedro Alessandri 3434, Macul" },
    { name: "Cliente 69", coords: { lat: -33.6313, lng: -70.7990 }, info: "Av. Quilín 4545, Macul" },
    { name: "Cliente 70", coords: { lat: -33.4025, lng: -70.5681 }, info: "Av. Apoquindo 3500, Las Condes" },
    { name: "Cliente 71", coords: { lat: -33.4136, lng: -70.5792 }, info: "Av. Las Condes 4600, Las Condes" },
    { name: "Cliente 72", coords: { lat: -33.4247, lng: -70.5903 }, info: "Av. Manquehue 5700, Las Condes" },
    { name: "Cliente 73", coords: { lat: -33.4358, lng: -70.6014 }, info: "Av. Padre Hurtado 6800, Las Condes" },
    { name: "Cliente 74", coords: { lat: -33.4469, lng: -70.6125 }, info: "Av. Kennedy 7900, Las Condes" },
    { name: "Cliente 75", coords: { lat: -33.4570, lng: -70.6236 }, info: "Av. Vitacura 8000, Vitacura" },
    { name: "Cliente 76", coords: { lat: -33.4681, lng: -70.6347 }, info: "Av. Alonso de Córdova 9100, Vitacura" },
    { name: "Cliente 77", coords: { lat: -33.4792, lng: -70.6458 }, info: "Av. Nueva Costanera 1200, Vitacura" },
    { name: "Cliente 78", coords: { lat: -33.4903, lng: -70.6569 }, info: "Av. San Francisco de Asís 2300, Vitacura" },
    { name: "Cliente 79", coords: { lat: -33.5014, lng: -70.6670 }, info: "Av. El Golf 3400, Las Condes" },
    { name: "Cliente 80", coords: { lat: -33.5125, lng: -70.6781 }, info: "Av. Apoquindo 4500, Las Condes" },
    { name: "Cliente 81", coords: { lat: -33.5236, lng: -70.6892 }, info: "Av. Las Condes 5600, Las Condes" },
    { name: "Cliente 82", coords: { lat: -33.5347, lng: -70.7003 }, info: "Av. Manquehue 6700, Las Condes" },
    { name: "Cliente 83", coords: { lat: -33.5458, lng: -70.7114 }, info: "Av. Padre Hurtado 7800, Las Condes" },
    { name: "Cliente 84", coords: { lat: -33.5569, lng: -70.7225 }, info: "Av. Kennedy 8900, Las Condes" },
    { name: "Cliente 85", coords: { lat: -33.5670, lng: -70.7336 }, info: "Av. Vitacura 9000, Vitacura" },
    { name: "Cliente 86", coords: { lat: -33.5781, lng: -70.7447 }, info: "Av. Alonso de Córdova 1300, Vitacura" },
    { name: "Cliente 87", coords: { lat: -33.5892, lng: -70.7558 }, info: "Av. Nueva Costanera 2400, Vitacura" },
    { name: "Cliente 88", coords: { lat: -33.6003, lng: -70.7669 }, info: "Av. San Francisco de Asís 3500, Vitacura" },
    { name: "Cliente 89", coords: { lat: -33.4126, lng: -70.5793 }, info: "Av. Isidora Goyenechea 4600, Las Condes" },
    { name: "Cliente 90", coords: { lat: -33.4237, lng: -70.5904 }, info: "Av. El Bosque 5700, Las Condes" },
];

// Estado de los pedidos
const orderStatus = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    COMPLETED: 'completed'
};

// Array para almacenar los pedidos
let deliveryOrders = [];

// Función de inicialización del mapa
function initMap() {
    directionsService = new google.maps.DirectionsService();
    mainRouteRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
            strokeColor: '#6B46C1', // Color morado moderno
            strokeWeight: 5,
            strokeOpacity: 0.8
        }
    });
    geocoder = new google.maps.Geocoder();

    map = new google.maps.Map(document.getElementById('map'), {
        center: currentLocation,
        zoom: 11
    });

    mainRouteRenderer.setMap(map);

    // Crear el panel de pedidos antes de cargar las tiendas y clientes
    createOrdersPanel();
    updateActiveOrdersPanel();

    // Cargar tiendas y clientes
    loadStores();
    loadCustomers();

    // Configurar autocompletado
    const autocompleteOptions = {
        componentRestrictions: { country: 'cl' },
        bounds: new google.maps.LatLngBounds(
            new google.maps.LatLng(-33.6, -70.8),
            new google.maps.LatLng(-33.3, -70.5)
        )
    };

    originAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('origin'),
        autocompleteOptions
    );
    destinationAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('destination'),
        autocompleteOptions
    );

    // Generar pedidos de ejemplo
    generateOrders();

    // Mostrar pedidos disponibles
    displayAvailableOrders();
}

// Función para cargar las tiendas en el mapa
function loadStores() {
    storeLocations.forEach(store => {
        const marker = new google.maps.Marker({
            map: map,
            position: store.coords,
            title: store.name,
            icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new google.maps.Size(40, 40)
            },
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px">
                    <h3>${store.name}</h3>
                    <p>${store.info}</p>
                </div>`
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

        store.marker = marker;
    });
}

// Función para cargar los clientes en el mapa
function loadCustomers() {
    customerLocations.forEach(customer => {
        const marker = new google.maps.Marker({
            map: map,
            position: customer.coords,
            title: customer.name,
            icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
                scaledSize: new google.maps.Size(30, 30)
            },
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px">
                    <h3>${customer.name}</h3>
                    <p>${customer.info}</p>
                </div>`
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

        customer.marker = marker;
    });
}

// Función para generar pedidos de ejemplo
function generateOrders() {
    deliveryOrders = customerLocations.map((customer, index) => {
        const order = {
            id: `ORDER-${index + 1}`,
            customer: {
                ...customer,
                coords: {
                    lat: customer.coords.lat,
                    lng: customer.coords.lng
                }
            },
            store: {
                ...storeLocations[Math.floor(Math.random() * storeLocations.length)],
                coords: {
                    lat: storeLocations[Math.floor(Math.random() * storeLocations.length)].coords.lat,
                    lng: storeLocations[Math.floor(Math.random() * storeLocations.length)].coords.lng
                }
            },
            status: orderStatus.PENDING,
            createdAt: new Date(),
            estimatedDistance: 0,
            estimatedDuration: 0,
            price: 3000
        };
        console.log('Orden generada:', order);
        return order;
    });
}

function calculateOrderDeviation(order, mainRoute) {
    if (!order || !mainRoute) {
        console.error('Orden o ruta principal faltante');
        return Infinity;
    }

    return new Promise((resolve, reject) => {
        // Obtener puntos de la ruta actual
        const origin = mainRoute.routes[0].legs[0].start_location;
        const finalDestination = mainRoute.routes[0].legs[mainRoute.routes[0].legs.length - 1].end_location;

        // Construir waypoints incluyendo pedidos activos y el nuevo pedido
        const waypoints = [];
        
        // Primero añadir los pedidos activos
        activeOrders.forEach(activeOrder => {
            waypoints.push(
                { location: activeOrder.store.coords, stopover: true },
                { location: activeOrder.customer.coords, stopover: true }
            );
        });

        // Añadir el nuevo pedido al final
        waypoints.push(
            { location: order.store.coords, stopover: true },
            { location: order.customer.coords, stopover: true }
        );

        // Calcular tiempo de la ruta actual
        const currentTime = mainRoute.routes[0].legs.reduce(
            (total, leg) => total + leg.duration.value, 0
        );

        // Calcular tiempo con el nuevo pedido
        directionsService.route({
            origin: origin,
            destination: finalDestination,
            waypoints: waypoints,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING
        }, (result, status) => {
            if (status === 'OK') {
                const newTime = result.routes[0].legs.reduce(
                    (total, leg) => total + leg.duration.value, 0
                );

                const extraTime = Math.ceil((newTime - currentTime) / 60);
                resolve(extraTime);
            } else {
                reject('Error al calcular la ruta con desvío');
            }
        });
    });
}

// Modifica la función displayAvailableOrders
async function displayAvailableOrders() {
    const ordersPanel = document.getElementById('ordersPanel');
    if (!ordersPanel) {
        console.error('Panel de pedidos no encontrado');
        return;
    }

    try {
        let html = `
            <h3 style="color: var(--primary); margin-bottom: 15px;">Pedidos Cercanos</h3>
            <div style="color: var(--gray); margin-bottom: 15px;">
                <span class="earnings">💰 Ganancias: $${totalEarnings.toLocaleString()}</span>
            </div>
        `;

        if (!currentRoute) {
            html += `
                <div style="text-align: center; color: var(--gray); padding: 20px;">
                    Ingresa tu ruta para ver pedidos cercanos
                </div>
            `;
            ordersPanel.innerHTML = html;
            return;
        }

        // Obtener pedidos pendientes
        const pendingOrders = deliveryOrders.filter(order => 
            order.status === orderStatus.PENDING
        );

        if (pendingOrders.length === 0) {
            html += `
                <div style="text-align: center; color: var(--gray); padding: 20px;">
                    No hay pedidos disponibles en este momento
                </div>
            `;
            ordersPanel.innerHTML = html;
            return;
        }

        // Calcular desviaciones
        const ordersWithDeviation = await Promise.all(
            pendingOrders.map(async order => {
                try {
                    const deviation = await calculateOrderDeviation(order, currentRoute);
                    return { ...order, deviation };
                } catch (error) {
                    console.error(`Error calculando desviación para orden ${order.id}:`, error);
                    return { ...order, deviation: Infinity };
                }
            })
        );

        // Filtrar órdenes válidas y ordenar por menor desviación
        const validOrders = ordersWithDeviation
            .filter(order => order.deviation !== Infinity)
            .sort((a, b) => a.deviation - b.deviation)
            .slice(0, 5);

        if (validOrders.length === 0) {
            html += `
                <div style="text-align: center; color: var(--gray); padding: 20px;">
                    No se encontraron pedidos cercanos a tu ruta
                </div>
            `;
            ordersPanel.innerHTML = html;
            return;
        }

        // Generar HTML para cada orden válida
        validOrders.forEach(order => {
            html += `
                <div class="order-card">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <strong style="color: var(--primary);">Pedido ${order.id}</strong>
                        <span class="earnings">$${order.price.toLocaleString()}</span>
                    </div>
                    
                    <div style="color: var(--gray); margin-bottom: 10px;">
                        <div>🏪 ${order.store.name}</div>
                        <div>📍 ${order.customer.info}</div>
                    </div>
                    
                    <div style="color: var(--gray); margin-bottom: 12px;">
                        ⏱️ Tiempo extra: ${order.deviation} min
                    </div>

                    <button onclick="acceptOrder('${order.id}')" 
                            style="background: var(--primary); margin-top: 10px;">
                        Aceptar Pedido
                    </button>
                </div>
            `;
        });

        ordersPanel.innerHTML = html;

    } catch (error) {
        console.error('Error al mostrar pedidos:', error);
        ordersPanel.innerHTML = `
            <div style="text-align: center; color: var(--gray); padding: 20px;">
                Error al cargar los pedidos disponibles
            </div>
        `;
    }
}

// Función para calcular estimados de distancia y tiempo
function calculateOrderEstimates(order) {
    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix({
        origins: [currentLocation],
        destinations: [order.store.coords],
        travelMode: google.maps.TravelMode.DRIVING,
    }, (response, status) => {
        if (status === 'OK') {
            const storeDistance = response.rows[0].elements[0].distance.value;
            const storeDuration = response.rows[0].elements[0].duration.value;

            service.getDistanceMatrix({
                origins: [order.store.coords],
                destinations: [order.customer.coords],
                travelMode: google.maps.TravelMode.DRIVING,
            }, (response, status) => {
                if (status === 'OK') {
                    const customerDistance = response.rows[0].elements[0].distance.value;
                    const customerDuration = response.rows[0].elements[0].duration.value;

                    order.estimatedDistance = storeDistance + customerDistance;
                    order.estimatedDuration = storeDuration + customerDuration;

                    // Actualizar la visualización
                    displayAvailableOrders();
                }
            });
        }
    });
}

// Función para aceptar un pedido
function acceptOrder(orderId) {
    const order = deliveryOrders.find(o => o.id === orderId);
    if (order) {
        order.status = orderStatus.ACCEPTED;
        activeOrders.push(order);
        totalEarnings += order.price;

        // Actualizar panel de pedidos activos
        updateActiveOrdersPanel();

        // Mostrar confirmación
        showNotification('¡Pedido Aceptado!', 
            `Has aceptado el pedido ${orderId}. Dirígete a: ${order.store.name}`, 
            'success');

        // Actualizar rutas
        updateAllRoutes();
        displayAvailableOrders();
    }
}

// Modifica la función createOrdersPanel
function createOrdersPanel() {
    // Primero, verifica si ya existe el panel
    let ordersPanel = document.getElementById('ordersPanel');
    if (ordersPanel) {
        return ordersPanel;
    }

    ordersPanel = document.createElement('div');
    ordersPanel.id = 'ordersPanel';
    ordersPanel.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 15px rgba(0,0,0,0.2);
        max-height: calc(100vh - 40px);
        width: 320px;
        overflow-y: auto;
        z-index: 1000;
    `;
    
    // Asegurarse de que el panel se agregue al body
    document.body.appendChild(ordersPanel);
    
    // Contenido inicial
    ordersPanel.innerHTML = `
        <h3 style="color: var(--primary); margin-bottom: 15px;">Pedidos Cercanos</h3>
        <div style="text-align: center; color: var(--gray); padding: 20px;">
            Ingresa tu ruta para ver pedidos cercanos
        </div>
    `;
    
    return ordersPanel;
}

// Función para calcular la ruta
function calculateRoute() {
    const order = deliveryOrders.find(o => o.status === orderStatus.ACCEPTED);
    if (!order) return;

    const waypoints = [
        { location: order.store.coords, stopover: true },
        { location: order.customer.coords, stopover: true }
    ];

    const request = {
        origin: currentLocation,
        destination: currentLocation, // Volver al punto de inicio
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            // Limpiar rutas anteriores
            if (deviationRenderers.length > 0) {
                deviationRenderers.forEach(renderer => renderer.setMap(null));
                deviationRenderers = [];
            }

            mainRouteRenderer.setDirections(result);
            currentRoute = result;

            // Centrar el mapa para mostrar toda la ruta
            const bounds = new google.maps.LatLngBounds();
            const route = result.routes[0];
            route.legs.forEach(leg => {
                leg.steps.forEach(step => {
                    bounds.extend(step.start_location);
                    bounds.extend(step.end_location);
                });
            });
            map.fitBounds(bounds);
        } else {
            alert('No se pudo calcular la ruta: ' + status);
        }
    });
}

// Función para crear una ruta entre origen y destino
function createRoute() {
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;

    if (!origin || !destination) {
        alert('Por favor ingrese origen y destino');
        return;
    }

    directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
    }, (response, status) => {
        if (status === 'OK') {
            console.log('Ruta creada:', response);
            mainRouteRenderer.setDirections(response);
            currentRoute = response;

            // Calcular tiempo de la ruta original
            const duration = response.routes[0].legs[0].duration.value;
            const distance = response.routes[0].legs[0].distance.value;
            const timeInMinutes = Math.ceil(duration / 60);
            const distanceInKm = (distance / 1000).toFixed(1);

            // Actualizar el panel de información
            updateRouteInfo(timeInMinutes, distanceInKm);

            // Continuar con el resto del código existente...
            const bounds = new google.maps.LatLngBounds();
            const route = response.routes[0];
            route.legs.forEach(leg => {
                leg.steps.forEach(step => {
                    bounds.extend(step.start_location);
                });
            });
            map.fitBounds(bounds);

            // Actualizar ubicación actual y calcular pedidos cercanos
            geocoder.geocode({ address: origin }, (results, status) => {
                if (status === 'OK') {
                    currentLocation = results[0].geometry.location;
                    displayAvailableOrders();
                }
            });
        } else {
            console.error('Error al calcular ruta:', status);
            alert('No se pudo calcular la ruta: ' + status);
        }
    });
}

// Actualizar la función createRoute para el nuevo diseño del panel de información
function updateRouteInfo(timeInMinutes, distanceInKm) {
    const routeInfoPanel = document.getElementById('routeInfoPanel');
    routeInfoPanel.innerHTML = `
        <div class="route-info">
            <h3>Ruta Original</h3>
            <p>🕒 Tiempo estimado: ${timeInMinutes} minutos</p>
            <p>📍 Distancia: ${distanceInKm} km</p>
        </div>
    `;
}

// Función para actualizar todas las rutas
function updateAllRoutes() {
    // Limpiar rutas anteriores
    routeRenderers.forEach(renderer => renderer.setMap(null));
    routeRenderers = [];

    if (!currentRoute) return;

    const origin = currentRoute.routes[0].legs[0].start_location;
    const finalDestination = currentRoute.routes[0].legs[0].end_location;

    // Construir waypoints con todos los pedidos activos
    const waypoints = [];
    activeOrders.forEach(order => {
        waypoints.push(
            { location: order.store.coords, stopover: true },
            { location: order.customer.coords, stopover: true }
        );
    });

    // Calcular la ruta completa
    directionsService.route({
        origin: origin,
        destination: finalDestination,
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
        if (status === 'OK') {
            // Crear un nuevo renderizador para esta ruta
            const newRenderer = new google.maps.DirectionsRenderer({
                suppressMarkers: true,
                polylineOptions: {
                    strokeColor: '#6B46C1',
                    strokeWeight: 5,
                    strokeOpacity: 0.8
                }
            });
            newRenderer.setMap(map);
            newRenderer.setDirections(result);
            routeRenderers.push(newRenderer);

            // Actualizar currentRoute para futuros cálculos
            currentRoute = result;

            // Recalcular desviaciones para pedidos pendientes
            displayAvailableOrders();
        }
    });
}

// Añadir la función updateActiveOrdersPanel
function updateActiveOrdersPanel() {
    const activeOrdersList = document.getElementById('activeOrdersList');
    if (!activeOrdersList) return;

    if (activeOrders.length === 0) {
        activeOrdersList.innerHTML = `
            <div style="text-align: center; color: var(--text-color); padding: 20px;">
                No hay pedidos activos
            </div>
        `;
        return;
    }

    activeOrdersList.innerHTML = activeOrders.map((order, index) => `
        <div class="active-order-item">
            <h4>Pedido ${order.id}</h4>
            <div style="margin-bottom: 5px;">
                <div>🏪 ${order.store.name}</div>
                <div>📍 ${order.customer.info}</div>
            </div>
            <div class="order-actions">
                <button onclick="removeOrder(${index})" class="delete-order">
                    Cancelar
                </button>
                <button onclick="completeOrder(${index})" class="complete-order">
                    Completar
                </button>
            </div>
        </div>
    `).join('');
}

// Añadir las funciones para manejar los pedidos
function removeOrder(index) {
    if (confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
        const order = activeOrders[index];
        activeOrders.splice(index, 1);
        order.status = orderStatus.PENDING;
        totalEarnings -= order.price;
        updateActiveOrdersPanel();
        updateAllRoutes();
        displayAvailableOrders();
    }
}

function completeOrder(index) {
    const order = activeOrders[index];
    activeOrders.splice(index, 1);
    order.status = orderStatus.COMPLETED;
    
    // Mostrar mensaje de éxito
    showNotification('¡Pedido Completado!', `Has completado el pedido ${order.id} exitosamente.`, 'success');
    
    updateActiveOrdersPanel();
    updateAllRoutes();
    displayAvailableOrders();
}

// Función helper para mostrar notificaciones
function showNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 1002;
        text-align: center;
        min-width: 300px;
    `;

    const backgroundColor = type === 'success' ? '#4CAF50' : '#6B46C1';

    notification.innerHTML = `
        <h3 style="margin: 0 0 10px 0; color: ${backgroundColor};">${title}</h3>
        <p style="margin: 0 0 15px 0;">${message}</p>
        <button 
            onclick="this.parentElement.remove()"
            style="
                padding: 8px 16px;
                background: ${backgroundColor};
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            "
        >
            Aceptar
        </button>
    `;

    document.body.appendChild(notification);
    
    // Remover la notificación automáticamente después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Inicializar el mapa cuando se carga la página
window.initMap = initMap;