import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Building, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { solicitarCotizacion } from '../services/api';

/**
 * Modal de Solicitud de Cotizaciones B2B por Volumen.
 * Diseñado para empresas constructoras, ingenieros y maestros de obra.
 */
export default function CotizacionModal({ isOpen, onClose }) {
  const [nombre, setNombre] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [despacho, setDespacho] = useState('camion_obra');
  const [insumos, setInsumos] = useState('');

  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim() || !insumos.trim()) {
      setError('Por favor completa tu nombre, teléfono y la lista de materiales requeridos.');
      return;
    }

    setCargando(true);
    setError(null);

    const payload = {
      nombre: nombre.trim(),
      empresa: empresa.trim() || 'Particular / Contratista Independiente',
      telefono: telefono.trim(),
      email: email.trim() || 'contacto@constructora.com',
      ciudad: ciudad.trim() || 'Colombia',
      tipoDespacho: despacho,
      materialesRequeridos: insumos.trim(),
      fecha: new Date().toISOString()
    };

    try {
      const resp = await solicitarCotizacion(payload);
      setResultado(resp || { success: true, codigo: `COT-${Date.now().toString().slice(-4)}` });
    } catch (err) {
      setError(err.message || 'Error al enviar la solicitud de cotización.');
    } finally {
      setCargando(false);
    }
  };

  const handleReiniciar = () => {
    setNombre('');
    setEmpresa('');
    setTelefono('');
    setEmail('');
    setCiudad('');
    setInsumos('');
    setResultado(null);
    setError(null);
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
        style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Cabecera */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
              <Building size={16} />
              <span>División Corporativa & Constructoras</span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#fff', margin: 0 }}>
              Cotización B2B por Volumen
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.84rem', margin: '4px 0 0' }}>
              Precios especiales de mayorista, crédito empresarial y despacho directo en camión a obra.
            </p>
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

        {/* Alerta de Error */}
        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', borderRadius: '8px', color: 'var(--color-danger)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {resultado ? (
          /* Estado Exitoso */
          <div style={{ background: 'rgba(2, 27, 18, 0.75)', border: '1px solid var(--color-secondary)', borderRadius: '12px', padding: '24px', textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(185, 231, 105, 0.15)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid var(--color-secondary)' }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>
              ¡Solicitud de Cotización Recibida!
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
              Un asesor técnico comercial de FerreWeb revisará tu lista de materiales y te contactará en menos de 2 horas hábiles con la propuesta formal de precios mayoristas.
            </p>
            <div style={{ background: '#021B12', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px', display: 'inline-block', marginBottom: '20px', fontFamily: 'var(--font-mono)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', display: 'block' }}>Código de Radicado B2B</span>
              <strong style={{ fontSize: '1.2rem', color: 'var(--color-accent)' }}>
                {resultado.codigo || `COT-${Date.now().toString().slice(-4)}`}
              </strong>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={`https://wa.me/573001234567?text=${encodeURIComponent(`Hola FerreWeb, acabo de radicar la cotización B2B código: ${resultado.codigo || 'B2B-OBRA'}. Deseo agilizar la respuesta técnica.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <MessageSquare size={16} /> Contactar por WhatsApp Inmediato
              </a>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleReiniciar}
              >
                Nueva Solicitud
              </button>
            </div>
          </div>
        ) : (
          /* Formulario */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Nombre del Solicitante / Ingeniero / Maestro *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="ej. Ing. Carlos Martínez"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      backgroundColor: '#021B12',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                  <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Constructora o Razón Social (Opcional)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="ej. Constructora Andina S.A.S."
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      backgroundColor: '#021B12',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                  <Building size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Teléfono / WhatsApp Móvil *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    required
                    placeholder="310 987 6543"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      backgroundColor: '#021B12',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                  <Phone size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Correo Electrónico
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    placeholder="compras@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      backgroundColor: '#021B12',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                  <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Ciudad / Municipio de la Obra
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Bogotá, Medellín, Cali..."
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      backgroundColor: '#021B12',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                  <MapPin size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                Tipo de Logística Requerida
              </label>
              <select
                value={despacho}
                onChange={(e) => setDespacho(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#021B12',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              >
                <option value="camion_obra">🚛 Camión de Carga Pesada directo a Obra</option>
                <option value="furgon_express">🚐 Furgón Cerrado Express (Insumos ligeros)</option>
                <option value="retiro_bodega">🏬 Retiro en Bodega Central (Click & Collect)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                Lista de Materiales e Insumos Solicitados (cantidades, marcas y especificaciones) *
              </label>
              <textarea
                required
                rows={4}
                value={insumos}
                onChange={(e) => setInsumos(e.target.value)}
                placeholder="Ejemplo:&#10;- 80 bultos de Cemento Gris Argos 50kg&#10;- 40 varillas de acero corrugado 1/2 pulgada&#10;- 6 tubos PVC sanitario 4 pulgadas Pavco&#10;- 3 canecas de Pintura Koraza Corona Blanca"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#021B12',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onClose}
                style={{ padding: '10px 16px' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={cargando}
                className="btn btn-primary"
                style={{ padding: '10px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                {cargando ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Radicando...</span>
                  </>
                ) : (
                  <>
                    <FileText size={16} />
                    <span>Enviar Solicitud B2B</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
