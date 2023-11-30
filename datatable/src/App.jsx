import React, {useState, useEffect} from 'react'
import DataTable from 'react-data-table-component';
import axios from 'axios';

const columns = [
    {
        name: 'ID',
        selector: row => row.id,
    },
    {
        name: 'Name',
        selector: row => row.name,
    },
    {
        name: 'Detail',
        selector: row => row.detail,
    },
    {
        name: 'Cover Image',
        selector: row => row.coverimage,
    },
    {
        name: 'Latitude',
        selector: row => row.latitude,
    },
    {
        name: 'Longtitude',
        selector: row => row.longitude,
    },
    
];

export default function App() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    //import.meta.env.VITE_API+
    console.log(page, ' : ', perPage);
    const response = await axios.get(`http://192.168.99.100:3001/api/attractions?page=${page}&per_page=${perPage}`)
    console.log(response.data);
    setData(response.data.data);
    setPerPage(response.data.total);
    setLoading(false);
  }
  
  const handlePageChange = page => {
    setPage(page);
  }

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  }

  useEffect(() => {
    fetchData();
  },[page, perPage])

  return (
    <>
      <DataTable
            title="Attraction"
            columns={columns}
            data={data}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerpage={handlePerRowsChange}
            onChangePage={handlePageChange}
        />
    </>
  )
}
