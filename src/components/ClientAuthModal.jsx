import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, AlertCircle, CheckCircle, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { loginUsuario, registrarUsuario } from '../services/api';

/**
 * Modal de Autenticación Exclusivo para Clientes
 * Permite Iniciar Sesión y Registrarse como cliente de la ferretería.
 */
export default function ClientAuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Formulario Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Formulario Registro
  const [regNombre, setRegNombre] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regTelefono, setRegTelefono] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const resp = await loginUsuario(loginEmail, loginPassword);
      if (resp.success) {
        setSuccessMsg(`¡Bienvenido ${resp.user.nombre}!`);
        localStorage.setItem('ferreweb_user', JSON.stringify(resp.user));
        if (resp.token) localStorage.setItem('ferreweb_token', resp.token);

        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(resp.user);
          onClose();
        }, 800);
      }
    } catch (err) {
      setError(err.message || 'Credenciales inválidas. Verifica tu correo y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const resp = await registrarUsuario({
        nombre: regNombre,
        email: regEmail,
        password: regPassword,
        telefono: regTelefono
      });

      if (resp.success) {
        setSuccessMsg('¡Registro exitoso! Iniciando tu cuenta...');
        localStorage.setItem('ferreweb_user', JSON.stringify(resp.user));
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(resp.user);
          onClose();
        }, 1000);
      }
    } catch (err) {
      setError(err.message || 'Error al registrar usuario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(5px)',
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
          maxWidth: '440px',
          backgroundColor: '#07261B',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#021B12'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={22} color="var(--color-secondary)" />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff' }}>
                Portal de Clientes
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                FerreWeb - Tienda Virtual
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

        {/* Pestañas */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)' }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '12px',
              background: tab === 'login' ? '#07261B' : '#021B12',
              color: tab === 'login' ? 'var(--color-secondary)' : 'var(--color-text-muted)',
              fontWeight: '700',
              border: 'none',
              borderBottom: tab === 'login' ? '2px solid var(--color-secondary)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
            onClick={() => { setTab('login'); setError(null); }}
          >
            <LogIn size={16} />
            Iniciar Sesión
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '12px',
              background: tab === 'register' ? '#07261B' : '#021B12',
              color: tab === 'register' ? 'var(--color-secondary)' : 'var(--color-text-muted)',
              fontWeight: '700',
              border: 'none',
              borderBottom: tab === 'register' ? '2px solid var(--color-secondary)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
            onClick={() => { setTab('register'); setError(null); }}
          >
            <UserPlus size={16} />
            Crear Cuenta
          </button>
        </div>

        {/* Mensajes de Estado */}
        {error && (
          <div
            style={{
              margin: '16px 20px 0',
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
              margin: '16px 20px 0',
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

        {/* Formularios */}
        <div style={{ padding: '20px 24px' }}>
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
                  Correo Electrónico de Cliente
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
                  <input
                    type="email"
                    required
                    placeholder="cliente@ejemplo.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
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

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
                  Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
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
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {loading ? 'Verificando...' : 'Acceder a mi Cuenta'}
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '4px', color: 'var(--color-text-muted)' }}>
                  Nombre Completo
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Juan Carlos Rodríguez"
                    value={regNombre}
                    onChange={(e) => setRegNombre(e.target.value)}
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

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '4px', color: 'var(--color-text-muted)' }}>
                  Correo Electrónico
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
                  <input
                    type="email"
                    required
                    placeholder="juan@correo.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
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

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '4px', color: 'var(--color-text-muted)' }}>
                  Teléfono de Contacto
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
                  <input
                    type="tel"
                    placeholder="+57 310 000 0000"
                    value={regTelefono}
                    onChange={(e) => setRegTelefono(e.target.value)}
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

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '4px', color: 'var(--color-text-muted)' }}>
                  Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
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
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {loading ? 'Creando cuenta...' : 'Registrarme y Acceder'}
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
