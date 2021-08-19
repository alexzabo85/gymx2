
import React, { useEffect, useState } from 'react'
import {
  Avatar,
  Card,
  CardHeader,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Checkbox,
  Typography,
  Box,
  Button,
} from '@material-ui/core'
import { red } from '@material-ui/core/colors';
// import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
// import SessionTable from './sessionTable'
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';

import { useAuth } from "./../util/auth.js";
import { Redirect } from 'react-router-dom';
import { useUser } from '../util/db.js';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
// import gymxDb from ('../db.json');

const gymxDb = require("../db.json");

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


function Spacer(props) {
  return <div className={props.className}></div>
}

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
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div" />
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


function EnhancedTableHead(props) {
  // eslint-disable-next-line 
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  // eslint-disable-next-line 
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const headCells = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Muscle', size: 'small' },
    { id: 'id', numeric: true, disablePadding: false, label: 'Device', size: 'small' },
    { id: 'id', numeric: true, disablePadding: false, label: 'intensity', size: 'small' },
    { id: 'pattern', numeric: true, disablePadding: false, label: 'Pattern', size: 'small' },
    { id: 'note', numeric: false, disablePadding: false, label: 'Note', size: 'small' },
  ];
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

// function createData(muscle, device, intensity, pattern, note) {
//   // pattern is a string in a form of A:B:C where A is set, B is repetitions, C is rest in seconds
//   // deviceId is a link
//   return { muscle, device, intensity, pattern, note };
// }


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

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  // onRequestSort: PropTypes.func.isRequired,
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};


function EnhancedTable(props) {
  const auth = useAuth();
  const classes = useStylesTable();
  // const [rows, setRows] = useState(auth.user.programSession[0] || []);
  const [rows, setRows] = useState(gymxDb.users[0].programSession[0]);


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
                        <TableCell align="right">{row.intensity}</TableCell>
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
          {/* <Button className={classes.completeButton} variant="contained" color="primary"
            onClick={() => { alert('Completed') }}
          >Session Completed
          </Button> */}
          <ProgressBar />
        </Box>
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </div>
  );
}


export default function ProgramPage(props) {
  const classes = useStyles();

  const auth = useAuth();
  auth.user = gymxDb.users[0];
  return (auth.user ?
    <>
      <Spacer className={classes.toolbar} />

      <Container maxWidth="sm">                             {/* user+program details */}
        <Card elevation={12}>                               {/* userdetails */}
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
            title={`${auth.user.name}`}  // "Alex Alexander (M)"
            subheader={`${auth.user.gender} ${auth.user.age}[Y] ${auth.user.height} ${auth.user.weight}`}  // "Alex Alexander (M)"
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
        <TableContainer component={Paper} elevation={8}>    {/* program details */}
          <Table aria-label="program details">
            <TableHead>
              <TableRow>
                {/* <TableCell colSpan={2} align='center' >{' '}</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(auth.user.programDetails || {})
                .map((name, idx) => (
                  <TableRow key={idx}>
                    <TableCell component="th" scope="row">
                      <b>{name}</b>
                    </TableCell>
                    <TableCell align="right">{auth.user.programDetails[name]}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Spacer className={classes.toolbar} />

      <Container maxWidth="md">                             {/* program details */}

        <EnhancedTable />


      </Container>
      {/* <SessionTable2></SessionTable2> */}
    </> : <>
      {/* <Redirect to='/auth/signin' /> */}
    </>
  )
}

/** progress bar functions */
/** ********************** */
const useStylesProgressBar = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  marginBottom: theme.spacing(10)
}));

function getSteps() {
  return ['A', 'B', 'C'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return 'Ready? Session A';
    case 1:
      return 'OK! Session B';
    case 2:
      return 'You Rock! Session C';
    default:
      return 'Unknown step';
  }
}

function ProgressBar() {
  const classes = useStylesProgressBar();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    < div className={classes.root} >
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          // if (isStepOptional(index)) {
          //   labelProps.optional = <Typography variant="caption">Optional</Typography>;
          // }
          // if (isStepSkipped(index)) {
          //   stepProps.completed = false;
          // }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>

            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}

/** ********************** */

