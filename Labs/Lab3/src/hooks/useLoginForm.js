import { useReducer } from 'react';

// 1. Khởi tạo trạng thái ban đầu (Initial State)
// Gom tất cả các dữ liệu liên quan đến form vào một Object duy nhất để dễ quản lý
const initialState = {
  username: '',
  password: '',
  errors: {},      // Lưu các lỗi kiểm tra dữ liệu (vd: 'Username không được để trống')
  loginError: ''   // Lưu lỗi phản hồi từ hệ thống/server (vd: 'Sai tài khoản')
};

// 2. Danh sách các hành động (Action Types)
// Việc dùng hằng số giúp tránh lỗi gõ sai tên hành động khi dispatch
const ACTION_TYPES = {
  SET_USERNAME: 'SET_USERNAME',
  SET_PASSWORD: 'SET_PASSWORD',
  SET_ERRORS: 'SET_ERRORS',
  SET_LOGIN_ERROR: 'SET_LOGIN_ERROR',
  CLEAR_FIELD_ERROR: 'CLEAR_FIELD_ERROR',
  RESET_FORM: 'RESET_FORM'
};

// 3. Hàm Reducer: "Bộ não" xử lý thay đổi trạng thái
// Nhận vào state hiện tại và hành động (action), trả về state mới tương ứng
function loginReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_USERNAME:
      // Copy state cũ và chỉ ghi đè thuộc tính username
      return { ...state, username: action.payload };
    case ACTION_TYPES.SET_PASSWORD:
      return { ...state, password: action.payload };
    case ACTION_TYPES.SET_ERRORS:
      return { ...state, errors: action.payload };
    case ACTION_TYPES.SET_LOGIN_ERROR:
      return { ...state, loginError: action.payload };
    case ACTION_TYPES.CLEAR_FIELD_ERROR:
      // Xóa thông báo lỗi của một trường cụ thể (action.payload là tên field)
      return {
        ...state,
        errors: { ...state.errors, [action.payload]: '' }
      };
    case ACTION_TYPES.RESET_FORM:
      // Trả về trạng thái ban đầu hoàn toàn sạch sẽ
      return initialState;
    default:
      return state; // Nếu không khớp hành động nào thì giữ nguyên state
  }
}

// 4. Custom Hook: Đóng gói toàn bộ logic xử lý form
export function useLoginForm() {
  // dispatch là hàm dùng để gửi một yêu cầu thay đổi đến loginReducer
  const [state, dispatch] = useReducer(loginReducer, initialState);

  // --- Các hàm bao bọc (Wrapper Functions) để gọi dispatch dễ dàng hơn ---

  const setUsername = (username) => {
    dispatch({ type: ACTION_TYPES.SET_USERNAME, payload: username });
  };

  const setPassword = (password) => {
    dispatch({ type: ACTION_TYPES.SET_PASSWORD, payload: password });
  };

  const clearFieldError = (field) => {
    dispatch({ type: ACTION_TYPES.CLEAR_FIELD_ERROR, payload: field });
  };

  const setLoginError = (error) => {
    dispatch({ type: ACTION_TYPES.SET_LOGIN_ERROR, payload: error });
  };

  const resetForm = () => {
    dispatch({ type: ACTION_TYPES.RESET_FORM });
  };

  // 5. Hàm kiểm tra dữ liệu (Validation)
  const validateForm = () => {
    const newErrors = {};
    
    // Kiểm tra tính hợp lệ và đẩy vào object newErrors
    if (!state.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!state.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    // Cập nhật toàn bộ lỗi tìm thấy vào state
    dispatch({ type: ACTION_TYPES.SET_ERRORS, payload: newErrors });
    
    // Nếu object lỗi không có key nào nghĩa là form hợp lệ
    return Object.keys(newErrors).length === 0;
  };

  // Trả về state và các phương thức để UI sử dụng
  return {
    state,
    setUsername,
    setPassword,
    clearFieldError,
    setLoginError,
    resetForm,
    validateForm
  };
}