// import React from "react";
// import HeroSection2 from "./../components/HeroSection2";
// import TeamBiosSection from "./../components/TeamBiosSection";

// function Gymx(props) {
//   return (
//     <>
//       <HeroSection2
//         bgColor="primary"
//         size="large"
//         bgImage="https://source.unsplash.com/FyD3OWBuXnY/1600x800"
//         bgImageOpacity={0.2}
//         title="GymX"
//         subtitle="Become Productive"
//       />
//       <TeamBiosSection
//         bgColor="default"
//         size="medium"
//         bgImage=""
//         bgImageOpacity={1}
//         title="Meet the Team"
//         subtitle=""
//       />
//     </>
//   );
// }

// export default Gymx;


import React, { useEffect } from 'react'
import {
  Avatar,
  Card,
  CardHeader,
  // CardMedia,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { red } from '@material-ui/core/colors';
// import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
// import SessionTable from './sessionTable'


// import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
// import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { Box, Button } from '@material-ui/core';

import { useAuth } from "./../util/auth.js";


// import MyAppBar from '../components/MyAppBar';
// image="../../public/logo192.png" 
// import logo from '../../public/logo192.png'; // Tell webpack this JS file uses this image

// import authHelper from './auth-helper';

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  table: {
    minWidth: 400,
  },
  avatar: {
    backgroundColor: red[500],
  },

}));

function Spacer(props) {
  return <div className={props.className}></div>
}

export default function ProgramPage() {
  const classes = useStyles();

  const auth = useAuth();


  function createData(name, value) {
    return { name, value };
  }

  const programDetails = [
    createData('Type', 'Mass/Aerobics'),
    createData('Progress', '78%'),
    createData('Started Date', '15/1/21'),
    createData('Completion Date', '15/3/21'),
    createData('Weekly Sessions', 'A/B/C'),
    createData('Trainer', 'Alex.Z'),
  ];

  const traineeDetails = {
    name: "Alex Alex",
    gender: "Male",
    age: "35",
    weight: "82",
    Height: "178",
  };

  console.count('ProgramPage')
  console.log(auth)
  // useEffect(() => {
  // });


  return (
    <>
      {/* <MyAppBar title='GymX - Plan' /> */}
      <Spacer className={classes.toolbar} />

      <p>{auth.user.email}</p>

      <Container maxWidth="sm">  {/* user+program details */}
        <Card elevation={12}>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar}>
                A
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={`${traineeDetails.name}`}  // "Alex Alexander (M)"
            subheader={`${traineeDetails.gender}, ${traineeDetails.age}[Years], ${traineeDetails.Height}/${traineeDetails.weight}[CM/KG]`}  // "Alex Alexander (M)"
          // subheader={`${auth.user.email}, ${traineeDetails.age}[Years], ${traineeDetails.Height}/${traineeDetails.weight}[CM/KG]`}  // "Alex Alexander (M)"
          // subheader="35[Y] 75/178 [KG/CM]  "
          />
          {/* <CardMedia
            className={classes.media}
            // image="/static/images/cards/paella.jpg"
            // src
            // image={logo}
            // image="../../../public/logo192.png" import logo from './logo.png'; // Tell webpack this JS file uses this image

            title="Paella dish"
          /> */}
        </Card>
        <Spacer className={classes.toolbar} />
        <TableContainer component={Paper} elevation={8}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {/* <TableCell colSpan={2} align='center' >{' '}</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {programDetails.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.value}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Spacer className={classes.toolbar} />

      <Container maxWidth="md">
        <EnhancedTable />
      </Container>
      {/* <SessionTable2></SessionTable2> */}
    </>
  )
}



function createData(muscle, device, pattern, note) {
  // pattern is a string in a form of A:B:C where A is set, B is repetitions, C is rest in seconds
  // deviceId is a link
  return { muscle, device, pattern, note };
}


const rows = [
  createData('Chest', 15, '3x5_60', 'just do it'),
  createData('Chest', 17, '3x5_60', 'just do it'),
  createData('Arms', 16, '3x5_60', 'just do it again'),
  createData('Arms', 16, '3x5_60', 'just do it again'),
  createData('Legs', 7, '3x5_60', 'just do it'),
  createData('Legs', 7, '3x5_60', 'just do it'),
  createData('Arms', 16, '3x5_60', 'just do it again'),
  createData('Arms', 16, '3x5_60', 'just do it again'),
  createData('Chest', 15, '3x5_60', 'just do it'),
  createData('Chest', 17, '3x5_60', 'just do it'),
  createData('Arms', 16, '3x5_60', 'just do it again'),
  createData('Arms', 16, '3x5_60', 'just do it again'),

];

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Muscle', size: 'small' },
  { id: 'id', numeric: true, disablePadding: false, label: 'Device', size: 'small' },
  { id: 'pattern', numeric: true, disablePadding: false, label: 'Pattern', size: 'small' },
  { id: 'note', numeric: false, disablePadding: false, label: 'Note', size: 'small' },
];


const useStylesTable = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  completeButton: {
    // width: '60%',
    margin: theme.spacing(2),
    justifyContent: 'center'

  },
}));

function EnhancedTable() {
  const classes = useStylesTable();

  const [selected, setSelected] = React.useState([]);
  // eslint-disable-next-line 
  const [order, setOrder] = React.useState('asc');
  // eslint-disable-next-line 
  const [orderBy, setOrderBy] = React.useState('calories');
  // eslint-disable-next-line 
  const [page, setPage] = React.useState(0);
  // eslint-disable-next-line 
  const [dense, setDense] = React.useState(true);
  // eslint-disable-next-line 
  const [rowsPerPage, setRowsPerPage] = React.useState(rows.length);


  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              // onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {
                // rows
                stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(index);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, index)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row" padding="none">
                          {row.muscle}
                        </TableCell>
                        <TableCell align="right">{row.device}</TableCell>
                        <TableCell align="right">{row.pattern}</TableCell>
                        <TableCell align="left">{row.note}</TableCell>
                        {/* <TableCell align="right">{row.protein}</TableCell> */}
                      </TableRow>
                    );
                  })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
        <Box textAlign='center'>
          <Button className={classes.completeButton} variant="contained" color="primary"
            onClick={() => { alert('Completed') }}
          >Session Completed</Button>
        </Box>
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </div>
  );
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  // eslint-disable-next-line 
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  // eslint-disable-next-line 
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
            disabled
          />
        </TableCell>
        {headCells.map((headCell, idx) => (
          <TableCell
            key={idx}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            size={headCell.size}
          >
            {headCell.label}

            {/* <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel> */}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  // onRequestSort: PropTypes.func.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Exercises
        </Typography>
      )}

      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )} */}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

