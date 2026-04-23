import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [dialog, setDialog] = useState({ open: false, title: '', message: '', onConfirm: null });

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const showConfirm = useCallback((title, message, onConfirm) => {
    setDialog({ open: true, title, message, onConfirm });
  }, []);

  const closeDialog = useCallback(() => {
    setDialog(prev => ({ ...prev, open: false }));
  }, []);

  return (
    <NotificationContext.Provider value={{ showSnackbar, showConfirm }}>
      {children}
      
      {/* Global Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Global Confirmation Dialog */}
      <Dialog open={dialog.open} onClose={closeDialog}>
        <DialogTitle>{dialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button 
            onClick={() => {
              if (dialog.onConfirm) dialog.onConfirm();
              closeDialog();
            }} 
            variant="contained" 
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
