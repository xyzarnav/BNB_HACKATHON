import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { loginUser, signupUser, logoutUser, verifyToken, clearError } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const login = (credentials: { email: string; password: string }) => {
    return dispatch(loginUser(credentials));
  };

  const signup = (signupData: any) => {
    return dispatch(signupUser(signupData));
  };

  const logout = () => {
    return dispatch(logoutUser());
  };

  const verify = (token: string) => {
    return dispatch(verifyToken(token));
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    signup,
    logout,
    verify,
    clearAuthError,
  };
};
