import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../../services/api';
import { authService } from '../../services/authService';
import { orderService } from '../../services/orderService';
import { tableService } from '../../services/tableService';
import { menuService } from '../../services/menuService';

vi.mock('../../services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    defaults: { baseURL: '/api' },
  },
}));

beforeEach(() => vi.clearAllMocks());

describe('authService', () => {
  it('login calls POST /admin/auth/login', async () => {
    const mockRes = { data: { token: 'tok', expiresIn: 57600 } };
    vi.mocked(api.post).mockResolvedValue(mockRes);
    const result = await authService.login({ storeId: 's1', username: 'admin', password: 'pw' });
    expect(api.post).toHaveBeenCalledWith('/admin/auth/login', { storeId: 's1', username: 'admin', password: 'pw' });
    expect(result.token).toBe('tok');
  });
});

describe('orderService', () => {
  it('getOrdersByTable calls GET /admin/orders', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] });
    await orderService.getOrdersByTable(1);
    expect(api.get).toHaveBeenCalledWith('/admin/orders', { params: { tableId: 1 } });
  });

  it('updateOrderStatus calls PUT', async () => {
    vi.mocked(api.put).mockResolvedValue({ data: {} });
    await orderService.updateOrderStatus(1, { status: 'PREPARING' });
    expect(api.put).toHaveBeenCalledWith('/admin/orders/1/status', { status: 'PREPARING' });
  });

  it('deleteOrder calls DELETE', async () => {
    vi.mocked(api.delete).mockResolvedValue({});
    await orderService.deleteOrder(1);
    expect(api.delete).toHaveBeenCalledWith('/admin/orders/1');
  });
});

describe('tableService', () => {
  it('getTables calls GET /admin/tables', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] });
    await tableService.getTables();
    expect(api.get).toHaveBeenCalledWith('/admin/tables');
  });

  it('completePayment calls POST', async () => {
    vi.mocked(api.post).mockResolvedValue({});
    await tableService.completePayment(5);
    expect(api.post).toHaveBeenCalledWith('/admin/tables/5/payment-complete');
  });
});

describe('menuService', () => {
  it('getCategories calls GET /categories', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] });
    await menuService.getCategories();
    expect(api.get).toHaveBeenCalledWith('/categories');
  });

  it('createMenu calls POST /admin/menus', async () => {
    const data = { name: 'test', price: 1000, categoryId: 1 };
    vi.mocked(api.post).mockResolvedValue({ data: { id: 1, ...data } });
    await menuService.createMenu(data);
    expect(api.post).toHaveBeenCalledWith('/admin/menus', data);
  });

  it('deleteMenu calls DELETE', async () => {
    vi.mocked(api.delete).mockResolvedValue({});
    await menuService.deleteMenu(1);
    expect(api.delete).toHaveBeenCalledWith('/admin/menus/1');
  });
});
