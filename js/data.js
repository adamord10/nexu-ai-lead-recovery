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
 * Escalation = a lead handed off (or pending handoff) to a human seller.
 * Keyed by escalationId (the customer-facing ESC-ID).
 */
const ESCALATIONS = {
  "8839-AX": {
    id: "8839-AX",
    leadId: "juan-marquez",
    reason: "Documentación SOC2 personalizada",
    status: { key: "in_review", label: "En revisión" },
    priority: "high",
    createdAt: "Hoy, 10:48 AM",
    assignedTo: { id: "carlos-m", name: "Carlos M.", role: "Especialista Senior de Recuperación", initials: "CM" },
    headline: "Lead con Alta Intención Detectado",
    subhead: "Calificación automatizada completada. Se requiere intervención humana para cerrar negociación compleja.",
    contextSummary: 'El lead ha interactuado con el portal de cotización 4 veces en las últimas 48 horas. La interacción vía WhatsApp con el Asistente de IA de Nexu indica una fuerte intención de compra para el plan de Financiamiento Enterprise, pero el progreso se estancó durante las discusiones sobre verificación de ingresos y cláusulas de indemnización personalizadas. La complejidad de la conversación superó los umbrales automatizados, necesitando negociación humana. El análisis de sentimiento sigue siendo positivo pero resalta precaución respecto al cumplimiento legal.',
    recommendedPitch: '"Hola Juan Antonio, noté que estabas explorando nuestras opciones de financiamiento para el Mazda CX-5 iTouring. Dados los requerimientos de verificación de tu organización, nuestra documentación estándar podría no cubrir completamente tus necesidades específicas. Tengo autorización para ofrecerte nuestro paquete avanzado de cumplimiento y guiarte a través de términos personalizados de enganche entre 15% y 20%. ¿Tienes 10 minutos mañana para alinearnos en esto?"',
    objection: {
      title: "Incertidumbre en Documentación",
      body: 'El lead solicitó explícitamente una "carta puente SOC2 Tipo II ISO-27001" combinada con una matriz personalizada de límite de responsabilidad, la cual la IA no pudo localizar en los repositorios estándar orientados a externos. Además, hubo fricción en el proceso de verificación de ingresos.'
    }
  },
  "8835-PT": {
    id: "8835-PT",
    leadId: "natasha-ramirez",
    reason: "Solicitud explícita de asesor",
    status: { key: "accepted", label: "Aceptado" },
    priority: "high",
    createdAt: "Hoy, 11:18 AM",
    assignedTo: { id: "mariana-s", name: "Mariana Solís", role: "Especialista Comercial Senior", initials: "MS" },
    headline: "Lead Listo para Cierre",
    subhead: "Aprobación crediticia al 92% y urgencia explícita (fecha objetivo del 15). Mariana ya tomó control.",
    contextSummary: 'Cliente con score crediticio sólido (Bureau 742), pre-aprobación al 92% y urgencia clara de cierre antes del 15. Pidió hablar con asesor humano directamente. Sentimiento muy positivo. Mariana Solís inició contacto vía WhatsApp y ofreció disponibilidad para firma jueves 14 o viernes 15.',
    recommendedPitch: '"Hola Natasha, soy Mariana de Nexu. Tengo disponibilidad jueves 14 a las 10:00 o viernes 15 a las 16:00 para que firmemos en sucursal. Confirmé que la unidad Honda Civic Touring 2020 que viste está disponible. ¿Cuál horario te acomoda mejor?"',
    objection: {
      title: "Coordinación logística",
      body: "Único punto pendiente: confirmar agenda de la cliente, disponibilidad de inventario y traslado de la unidad si aplica. Cero objeciones de producto o precio."
    }
  },
  "8829-MX": {
    id: "8829-MX",
    leadId: "david-manriquez",
    reason: "Ticket alto · uso comercial",
    status: { key: "pending", label: "Pendiente" },
    priority: "medium",
    createdAt: "Ayer, 1:40 PM",
    assignedTo: { id: "diego-v", name: "Diego Vega", role: "Asesor Flotillas", initials: "DV" },
    headline: "Operación Comercial — Beneficios Fiscales",
    subhead: "Persona moral con RFC empresarial. Ticket alto. Requiere asesoría fiscal y esquema flotilla.",
    contextSummary: 'Cliente registrado como persona moral con interés explícito en uso comercial (transporte ligero) de la Ford F-150 Lariat 2021. Documentación completa, sin fricción operativa. Sin embargo el ticket ($679k MXN + accesorios) y el caso de uso ameritan asesoría fiscal: deducción ISR/IVA, esquema flotilla, comparativa contra leasing comercial. La IA no tiene autoridad para emitir términos personalizados.',
    recommendedPitch: '"Hola David, soy Diego del equipo de Flotillas de Nexu. Vi que tu F-150 será para uso comercial. Te preparé una comparativa de tres escenarios: financiamiento tradicional con deducción ISR, leasing comercial puro, y nuestro esquema flotilla con tasa preferencial a partir de 2 unidades. ¿Tienes 15 min hoy para revisarla juntos?"',
    objection: {
      title: "Comparación con leasing externo",
      body: "El cliente probablemente está cotizando con bancos y arrendadoras tradicionales. Nuestra ventaja es la velocidad (firma en 48h) y la asesoría fiscal incluida, no necesariamente la tasa más baja. Posicionar en valor, no en precio."
    }
  },
  "8821-AR": {
    id: "8821-AR",
    leadId: "elena-hernandez",
    reason: "Sentimiento negativo detectado",
    status: { key: "urgent", label: "Urgente" },
    priority: "critical",
    createdAt: "Hoy, 11:04 AM",
    assignedTo: null,
    headline: "Riesgo de Pérdida — Intervención Urgente",
    subhead: "Sentiment score -0.78. La IA pausó la orquestación. Sin asesor asignado — requiere triage inmediato.",
    contextSummary: 'Cliente con capacidad económica (ingresos verificados $85k/mes) pero el ticket del Tesla Model 3 Long Range 2023 ($919k MXN) es alto y comparó con otras opciones. Tras 3 cotizaciones en 5 días respondió: "Ya me cansé de los precios, voy a buscar otra opción". La regla de sentimiento <-0.3 disparó pausa automática. La pérdida sería por percepción de precio, no por incapacidad — recuperable si interviene un humano con autoridad para descuento o cambio de configuración.',
    recommendedPitch: '"Hola Elena, soy [Asesor] del equipo de Nexu. Entiendo la frustración con las cotizaciones. Antes de que cierres con otra opción, déjame ofrecerte dos rutas: (1) un descuento por pago anticipado del 8% en el Long Range, o (2) el Model 3 Estándar con casi el mismo equipamiento y mensualidad ~25% menor. ¿Cuál te interesa explorar?"',
    objection: {
      title: "Percepción de precio elevado",
      body: "La mensualidad estimada ($17,200 MXN) cabe dentro de su perfil financiero pero está cerca del techo psicológico. El cliente menciona alternativas dos veces. Hay riesgo real de pérdida si no se llama en menos de 30 min."
    }
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
  },

  /** GET /api/escalations → EscalationSummary[] */
  async listEscalations() {
    const summaries = await Promise.all(
      Object.values(ESCALATIONS).map(async esc => {
        const lead = await this.getLead(esc.leadId);
        return {
          id: esc.id,
          leadId: esc.leadId,
          leadName: lead ? lead.name : "(lead desconocido)",
          initials: lead ? lead.initials : "??",
          vehicle: lead ? `${lead.vehicle.year} ${lead.vehicle.make} ${lead.vehicle.model}` : "—",
          score: lead ? lead.score : 0,
          reason: esc.reason,
          status: esc.status,
          priority: esc.priority,
          createdAt: esc.createdAt,
          assignedTo: esc.assignedTo
        };
      })
    );
    return summaries;
  },

  /** GET /api/escalations/:id → Escalation (with lead) */
  async getEscalation(escalationId) {
    return Promise.resolve(ESCALATIONS[escalationId] || null);
  },

  /** Helper for the detail page */
  async getEscalationWithLead(escalationId) {
    const escalation = await this.getEscalation(escalationId);
    if (!escalation) return { escalation: null, lead: null };
    const lead = await this.getLead(escalation.leadId);
    return { escalation, lead };
  },

  /** Find escalation by lead id (used when "Escalar" is clicked from a lead view) */
  async getEscalationByLead(leadId) {
    return Promise.resolve(
      Object.values(ESCALATIONS).find(e => e.leadId === leadId) || null
    );
  }
};
