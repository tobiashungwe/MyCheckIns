import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function VisitForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    visitorName: '',
    startDate: null,
    endDate: null,
    notes: '',
    mealRequest: '',
    specialNotes: ''
  });

  const [errors, setErrors] = useState({
    visitorName: '',
    startDate: '',
    endDate: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const newErrors = {
      visitorName: '',
      startDate: '',
      endDate: ''
    };

    let isValid = true;

    if (!formData.visitorName.trim()) {
      newErrors.visitorName = 'Visitor name is required';
      isValid = false;
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
      isValid = false;
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
      isValid = false;
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date cannot be before start date';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleDateChange = (name) => (date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      // Create visit
      const visitPayload = {
        visitor_name: formData.visitorName,
        start_date: formData.startDate.toISOString().split('T')[0],
        end_date: formData.endDate.toISOString().split('T')[0],
        notes: formData.notes
      };

      const visitResponse = await axios.post('/api/visits/', visitPayload);

      // Create requirements if any
      if (formData.mealRequest || formData.specialNotes) {
        const requirementsPayload = {
          visit_id: visitResponse.data.id,
          meal_request: formData.mealRequest,
          special_notes: formData.specialNotes
        };
        await axios.post(
          `/api/visits/${visitResponse.data.id}/requirements`,
          requirementsPayload
        );
      }

      onSuccess();
      setFormData({
        visitorName: '',
        startDate: null,
        endDate: null,
        notes: '',
        mealRequest: '',
        specialNotes: ''
      });
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(
        error.response?.data?.detail || 
        'Failed to submit form. Please try again later.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          {submitError && (
            <Grid item xs={12}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Visitor Name"
              name="visitorName"
              value={formData.visitorName}
              onChange={handleTextChange}
              error={!!errors.visitorName}
              helperText={errors.visitorName}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Start Date"
              value={formData.startDate}
              onChange={handleDateChange('startDate')}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.startDate,
                  helperText: errors.startDate,
                  required: true
                }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatePicker
              label="End Date"
              value={formData.endDate}
              onChange={handleDateChange('endDate')}
              minDate={formData.startDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.endDate,
                  helperText: errors.endDate,
                  required: true
                }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="General Notes"
              name="notes"
              value={formData.notes}
              onChange={handleTextChange}
              multiline
              rows={3}
              placeholder="Any general notes about your visit..."
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Meal Request (optional)"
              name="mealRequest"
              value={formData.mealRequest}
              onChange={handleTextChange}
              multiline
              rows={3}
              placeholder="E.g., I'd love to have chili con carne one night"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Special Requirements (optional)"
              name="specialNotes"
              value={formData.specialNotes}
              onChange={handleTextChange}
              multiline
              rows={3}
              placeholder="E.g., Medication needs, allergies, accessibility requirements..."
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={submitting}
              sx={{ mt: 2 }}
            >
              {submitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Submit Visit Request'
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
}

VisitForm.propTypes = {
  onSuccess: PropTypes.func.isRequired
};