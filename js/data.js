/**
 * Nexu Lead Rescue Copilot — data layer
 *
 * Single source of truth for leads + conversations. The UI reads from here.
 *
 * BACKEND INTEGRATION:
 *   Replace the implementations of NexuData.{listLeads, getLead,
 *   listConversations, getConversation} with fetch() calls to your API.
 *   Function signatures are already async-shaped — no UI changes required.
 *
 *   See BACKEND.md for the full API contract.
 */

const LEADS = [
  {
    id: "juan-marquez",
    name: "Juan Antonio Marquez",
    initials: "JM",
    location: "Mexico City, MX",
    phone: "+52 55 1234 5678",
    email: "juanant@email.com",
    incomeVerified: true,
    score: 85,
    leadId: "ID-84729",
    vehicle: {
      year: 2022, make: "Mazda", model: "CX-5", trim: "iTouring",
      transmission: "Automatic", price: 345900, term: 48, downPct: 20, downAmount: 69180, monthly: 7850
    },
    status: { key: "in_progress", label: "En curso", stage: "Conversación IA" },
    aiInsight: {
      tag: "Alta Intención",
      summary: "El prospecto estuvo muy cerca de cerrar su financiamiento. La verificación de ingresos fue exitosa. El abandono en la carga de documentos probablemente se deba a fricción en el enganche.",
      positive: ["Ingresos comprobables", "Empleo estable verificado"],
      negative: ["Fricción en subida de documentos (móvil)"]
    },
    recommendedAction: {
      title: "WhatsApp con opción alternativa de carga de documentos",
      detail: "Ofrecer recibir el Comprobante de Domicilio vía email para reducir fricción."
    }
  },
  {
    id: "antonio-poveda",
    name: "Antonio Poveda Martínez",
    initials: "AP",
    location: "Monterrey, NL",
    phone: "+52 81 8327 4451",
    email: "antoniopov@email.com",
    incomeVerified: false,
    score: 42,
    leadId: "ID-83214",
    vehicle: {
      year: 2019, make: "Toyota", model: "Tacoma", trim: "TRD",
      transmission: "Manual", price: 579000, term: 60, downPct: 25, downAmount: 144750, monthly: 11420
    },
    status: { key: "waiting", label: "Esperando", stage: null },
    aiInsight: {
      tag: "Intención Media",
      summary: "Cliente con interés real en el vehículo, pero el perfil crediticio requiere fortalecimiento. La fricción no es el producto sino las condiciones financieras iniciales.",
      positive: ["Visitó la página 3 veces"],
      negative: ["Score crediticio bajo (580)", "Ingresos sin comprobar"]
    },
    recommendedAction: {
      title: "Ofrecer plan con aval o mayor enganche",
      detail: "Enviar simulación con 35% enganche o esquema con aval familiar para mejorar aprobación."
    }
  },
  {
    id: "elena-hernandez",
    name: "Elena Rosa Hernández",
    initials: "EH",
    location: "Guadalajara, JAL",
    phone: "+52 33 1492 8810",
    email: "elena.rosa@email.com",
    incomeVerified: true,
    score: 12,
    leadId: "ID-82997",
    vehicle: {
      year: 2023, make: "Tesla", model: "Model 3", trim: "Long Range",
      transmission: "Automatic", price: 919000, term: 72, downPct: 30, downAmount: 275700, monthly: 17200
    },
    status: { key: "at_risk", label: "Riesgo de pérdida", stage: null },
    aiInsight: {
      tag: "Riesgo de Pérdida",
      summary: "El cliente tiene capacidad económica (ingresos comprobados) pero el ticket es alto y comparó con otras opciones. La pérdida sería por percepción de precio, no por incapacidad.",
      positive: ["Ingresos verificados ($85k/mes)"],
      negative: ['Mencionó "otra opción" 2 veces', "Tiempo entre mensajes creciendo"]
    },
    recommendedAction: {
      title: "Llamada de especialista en 30 min",
      detail: "Asesor senior debe ofrecer descuento por pago anticipado o cambio de modelo (Model 3 Estándar)."
    }
  },
  {
    id: "david-manriquez",
    name: "David Manríquez Salazar",
    initials: "DM",
    location: "Puebla, PUE",
    phone: "+52 222 754 1029",
    email: "dmanriquez@email.com",
    incomeVerified: true,
    score: 68,
    leadId: "ID-83541",
    vehicle: {
      year: 2021, make: "Ford", model: "F-150", trim: "Lariat SuperCrew",
      transmission: "4x4 Automatic", price: 679000, term: 60, downPct: 20, downAmount: 135800, monthly: 13420
    },
    status: { key: "waiting", label: "Esperando", stage: null },
    aiInsight: {
      tag: "Intención Comercial",
      summary: "Cliente con perfil sólido y documentos completos. Búsquedas previas indican uso para negocio (transporte ligero). Probable que esté comparando con leasing comercial.",
      positive: ["Documentación completa", "Persona moral (RFC empresarial)"],
      negative: ["Sin respuesta tras 18h"]
    },
    recommendedAction: {
      title: "Cotización para uso comercial",
      detail: "Enviar comparativa con esquema flotilla y beneficios fiscales (deducción ISR/IVA)."
    }
  },
  {
    id: "natasha-ramirez",
    name: "Natasha Pomelo Ramírez",
    initials: "NR",
    location: "Querétaro, QRO",
    phone: "+52 442 178 6044",
    email: "natpomelo@email.com",
    incomeVerified: true,
    score: 92,
    leadId: "ID-84102",
    vehicle: {
      year: 2020, make: "Honda", model: "Civic", trim: "Touring",
      transmission: "CVT", price: 315000, term: 48, downPct: 15, downAmount: 47250, monthly: 7140
    },
    status: { key: "escalated", label: "Escalado a comercial", stage: "Mariana Solís" },
    aiInsight: {
      tag: "Compra Inminente",
      summary: "Cliente con urgencia clara (fecha objetivo 15), aprobación crediticia sólida y sentimiento muy positivo. Solo falta cerrar términos.",
      positive: ["Fecha objetivo explícita", "Bureau score alto (742)", "Pidió hablar con humano"],
      negative: []
    },
    recommendedAction: {
      title: "Agendar cita en sucursal",
      detail: "Confirmar disponibilidad de unidad y agendar firma para esta semana."
    }
  }
];

