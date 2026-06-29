/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HiddenSetting, AndroidPackage, SecretCode } from './types';

export const HIDDEN_SETTINGS: HiddenSetting[] = [
  {
    id: 'developer_options',
    name: 'Opciones de Desarrollador',
    description: 'Menú oculto con controles para depuración USB, escalas de animación, y configuraciones avanzadas de rendimiento.',
    category: 'developer',
    adbCommand: 'adb shell am start -n com.android.settings/.DevelopmentSettings',
    intentUrl: 'intent:#Intent;action=android.settings.APPLICATION_DEVELOPMENT_SETTINGS;end',
    instructions: 'Este menú te permite activar el Desbloqueo OEM, cambiar el modo de renderizado de GPU y configurar el límite de procesos en segundo plano para acelerar tu teléfono.'
  },
  {
    id: 'notification_log',
    name: 'Historial de Notificaciones',
    description: 'Accede al registro oculto de notificaciones recibidas, incluso aquellas que borraste por accidente.',
    category: 'system',
    adbCommand: 'adb shell am start -n com.android.settings/.Settings\\$NotificationStationActivity',
    intentUrl: 'intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;component=com.android.settings/.Settings$NotificationStationActivity;end',
    instructions: 'Muestra todas las notificaciones recibidas en orden cronológico detallando el paquete de origen, contenido y hora exacta.'
  },
  {
    id: 'band_selection',
    name: 'Selección de Banda LTE (Red)',
    description: 'Fuerza al modem de tu teléfono a conectarse únicamente a bandas específicas para mejorar la velocidad y estabilidad de tu internet.',
    category: 'network',
    adbCommand: 'adb shell am start -n com.android.settings/.RadioInfo',
    intentUrl: 'intent:#Intent;action=android.intent.action.MAIN;component=com.android.settings/.RadioInfo;end',
    instructions: 'Útil si tu operador tiene bandas lentas (como B28) y quieres forzar bandas de alta velocidad (como B2, B4 o B7) para descargas rápidas.'
  },
  {
    id: 'usage_stats',
    name: 'Estadísticas de Uso de Aplicaciones',
    description: 'Ver los tiempos de uso reales y detallados de cada aplicación instalada en milisegundos.',
    category: 'testing',
    adbCommand: 'adb shell am start -n com.android.settings/.UsageStatsActivity',
    intentUrl: 'intent:#Intent;action=android.intent.action.MAIN;component=com.android.settings/.UsageStatsActivity;end',
    instructions: 'Muestra un reporte oculto del sistema sobre qué aplicaciones han estado activas, ordenadas por tiempo de pantalla o último uso.'
  },
  {
    id: 'battery_optimization',
    name: 'Optimización de Batería Avanzada',
    description: 'Evita que el sistema cierre tus aplicaciones en segundo plano por ahorro de energía agresivo.',
    category: 'system',
    adbCommand: 'adb shell am start -n com.android.settings/.Settings\\$HighPowerApplicationsActivity',
    intentUrl: 'intent:#Intent;action=android.settings.action.IGNORE_BATTERY_OPTIMIZATION_SETTINGS;end',
    instructions: 'Permite añadir aplicaciones a la lista de "No optimizadas" para que notificaciones de mensajería o servicios de rastreo nunca se demoren o congelen.'
  },
  {
    id: 'system_ui_tuner',
    name: 'Sintonizador de IU del Sistema',
    description: 'Personaliza la barra de estado para ocultar íconos innecesarios (como Bluetooth, alarma) o activar el porcentaje numérico de batería.',
    category: 'developer',
    adbCommand: 'adb shell am start -n com.android.systemui/.DemoMode',
    intentUrl: 'intent:#Intent;action=android.intent.action.MAIN;component=com.android.systemui/.DemoMode;end',
    instructions: 'Te permite limpiar la barra de estado superior o configurar el modo de demostración para capturas de pantalla limpias.'
  },
  {
    id: 'multiple_users',
    name: 'Panel de Múltiples Usuarios',
    description: 'Configura perfiles de usuario alternativos para prestar tu teléfono sin revelar tus chats o fotos privadas.',
    category: 'system',
    adbCommand: 'adb shell am start -n com.android.settings/.Settings\\$UserSettingsActivity',
    intentUrl: 'intent:#Intent;action=android.intent.action.MAIN;component=com.android.settings/.Settings$UserSettingsActivity;end',
    instructions: 'Crea una cuenta de "Invitado" o un perfil secundario totalmente aislado de tus aplicaciones principales y contraseñas.'
  }
];

