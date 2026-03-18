import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, Tabs, Tab, List, ListItem, ListItemText, ListItemAvatar,
  Avatar, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, InputLabel, FormControl,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { menuService } from '../services/menuService';
import { imageService } from '../services/imageService';
import {
  setMenus, setCategories, setSelectedCategory,
  addMenu, updateMenu as updateMenuState, removeMenu, reorderMenus,
} from '../features/menus/menusSlice';
import { showNotification } from '../features/notification/notificationSlice';
import type { RootState, AppDispatch } from '../app/store';
import type { Menu, CreateMenuRequest } from '../types';
import log from '../utils/logger';

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function MenuManagementPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list: menus, categories, selectedCategory } = useSelector((s: RootState) => s.menus);
  const [formOpen, setFormOpen] = useState(false);
  const [editMenu, setEditMenu] = useState<Menu | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Menu | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const cats = await menuService.getCategories();
        dispatch(setCategories(cats));
        if (cats.length > 0) dispatch(setSelectedCategory(cats[0].id));
      } catch (err) {
        log.error('Failed to load categories:', err);
      }
    };
    load();
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategory === null) return;
    const load = async () => {
      try {
        const data = await menuService.getMenusByCategory(selectedCategory);
        dispatch(setMenus(data));
      } catch (err) {
        log.error('Failed to load menus:', err);
      }
    };
    load();
  }, [selectedCategory, dispatch]);

  const sortedMenus = [...menus].sort((a, b) => a.displayOrder - b.displayOrder);

  const openForm = (menu?: Menu) => {
    if (menu) {
      setEditMenu(menu);
      setName(menu.name);
      setPrice(menu.price);
      setDescription(menu.description || '');
      setCategoryId(menu.categoryId);
      setImagePreview(menu.imageUrl);
    } else {
      setEditMenu(null);
      setName('');
      setPrice('');
      setDescription('');
      setCategoryId(selectedCategory || '');
      setImagePreview(null);
    }
    setImageFile(null);
    setFormErrors({});
    setFormOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = '메뉴명을 입력해 주세요.';
    if (!price || price < 100 || price > 1000000) errors.price = '가격은 100~1,000,000원이어야 합니다.';
    if (!categoryId) errors.categoryId = '카테고리를 선택해 주세요.';
    if (imageFile) {
      const ext = imageFile.name.split('.').pop()?.toLowerCase() || '';
      if (!ALLOWED_EXTENSIONS.includes(ext)) errors.image = '허용된 이미지 형식: jpg, jpeg, png, gif, webp';
      if (imageFile.size > MAX_FILE_SIZE) errors.image = '이미지 크기는 5MB 이하여야 합니다.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setFormLoading(true);
    try {
      let imageUrl = editMenu?.imageUrl || undefined;
      if (imageFile) {
        const res = await imageService.upload(imageFile);
        imageUrl = res.imageUrl;
      }
      const data: CreateMenuRequest = {
        name: name.trim(),
        price: price as number,
        description: description.trim() || undefined,
        categoryId: categoryId as number,
        imageUrl,
      };
      if (editMenu) {
        const updated = await menuService.updateMenu(editMenu.id, data);
        dispatch(updateMenuState(updated));
        dispatch(showNotification({ message: '메뉴가 수정되었습니다.', severity: 'success' }));
      } else {
        const created = await menuService.createMenu(data);
        dispatch(addMenu(created));
        dispatch(showNotification({ message: '메뉴가 등록되었습니다.', severity: 'success' }));
      }
      setFormOpen(false);
    } catch (err) {
      dispatch(showNotification({ message: '메뉴 저장에 실패했습니다.', severity: 'error' }));
      log.error('Menu save failed:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await menuService.deleteMenu(deleteTarget.id);
      dispatch(removeMenu(deleteTarget.id));
      dispatch(showNotification({ message: '메뉴가 삭제되었습니다.', severity: 'success' }));
      setDeleteTarget(null);
    } catch (err) {
      dispatch(showNotification({ message: '메뉴 삭제에 실패했습니다.', severity: 'error' }));
      log.error('Menu delete failed:', err);
    }
  };

  const handleMove = async (menuId: number, direction: 'up' | 'down') => {
    const idx = sortedMenus.findIndex((m) => m.id === menuId);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sortedMenus.length) return;

    const newList = [...sortedMenus];
    const temp = newList[idx].displayOrder;
    newList[idx] = { ...newList[idx], displayOrder: newList[swapIdx].displayOrder };
    newList[swapIdx] = { ...newList[swapIdx], displayOrder: temp };
    dispatch(reorderMenus(newList));

    try {
      await menuService.updateMenuOrder(
        newList.map((m) => ({ menuId: m.id, displayOrder: m.displayOrder })),
      );
    } catch (err) {
      dispatch(setMenus(sortedMenus));
      dispatch(showNotification({ message: '순서 변경에 실패했습니다.', severity: 'error' }));
      log.error('Reorder failed:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : editMenu?.imageUrl || null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">메뉴 관리</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => openForm()} data-testid="menu-add-btn">
          메뉴 등록
        </Button>
      </Box>

      <Tabs value={selectedCategory || false} onChange={(_, v) => dispatch(setSelectedCategory(v))} sx={{ mb: 2 }}>
        {categories.map((c) => <Tab key={c.id} label={c.name} value={c.id} />)}
      </Tabs>

      <List>
        {sortedMenus.map((menu, idx) => (
          <ListItem
            key={menu.id}
            data-testid={`menu-item-${menu.id}`}
            secondaryAction={
              <Box>
                <IconButton disabled={idx === 0} onClick={() => handleMove(menu.id, 'up')} data-testid={`menu-up-${menu.id}`}><ArrowUpwardIcon /></IconButton>
                <IconButton disabled={idx === sortedMenus.length - 1} onClick={() => handleMove(menu.id, 'down')} data-testid={`menu-down-${menu.id}`}><ArrowDownwardIcon /></IconButton>
                <IconButton onClick={() => openForm(menu)} data-testid={`menu-edit-${menu.id}`}><EditIcon /></IconButton>
                <IconButton onClick={() => setDeleteTarget(menu)} data-testid={`menu-delete-${menu.id}`}><DeleteIcon /></IconButton>
              </Box>
            }
          >
            <ListItemAvatar>
              <Avatar variant="rounded" src={menu.imageUrl || undefined}>{menu.name[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={menu.name} secondary={`${menu.price.toLocaleString()}원`} />
          </ListItem>
        ))}
      </List>

      {/* Menu Form Modal */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editMenu ? '메뉴 수정' : '메뉴 등록'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="메뉴명" value={name} onChange={(e) => setName(e.target.value)}
            error={!!formErrors.name} helperText={formErrors.name} required data-testid="menu-form-name" />
          <TextField label="가격" type="number" value={price} onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
            error={!!formErrors.price} helperText={formErrors.price} required
            inputProps={{ min: 100, max: 1000000 }} data-testid="menu-form-price" />
          <TextField label="설명" value={description} onChange={(e) => setDescription(e.target.value)}
            multiline rows={3} data-testid="menu-form-description" />
          <FormControl error={!!formErrors.categoryId} required>
            <InputLabel>카테고리</InputLabel>
            <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value as number)} label="카테고리" data-testid="menu-form-category">
              {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="outlined" component="label" data-testid="menu-form-image-upload">
            이미지 업로드
            <input type="file" hidden accept=".jpg,.jpeg,.png,.gif,.webp" onChange={handleFileChange} />
          </Button>
          {formErrors.image && <Typography color="error" variant="caption">{formErrors.image}</Typography>}
          {imagePreview && <Avatar variant="rounded" src={imagePreview} sx={{ width: 100, height: 100 }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>취소</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={formLoading} data-testid="menu-form-submit">
            {formLoading ? '저장 중...' : '저장'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>메뉴 삭제 확인</DialogTitle>
        <DialogContent>
          <Typography>{deleteTarget?.name}을(를) 삭제하시겠습니까?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>취소</Button>
          <Button color="error" variant="contained" onClick={handleDelete} data-testid="menu-delete-confirm">삭제</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
