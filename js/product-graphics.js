// ==========================================================================
// FERREWEB - PRODUCT GRAPHICS & VECTOR ARTWORKS
// Ilustraciones vectoriales técnicas de alta calidad para ferretería y construcción
// Paleta: Pistacho (#A3E635), Amarillo (#FACC15), Verde Bosque (#0D2818), Grafito (#1E293B) y Acero
// ==========================================================================

export const PRODUCT_ILLUSTRATIONS = {
    // 1. Taladro Inalámbrico 20V
    "taladro": `
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="prod-svg">
            <defs>
                <linearGradient id="drillBody" x1="40" y1="50" x2="160" y2="150" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#A3E635"/>
                    <stop offset="60%" stop-color="#84CC16"/>
                    <stop offset="100%" stop-color="#4D7C0F"/>
                </linearGradient>
                <linearGradient id="drillChuck" x1="140" y1="60" x2="190" y2="60" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#334155"/>
                    <stop offset="50%" stop-color="#64748B"/>
                    <stop offset="100%" stop-color="#1E293B"/>
                </linearGradient>
                <linearGradient id="drillBattery" x1="50" y1="140" x2="110" y2="180" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#0F172A"/>
                    <stop offset="100%" stop-color="#1E293B"/>
                </linearGradient>
                <filter id="toolGlow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#0F172A" flood-opacity="0.18"/>
                </filter>
            </defs>
            <g filter="url(#toolGlow)">
                <!-- Mandril y broca -->
                <rect x="145" y="66" width="22" height="24" rx="3" fill="url(#drillChuck)"/>
                <polygon points="167,73 192,78 192,79 167,84" fill="#CBD5E1"/>
                <line x1="172" y1="75" x2="188" y2="78" stroke="#FACC15" stroke-width="1.5"/>
                <!-- Cuerpo principal del taladro -->
                <path d="M50 55 C50 48 58 45 70 45 L145 45 C150 45 154 50 154 56 L154 100 C154 106 148 110 142 110 L108 110 L98 145 C95 154 85 160 75 160 L60 160 C52 160 46 153 48 145 L62 105 C54 102 50 94 50 85 Z" fill="url(#drillBody)"/>
                <!-- Grip y texturas de goma negra -->
                <path d="M58 85 L72 85 C75 85 77 88 76 91 L66 135 C64 140 60 144 55 144 L52 144 C49 144 47 141 48 138 L56 92 C56 88 57 85 58 85 Z" fill="#0F172A" opacity="0.85"/>
                <line x1="56" y1="102" x2="68" y2="102" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>
                <line x1="54" y1="112" x2="65" y2="112" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>
                <line x1="52" y1="122" x2="62" y2="122" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>
                <!-- Gatillo amarillo de seguridad -->
                <path d="M72 90 Q82 92 78 102 L70 101 Z" fill="#FACC15"/>
                <!-- Batería 20V Litio en la base -->
                <rect x="42" y="152" width="62" height="28" rx="6" fill="url(#drillBattery)"/>
                <rect x="46" y="156" width="54" height="4" rx="2" fill="#FACC15"/>
                <!-- Detalles de ventilación y selector de torque -->
                <circle cx="130" cy="78" r="14" fill="#0F172A" opacity="0.7"/>
                <text x="125" y="82" fill="#FACC15" font-size="9" font-family="sans-serif" font-weight="bold">20V</text>
                <line x1="85" y1="56" x2="115" y2="56" stroke="#0F172A" stroke-width="2" stroke-linecap="round"/>
                <line x1="85" y1="62" x2="115" y2="62" stroke="#0F172A" stroke-width="2" stroke-linecap="round"/>
                <line x1="85" y1="68" x2="115" y2="68" stroke="#0F172A" stroke-width="2" stroke-linecap="round"/>
            </g>
        </svg>
    `,

    // 2. Martillo Antiimpacto
    "martillo": `
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="prod-svg">
            <defs>
                <linearGradient id="hammerHead" x1="70" y1="30" x2="160" y2="75" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#E2E8F0"/>
                    <stop offset="40%" stop-color="#94A3B8"/>
                    <stop offset="100%" stop-color="#334155"/>
                </linearGradient>
                <linearGradient id="hammerHandle" x1="50" y1="170" x2="110" y2="70" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#A3E635"/>
                    <stop offset="100%" stop-color="#65A30D"/>
                </linearGradient>
            </defs>
            <g transform="rotate(-28 100 100)">
                <!-- Cabeza de acero forjado -->
                <path d="M70 42 C70 38 74 35 78 35 L122 35 C126 35 130 38 130 42 L130 68 C130 72 126 75 122 75 L78 75 C74 75 70 72 70 68 Z" fill="url(#hammerHead)"/>
                <!-- Uña extractora / curva trasera -->
                <path d="M72 40 C60 42 42 55 35 75 C45 68 62 62 72 65 Z" fill="#475569"/>
                <!-- Cara de golpeo templada -->
                <rect x="128" y="32" width="14" height="46" rx="4" fill="#CBD5E1"/>
                <rect x="138" y="36" width="4" height="38" rx="2" fill="#FACC15"/>
                <!-- Mango ergonómico -->
                <path d="M94 72 L90 175 C90 182 96 188 103 188 L107 188 C114 188 120 182 120 175 L116 72 Z" fill="url(#hammerHandle)"/>
                <!-- Grip engomado antideslizante con textura -->
                <path d="M89 120 L88 175 C88 183 94 189 102 189 L108 189 C116 189 122 183 122 175 L121 120 Z" fill="#0F172A"/>
                <rect x="91" y="130" width="28" height="3" rx="1.5" fill="#FACC15"/>
                <rect x="91" y="142" width="28" height="3" rx="1.5" fill="#A3E635"/>
                <rect x="91" y="154" width="28" height="3" rx="1.5" fill="#FACC15"/>
                <rect x="91" y="166" width="28" height="3" rx="1.5" fill="#A3E635"/>
            </g>
        </svg>
    `,

    // 3. Sierra Circular 7 1/4"
    "sierra": `
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="prod-svg">
            <defs>
                <linearGradient id="bladeGrad" x1="50" y1="50" x2="150" y2="150" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#F1F5F9"/>
                    <stop offset="50%" stop-color="#94A3B8"/>
                    <stop offset="100%" stop-color="#475569"/>
                </linearGradient>
                <linearGradient id="sawBody" x1="60" y1="40" x2="140" y2="120" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#A3E635"/>
                    <stop offset="100%" stop-color="#15803D"/>
                </linearGradient>
            </defs>
            <!-- Disco dentado de carburo -->
            <circle cx="100" cy="110" r="54" fill="url(#bladeGrad)"/>
            <circle cx="100" cy="110" r="16" fill="#0F172A"/>
            <circle cx="100" cy="110" r="8" fill="#FACC15"/>
            <!-- Dientes de sierra estilizados -->
            <path d="M100 52 L106 62 L100 60 L115 56 L118 66 L113 63 L130 64 L129 74 L124 70 L142 77 L137 86 L133 81 L150 93 L142 101 L139 96 L154 110 L144 115 L142 110 L152 127 L140 129 L139 124 L144 143 L132 141 L133 136 L130 156 L119 150 L121 145 L112 163 L103 154 L106 150 L91 164 L86 153 L90 150 L73 158 L72 147 L77 145 L58 147 L62 136 L66 136 L48 131 L56 122 L60 124 L44 111 L54 105 L57 108 L45 92 L57 90 L59 94 L52 74 L65 77 L66 82 L65 60 L78 67 L78 72 Z" fill="#CBD5E1"/>
            <!-- Protector superior de seguridad -->
            <path d="M54 110 C54 75 75 52 112 52 C142 52 152 72 152 110 Z" fill="#0F172A" opacity="0.9"/>
            <!-- Carcasa motor y mango -->
            <rect x="75" y="65" width="55" height="40" rx="8" fill="url(#sawBody)"/>
            <path d="M62 50 C62 42 70 38 80 38 L115 38 C125 38 130 44 130 52 L120 65 L70 65 Z" fill="#FACC15"/>
            <rect x="78" y="44" width="36" height="8" rx="4" fill="#0F172A"/>
            <!-- Base de apoyo metálica -->
            <rect x="40" y="148" width="120" height="12" rx="3" fill="#334155"/>
            <line x1="45" y1="154" x2="155" y2="154" stroke="#FACC15" stroke-width="2"/>
        </svg>
    `,

    // 4. Cemento Gris x 50kg
    "cemento": `
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="prod-svg">
            <defs>
                <linearGradient id="cementBag" x1="60" y1="30" x2="140" y2="170" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#E2E8F0"/>
                    <stop offset="60%" stop-color="#CBD5E1"/>
                    <stop offset="100%" stop-color="#94A3B8"/>
                </linearGradient>
            </defs>
            <!-- Saco de cemento -->
            <path d="M55 45 C55 38 65 32 100 32 C135 32 145 38 145 45 L152 155 C152 165 140 172 100 172 C60 172 48 165 48 155 Z" fill="url(#cementBag)"/>
            <!-- Franjas de marca y peso -->
            <rect x="52" y="70" width="96" height="34" fill="#0D2818"/>
            <text x="64" y="93" fill="#A3E635" font-family="'Plus Jakarta Sans', sans-serif" font-weight="bold" font-size="16" letter-spacing="1">CEMENTO</text>
            <!-- Badge 50 KG -->
            <rect x="75" y="112" width="50" height="22" rx="4" fill="#FACC15"/>
            <text x="83" y="127" fill="#0F172A" font-family="sans-serif" font-weight="900" font-size="12">50 KG</text>
            <!-- Costuras y pliegues -->
            <line x1="55" y1="42" x2="145" y2="42" stroke="#64748B" stroke-dasharray="4 2" stroke-width="2"/>
            <line x1="50" y1="162" x2="150" y2="162" stroke="#64748B" stroke-dasharray="4 2" stroke-width="2"/>
            <!-- Sello de calidad estructural -->
            <circle cx="128" cy="123" r="10" fill="#A3E635"/>
            <path d="M124 123 L127 126 L133 120" stroke="#0D2818" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `,

    // 5. Arena Lavada x Bulto
    "arena": `
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="prod-svg">
            <defs>
                <linearGradient id="sandBag" x1="60" y1="40" x2="140" y2="160" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#FEF08A"/>
                    <stop offset="50%" stop-color="#FDE047"/>
                    <stop offset="100%" stop-color="#CA8A04"/>
                </linearGradient>
            </defs>
            <!-- Bulto de arena -->
            <path d="M52 50 C52 42 62 36 100 36 C138 36 148 42 148 50 L154 152 C154 164 140 170 100 170 C60 170 46 164 46 152 Z" fill="url(#sandBag)"/>
            <!-- Textura de trama / rafia -->
            <path d="M54 75 Q100 85 146 75" stroke="#A16207" stroke-width="1.5" stroke-dasharray="3 3"/>
            <path d="M50 105 Q100 115 150 105" stroke="#A16207" stroke-width="1.5" stroke-dasharray="3 3"/>
            <path d="M48 135 Q100 145 152 135" stroke="#A16207" stroke-width="1.5" stroke-dasharray="3 3"/>
            <!-- Etiqueta central -->
            <rect x="62" y="85" width="76" height="30" rx="4" fill="#0D2818"/>
            <text x="73" y="104" fill="#FACC15" font-family="'Plus Jakarta Sans', sans-serif" font-weight="bold" font-size="13">ARENA</text>
            <!-- Pala de construcción al frente -->
            <g transform="rotate(25 140 120)">
                <path d="M135 70 L138 140 L132 140 Z" fill="#64748B"/>
                <path d="M125 140 L145 140 L140 165 L130 165 Z" fill="#A3E635"/>
            </g>
        </svg>
    `,

    // 6. Juego de Brocas
    "brocas": `
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="prod-svg">
            <defs>
                <linearGradient id="caseGrad" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#1E293B"/>
                    <stop offset="100%" stop-color="#0F172A"/>
                </linearGradient>
                <linearGradient id="goldBit" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#FDE047"/>
                    <stop offset="50%" stop-color="#FACC15"/>
                    <stop offset="100%" stop-color="#A16207"/>
                </linearGradient>
            </defs>
            <!-- Estuche abierto -->
            <rect x="42" y="45" width="116" height="120" rx="10" fill="url(#caseGrad)" stroke="#A3E635" stroke-width="2"/>
            <rect x="48" y="125" width="104" height="34" rx="4" fill="#334155"/>
            <!-- Brocas en hilera -->
            <!-- Broca 1 (grande) -->
            <rect x="58" y="55" width="10" height="85" rx="2" fill="url(#goldBit)"/>
            <line x1="58" y1="65" x2="68" y2="60" stroke="#713F12" stroke-width="1.5"/>
            <line x1="58" y1="75" x2="68" y2="70" stroke="#713F12" stroke-width="1.5"/>
            <line x1="58" y1="85" x2="68" y2="80" stroke="#713F12" stroke-width="1.5"/>
            <!-- Broca 2 -->
            <rect x="74" y="62" width="8" height="78" rx="2" fill="#E2E8F0"/>
            <line x1="74" y1="72" x2="82" y2="67" stroke="#475569" stroke-width="1.2"/>
            <line x1="74" y1="82" x2="82" y2="77" stroke="#475569" stroke-width="1.2"/>
            <!-- Broca 3 -->
            <rect x="88" y="70" width="7" height="70" rx="1.5" fill="url(#goldBit)"/>
            <!-- Broca 4 -->
            <rect x="101" y="78" width="6" height="62" rx="1.5" fill="#E2E8F0"/>
            <!-- Broca 5 -->
            <rect x="113" y="85" width="5" height="55" rx="1" fill="url(#goldBit)"/>
            <!-- Broca 6 -->
            <rect x="124" y="92" width="4" height="48" rx="1" fill="#E2E8F0"/>
            <!-- Broca 7 -->
            <rect x="134" y="98" width="3" height="42" rx="1" fill="url(#goldBit)"/>
            <!-- Broche de seguridad -->
            <rect x="90" y="38" width="20" height="10" rx="3" fill="#FACC15"/>
        </svg>
    `,

    // 7. Tubería PVC
    "tuberia": `
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="prod-svg">
            <defs>
                <linearGradient id="pvcGrad" x1="30" y1="50" x2="170" y2="150" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#F8FAFC"/>
                    <stop offset="50%" stop-color="#E2E8F0"/>
                    <stop offset="100%" stop-color="#94A3B8"/>
                </linearGradient>
            </defs>
            <!-- Tubo principal inclinado -->
            <g transform="rotate(-30 100 100)">
                <rect x="30" y="80" width="140" height="32" rx="6" fill="url(#pvcGrad)"/>
                <!-- Boca con reborde -->
                <rect x="25" y="76" width="18" height="40" rx="4" fill="#CBD5E1" stroke="#64748B" stroke-width="1.5"/>
                <ellipse cx="25" cy="96" rx="4" ry="20" fill="#334155"/>
                <!-- Línea de especificación técnica -->
                <line x1="45" y1="96" x2="160" y2="96" stroke="#0284C7" stroke-width="2" stroke-dasharray="8 4"/>
                <text x="65" y="92" fill="#0369A1" font-size="8" font-family="monospace" font-weight="bold">PVC RDE 21 1/2"</text>
            </g>
            <!-- Codo accesorio de unión en pistacho -->
            <path d="M125 125 C145 125 155 135 155 155 L140 155 C140 142 135 140 125 140 Z" fill="#A3E635" stroke="#4D7C0F" stroke-width="2"/>
            <rect x="118" y="122" width="8" height="22" rx="2" fill="#FACC15"/>
            <rect x="138" y="152" width="22" height="8" rx="2" fill="#FACC15"/>
        </svg>
    `,

    // 8. Llave Grifa Ajustable
    "llave": `
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="prod-svg">
            <defs>
                <linearGradient id="wrenchHead" x1="120" y1="40" x2="170" y2="90" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#E2E8F0"/>
                    <stop offset="50%" stop-color="#94A3B8"/>
                    <stop offset="100%" stop-color="#475569"/>
                </linearGradient>
            </defs>
            <g transform="rotate(35 100 100)">
                <!-- Mango de acero con grip amarillo/pistacho -->
                <rect x="92" y="60" width="16" height="115" rx="6" fill="#334155"/>
                <rect x="89" y="105" width="22" height="65" rx="8" fill="#FACC15"/>
                <rect x="93" y="112" width="14" height="50" rx="4" fill="#0F172A"/>
                <circle cx="100" cy="165" r="4" fill="#FACC15"/>
                <!-- Cabeza de la llave ajustable -->
                <path d="M80 40 C80 30 92 24 108 24 C124 24 136 32 136 45 L120 70 L80 70 Z" fill="url(#wrenchHead)"/>
                <!-- Mordaza móvil -->
                <path d="M102 30 L125 30 L115 48 L95 48 Z" fill="#CBD5E1"/>
                <rect x="92" y="52" width="16" height="10" rx="2" fill="#A3E635"/>
                <!-- Rosca de ajuste micrométrico -->
                <line x1="95" y1="54" x2="105" y2="54" stroke="#0F172A" stroke-width="1.5"/>
                <line x1="95" y1="57" x2="105" y2="57" stroke="#0F172A" stroke-width="1.5"/>
                <line x1="95" y1="60" x2="105" y2="60" stroke="#0F172A" stroke-width="1.5"/>
            </g>
        </svg>
    `,

    // 9. Pintura Interior Blanca 1 Galón
    "pintura": `
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="prod-svg">
            <defs>
                <linearGradient id="bucketGrad" x1="60" y1="50" x2="140" y2="160" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#FFFFFF"/>
                    <stop offset="60%" stop-color="#F1F5F9"/>
                    <stop offset="100%" stop-color="#CBD5E1"/>
                </linearGradient>
            </defs>
            <!-- Balde de pintura (galón) -->
            <path d="M55 60 L62 160 C63 166 72 170 100 170 C128 170 137 166 138 160 L145 60 Z" fill="url(#bucketGrad)" stroke="#94A3B8" stroke-width="1.5"/>
            <!-- Tapa y borde -->
            <ellipse cx="100" cy="58" rx="46" ry="10" fill="#0D2818"/>
            <ellipse cx="100" cy="56" rx="43" ry="8" fill="#A3E635"/>
            <!-- Etiqueta decorativa del galón -->
            <path d="M58 85 L142 85 L140 135 L60 135 Z" fill="#0D2818"/>
            <path d="M60 105 Q100 120 140 105 L140 135 L60 135 Z" fill="#FACC15"/>
            <text x="68" y="100" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-weight="bold" font-size="12">PREMIUM</text>
            <text x="70" y="125" fill="#0D2818" font-family="sans-serif" font-weight="900" font-size="10">1 GALÓN</text>
            <!-- Manija metálica -->
            <path d="M48 65 C48 30 152 30 152 65" stroke="#64748B" stroke-width="3" fill="none" stroke-linecap="round"/>
            <rect x="90" y="27" width="20" height="6" rx="3" fill="#FACC15"/>
            <!-- Gota de pintura fresca -->
            <path d="M125 135 C125 145 135 145 135 135 C135 130 130 125 130 125 C130 125 125 130 125 135 Z" fill="#A3E635"/>
        </svg>
    `,

    // 10. Rodillo Profesional 9"
    "rodillo": `
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="prod-svg">
            <defs>
                <linearGradient id="rollerGrad" x1="60" y1="40" x2="140" y2="80" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#BEF264"/>
                    <stop offset="50%" stop-color="#A3E635"/>
                    <stop offset="100%" stop-color="#65A30D"/>
                </linearGradient>
            </defs>
            <!-- Cilindro de felpa/microfibra -->
            <rect x="55" y="42" width="90" height="34" rx="8" fill="url(#rollerGrad)"/>
            <rect x="52" y="46" width="6" height="26" rx="3" fill="#1E293B"/>
            <rect x="142" y="46" width="6" height="26" rx="3" fill="#1E293B"/>
            <!-- Textura de pelo del rodillo -->
            <line x1="70" y1="48" x2="70" y2="70" stroke="#ECFCCB" stroke-width="1.5" stroke-dasharray="2 2"/>
            <line x1="90" y1="48" x2="90" y2="70" stroke="#ECFCCB" stroke-width="1.5" stroke-dasharray="2 2"/>
            <line x1="110" y1="48" x2="110" y2="70" stroke="#ECFCCB" stroke-width="1.5" stroke-dasharray="2 2"/>
            <line x1="130" y1="48" x2="130" y2="70" stroke="#ECFCCB" stroke-width="1.5" stroke-dasharray="2 2"/>
            <!-- Estructura de alambre cromado -->
            <path d="M145 59 L162 59 C166 59 170 63 170 67 L170 95 C170 100 166 104 161 104 L102 104 L102 125" stroke="#94A3B8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <!-- Mango ergonómico -->
            <rect x="94" y="125" width="16" height="52" rx="6" fill="#0D2818"/>
            <rect x="96" y="135" width="12" height="30" rx="3" fill="#FACC15"/>
            <circle cx="102" cy="168" r="3" fill="#A3E635"/>
        </svg>
    `,

    // 11. Guantes de Seguridad Reforzados
    "guantes": `
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="prod-svg">
            <defs>
                <linearGradient id="gloveGrad" x1="60" y1="50" x2="140" y2="160" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#FACC15"/>
                    <stop offset="100%" stop-color="#EAB308"/>
                </linearGradient>
            </defs>
            <!-- Guante izquierdo de carnaza -->
            <g transform="translate(10, 0)">
                <path d="M60 155 L60 110 C50 105 45 92 48 80 C50 72 58 68 64 74 L68 78 L68 55 C68 48 76 46 80 52 L82 78 L84 50 C84 44 92 42 96 48 L97 78 L99 56 C99 50 106 50 109 56 L110 95 C112 110 115 130 115 155 Z" fill="url(#gloveGrad)"/>
                <!-- Refuerzos de palma en verde pistacho -->
                <path d="M65 105 C65 95 105 95 105 105 L105 140 C105 145 65 145 65 140 Z" fill="#A3E635" opacity="0.9"/>
                <!-- Muñequera elástica de seguridad -->
                <rect x="56" y="152" width="62" height="24" rx="4" fill="#0D2818"/>
                <line x1="56" y1="164" x2="118" y2="164" stroke="#FACC15" stroke-width="2"/>
                <!-- Costuras reforzadas -->
                <path d="M72 65 L72 85" stroke="#713F12" stroke-width="1.5" stroke-dasharray="2 2"/>
                <path d="M86 62 L86 85" stroke="#713F12" stroke-width="1.5" stroke-dasharray="2 2"/>
                <path d="M99 68 L99 85" stroke="#713F12" stroke-width="1.5" stroke-dasharray="2 2"/>
            </g>
        </svg>
    `,

    // 12. Casco de Seguridad Industrial
    "casco": `
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="prod-svg">
            <defs>
                <linearGradient id="helmetGrad" x1="50" y1="40" x2="150" y2="140" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#FEF08A"/>
                    <stop offset="40%" stop-color="#FACC15"/>
                    <stop offset="100%" stop-color="#CA8A04"/>
                </linearGradient>
            </defs>
            <!-- Domo principal del casco -->
            <path d="M48 115 C46 72 70 48 100 48 C130 48 154 72 152 115 Z" fill="url(#helmetGrad)"/>
            <!-- Nervadura central de refuerzo contra impactos -->
            <path d="M96 48 C96 48 94 85 94 115 L106 115 C106 85 104 48 104 48 Z" fill="#FEF08A"/>
            <!-- Visera frontal y reborde perimetral -->
            <path d="M38 115 C38 112 44 110 52 110 L148 110 C156 110 162 112 162 115 L160 123 C160 126 152 128 140 128 L60 128 C48 128 40 126 40 123 Z" fill="#CA8A04"/>
            <!-- Cinta reflectiva de seguridad pistacho -->
            <path d="M52 100 Q100 90 148 100" stroke="#A3E635" stroke-width="4" stroke-linecap="round"/>
            <!-- Ranuras para orejeras / barbiquejo -->
            <rect x="94" y="122" width="12" height="4" rx="2" fill="#0D2818"/>
            <!-- Sello de norma ANSI/OSHA -->
            <circle cx="100" cy="78" r="8" fill="#0D2818"/>
            <path d="M96 78 L99 81 L105 75" stroke="#A3E635" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `
};