/**
 * Conversation = ordered list of messages. Roles: "lead" (incoming), "ai" (outgoing AI).
 * Each lead has its own conversation thread.
 */
const CONVERSATIONS = {
  "juan-marquez": {
    intent: { label: "Comparar tasas de financiamiento", confidence: 94 },
    sentiment: { label: "Curioso · Positivo", trend: "Estable" },
    nextBestAction: {
      title: "Enviar Tabla de Tasas + Link de Documentos",
      body: "La IA ha preparado un resumen comparativo de tasas (15% / 18% / 20% enganche) y un enlace seguro para subir documentos faltantes."
    },
    messages: [
      { role: "lead", text: "Hola, estaba viendo el paquete de financiamiento para el Mazda CX-5 pero no estoy seguro de si aplica para mi perfil.", time: "10:42 AM" },
      { role: "ai", text: "Hola Juan Antonio. Noté que estabas explorando el plan iTouring con enganche 20%. ¿Te gustaría que te envíe los requisitos detallados y un simulador con opciones de 15% y 18%?", time: "10:44 AM" },
      { role: "lead", text: "Sí, por favor. ¿Y cuál es la diferencia en la tasa entre los tres?", time: "10:46 AM" }
    ]
  },
  "antonio-poveda": {
    intent: { label: "Confirmar aprobación crediticia", confidence: 71 },
    sentiment: { label: "Inseguro · Neutro", trend: "Estable" },
    nextBestAction: {
      title: "Enviar simulación con aval",
      body: "Preparar alternativa con aval familiar o 35% de enganche para mejorar la pre-aprobación."
    },
    messages: [
      { role: "ai", text: "Hola Antonio. Vi que iniciaste tu solicitud para la Tacoma 2019. ¿Te gustaría que te envíe los requisitos para mejorar tu aprobación?", time: "Ayer, 3:00 PM" },
      { role: "lead", text: "Sí pero me preocupa que no me aprueben con mi score actual.", time: "Ayer, 3:14 PM" },
      { role: "ai", text: "Entiendo. Tenemos dos rutas: subir el enganche al 35% o incluir un aval. ¿Cuál te acomoda más?", time: "Ayer, 3:16 PM" }
    ]
  },
  "elena-hernandez": {
    intent: { label: "Comparar precio con competencia", confidence: 88 },
    sentiment: { label: "Frustrado · Negativo", trend: "Bajando" },
    nextBestAction: {
      title: "Escalar a asesor senior",
      body: "Sentimiento por debajo del umbral. Requiere intervención humana con autoridad para ofrecer descuento o cambio de modelo."
    },
    messages: [
      { role: "ai", text: "Hola Elena, vi tu interés por el Model 3 Long Range. ¿Pudiste revisar la simulación que te envié ayer?", time: "Hoy, 10:55 AM" },
      { role: "lead", text: "Sí pero la mensualidad sigue muy alta. Ya me cansé de los precios, voy a buscar otra opción.", time: "Hoy, 11:02 AM" }
    ]
  },
  "david-manriquez": {
    intent: { label: "Validar uso comercial", confidence: 76 },
    sentiment: { label: "Reflexivo · Neutro", trend: "Estable" },
    nextBestAction: {
      title: "Enviar comparativa fiscal",
      body: "Preparar tabla de beneficios fiscales (ISR/IVA) para uso comercial vs uso personal."
    },
    messages: [
      { role: "ai", text: "Hola David, tu solicitud para la F-150 Lariat 2021 está en revisión. Vi que registraste RFC empresarial — ¿la unidad es para uso comercial?", time: "Ayer, 1:20 PM" },
      { role: "lead", text: "Sí, para mi negocio de transporte ligero. ¿Hay algún beneficio fiscal?", time: "Ayer, 1:35 PM" },
      { role: "ai", text: "Sí, puedes deducir IVA e ISR. Te preparo una comparativa contra leasing comercial.", time: "Ayer, 1:36 PM" }
    ]
  },
  "natasha-ramirez": {
    intent: { label: "Agendar firma de contrato", confidence: 96 },
    sentiment: { label: "Decidido · Muy Positivo", trend: "Subiendo" },
    nextBestAction: {
      title: "Asignar a Mariana Solís",
      body: "Lead listo para cierre. Mariana Solís ya está en contacto. Agendar firma esta semana."
    },
    messages: [
      { role: "ai", text: "Hola Natasha, tu pre-aprobación del Civic Touring está al 92%. ¿Te gustaría agendar una cita en sucursal?", time: "Hoy, 11:10 AM" },
      { role: "lead", text: "¿Cuándo podemos cerrar? Necesito el auto antes del 15.", time: "Hoy, 11:14 AM" },
      { role: "ai", text: "Perfecto. Estoy escalando con Mariana Solís, ella te contacta en minutos para confirmar fechas.", time: "Hoy, 11:18 AM" },
      { role: "ai", text: "[Mariana] Hola Natasha, soy Mariana de Nexu. Tengo disponibilidad jueves 14 a las 10:00 o viernes 15 a las 16:00. ¿Cuál te acomoda?", time: "Hoy, 11:22 AM" }
    ]
  }
};

