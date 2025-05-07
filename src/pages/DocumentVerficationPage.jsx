import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const DocumentVerificationPage = () => {
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [remark, setRemark] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dialogLoading, setDialogLoading] = useState(false);

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    }
  });

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        'https://driving-backend-stmb.onrender.com/api/admin/registrations/pending',
        getAuthHeader()
      );
      setPendingRegistrations(res.data);
    } catch (error) {
      console.error('Error fetching pending registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrationDetail = async (id) => {
    setDialogLoading(true);
    try {
      const res = await axios.get(
        `https://driving-backend-stmb.onrender.com/api/admin/registration/${id}`,
        getAuthHeader()
      );
      setSelectedRegistration(res.data);
      setDialogOpen(true);
    } catch (error) {
      console.error('Error fetching registration details:', error);
    } finally {
      setDialogLoading(false);
    }
  };

  const handleVerify = async (status) => {
    try {
      await axios.post(
        `https://driving-backend-stmb.onrender.com/api/admin/registration/${selectedRegistration.id}/verify`,
        { status, remark },
        getAuthHeader()
      );
      setDialogOpen(false);
      setRemark('');
      fetchPending();
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div>
      <Typography variant="h5" gutterBottom>Document Verification</Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingRegistrations.map((r) => (
              <TableRow key={r.registration_id}>
                <TableCell>{r.first_name} {r.last_name}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    onClick={() => fetchRegistrationDetail(r.registration_id)}
                  >
                    Review Documents
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Document Verification Details</DialogTitle>
        <DialogContent>
          {dialogLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            selectedRegistration && (
              <>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6">Personal Information</Typography>
                    <Typography><strong>Name:</strong> {selectedRegistration.first_name} {selectedRegistration.last_name}</Typography>
                    <Typography><strong>Email:</strong> {selectedRegistration.email}</Typography>
                    <Typography><strong>Age:</strong> {selectedRegistration.age}</Typography>
                    <Typography><strong>Gender:</strong> {selectedRegistration.sex}</Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="h6">Documents</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="subtitle2">User Photo:</Typography>
                        <Avatar 
                          src={selectedRegistration.user_image_url} 
                          sx={{ width: 100, height: 100 }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">National ID:</Typography>
                        <a href={selectedRegistration.national_id_url} target="_blank" rel="noopener noreferrer">
                          <img 
                            src={selectedRegistration.national_id_url} 
                            alt="National ID" 
                            style={{ width: 200, height: 'auto' }}
                          />
                        </a>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">Educational Certificate:</Typography>
                        <a href={selectedRegistration.educational_certificate_url} target="_blank" rel="noopener noreferrer">
                          <img 
                            src={selectedRegistration.educational_certificate_url} 
                            alt="Educational Certificate" 
                            style={{ width: 200, height: 'auto' }}
                          />
                        </a>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">Medical Report:</Typography>
                        <a href={selectedRegistration.medical_report_url} target="_blank" rel="noopener noreferrer">
                          <img 
                            src={selectedRegistration.medical_report_url} 
                            alt="Medical Report" 
                            style={{ width: 200, height: 'auto' }}
                          />
                        </a>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Verification Remarks"
                      fullWidth
                      multiline
                      rows={3}
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      margin="normal"
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                  <Button 
                    variant="contained" 
                    color="success"
                    onClick={() => handleVerify('approved')}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error"
                    onClick={() => handleVerify('rejected')}
                  >
                    Reject
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </Box>
              </>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentVerificationPage;
