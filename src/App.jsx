import { useState, useMemo } from "react";

const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic","Ene'27"];
const MES_VOL_HASTA = 1;
const MES_OBL_DESDE = 2;

// Mes activo calculado automáticamente según fecha actual
// Enero=0, Feb=1, Mar=2 ... Dic=11, y si es 2027 Ene=12
function calcMesActivo(){
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = hoy.getMonth(); // 0-based
  if(anio === 2026) return Math.min(mes, 12);
  if(anio === 2027 && mes === 0) return 12;
  if(anio > 2027) return 12;
  return 2; // fallback marzo
}
const MES_ACTIVO = calcMesActivo();

const raw = [
  {p:"6",  n:"MARCO CERDA",                              rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"7",  n:"ADELITA DEL CARMEN RAMIREZ FAUDEZ",        rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"10", n:"GUISELA DEL CARMEN REYES BELTRAN",         rifa:0,mant:0,      pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000,0]},
  {p:"13", n:"CAROLINA ANDREA TRUJILLO PINO",            rifa:0,mant:0,      pagos:[0,0,3000,3000,3000,3000,3000,0,0,0,0,0,0]},
  {p:"14", n:"ESTEBAN DAVID MIERES BOBADILLA",           rifa:10000,mant:0,  pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,3000,3000,0,10000]},
  {p:"15", n:"OSCAR ANTONIO GONZALEZ RETAMAL",           rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"16", n:"LUIS ALBERTO ZUÑIGA DINAMARCA",            rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"17", n:"CLAUDIA ALEJANDRA ROJAS ORDENES",          rifa:10000,mant:0,  pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"18", n:"CRISTIAN ANDRES ENCINA VARGAS",            rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"19", n:"CESAR HUGO AEDO VISCARRA",                 rifa:10000,mant:20000,pagos:[0,10000,3000,3000,3000,3000,3000,0,0,0,0,0,0]},
  {p:"20A",n:"PATRICIO HERMINIO CARTES LARA",            rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"20B",n:"MARIA JESUS MENESES VALDES",               rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"21A",n:"JULIO ELADIO MATURANA GODOY",              rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"21B",n:"MARIA LORETO VILLAGRAN GONZALEZ",          rifa:0,mant:0,      pagos:[0,0,3000,3000,3000,0,0,0,0,0,0,0,0]},
  {p:"22", n:"HECTOR ANDRES ORELLANA ROJAS",             rifa:10000,mant:0,  pagos:[0,0,15000,0,0,0,0,0,0,0,0,0,0]},
  {p:"23", n:"ANA MARIA DURAN LEYTON",                   rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"24", n:"LUIS ALBERTO ZUÑIGA DINAMARCA",            rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"25", n:"SOLEDAD DE LAS NIEVES SALAZAR SALAZAR",    rifa:20000,mant:80000,pagos:[0,15000,15000,15000,15000,20000,15000,15000,20000,0,0,0,0]},
  {p:"26", n:"ROBERTO ALEJANDRO VASQUEZ VERDUGO",        rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"27", n:"JUAN ALBERTO DIAZ ALCAPIO",                rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"28", n:"GINETTE MIGUELINA GUIÑEZ JAQUE",           rifa:10000,mant:10000,pagos:[0,0,3000,3000,0,0,0,0,0,0,0,0,0]},
  {p:"29", n:"ROSA YOLANDA DEL CARMEN PEREZ MONDACA",    rifa:10000,mant:0,  pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,4000,0,0,0]},
  {p:"30", n:"LORENA VIRGINIA LOZA DE SAN MARTIN",       rifa:0,mant:10000,  pagos:[0,0,3000,3000,3000,0,0,0,0,0,0,0,0]},
  {p:"31", n:"EMILSE PATRICIA JARAMILLO HENAO",          rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"32", n:"MARCELA DE LAS MERCEDES MUÑOZ RAMIREZ",    rifa:10000,mant:0,  pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000,0]},
  {p:"33", n:"CARLOS",                                   rifa:0,mant:10000,  pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000]},
  {p:"34", n:"CRISTOPHER ANTONIO ARCO RAIN",             rifa:10000,mant:10000,pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,0,0,0,0]},
  {p:"35", n:"VALESKA FERNANDA ROMERO FERREIRA",         rifa:0,mant:0,      pagos:[0,0,3000,3000,3000,3000,3000,0,0,0,0,0,0]},
  {p:"36", n:"CRISTIAN MARCELO SALGADO ROJAS",           rifa:10000,mant:0,  pagos:[0,0,3000,3000,4000,3000,3000,4000,0,0,0,0,0]},
  {p:"37", n:"ROSA YOLANDA DEL CARMEN PEREZ MONDACA",    rifa:10000,mant:0,  pagos:[0,0,3000,3000,3000,3000,3000,0,0,0,0,0,0]},
  {p:"38", n:"RAMON ENRIQUE SAEZ PULIDO",                rifa:10000,mant:0,  pagos:[0,0,3000,3000,3000,3000,0,0,0,0,0,0,0]},
  {p:"39", n:"PEDRO EMERENCIANO VERGARA ORELLANA",       rifa:0,mant:0,      pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000,0]},
  {p:"40", n:"DIEGO ANDRES VALCARCE RIVERA",             rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"41", n:"PAOLA GUZMAN PIÑA",                        rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"42", n:"VANESSA HERMINIA INOSTROSA LARA",          rifa:0,mant:0,      pagos:[0,0,3000,3000,3000,3000,0,0,0,0,0,0,0]},
  {p:"43", n:"MARIA EUGENIA DELGADO TORRES",             rifa:0,mant:10000,  pagos:[0,5000,5000,5000,5000,5000,5000,0,0,0,0,0,0]},
  {p:"44", n:"MARTA IVON VEJAR MELO",                    rifa:0,mant:20000,  pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,3000,5000,0,0]},
  {p:"45", n:"PEDRO RENE COFRE INOSTROZA",               rifa:0,mant:0,      pagos:[0,0,3000,0,0,0,0,0,0,0,0,0,0]},
  {p:"46", n:"DAVID ALEJANDRO JOFRE JOFRE",              rifa:20000,mant:10000,pagos:[0,20000,15000,15000,15000,10000,0,0,0,0,0,0,0]},
  {p:"47", n:"ANDREINA CHIQUINQUIRA POZO NAVA",          rifa:0,mant:10000,  pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000,0]},
  {p:"48", n:"JORGE ARMANDO VERGARA ALARCON",            rifa:0,mant:0,      pagos:[0,0,10000,0,0,3000,3000,3000,3000,3000,3000,5000,0]},
  {p:"49", n:"DANIA MARIA CANALES INZULZA",              rifa:10000,mant:10000,pagos:[0,0,10000,10000,10000,10000,10000,10000,0,0,0,0,0]},
  {p:"50", n:"PEDRO RENE COFRE INOSTROZA",               rifa:0,mant:0,      pagos:[0,0,3000,0,0,0,0,0,0,0,0,0,0]},
  {p:"51", n:"ANA MARIA ORTEGA BRIONES",                 rifa:0,mant:0,      pagos:[0,0,3000,3000,4000,0,0,0,0,0,0,0,0]},
  {p:"52", n:"CARLOS AURELIO FUENZALIDA ALFARO",         rifa:0,mant:0,      pagos:[0,0,3000,3000,3000,3000,3000,0,0,0,0,0,0]},
  {p:"53", n:"PABLO ANDRES VALENZUELA ESPINOZA",         rifa:10000,mant:5000,pagos:[0,0,5000,3000,3000,3000,0,0,0,0,0,0,0]},
  {p:"54", n:"CHRISTOPHER ALEXIS PARRA ROJAS",           rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"55", n:"ELISABETH CIFUENTES LUNA",                 rifa:10000,mant:0,  pagos:[0,0,3000,3000,3000,3000,3000,4000,0,0,0,0,0]},
  {p:"56", n:"FRANCISCO JAVIER TORRECILLA CEREY",        rifa:10000,mant:10000,pagos:[10000,0,3000,3000,3000,3000,3000,3000,4000,0,0,0,0]},
  {p:"57", n:"JESENIA DEL CARMEN BASOALTO BASOALTO",     rifa:10000,mant:0,  pagos:[0,0,4000,2000,3000,0,0,0,0,0,0,0,0]},
  {p:"58", n:"JOSE BENITO HERRERA CASTRO",               rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"59A",n:"MAURICIO GUILLERMO SEPULVEDA HORMAZABAL",  rifa:0,mant:30000,  pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"59B",n:"MARIO GUILLERMO SEPULVEDA FIGUEROA",       rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"60A",n:"MARIA SOLEDAD BOBADILLA BOBADILLA",        rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"60B",n:"FLORENTINO RAUL LEAL FERNANDEZ",           rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"61", n:"IVAN ANDRES MERINO HERNANDEZ",             rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"62", n:"ESTEBAN ROA",                              rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"63", n:"JENNY DEL PILAR ARZOLA AGUAYO",            rifa:0,mant:0,      pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000,0]},
  {p:"64", n:"NATIVIDAD DEL CARMEN ZAMBRANO CARRASCO",   rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"65", n:"MARCOS EUGENIO SEGUEL CHAVEZ",             rifa:0,mant:5000,   pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"66", n:"JOSSELIN FABIOLA JORQUERA PARRA",          rifa:0,mant:0,      pagos:[0,0,3000,3000,3000,0,0,0,0,0,0,0,0]},
  {p:"67A",n:"ANGEL VELASCO GONZALEZ",                   rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"67B",n:"ALVARO DANILO VERGARA ALARCON",            rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"68", n:"LUIS GUILLERMO GUTIERREZ MORALES",         rifa:10000,mant:60000,pagos:[20000,5000,5000,5000,5000,5000,5000,5000,5000,5000,5000,5000,25000]},
  {p:"69", n:"NICOLAS ANTONIO ROJAS VENEGAS",            rifa:0,mant:5000,   pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"70", n:"ANDREA DEL CARMEN MUÑOZ ROZAS",            rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"71", n:"ELISABETH CIFUENTES LUNA",                 rifa:0,mant:0,      pagos:[0,0,3000,3000,3000,3000,3000,4000,0,0,0,0,0]},
  {p:"72", n:"JULIA DE LAS MERCEDES BASTIAS GAETE",      rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"73", n:"JULIA DE LAS MERCEDES BASTIAS GAETE",      rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"74", n:"MARIA CUPERTINA ARRIAGADA VALDES",         rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"75", n:"ELIDE CECILIA CABELLO CUBILLO",            rifa:10000,mant:0,  pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,3000,0,0,0]},
  {p:"76A",n:"PABLO JOSE ABURTO GUTIERREZ",              rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"76B",n:"MANUEL ENRIQUE GONZALEZ MOROSO",           rifa:0,mant:0,      pagos:[0,0,3000,3000,4000,0,0,0,0,0,0,0,0]},
  {p:"77A",n:"OLGA RAQUEL VARGAS PEREZ",                 rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"77B",n:"DIEGO HERNAN MUÑOZ MUÑOZ",                 rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"78A",n:"DANIELA CONSTANZA GUZMAN FLORES",          rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"78B",n:"XIMENA DEL CARMEN OCALLO LLANOS",          rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"79A",n:"LUIS ANTONIO VARELA VALDEBENITO",          rifa:0,mant:0,      pagos:[20000,0,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000,0]},
  {p:"79B",n:"SOFIA RAQUEL CONDOR GUERE",                rifa:10000,mant:10000,pagos:[0,10000,10000,5000,5000,5000,5000,5000,5000,0,0,0,0]},
  {p:"80", n:"ALEJANDRA ESTER ESPINOSA VEGA",            rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"81", n:"VERONICA ANGELICA ROJAS COFRE",            rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"82", n:"ESTEBAN DAVID MIERES BOBADILLA",           rifa:10000,mant:0,  pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000,0]},
  {p:"83", n:"MARITZA ELIZABETH CEBALLOS SILVA",         rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"84", n:"YONATAN ALEXANDER AGUILAR VALENZUELA",     rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"85", n:"CRISTIAN RODRIGO VARGAS ASENCIO",          rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"86", n:"MANUEL IGNACIO MUÑOZ MUÑOZ",               rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"87", n:"CARLA ANDREA CEPEDA PINTO",                rifa:0,mant:0,      pagos:[0,0,3000,3000,4000,0,0,0,0,0,0,0,0]},
  {p:"88", n:"DANIEL ERNESTO ZUÑIGA MORA",               rifa:0,mant:5000,   pagos:[0,0,3000,3000,4000,0,0,0,0,0,0,0,0]},
  {p:"89", n:"HECTOR MAURICIO HORMAZABAL CAMPOS",        rifa:10000,mant:10000,pagos:[0,0,10000,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000]},
  {p:"90A",n:"ANDREA DE LAS MERCEDES LOPEZ VERDUGO",     rifa:0,mant:10000,  pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000,0]},
  {p:"90B",n:"ERNESTO ALFONSO VASQUEZ IZETA",            rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"91", n:"ERNESTO ALFONSO VASQUEZ IZETA",            rifa:0,mant:0,      pagos:[0,0,3000,3000,3000,3000,3000,0,0,0,0,0,0]},
  {p:"92", n:"MYRIAM SOLEDAD GUTIERREZ CAMPO",           rifa:0,mant:0,      pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000,9000]},
  {p:"93", n:"PEDRO RENE COFRE INOSTROZA",               rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"94", n:"SERGIO ANTONIO OBANDO OBANDO",             rifa:0,mant:0,      pagos:[0,0,10000,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000]},
  {p:"95", n:"PEDRO MORALES",                            rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"96", n:"RONNY ANDRES GONZALEZ ARIAS",              rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"97", n:"CARLOS HERNAN CAMPOS ARRIAGADA",           rifa:10000,mant:20000,pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"98", n:"CLAUDIO TORRECILLA",                       rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"99", n:"REINALDO PATRICIO CASTILLO BURGOS",        rifa:0,mant:0,      pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000,0]},
  {p:"100",n:"YENIFER DEL ROSARIO CANALES DIAZ",         rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"101",n:"MARCOS EUGENIO SEGUEL CHAVEZ",             rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"102",n:"LILIA SARAI CASANOVA VILLALOBOS",          rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"103",n:"LILIA SARAI CASANOVA VILLALOBOS",          rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"104",n:"FELIX ANTONIO RAMIREZ DIAZ",               rifa:0,mant:10000,  pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"105",n:"OMAR ANTONIO CARRASCO FUENTES",            rifa:0,mant:0,      pagos:[0,0,10000,10000,10000,10000,0,0,0,0,0,0,0]},
  {p:"106",n:"OMAR ANTONIO CARRASCO FUENTES",            rifa:0,mant:0,      pagos:[0,0,10000,10000,10000,10000,0,0,0,0,0,0,0]},
  {p:"107",n:"SANDRA PAOLA REYES MARTINEZ",              rifa:10000,mant:0,  pagos:[0,0,3000,3000,3000,3000,0,0,0,0,0,0,0]},
  {p:"108",n:"WILLIAM ALEGRE MARIN",                     rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"110",n:"JOCSAN GLORIA RAMIREZ GOMEZ",              rifa:10000,mant:0,  pagos:[0,0,3000,3000,3000,3000,3000,0,0,0,0,0,0]},
  {p:"111",n:"BERNARDITA YOLANDA NORAMBUENA AVILA",      rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"113",n:"PATRICIO IVAN SALINAS OYARZUN",            rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"115",n:"JOHANA YAMILE ENRIQUETA GARRIDO STAPPUNG", rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"116",n:"CARLOS FABRICIANO PARADA BRITO",           rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"117",n:"JOHANA YAMILE ENRIQUETA GARRIDO STAPPUNG", rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"118",n:"FERNANDO ALEJANDRO GUAJARDO ARAYA",        rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"121",n:"BLANCA ISABEL DIAZ POBLETE",               rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"122",n:"ESTEBAN FABIAN MORENO VALENZUELA",         rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"123",n:"MAURICIO EUGENIO NUÑEZ MORENO",            rifa:0,mant:0,      pagos:[0,0,3000,3000,3000,3000,0,0,0,0,0,0,0]},
  {p:"125",n:"VICTOR MANUEL BARRIOS CABEZAS",            rifa:0,mant:0,      pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,3000,3000,0,0]},
  {p:"126",n:"MANUEL ANTONIO BECERRA PACHECO",           rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"128",n:"VERONICA DEL CARMEN GONZALEZ FUENTES",     rifa:20000,mant:10000,pagos:[0,5000,15000,5000,3000,3000,4000,3000,3000,4000,3000,3000,4000]},
  {p:"129",n:"JOSE LUIS CAMPAL ANGULO",                  rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"130",n:"LUIS ALBERTO VASQUEZ ALVAREZ",             rifa:10000,mant:0,  pagos:[0,0,3000,3000,4000,0,0,0,0,0,0,0,0]},
  {p:"131",n:"DANIEL ISRAEL RAMIREZ GOMEZ",              rifa:10000,mant:0,  pagos:[0,0,3000,3000,3000,3000,0,0,0,0,0,0,0]},
  {p:"135",n:"CRISTIAN VICENTE MOYA ALMONACID",          rifa:0,mant:0,      pagos:[0,0,3000,0,0,0,0,0,0,0,0,0,0]},
  {p:"136",n:"SEBASTIAN LISANDRO MOYA ALMONACID",        rifa:0,mant:0,      pagos:[0,0,3000,0,0,0,0,0,0,0,0,0,0]},
  {p:"137",n:"SEBASTIAN LISANDRO MOYA ALMONACID",        rifa:0,mant:0,      pagos:[0,0,3000,0,0,0,0,0,0,0,0,0,0]},
  {p:"138",n:"CRISTIAN VICENTE MOYA ALMONACID",          rifa:0,mant:0,      pagos:[0,0,3000,0,0,0,0,0,0,0,0,0,0]},
  {p:"139",n:"FRANCISCO JAVIER VILLAGRA SILVA",          rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"140",n:"RUBEN ALEJANDRO CARCAMO RIQUELME",         rifa:0,mant:10000,  pagos:[0,0,3000,3000,3000,0,0,0,0,0,0,0,0]},
  {p:"141",n:"RODRIGO ALONSO SALCEDO FERNANDEZ",         rifa:0,mant:0,      pagos:[0,0,3000,3000,4000,3000,3000,3000,3000,3000,0,0,0]},
  {p:"142",n:"CARMEN DORIS CACERES NUÑEZ",               rifa:0,mant:0,      pagos:[0,0,3000,3000,3000,3000,3000,5000,0,0,0,0,0]},
  {p:"143",n:"SOLANGE ANAMOUR BARRA NUÑEZ",              rifa:0,mant:15000,  pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,0,0,0,0]},
  {p:"144",n:"ALEXIS FELIPE ROJAS OBANDO",               rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"146",n:"CAMILA IGNACIA BELMAR IMAS",               rifa:0,mant:10000,  pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000,0]},
  {p:"147",n:"GENESIS PAMELA BELMAR IMAS",               rifa:10000,mant:10000,pagos:[0,0,0,15000,15000,0,0,0,0,0,0,0,0]},
  {p:"149",n:"NANCY DE LAS MERCEDES IBARRA VARELA",      rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"150",n:"EDISON DARIO MARTINI VALDEBENITO",         rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"160",n:"JOSE RENE ZENTENO MORALES",                rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"161",n:"JOSE RENE ZENTENO MORALES",                rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"170",n:"CONSTANZA ANDREA KERRIGAN PUIG",           rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"171",n:"CARLA JULIETA AGUILAR CARO",               rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"172",n:"KATHERINE GREETA LEIVA ITURRA",            rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"176",n:"MARCELA MARLENE CASTRO LEDESMA",           rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"177",n:"JACQUELINE DE LAS ROSAS SALGADO VALDES",   rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"178",n:"ALFREDO ERNESTO POBLETE TAPIA",            rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"180",n:"LUZ ELENA CANALES ARGEL",                  rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"184",n:"CAMILA NOEMI REYES GONZALEZ",              rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"185",n:"CARLOS ALBERTO ROJAS CESPED",              rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"186",n:"PATRICIO JESUS CALDERON RODRIGUEZ",        rifa:10000,mant:10000,pagos:[0,20000,20000,20000,20000,0,0,0,0,0,0,0,0]},
  {p:"187",n:"ANGELO RUDI SAEZ PIZARRO",                 rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"188",n:"PAULINA SYLVIA ROBLEDO ARRUE",             rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"189",n:"LUZ ELENA CANALES ARGEL",                  rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"190",n:"CLAUDIO ARIEL VALENCIA DIAZ",              rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"191",n:"ALFREDO ERNESTO POBLETE TAPIA",            rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"193",n:"MANUEL EDUARDO FARIAS ARELLANO",           rifa:10000,mant:10000,pagos:[0,0,3000,10000,3000,4000,0,0,0,0,0,0,0]},
  {p:"194",n:"MONICA XIMENA VELIZ RUIZ",                 rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"195",n:"MARCO ANTONIO RIVEROS CARREÑO",            rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"196",n:"ROSA DEL CARMEN ROJAS BELTRAN",            rifa:0,mant:0,      pagos:[0,0,3000,3000,3000,0,0,0,0,0,0,0,0]},
  {p:"197",n:"PEDRO ANTONIO MUÑOZ DIAZ",                 rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"198",n:"CARLOS ENRIQUE VEJAR CALABRANO",           rifa:10000,mant:0,  pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"199",n:"MANUEL ALEJANDRO VEJAR REYES",             rifa:0,mant:0,      pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
];

