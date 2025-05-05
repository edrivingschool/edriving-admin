import React, { useState } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Box
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

export default function TeacherSignupPage() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post(
        'https://driving-backend-stmb.onrender.com/api/teachers/signup',
        formData
      );
      setResult(res.data);
      setSuccessOpen(true);
      setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'right',
        bgcolor: 'background.paper',
        p: 5,
        minHeight: '100vh'
        
      }}
    >
      <Card sx={{ width: { xs: '100%', sm: 480 }, borderRadius: 2, boxShadow: 4 }}>
        <CardContent sx={{ px: 4, py: 5 }}>
          <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            Teacher Registration
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {['firstName','lastName','email','phoneNumber','password'].map((field, idx) => (
              <TextField
                key={idx}
                fullWidth
                type={field === 'password' && !showPassword ? 'password' : 'text'}
                label={field.replace(/([A-Z])/g, ' $1').trim()}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                sx={{ mb: 2 }}
                required
                InputProps={field === 'password' && {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            ))}

            <Button
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              sx={{ py: 1.5, mt: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={successOpen} onClose={() => setSuccessOpen(false)}>
        <DialogTitle>Success!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Teacher has been registered successfully.
          </DialogContentText>
          <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 1 }}>
            <Typography fontWeight={600}>ID:</Typography><Typography>{result?.id}</Typography>
            <Typography fontWeight={600}>Name:</Typography><Typography>{result?.firstName} {result?.lastName}</Typography>
            <Typography fontWeight={600}>Email:</Typography><Typography>{result?.email}</Typography>
            <Typography fontWeight={600}>Phone:</Typography><Typography>{result?.phoneNumber}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
