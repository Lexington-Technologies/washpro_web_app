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
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { apiController } from '../../axios';
import { useSnackStore } from '../../store';
import { useSnackbar } from 'notistack';

interface Document {
  id: string;
  displayName: string;
  description?: string;
  tags: string[];
  fileName: string;
  fileSize: number;
  uploadDate: string;
  mimeType: string;
}

interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  message?: string;
}

// Error alert component
const ErrorAlert = ({ message }: { message: string }) => (
  <Box sx={{ p: 3 }}>
    <Alert severity="error">{message}</Alert>
  </Box>
);

const KnowledgeBase: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { enqueueSnackbar } = useSnackbar()
  const [availableTags, setAvailableTags] = useState<string[]>([
    'Water Quality',
    'Sanitation',
    'Maintenance',
    'Reports',
    'Guidelines',
    'Training',
  ]);
  const [error, setError] = useState<Error | null>(null);

  const [formData, setFormData] = useState({
    displayName: '',
    description: '',
    tags: [] as string[],
    context: '',
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setFormData(prev => ({
        ...prev,
        displayName: file.name.split('.')[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      enqueueSnackbar({
        variant: 'error',
        message: 'Please select a file to upload'
      });
      return;
    }

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', selectedFile);
      formDataToSend.append('displayName', formData.displayName);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      
      const response = await apiController.post<{ data: ApiResponse }>('/ai-chat/files/upload', formDataToSend);
      
      // Add new document to the list
      setDocuments(prev => [...prev, newDocument]);
      
      enqueueSnackbar({
        variant: 'success',
        message: 'Document uploaded successfully'
      });
      handleCloseModal();
    } catch (error) {
      enqueueSnackbar({
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
      displayName: '',
      description: '',
      tags: [],
      context: '',
    });
  };

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await apiController.get<{ data: ApiResponse<Document[]> }>('/ai-chat/files');
      
      if (response.data && response.data.ok && response.data.data) {
        setDocuments(response.data.data);
        
        // Extract unique tags from documents to use as available tags
        const tagSet = new Set<string>();
        response.data.data.forEach((doc: Document) => {
          doc.tags?.forEach(tag => tagSet.add(tag));
        });
        
        if (tagSet.size > 0) {
          setAvailableTags(Array.from(tagSet));
        }
      } else {
        throw new Error(response.data?.message || 'Failed to fetch documents');
      }
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to fetch documents'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await apiController.delete<{ data: ApiResponse }>(`/ai-chat/files/${id}`);
      
      // Filter out the deleted document
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      
      enqueueSnackbar({
        variant: 'success',
        message: 'Document deleted successfully'
      });
    } catch (error) {
      enqueueSnackbar({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete document'
      });
    }
  };

  const handleDownload = async (id: string, fileName: string) => {
    try {
      // Using any type to bypass TypeScript's strict checking for axios response
      // This is a pragmatic approach when dealing with binary responses
      const response: any = await apiController.get(`/ai-chat/files/${id}`, {
        responseType: 'blob'
      });
      
      // Create a blob link to download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      
      // Append to html link element page
      document.body.appendChild(link);
      
      // Start download
      link.click();
      
      // Clean up and remove the link
      link.parentNode?.removeChild(link);
      
      setAlert({
        variant: 'success',
        message: 'File download started'
      });
    } catch (error) {
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to download file'
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

  if (isLoading && documents.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error instanceof Error) {
    return <ErrorAlert message={error.message} />;
  }

  return (
    <Box sx={{ backgroundColor: '#F1F1F5', minHeight: '100vh', p: 3 }}>
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
            {documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No documents found
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.displayName}</TableCell>
                  <TableCell>{doc.description || '-'}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {doc.tags && doc.tags.length > 0 ? doc.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{ bgcolor: '#e3f2fd', mb: 0.5 }}
                        />
                      )) : '-'}
                    </Stack>
                  </TableCell>
                  <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                  <TableCell>
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary"
                      onClick={() => handleDownload(doc.id, doc.fileName)}
                    >
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
                value={formData.displayName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, displayName: e.target.value }))
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