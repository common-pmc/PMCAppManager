import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; 
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import {
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
  Stack,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PaginationControls from '../components/PaginationControls';

const FileList = () => {
  const navigate = useNavigate ();

  const {
    data: files,
    meta,
    loading,
    error,
    params,
    setLimit,
    setSearch,
    setPage,
    fetchNow,
  } = usePaginatedFetch('/admin/files', {page: 1, limit: 10}, [], {
    debounceMs: 300,
  });

  const handleSearch = e => {
    if (e.key === 'Enter') {
      const s = e.target.value.trim ();
      fetchNow ({search: s, page: 1});
    }
  }

  const handlePageChange = page => {
    setPage (page);
    fetchNow ({page, limit: params.limit, search: params.search});
  }

  const handleLimitChange = limit => {
    setLimit (limit);
    fetchNow ({limit, page: 1, search: params.search});
  }

    const handleDownload = async (fileId, originalName) => {
    try {
      const response = await axiosInstance.get (`/files/${fileId}/download`, {
        withCredentials: true,
        responseType: 'blob',
      });
      // Create a link to download the file
      const downloadUrl = window.URL.createObjectURL (
        new Blob ([response.data])
      );
      const link = document.createElement ('a');
      link.href = downloadUrl;
      link.setAttribute ('download', originalName || 'file');
      document.body.appendChild (link);
      link.click ();
      link.parentNode.removeChild (link);

      // Remove the object URL after download
      window.URL.revokeObjectURL (downloadUrl);
    } catch (error) {
      console.error ('Грешка при изтегляне на файла:', error);
      alert ('Неуспешно изтегляне на файла. Моля опитайте по-късно.');
    }
  };

  return (
    <Container className="max-w-5xl mx-auto mt-8">
      <Stack
        direction='row'
        justifyContent='flex-start'
        mb={2}
      >
        <Button
          variant='outlined'
          startIcon={<ArrowBackIcon />}
          sx={{minWidth: '100px'}}
          onClick={() => navigate ('/admin/dashboard')}
        >
          Обратно към списъка с потребители
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
      {loading && <CircularProgress sx={{mb: 2}} />}

      <Stack direction='column' alignItems='center' justifyContent='space-between' className='mb-4'>
        <Typography
          variant='h4'
          className='text-center flex-1'
        >
          Качени файлове
        </Typography>
        <TextField 
          size='small'
          label='Търси по име на файл...'
          variant='outlined'
          sx={{mb: 3}}
          value={params.search || ''}
          onChange={e => setSearch (e.target.value)}
          onKeyDown={handleSearch}
        />
      </Stack>

      {files.length === 0
        ? <Typography className="text-center text-gray-600">
            Няма качени файлове
          </Typography>
        : <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Име на файла</TableCell>
                  <TableCell>Фирма</TableCell>
                  <TableCell>Отдел</TableCell>
                  <TableCell>Качил</TableCell>
                  <TableCell>Последно изтеглен от</TableCell>
                  <TableCell>Описание</TableCell>
                  <TableCell>Дата на качване</TableCell>
                  <TableCell>Свали файла</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map (file => (
                  <TableRow key={file.id}>
                    <TableCell>{file.filename}</TableCell>
                    <TableCell>{file.company?.companyName || '-'}</TableCell>
                    <TableCell>{file.department?.departmentName || '-'}</TableCell>
                    <TableCell>{file.uploadedBy?.email || '-' }</TableCell>
                    <TableCell>{file.lastDownloadedBy?.email || '-' }</TableCell>
                    <TableCell>{file.description || '-'}</TableCell>
                    <TableCell>
                      {file.createdAt ? new Date (file.createdAt).toLocaleDateString () : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDownload (file.id, file.filename)}
                      >
                        Свали
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>}

          <PaginationControls 
            meta={{
              page: Number (params.page) || Number (meta.page) || 1,
              pageCount: Number (meta.pageCount) || 1,
              pageSize: Number (params.limit) || Number (meta.pageSize) || 10,
              total: Number (meta.total) || 0,
            }}
            onPageChange={p => {
              console.log("[FileList] onPageChange:", p);
              handlePageChange(p);
            }}
            onLimitChange={l => {
              console.log("[FileList] onLimitChange:", l);
              handleLimitChange(l);
            }}
          />
    </Container>
  );
};

export default FileList;
