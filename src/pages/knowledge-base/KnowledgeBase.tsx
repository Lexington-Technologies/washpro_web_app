import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  Chip,
  IconButton,
  Stack,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { apiController } from '../../axios';
import { useSnackStore } from '../../store';

interface Document {
  id: string;
  title: string;
  description: string;
  tags: string[];
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  context: string;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Water Quality Guidelines 2024',
    description: 'Comprehensive guidelines for water quality monitoring and testing procedures',
    tags: ['Water Quality', 'Guidelines', 'Training'],
    fileName: 'water-quality-guidelines-2024.pdf',
    fileSize: 2457600, // 2.4 MB
    uploadDate: new Date('2024-01-15'),
    context: 'Latest version of water quality guidelines including new testing parameters',
  },
  {
    id: '2',
    title: 'Sanitation Facility Maintenance Manual',
    description: 'Standard operating procedures for maintaining sanitation facilities',
    tags: ['Sanitation', 'Maintenance', 'Guidelines'],
    fileName: 'sanitation-maintenance-manual.pdf',
    fileSize: 5242880, // 5 MB
    uploadDate: new Date('2024-01-10'),
    context: 'Updated maintenance procedures for all types of sanitation facilities',
  },
  {
    id: '3',
    title: 'Q4 2023 Water Quality Report',
    description: 'Quarterly report on water quality metrics across all monitored sources',
    tags: ['Water Quality', 'Reports'],
    fileName: 'q4-2023-water-quality-report.docx',
    fileSize: 1048576, // 1 MB
    uploadDate: new Date('2023-12-31'),
    context: 'End of year water quality analysis and recommendations',
  },
  {
    id: '4',
    title: 'Field Staff Training Materials',
    description: 'Training materials for new field staff on data collection and monitoring',
    tags: ['Training', 'Guidelines'],
    fileName: 'field-staff-training.pdf',
    fileSize: 3145728, // 3 MB
    uploadDate: new Date('2023-12-15'),
    context: 'Complete training package for field staff onboarding',
  },
  {
    id: '5',
    title: 'Emergency Response Protocol',
    description: 'Procedures for handling water and sanitation emergencies',
    tags: ['Guidelines', 'Maintenance'],
    fileName: 'emergency-response-protocol.pdf',
    fileSize: 1572864, // 1.5 MB
    uploadDate: new Date('2023-12-01'),
    context: 'Updated emergency protocols including new communication channels',
  },
];

const KnowledgeBase: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { setAlert } = useSnackStore();
  const [availableTags, setAvailableTags] = useState<string[]>([
    'Water Quality',
    'Sanitation',
    'Maintenance',
    'Reports',
    'Guidelines',
    'Training',
  ]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    context: '',
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setFormData(prev => ({
        ...prev,
        title: event.target.files[0].name.split('.')[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setAlert({
        variant: 'error',
        message: 'Please select a file to upload'
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new document with mock data
      const newDocument: Document = {
        id: (documents.length + 1).toString(),
        title: formData.title,
        description: formData.description,
        tags: formData.tags,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        uploadDate: new Date(),
        context: formData.context,
      };
      
      // Add new document to the list
      setDocuments(prev => [...prev, newDocument]);
      
      setAlert({
        variant: 'success',
        message: 'Document uploaded successfully'
      });
      handleCloseModal();
    } catch (error) {
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to upload document'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFile(null);
    setFormData({
      title: '',
      description: '',
      tags: [],
      context: '',
    });
  };

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data instead of API call
      setDocuments(mockDocuments);
    } catch (error) {
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch documents'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter out the deleted document
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      
      setAlert({
        variant: 'success',
        message: 'Document deleted successfully'
      });
    } catch (error) {
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete document'
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600 }}>
          Knowledge Base
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
          sx={{
            bgcolor: '#25306B',
            '&:hover': { bgcolor: '#1a1f4b' }
          }}
        >
          Upload Document
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>File Size</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No documents found
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>{doc.description}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {doc.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{ bgcolor: '#e3f2fd' }}
                        />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                  <TableCell>
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary">
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Upload Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="upload-document-modal"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 3 }}>
            Upload Document
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { borderColor: '#25306B' },
                }}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  hidden
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.txt"
                />
                {selectedFile ? (
                  <Typography>{selectedFile.name}</Typography>
                ) : (
                  <>
                    <UploadIcon sx={{ fontSize: 48, color: '#666' }} />
                    <Typography>
                      Click to select or drag and drop your file here
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Supported formats: PDF, DOC, DOCX, TXT
                    </Typography>
                  </>
                )}
              </Box>

              <TextField
                label="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />

              <TextField
                label="Description"
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                required
              />

              <Autocomplete
                multiple
                freeSolo
                options={availableTags}
                value={formData.tags}
                onChange={(_, newValue) =>
                  setFormData((prev) => ({ ...prev, tags: newValue }))
                }
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Tags" placeholder="Add tags" />
                )}
              />

              <TextField
                label="Context/Notes"
                multiline
                rows={3}
                value={formData.context}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, context: e.target.value }))
                }
                helperText="Add any relevant context or notes about this document"
              />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading || !selectedFile}
                  sx={{
                    bgcolor: '#25306B',
                    '&:hover': { bgcolor: '#1a1f4b' }
                  }}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Upload'}
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default KnowledgeBase; 