import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css';

const LoginForm = ({ onSwitchToSignup }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (name === 'email') {
      if (!value) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        newErrors.email = 'Email is invalid';
      } else {
        delete newErrors.email;
      }
    } else if (name === 'password') {
      if (!value) {
        newErrors.password = 'Password is required';
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) {
      return;
    }

    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (!result.success) {
      setSubmitError(result.error || 'Login failed');
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {submitError && <div className="error-message">{submitError}</div>}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : formData.email && !errors.email ? 'success' : ''}
            placeholder="Enter your email"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : formData.password && !errors.password ? 'success' : ''}
            placeholder="Enter your password"
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="switch-form">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignup} className="link-button">
          Sign up
        </button>
      </p>
    </div>
  );
};

export default LoginForm;

