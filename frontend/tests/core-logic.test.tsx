// src/__tests__/services/api.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { api } from '../services/api';

// Мок глобального fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('API Auth', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    localStorage.clear();
  });

  // 1. Успешная регистрация → сохраняет токен
  it('register stores token on success', async () => {
    const mockToken = { access_token: 'jwt-token' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockToken,
    });

    await api.register('test@ex.com', 'John', 'pass123');

    expect(localStorage.getItem('focusflow_token')).toBe('jwt-token');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/users/register'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'test@ex.com',
          full_name: 'John',
          password: 'pass123',
        }),
      })
    );
  });

  // 2. Регистрация с ошибкой (дубликат) → выбрасывает исключение
  it('register throws on duplicate email', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ detail: 'Email already exists' }),
    });

    await expect(api.register('dup@ex.com', 'Jane', 'pass')).rejects.toThrow(
      'Email already exists'
    );
    expect(localStorage.getItem('focusflow_token')).toBeNull();
  });

  // 3. Логин с корректными данными
  it('login success stores token', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'token123' }),
    });

    const formData = new FormData();
    formData.append('username', 'test@ex.com');
    formData.append('password', 'pass');

    await api.login(formData);

    expect(localStorage.getItem('focusflow_token')).toBe('token123');
  });

  // 4. Автоматическая очистка токена при 401
  it('clears token on 401 unauthorized', async () => {
    localStorage.setItem('focusflow_token', 'old-token');
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ detail: 'Unauthorized' }),
    });

    await expect(api.getUser()).rejects.toThrow();
    expect(localStorage.getItem('focusflow_token')).toBeNull();
  });

  // 5. Валидация формы регистрации (чистый юнит, без API)
  it('SignUp component validates password match', async () => {
    // Тестируем логику внутри компонента SignUp
    // Можно протестировать изолированно, но здесь пример с рендером
    const { default: SignUp } = await import('../pages/SignUp');
    const mockSwitch = vi.fn();
    
    const { container, getByText, getByLabelText } = render(
      <SignUp onSwitchToLogin={mockSwitch} />
    );

    const fullName = getByLabelText(/full name/i);
    const email = getByLabelText(/email/i);
    const password = getByLabelText(/^password$/i); // первый
    const confirm = getByLabelText(/confirm password/i);
    const submit = getByText('Create Account');

    await userEvent.type(fullName, 'Test');
    await userEvent.type(email, 'test@ex.com');
    await userEvent.type(password, '123');
    await userEvent.type(confirm, '456');
    await userEvent.click(submit);

    // Ожидаем сообщение об ошибке
    expect(getByText('Passwords do not match')).toBeInTheDocument();
  });
});