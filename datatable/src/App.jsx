import React, {useState, useEffect} from 'react'
import DataTable from 'react-data-table-component';
import axios from 'axios';

const columns = [
    {
        name: 'ID',
        selector: row => row.id,
        sortable: true,
        width: '50px'
    },
    {
        name: 'Cover Image',
        cell: row => <img src={row.coverimage} width={100} alt={row.name} />,
        width: '150px'
    },
    {
        name: 'Name',
        selector: row => row.name,
        sortable: true,
        width: '150px'
    },
    {
        name: 'Detail',
        selector: row => row.detail,
        width: '750px'
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
  const [sortColumn, setSortColumn] = useState('');
  const [sortColumnDir, setSortColumnDir] = useState('');
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    var url = `${import.meta.env.VITE_API}/api/attractions?page=${page}&per_page=${perPage}`;
    if (search) {
	url += `&search=${search}`;
    }
    if (sortColumn) {
	url += `&sort_column=${sortColumn}&sort_direction=${sortColumnDir}`;
    }
    //console.log(url);
    const response = await axios.get(url);
    //console.log(response.data);
    setData(response.data.data);
    setTotalRows(response.data.total);
    setLoading(false);
  }
  
  const handlePageChange = page => {
    setPage(page);
  }

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  }

  const handleSort = async (column, sortDirection) => {
    setSortColumn(column.name);
    setSortColumnDir(sortDirection);
  }

  const handleSearchChange = (event) => {
	setSearch(event.target.value);
  }

  const handleSearchSubmit = (event) => {
	event.preventDefault();
	fetchData();
  }

  useEffect(() => {
    fetchData();
  }, [page, perPage, sortColumn, sortColumnDir] );

  return (
    <>
      <form onSubmit={handleSearchSubmit}>
	<label>
	Search:
	<input type="text" name="search" onChange={handleSearchChange} />
	</label>
	<input type="submit" value="Submit" />
      </form>
      <DataTable
            title="Attraction"
            columns={columns}
            data={data}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            onSort={handleSort}
        />
    </>
  )
}
