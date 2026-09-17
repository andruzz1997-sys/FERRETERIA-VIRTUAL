import React, { useState } from 'react';
import { X, Lock, Mail, Shield, AlertCircle, CheckCircle, ArrowRight, KeyRound } from 'lucide-react';
import { loginUsuario } from '../services/api';

/**
 * Modal de Autenticación Exclusivo para Administradores de FERREWEB
 * Acceso protegido para gestión de catálogo, inventario y ofertas.
 */
export default function AdminAuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  if (!isOpen) return null;

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const resp = await loginUsuario(adminEmail, adminPassword);
      if (resp.success) {
        if (resp.user.rol !== 'admin') {
          throw new Error('Esta cuenta no cuenta con privilegios de Administrador.');
        }

        setSuccessMsg('Acceso concedido. Abriendo Panel de Control...');
        localStorage.setItem('ferreweb_user', JSON.stringify(resp.user));
        if (resp.token) localStorage.setItem('ferreweb_token', resp.token);

        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(resp.user);
          onClose();
        }, 800);
      }
    } catch (err) {
      setError(err.message || 'Credenciales administrativas inválidas.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillAdmin = () => {
    setAdminEmail('admin@ferreweb.com');
    setAdminPassword('admin123');
    setError(null);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(6px)',
        zIndex: 4000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          backgroundColor: '#07261B',
          borderRadius: '12px',
          border: '2px solid var(--color-accent)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#021B12'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'rgba(250, 204, 21, 0.15)',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex'
            }}>
              <Shield size={24} color="var(--color-accent)" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>
                Acceso Administrativo
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-accent)', fontWeight: '600' }}>
                Gestión y Control de Ferretería
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ color: 'var(--color-text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mensaje Informativo */}
        <div style={{
          padding: '12px 24px',
          background: 'rgba(250, 204, 21, 0.05)',
          borderBottom: '1px solid var(--color-border)',
          fontSize: '0.82rem',
          color: 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <KeyRound size={16} color="var(--color-accent)" />
          <span>Acceso exclusivo para el personal y administradores de FERREWEB.</span>
        </div>

        {/* Mensajes de Alerta */}
        {error && (
          <div
            style={{
              margin: '16px 24px 0',
              padding: '10px 14px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid var(--color-danger)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#FCA5A5',
              fontSize: '0.85rem'
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              margin: '16px 24px 0',
              padding: '10px 14px',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid var(--color-secondary)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#86EFAC',
              fontSize: '0.85rem'
            }}
          >
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Formulario */}
        <div style={{ padding: '24px' }}>
          <form onSubmit={handleAdminSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
                Correo de Administrador
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="admin@ferreweb.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: '6px',
                    backgroundColor: '#021B12',
                    border: '1px solid var(--color-border)',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
                Contraseña Administrativa
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: '6px',
                    backgroundColor: '#021B12',
                    border: '1px solid var(--color-border)',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginBottom: '12px' }}
            >
              {loading ? 'Validando Privilegios...' : 'Acceder al Panel Admin'}
              <ArrowRight size={16} />
            </button>

            {/* Acceso Rápido Oficial */}
            <div style={{ textAlign: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                type="button"
                onClick={handleFillAdmin}
                style={{
                  background: 'transparent',
                  border: '1px dashed var(--color-accent)',
                  color: 'var(--color-accent)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                ⚡ Usar credenciales oficiales (admin@ferreweb.com)
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