function getEstado(pagos){
  return pagos.slice(MES_OBL_DESDE,MES_ACTIVO).every(v=>v>0)?"Al Día":"Pendiente";
}

// Paleta naturaleza
const N = {
  // Fondos
  bgPage:   "#1a1f12",
  bgCard:   "#232b18",
  bgCard2:  "#1e2614",
  bgInput:  "#141a0d",
  // Verdes
  verde:    "#6a9e3f",
  verdeClaro:"#8bc34a",
  verdeBg:  "#1d2e10",
  verdeBorde:"#4a7a25",
  // Cafés/tierra
  cafe:     "#8d6e4a",
  cafeBg:   "#2e1f0f",
  cafeBorde:"#6b4f2e",
  // Rojo/alerta
  rojo:     "#c0392b",
  rojoBg:   "#2e1010",
  rojoBorde:"#8b2020",
  // Amarillo
  amarillo: "#e6a817",
  amarilloBg:"#2a2005",
  // Azul info
  azul:     "#4a90c4",
  azulBg:   "#102030",
  azulBorde:"#2060a0",
  // Texto
  texto:    "#e8ead4",
  textoMuted:"#9aaa7a",
  borde:    "#3a4a25",
};

export default function App(){
  const [vista,setVista]=useState("dashboard");
  const [parcela,setParcela]=useState("");
  const [resultado,setResultado]=useState(null);
  const [error,setError]=useState("");

  const stats=useMemo(()=>({
    total:raw.length,
    alDia:raw.filter(r=>getEstado(r.pagos)==="Al Día").length,
    pendiente:raw.filter(r=>getEstado(r.pagos)==="Pendiente").length,
  }),[]);

  function buscar(){
    setError("");setResultado(null);
    const q=parcela.trim().toUpperCase();
    if(!q){setError("Ingresa el número de tu parcela.");return;}
    const f=raw.find(r=>r.p.toUpperCase()===q);
    if(!f){setError("Parcela no encontrada. Verifica el número.");return;}
    setResultado(f);
  }

  const cardBase={
    background:N.bgCard,
    borderRadius:16,
    border:`1.5px solid ${N.borde}`,
    padding:"20px",
  };

  return(
    <div style={{minHeight:"100vh",background:N.bgPage,color:N.texto,fontFamily:"'Segoe UI',system-ui,sans-serif",maxWidth:480,margin:"0 auto"}}>

      {/* HEADER */}
      <div style={{background:N.bgCard,borderBottom:`2px solid ${N.verde}`,padding:"16px 20px",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <img
            src="https://i.imgur.com/YmOYHXM.jpeg"
            alt="Logo Comunidad Las Nipas"
            style={{width:48,height:48,borderRadius:12,objectFit:"cover",border:`2px solid ${N.verdeBorde}`}}
            onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}
          />
          <div style={{width:48,height:48,borderRadius:12,background:N.verdeBg,border:`2px solid ${N.verdeBorde}`,display:"none",alignItems:"center",justifyContent:"center",fontSize:24}}>🌿</div>
          <div>
            <div style={{fontWeight:800,fontSize:17,letterSpacing:.5,color:N.texto}}>COMUNIDAD LAS NIPAS</div>
            <div style={{fontSize:12,color:N.textoMuted,marginTop:1}}>Control de Aportes 2026 – 2027</div>
          </div>
        </div>
        {/* Tabs */}
        <div style={{display:"flex",gap:8}}>
          {[["dashboard","📊","Dashboard"],["residente","🏠","Mi Parcela"]].map(([v,ico,lbl])=>(
            <button key={v} onClick={()=>{setVista(v);setError("");setResultado(null);setParcela("");}} style={{
              flex:1,padding:"12px 8px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:15,
              transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:6,
              background:vista===v?N.verde:N.bgCard2,
              color:vista===v?"#fff":N.textoMuted,
              boxShadow:vista===v?`0 2px 12px ${N.verde}44`:"none",
            }}>{ico} {lbl}</button>
          ))}
        </div>
      </div>

      <div style={{padding:"20px 16px"}}>

        {/* ── DASHBOARD ── */}
        {vista==="dashboard"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>

            {/* Título sección */}
            <div style={{fontSize:12,color:N.textoMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>
              Resumen General
            </div>

            {/* Tarjeta principal */}
            <div style={{...cardBase,textAlign:"center",padding:"36px 20px",background:`linear-gradient(135deg,${N.bgCard} 0%,${N.verdeBg} 100%)`,borderColor:N.verdeBorde}}>
              <div style={{fontSize:13,color:N.textoMuted,fontWeight:700,letterSpacing:.5,marginBottom:8}}>TOTAL PARCELAS</div>
              <div style={{fontSize:80,fontWeight:900,color:N.verdeClaro,lineHeight:1}}>{stats.total}</div>
              <div style={{fontSize:14,color:N.textoMuted,marginTop:8}}>registradas en el período</div>
            </div>

            {/* Tarjetas secundarias */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div style={{...cardBase,textAlign:"center",padding:"24px 12px",borderColor:N.verdeBorde,background:N.verdeBg}}>
                <div style={{fontSize:40,marginBottom:8}}>✅</div>
                <div style={{fontSize:48,fontWeight:900,color:N.verdeClaro,lineHeight:1}}>{stats.alDia}</div>
                <div style={{fontSize:14,color:N.textoMuted,fontWeight:700,marginTop:8}}>Al Día</div>
              </div>
              <div style={{...cardBase,textAlign:"center",padding:"24px 12px",borderColor:N.rojoBorde,background:N.rojoBg}}>
                <div style={{fontSize:40,marginBottom:8}}>⚠️</div>
                <div style={{fontSize:48,fontWeight:900,color:"#e57373",lineHeight:1}}>{stats.pendiente}</div>
                <div style={{fontSize:14,color:N.textoMuted,fontWeight:700,marginTop:8}}>Con Pendientes</div>
              </div>
            </div>

            <div style={{textAlign:"center",fontSize:13,color:N.textoMuted,background:N.bgCard2,borderRadius:10,padding:"10px 14px",border:`1px solid ${N.borde}`}}>
              📅 Estado basado en meses obligatorios vencidos<br/>
              <strong style={{color:N.verde}}>
                Marzo — {["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic","Ene"][MES_ACTIVO-1]} {MES_ACTIVO<=12?"2026":"2027"}
              </strong>
            </div>
          </div>
        )}

        {/* ── RESIDENTE ── */}
        {vista==="residente"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>

            <div style={{fontSize:12,color:N.textoMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>
              Consulta tu Parcela
            </div>

            {/* Bienvenida */}
            {!resultado&&(
              <div style={{...cardBase,textAlign:"center",padding:"24px 20px",borderColor:N.verdeBorde,background:N.verdeBg}}>
                <div style={{fontSize:36,marginBottom:10}}>👋</div>
                <div style={{fontSize:20,fontWeight:800,color:N.texto,marginBottom:8}}>¡Bienvenido/a!</div>
                <div style={{fontSize:15,color:N.textoMuted,lineHeight:1.6}}>
                  Aquí puedes consultar el estado de tus pagos.<br/>
                  Solo ingresa el <strong style={{color:N.verdeClaro}}>número de tu parcela</strong> y presiona <strong style={{color:N.verdeClaro}}>Ir</strong>.
                </div>
              </div>
            )}

            {/* Buscador */}
            <div style={cardBase}>
              <div style={{fontSize:16,color:N.textoMuted,marginBottom:14,fontWeight:500}}>¿Cuál es tu parcela?</div>
              <div style={{display:"flex",gap:10}}>
                <input
                  placeholder="Ej: 10, 46, 79B..."
                  value={parcela}
                  onChange={e=>{setParcela(e.target.value);setError("");setResultado(null);}}
                  onKeyDown={e=>e.key==="Enter"&&buscar()}
                  style={{
                    flex:1,padding:"14px 16px",borderRadius:12,
                    border:`2px solid ${N.borde}`,background:N.bgInput,
                    color:N.texto,fontSize:18,outline:"none",
                    WebkitAppearance:"none",fontWeight:600,
                  }}
                />
                <button onClick={buscar} style={{
                  padding:"14px 22px",background:N.verde,color:"#fff",border:"none",
                  borderRadius:12,cursor:"pointer",fontWeight:800,fontSize:18,
                  boxShadow:`0 4px 16px ${N.verde}55`,
                  WebkitTapHighlightColor:"transparent",
                }}>Ir</button>
              </div>
              {error&&(
                <div style={{marginTop:12,color:"#ff8a80",fontSize:15,display:"flex",alignItems:"center",gap:8,background:N.rojoBg,borderRadius:10,padding:"10px 14px",border:`1px solid ${N.rojoBorde}`}}>
                  ⚠️ {error}
                </div>
              )}
            </div>

            {/* Resultado */}
            {resultado&&(()=>{
              const r=resultado;
              const alDia=getEstado(r.pagos)==="Al Día";
              const totalPagado=r.pagos.reduce((s,v)=>s+v,0);
              return(
                <>
                  {/* Tarjeta estado */}
                  <div style={{...cardBase,borderColor:alDia?N.verdeBorde:N.rojoBorde,background:alDia?N.verdeBg:N.rojoBg}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                      <div>
                        <div style={{fontSize:13,color:N.textoMuted,marginBottom:4,fontWeight:700,letterSpacing:.5}}>PARCELA</div>
                        <div style={{fontSize:56,fontWeight:900,color:alDia?N.verdeClaro:"#ef9a9a",lineHeight:1}}>{r.p}</div>
                        <div style={{fontSize:15,color:N.amarillo,fontWeight:700,marginTop:10}}>
                          💵 Total pagado:<br/>
                          <span style={{fontSize:20}}>${totalPagado.toLocaleString("es-CL")}</span>
                        </div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end"}}>
                        <div style={{
                          padding:"10px 18px",borderRadius:12,fontWeight:800,fontSize:16,textAlign:"center",
                          background:alDia?N.verde:N.rojo,color:"#fff",
                          boxShadow:alDia?`0 4px 14px ${N.verde}55`:`0 4px 14px ${N.rojo}55`,
                        }}>
                          {alDia?"✅ Al Día":"⚠️ Pendiente"}
                        </div>
                        {r.rifa>0&&(
                          <div style={{fontSize:14,color:"#f48fb1",background:"#2a0f1e",padding:"8px 14px",borderRadius:10,border:"1.5px solid #7b1f4a",fontWeight:700,textAlign:"center"}}>
                            🎟️ Rifa<br/><span style={{fontSize:17}}>${r.rifa.toLocaleString("es-CL")}</span>
                          </div>
                        )}
                        {r.mant>0&&(
                          <div style={{fontSize:14,color:"#81d4fa",background:N.azulBg,padding:"8px 14px",borderRadius:10,border:`1.5px solid ${N.azulBorde}`,fontWeight:700,textAlign:"center"}}>
                            🔧 Mantención<br/><span style={{fontSize:17}}>${r.mant.toLocaleString("es-CL")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Grid de meses */}
                  <div style={cardBase}>
                    <div style={{fontSize:16,fontWeight:800,marginBottom:16,color:N.texto}}>Estado de Pagos</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                      {MESES.map((mes,i)=>{
                        const pago=r.pagos[i];
                        const esVol=i<=MES_VOL_HASTA;
                        const esOblVenc=i>=MES_OBL_DESDE&&i<MES_ACTIVO;
                        const esPorVencer=i>=MES_ACTIVO;
                        const pagado=pago>0;
                        const pendiente=esOblVenc&&!pagado;

                        let bg=N.bgCard2,borde=N.borde,textCol=N.textoMuted;
                        if(pagado){bg=N.verdeBg;borde=N.verdeBorde;textCol=N.verdeClaro;}
                        else if(pendiente){bg=N.rojoBg;borde=N.rojoBorde;textCol="#ef9a9a";}
                        else if(esPorVencer){bg:"#141a0d";borde=N.borde;textCol="#4a5a35";}

                        return(
                          <div key={i} style={{borderRadius:12,padding:"12px 6px",textAlign:"center",background:bg,border:`1.5px solid ${borde}`}}>
                            <div style={{fontSize:12,fontWeight:800,color:N.textoMuted,marginBottom:2}}>{mes}</div>
                            {esVol&&<div style={{fontSize:9,color:N.amarillo,fontWeight:800,marginBottom:4}}>VOLUNTARIO</div>}
                            {esOblVenc&&!pagado&&<div style={{fontSize:9,color:"transparent",marginBottom:4}}>‎</div>}
                            {esOblVenc&&pagado&&<div style={{fontSize:9,color:"transparent",marginBottom:4}}>‎</div>}
                            {                        esPorVencer&&<div style={{fontSize:9,color:"#7a9a55",fontWeight:800,marginBottom:4}}>POR VENCER</div>}
                            {!esVol&&!esPorVencer&&pendiente&&<div style={{fontSize:9,color:"transparent",marginBottom:4}}>‎</div>}
                            <div style={{fontSize:22,margin:"2px 0"}}>
                              {pagado?"✅":pendiente?"❌":esPorVencer?"🕐":"—"}
                            </div>
                            <div style={{fontSize:11,color:textCol,fontWeight:700,marginTop:4}}>
                              {pagado?"$"+(pago/1000).toFixed(0)+"k":pendiente?"Pendiente":esPorVencer?"Por vencer":"No pagado"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
      <div style={{height:32}}/>
    </div>
  );
}
