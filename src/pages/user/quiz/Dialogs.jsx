import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Button
} from "@mui/material";

const ConfirmDialog = ({ open, title, message, type, onClose, onConfirm, NTA }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }
      }}
    >
      <DialogTitle 
        style={{ 
          backgroundColor: NTA.primary, 
          color: NTA.white,
          fontWeight: 'bold',
          fontSize: '18px',
          paddingBottom: '16px'
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent style={{ paddingTop: '24px', paddingBottom: '24px' }}>
        <p style={{ fontSize: '15px', color: NTA.text, lineHeight: '1.6' }}>
          {message}
        </p>
      </DialogContent>
      <DialogActions style={{ padding: '16px 24px', gap: '8px' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          style={{ color: NTA.primary, borderColor: NTA.primary }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          style={{ 
            backgroundColor: type === 'warning' ? NTA.warning : NTA.danger,
            color: NTA.white
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const SnackbarNotification = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        style={{
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '8px'
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

const SummaryDialog = ({ open, sections, responses, questions, onClose, onConfirm, NTA }) => {
  const getSummary = () => {
    return sections.map(sec => {
      const secQs = questions.filter(q => q.section === sec.id);
      let answered = 0, notAnswered = 0, marked = 0, answeredMarked = 0, notVisited = 0;

      secQs.forEach(q => {
        const resp = responses[q.id];
        const isAnswered = Boolean(resp?.selected_options?.length);
        const isMarked = Boolean(resp?.marked_for_review);

        if (!resp || resp.visit_status === 'NOT_VISITED') notVisited++;
        else if (isMarked && isAnswered) answeredMarked++;
        else if (isMarked) marked++;
        else if (isAnswered) answered++;
        else notAnswered++;
      });

      return {
        name: sec.name,
        total: secQs.length,
        answered,
        notAnswered,
        marked,
        answeredMarked,
        notVisited
      };
    });
  };

  const summary = getSummary();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle style={{ backgroundColor: '#147EB3', color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
        Exam Summary
      </DialogTitle>
      <DialogContent style={{ padding: '20px' }}>
        <table className="w-full border-collapse border border-gray-300 text-[12px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Section Name</th>
              <th className="border border-gray-300 p-2">No. of Questions</th>
              <th className="border border-gray-300 p-2">Answered</th>
              <th className="border border-gray-300 p-2">Not Answered</th>
              <th className="border border-gray-300 p-2">Marked for Review</th>
              <th className="border border-gray-300 p-2">Answered & Marked for Review</th>
              <th className="border border-gray-300 p-2">Not Visited</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((row, idx) => (
              <tr key={idx} className="text-center">
                <td className="border border-gray-300 p-2 text-left font-bold">{row.name}</td>
                <td className="border border-gray-300 p-2">{row.total}</td>
                <td className="border border-gray-300 p-2">{row.answered}</td>
                <td className="border border-gray-300 p-2">{row.notAnswered}</td>
                <td className="border border-gray-300 p-2">{row.marked}</td>
                <td className="border border-gray-300 p-2">{row.answeredMarked}</td>
                <td className="border border-gray-300 p-2">{row.notVisited}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-6 text-sm font-bold text-center text-gray-700">
          Are you sure you want to submit the group of questions?
        </p>
      </DialogContent>
      <DialogActions style={{ padding: '16px', justifyContent: 'center', gap: '20px' }}>
        <Button onClick={onConfirm} variant="contained" style={{ backgroundColor: '#147EB3', width: '80px' }}>Yes</Button>
        <Button onClick={onClose} variant="contained" style={{ backgroundColor: '#147EB3', width: '80px' }}>No</Button>
      </DialogActions>
    </Dialog>
  );
};

export { ConfirmDialog, SnackbarNotification, SummaryDialog };