export const ANDROID_PACKAGES: AndroidPackage[] = [
  // Generic / Bloatware
  {
    id: 'fb_appmanager',
    name: 'Facebook App Manager',
    packageName: 'com.facebook.appmanager',
    description: 'Servicio en segundo plano que descarga e instala actualizaciones automáticas de Facebook fuera de Google Play.',
    category: 'bloatware',
    safeToRemove: true,
    brand: 'generic'
  },
  {
    id: 'fb_services',
    name: 'Facebook Services',
    packageName: 'com.facebook.services',
    description: 'Proceso que recolecta datos de ubicación y telemetría en segundo plano para publicidad de Facebook.',
    category: 'bloatware',
    safeToRemove: true,
    brand: 'generic'
  },
  {
    id: 'netflix_partner',
    name: 'Netflix Partner Activation',
    packageName: 'com.netflix.partner.activation',
    description: 'Activador de fábrica para precargar el servicio de Netflix. Consume batería incluso si no usas Netflix.',
    category: 'bloatware',
    safeToRemove: true,
    brand: 'generic'
  },
  
  // Samsung Bloatware
  {
    id: 'sam_bixby_agent',
    name: 'Bixby Voice Agent',
    packageName: 'com.samsung.android.bixby.agent',
    description: 'Asistente de voz nativo de Samsung. Gran consumidor de recursos en segundo plano.',
    category: 'bloatware',
    safeToRemove: true,
    brand: 'samsung'
  },
  {
    id: 'sam_game_home',
    name: 'Samsung Game Home / Launcher',
    packageName: 'com.samsung.android.game.gamehome',
    description: 'Organizador de juegos de Samsung. Envía analíticas pesadas e interrumpe con anuncios.',
    category: 'bloatware',
    safeToRemove: true,
    brand: 'samsung'
  },
  {
    id: 'sam_pay',
    name: 'Samsung Pay Framework',
    packageName: 'com.samsung.android.spayfw',
    description: 'Framework para pagos móviles de Samsung. Desactívalo si usas Google Pay o no usas pagos NFC de Samsung.',
    category: 'bloatware',
    safeToRemove: true,
    brand: 'samsung'
  },
  {
    id: 'sam_secure_folder',
    name: 'Samsung Carpeta Segura (Knox)',
    packageName: 'com.samsung.knox.securefolder',
    description: 'Contenedor protegido Knox. No lo desinstales si guardas archivos sensibles allí.',
    category: 'system',
    safeToRemove: false,
    brand: 'samsung'
  },

  // Xiaomi Bloatware
  {
    id: 'xia_msa',
    name: 'Xiaomi MSA (MIUI System Ads)',
    packageName: 'com.miui.msa.global',
    description: 'El motor principal que inserta anuncios publicitarios dentro de las aplicaciones del sistema en Xiaomi (Música, Gestor de Archivos).',
    category: 'bloatware',
    safeToRemove: true,
    brand: 'xiaomi'
  },
  {
    id: 'xia_analytics',
    name: 'MIUI Analytics',
    packageName: 'com.miui.analytics',
    description: 'Recolector de estadísticas de uso y comportamiento del usuario. Envía reportes constantes a servidores chinos.',
    category: 'bloatware',
    safeToRemove: true,
    brand: 'xiaomi'
  },
  {
    id: 'xia_daemon',
    name: 'Xiaomi Daemon (MiDaemon)',
    packageName: 'com.miui.daemon',
    description: 'Daemon de sistema que monitorea constantemente el estado del dispositivo y bloquea modificaciones del sistema.',
    category: 'bloatware',
    safeToRemove: true,
    brand: 'xiaomi'
  },
  {
    id: 'xia_carousel',
    name: 'Wallpaper Carousel',
    packageName: 'com.miui.android.fashiongallery',
    description: 'Carrusel de fondos de pantalla que consume datos móviles en segundo plano cargando imágenes publicitarias en pantalla de bloqueo.',
    category: 'bloatware',
    safeToRemove: true,
    brand: 'xiaomi'
  },

  // Huawei
  {
    id: 'hua_hicloud',
    name: 'Huawei HiCloud Sync',
    packageName: 'com.huawei.android.hscloud',
    description: 'Sincronizador de la nube de Huawei. Innecesario si utilizas Google Drive.',
    category: 'bloatware',
    safeToRemove: true,
    brand: 'huawei'
  },
  {
    id: 'hua_hicare',
    name: 'Huawei HiCare Support',
    packageName: 'com.huawei.phoneservice',
    description: 'Aplicación de servicio técnico y manuales que consume espacio y memoria.',
    category: 'bloatware',
    safeToRemove: true,
    brand: 'huawei'
  },

  // Motorola
  {
    id: 'mot_demomode',
    name: 'Motorola Demo Mode',
    packageName: 'com.motorola.demomode',
    description: 'Aplicación para tiendas que pone el dispositivo en modo vitrina, consumiendo pantalla y CPU.',
    category: 'bloatware',
    safeToRemove: true,
    brand: 'motorola'
  },
  {
    id: 'mot_appbox',
    name: 'Motorola AppBox',
    packageName: 'com.motorola.appbox',
    description: 'Sugerencias de descargas patrocinadas e instalación silenciosa de bloatware.',
    category: 'bloatware',
    safeToRemove: true,
    brand: 'motorola'
  }
];

