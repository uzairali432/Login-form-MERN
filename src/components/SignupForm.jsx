import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css';

const SignupForm = ({ onSwitchToLogin }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name must not exceed 50 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.role && !['user', 'admin'].includes(formData.role)) {
      newErrors.role = 'Role must be either "user" or "admin"';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (name === 'name') {
      if (!value) {
        newErrors.name = 'Name is required';
      } else if (value.length < 2) {
        newErrors.name = 'Name must be at least 2 characters long';
      } else if (value.length > 50) {
        newErrors.name = 'Name must not exceed 50 characters';
      } else {
        delete newErrors.name;
      }
    } else if (name === 'email') {
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
      } else if (value.length < 6) {
        newErrors.password = 'Password must be at least 6 characters long';
      } else {
        delete newErrors.password;
      }
      // Also validate confirmPassword if it exists
      if (formData.confirmPassword) {
        if (value !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
      }
    } else if (name === 'confirmPassword') {
      if (!value) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (value !== formData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else {
        delete newErrors.confirmPassword;
      }
    } else if (name === 'role') {
      if (value && !['user', 'admin'].includes(value)) {
        newErrors.role = 'Role must be either "user" or "admin"';
      } else {
        delete newErrors.role;
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
    const result = await signup(
      formData.name,
      formData.email,
      formData.password,
      formData.role
    );
    setLoading(false);

    if (!result.success) {
      setSubmitError(result.error || 'Signup failed');
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {submitError && <div className="error-message">{submitError}</div>}
        
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : formData.name && !errors.name ? 'success' : ''}
            placeholder="Enter your name"
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

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
            placeholder="Enter your password (min 6 characters)"
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'error' : formData.confirmPassword && !errors.confirmPassword ? 'success' : ''}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={errors.role ? 'error' : formData.role && !errors.role ? 'success' : ''}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <span className="field-error">{errors.role}</span>}
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <p className="switch-form">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="link-button">
          Login
        </button>
      </p>
    </div>
  );
};

export default SignupForm;

