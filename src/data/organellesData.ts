import { OrganelleInfo } from '../types/cell';

export const ORGANELLES: OrganelleInfo[] = [
  {
    id: 'pared-celular',
    name: 'Pared Celular',
    scientificName: 'Murus cellularis (Celulosa, hemicelulosa y pectina)',
    imageLabel: '"Pared celular"',
    category: 'membrana',
    position: [-3.8, -0.2, 0.5],
    cameraFocus: [-3.0, 0, 0],
    cameraPosition: [-6.5, 2.5, 3.5],
    badgeIcon: 'Shield',
    summary: 'Capa rígida externa formada principalmente por celulosa que protege y da forma a la célula vegetal.',
    detailedDescription: 'La pared celular vegetal es una estructura resistente que envuelve a la membrana plasmática. Soporta la alta presión osmótica interna (turgencia) evitando que la célula explote cuando absorbe agua. Además, posee microcanales llamados plasmodesmos que permiten el paso de sustancias entre células vecinas.',
    analogy: 'La armadura exterior o el muro de ladrillos reforzados de un castillo que lo mantiene firme y protegido.',
    curiousFact: '¡La madera de los árboles y el papel de tus cuadernos están hechos casi en su totalidad de paredes celulares vegetales!',
    isExclusiveToPlants: true,
    keyFunctions: [
      'Proporcionar soporte mecánico y rigidez a tallos y hojas.',
      'Evitar la lisis celular por entrada excesiva de agua.',
      'Actuar como primera barrera de defensa contra patógenos.',
      'Permitir la comunicación celular mediante plasmodesmos.'
    ],
    miniGameType: 'sorter',
    questions: [
      {
        id: 'q-pared-1',
        question: '¿Cuál es el componente químico principal que otorga rigidez a la pared celular de las plantas?',
        options: ['Quitina', 'Celulosa', 'Glucógeno', 'Colágeno'],
        correctIndex: 1,
        explanation: '¡Correcto! La celulosa es un polisacárido estructural formado por cadenas de glucosa que da la resistencia a la madera y las plantas.',
        hint: 'Es la misma fibra de la que se fabrica el papel.'
      },
      {
        id: 'q-pared-2',
        question: '¿Qué pasaría con una célula vegetal sin pared celular si se coloca en agua pura?',
        options: [
          'Se encogería inmediatamente.',
          'Absorbería agua hasta hincharse y reventar (lisis).',
          'Comenzaría a realizar fotosíntesis más rápido.',
          'Se convertiría en una bacteria.'
        ],
        correctIndex: 1,
        explanation: 'Exacto. La pared celular ejerce contrapresión mecánica, permitiendo que la planta permanezca erguida sin reventar por el agua.',
        hint: 'Sin un contenedor rígido, un globo con exceso de agua termina estallando.'
      }
    ]
  },
  {
    id: 'membrana-plasmatica',
    name: 'Membrana Plasmática',
    scientificName: 'Bicapa lipídica semipermeable',
    imageLabel: '"Membrana plasmática"',
    category: 'membrana',
    position: [-2.6, 0.4, 1.2],
    cameraFocus: [-2.2, 0.2, 0.8],
    cameraPosition: [-4.8, 1.8, 2.8],
    badgeIcon: 'Layers',
    summary: 'Bicapa de fosfolípidos que delimita el citoplasma y controla de forma selectiva la entrada y salida de sustancias.',
    detailedDescription: 'Justo por debajo de la pared celular se encuentra la membrana plasmática. Es sumamente dinámica y flexible (modelo del mosaico fluido), compuesta por fosfolípidos, proteínas transportadoras y carbohidratos. Decide qué nutrientes, iones y señales químicas pueden ingresar o abandonar la célula.',
    analogy: 'La aduana o el control de seguridad de un aeropuerto: revisa quién puede entrar y quién puede salir.',
    curiousFact: 'Tiene un grosor de apenas 7 a 10 nanómetros: ¡se necesitarían 10,000 membranas apiladas para igualar el grosor de una sola hoja de papel!',
    isExclusiveToPlants: false,
    keyFunctions: [
      'Permeabilidad selectiva y transporte activo/pasivo.',
      'Recepción de señales hormonales del exterior.',
      'Mantener el potencial eléctrico de la membrana.',
      'Coordinar el anclaje del citoesqueleto interno.'
    ],
    questions: [
      {
        id: 'q-mem-1',
        question: '¿Cómo se le denomina al modelo actual que describe la estructura dinámica de la membrana celular?',
        options: ['Modelo del Mosaico Fluido', 'Modelo de la Esfera Sólida', 'Modelo del Castillo Rígido', 'Modelo de Pared Porosa'],
        correctIndex: 0,
        explanation: '¡Excelente! Propuesto por Singer y Nicolson en 1972, explica que lípidos y proteínas se desplazan lateralmente con fluidez.',
        hint: 'Sugiere que las proteínas flotan como barcos en un mar de lípidos.'
      }
    ]
  },
  {
    id: 'vacuola-central',
    name: 'Vacuola Central',
    scientificName: 'Tonoplasto y jugo vacuolar',
    imageLabel: '"Vacuolo central" / "Pacuolo central"',
    category: 'almacenamiento',
    position: [0.1, -0.1, 0.2],
    cameraFocus: [0, 0, 0],
    cameraPosition: [1.8, 3.2, 4.5],
    badgeIcon: 'Droplet',
    summary: 'Enorme vesícula llena de agua y solutos que puede ocupar hasta el 90% del volumen celular vegetal.',
    detailedDescription: 'La vacuola central es uno de los sellos distintivos de la célula vegetal. Rodeada por una membrana especializada llamada tonoplasto, almacena agua, iones, pigmentos (como las antocianinas que dan color a flores y frutos) e incluso toxinas de defensa. Su llenado genera la presión de turgencia que mantiene erguidas las flores y hojas verdes.',
    analogy: 'Un gigantesco tanque de agua a presión y reserva de víveres que a la vez infla la célula como un globo.',
    curiousFact: 'Cuando riegas una planta marchita y se pone erguida en pocas horas, es porque sus vacuolas centrales se han vuelto a llenar de agua.',
    isExclusiveToPlants: true,
    keyFunctions: [
      'Mantener la turgencia y la forma física de la planta.',
      'Almacenar nutrientes, pigmentos y metabolitos secundarios.',
      'Degradar macromoléculas de desecho mediante enzimas líticas.',
      'Regular el pH y la osmorregulación celular.'
    ],
    miniGameType: 'turgor',
    questions: [
      {
        id: 'q-vac-1',
        question: '¿Cómo se llama la presión que ejerce la vacuola llena de agua contra la pared celular, manteniendo la planta erguida?',
        options: ['Presión atmosférica', 'Presión de turgencia', 'Tensión superficial', 'Presión osmótica nula'],
        correctIndex: 1,
        explanation: '¡Muy bien! La turgencia mantiene firmes las hojas no leñosas. Si falta agua, la planta se marchita por pérdida de turgencia.',
        hint: 'Empieza por la letra T y hace que el tejido vegetal esté terso.'
      },
      {
        id: 'q-vac-2',
        question: '¿Cómo se llama la membrana especializada que envuelve a la gran vacuola central?',
        options: ['Tonoplasto', 'Mielina', 'Capsómero', 'Cutícula'],
        correctIndex: 0,
        explanation: '¡Exacto! El tonoplasto regula activamente qué solutos entran y salen de la vacuola.',
        hint: 'Termina en -plasto, igual que cloroplasto.'
      }
    ]
  },
  {
    id: 'cloroplastos',
    name: 'Cloroplastos',
    scientificName: 'Chloroplastus (Plastidios fotosintéticos)',
    imageLabel: '"Cloroplastos"',
    category: 'energetico',
    position: [1.9, 1.1, -1.1],
    cameraFocus: [1.8, 0.9, -1.0],
    cameraPosition: [3.2, 2.2, 0.6],
    badgeIcon: 'Sun',
    summary: 'Orgánulos verdes encargados de la fotosíntesis: convierten la luz solar, agua y CO2 en azúcares y oxígeno.',
    detailedDescription: 'Los cloroplastos contienen el pigmento verde clorofila y poseen su propio ADN circular y ribosomas (teoría endosimbiótica). En su interior albergan sacos membranosos llamados tilacoides apilados en columnas llamadas granas, rodeados por un fluido denominado estroma.',
    analogy: 'Una ultramoderna planta de paneles solares combinada con una cocina que prepara carbohidratos usando luz.',
    curiousFact: '¡Casi todo el oxígeno que respiras en la atmósfera terrestre y la comida de la biosfera se originaron dentro de cloroplastos!',
    isExclusiveToPlants: true,
    keyFunctions: [
      'Fotosíntesis: fase luminosa en los tilacoides (ATP, NADPH y O2).',
      'Ciclo de Calvin en el estroma para fijar CO2 y formar glucosa.',
      'Síntesis de ácidos grasos y aminoácidos para la célula.',
      'Almacenamiento temporal de almidón.'
    ],
    miniGameType: 'photosynthesis',
    questions: [
      {
        id: 'q-cloro-1',
        question: '¿Qué pigmento captura los fotones de luz solar dentro de los tilacoides del cloroplasto?',
        options: ['Caroteno', 'Hemoglobina', 'Clorofila', 'Melanina'],
        correctIndex: 2,
        explanation: '¡Correcto! La clorofila absorbe principalmente longitudes de onda azul y roja, reflejando el color verde característico.',
        hint: 'Es el responsable de que las hojas sean verdes.'
      },
      {
        id: 'q-cloro-2',
        question: '¿Cuáles son los productos principales que la fotosíntesis genera para alimentar a la planta y nutrir la vida?',
        options: [
          'Glucosa (azúcar) y Oxígeno (O2)',
          'Dióxido de carbono y Ácido sulfúrico',
          'Metano y Nitrógeno',
          'Petróleo y Sal'
        ],
        correctIndex: 0,
        explanation: '¡Excelente! A partir de CO2 y H2O usando energía solar, el cloroplasto sintetiza glucosa y libera O2 como subproducto vital.',
        hint: 'Uno es el combustible dulce y el otro el gas que respiramos.'
      }
    ]
  },
  {
    id: 'nucleo',
    name: 'Núcleo Celular',
    scientificName: 'Nucleus cellularis & Envoltura nuclear',
    imageLabel: '"Núcleo"',
    category: 'genetico',
    position: [-1.4, -0.6, -1.2],
    cameraFocus: [-1.3, -0.5, -1.0],
    cameraPosition: [-3.0, 1.1, 0.4],
    badgeIcon: 'Dna',
    summary: 'El centro de control de la célula que resguarda el material genético (ADN) en forma de cromatina.',
    detailedDescription: 'Rodeado por una doble membrana con poros nucleares (envoltura nuclear), el núcleo alberga el manual de instrucciones biológico de la planta. Dirige la síntesis de proteínas enviando instrucciones de ARN mensajero al citoplasma y coordina el ciclo y crecimiento celular.',
    analogy: 'El cerebro o la torre de control de la célula vegetal donde reposan los planos secretos maestros.',
    curiousFact: 'Si estiráramos todo el ADN empaquetado en el núcleo microscópico de una sola célula vegetal, ¡mediría casi 2 metros de longitud!',
    isExclusiveToPlants: false,
    keyFunctions: [
      'Almacenamiento y protección del genoma (ADN).',
      'Transcripción de ADN a ARN mensajero (ARNm).',
      'Control de la replicación previa a la división celular.',
      'Regulación de la expresión de genes vegetales.'
    ],
    questions: [
      {
        id: 'q-nuc-1',
        question: '¿Qué molécula almacena la información hereditaria dentro del núcleo celular?',
        options: ['ATP', 'ADN (Ácido desoxirribonucleico)', 'Glucosa', 'Lípidos'],
        correctIndex: 1,
        explanation: '¡Perfecto! El ADN contiene las instrucciones codificadas en pares de bases nitrogenadas.',
        hint: 'Tiene forma de doble hélice.'
      }
    ]
  },
  {
    id: 'nucleolo',
    name: 'Nucléolo',
    scientificName: 'Nucleolus',
    imageLabel: '"Muclooxlo" / Nucléolo',
    category: 'genetico',
    position: [-1.2, -0.4, -1.4],
    cameraFocus: [-1.2, -0.4, -1.3],
    cameraPosition: [-2.4, 0.4, -0.4],
    badgeIcon: 'Sparkles',
    summary: 'Región densa dentro del núcleo especializada en fabricar ribosomas ensamblando ARN ribosomal con proteínas.',
    detailedDescription: 'Visible como una esfera densa dentro del núcleo, el nucléolo no está rodeado por membrana. Es una zona de altísima actividad transcripcional donde se transcriben los genes de ARNr y se acoplan las subunidades que luego saldrán por los poros nucleares para formar los ribosomas.',
    analogy: 'El taller interno donde se ensamblan las piezas de las máquinas antes de enviarlas a la fábrica principal.',
    curiousFact: 'Una sola célula vegetal de crecimiento rápido puede ensamblar hasta 10,000 subunidades ribosómicas por minuto en su nucléolo.',
    isExclusiveToPlants: false,
    keyFunctions: [
      'Transcripción y maduración del ARN ribosomal (ARNr).',
      'Ensamblaje de las subunidades ribosómicas mayor y menor.',
      'Control del estrés celular y senescencia.'
    ],
    questions: [
      {
        id: 'q-nuclolo-1',
        question: '¿Cuál es la función primordial del nucléolo?',
        options: [
          'Fabricar las subunidades de los ribosomas',
          'Sintetizar celulosa para la pared',
          'Realizar la fotosíntesis',
          'Destruir toxinas con peróxido de hidrógeno'
        ],
        correctIndex: 0,
        explanation: '¡Exactamente! El nucléolo es la biofábrica donde nace el ARN ribosomal y se estructuran los ribosomas.',
        hint: 'Produce los orgánulos encargados de leer el ARNm.'
      }
    ]
  },
  {
    id: 'reticulo-rugoso',
    name: 'Retículo Endoplasmático Rugoso (RER)',
    scientificName: 'Reticulum endoplasmicum granulosum',
    imageLabel: '"Reticulo endoplasmático rugoso"',
    category: 'sintesis',
    position: [-0.6, -0.8, -1.8],
    cameraFocus: [-0.6, -0.7, -1.5],
    cameraPosition: [-1.8, 0.4, -0.6],
    badgeIcon: 'Workflow',
    summary: 'Red de sacos membranosos aplanados tapizados de ribosomas donde se sintetizan y pliegan proteínas.',
    detailedDescription: 'El RER está conectado directamente con la envoltura nuclear. Su superficie exterior luce "rugosa" al microscopio debido a miles de ribosomas adheridos. Aquí las proteínas recién sintetizadas entran a su luz interior para plegarse en 3D, añadir azúcares (glicosilación) y empacarse en vesículas hacia el Aparato de Golgi.',
    analogy: 'La línea de montaje y ensamblaje de una fábrica automatizada donde las piezas se construyen y revisan.',
    curiousFact: 'Las proteínas que formarán la pared celular o que se secretan al exterior de la célula se sintetizan principalmente en el RER.',
    isExclusiveToPlants: false,
    keyFunctions: [
      'Síntesis y plegamiento tridimensional de proteínas.',
      'Glicosilación inicial (adición de carbohidratos a proteínas).',
      'Empaquetamiento en vesículas de transporte dirigidas al Golgi.',
      'Control de calidad de proteínas mal plegadas.'
    ],
    miniGameType: 'protein',
    questions: [
      {
        id: 'q-rer-1',
        question: '¿Por qué el Retículo Endoplasmático Rugoso tiene ese aspecto "rugoso"?',
        options: [
          'Porque está cubierto de ribosomas en su cara citosólica',
          'Porque tiene granos de arena absorbidos',
          'Por las sales minerales cristalizadas',
          'Porque su membrana está rota'
        ],
        correctIndex: 0,
        explanation: '¡Correcto! Los ribosomas se unen a receptores específicos en la membrana del retículo para inyectar proteínas nacientes.',
        hint: 'Son pequeños gránulos que fabrican proteínas.'
      }
    ]
  },
  {
    id: 'reticulo-liso',
    name: 'Retículo Endoplasmático Liso (REL)',
    scientificName: 'Reticulum endoplasmicum leve',
    imageLabel: 'liso ("Reticulo endoplasmático liso")',
    category: 'sintesis',
    position: [1.2, -0.7, -1.5],
    cameraFocus: [1.1, -0.6, -1.3],
    cameraPosition: [2.5, 0.6, -0.4],
    badgeIcon: 'Cog',
    summary: 'Red tubular interconectada sin ribosomas encargada de sintetizar lípidos, fosfolípidos y desintoxicar metabolitos.',
    detailedDescription: 'A diferencia del RER, el REL carece de ribosomas y tiene aspecto tubular. Es el centro químico para la síntesis de ácidos grasos, fosfolípidos para las membranas celulares y esteroles vegetales. Además, almacena calcio intracelular crucial para la señalización.',
    analogy: 'La refinería química y taller de reciclaje que produce aceites esenciales, ceras y membranas.',
    curiousFact: 'En las células de la cáscara de cítricos como la naranja o el limón, ¡el REL está superdesarrollado para producir los aceites aromáticos!',
    isExclusiveToPlants: false,
    keyFunctions: [
      'Síntesis de fosfolípidos y esteroles para renovar membranas.',
      'Desintoxicación de sustancias químicas y pesticidas.',
      'Regulación del almacenamiento de iones calcio (Ca2+).',
      'Metabolismo de carbohidratos.'
    ],
    questions: [
      {
        id: 'q-rel-1',
        question: '¿Qué tipo de moléculas biológicas sintetiza principalmente el Retículo Endoplasmático Liso?',
        options: ['Lípidos y fosfolípidos', 'Ácidos nucleicos (ADN)', 'Fibras de celulosa', 'Pigmentos de clorofila'],
        correctIndex: 0,
        explanation: '¡Muy bien! El REL es el gran productor de lípidos para reconstruir y expandir todas las membranas de la célula.',
        hint: 'Sustancias grasas que forman la bicapa.'
      }
    ]
  },
  {
    id: 'aparato-golgi',
    name: 'Aparato de Golgi (Dictiosomas)',
    scientificName: 'Complexus golgiensis / Dictyosoma',
    imageLabel: '"Aparado de Golgi"',
    category: 'sintesis',
    position: [1.6, -0.4, 0.8],
    cameraFocus: [1.5, -0.3, 0.7],
    cameraPosition: [3.4, 1.2, 1.8],
    badgeIcon: 'Package',
    summary: 'Pilas de cisternas aplanadas que reciben, clasifican, modifican y empaquetan biomoléculas para su envío.',
    detailedDescription: 'En las células vegetales, el Aparato de Golgi se compone de pilas individuales llamadas dictiosomas. Cumple un rol colosal: además de etiquetar proteínas con azúcares finales, fabrica la mayoría de los polisacáridos no celulósicos (como pectinas y hemicelulosas) necesarios para construir la nueva pared celular durante la división vegetal.',
    analogy: 'El centro logístico y de envíos (como correos o Amazon) que etiqueta, empaqueta y despacha cargamentos con precisión.',
    curiousFact: 'Cuando una célula vegetal se divide, las vesículas del Golgi se alinean en el centro formando el "fragmoplasto", precursor de la nueva pared divisoria.',
    isExclusiveToPlants: false,
    keyFunctions: [
      'Glicosilación final de glicoproteínas y glicolípidos.',
      'Síntesis de pectinas y hemicelulosas para la pared celular.',
      'Clasificación y distribución de vesículas a vacuolas o pared.',
      'Reciclaje de membranas celulares.'
    ],
    questions: [
      {
        id: 'q-golgi-1',
        question: '¿Qué función particular y vital tiene el Golgi en plantas durante la división celular?',
        options: [
          'Fabricar polisacáridos para construir la nueva pared celular',
          'Absorber luz solar para crear glucosa',
          'Generar la floración',
          'Almacenar el ADN'
        ],
        correctIndex: 0,
        explanation: '¡Excelente! Los dictiosomas del Golgi aportan pectinas y vesículas para crear la placa celular intermedia.',
        hint: 'Tiene que ver con los materiales que componen la pared protectora.'
      }
    ]
  },
  {
    id: 'ribosomas',
    name: 'Ribosomas',
    scientificName: 'Ribosoma (Complejos ribonucleoproteicos)',
    imageLabel: 'Ribosocmas ("Ribosomas")',
    category: 'sintesis',
    position: [-0.2, -1.2, -0.4],
    cameraFocus: [-0.2, -1.0, -0.4],
    cameraPosition: [-1.2, 0.2, 0.9],
    badgeIcon: 'Cpu',
    summary: 'Nanomáquinas moleculares que traducen el código del ARNm en cadenas de aminoácidos para crear proteínas.',
    detailedDescription: 'Los ribosomas están formados por dos subunidades (grande y pequeña) de ARNr y proteínas. Se encuentran flotando libres en el citoplasma (donde sintetizan proteínas para uso interno) o anclados al RER. Leen los codones de 3 nucleótidos del ARN mensajero y van uniendo aminoácidos por enlaces peptídicos.',
    analogy: 'Impresoras 3D microscópicas que leen un código digital e imprimen herramientas moleculares en tiempo real.',
    curiousFact: 'Un solo ribosoma bacteriano o vegetal puede conectar hasta 20 aminoácidos por segundo sin cometer casi ningún error.',
    isExclusiveToPlants: false,
    keyFunctions: [
      'Traducción genética del ARN mensajero a secuencias de proteínas.',
      'Catálisis del enlace peptídico mediante el centro peptidil transferasa.',
      'Soporte a la respuesta frente a condiciones de frío o sequía vegetal.'
    ],
    questions: [
      {
        id: 'q-ribo-1',
        question: '¿Cuál es el proceso mediante el cual los ribosomas sintetizan proteínas a partir de un molde de ARN?',
        options: ['Traducción', 'Fotosíntesis', 'Mitosis', 'Osmosis'],
        correctIndex: 0,
        explanation: '¡Exacto! El ADN se transcribe a ARN en el núcleo, y luego el ribosoma "traduce" ese mensaje a proteína.',
        hint: 'Como pasar un texto de un idioma genético a un idioma de aminoácidos.'
      }
    ]
  },
  {
    id: 'peroxisomas',
    name: 'Peroxisomas (y Glioxisomas)',
    scientificName: 'Peroxisoma (Oxidasas y catalasa)',
    imageLabel: '"Peroxisomas"',
    category: 'metabolico',
    position: [0.6, -1.3, 0.8],
    cameraFocus: [0.6, -1.1, 0.7],
    cameraPosition: [1.8, -0.2, 2.2],
    badgeIcon: 'Zap',
    summary: 'Vesículas metabólicas que neutralizan compuestos oxidativos tóxicos como el peróxido de hidrógeno (H2O2) usando catalasa.',
    detailedDescription: 'Los peroxisomas en las hojas de las plantas participan activamente en la fotorrespiración (metabolismo del glicolato) en estrecha cooperación con cloroplastos y mitocondrias. En semillas oleaginosas existen peroxisomas especializados llamados glioxisomas que convierten grasas en azúcares para que la semilla germine.',
    analogy: 'La planta de tratamiento de residuos químicos peligrosos que transforma sustancias corrosivas en agua y oxígeno inocuos.',
    curiousFact: 'Contienen la enzima "catalasa", una de las más rápidas conocidas: ¡una sola molécula puede descomponer millones de moléculas de agua oxigenada por segundo!',
    isExclusiveToPlants: false,
    keyFunctions: [
      'Degradación de H2O2 tóxico en agua (H2O) y oxígeno (O2).',
      'Fotorrespiración en coordinación con cloroplastos.',
      'Conversión de ácidos grasos en azúcares en semillas (ciclo del glioxilato).'
    ],
    questions: [
      {
        id: 'q-pero-1',
        question: '¿Qué enzima crucial de los peroxisomas descompone el peligroso peróxido de hidrógeno en agua y oxígeno?',
        options: ['Catalasa', 'Amilasa', 'Pepsina', 'ADN polimerasa'],
        correctIndex: 0,
        explanation: '¡Brillante! La catalasa neutraliza el peróxido de hidrógeno evitando el estrés oxidativo en las células vegetales.',
        hint: 'Comienza con la palabra Catal...'
      }
    ]
  },
  {
    id: 'citoplasma',
    name: 'Citoplasma y Citoesqueleto',
    scientificName: 'Cytoplasma & Citosol (Ciclosis vegetal)',
    imageLabel: '"Citoplasma" / "Locládios" / Microtúbulos',
    category: 'metabolico',
    position: [-0.3, 0.8, -0.8],
    cameraFocus: [0, 0.4, 0],
    cameraPosition: [-1.2, 2.4, 2.2],
    badgeIcon: 'Compass',
    summary: 'Fluido gelatinoso (citosol) atravesado por filamentos proteicos donde flotan los orgánulos y ocurre la ciclosis.',
    detailedDescription: 'El citoplasma no es agua estática: es una matriz acuosa rica en sales, azúcares y enzimas, organizada por una red dinámica de microtúbulos y microfilamentos de actina (citoesqueleto). En las células vegetales se observa un fenómeno fascinante llamado ciclosis: corrientes citoplasmáticas que transportan cloroplastos hacia la luz óptima.',
    analogy: 'Las autopistas subterráneas y el océano de gel que sostiene todos los edificios de la metrópoli celular.',
    curiousFact: 'Gracias a la ciclosis, puedes ver bajo un microscopio escolar cómo los cloroplastos giran en círculos dentro de la célula viva de una planta de Elodea acuática.',
    isExclusiveToPlants: false,
    keyFunctions: [
      'Medio acuoso para las reacciones bioquímicas de la glucólisis.',
      'Movimiento intracelular de orgánulos mediante corrientes de ciclosis.',
      'Sostén y orientación de la celulosa mediante microtúbulos corticales.'
    ],
    questions: [
      {
        id: 'q-cito-1',
        question: '¿Cómo se llama el movimiento rotatorio continuo del citoplasma vegetal que distribuye nutrientes y cloroplastos?',
        options: ['Ciclosis', 'Diálisis', 'Fagocitosis', 'Esporulación'],
        correctIndex: 0,
        explanation: '¡Exactamente! La ciclosis es impulsada por filamentos de actina y miosina para optimizar la captación de luz.',
        hint: 'Suena como "ciclo" o "circular".'
      }
    ]
  }
];

export const TOTAL_CHECKPOINTS = ORGANELLES.length;
