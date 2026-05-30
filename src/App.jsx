import { useState, useMemo } from "react";

const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic","Ene'27"];
const MES_VOL_HASTA = 1;
const MES_OBL_DESDE = 2;
const MES_ACTIVO = 5;

const raw = [
  {p:"6",  n:"MARCO CERDA",                              rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"7",  n:"ADELITA DEL CARMEN RAMIREZ FAUDEZ",        rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"10", n:"GUISELA DEL CARMEN REYES BELTRAN",         rifa:0,     pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000,0]},
  {p:"13", n:"CAROLINA ANDREA TRUJILLO PINO",            rifa:0,     pagos:[0,0,3000,3000,3000,3000,3000,0,0,0,0,0,0]},
  {p:"14", n:"ESTEBAN DAVID MIERES BOBADILLA",           rifa:10000, pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000,0]},
  {p:"15", n:"OSCAR ANTONIO GONZALEZ RETAMAL",           rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"16", n:"LUIS ALBERTO ZUÑIGA DINAMARCA",            rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"17", n:"CLAUDIA ALEJANDRA ROJAS ORDENES",          rifa:10000, pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"18", n:"CRISTIAN ANDRES ENCINA VARGAS",            rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"19", n:"CESAR HUGO AEDO VISCARRA",                 rifa:10000, pagos:[0,10000,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"20A",n:"PATRICIO HERMINIO CARTES LARA",            rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"20B",n:"MARIA JESUS MENESES VALDES",               rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"21A",n:"JULIO ELADIO MATURANA GODOY",              rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"21B",n:"MARIA LORETO VILLAGRAN GONZALEZ",          rifa:0,     pagos:[0,0,3000,3000,3000,0,0,0,0,0,0,0,0]},
  {p:"22", n:"HECTOR ANDRES ORELLANA ROJAS",             rifa:10000, pagos:[0,0,15000,0,0,0,0,0,0,0,0,0,0]},
  {p:"23", n:"ANA MARIA DURAN LEYTON",                   rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"24", n:"LUIS ALBERTO ZUÑIGA DINAMARCA",            rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"25", n:"SOLEDAD DE LAS NIEVES SALAZAR SALAZAR",    rifa:20000, pagos:[0,15000,15000,15000,15000,20000,0,0,0,0,0,0,0]},
  {p:"26", n:"ROBERTO ALEJANDRO VASQUEZ VERDUGO",        rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"27", n:"JUAN ALBERTO DIAZ ALCAPIO",                rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"28", n:"GINETTE MIGUELINA GUIÑEZ JAQUE",           rifa:10000, pagos:[0,0,3000,3000,0,0,0,0,0,0,0,0,0]},
  {p:"29", n:"ROSA YOLANDA DEL CARMEN PEREZ MONDACA",    rifa:10000, pagos:[0,0,0,5000,0,0,0,0,0,0,0,0,0]},
  {p:"30", n:"LORENA VIRGINIA LOZA DE SAN MARTIN",       rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"31", n:"EMILSE PATRICIA JARAMILLO HENAO",          rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"32", n:"MARCELA DE LAS MERCEDES MUÑOZ RAMIREZ",    rifa:10000, pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"33", n:"CARLOS",                                   rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"34", n:"CRISTOPHER ANTONIO ARCO RAIN",             rifa:10000, pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,0,0,0,0]},
  {p:"35", n:"VALESKA FERNANDA ROMERO FERREIRA",         rifa:0,     pagos:[0,0,3000,3000,3000,3000,3000,0,0,0,0,0,0]},
  {p:"36", n:"CRISTIAN MARCELO SALGADO ROJAS",           rifa:10000, pagos:[0,0,3000,3000,4000,0,0,0,0,0,0,0,0]},
  {p:"37", n:"ROSA YOLANDA DEL CARMEN PEREZ MONDACA",    rifa:10000, pagos:[0,0,0,5000,0,0,0,0,0,0,0,0,0]},
  {p:"38", n:"RAMON ENRIQUE SAEZ PULIDO",                rifa:10000, pagos:[0,0,3000,3000,3000,3000,0,0,0,0,0,0,0]},
  {p:"39", n:"PEDRO EMERENCIANO VERGARA ORELLANA",       rifa:0,     pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000,0]},
  {p:"40", n:"DIEGO ANDRES VALCARCE RIVERA",             rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"41", n:"PAOLA GUZMAN PIÑA",                        rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"42", n:"VANESSA HERMINIA INOSTROSA LARA",          rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"43", n:"MARIA EUGENIA DELGADO TORRES",             rifa:0,     pagos:[0,5000,5000,5000,5000,0,0,0,0,0,0,0,0]},
  {p:"44", n:"MARTA IVON VEJAR MELO",                    rifa:0,     pagos:[0,0,3000,3000,3000,0,0,0,0,0,0,0,0]},
  {p:"45", n:"PEDRO RENE COFRE INOSTROZA",               rifa:0,     pagos:[0,0,3000,0,0,0,0,0,0,0,0,0,0]},
  {p:"46", n:"DAVID ALEJANDRO JOFRE JOFRE",              rifa:20000, pagos:[0,20000,15000,15000,15000,0,0,0,0,0,0,0,0]},
  {p:"47", n:"ANDREINA CHIQUINQUIRA POZO NAVA",          rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"48", n:"JORGE ARMANDO VERGARA ALARCON",            rifa:0,     pagos:[0,0,10000,0,0,0,0,0,0,0,0,0,0]},
  {p:"49", n:"DANIA MARIA CANALES INZULZA",              rifa:10000, pagos:[0,0,10000,10000,10000,10000,10000,0,0,0,0,0,0]},
  {p:"50", n:"PEDRO RENE COFRE INOSTROZA",               rifa:0,     pagos:[0,0,3000,0,0,0,0,0,0,0,0,0,0]},
  {p:"51", n:"ANA MARIA ORTEGA BRIONES",                 rifa:0,     pagos:[0,0,3000,3000,4000,0,0,0,0,0,0,0,0]},
  {p:"52", n:"CARLOS AURELIO FUENZALIDA ALFARO",         rifa:0,     pagos:[0,0,3000,3000,3000,3000,3000,0,0,0,0,0,0]},
  {p:"53", n:"PABLO ANDRES VALENZUELA ESPINOZA",         rifa:10000, pagos:[0,0,5000,3000,3000,3000,0,0,0,0,0,0,0]},
  {p:"54", n:"CHRISTOPHER ALEXIS PARRA ROJAS",           rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"55", n:"ELISABETH CIFUENTES LUNA",                 rifa:10000, pagos:[0,0,3000,3000,3000,0,0,0,0,0,0,0,0]},
  {p:"56", n:"FRANCISCO JAVIER TORRECILLA CEREY",        rifa:10000, pagos:[10000,0,3000,3000,3000,3000,0,0,0,0,0,0,0]},
  {p:"57", n:"JESENIA DEL CARMEN BASOALTO BASOALTO",     rifa:10000, pagos:[0,0,4000,2000,3000,0,0,0,0,0,0,0,0]},
  {p:"58", n:"JOSE BENITO HERRERA CASTRO",               rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"59A",n:"MAURICIO GUILLERMO SEPULVEDA HORMAZABAL",  rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"59B",n:"MARIO GUILLERMO SEPULVEDA FIGUEROA",       rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"60A",n:"MARIA SOLEDAD BOBADILLA BOBADILLA",        rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"60B",n:"FLORENTINO RAUL LEAL FERNANDEZ",           rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"61", n:"IVAN ANDRES MERINO HERNANDEZ",             rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"62", n:"ESTEBAN ROA",                              rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"63", n:"JENNY DEL PILAR ARZOLA AGUAYO",            rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"64", n:"NATIVIDAD DEL CARMEN ZAMBRANO CARRASCO",   rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"65", n:"MARCOS EUGENIO SEGUEL CHAVEZ",             rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"66", n:"JOSSELIN FABIOLA JORQUERA PARRA",          rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"67A",n:"ANGEL VELASCO GONZALEZ",                   rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"67B",n:"ALVARO DANILO VERGARA ALARCON",            rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"68", n:"LUIS GUILLERMO GUTIERREZ MORALES",         rifa:10000, pagos:[20000,5000,5000,5000,5000,5000,5000,0,0,0,0,0,0]},
  {p:"69", n:"NICOLAS ANTONIO ROJAS VENEGAS",            rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"70", n:"ANDREA DEL CARMEN MUÑOZ ROZAS",            rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"71", n:"ELISABETH CIFUENTES LUNA",                 rifa:0,     pagos:[0,0,3000,3000,3000,0,0,0,0,0,0,0,0]},
  {p:"72", n:"JULIA DE LAS MERCEDES BASTIAS GAETE",      rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"73", n:"JULIA DE LAS MERCEDES BASTIAS GAETE",      rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"74", n:"MARIA CUPERTINA ARRIAGADA VALDES",         rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"75", n:"ELIDE CECILIA CABELLO CUBILLO",            rifa:10000, pagos:[0,0,3000,3000,3000,0,0,0,0,0,0,0,0]},
  {p:"76A",n:"PABLO JOSE ABURTO GUTIERREZ",              rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"76B",n:"MANUEL ENRIQUE GONZALEZ MOROSO",           rifa:0,     pagos:[0,0,3000,3000,4000,0,0,0,0,0,0,0,0]},
  {p:"77A",n:"OLGA RAQUEL VARGAS PEREZ",                 rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"77B",n:"DIEGO HERNAN MUÑOZ MUÑOZ",                 rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"78A",n:"DANIELA CONSTANZA GUZMAN FLORES",          rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"78B",n:"XIMENA DEL CARMEN OCALLO LLANOS",          rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"79A",n:"LUIS ANTONIO VARELA VALDEBENITO",          rifa:0,     pagos:[20000,0,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000,0]},
  {p:"79B",n:"SOFIA RAQUEL CONDOR GUERE",                rifa:10000, pagos:[0,10000,10000,5000,5000,5000,5000,5000,5000,0,0,0,0]},
  {p:"80", n:"ALEJANDRA ESTER ESPINOSA VEGA",            rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"81", n:"VERONICA ANGELICA ROJAS COFRE",            rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"82", n:"ESTEBAN DAVID MIERES BOBADILLA",           rifa:10000, pagos:[0,0,3000,3000,0,0,0,0,0,0,0,0,0]},
  {p:"83", n:"MARITZA ELIZABETH CEBALLOS SILVA",         rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"84", n:"YONATAN ALEXANDER AGUILAR VALENZUELA",     rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"85", n:"CRISTIAN RODRIGO VARGAS ASENCIO",          rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"86", n:"MANUEL IGNACIO MUÑOZ MUÑOZ",               rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"87", n:"CARLA ANDREA CEPEDA PINTO",                rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"88", n:"DANIEL ERNESTO ZUÑIGA MORA",               rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"89", n:"HECTOR MAURICIO HORMAZABAL CAMPOS",        rifa:10000, pagos:[0,0,10000,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000]},
  {p:"90A",n:"ANDREA DE LAS MERCEDES LOPEZ VERDUGO",     rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"90B",n:"ERNESTO ALFONSO VASQUEZ IZETA",            rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"91", n:"ERNESTO ALFONSO VASQUEZ IZETA",            rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"92", n:"MYRIAM SOLEDAD GUTIERREZ CAMPO",           rifa:0,     pagos:[0,0,5000,0,0,0,0,0,0,0,0,0,0]},
  {p:"93", n:"PEDRO RENE COFRE INOSTROZA",               rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"94", n:"SERGIO ANTONIO OBANDO OBANDO",             rifa:0,     pagos:[0,0,10000,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000]},
  {p:"95", n:"PEDRO MORALES",                            rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"96", n:"RONNY ANDRES GONZALEZ ARIAS",              rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"97", n:"CARLOS HERNAN CAMPOS ARRIAGADA",           rifa:10000, pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"98", n:"CLAUDIO TORRECILLA",                       rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"99", n:"REINALDO PATRICIO CASTILLO BURGOS",        rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"100",n:"YENIFER DEL ROSARIO CANALES DIAZ",         rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"101",n:"MARCOS EUGENIO SEGUEL CHAVEZ",             rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"102",n:"LILIA SARAI CASANOVA VILLALOBOS",          rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"103",n:"LILIA SARAI CASANOVA VILLALOBOS",          rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"104",n:"FELIX ANTONIO RAMIREZ DIAZ",               rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"105",n:"OMAR ANTONIO CARRASCO FUENTES",            rifa:0,     pagos:[0,0,10000,10000,10000,0,0,0,0,0,0,0,0]},
  {p:"106",n:"OMAR ANTONIO CARRASCO FUENTES",            rifa:0,     pagos:[0,0,10000,10000,10000,0,0,0,0,0,0,0,0]},
  {p:"107",n:"SANDRA PAOLA REYES MARTINEZ",              rifa:10000, pagos:[0,0,3000,3000,3000,3000,0,0,0,0,0,0,0]},
  {p:"108",n:"WILLIAM ALEGRE MARIN",                     rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"110",n:"JOCSAN GLORIA RAMIREZ GOMEZ",              rifa:10000, pagos:[0,0,3000,3000,3000,3000,3000,0,0,0,0,0,0]},
  {p:"111",n:"BERNARDITA YOLANDA NORAMBUENA AVILA",      rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"113",n:"PATRICIO IVAN SALINAS OYARZUN",            rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"115",n:"JOHANA YAMILE ENRIQUETA GARRIDO STAPPUNG", rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"116",n:"CARLOS FABRICIANO PARADA BRITO",           rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"117",n:"JOHANA YAMILE ENRIQUETA GARRIDO STAPPUNG", rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"118",n:"FERNANDO ALEJANDRO GUAJARDO ARAYA",        rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"121",n:"BLANCA ISABEL DIAZ POBLETE",               rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"122",n:"ESTEBAN FABIAN MORENO VALENZUELA",         rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"123",n:"MAURICIO EUGENIO NUÑEZ MORENO",            rifa:0,     pagos:[0,0,3000,3000,3000,3000,0,0,0,0,0,0,0]},
  {p:"125",n:"VICTOR MANUEL BARRIOS CABEZAS",            rifa:0,     pagos:[0,0,3000,3000,3000,3000,3000,0,0,0,0,0,0]},
  {p:"126",n:"MANUEL ANTONIO BECERRA PACHECO",           rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"128",n:"VERONICA DEL CARMEN GONZALEZ FUENTES",     rifa:20000, pagos:[0,5000,15000,5000,0,0,0,0,0,0,0,0,0]},
  {p:"129",n:"JOSE LUIS CAMPAL ANGULO",                  rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"130",n:"LUIS ALBERTO VASQUEZ ALVAREZ",             rifa:10000, pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"131",n:"DANIEL ISRAEL RAMIREZ GOMEZ",              rifa:10000, pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"135",n:"CRISTIAN VICENTE MOYA ALMONACID",          rifa:0,     pagos:[0,0,3000,0,0,0,0,0,0,0,0,0,0]},
  {p:"136",n:"SEBASTIAN LISANDRO MOYA ALMONACID",        rifa:0,     pagos:[0,0,3000,0,0,0,0,0,0,0,0,0,0]},
  {p:"137",n:"SEBASTIAN LISANDRO MOYA ALMONACID",        rifa:0,     pagos:[0,0,3000,0,0,0,0,0,0,0,0,0,0]},
  {p:"138",n:"CRISTIAN VICENTE MOYA ALMONACID",          rifa:0,     pagos:[0,0,3000,0,0,0,0,0,0,0,0,0,0]},
  {p:"139",n:"FRANCISCO JAVIER VILLAGRA SILVA",          rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"140",n:"RUBEN ALEJANDRO CARCAMO RIQUELME",         rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"141",n:"RODRIGO ALONSO SALCEDO FERNANDEZ",         rifa:0,     pagos:[0,0,3000,3000,4000,0,0,0,0,0,0,0,0]},
  {p:"142",n:"CARMEN DORIS CACERES NUÑEZ",               rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"143",n:"SOLANGE ANAMOUR BARRA NUÑEZ",              rifa:0,     pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,0,0,0,0]},
  {p:"144",n:"ALEXIS FELIPE ROJAS OBANDO",               rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"146",n:"CAMILA IGNACIA BELMAR IMAS",               rifa:0,     pagos:[0,0,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000,0]},
  {p:"147",n:"GENESIS PAMELA BELMAR IMAS",               rifa:10000, pagos:[0,0,0,15000,0,0,0,0,0,0,0,0,0]},
  {p:"149",n:"NANCY DE LAS MERCEDES IBARRA VARELA",      rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"150",n:"EDISON DARIO MARTINI VALDEBENITO",         rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"160",n:"JOSE RENE ZENTENO MORALES",                rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"161",n:"JOSE RENE ZENTENO MORALES",                rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"170",n:"CONSTANZA ANDREA KERRIGAN PUIG",           rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"171",n:"CARLA JULIETA AGUILAR CARO",               rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"172",n:"KATHERINE GREETA LEIVA ITURRA",            rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"176",n:"MARCELA MARLENE CASTRO LEDESMA",           rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"177",n:"JACQUELINE DE LAS ROSAS SALGADO VALDES",   rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"178",n:"ALFREDO ERNESTO POBLETE TAPIA",            rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"180",n:"LUZ ELENA CANALES ARGEL",                  rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"184",n:"CAMILA NOEMI REYES GONZALEZ",              rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"185",n:"CARLOS ALBERTO ROJAS CESPED",              rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"186",n:"PATRICIO JESUS CALDERON RODRIGUEZ",        rifa:10000, pagos:[0,20000,20000,20000,0,0,0,0,0,0,0,0,0]},
  {p:"187",n:"ANGELO RUDI SAEZ PIZARRO",                 rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"188",n:"PAULINA SYLVIA ROBLEDO ARRUE",             rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"189",n:"LUZ ELENA CANALES ARGEL",                  rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"190",n:"CLAUDIO ARIEL VALENCIA DIAZ",              rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"191",n:"ALFREDO ERNESTO POBLETE TAPIA",            rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"193",n:"MANUEL EDUARDO FARIAS ARELLANO",           rifa:10000, pagos:[0,0,0,10000,0,0,0,0,0,0,0,0,0]},
  {p:"194",n:"MONICA XIMENA VELIZ RUIZ",                 rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"195",n:"MARCO ANTONIO RIVEROS CARREÑO",            rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"196",n:"ROSA DEL CARMEN ROJAS BELTRAN",            rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"197",n:"PEDRO ANTONIO MUÑOZ DIAZ",                 rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"198",n:"CARLOS ENRIQUE VEJAR CALABRANO",           rifa:10000, pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {p:"199",n:"MANUEL ALEJANDRO VEJAR REYES",             rifa:0,     pagos:[0,0,0,0,0,0,0,0,0,0,0,0,0]},
];

