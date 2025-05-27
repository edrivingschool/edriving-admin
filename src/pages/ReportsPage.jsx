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
    Typography
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('');
  const [format, setFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { value: 'user-registrations', label: 'User Registrations' },
    { value: 'course-enrollments', label: 'Course Enrollments' },
    { value: 'payment-status', label: 'Payment Status' },
    { value: 'document-verification', label: 'Document Verification' },
    { value: 'teacher-assignments', label: 'Teacher Assignments' }
  ];

  const formats = [
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel' },
    { value: 'docx', label: 'Word' }
  ];

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      // Fix 1: Correct API endpoint URL
      const response = await axios.post(
        'http://localhost:3000/api/reports/reports', // Removed duplicate '/reports'
        { 
          format, 
          reportType,
          filters: {} // Fix 2: Add empty filters object if your backend requires it
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          responseType: 'blob'
        }
      );

      // Fix 3: Better error handling for blob responses
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
      // Fix 5: Improved error messaging
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
                  onChange={(e) => setReportType(e.target.value)}
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