/**
 * Public API consumed by the UI. All functions return Promises so swapping
 * the body to fetch() is a one-line change.
 */
window.NexuData = {
  /** GET /api/leads → Lead[] */
  async listLeads() {
    return Promise.resolve(LEADS);
  },

  /** GET /api/leads/:id → Lead */
  async getLead(id) {
    return Promise.resolve(LEADS.find(l => l.id === id) || null);
  },

  /** GET /api/conversations → ConversationSummary[] */
  async listConversations() {
    return Promise.resolve(
      LEADS.map(lead => {
        const c = CONVERSATIONS[lead.id];
        const last = c && c.messages.length ? c.messages[c.messages.length - 1] : null;
        return {
          leadId: lead.id,
          leadName: lead.name,
          initials: lead.initials,
          vehicle: `${lead.vehicle.year} ${lead.vehicle.make} ${lead.vehicle.model}`,
          status: lead.status,
          score: lead.score,
          intent: c ? c.intent : null,
          sentiment: c ? c.sentiment : null,
          lastMessage: last ? last.text : null,
          lastMessageAt: last ? last.time : null,
          lastMessageRole: last ? last.role : null,
          messageCount: c ? c.messages.length : 0
        };
      })
    );
  },

  /** GET /api/leads/:id/conversation → Conversation */
  async getConversation(leadId) {
    return Promise.resolve(CONVERSATIONS[leadId] || null);
  },

  /** Helper for views that need both at once */
  async getLeadWithConversation(leadId) {
    const [lead, conversation] = await Promise.all([
      this.getLead(leadId),
      this.getConversation(leadId)
    ]);
    return { lead, conversation };
  }
};
