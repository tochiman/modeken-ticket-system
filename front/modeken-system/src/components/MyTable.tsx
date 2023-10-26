import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {FC, useEffect} from 'react';

const columns: GridColDef[] = [
  { field: 'item_number', headerName: '発券番号', minWidth: 30, sortable: false },
  { field: 'created_time', headerName: '発券時間', minWidth: 30, sortable: false },
];

const DataTable:FC<any> = ({rows}) => {
  if (rows !== undefined){
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
          getRowId={(row:any) => row.item_number + row.created_time}
        />
    );
  } else {
    return (null)
  }
}

export default DataTable;