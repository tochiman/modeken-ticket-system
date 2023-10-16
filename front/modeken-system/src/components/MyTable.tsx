import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'id', headerName: '発券番号', minWidth: 30, sortable: false },
  { field: 'created_time', headerName: '発券時間', minWidth: 30, sortable: false },
];

const rows = [
  { id: 'A101', created_time: '14:00'},
  { id: 'A102', created_time: '14:00'},
  { id: 'A103', created_time: '14:00'},
  { id: 'A104', created_time: '14:00'},
  { id: 'A105', created_time: '14:00'},
  { id: 'A106', created_time: '14:00'},
  { id: 'A107', created_time: '14:00'},
  { id: 'A108', created_time: '14:00'},
  { id: 'A109', created_time: '14:00'},
  { id: 'A111', created_time: '14:00'},
  { id: 'A112', created_time: '14:00'},
  { id: 'A113', created_time: '14:00'},
  { id: 'A114', created_time: '14:00'},
  { id: 'A115', created_time: '14:00'},
  { id: 'A116', created_time: '14:00'},
  { id: 'A117', created_time: '14:00'},
  { id: 'A118', created_time: '14:00'},
  { id: 'A119', created_time: '14:00'},
  { id: 'A121', created_time: '14:00'},
  { id: 'A122', created_time: '14:00'},
  { id: 'A123', created_time: '14:00'},
  { id: 'A124', created_time: '14:00'},
  { id: 'A125', created_time: '14:00'},
  { id: 'A126', created_time: '14:00'},
  { id: 'A127', created_time: '14:00'},
  { id: 'A128', created_time: '14:00'},
  { id: 'A129', created_time: '14:00'},
];

export default function DataTable() {
  return (
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10]}
        checkboxSelection
        disableRowSelectionOnClick
      />
  );
}
