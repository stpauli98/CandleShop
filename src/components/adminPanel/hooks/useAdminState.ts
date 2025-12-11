import { useReducer, useCallback } from 'react';
import type { Product } from '../types';
import { type CategoryId, type ActiveTab, type FormMode } from '@/lib/constants/admin';

// ============================================================================
// STATE TYPE
// ============================================================================

interface AdminState {
  selectedProduct: Product | undefined;
  selectedCategory: CategoryId;
  formMode: FormMode;
  activeTab: ActiveTab;
}

// ============================================================================
// ACTION TYPES
// ============================================================================

type AdminAction =
  | { type: 'SELECT_PRODUCT'; product: Product }
  | { type: 'CLEAR_PRODUCT' }
  | { type: 'SET_CATEGORY'; category: CategoryId }
  | { type: 'SET_FORM_MODE'; mode: FormMode }
  | { type: 'SET_TAB'; tab: ActiveTab }
  | { type: 'RESET_FORM' }
  | { type: 'START_EDIT'; product: Product }
  | { type: 'START_CREATE' };

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: AdminState = {
  selectedProduct: undefined,
  selectedCategory: 'svijece',
  formMode: 'create',
  activeTab: 'dashboard',
};

// ============================================================================
// REDUCER
// ============================================================================

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'SELECT_PRODUCT':
      return {
        ...state,
        selectedProduct: action.product,
      };

    case 'CLEAR_PRODUCT':
      return {
        ...state,
        selectedProduct: undefined,
        formMode: 'create',
      };

    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.category,
        selectedProduct: undefined,
        formMode: 'create',
      };

    case 'SET_FORM_MODE':
      return {
        ...state,
        formMode: action.mode,
      };

    case 'SET_TAB':
      return {
        ...state,
        activeTab: action.tab,
      };

    case 'RESET_FORM':
      return {
        ...state,
        selectedProduct: undefined,
        formMode: 'create',
      };

    case 'START_EDIT':
      return {
        ...state,
        selectedProduct: action.product,
        formMode: 'edit',
        activeTab: 'form',
      };

    case 'START_CREATE':
      return {
        ...state,
        selectedProduct: undefined,
        formMode: 'create',
        activeTab: 'form',
      };

    default:
      return state;
  }
}

// ============================================================================
// HOOK
// ============================================================================

export function useAdminState() {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Action creators
  const selectProduct = useCallback((product: Product) => {
    dispatch({ type: 'SELECT_PRODUCT', product });
  }, []);

  const clearProduct = useCallback(() => {
    dispatch({ type: 'CLEAR_PRODUCT' });
  }, []);

  const setCategory = useCallback((category: CategoryId) => {
    dispatch({ type: 'SET_CATEGORY', category });
  }, []);

  const setFormMode = useCallback((mode: FormMode) => {
    dispatch({ type: 'SET_FORM_MODE', mode });
  }, []);

  const setTab = useCallback((tab: ActiveTab) => {
    dispatch({ type: 'SET_TAB', tab });
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  const startEdit = useCallback((product: Product) => {
    dispatch({ type: 'START_EDIT', product });
  }, []);

  const startCreate = useCallback(() => {
    dispatch({ type: 'START_CREATE' });
  }, []);

  return {
    // State
    ...state,

    // Actions
    selectProduct,
    clearProduct,
    setCategory,
    setFormMode,
    setTab,
    resetForm,
    startEdit,
    startCreate,
  };
}

export type { AdminState, AdminAction };
