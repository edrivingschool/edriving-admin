import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import { useState } from 'react';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('');
  const [format, setFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    // Common filters
    startDate: null,
    endDate: null,
    
    // Type-specific filters
    verificationStatus: '',
    courseId: '',
    status: '',
    verified: '',
    teacherId: ''
  });
  

  const formats = [
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel' },
    { value: 'docx', label: 'Word' }];

  const reportTypes = [
    { value: 'user-registrations', label: 'User Registrations', filters: ['date', 'verificationStatus'] },
    { value: 'course-enrollments', label: 'Course Enrollments', filters: ['courseId', 'status'] },
    { value: 'payment-status', label: 'Payment Status', filters: ['date', 'verified'] },
    { value: 'document-verification', label: 'Document Verification', filters: ['status'] },
    { value: 'teacher-assignments', label: 'Teacher Assignments', filters: ['teacherId'] }
  ];

  const statusOptions = {
    verificationStatus: [
      { value: 'pending', label: 'Pending' },
      { value: 'approved', label: 'Approved' },
      { value: 'rejected', label: 'Rejected' }
    ],
    status: [
      { value: 'approved', label: 'Accepted' },
      { value: 'pending', label: 'Pending' },
      { value: 'rejected', label: 'Rejected' }
    ],
    verified: [
      { value: 'true', label: 'Verified' },
      { value: 'false', label: 'Unverified' }
    ]
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderFilters = () => {
    const currentReport = reportTypes.find(r => r.value === reportType);
    if (!currentReport) return null;

    return currentReport.filters.map(filterType => {
      switch(filterType) {
        case 'date':
          return (
            <Grid item xs={12} key="date-range">
              <Stack direction="row" spacing={2}>
                <DatePicker
                  label="Start Date"
                  value={filters.startDate}
                  onChange={(date) => handleFilterChange('startDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
                <DatePicker
                  label="End Date"
                  value={filters.endDate}
                  onChange={(date) => handleFilterChange('endDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Stack>
            </Grid>
          );

        case 'verificationStatus':
          return (
            <Grid item xs={12} md={6} key="verificationStatus">
              <FormControl fullWidth>
                <InputLabel>Verification Status</InputLabel>
                <Select
                  value={filters.verificationStatus}
                  onChange={(e) => handleFilterChange('verificationStatus', e.target.value)}
                  label="Verification Status"
                >
                  {statusOptions.verificationStatus.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          );

        case 'courseId':
          return (
            <Grid item xs={12} md={6} key="courseId">
              <TextField
                fullWidth
                label="Course ID"
                value={filters.courseId}
                onChange={(e) => handleFilterChange('courseId', e.target.value)}
              />
            </Grid>
          );

        case 'teacherId':
          return (
            <Grid item xs={12} md={6} key="teacherId">
              <TextField
                fullWidth
                label="Teacher ID"
                value={filters.teacherId}
                onChange={(e) => handleFilterChange('teacherId', e.target.value)}
              />
            </Grid>
          );

        case 'status':
          return (
            <Grid item xs={12} md={6} key="status">
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label="Status"
                >
                  {statusOptions.status.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          );

        case 'verified':
          return (
            <Grid item xs={12} md={6} key="verified">
              <FormControl fullWidth>
                <InputLabel>Verification Status</InputLabel>
                <Select
                  value={filters.verified}
                  onChange={(e) => handleFilterChange('verified', e.target.value)}
                  label="Verification Status"
                >
                  {statusOptions.verified.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          );

        default:
          return null;
      }
    });
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      // Prepare filters payload
      const payload = {
        format,
        reportType,
        filters: {
          ...(reportType === 'user-registrations' && {
            startDate: filters.startDate?.toISOString(),
            endDate: filters.endDate?.toISOString(),
            verificationStatus: filters.verificationStatus
          }),
          ...(reportType === 'course-enrollments' && {
            courseId: filters.courseId,
            status: filters.status
          }),
          ...(reportType === 'payment-status' && {
            startDate: filters.startDate?.toISOString(),
            endDate: filters.endDate?.toISOString(),
            verified: filters.verified === 'true' ? true : false
          }),
          ...(reportType === 'document-verification' && {
            status: filters.status
          }),
          ...(reportType === 'teacher-assignments' && {
            teacherId: filters.teacherId
          })
        }
      };

      const response = await axios.post(
        'https://driving-backend-stmb.onrender.com/api/reports/reports',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          responseType: 'blob'
        }
      );
   if (response.status !== 200) {
        throw new Error('Server responded with error status');
      }

      // Fix 4: Verify blob type
      const contentType = response.headers['content-type'];
      if (!contentType.includes('application/')) {
        const errorText = await new Response(response.data).text();
        throw new Error(errorText || 'Invalid file type received');
      }

      // File download logic
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
       let errorMessage = 'Failed to generate report. Please try again.';
      
      if (error.response) {
        // Handle JSON error responses
        if (error.response.headers['content-type'].includes('application/json')) {
          const errorData = await error.response.data;
          errorMessage = errorData.message || errorMessage;
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Check your connection.';
      }
      
      console.error('Report generation error:', error);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };






  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Generate Reports</Typography>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => {
                    setReportType(e.target.value);
                    // Reset filters when report type changes
                    setFilters({
                      startDate: null,
                      endDate: null,
                      verificationStatus: '',
                      courseId: '',
                      status: '',
                      verified: '',
                      teacherId: ''
                    });
                  }}
                  label="Report Type"
                >
                  {reportTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Format</InputLabel>
                <Select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  label="Format"
                >
                  {formats.map((fmt) => (
                    <MenuItem key={fmt.value} value={fmt.value}>
                      {fmt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {reportType && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Filters</Typography>
                <Grid container spacing={2}>
                  {renderFilters()}
                </Grid>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGenerateReport}
                  disabled={!reportType || loading}
                >
                  {loading ? 'Generating...' : 'Generate Report'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ReportsPage;