function getEstado(pagos){
  return pagos.slice(MES_OBL_DESDE, MES_ACTIVO).every(v=>v>0) ? "Al Día" : "Pendiente";
}

export default function App(){
  const [vista, setVista] = useState("dashboard");
  const [parcela, setParcela] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  const stats = useMemo(()=>({
    total: raw.length,
    alDia: raw.filter(r=>getEstado(r.pagos)==="Al Día").length,
    pendiente: raw.filter(r=>getEstado(r.pagos)==="Pendiente").length,
  }),[]);

  function buscar(){
    setError(""); setResultado(null);
    const q=parcela.trim().toUpperCase();
    if(!q){setError("Ingresa un número de parcela.");return;}
    const f=raw.find(r=>r.p.toUpperCase()===q);
    if(!f){setError("Parcela no encontrada.");return;}
    setResultado(f);
  }

  const C={bg:"#0f172a",card:"#1e293b",card2:"#162032",
    blue:"#3b82f6",green:"#10b981",red:"#ef4444",
    text:"#f1f5f9",muted:"#94a3b8",border:"#334155"};

  const card={background:C.card,borderRadius:14,padding:"16px",border:`1px solid ${C.border}`};

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif",maxWidth:480,margin:"0 auto"}}>

      {/* Header */}
      <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,padding:"12px 16px",position:"sticky",top:0,zIndex:10}}>
        <div style={{fontWeight:800,fontSize:16,letterSpacing:.3}}>🏘️ COMUNIDAD LAS NIPAS</div>
        <div style={{fontSize:11,color:C.muted,marginTop:2}}>Control de Aportes 2026–2027</div>
        <div style={{display:"flex",gap:8,marginTop:12}}>
          {[["dashboard","📊 Dashboard"],["residente","🏠 Mi Parcela"]].map(([v,l])=>(
            <button key={v} onClick={()=>setVista(v)} style={{
              flex:1,padding:"10px 0",borderRadius:10,border:"none",cursor:"pointer",
              fontWeight:700,fontSize:13,transition:"all .2s",
              background:vista===v?(v==="residente"?C.green:C.blue):"#1e293b",
              color:vista===v?"#fff":C.muted,
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{padding:"16px"}}>

        {/* DASHBOARD */}
        {vista==="dashboard"&&(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
            <div style={{fontSize:13,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:.5,alignSelf:"flex-start"}}>Resumen General</div>
            <div style={{...card,width:"100%",textAlign:"center",padding:"28px 16px"}}>
              <div style={{fontSize:13,color:C.muted,fontWeight:600,marginBottom:6}}>TOTAL PARCELAS</div>
              <div style={{fontSize:64,fontWeight:800,color:C.blue,lineHeight:1}}>{stats.total}</div>
              <div style={{fontSize:12,color:C.muted,marginTop:6}}>registradas en el período</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,width:"100%"}}>
              <div style={{...card,textAlign:"center",padding:"20px 12px",borderColor:"#064e3b"}}>
                <div style={{fontSize:32}}>✅</div>
                <div style={{fontSize:40,fontWeight:800,color:C.green,lineHeight:1.1,margin:"6px 0 4px"}}>{stats.alDia}</div>
                <div style={{fontSize:12,color:C.muted,fontWeight:600}}>Al Día</div>
              </div>
              <div style={{...card,textAlign:"center",padding:"20px 12px",borderColor:"#7f1d1d"}}>
                <div style={{fontSize:32}}>⚠️</div>
                <div style={{fontSize:40,fontWeight:800,color:C.red,lineHeight:1.1,margin:"6px 0 4px"}}>{stats.pendiente}</div>
                <div style={{fontSize:12,color:C.muted,fontWeight:600}}>Con Pendientes</div>
              </div>
            </div>
            <div style={{fontSize:11,color:C.muted,textAlign:"center",marginTop:4}}>
              Estado basado en meses obligatorios vencidos (Mar–May 2026)
            </div>
          </div>
        )}

        {/* RESIDENTE */}
        {vista==="residente"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{fontSize:13,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>Consulta tu Parcela</div>
            <div style={card}>
              <div style={{fontSize:13,color:C.muted,marginBottom:10}}>Ingresa el número de tu parcela</div>
              <div style={{display:"flex",gap:8}}>
                <input
                  placeholder="Ej: 10, 46, 79B..."
                  value={parcela}
                  onChange={e=>{setParcela(e.target.value);setError("");setResultado(null);}}
                  onKeyDown={e=>e.key==="Enter"&&buscar()}
                  style={{flex:1,padding:"12px 14px",borderRadius:10,border:`1px solid ${C.border}`,
                    background:"#0f172a",color:C.text,fontSize:16,outline:"none",WebkitAppearance:"none"}}
                />
                <button onClick={buscar} style={{
                  padding:"12px 18px",background:C.green,color:"#fff",border:"none",
                  borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:15,
                  WebkitTapHighlightColor:"transparent"
                }}>Ir</button>
              </div>
              {error&&<div style={{marginTop:10,color:"#fca5a5",fontSize:13}}>⚠️ {error}</div>}
            </div>

            {resultado&&(()=>{
              const r=resultado;
              const alDia=getEstado(r.pagos)==="Al Día";
              const totalPagado=r.pagos.reduce((s,v)=>s+v,0);
              return(
                <>
                  <div style={{...card,borderColor:alDia?C.green:C.red}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontSize:11,color:C.muted,marginBottom:2,fontWeight:600}}>PARCELA</div>
                        <div style={{fontSize:42,fontWeight:800,color:C.blue,lineHeight:1}}>{r.p}</div>
                        <div style={{fontSize:12,color:"#f59e0b",fontWeight:600,marginTop:6}}>
                          💵 Total pagado: ${totalPagado.toLocaleString("es-CL")}
                        </div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end"}}>
                        <div style={{padding:"8px 16px",borderRadius:10,fontWeight:700,fontSize:14,
                          background:alDia?"#064e3b":"#7f1d1d",color:alDia?C.green:"#fca5a5"}}>
                          {alDia?"✅ Al Día":"⚠️ Pendiente"}
                        </div>
                        {r.rifa>0&&(
                          <div style={{fontSize:12,color:"#ec4899",background:"#2d1a2e",
                            padding:"6px 12px",borderRadius:8,border:"1px solid #9d174d",fontWeight:600}}>
                            🎟️ Rifa: ${r.rifa.toLocaleString("es-CL")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={card}>
                    <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>Estado de Pagos</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                      {MESES.map((mes,i)=>{
                        const pago=r.pagos[i];
                        const esVol=i<=MES_VOL_HASTA;
                        const esOblVenc=i>=MES_OBL_DESDE&&i<MES_ACTIVO;
                        const esPorVencer=i>=MES_ACTIVO;
                        const pagado=pago>0;
                        const pendiente=esOblVenc&&!pagado;

                        let bg=C.card2,border=C.border,textCol=C.muted;
                        if(pagado){bg="#064e3b";border=C.green;textCol=C.green;}
                        else if(pendiente){bg="#7f1d1d";border=C.red;textCol="#fca5a5";}
                        else if(esPorVencer){bg="#111827";border="#1f2937";textCol="#374151";}

                        return(
                          <div key={i} style={{borderRadius:12,padding:"10px 6px",textAlign:"center",
                            background:bg,border:`1px solid ${border}`}}>
                            <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:2}}>{mes}</div>
                            {esVol&&<div style={{fontSize:8,color:"#f59e0b",fontWeight:700,marginBottom:3}}>VOLUNTARIO</div>}
                            {esPorVencer&&<div style={{fontSize:8,color:"#1f2937",fontWeight:700,marginBottom:3}}>OBLIGATORIO</div>}
                            {!esVol&&!esPorVencer&&<div style={{fontSize:8,color:"transparent",marginBottom:3}}>‎</div>}
                            <div style={{fontSize:18,margin:"2px 0"}}>
                              {pagado?"✅":pendiente?"❌":esPorVencer?"🕐":"—"}
                            </div>
                            <div style={{fontSize:10,color:textCol,fontWeight:600,marginTop:2}}>
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
      <div style={{height:24}}/>
    </div>
  );
}
export default App;