export function getProductGraphic(iconOrName, customImage = "") {
    if (customImage && customImage.trim().length > 0) {
        const safeSource = escapeGraphicAttribute(customImage);
        const safeAlt = escapeGraphicAttribute(iconOrName);
        return `<img src="${safeSource}" alt="${safeAlt}" width="400" height="400" loading="lazy" decoding="async" class="prod-img-real">`;
    }

    const key = String(iconOrName || "").toLowerCase();

    if (key.includes("taladro") || key === "tl") return PRODUCT_ILLUSTRATIONS.taladro;
    if (key.includes("martillo") || key === "mt") return PRODUCT_ILLUSTRATIONS.martillo;
    if (key.includes("sierra") || key === "sc") return PRODUCT_ILLUSTRATIONS.sierra;
    if (key.includes("cemento") || key === "cm") return PRODUCT_ILLUSTRATIONS.cemento;
    if (key.includes("arena") || key === "ar") return PRODUCT_ILLUSTRATIONS.arena;
    if (key.includes("broca") || key === "br") return PRODUCT_ILLUSTRATIONS.brocas;
    if (key.includes("tubo") || key.includes("tuberia") || key.includes("pvc") || key === "pv") return PRODUCT_ILLUSTRATIONS.tuberia;
    if (key.includes("llave") || key.includes("grifa") || key === "ll") return PRODUCT_ILLUSTRATIONS.llave;
    if (key.includes("pintura") || key === "pt") return PRODUCT_ILLUSTRATIONS.pintura;
    if (key.includes("rodillo") || key === "rd") return PRODUCT_ILLUSTRATIONS.rodillo;
    if (key.includes("guante") || key === "gu") return PRODUCT_ILLUSTRATIONS.guantes;
    if (key.includes("casco") || key === "cs") return PRODUCT_ILLUSTRATIONS.casco;

    // Fallback: Taladro o Martillo elegante
    return PRODUCT_ILLUSTRATIONS.taladro;
}

function escapeGraphicAttribute(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}
