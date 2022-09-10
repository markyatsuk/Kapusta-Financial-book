import { useEffect, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authOperations, authSelectors } from 'redux/auth';
import { useSearchParams } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { Header } from './Header';

const AuthView = lazy(() =>
  import('pages/AuthView' /* webpackChunkName: "auth" */),
);

const ReportsView = lazy(() =>
  import('pages/ReportsView' /* webpackChunkName: "reports" */),
);

const BalanceView = lazy(() =>
  import('pages/BalanceView' /* webpackChunkName: "balance" */),
);

export const App = () => {
  const dispatch = useDispatch();
  const isFetchingCurrentUser = useSelector(authSelectors.getIsFetchingCurrent);

  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');

  useEffect(() => {
    dispatch(authOperations.fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(authOperations.googleApi({ token }));
    }
  }, [token, dispatch]);

  return (
    <>
      <div>
        {isFetchingCurrentUser ? (
          <p>Download...</p>
        ) : (
          <>
            <Header />
            <Suspense fallback={<p>Download...</p>}>
              <Routes>
                <Route
                  path="/auth/register"
                  element={
                    <PublicRoute restricted redirectPath={'/balance'}>
                      <AuthView />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/auth/login"
                  element={
                    <PublicRoute restricted redirectPath={'/balance'}>
                      <AuthView />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/balance"
                  element={
                    <ProtectedRoute redirectPath={'/auth/login'}>
                      <BalanceView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute redirectPath={'/auth/login'}>
                      <ReportsView />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/auth/login" />} />
              </Routes>
            </Suspense>
          </>
        )}
      </div>
    </>
  );
};
