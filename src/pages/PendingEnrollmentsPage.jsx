import React, { useState, useEffect } from 'react';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  HourglassEmpty as PendingIcon,
  Refresh as RefreshIcon,
  Person as StudentIcon,
  Class as CourseIcon,
  CalendarToday as DateIcon,
  Info as DetailsIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  TextField,
  Avatar
} from '@mui/material';

const PendingEnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'withDocs', 'withoutDocs'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPendingEnrollments();
  }, []);

  const fetchPendingEnrollments = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://driving-backend-stmb.onrender.com/api/admin/enrollments/pending');
      const data = await response.json();
      setEnrollments(data);
    } catch (error) {
      console.error('Error fetching pending enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (enrollmentId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://driving-backend-stmb.onrender.com/api/admin/enrollments/${enrollmentId}/approve`,
        { method: 'POST' }
      );
      
      if (response.ok) {
        fetchPendingEnrollments();
      }
    } catch (error) {
      console.error('Error approving enrollment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (enrollmentId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://driving-backend-stmb.onrender.com/api/admin/enrollments/${enrollmentId}/reject`,
        { method: 'POST' }
      );
      
      if (response.ok) {
        fetchPendingEnrollments();
      }
    } catch (error) {
      console.error('Error rejecting enrollment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEnrollment(null);
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    // Filter by document status
    const docFilter = filter === 'all' || 
                     (filter === 'withDocs' && enrollment.student_id !== null) || 
                     (filter === 'withoutDocs' && enrollment.student_id === null);
    
    // Filter by search term
    const searchFilter = searchTerm === '' || 
                        (enrollment.course_id && enrollment.course_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (enrollment.enrolled_at && enrollment.enrolled_at.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return docFilter && searchFilter;
  });

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Pending Enrollments</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchPendingEnrollments}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Box mb={3}>
        <Chip
          label="All"
          variant={filter === 'all' ? 'filled' : 'outlined'}
          color="primary"
          onClick={() => setFilter('all')}
          sx={{ mr: 1 }}
        />
        <Chip
          label="With Documents"
          variant={filter === 'withDocs' ? 'filled' : 'outlined'}
          color="success"
          onClick={() => setFilter('withDocs')}
          sx={{ mr: 1 }}
        />
        <Chip
          label="Without Documents"
          variant={filter === 'withoutDocs' ? 'filled' : 'outlined'}
          color="warning"
          onClick={() => setFilter('withoutDocs')}
        />
      </Box>

      {loading && enrollments.length === 0 ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : filteredEnrollments.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No pending enrollments found.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Enrollment ID</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Enrolled At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEnrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>{enrollment.id.substring(0, 8)}...</TableCell>
                  <TableCell>
                    {enrollment.student_id ? (
                      <Chip
                        avatar={<Avatar><StudentIcon fontSize="small" /></Avatar>}
                        label={`Student ID: ${enrollment.student_id}`}
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip
                        label="Documents Not Submitted"
                        color="warning"
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<CourseIcon fontSize="small" />}
                      label={`Course ID: ${enrollment.course_id.substring(0, 8)}...`}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<PendingIcon fontSize="small" />}
                      label="Pending"
                      color="info"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <DateIcon fontSize="small" sx={{ mr: 1 }} />
                      {new Date(enrollment.enrolled_at).toLocaleString()}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(enrollment)}
                      sx={{ mr: 1 }}
                    >
                      <DetailsIcon />
                    </IconButton>
                    <Button
                      variant="contained"
                      size="small"
                      color="success"
                      startIcon={<ApproveIcon />}
                      onClick={() => handleApprove(enrollment.id)}
                      disabled={loading}
                      sx={{ mr: 1 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<RejectIcon />}
                      onClick={() => handleReject(enrollment.id)}
                      disabled={loading}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Enrollment Details
        </DialogTitle>
        <DialogContent>
          {selectedEnrollment && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Basic Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Enrollment ID
                        </Typography>
                        <Typography variant="body1">
                          {selectedEnrollment.id}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Status
                        </Typography>
                        <Chip
                          icon={<PendingIcon fontSize="small" />}
                          label="Pending"
                          color="info"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Enrolled At
                        </Typography>
                        <Typography variant="body1">
                          {new Date(selectedEnrollment.enrolled_at).toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Documents Submitted
                        </Typography>
                        <Typography variant="body1">
                          {selectedEnrollment.student_id ? 'Yes' : 'No'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Course Information
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Course ID
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedEnrollment.course_id}
                    </Typography>
                    {/* You would fetch and display more course details here */}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Student Information
                    </Typography>
                    {selectedEnrollment.student_id ? (
                      <>
                        <Typography variant="body2" color="textSecondary">
                          Student ID
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {selectedEnrollment.student_id}
                        </Typography>
                        {/* You would fetch and display student details here */}
                      </>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        Student documents not yet submitted
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {selectedEnrollment && (
            <>
              <Button 
                onClick={() => handleReject(selectedEnrollment.id)} 
                color="error"
                variant="outlined"
                disabled={loading}
              >
                Reject
              </Button>
              <Button 
                onClick={() => handleApprove(selectedEnrollment.id)} 
                color="success"
                variant="contained"
                disabled={loading}
              >
                Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PendingEnrollmentsPage;