export const SECRET_CODES: SecretCode[] = [
  {
    id: 'testing_menu',
    code: '*#*#4636#*#*',
    description: 'Información sobre el teléfono, estadísticas de uso, detalles de conexión Wi-Fi y configuración de banda móvil preferida.',
    brand: 'universal',
    functionName: 'Menú de Pruebas de Red y Hardware',
    category: 'network'
  },
  {
    id: 'samsung_hardware',
    code: '*#0*#',
    description: 'Menú de diagnóstico de pantalla (píxeles muertos), vibración, sensores, cámaras, altavoces y panel táctil.',
    brand: 'samsung',
    functionName: 'Prueba de Hardware General',
    category: 'hardware'
  },
  {
    id: 'mediatek_eng',
    code: '*#*#3646633#*#*',
    description: 'Acceso total al menú de ingeniería de MediaTek. Permite modificar bandas de frecuencia LTE, volúmenes de audio y calibración de antena.',
    brand: 'mediatek',
    functionName: 'MTK Engineer Mode',
    category: 'system'
  },
  {
    id: 'xiaomi_cit',
    code: '*#*#6484#*#*',
    description: 'Menú CIT de Xiaomi para probar cada uno de los componentes de hardware (giroscopio, acelerómetro, micrófono, puerto USB, etc).',
    brand: 'xiaomi',
    functionName: 'Xiaomi Hardware Test (CIT)',
    category: 'hardware'
  },
  {
    id: 'samsung_battery',
    code: '*#0228#',
    description: 'Estado avanzado de la batería, voltaje de celda en tiempo real, temperatura de carga, y opción "Quick Start" para recalibrar el medidor.',
    brand: 'samsung',
    functionName: 'Samsung Battery Status & Reset',
    category: 'battery'
  },
  {
    id: 'qualcomm_eng',
    code: '*#*#197328640#*#*',
    description: 'Modo de servicio para procesadores Snapdragon. Diagnóstico detallado del módem celular y GPS de alta precisión.',
    brand: 'qualcomm',
    functionName: 'Snapdragon Service Mode',
    category: 'network'
  },
  {
    id: 'moto_cqa',
    code: '*#*#2486#*#*',
    description: 'Menú CQATest para calibración de cámara, modem de telecomunicaciones y antena RF.',
    brand: 'motorola',
    functionName: 'Motorola CQATest Menu',
    category: 'hardware'
  }
];
