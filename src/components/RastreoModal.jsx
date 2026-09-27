import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  PackageCheck, 
  Clock, 
  MapPin, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Building2,
  Calendar
} from 'lucide-react';
import { rastrearPedido } from '../services/api';

/**
 * Modal de Rastreo de Pedido y Despacho en Vivo.
 * Permite a contratistas y compradores verificar el estado de su guía y transportadora.
 */
export default function RastreoModal({ isOpen, onClose, initialReference = '' }) {
  const [referencia, setReferencia] = useState(initialReference || '');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleBuscar = async (e) => {
    if (e) e.preventDefault();
    const cleanRef = referencia.trim().toUpperCase();
    if (!cleanRef) {
      setError('Por favor ingresa un número de referencia o guía.');
      return;
    }

    setCargando(true);
    setError(null);
    setResultado(null);

    try {
      const data = await rastrearPedido(cleanRef);
      if (data && data.success !== false) {
        setResultado(data);
      } else {
        setError(data.message || 'No se encontró información con esa referencia.');
      }
    } catch (err) {
      setError(err.message || 'Error al consultar el servicio de rastreo.');
    } finally {
      setCargando(false);
    }
  };

  const setEjemplo = (ejemplo) => {
    setReferencia(ejemplo);
    setError(null);
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'entregado':
        return { label: 'ENTREGADO EN OBRA', color: 'var(--color-secondary)', bg: 'rgba(185, 231, 105, 0.15)' };
      case 'en_camino':
      case 'en_transito':
        return { label: 'EN CAMIÓN DE RUTA', color: 'var(--color-accent)', bg: 'rgba(255, 212, 59, 0.15)' };
      case 'en_preparacion':
      default:
        return { label: 'EN PREPARACIÓN / EMBALAJE', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)' };
    }
  };

  return (
    <div 
      className="wompi-voucher-overlay" 
      onClick={onClose}
      style={{ zIndex: 6000 }}
    >
      <div 
        className="wompi-voucher-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Cabecera */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-secondary)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
              <Truck size={16} />
              <span>Logística Industrial FerreWeb</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', margin: 0 }}>
              Rastreo de Guía y Despacho
            </h2>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            style={{ color: 'var(--color-text-muted)', padding: '6px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)' }}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario de Consulta */}
        <form onSubmit={handleBuscar} style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
            Ingresa tu Referencia de Pedido (ej. FERREWEB-XXXXXX) o Guía de Carga:
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                value={referencia}
                onChange={(e) => setReferencia(e.target.value.toUpperCase())}
                placeholder="FERREWEB-884210"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  backgroundColor: '#021B12',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.95rem',
                  textTransform: 'uppercase'
                }}
              />
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
            </div>
            <button
              type="submit"
              disabled={cargando}
              className="btn btn-primary"
              style={{ padding: '12px 20px', minWidth: '120px' }}
            >
              {cargando ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Consultar'}
            </button>
          </div>

          {/* Sugerencias Rápidas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>
            <span>Probar referencia de ejemplo:</span>
            <button
              type="button"
              onClick={() => setEjemplo('FERREWEB-884210')}
              style={{ color: 'var(--color-secondary)', textDecoration: 'underline', background: 'none', border: 'none', padding: 0, fontSize: 'inherit', cursor: 'pointer' }}
            >
              FERREWEB-884210
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setEjemplo('FERREWEB-991203')}
              style={{ color: 'var(--color-accent)', textDecoration: 'underline', background: 'none', border: 'none', padding: 0, fontSize: 'inherit', cursor: 'pointer' }}
            >
              FERREWEB-991203
            </button>
          </div>
        </form>

        {/* Mensaje de Error */}
        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', borderRadius: '8px', color: 'var(--color-danger)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Resultado del Rastreo */}
        {resultado && (
          <div style={{ background: 'rgba(2, 27, 18, 0.75)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', animation: 'fadeIn 0.3s ease' }}>
            {/* Header del Resultado */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Referencia</span>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                  {resultado.referencia}
                </div>
              </div>
              <div 
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  color: getEstadoBadge(resultado.estadoActual).color,
                  background: getEstadoBadge(resultado.estadoActual).bg,
                  border: `1px solid ${getEstadoBadge(resultado.estadoActual).color}`
                }}
              >
                {getEstadoBadge(resultado.estadoActual).label}
              </div>
            </div>

            {/* Datos Técnicos de Entrega */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '20px', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: 'var(--color-text-dim)', display: 'block', marginBottom: '2px' }}>Transportadora:</span>
                <strong style={{ color: 'var(--color-secondary)' }}>{resultado.transportadora || 'Logística Exprés FerreWeb'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-dim)', display: 'block', marginBottom: '2px' }}>N° de Guía:</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>{resultado.guia || 'FW-GUIA-8829'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-dim)', display: 'block', marginBottom: '2px' }}>Entrega Estimada:</span>
                <strong style={{ color: '#fff' }}>{resultado.fechaEstimada || '24 a 48 horas'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-dim)', display: 'block', marginBottom: '2px' }}>Destino / Obra:</span>
                <strong style={{ color: '#fff' }}>{resultado.destino || 'Colombia'}</strong>
              </div>
            </div>

            {/* Línea de Tiempo de Eventos */}
            <div style={{ marginTop: '16px' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Historial de Movimientos de Carga
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(resultado.eventos || [
                  { estado: 'Orden recibida en sistema y verificada', completado: true },
                  { estado: 'Despacho preparado en bodega central', completado: true },
                  { estado: 'Asignado a camión de carga pesada', completado: true },
                  { estado: 'En tránsito a dirección / obra final', completado: false }
                ]).map((ev, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ marginTop: '2px' }}>
                      {ev.completado ? (
                        <CheckCircle2 size={16} color="var(--color-secondary)" />
                      ) : (
                        <Clock size={16} color="var(--color-text-dim)" />
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: ev.completado ? '700' : '400', color: ev.completado ? '#fff' : 'var(--color-text-dim)' }}>
                        {ev.estado}
                      </div>
                      {ev.fecha && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }}>
                          {new Date(ev.fecha).toLocaleString('es-CO')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
}
